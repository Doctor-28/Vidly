const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    //404
    return res.status(404).send('Not found.');

  res.send(movie);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error)
    //400 Bad Request
    return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalide genre');

  const movie = new Movie({
    title: req.body.title,
    genres: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  await movie.save();
  res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error)
    //400 Bad Request
    return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!movie)
    //404
    return res.status(404).send('Not found.');

  res.send(movie);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(400).send('Not found');

  res.send(movie);
});

module.exports = router;
