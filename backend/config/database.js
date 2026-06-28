const path = require("path");
const mongoose = require("mongoose");

// Load local env files for development. Vercel uses its own environment variables.
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });
require("dotenv").config({
  path: path.resolve(process.cwd(), "api", "config", "config.env"),
});

// 2. Warning khatam karne ke liye
mongoose.set("strictQuery", false);

const MONGO_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
const ENV_VAR_USED = process.env.MONGODB_URI
  ? "MONGODB_URI"
  : process.env.MONGO_URI
    ? "MONGO_URI"
    : process.env.DATABASE_URL
      ? "DATABASE_URL"
      : "none";

const connectDatabase = () => {
  if (!MONGO_URI) {
    console.log(
      "ERROR: MongoDB URI is undefined. Set MONGODB_URI in Vercel or local env.",
    );
    console.log("Detected env var:", ENV_VAR_USED);
    return;
  }

  console.log("Connecting to MongoDB using env var:", ENV_VAR_USED);

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
    })
    .then(() => {
      console.log("Mongoose Connected");
    })
    .catch((err) => {
      console.log("Database Connection Error: ", err);
    });
};

module.exports = connectDatabase;
