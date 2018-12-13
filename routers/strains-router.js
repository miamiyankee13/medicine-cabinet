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
//-find all strains, sort by name, & send json data
router.get('/', (req, res) => {
    Strain.find().sort({ name: 1 }).then(strains => {
        res.json({ strains: strains});
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

//GET route handler for /strains/:id
//-find individual strain by id & send json data
router.get('/:id', (req, res) => {
    Strain.findById(req.params.id).then(strain => {
        res.json(strain);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

//POST route handler for /strains
//-validate request body
//-create strain & send json response
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['name', 'type', 'description', 'flavor'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Strain.create({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        flavor: req.body.flavor
    }).then(strain => {
        res.status(201).json(strain);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;