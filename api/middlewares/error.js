const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    // Default values agar error mein kuch na ho
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // 1. Wrong MongoDB ID Error (CastError)
    if (err.name === "CastError") {
        message = `Resource Not Found. Invalid: ${err.path}`;
        statusCode = 400;
    }

    // 2. Mongoose Duplicate Key Error (e.g. Email already exists)
    if (err.code === 11000) {
        message = `${Object.keys(err.keyValue)} already exists. Please use another one.`;
        statusCode = 400;
    }

    // 3. Wrong JWT Error
    if (err.name === "JsonWebTokenError") {
        message = `Json Web Token is invalid, Try again`;
        statusCode = 400;
    }

    // 4. JWT Expire Error
    if (err.name === "TokenExpiredError") {
        message = `Json Web Token is Expired, Try again`;
        statusCode = 400;
    }

    // Console mein asli error dekhne ke liye (Sirf development mein)
    console.log("--- Backend Error Log ---");
    console.log(err); 
    console.log("-------------------------");

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};