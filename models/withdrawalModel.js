const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: [true, "Please enter withdrawal amount"],
    },
    paymentMethod: {
        type: String, // "EasyPaisa", "JazzCash", ya "Bank Transfer"
        required: true
    },
    paymentDetails: {
        type: String, // Account Number aur Title
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    adminNote: {
        type: String, // Agar reject ho toh wajah likhne ke liye
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);