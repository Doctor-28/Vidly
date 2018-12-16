const { HttpError } = require('./http-error');

exports.NotFoundError = class NotFoundError extends HttpError {
    constructor() {
        super('Not Found.', 404);
    }
}