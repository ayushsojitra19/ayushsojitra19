import errorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error",
    }


    // Handle invalid Mongoose Id error
    if (err.name === "CastError") {
        error.message = `Resource not found. Invalid: ${err.path}`;
        error = new errorHandler(error.message, 404);
    }
    
    // Handle validation error
    if (err.name === "ValidationError") {
        error.message = Object.values(err.errors).map((value) => value.message).join(", ");
        error = new errorHandler(error.message, 400);
    }

    
    // Handle Mongoose duplicate key error
    if (err.name === "MongoServerError" && err.code === 11000) {
        error.message = `Duplicate ${Object.keys(err.keyValue)} value entered`;
        error = new errorHandler(error.message, 400);
    }

    // Handle wrong JWT error
    if (err.name === "JsonWebTokenError") {
        error.message = "Invalid token. Please Try again.";
        error = new errorHandler(error.message, 400);
    }

    // Handle expired JWT error
    if (err.name === "TokenExpiredError") {
        error.message = "Token has expired. Please Try again.";
        error = new errorHandler(error.message, 400);
    }


    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err.stack,

        });
    }

    if (process.env.NODE_ENV === "PRODUCTION") {
        res.status(error.statusCode).json({
            message: error.message,

        });
    }


}