const User = require("../models/userModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const sendToken = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, gender, password, avatar } = req.body;

  if (!avatar) {
    return next(new ErrorHandler("Please upload an avatar image", 400));
  }

  try {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    const user = await User.create({
      name,
      email,
      gender,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// Become a Seller (User to Seller Conversion)
exports.becomeSeller = asyncErrorHandler(async (req, res, next) => {
  const {
    shopName,
    phone,
    address,
    city,
    category,
    description,
    cnic,
    bank,
    logo,
    banner,
  } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  // 1. Cloudinary par images upload karein
  const logoCloud = await cloudinary.v2.uploader.upload(logo, {
    folder: "shops/logos",
  });
  const bannerCloud = await cloudinary.v2.uploader.upload(banner, {
    folder: "shops/banners",
  });

  // 2. Database Fields Update Karein
  user.shopName = shopName;
  user.phone = phone;
  user.address = address;
  user.city = city;
  user.category = category;
  user.description = description;
  user.cnic = cnic;
  user.bank = bank;

  // Yahan object structure mein save karein
  user.logo = { public_id: logoCloud.public_id, url: logoCloud.secure_url };
  user.banner = {
    public_id: bannerCloud.public_id,
    url: bannerCloud.secure_url,
  };

  user.role = "seller";
  user.status = "pending";

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Shop details saved!" });
});

// Login User
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email And Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 201, res);
});

// Logout User
exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Details
exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Forgot Password (UPDATED FOR GMAIL & FRONTEND LINK)
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // Get Reset Token from Model
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // CRITICAL FIX: Frontend Link (Port 3000)
  // Agar hum localhost:4000 use karein toh "Cannot GET" error aata hai kyunki wo backend port hai.
  const resetPasswordUrl = `http://localhost:3000/password/reset/${resetToken}`;

  const message = `Aapka Flipkart Password Reset Link niche diya gaya hai:\n\n${resetPasswordUrl}\n\nAgur aapne ye request nahi ki, toh please is email ko ignore karein.\n\nLink 15 minutes mein expire ho jayega.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Flipkart Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

/// social link
// social link
exports.socialLogin = asyncErrorHandler(async (req, res, next) => {
  const { email, name, avatar } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      avatar: {
        public_id: "social",
        url: avatar,
      },
      password: Math.random().toString(36).slice(-10),
    });
  }

  sendToken(user, 200, res);
});
// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // Hash token from URL params
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Invalid or expired reset password token", 404),
    );
  }

  // Password match check (Optional but recommended)
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is Invalid", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 201, res);
});

// Update User Profile
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// --- ADMIN DASHBOARD ---

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
//get all seller
exports.getAllSellers = asyncErrorHandler(async (req, res, next) => {
  const sellers = await User.find({ role: "seller", status: "approved" });
  res.status(200).json({ success: true, sellers });
});

// Get Single User Details --ADMIN
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role --ADMIN
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --ADMIN
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404),
    );
  }

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  await user.remove();

  res.status(200).json({
    success: true,
  });
});

// --- ADMIN: PENDING SELLER APPROVAL SYSTEM ---

// 1. Get All Pending Sellers
exports.getPendingSellers = asyncErrorHandler(async (req, res, next) => {
  // Sirf wahi users jinhe seller banna hai aur abhi 'pending' status mein hain
  const sellers = await User.find({ role: "seller", status: "pending" }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    success: true,
    sellers,
  });
});

// 2. Approve Seller
exports.approveSeller = asyncErrorHandler(async (req, res, next) => {
  const seller = await User.findById(req.params.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  // Status update
  seller.status = "approved";
  await seller.save({ validateBeforeSave: false });

  // --- EMAIL NOTIFICATION LOGIC ---
  try {
    const message = `Badhai ho ${seller.name}!\n\nAapki shop "${seller.shopName}" ko admin ne approve kar diya hai. Ab aap apne seller dashboard se products add kar sakte hain.\n\nHappy Selling!`;

    await sendEmail({
      email: seller.email,
      subject: "Your Shop Approval - Flipkart",
      message,
    });
  } catch (error) {
    // Email fail hone par bhi hum process ko continue rakhenge
    // kyunki user approve ho chuka hai.
    console.log("Email could not be sent: ", error);
  }

  res.status(200).json({
    success: true,
    message: "Seller Approved Successfully and Email Sent",
  });
});

// 3. Reject/Delete Seller
exports.rejectSeller = asyncErrorHandler(async (req, res, next) => {
  const seller = await User.findById(req.params.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  // Yahan hum seller ka record delete kar rahe hain
  await seller.remove();

  res.status(200).json({
    success: true,
    message: "Seller Rejected and Removed",
  });
});
