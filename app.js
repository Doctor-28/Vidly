const express = require('express');
const app = express();
const auth = require('./routes/auth');
const genresRouter = require('./routes/genres');
const homeRouter = require('./routes/home');
const customersRouter = require('./routes/customers');
const moviesRouter = require('./routes/movies');
const rentalsRouter = require('./routes/rentals');
const usersRouter = require('./routes/users');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

if (!config.get('jwtPrivateKey')) {
    console.error('JWT Private Key is not defined');
    process.exit(1);
}

const MONGO_PORT = 27017;
const CONNECTION_STRING = `mongodb://localhost:${MONGO_PORT}/vidly`;
const CONFIG = {
    useNewUrlParser: true
}

mongoose.connect(CONNECTION_STRING, CONFIG)
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.log('An error ocurred: ', err));

app.set('view engine', 'pug');
app.set('views', './views'); //default

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/rentals', rentalsRouter);
app.use('/api/users', usersRouter);
app.use('/', homeRouter);
app.use('/api/auth', auth)


const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log('Server is up!');
});