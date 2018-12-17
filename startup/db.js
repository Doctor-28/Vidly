const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    const CONFIG = {
        useNewUrlParser: true
    }

    const db = config.get('db');
    mongoose.connect(db, CONFIG)
        .then(() => winston.info(`Connected to ${db}.`));
}