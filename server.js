const app = require('./app');
const winston = require('winston');
const port = process.env.PORT || 9000;

app.listen(port, () => {
    winston.info('Server is up!');
});
