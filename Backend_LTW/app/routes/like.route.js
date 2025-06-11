const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const likeController = require('../controllers/like.controller');

router.post('/', authenticateToken, likeController.likeOrDislike);
router.get('/stats/:post_id', authenticateToken, likeController.getPostLikeStats);
router.delete('/', authenticateToken, likeController.removeLike);
router.get('/status/:post_id', authenticateToken, likeController.getUserVoteStatus);

module.exports = router;
