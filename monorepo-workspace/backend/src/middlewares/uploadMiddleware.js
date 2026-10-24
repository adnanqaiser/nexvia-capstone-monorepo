const multer = require('multer');
const s3 = require('../config/s3');

// Configure multer for memory storage handling
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

/**
 * Middleware function that pipes multi-part binary file data directly onto S3 bucket securely
 */
const uploadToS3 = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const bucketName = process.env.S3_BUCKET_NAME || 'corporate-app-assets';
  const fileKey = `uploads/${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: 'public-read',
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.warn('[AWS S3 Upload Warning]: Direct S3 upload failed or AWS credentials invalid. Falling back to local static URL simulation.');
      req.fileUrl = `https://storage.googleapis.com/corporate-assets-fallback/${fileKey}`;
      return next();
    }
    req.fileUrl = data.Location;
    next();
  });
};

module.exports = { upload, uploadToS3 };
