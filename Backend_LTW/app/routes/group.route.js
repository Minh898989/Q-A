const express = require("express")
const router = express.Router();
const groupController = require("../controllers/group.controller");
const checkRole = require('../middlewares/check.middleware')
const authenticateToken = require('../middlewares/auth.middleware')

router.post('/', checkRole.checkLecturer, groupController.createGroups)
router.get('/', authenticateToken, groupController.getGroups)
router.get('/lecture', checkRole.checkLecturer, groupController.getGroupsWithLecture)
router.get('/:id', groupController.getGroupById);
router.delete('/:id', checkRole.checkLecturer, groupController.deleteGroup)
router.put('/:id', checkRole.checkLecturer, groupController.updateGroup)

module.exports = router
/**
 * @swagger
 * /api/groups/:
 *   post:
 *     summary: Tạo group mới
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nhóm NodeJS"
 *               description:
 *                 type: string
 *                 example: "Nhóm học NodeJS cơ bản"
 *     responses:
 *       201:
 *         description: Tạo group thành công
 *       500:
 *         description: Lỗi server
 *
 *   get:
 *     summary: Lấy danh sách tất cả group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Lỗi truy vấn
 */

/**
 * @swagger
 * /api/groups/lecture:
 *   get:
 *     summary: Lấy danh sách group của giảng viên hiện tại
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Lỗi truy vấn
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Xóa group theo ID
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của group cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy group
 *
 *   put:
 *     summary: Cập nhật thông tin group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của group cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Group cập nhật"
 *               description:
 *                 type: string
 *                 example: "Mô tả mới"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy group
 *       500:
 *         description: Lỗi server
 */


