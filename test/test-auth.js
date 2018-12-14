'use strict'
//Import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

//Import modules
const { Strain, User } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

//Enable expect style syntax
const expect = chai.expect;

//Enable use of chai-http testing methods
chai.use(chaiHttp);

describe('Auth endpoints', function() {
    const userName = 'exampleUser';
    const password = '0123456789';
    const firstName = 'Babe';
    const lastName = 'Ruth';

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return User.hashPassword(password).then(function(password) {
            User.create({
                userName,
                password,
                firstName,
                lastName
            });
        });
    });

    afterEach(function() {
        return User.remove({});
    })

    after(function() {
        return closeServer();
    });

    describe('/auth/login', function() {
        it('Should reject request with no credentials', function() {
            return chai.request(app).post('/auth/login').send({}).then(function(res) {
                expect(res).to.have.status(400);
            }).catch(function(err) {
                if (err instanceof chai.AssertionError) {
                    throw err;
                }
            });
        });
    });


});