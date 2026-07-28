const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");
const User = require("../models/userModel");

// ============================================================
// 1. GET ALL PRODUCTS (Public - Sirf Approved Wale)
// ============================================================
// ============================================================
// 1. GET ALL PRODUCTS (Public - Sab Products Dikhane ke liye)
// ============================================================
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const resultPerPage = 12;
  const productsCount = await Product.countDocuments();

  // 1. Base Filter (Admin ya Approved Seller Products)
  const baseFilter = {
    $or: [
      { "user.role": "admin" }, 
      { isApproved: true }
    ]
  };

  // 2. Search aur Filter ke liye baseFilter pass karein
  const searchFeature = new SearchFeatures(Product.find(baseFilter).populate("user"), req.query)
    .search()
    .filter();

  // 3. Filtered products count (Pagination se pehle)
  let products = await searchFeature.query.clone();
  let filteredProductsCount = products.length;

  // 4. Pagination
  searchFeature.pagination(resultPerPage);
  products = await searchFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});
// ============================================================
// 2. GET PRODUCTS (Simple List for Sliders - Public)
// ============================================================
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  // Sirf testing ke liye filter hata diya gaya hai
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    products,
  });
});

// ============================================================
// 3. GET PRODUCT DETAILS (Public)
// ============================================================
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "user",
    "name email shopName",
  );

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
// ============================================================
// 4. CREATE PRODUCT (By Seller or Admin)
// ============================================================
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  let images = [];
  if (req.body.images) {
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  }

  const imagesLink = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  // Brand Logo Upload Logic
  if (req.body.logo) {
    const result = await cloudinary.v2.uploader.upload(req.body.logo, {
      folder: "brands",
    });
    req.body.brand = {
      name: req.body.brandname,
      logo: { public_id: result.public_id, url: result.secure_url },
    };
  }

  req.body.images = imagesLink;
  req.body.user = req.user.id;

  // Admin approve ho jaye, Seller pending rahe
  req.body.isApproved = req.user.role === "admin" ? true : false;

  // --- 🎨📏 COLORS & SIZES HANDLING ---
  let colors = req.body.colors;
  if (colors) {
    req.body.colors = typeof colors === 'string' ? [colors] : colors;
  } else {
    req.body.colors = [];
  }

  let sizes = req.body.sizes;
  if (sizes) {
    req.body.sizes = typeof sizes === 'string' ? [sizes] : sizes;
  } else {
    req.body.sizes = [];
  }

  // Specifications Parsing
  if (req.body.specifications) {
    let specs = [];
    let specsArray = Array.isArray(req.body.specifications) 
      ? req.body.specifications 
      : [req.body.specifications];

    specsArray.forEach((s) => {
      try {
        specs.push(typeof s === 'string' ? JSON.parse(s) : s);
      } catch (err) {
        // Ignore invalid format if empty/optional
      }
    });
    req.body.specifications = specs;
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
// ============================================================
// 5. UPDATE PRODUCT (Owner or Admin Only)
// ============================================================
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // 1. Specifications Handle Karein
  if (req.body.specifications) {
    try {
      let specsArray =
        typeof req.body.specifications === "string"
          ? JSON.parse(req.body.specifications)
          : req.body.specifications;

      product.specifications = specsArray.map((item) => {
        const parsedItem = typeof item === "string" ? JSON.parse(item) : item;
        return {
          title: parsedItem.title,
          description: parsedItem.description,
        };
      });
    } catch (err) {
      return next(
        new ErrorHandler(
          "Invalid Specifications Format: Please ensure title and description are provided.",
          400,
        ),
      );
    }
  }

  // --- 🎨📏 COLORS & SIZES UPDATE HANDLING ---
  if (req.body.colors) {
    product.colors = typeof req.body.colors === 'string' ? [req.body.colors] : req.body.colors;
  }

  if (req.body.sizes) {
    product.sizes = typeof req.body.sizes === 'string' ? [req.body.sizes] : req.body.sizes;
  }

  // 2. Baaki Fields Update Karein
  const { specifications, colors, sizes, ...otherData } = req.body;

  Object.keys(otherData).forEach((key) => {
    product[key] = otherData[key];
  });

  // 3. Admin Logic: Agar owner admin nahi hai, toh approval reset kar dein
  if (req.user.role !== "admin") {
    product.isApproved = false;
  }

  // 4. Save the document
  await product.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    product,
  });
});
// ============================================================
// 6. DELETE PRODUCT
// ============================================================
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (
    product.user.toString() !== req.user.id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("Access Denied", 403));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();
  res.status(200).json({ success: true });
});

// ============================================================
// 7. GET SELLER PRODUCTS (Dashboard)
// ============================================================
exports.getSellerProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    products,
  });
});

// ============================================================
// 8. GET ADMIN PRODUCTS (All Marketplace)
// ============================================================
// SIRF backend/controllers/productController.js mein ye change karein
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
  // Yahan .populate("user", "role") add karna zaroori hai
  const products = await Product.find().populate("user", "role");

  res.status(200).json({
    success: true,
    products,
  });
});
// ============================================================
// 9. UPDATE PRODUCT STATUS (Admin Approval)
// ============================================================
exports.updateProductStatus = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      isApproved: req.body.isApproved,
    },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: req.body.isApproved
      ? "Product Approved"
      : "Product Rejected/Hidden",
  });
});

// ============================================================
// 10. REVIEWS Logic
// ============================================================
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString(),
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        ((rev.rating = rating), (rev.comment = comment));
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});

exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));
  res.status(200).json({ success: true, reviews: product.reviews });
});

exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString(),
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = reviews.length === 0 ? 0 : avg / reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings: Number(ratings),
      numOfReviews: reviews.length,
    },
    { new: true },
  );

  res.status(200).json({ success: true });
});
// ============================================================
// 11. GET SPECIFIC SELLER STORE (Frontend ke liye)
// ============================================================
exports.getSellerStore = asyncErrorHandler(async (req, res, next) => {
  // 1. Seller ki details (User model se)
  // Backend (Controller mein aisa hona chahiye)
  const seller = await User.findById(req.params.id).select(
    "shopName description logo banner",
  );
  // 2. Sirf us seller ke products (Product model se)
  // Hum "user" field use kar rahe hain kyunki aapne createProduct mein user: req.user.id save kiya tha
  const products = await Product.find({
    user: req.params.id,
    isApproved: true,
  });

  res.status(200).json({
    success: true,
    seller,
    products,
  });
});
// ============================================================
// 12. GET SELLER REVIEWS (Seller Dashboard ke liye)
// ============================================================
exports.getSellerReviews = asyncErrorHandler(async (req, res, next) => {
  // 1. Logged-in seller ke saare products find karein
  const products = await Product.find({ user: req.user.id });

  let reviews = [];
  // 2. Har product ke reviews ko ek array mein collect karein
  products.forEach((product) => {
    product.reviews.forEach((rev) => {
      reviews.push({
        _id: rev._id,
        rating: rev.rating,
        comment: rev.comment,
        name: rev.name,
        user: rev.user,
        product: product._id,
        productName: product.name,
      });
    });
  });

  res.status(200).json({
    success: true,
    reviews,
  });
});