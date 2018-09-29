const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

let validateGenre = (genre) => {
    const schema = {
        name: Joi.string().min(2).max(30).required()
    };
    return Joi.validate(genre, schema);
};

module.exports.Genre = Genre;