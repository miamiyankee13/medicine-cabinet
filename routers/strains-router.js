'use strict'
//Import dependencies
const express = require('express');
const bodyParser = require('body-parser');

//Declare JSON parser
const jsonParser = bodyParser.json();

//Import modules
const { Strain, User } = require('../models');

//Create router instance
const router = express.Router();

//GET route handler for /strains
router.get('/', (req, res) => {
    Strain.find().sort({ name: 1 }).then(strains => {
        res.json({ strains: strains});
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;