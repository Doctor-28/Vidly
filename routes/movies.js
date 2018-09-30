const express = require('express');
const router = express.Router();
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movie
        .find()
        .sort('title');
    res.send(movies);
});

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error)   //400 Bad Request
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre)
        return res.status(400).send('Invalide genre');
    
    let movie = new Movie({
        title: req.body.title,
        genres: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    });

    movie = await movie.save();
    res.send(movie);
});

module.exports = router;