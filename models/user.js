const config = require('config')
const jwt =  require('jsonwebtoken');
const _ = require('lodash')
const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(_.pick(this,['_id', 'isAdmin']), config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

const complexityOptions = {
    min: 8,
    max: 32,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2
}

let validateUser = (user) => {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(6).max(50).email().required(),
        password: new PasswordComplexity(complexityOptions)
    };
    return Joi.validate(user, schema);
};

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.complexityOptions = complexityOptions;