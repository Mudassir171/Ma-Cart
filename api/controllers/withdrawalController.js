const Withdrawal = require("../models/withdrawalModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/asyncErrorHandler");

// 1. Withdrawal Request Bhejna (Seller Side)
exports.requestWithdrawal = catchAsyncErrors(async (req, res, next) => {
    const { amount, paymentMethod, paymentDetails } = req.body;

    const seller = await User.findById(req.user._id);

    if (seller.walletBalance < amount) {
        return next(new ErrorHandler("Aapke wallet mein itne paise nahi hain", 400));
    }

    if (amount < 500) {
        return next(new ErrorHandler("Minimum 500 PKR nikalwaye ja sakte hain", 400));
    }

    const withdrawal = await Withdrawal.create({
        seller: req.user._id,
        amount,
        paymentMethod,
        paymentDetails
    });

    res.status(201).json({
        success: true,
        message: "Withdrawal request admin ko bhej di gayi hai",
        withdrawal
    });
});

// 2. Request Approve/Reject Karna (Admin Side)
exports.updateWithdrawalStatus = catchAsyncErrors(async (req, res, next) => {
    const { status, adminNote } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) return next(new ErrorHandler("Request nahi mili", 404));
    if (withdrawal.status !== "Pending") return next(new ErrorHandler("Ye request pehle hi process ho chuki hai", 400));

    if (status === "Approved") {
        const seller = await User.findById(withdrawal.seller);
        if (seller.walletBalance < withdrawal.amount) {
            return next(new ErrorHandler("Seller ka balance ab kam ho chuka hai", 400));
        }

        // Paise kaatna
        seller.walletBalance -= withdrawal.amount;
        await seller.save({ validateBeforeSave: false });
    }

    withdrawal.status = status;
    withdrawal.adminNote = adminNote;
    await withdrawal.save();

    res.status(200).json({ success: true, message: `Request ${status} ho gayi hai` });
});

// 3. Admin Saari Requests Dekh Sake
exports.getAllWithdrawals = catchAsyncErrors(async (req, res, next) => {
    const withdrawals = await Withdrawal.find().populate("seller", "name email shopName");
    res.status(200).json({ success: true, withdrawals });
});