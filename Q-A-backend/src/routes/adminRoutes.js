const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/auth.middleware');

// PATCH vì đây là hành động cập nhật một phần
router.patch('/lock-user', authenticateToken, adminController.lockUser);
router.patch('/unlock-user', authenticateToken, adminController.unlockUser);

module.exports = router;
