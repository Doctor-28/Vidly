const config = require('config');

module.exports = () => {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('JWT Private Key is not defined');
    }
}