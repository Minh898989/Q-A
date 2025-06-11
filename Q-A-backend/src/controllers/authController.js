const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/authService');
const saltRounds = 10;

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Email không tồn tại' });

   if (user.isLock === 1 || user.isLock === true) {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu không đúng' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return res.status(200).json({ message: 'Đăng nhập thành công', token });

  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password_hash, role } = req.body;
    if (!name || !email || !password_hash)
      throw new Error('Thiếu dữ liệu bắt buộc');
    if (password_hash.length < 8)
      throw new Error('Mật khẩu phải dài hơn 8 chữ');

    const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role
    });

    return res.status(201).json({ status: 'success', data: newUser });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
// Đảm bảo có dòng này:
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    return res.status(200).json({
    data: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avt: user.avt || null 
  }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }

};
exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrl = req.file.path;

    // Cập nhật vào DB
    const updatedUser = await User.update(userId, { avt: imageUrl });

    return res.status(200).json({
      message: 'Cập nhật ảnh đại diện thành công',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avt: updatedUser.avt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

