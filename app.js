const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();


const port = process.env.PORT || 9000;
app.listen(port, () => {
    winston.info('Server is up!');
});