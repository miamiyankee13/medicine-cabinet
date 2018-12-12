'use strict'
//Import dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

//Import modules
const { Strain, User } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

//Enable expect style syntax
const expect = chai.expect;

//Enable use of chai-http testing methods
chai.use(chaiHttp);

//Create function that returns object of random strain data
function generateStrainData() {
    return {
        name: faker.lorem.words(),
        type: faker.lorem.word(),
        description: faker.lorem.sentence(),
        flavor: faker.lorem.word()
    }
}

//Add 2 randomly generated strains to DB
function seedStrainData() {
    console.info('Seeding strain data');
    const seedData = [];

    for (let i = 0; i < 2; i++) {
        seedData.push(generateStrainData());
    }

    return Strain.insertMany(seedData);
}

//Delete entire DB
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

//Indicate entity being tested
describe('/strains API resource', function() {

    //Activate server before tests run
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    //Delete test database & seed with new data before each test
    beforeEach(function() {
        tearDownDb();
        return seedStrainData();
    });

    //Close server after tests run
    after(function() {
        return closeServer();
    });

    //Indicate entity being tested
    describe('GET endpoint', function() {

        it('Should return all existing strains', function() {
            let res;
            return chai.request(app).get('/strains').then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);
                return Strain.countDocuments();
            }).then(function(count) {
                expect(res.body.strains).to.have.lengthOf(count);
            })
        });
    });
});