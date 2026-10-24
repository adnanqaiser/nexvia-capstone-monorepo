const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload, uploadToS3 } = require('../middlewares/uploadMiddleware');

router.get('/', getAllProducts);
router.post('/', authMiddleware(['VENDOR', 'ADMIN']), upload.single('image'), uploadToS3, createProduct);

module.exports = router;
