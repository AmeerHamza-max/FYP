const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/inquiryController');

// POST /api/inquiry/submit
router.post('/submit', submitInquiry);

module.exports = router;