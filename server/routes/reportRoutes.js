const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportController');
const protect = require('../middleware/authMiddleware');



// GET /api/reports - Get reports data
router.get('/stats', getReports);

module.exports = router;
