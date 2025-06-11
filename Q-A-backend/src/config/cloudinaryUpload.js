const express = require('express');
const router = express.Router();
const { upload } = require('./cloudinary');

router.get('/', (req, res) => {
  res.send('Upload endpoint is working ✅');
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Không tìm thấy tệp tải lên' });
    }

    res.status(200).json({ url: req.file.path });
  } catch (error) {
    console.error('Lỗi khi upload lên Cloudinary:', error);
    res.status(500).json({ error: 'Upload thất bại' });
  }
});

module.exports = router;