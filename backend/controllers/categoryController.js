const Category = require("../models/categoryModel");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middlewares/asyncErrorHandler"); 
const ErrorHandler = require("../utils/errorhandler");

// 1. Create Category
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "categories",
    });

    // Types handling logic
    let types = [];
    if (req.body.types) {
        types = Array.isArray(req.body.types) ? req.body.types : [req.body.types];
    }

    const category = await Category.create({
        name: req.body.name,
        types: types, // Ab ye save hoga
        image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        status: "pending", // Yahan ye line add karein
    });

    res.status(201).json({ success: true, category });
});

// 2. Get All Categories (Same as before)
exports.getCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
});

// 3. Update Category
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    let category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorHandler("Category not found", 404));

    const newData = { name: req.body.name };

    // Update Types
    if (req.body.types) {
        newData.types = Array.isArray(req.body.types) ? req.body.types : [req.body.types];
    }

    if (req.body.image && req.body.image !== "") {
        await cloudinary.v2.uploader.destroy(category.image.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "categories",
        });
        newData.image = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    category = await Category.findByIdAndUpdate(req.params.id, newData, {
        new: true, 
        runValidators: true, 
        useFindAndModify: false,
    });

    res.status(200).json({ success: true });
});

// 4. Delete Category (Same as before)
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorHandler("Category not found", 404));

    await cloudinary.v2.uploader.destroy(category.image.public_id);
    await category.deleteOne();

    res.status(200).json({ success: true, message: "Deleted Successfully" });
});
// 5. Update Category Status (Admin Only)
exports.updateCategoryStatus = catchAsyncErrors(async (req, res, next) => {
    let category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorHandler("Category not found", 404));

    // Status ko update karein (jo request body mein aayega)
    category.status = req.body.status; 
    await category.save();

    res.status(200).json({ success: true, message: "Status updated successfully" });
});

// 6. Get ONLY Approved Categories (For User/SellerStore)
exports.getApprovedCategories = catchAsyncErrors(async (req, res, next) => {
    // Sirf approved categories fetch karein
    const categories = await Category.find({ status: "approved" });
    res.status(200).json({ success: true, categories });
});