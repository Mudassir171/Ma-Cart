const Payout = require("../models/payoutModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/asyncErrorHandler");

// 1. Seller: Request Payout (New Request)
exports.requestPayout = catchAsyncErrors(async (req, res, next) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return next(new ErrorHandler("Please enter a valid amount to withdraw", 400));
    }

    const seller = await User.findById(req.user._id);

    // Check agar wallet mein kaafi balance hai
    if (amount > seller.walletBalance) {
        return next(new ErrorHandler("Insufficient wallet balance for this withdrawal", 400));
    }

    const payout = await Payout.create({
        seller: req.user._id,
        amount,
    });

    res.status(201).json({
        success: true,
        payout,
    });
});

// 2. Admin: Get All Payout Requests (For Admin Dashboard)
exports.getAllPayouts = catchAsyncErrors(async (req, res, next) => {
    const payouts = await Payout.find().populate("seller", "name email shopName");
    
    res.status(200).json({
        success: true,
        payouts,
    });
});

// 3. Admin: Approve Payout
exports.approvePayout = catchAsyncErrors(async (req, res, next) => {
    const payout = await Payout.findById(req.params.id);

    if (!payout) {
        return next(new ErrorHandler("Payout request not found", 404));
    }

    if (payout.status === "Approved") {
        return next(new ErrorHandler("This payout request has already been approved", 400));
    }

    const seller = await User.findById(payout.seller);

    if (!seller) {
        return next(new ErrorHandler("Seller not found", 404));
    }

    // Wallet se balance deduct karein
    seller.walletBalance -= payout.amount;
    await seller.save({ validateBeforeSave: false });

    // Payout status update karein
    payout.status = "Approved";
    payout.processedAt = Date.now();
    await payout.save();

    res.status(200).json({
        success: true,
        message: "Payout approved and wallet balance updated successfully",
    });
});

// 4. Admin: Reject Payout
exports.rejectPayout = catchAsyncErrors(async (req, res, next) => {
    const payout = await Payout.findById(req.params.id);

    if (!payout) {
        return next(new ErrorHandler("Payout request not found", 404));
    }

    payout.status = "Rejected";
    payout.adminNote = req.body.adminNote || "Request rejected by admin";
    await payout.save();

    res.status(200).json({
        success: true,
        message: "Payout request rejected",
    });
});