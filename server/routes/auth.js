// const express = require('express'); 
// const {login, register} = require('../controllers/authController.js');

// const router = express.Router();

// // CREATE Arena
// router.post('/register', register);

// // UPDATE Arena
// router.post('/login', login);

// module.exports = router;


// routes/auth.js
const express = require('express');
const { login, register } = require('../controllers/authController'); // Consistent path

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;