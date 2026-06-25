const express = require("express");
const { 
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory, 
    updateCategoryStatus, // Naya controller function
    getApprovedCategories  // Naya controller function
} = require("../controllers/categoryController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth"); 

const router = express.Router();

// 1. Public Route: Sirf approved categories dekhne ke liye
router.route("/categories/approved").get(getApprovedCategories);

// 2. Admin Route: All categories (Pending + Approved)
router.route("/categories").get(
    isAuthenticatedUser, 
    authorizeRoles("admin", "seller"), 
    getCategories
);
// 3. Create Category
router.route("/admin/category/new").post(
    isAuthenticatedUser, 
    authorizeRoles("admin", "seller"), 
    createCategory
);
// 4. Admin Route: Status Approve/Reject karne ke liye
router.route("/admin/category/status/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateCategoryStatus);

// 5. ID based routes for Edit/Delete
router.route("/admin/category/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateCategory)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCategory);

module.exports = router;