const express = require('express');
const router = express.Router();
const { login, register, getMerchants, updateMerchantStatus } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/register', register);
router.get('/merchants', authMiddleware(['ADMIN']), getMerchants);
router.patch('/merchants/:vendorId/status', authMiddleware(['ADMIN']), updateMerchantStatus);

module.exports = router;
