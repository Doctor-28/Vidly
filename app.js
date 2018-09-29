const express = require('express');
const app = express();
const genresRouter = require('./routes/genres');
const homeRouter = require('./routes/home');
const customersRouter = require('./routes/customers');
const config = require('config');
const debug = require('debug')('app:db'); //debug module creates a logging function that we can call for debug work
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

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

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Application Password: ' + config.get('password'));//it'll only print if environment variable is set
console.log(app.get('env'));



if (app.get('env') == 'development') {
    app.use(morgan('dev')); //:method :status-code :response time in ms -:content-length
}

app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);
app.use('/', homeRouter);


const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log('Server is up!');
});