const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });
require("dotenv").config({
  path: path.resolve(process.cwd(), "backend", "config", "config.env"),
});

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

// Cache connection for Serverless (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDatabase = async () => {
  if (!MONGO_URI) {
    console.log("ERROR: MongoDB URI is undefined.");
    return;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
    };

    console.log("Connecting to MongoDB using env var:", ENV_VAR_USED);
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("Mongoose Connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDatabase;