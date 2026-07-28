const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"], // Sirf naam zaroori rakha hai, agar ise bhi optional karna ho toh required hata sakte hain
    trim: true,
  },
  description: {
    type: String,
  },
  highlights: [
    {
      type: String,
    },
  ],
  specifications: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
  price: {
    type: Number,
  },
  cuttedPrice: {
    type: Number,
  },
  // --- 🎨 COLORS & 📏 SIZES ADDED ---
  colors: [
    {
      type: String,
    },
  ],
  sizes: [
    {
      type: String,
    },
  ],
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  brand: {
    name: {
      type: String,
    },
    logo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  category: {
    type: String,
  },
  stock: {
    type: Number,
    maxlength: [4, "Stock cannot exceed limit"],
    default: 1,
  },
  warranty: {
    type: Number,
    default: 1,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],

  // --- MULTI-VENDOR UPDATES ---
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true, // User ID zaroori hai taake pata chale kis seller ne product add kiya hai
  },
  isApproved: {
    type: Boolean,
    default: function () {
      return false; 
    },
  },
  // --- UPDATES END ---

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);