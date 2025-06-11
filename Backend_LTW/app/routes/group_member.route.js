
const express = require("express");
const groupMemberController = require('../controllers/group_member.controller')
const authenticateToken = require('../middlewares/auth.middleware')
const checkRole = require('../middlewares/check.middleware')
const router = express.Router();

router.post('/join_group', authenticateToken, groupMemberController.joinGroup)
router.get('/pending_member/:groupId', checkRole.checkLecturer, checkRole.verifyGroupOwner, groupMemberController.getPendingMembers)
router.get('/accepted_member/:groupId', authenticateToken, groupMemberController.getMembersAccepted)
router.put('/update_accepted/:groupId', checkRole.checkLecturer, checkRole.verifyGroupOwner, groupMemberController.updateStatus)
router.delete('/delete_rejected/:groupId/:userId',
    checkRole.checkLecturer,
    checkRole.verifyGroupOwner,
    groupMemberController.deleteMemberOrRejected
);

module.exports = router
/**
 * @swagger
 * tags:
 *   name: GroupMember
 *   description: API quản lý thành viên nhóm
 */

/**
 * @swagger
 * /api/group_member/join_group:
 *   post:
 *     summary: Gửi yêu cầu tham gia nhóm
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *             properties:
 *               groupId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Gửi yêu cầu tham gia nhóm thành công
 *       400:
 *         description: Đã gửi yêu cầu hoặc đã là thành viên
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/group_member/pending_member/{groupId}:
 *   get:
 *     summary: Lấy danh sách thành viên đang chờ duyệt
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nhóm
 *     responses:
 *       200:
 *         description: Danh sách thành viên chờ duyệt
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/group_member/accepted_member/{groupId}:
 *   get:
 *     summary: Lấy danh sách thành viên đã được chấp nhận
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nhóm
 *     responses:
 *       200:
 *         description: Danh sách thành viên đã chấp nhận
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/group_member/update_accepted/{groupId}:
 *   put:
 *     summary: Cập nhật trạng thái thành viên (chấp nhận hoặc từ chối)
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - status
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 5
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy thành viên
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/group_member/delete_rejected/{id}:
 *   delete:
 *     summary: Xóa thành viên bị từ chối hoặc rời khỏi nhóm
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Xóa thành viên thành công
 *       404:
 *         description: Không tìm thấy thành viên
 *       500:
 *         description: Lỗi máy chủ
 */
