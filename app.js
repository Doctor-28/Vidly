const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(morgan('dev'));

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

module.exports = app;