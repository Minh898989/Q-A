const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: 'db3n1kswt',
  api_key: '299293383991286',
  api_secret: 'WaYbfiv0cz909aajjehkItnagvA',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    allowedFormats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt', 'xlsx', 'ppt'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage });

module.exports = {
  cloudinary,
  upload,
};