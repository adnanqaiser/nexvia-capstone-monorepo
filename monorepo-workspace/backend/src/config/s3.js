const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock_key',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret',
  region: process.env.AWS_REGION || 'us-east-1',
});

module.exports = s3;
