const jwt = require('jsonwebtoken');
require('dotenv').config();
// Lấy secret key từ biến môi trường hoặc dùng mặc định
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;


const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

module.exports = {
  generateToken,
};