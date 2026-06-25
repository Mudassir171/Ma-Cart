const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./asyncErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// 1. User Authentication (Token Check)
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    if (!req.user) {
        return next(new ErrorHandler("User not found", 401));
    }

    next();
});

// 2. Role Authorization (Access Control)
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // --- DEBUGGING LOGS ---
        // Yeh line aapko batayegi ki kaunsi request galti se reject ho rahi hai
        console.log(`[AUTH DEBUG] URL: ${req.originalUrl} | User Role: ${req.user.role} | Allowed: ${roles.join(", ")}`);
        
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }

        next();
    };
};
// 3. Check if Seller is Approved by Admin
exports.isApprovedSeller = (req, res, next) => {
    // Agar user seller hai par status 'approved' nahi hai
    if (req.user.role === "seller" && req.user.status !== "approved") {
        return next(
            new ErrorHandler(
                "Your shop request is still under review by Admin. Please wait.",
                403
            )
        );
    }
    next();
};