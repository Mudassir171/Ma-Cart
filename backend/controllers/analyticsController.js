const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const catchAsyncErrors = require("../middlewares/asyncErrorHandler");

// Get Seller Dashboard Stats
exports.getSellerDashboardStats = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find({ user: req.user._id });
    const productIds = products.map(p => p._id);

    const orders = await Order.find({
        "orderItems.seller": req.user._id
    });

    let totalEarnings = 0;
    orders.forEach(order => {
        if (order.orderStatus === "Delivered") {
            order.orderItems.forEach(item => {
                if (item.seller.toString() === req.user._id.toString()) {
                    totalEarnings += (item.price * item.quantity) * 0.9;
                }
            });
        }
    });

    res.status(200).json({
        success: true,
        totalEarnings,
        productCount: products.length,
        orderCount: orders.length,
        orders
    });
});