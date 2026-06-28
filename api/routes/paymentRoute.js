// const express = require('express');
// const { processPayment, paytmResponse, getPaymentStatus } = require('../controllers/paymentController');
// const { isAuthenticatedUser } = require('../middlewares/auth');

// const router = express.Router();

// router.route('/payment/process').post(processPayment);
// // router.route('/stripeapikey').get(isAuthenticatedUser, sendStripeApiKey);

// router.route('/callback').post(paytmResponse);

// router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

// module.exports = router;



const express = require('express');
const { 
    processPayment, 
    sendStripeApiKey // Isay add karein
} = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

// Stripe Payment Process Route
router.route('/payment/process').post(isAuthenticatedUser, processPayment);

// Stripe API Key Bhejne ka Route (Frontend ke liye zaroori hai)
router.route('/stripeapikey').get(isAuthenticatedUser, sendStripeApiKey);

// Purane Paytm routes ko delete ya comment kar dein
// router.route('/callback').post(paytmResponse);
// router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;