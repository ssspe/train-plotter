const express = require("express");
const router = express.Router();
var stompit = require("stompit");
var async = require("async");

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
                                    // (there are no other servers at this time)
};

var connectionManager = new stompit.ConnectFailover([connectOptions], reconnectOptions);

function requestTrainMovement() {
  connectionManager.connect(function (error, client, reconnect) {
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
               async.each(data,
                   function(item, next) {
                       // Look for Train Activation messages (msg_type 0001)
                       if (item.header && item.header.msg_type == "0001") {
                           console.log(
                               "Train",
                               item.body.train_id,
                               "activated at stanox",
                               item.body.tp_origin_stanox ? item.body.tp_origin_stanox : item.body.sched_origin_stanox
                           );
                       }
                       next();
                   }
               );
           }
           client.ack(message); // Send ACK frame to server
       });
   });
});
}

router.get("/listOfTrains", (req, res) => {
  // requestTrainMovement(function(val) {
  //   var json = { 'data': val };
  //   return res.json({ success: true, data: json });
  // });
  requestTrainMovement();
});


module.exports = {router, requestTrainMovement};
