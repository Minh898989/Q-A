const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    return res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy người dùng' });

    return res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const updates = { ...req.body }; // QUAN TRỌNG: lấy ra req.body

    if (updates.password_hash) {
      const saltRounds = 10;
      updates.password_hash = await bcrypt.hash(updates.password_hash, saltRounds);
    }

    const updatedUser = await User.update(id, updates);
    return res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy người dùng' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ status: 'error', message: 'Không thể xóa admin' });
    }

    const deletedUser = await User.delete(id);

    return res.status(200).json({
      status: 'success',
      message: 'Xóa người dùng thành công',
      data: deletedUser
    });

  } catch (error) {
    console.error('Lỗi khi xóa user:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;

    const allowedRoles = ['student', 'lecturer'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Chỉ được phép đổi giữa student và lecturer' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy người dùng' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ status: 'error', message: 'Không thể thay đổi vai trò của admin' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ status: 'error', message: 'Chỉ được đổi vai trò của student và lecturer' });
    }

    const updatedUser = await User.update(id, { role });

    return res.status(200).json({
      status: 'success',
      message: 'Cập nhật vai trò thành công',
      data: updatedUser
    });
  } catch (error) {
    console.error('Lỗi updateUserRole:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
