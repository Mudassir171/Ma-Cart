const express = require("express");
const { 
    requestWithdrawal, 
    getAllWithdrawals, 
    updateWithdrawalStatus 
} = require("../controllers/withdrawalController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

// Seller apni request bhej sake
router.route("/withdrawal/new").post(isAuthenticatedUser, authorizeRoles("seller"), requestWithdrawal);

// Admin saari requests handle kare
router.route("/admin/withdrawals").get(isAuthenticatedUser, authorizeRoles("admin"), getAllWithdrawals);
router.route("/admin/withdrawal/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateWithdrawalStatus);

module.exports = router;