const User = require('../models/usersModel');

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const {generateToken}=require('./authService')

const createUserService= async ({ name, email, password_hash, role }) => {
  if (!name || !email || !password_hash) {
    throw new Error('Thiếu dữ liệu bắt buộc');
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password_hash, saltRounds);

  // Tạo user mới
  const newUser = await User.create({
    name,
    email,
    password_hash: hashedPassword,
    role: role || 'student',
  });
  
  return newUser;
};



module.exports ={
    createUserService,
}

