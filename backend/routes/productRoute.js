// const express = require('express');
// const { 
//     getAllProducts, 
//     getProductDetails, 
//     updateProduct, 
//     deleteProduct, 
//     getProductReviews, 
//     deleteReview, 
//     createProductReview, 
//     createProduct, 
//     getAdminProducts, 
//     getProducts,
//     getSellerProducts, 
//     updateProductStatus 
// } = require('../controllers/productController');

// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// const router = express.Router();

// // ============================================================
// // 1. PUBLIC ROUTES
// // ============================================================
// router.route('/products').get(getAllProducts);
// router.route('/products/all').get(getProducts);
// router.route('/product/:id').get(getProductDetails);

// // ============================================================
// // 2. SELLER & ADMIN SHARED ROUTES
// // ============================================================
// router.route('/seller/products').get(
//     isAuthenticatedUser, 
//     authorizeRoles("seller", "admin"), 
//     getSellerProducts
// );

// router.route('/admin/product/new').post(
//     isAuthenticatedUser, 
//     authorizeRoles("seller", "admin"), 
//     createProduct
// );

// router.route('/admin/product/:id')
//     .put(isAuthenticatedUser, authorizeRoles("seller", "admin"), updateProduct)
//     .delete(isAuthenticatedUser, authorizeRoles("seller", "admin"), deleteProduct);

// // ============================================================
// // 3. ADMIN ONLY ROUTES
// // ============================================================
// router.route('/admin/products').get(
//     isAuthenticatedUser, 
//     authorizeRoles("admin"), 
//     getAdminProducts
// );

// router.route('/admin/product/status/:id').put(
//     isAuthenticatedUser, 
//     authorizeRoles("admin"), 
//     updateProductStatus
// );

// // ============================================================
// // 4. REVIEW ROUTES
// // ============================================================
// router.route('/review').put(isAuthenticatedUser, createProductReview);

// router.route('/admin/reviews')
//     .get(getProductReviews)
//     .delete(isAuthenticatedUser, authorizeRoles("admin", "seller"), deleteReview);

// module.exports = router;


const express = require('express');
const { 
    getAllProducts, 
    getProductDetails, 
    updateProduct, 
    deleteProduct, 
    createProduct, 
    getAdminProducts, 
    getProducts,
    getSellerProducts, 
    updateProductStatus,
    createProductReview,
    getProductReviews,
    deleteReview,
    getSellerStore
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// 1. PUBLIC ROUTES
router.route('/products').get(getAllProducts);
router.route('/products/all').get(getProducts);
router.route('/product/:id').get(getProductDetails);
router.route('/reviews').get(getProductReviews);
router.route("/seller/store/:id").get(getSellerStore);
// 2. PROTECTED ROUTES
router.route('/review').put(isAuthenticatedUser, createProductReview);

// 3. ADMIN & SELLER (THE DEBUGGED ROUTES)
// Hum yahan ek custom middleware lagayenge jo terminal mein batayega ki request yahan aayi hai
const debugRoute = (req, res, next) => {
    console.log("!!! REQUEST REACHED PRODUCT ROUTE: ", req.originalUrl);
    next();
};

router.route('/seller/products').get(
    debugRoute,
    isAuthenticatedUser, 
    authorizeRoles("seller", "admin"), 
    getSellerProducts
);

router.route('/admin/product/new').post(
    debugRoute,
    isAuthenticatedUser, 
    authorizeRoles("seller", "admin"), 
    createProduct
);

router.route('/admin/product/:id')
    .put(debugRoute, isAuthenticatedUser, authorizeRoles("seller", "admin"), updateProduct)
    .delete(debugRoute, isAuthenticatedUser, authorizeRoles("seller", "admin"), deleteProduct);

// 4. ADMIN ONLY
// UPDATED CODE in productRoute.js
router.route('/admin/products').get(
    isAuthenticatedUser, 
    authorizeRoles("admin", "seller"), // Yahan "seller" add karein
    getAdminProducts
);
router.route('/admin/product/status/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProductStatus);
router.route('/admin/reviews').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

module.exports = router;