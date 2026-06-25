const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  socialLogin,
  becomeSeller, // <--- Yeh import add karna zaroori tha
  getPendingSellers,
  approveSeller,
  rejectSeller,
  getAllSellers,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/social/login").post(socialLogin);

// Become a Seller Route
router.route("/become/seller").put(isAuthenticatedUser, becomeSeller);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// Admin Routes
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


  // Pending Seller Routes (Added here)
router.route("/admin/pending-sellers").get(isAuthenticatedUser, authorizeRoles("admin"), getPendingSellers);
router.route("/admin/approve-seller/:id").put(isAuthenticatedUser, authorizeRoles("admin"), approveSeller);
router.route("/admin/reject-seller/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), rejectSeller);
router.route("/admin/all-sellers").get(isAuthenticatedUser, authorizeRoles("admin"), getAllSellers);
module.exports = router;
