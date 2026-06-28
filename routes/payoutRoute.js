const express = require("express");
const { 
    requestPayout, 
    getAllPayouts, 
    approvePayout, 
    rejectPayout 
} = require("../controllers/payoutController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

// --- Seller Routes ---
// Request a new payout
router.route("/payout/new").post(isAuthenticatedUser, requestPayout);

// --- Admin Routes ---
// Get all payout requests (Admin access)
router.route("/admin/payouts").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPayouts);

// Approve or Reject a payout (Admin access)
router.route("/admin/payout/:id/approve").put(isAuthenticatedUser, authorizeRoles("admin"), approvePayout);
router.route("/admin/payout/:id/reject").put(isAuthenticatedUser, authorizeRoles("admin"), rejectPayout);

module.exports = router;