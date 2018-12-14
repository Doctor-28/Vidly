const auth = require('../routes/auth');
const genresRouter = require('../routes/genres');
const homeRouter = require('../routes/home');
const customersRouter = require('../routes/customers');
const moviesRouter = require('../routes/movies');
const rentalsRouter = require('../routes/rentals');
const usersRouter = require('../routes/users');
const express = require('express');
const error = require('../middleware/error');
const helmet = require('helmet');

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use('/api/genres', genresRouter);
    app.use('/api/customers', customersRouter);
    app.use('/api/movies', moviesRouter);
    app.use('/api/rentals', rentalsRouter);
    app.use('/api/users', usersRouter);
    app.use('/', homeRouter);
    app.use('/api/auth', auth);
    app.use(error);
}