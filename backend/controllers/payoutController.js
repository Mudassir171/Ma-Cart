const Payout = require("../models/payoutModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/asyncErrorHandler");
const sendEmail = require("../utils/sendEmail"); // Sirf Gmail function import hai

// 1. Seller: Request Payout
exports.requestPayout = catchAsyncErrors(async (req, res, next) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return next(new ErrorHandler("Please enter a valid amount to withdraw", 400));
    }

    const seller = await User.findById(req.user._id);

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

// 2. Admin: Get All Payout Requests
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

    // Wallet balance update
    seller.walletBalance -= payout.amount;
    await seller.save({ validateBeforeSave: false });

    payout.status = "Approved";
    payout.processedAt = Date.now();
    await payout.save();

    const messageText = `Hello ${seller.name},\n\nYour payout request of Rs.${payout.amount} has been APPROVED successfully.\n\nThank you!`;

    // --- GMAIL NOTIFICATION ---
    try {
        await sendEmail({
            email: seller.email,
            subject: "Payout Request Approved",
            message: messageText,
        });
    } catch (error) {
        console.log("Email error:", error.message);
    }

    res.status(200).json({
        success: true,
        message: "Payout approved, wallet updated, and email sent successfully!",
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

    const seller = await User.findById(payout.seller);

    if (seller) {
        const messageText = `Hello ${seller.name},\n\nYour payout request of Rs.${payout.amount} has been REJECTED.\nReason: ${payout.adminNote}\n\nThank you!`;

        // --- GMAIL NOTIFICATION ---
        try {
            await sendEmail({
                email: seller.email,
                subject: "Payout Request Rejected",
                message: messageText,
            });
        } catch (error) {
            console.log("Email error:", error.message);
        }
    }

    res.status(200).json({
        success: true,
        message: "Payout request rejected and email sent successfully!",
    });
});