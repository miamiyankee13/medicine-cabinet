'use strict'
//Import dependencies
const express = require('express');
const bodyParser = require('body-parser');

//Declare JSON parser
const jsonParser = bodyParser.json();

//Import modules
const { User } = require('../models');

//Create router instance
const router = express.Router();

