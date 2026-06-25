const express = require('express');
const { 
    newOrder, 
    myOrders, 
    getSingleOrder, 
    getAllOrders, 
    updateOrder, 
    deleteOrder 
} = require('../controllers/orderController');

// Seller Analytics Controller ko import kiya
const { getSellerDashboardStats } = require('../controllers/analyticsController'); 

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// ============================================================
// 👥 CUSTOMER / USER ROUTES
// ============================================================

// Naya order create karne ke liye
router.route('/order/new').post(isAuthenticatedUser, newOrder);

// Logged-in user ke apne saare orders dekhne ke liye
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

// Specific order ki details dekhne ke liye
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);


// ============================================================
// 👨‍💼 SELLER DASHBOARD ROUTES
// ============================================================

// Seller ke dashboard statistics aur graphs ka data fetch karne ke liye
router.route('/seller/dashboard/stats').get(
    isAuthenticatedUser, 
    authorizeRoles("seller"), 
    getSellerDashboardStats
);


// ============================================================
// 🛠️ ADMIN & SELLER MANAGEMENT ROUTES
// ============================================================

// Saare orders fetch karne ke liye (Admin ko saare aur Seller ko sirf uske apne orders dikhenge)
router.route('/admin/orders').get(
    isAuthenticatedUser, 
    authorizeRoles("admin", "seller"), 
    getAllOrders
);

// Order status update aur delete karne ka controller
router.route('/admin/order/:id')
    // PUT: Admin aur Seller dono item status update kar sakte hain (Item ID body mein jayegi)
    .put(isAuthenticatedUser, authorizeRoles("admin", "seller"), updateOrder)
    
    // DELETE: SECURITY FIX! Seller ko hata diya, ab sirf main ADMIN hi order delete kar sakega
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder); 

module.exports = router;