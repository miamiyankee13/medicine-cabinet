'use strict'
//Import dependencies
const mongoose = require('mongoose');

//Configure mongoose to use ES6 promises
mongoose.Promise = global.Promise;    

//Declare schema for comments
const commentSchema = mongoose.Schema({
    content: { type: String }
});

//Declare schema for strains
const strainSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    description: { type: String, required: true},
    flavor: { type: String, required: true },
    comments: [commentSchema]
});

//Declare schema for users
const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    strains: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Strain'}]
});

//Declare pre-hook middlewate to populate "strains" from reference
userSchema.pre('find', function(next) {
    this.populate('strains');
    next();
});

userSchema.pre('findOne', function(next) {
    this.populate('strains');
    next();
});

//Create serialize method to control data shown to client
userSchema.methods.serialize = function() {
    return {
        _id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.userName,
        strains: this.strains
    }
}

//Create mongoose models
const Strain = mongoose.model('Strain', strainSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Strain, User};