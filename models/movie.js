const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genres: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    }
});

const Movie = mongoose.model('Movie', movieSchema);

let validateMovie = (movie) => {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    };
    return Joi.validate(movie, schema);
};

module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;