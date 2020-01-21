/*
 * This file sets up the node js server and reads the
 * the possible requests in the routes folder.
 */
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fileReader = require("fs");
const app = express();

const port = 8060;

// set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// allow request from different ports
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

// set up access logger / request calls
app.use(
  logger("common", {
    stream: fileReader.createWriteStream("./access.log", { flags: "a" })
  })
);
app.use(logger("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to root!");
});

// read routes folder to get accessible requests
fileReader.readdir("./routes", (err, files) => {
  files.forEach(file => {
    app.use("/", require("./routes/" + file));
  });
});

// start server with specified port
app.listen(port, () => {
  console.log("Server running on port " + port);
});
