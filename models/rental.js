const mongoose = require('mongoose');
const Joi = require('joi');
const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0,
        required: true
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

let validateRental = (rental) => {
    const schema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
        dateOut: Joi.date(),
        dateReturned: Joi.date(),
        rentalFee: Joi.number().required()
    };
    return Joi.validate(rental, schema);
};

module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;
module.exports.validateRental = validateRental;