const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');

router.get('/', async (req, res) => {
    const genres = await Genre
        .find()
        .sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const genre = genre.findById(req.params.id);
    if (!genre)  //404
        return res.status(404).send('Not found.');

    res.send(genre);
});

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error)   //400 Bad Request
        return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error)   //400 Bad Request
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

    if (!genre)  //404
        return res.status(404).send('Not found.');

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)  //404
        return res.status(404).send('Not found.');

    res.send(genre);
});

module.exports = router;