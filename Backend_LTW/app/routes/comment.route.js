const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const commentController = require('../controllers/comment.controller')


router.post("/",authenticateToken,commentController.createComment)
router.get("/:post_id",authenticateToken,commentController.getCommentsByPost)
router.delete("/:id",authenticateToken,commentController.deleteComment)
router.patch('/:id',authenticateToken, commentController.updateComment);
module.exports= router
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API quản lý bình luận
 */

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Tạo một bình luận mới hoặc phản hồi
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *               - content
 *             properties:
 *               post_id:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: Đây là bình luận mới
 *               parent_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *     responses:
 *       201:
 *         description: Tạo bình luận thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/comment/{post_id}:
 *   get:
 *     summary: Lấy các bình luận của bài viết (bao gồm trả lời lồng nhau)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: post_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Danh sách bình luận
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     summary: Xóa bình luận theo ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bình luận cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy bình luận
 *       500:
 *         description: Lỗi máy chủ
 */
