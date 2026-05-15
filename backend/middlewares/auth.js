import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/user.js";
import cookieParser from "cookie-parser";


// check if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);
    

    if (!token) {
        return next(new errorHandler("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); 
    next();
    
})

// authorize user roles
export const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler(`Role: (${req.user.role}) is not allowed to access this resource`, 403));
        }
        next();
    };
};