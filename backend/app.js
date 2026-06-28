const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');

const app = express();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(fileUpload());

// Route Imports
const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const category = require('./routes/categoryRoute');
const withdrawal = require("./routes/withdrawalRoute");
const payout = require("./routes/payoutRoute");

// Mount Routes
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order);
app.use('/api/v1', payment);
app.use('/api/v1', category);
app.use("/api/v1", withdrawal);
app.use("/api/v1", payout);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;