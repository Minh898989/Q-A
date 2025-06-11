const db = require('../models');
const GroupMember = db.GroupMember;

const verifyMembership = async (req, res, next) => {
    console.log(req.user.id)
  try {
    const userId = req.user.id; // từ middleware xác thực JWT

    const groupId = req.params.groupId;

    const member = await GroupMember.findOne({
      where: {
        user_id: userId,
        group_id: groupId,
        status: 'accepted' // hoặc status = 1 nếu dùng kiểu số
      }
    });

    if (!member) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không phải thành viên của nhóm này hoặc chưa được duyệt'
      });
    }

    next(); // Cho phép tiếp tục tới controller
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi xác minh quyền truy cập'
    });
  }
};

module.exports = { verifyMembership };
