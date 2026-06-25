const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/asyncErrorHandler");
const cloudinary = require("cloudinary");

// ============================================================
// 1. NAYA ORDER CREATE KARNA (Customer Side)
// ============================================================
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;

    // 1. Payment Screenshot Handling
    if (paymentInfo.screenshot && typeof paymentInfo.screenshot === 'string') {
        const myCloud = await cloudinary.v2.uploader.upload(paymentInfo.screenshot, {
            folder: "payment_receipts",
        });
        paymentInfo.screenshot = { public_id: myCloud.public_id, url: myCloud.secure_url };
    }

    const validatedOrderItems = [];
    
    // Commission Rate (Aap ise database se bhi fetch kar sakte hain)
    const COMMISSION_RATE = 0.10; // 10%

    // 2. Logic: Item validation, Stock update aur Commission calculate karna
    for (const item of orderItems) {
        const liveProduct = await Product.findById(item.product);
        
        if (!liveProduct) {
            return next(new ErrorHandler(`Product not found with ID: ${item.product}`, 404));
        }

        if (liveProduct.stock < item.quantity) {
            return next(new ErrorHandler(`Insufficient stock for ${liveProduct.name}`, 400));
        }

        liveProduct.stock -= item.quantity;
        await liveProduct.save({ validateBeforeSave: false });

        // Commission Logic
        const itemTotal = item.price * item.quantity;
        const adminCommission = itemTotal * COMMISSION_RATE;
        const sellerShare = itemTotal - adminCommission;

        validatedOrderItems.push({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
            seller: liveProduct.user, // Seller ID (Product owner)
            adminCommission: adminCommission,
            sellerShare: sellerShare, // Yeh zaroori hai payout ke liye
            status: "Processing"
        });
    }

    // 3. Order Create karna
    const order = await Order.create({
        shippingInfo,
        orderItems: validatedOrderItems,
        paymentInfo,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});
// ============================================================
// 2. SINGLE ORDER DETAILS
// ============================================================
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    let order = await Order.findById(req.params.id)
        .populate("user", "name email role")
        .populate("orderItems.seller", "name email shopName");

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    // MULTI-VENDOR FILTER: Seller ko dusre ke items na dikhein
    if (req.user.role === "seller") {
        const filteredItems = order.orderItems.filter(
            (item) => item.seller && item.seller._id.toString() === req.user._id.toString()
        );

        if (filteredItems.length === 0) {
            return next(new ErrorHandler("Aapko yeh order dekhne ki ijazat nahi hai", 403));
        }

        const sellerOrderData = order.toObject();
        sellerOrderData.orderItems = filteredItems;

        return res.status(200).json({
            success: true,
            order: sellerOrderData,
        });
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// ============================================================
// 3. USER KE APNE ORDERS
// ============================================================
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });
});

// ============================================================
// 4. SAARE ORDERS FETCH KARNA (Admin & Seller Dashboard)
// ============================================================
// orderController.js mein isay update karein:
// exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
//     let orders;
//     let totalAmount = 0;
//     let totalCommission = 0;

//     if (req.user.role === "seller") {
//     const rawOrders = await Order.find({ "orderItems.seller": req.user._id })
//         .populate("user", "role name email");

//     console.log("Found rawOrders count:", rawOrders.length); // Agar ye 0 hai, to database query match nahi kar rahi

//     orders = rawOrders.map(order => {
//         const orderObj = order.toObject();
//         orderObj.orderItems = orderObj.orderItems.filter(
//             item => item.seller && item.seller.toString() === req.user._id.toString()
//         );
//         return orderObj;
//     });

//         // SELLER CALCULATION
//       // Seller calculation
// // Seller calculation
// orders.forEach(order => {
//     order.orderItems.forEach(item => {
//         // String conversion ensure karein
//         const itemSellerId = item.seller ? item.seller.toString() : "";
//         const currentUserId = req.user._id ? req.user._id.toString() : "";

//         if (itemSellerId === currentUserId) {
//             totalAmount += (item.price * item.quantity);
//             totalCommission += (item.price * item.quantity * 0.90);
//         }
//     });
// });
//     } else {
//         // ADMIN CALCULATION
//         orders = await Order.find().populate("user", "role name email");
//         orders.forEach(order => {
//             totalAmount += order.totalPrice;
//             order.orderItems.forEach(item => {
//                 // Admin ko item.adminCommission ya 10% dikhayein
//                 totalCommission += (item.adminCommission || (item.price * item.quantity * 0.10));
//             });
//         });
//     }

