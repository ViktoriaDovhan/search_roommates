const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, me, logout } = require('../controllers/authController');

router.post('/register', (req, res, next) => {
    console.log('REGISTER ROUTE FROM authRoutes.js');
    next();
}, register);

router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);

module.exports = router;