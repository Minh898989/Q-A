const db = require('../models/index');
const User = db.User;
const Group = db.Group

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

exports.checkPermission = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(403).json({
                status: "error",
                message: "Bạn chưa đăng nhập",
            })
        }
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findByPk(decoded.id)


        if (!user) {
            return res.status(403).json({
                status: "error",
                message: "Token loi"
            })
        }

        if (user.role != "admin") {
            return res.status(400).json({
                message: "Bạn không có quyền sử dụng "
            })
        }
        next()

    } catch (error) {
        return res.json({
            name: error.name,
            message: error.message
        })
    }
}

exports.checkLecturer = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(403).json({
                status: "error",
                message: "Bạn chưa đăng nhập",
            })
        }
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findByPk(decoded.id)

        req.user = user
        if (!user) {
            return res.status(403).json({
                message: "Token loi"
            })
        }

        if (user.role != "lecturer") {
            return res.status(400).json({
                message: "Bạn không có quyền sử dụng "
            })
        }
        next()

    } catch (error) {
        return res.json({
            name: error.name,
            message: error.message
        })
    }
}

exports.verifyGroupOwner = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let groupId = req.params.groupId || req.body.groupId;

        if (!groupId && req.params.id) {
            const groupMember = await GroupMember.findOne({ where: { user_id: req.params.id } });
            if (!groupMember) {
                return res.status(404).json({ message: 'Không tìm thấy thành viên nhóm' });
            }
            groupId = groupMember.group_id;
        }

        if (!groupId) {
            return res.status(400).json({ message: 'Thiếu groupId để xác minh quyền' });
        }

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Không tìm thấy nhóm' });
        }

        if (group.owner_id !== userId) {
            return res.status(403).json({ message: 'Bạn không có quyền quản lý nhóm này' });
        }

        next();
    } catch (error) {
        console.error('verifyGroupOwner error:', error);
        return res.status(500).json({ message: error.message || 'Lỗi xác minh quyền sở hữu nhóm' });
    }
};

