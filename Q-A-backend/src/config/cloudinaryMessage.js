const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name:  'db3n1kswt',
  api_key:  '299293383991286',
  api_secret: 'WaYbfiv0cz909aajjehkItnagvA',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: isImage ? 'chat_images' : 'chat_files',
      resource_type: isImage ? 'image' : isVideo ? 'video' : 'raw',
    };
  },
});


const uploadMessageFile = multer({ storage });

module.exports = { cloudinary, uploadMessageFile };
