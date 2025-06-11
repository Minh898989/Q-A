const db = require('../models/index');
const GroupMember = db.GroupMember
const User = db.User

exports.joinGroup = async (req, res) => {
  const { groupId } = req.body
  const userId = req.user.id;

  try {
    const existed = await GroupMember.findOne({ where: { group_id: groupId, user_id: userId } })
    if (existed) {
      return res.status(400).json({ message: 'Ban da gui yeu cau hoac la thanh vien trong nhom' })
    }

    await GroupMember.create({
      group_id: groupId,
      user_id: userId,
    })
    res.json({ message: 'Yêu cầu tham gia nhóm đã được gửi.' });
  } catch (error) {
    res.status(500).json({ error: "loi server" })
  }

}
exports.getPendingMembers = async (req, res) => {
  const { groupId } = req.params;
  console.log(groupId)
  try {
    const members = await GroupMember.findAll({
      where: { group_id: groupId, status: 'pending' },
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'avt'] }]
    })
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
exports.getMembersAccepted = async (req, res) => {
  const { groupId } = req.params;
  console.log(groupId)
  try {
    const members = await GroupMember.findAll({
      where: { group_id: groupId, status: 'accepted' },
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'avt'] }]
    })
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
exports.deleteMemberOrRejected = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const deleted = await GroupMember.destroy({
      where: {
        group_id: groupId,
        user_id: userId
      }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên để xoá' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Xoá thành viên thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi xoá thành viên'
    });
  }
};
exports.updateStatus = async (req, res) => {
  const { groupId } = req.params;
  const { status, userId } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  try {
    const member = await GroupMember.findOne({ where: { group_id: groupId, user_id: userId } });

    if (!member) return res.status(404).json({ error: 'Không tìm thấy thành viên' });

    member.status = status;

    await member.save();

    res.json({ message: `Đã cập nhật trạng thái thành công`, member });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};