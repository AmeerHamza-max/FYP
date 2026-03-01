const express = require('express');
const router = express.Router();
const { subscribeToPlan, getSubscriptionStatus } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// POST /api/payments/subscribe
router.post('/subscribe', auth, subscribeToPlan);

// GET /api/payments/my-subscription  ← frontend paymentService.js expect karta hai yeh path
router.get('/my-subscription', auth, getSubscriptionStatus);

// GET /api/payments/status  ← backup route
router.get('/status', auth, getSubscriptionStatus);

module.exports = router;