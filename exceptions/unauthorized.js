const { HttpError } = require('./http-error');

exports.UnauthorizedError = class UnauthorizedError extends HttpError {
    constructor(message) {
        super(message, 401);
    }
}