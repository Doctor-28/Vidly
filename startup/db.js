const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
const MONGO_PORT = 27017;
const CONNECTION_STRING = `mongodb://localhost:${MONGO_PORT}/vidly`;
const CONFIG = {
    useNewUrlParser: true
}

mongoose.connect(CONNECTION_STRING, CONFIG)
    .then(() => winston.info('Connected to MongoDB.'));
}