const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const request = require('request');
const https = require("https");
const api = require("./api");
const API_PORT = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", api.router);

app.listen(API_PORT, function () {
  // Once a day get the git repos
  api.requestTrainMovement();
});
