const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Seller ID is required"],
    },
    amount: {
        type: Number,
        required: [true, "Please enter withdrawal amount"],
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    adminNote: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    processedAt: {
        type: Date,
    },
});

module.exports = mongoose.model("Payout", payoutSchema);