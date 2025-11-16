// const express = require('express'); 
// const {login, register} = require('../controllers/authController.js');

// const router = express.Router();

// // CREATE Arena
// router.post('/register', register);

// routes/auth.js
const express = require('express');
const { login, register, forgotPassword, resetPassword } = require('../controllers/authController'); // Consistent path

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;