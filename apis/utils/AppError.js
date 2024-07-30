class AppError extends Error {
    constructor(message, statusCode = 404) {
        super(message, {"code": statusCode});
        this.message = message
        console.log(statusCode)
        this.code = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;