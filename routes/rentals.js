const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    //404
    return res.status(404).send('Not found.');

  res.send(rental);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Customer does not exists');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Movie does not exists');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock');

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

  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update(
        'movies',
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send('Something failed');
  }
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error)
    //400 Bad Request
    return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock');

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
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
    },
    { new: true }
  );

  if (!rental)
    //404
    return res.status(404).send('Not found.');

  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if (!rental) return res.status(400).send('Not found');

  res.send(rental);
});

module.exports = router;
