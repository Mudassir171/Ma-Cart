const cloudinary = require("cloudinary");
const connectDatabase = require("../backend/config/database");
const app = require("../backend/app");

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = app;
