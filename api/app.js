const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');
const path = require('path');

const app = express();

// Config setting
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(fileUpload());

// 1. ROUTE IMPORTS (Imports hamesha sabse upar honi chahiye)
console.log("--- Loading Routes ---");
const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const category = require('./routes/categoryRoute');
const withdrawal = require("./routes/withdrawalRoute");
const payout = require("./routes/payoutRoute");

// 2. MOUNT ROUTES (Imports ke baad)
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order);
app.use('/api/v1', payment);
app.use('/api/v1', category);
app.use("/api/v1", withdrawal);
app.use("/api/v1", payout);

// Deployment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    });
}

// Error Middleware (Sabse niche)
app.use(errorMiddleware);

module.exports = app;