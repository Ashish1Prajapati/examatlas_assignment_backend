const express = require('express');
const { cancelOrder,createOrder,getAllOrders } = require('../controllers/order');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create',verifyToken, createOrder);
router.get('/',verifyToken, getAllOrders);
router.post('/cancel/:id', verifyToken, cancelOrder);

module.exports = router;
