const express = require('express');
const router = express.Router();
const { createOrder, getOrdersLedger } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware(), createOrder);
router.get('/ledger', authMiddleware(['ADMIN']), getOrdersLedger);

module.exports = router;
