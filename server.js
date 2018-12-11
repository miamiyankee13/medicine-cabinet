'use strict'
//Import dependencies
const express = require('express');
const morgan = require('morgan');

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

//Open port for requsts
app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});