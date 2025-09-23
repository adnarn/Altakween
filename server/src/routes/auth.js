const express = require('express'); 
const {login, register} = require('../controllers/authController.js');

const router = express.Router();

// CREATE Arena
router.post('/register', register);

// UPDATE Arena
router.post('/login', login);

module.exports = router;