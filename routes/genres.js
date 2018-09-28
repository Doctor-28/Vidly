const express = require('express');
const router = express.Router();
const Joi = require('joi');

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Romance' },
    { id: 3, name: 'Drama' }
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre)  //404
        return res.status(404).send('Not found.');

    res.send(genre);
});

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error)   //400 Bad Request
        return res.status(400).send(error.details[0].message);
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };

    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre)  //404
        return res.status(404).send('Not found.');

    const { error } = validateGenre(req.body);
    if (error)   //400 Bad Request
        return res.status(400).send(error.details[0].message);
    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre)  //404
        return res.status(404).send('Not found.');

    genres.splice((genre.id - 1), 1);
    res.send(genres);
});

let validateGenre = (genre) => {
    const schema = {
        name: Joi.string().min(2).max(30).required()
    };
    return Joi.validate(genre, schema);
};

module.exports = router;