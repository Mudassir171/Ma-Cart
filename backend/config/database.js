const mongoose = require('mongoose');
// 1. Yeh line sab se upar honi chahiye
require('dotenv').config(); 

// 2. Warning khatam karne ke liye
mongoose.set('strictQuery', false);

const MONGO_URI = process.env.MONGODB_URI;

const connectDatabase = () => {
    // 3. Check karein ke URI mil bhi rahi hai ya nahi
    if (!MONGO_URI) {
        console.log("ERROR: MONGO_URI is undefined. Check your .env file!");
        return;
    }

    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Mongoose Connected");
        })
        .catch((err) => {
            console.log("Database Connection Error: ", err);
        });
}

module.exports = connectDatabase;