const express = require('express');
const { createUser, loginUser, getUserInfo } = require('../controllers/user');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getUserInfo);

module.exports = router;
