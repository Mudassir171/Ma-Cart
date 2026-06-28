const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: Number, required: true },
        phoneNo: { type: Number, required: true },
    },
    orderItems: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
            // --- MULTI-VENDOR FIELD ---
            seller: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            // orderModel.js mein orderItems ke bahar ya orderItems ke andar
            adminCommission: {
                type: Number,
                default: 0
            },
            // --- ITEM-WISE STATUS (Zaroori Addition) ---
            // Is se har vendor apne item ko alag se ship/deliver kar sakega
            status: {
                type: String,
                required: true,
                default: "Processing"
            },
            // orderItems ke andar ye add karein
            sellerShare: { 
                 type: Number, 
                 required: true 
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: { type: String, required: true },
        status: { type: String, required: true },
        method: { type: String, required: true },
        screenshot: {
            public_id: { type: String },
            url: { type: String }
        }
    },
    paidAt: { type: Date, required: true },
    totalPrice: { type: Number, required: true, default: 0 },
    // Poore Order ka main status
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt: Date,
    shippedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Order", orderSchema);