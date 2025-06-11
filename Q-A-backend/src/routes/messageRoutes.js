const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { uploadMessageFile } = require('../config/cloudinaryMessage'); 



router.get('/history/:userId/:friendId', messageController.getChatHistory);
router.get('/unread/:userId', messageController.getUnreadCounts);
router.post('/mark-as-read', messageController.markMessagesAsRead);
router.get('/unread/total/:userId', messageController.getTotalUnreadByUser);


router.post(
  '/send',
  uploadMessageFile.single('file'), 
  (req, res, next) => {
    if (req.file) {
      req.fileType = req.file.mimetype.startsWith("image/") ? "image" : "file";
    }
    next();
  },
  messageController.sendMessage
);
;

module.exports = router;
