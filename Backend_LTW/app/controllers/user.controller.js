const db=require('../models/index');
const User =db.User;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy danh sách người dùng'
    });
  }
};
// Tạo user mới

// Lấy user theo id
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({status: 'error', message: 'Không tìm thấy người dùng' });
    }

    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy người dùng'
    });
  }
};

// Cập nhật user theo id
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password_hash, role, is_active } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    await user.update({ name, email, password_hash, role, is_active });

    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi cập nhật người dùng'
    });
  }
};

// Xóa user theo id
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Xóa người dùng thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi xóa người dùng'
    });
  }
};


