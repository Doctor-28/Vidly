exports.HttpError = class HttpError extends Error {
    constructor(message, httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}