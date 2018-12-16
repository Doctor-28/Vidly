const { HttpError } = require('./http-error');

exports.InvalidInputError = class InvalidInputError extends HttpError {
    constructor(message) {
        super(message, 400);
    }
}