const db = require('../models/index');
const User = db.User;
const { createUserService } = require('../services/user.service')
const { generateToken } = require('../services/auth.service')
const bcrypt = require('bcrypt');
const saltRounds = 10

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
    });

  } catch (err) {
    return res.status(500).json({
      message: 'Lỗi server',
      error: err.message,
    });
  }
}

exports.createUser = async (req, res) => {
  try {
    const { name, email, password_hash, role } = req.body;
    if (!name || !email || !password_hash) {
      throw new Error('Thiếu dữ liệu bắt buộc');
    }
    if (password_hash.length < 8) {
      throw new Error('Mật khẩu phải dài hơn 8 chữ ')
    }
    const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role: role || 'student',
    });
    return res.status(201).json({
      status: 'success',
      data: newUser
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi tạo người dùng'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'role', 'avt']
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    return res.status(200).json({
      status: 'success',
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
}