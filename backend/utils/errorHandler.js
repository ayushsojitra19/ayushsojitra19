

class errorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        //create stack trace for where error occurred
        Error.captureStackTrace(this, this.constructor);
    }
}

export default errorHandler;