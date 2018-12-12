'use strict'
//Import dependencies
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//Configure mongoose to use ES6 promises
mongoose.Promise = global.Promise;  

//Import modules
const { PORT, DATABASE_URL } = require('./config');  

//Declare new app instance
const app = express();

//Log all requests
app.use(morgan('common'));

//Enable CORS
app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    next();
});

//Serve static files from public folder
app.use(express.static('public'));

//Declare global server object
let server;

//Start server and return a Promise
function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(
        databaseUrl, { useNewUrlParser: true },
        err => {
          if (err) {
            return reject(err);
          }
          server = app
            .listen(port, () => {
              console.log(`Your app is listening on port ${port}`);
              resolve();
            })
            .on("error", err => {
              mongoose.disconnect();
              reject(err);
            });
        }
      );
    });
}

//Close server and return a Promise
function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
}

//Allows access to 'node server.js' & other test files if imported/exported
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };