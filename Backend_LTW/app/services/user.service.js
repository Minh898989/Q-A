const db=require('../models/index');
const User =db.User;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {generateToken}=require('../services/auth.service')

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

// const loginService=async({email, password})=>{
//   try {

//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(401).json({ message: 'Email không tồn tại' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Mật khẩu không đúng' });
//     }

//     // Tạo token
//     const token = generateToken({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     return res.status(200).json({
//       message: 'Đăng nhập thành công',
//       token,
//     });

//   } catch (err) {
//     return res.status(500).json({
//       message: 'Lỗi server',
//       error: err.message,
//     });
//   }
// }

module.exports ={
    createUserService,
}

