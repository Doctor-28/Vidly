const express = require('express');
const router = express.Router();
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

router.get('/', async (req, res) => {
    const rentals = await Rental
        .find()
        .sort('-date');
    res.send(rentals)
});

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer)
        return res.status(400).send('Customer does not exists');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie)
        return res.status(400).send('Movie does not exists');
    

    let rental = new Rental({
        customer: {
            _id: customer.id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie.id,
            title: movie.title,
            genres: movie.genres,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        },
        dateOut: req.body.dateOut,
        dateReturned: req.body.dateReturned,
        rentalFee: req.body.rentalFee
    });

    rental = await rental.save();
    res.send(rental);
});

module.exports = router;