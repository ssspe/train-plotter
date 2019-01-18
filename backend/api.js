const express = require("express");
const router = express.Router();
var stompit = require("stompit");
var async = require("async");
var fs = require('fs');
// Connect options with standard headers
var connectOptions = {
  "host": "datafeeds.networkrail.co.uk",
  "port": 61618,
  "connectHeaders": {
    "heart-beat": "15000,15000",// hear-beat of 15 seconds
    "client-id": "0f77adfe-b9ae-4552-bb30-370ea149b4ba",            // request a durable subscription - set this to the login name you use to subscribe
    "host": "/",
    "login": "spencer112233@hotmail.co.uk",                // your username
    "passcode": "Tennisball_1"              // your password
  }
};

// Reconnect management for stompit client
var reconnectOptions = {
  "initialReconnectDelay": 10,    // milliseconds delay of the first reconnect
  "maxReconnectDelay": 30000,     // maximum milliseconds delay of any reconnect
  "useExponentialBackOff": true,  // exponential increase in reconnect delay
  "maxReconnects": 30,            // maximum number of failed reconnects consecutively
  "randomize": false              // randomly choose a server to use when reconnecting
};

var connectionManager = new stompit.ConnectFailover([connectOptions], reconnectOptions);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function requestTrainMovement() {
  MongoClient.connect(url, function(err, db) {
    console.log("Mongo Connected");
    connectionManager.connect(function (error, client, reconnect) {
      console.log("Connected to train db");
      if (error) {
        console.log("Terminal error, gave up reconnecting");
        return;
      }

      client.on("error", function (error) {
        console.log("Connection lost. Reconnecting...");
        reconnect();
      });

      var headers = {
        "destination": "/topic/TRAIN_MVT_EK_TOC",           // subscribe for a destination to which messages are sent
        "activemq.subscriptionName": "somename-train_mvt",   // request a durable subscription - set this to an unique string for each feed
        "ack": "client-individual"                           // the client will send ACK frames individually for each message processed
      };

      client.subscribe(headers, function (error, message) {
        if (error) {
          console.log("Subscription failed:", error.message);
          return;
        }
        message.readString("utf-8", function (error, body) {
          if (error) {
            console.log("Failed to read a message", error);
            return;
          }
          if (body) {
            var data;
            try {
              data = JSON.parse(body);
            } catch (e) {
              console.log("Failed to parse JSON", e);
              return;
            }
            async.each(
              data,
              function(item, next) {
                // Look for Train Activation messages (msg_type 0001)
                if (item.header && item.header.msg_type == "0003") {
                  if (err) throw err;
                  stanoxToLocation(item.body.loc_stanox, function(data) {
                    var current_journey = data;
                    stanoxToLocation(item.body.next_report_stanox, function(second_journey) {
                      getCoordinates(current_journey, first_coord => {
                        getCoordinates(second_journey, second_coord => {
                          var dbo = db.db("TrainMovement");
                          var myquery = { train_descriptor: item.body.train_id };
                          var newvalues = {
                            $set: {
                              current_location_coords: first_coord,
                              next_location_coords:  second_coord,
                              current_location: current_journey,
                              next_location: second_journey,
                              status: item.body.variation_status,
                              arrival_time: item.body.actual_timestamp,
                              planned_event_type: item.body.planned_event_type
                            }
                          };
                          dbo.collection("trains").update(myquery, newvalues, {upsert: true}, function(err, res) {
                            if (err) throw err;
                          });
                        });
                      });
                    });
                  });
                }
                next();
              }
            );
          }
          client.ack(message); // Send ACK frame to server
        });
      });
    });
  });
}

function getCoordinates(location, callback) {
  const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
  const baseClient = mbxGeocoding({ accessToken: "pk.eyJ1Ijoic3NzcGUiLCJhIjoiY2pxcDNkZWluMDFoazN4dGd6bTY3bnA1ayJ9.9vYYYBBh2scR2shTbCUHFg" });
  baseClient.forwardGeocode({
    query: location,
    countries: ['gb'],
    limit: 100
  })
  .send()
  .then(function (response)  {
    if (response && response.body && response.body.features && response.body.features.length) {
      var feature = response.body.features[0];
      response.body.features.forEach(feature => {
        if (feature.place_name.includes("Railway") || feature.place_name.includes("Underground") || feature.place_name.includes("Overground")) {
          callback(feature.geometry.coordinates);
        }
      })
    }
  });
}

function getTrainInfo(train_id, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TrainMovement");
    var query = { train_descriptor: train_id }
    var stream = dbo.collection("trains").find(query).stream();
    stream.on('data', function(doc) {
      callback(doc);
    });
    stream.on('error', function(err) {
      console.log(err);
    });
    stream.on('end', function() {
      console.log('All done!');
    });
  });
}

function getAllTrainInfo(callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TrainMovement");
    var array = [];
    var stream = dbo.collection("trains").find().stream();
    stream.on('data', function(doc) {
      array.push(doc);
    });
    stream.on('error', function(err) {
      console.log(err);
    });
    stream.on('end', function() {
      callback(array);
      console.log('All done!');
    });
  });
}

function getListOfTrains(callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TrainMovement");
    var array = []
    var stream = dbo.collection("trains").find().stream();
    stream.on('data', function(doc) {
      array.push({ value: doc.train_descriptor, label: doc.train_descriptor });
    });
    stream.on('error', function(err) {
      console.log(err);
    });
    stream.on('end', function() {
      console.log('All done!');
      callback(array);
    });
  });
}

function stanoxToLocation(stanox, callback) {
  fs.readFile("./static/data.json", {encoding: 'utf-8'}, function(err,data){
    if (!err) {
      JSON.parse(data).forEach(function(trainInfo) {
        if (trainInfo.stanox === stanox) {
          callback(trainInfo.city);
        }
      });
    } else {
      console.log(err);
    }
  });
}

router.get("/trainInfo", (req, res) => {
  getTrainInfo(req.query.train_id, function(data) {
    return res.json({ success: true, data: data });
  });
});

router.get("/allTrainInfo", (req, res) => {
  getAllTrainInfo(function(data) {
    return res.json({ success: true, data: data.splice(0, 20) });
  });
});

router.get("/listOfTrains", (req, res) => {
  getListOfTrains(function(data) {
    return res.json({ success: true, data: data });
  });
});

module.exports = {router, requestTrainMovement};
