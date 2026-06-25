const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter category name"],
        trim: true,
    },
    types: [
        {
            type: String
        }
    ],
    image: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    // Yahan 'status' field add karein
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Category", categorySchema);