const User = require('../models/usersModel');

exports.lockUser = async (req, res) => {
  const { userId } = req.body;
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const updatedUser = await User.update(userId, { isLock: true });
    return res.status(200).json({ message: 'Đã khóa tài khoản', data: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.unlockUser = async (req, res) => {
  const { userId } = req.body;
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const updatedUser = await User.update(userId, { isLock: false });
    return res.status(200).json({ message: 'Đã mở khóa tài khoản', data: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