//     res.status(200).json({ 
//         success: true, 
//         totalAmount: totalAmount || 0, // Fallback to 0 if undefined
//         totalCommission: totalCommission || 0, // Fallback to 0 if undefined
//         orders 
//     });
// });
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    let orders;
    let totalAmount = 0;
    let totalCommission = 0;
    console.log("Fetching orders for role:", req.user.role);
    console.log("User ID:", req.user._id);
    if (req.user.role === "admin") {
        orders = await Order.find().populate("user", "name email");
        console.log("Total orders in DB:", orders.length);
        orders.forEach(order => {
            totalAmount += order.totalPrice;
            order.orderItems.forEach(item => {
                totalCommission += (item.adminCommission || (item.price * item.quantity * 0.10));
            });
        });
    } else if (req.user.role === "seller") {
        const rawOrders = await Order.find({ "orderItems.seller": req.user._id })
                                     .populate("user", "name email");
        orders = rawOrders.map(order => {
            const orderObj = order.toObject();
            orderObj.orderItems = orderObj.orderItems.filter(
                item => item.seller && item.seller.toString() === req.user._id.toString()
            );
            return orderObj;
        });
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                totalAmount += (item.price * item.quantity);
                totalCommission += (item.price * item.quantity * 0.90);
            });
        });
    }
    console.log("Sending to frontend:", { totalAmount, totalCommission, orderCount: orders.length });
    res.status(200).json({
        success: true,
        totalAmount,
        totalCommission,
        orders
    });
});
// ==========================================================
// 5. UPDATE STATUS (Dono names exports kardiye crash rokne ke liye)
// ============================================================
// orderController.js mein isay update karein:
const updateItemStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    const { status, itemId } = req.body;

    // 1. Agar specific item ka status update karna hai (Seller ya Admin)
    if (itemId) {
        const item = order.orderItems.find((i) => i._id.toString() === itemId);
        if (!item) {
            return next(new ErrorHandler("Item not found in this order", 404));
        }

        // Security: Agar seller hai, toh check karein ki kya ye item usi ka hai?
        if (req.user.role === "seller" && item.seller.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler("Aapko is item ka status update karne ki ijazat nahi hai", 403));
        }

        // Status Change: Agar 'Delivered' ho, toh paisa wallet mein bhejein
        if (status === "Delivered" && item.status !== "Delivered") {
            item.adminCommission = (item.price * item.quantity) * 0.10;
            const seller = await User.findById(item.seller);
            if (seller) {
                // Seller ko 90% mil jayega
                seller.walletBalance = (seller.walletBalance || 0) + ((item.price * item.quantity) * 0.90);
                await seller.save({ validateBeforeSave: false });
            }
        }

        item.status = status;
    } 
    // 2. Agar poore order ka status update karna hai (Admin Only)
    else {
        if (req.user.role !== "admin") {
            return next(new ErrorHandler("Sirf Admin poore order ka status change kar sakta hai", 403));
        }
        order.orderStatus = status;
        if (status === "Shipped") order.shippedAt = Date.now();
        if (status === "Delivered") order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Status updated successfully",
    });
});
// Helper function (check karein ke ye file mein majood hai)
async function updateStock(id, quantity) {
    console.log("DEBUG: Updating stock for ID:", id, "Reduction:", quantity); // Yeh line add karein
    const product = await Product.findById(id);
    if (product) {
        product.stock -= quantity;
        await product.save({ validateBeforeSave: false });
        console.log("DEBUG: New stock saved:", product.stock); // Yeh line add karein
    } else {
        console.log("DEBUG: Product not found for stock update!");
    }
}

// 2. DELETE ORDER
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler("Order not found", 404));
    await order.deleteOne();
    res.status(200).json({ success: true });
});

// 3. EXPORTS (Yahan ghalti hoti hai, ise dhyan se likhein)
exports.updateItemStatus = updateItemStatus;
exports.updateOrder = updateItemStatus; // Yeh route ke liye zaroori hai
exports.deleteOrder = deleteOrder;

