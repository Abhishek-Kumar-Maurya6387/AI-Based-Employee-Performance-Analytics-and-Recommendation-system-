const express = require('express');
const { getRecommendation } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/recommend', protect, getRecommendation);

module.exports = router;

