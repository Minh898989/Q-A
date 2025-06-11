
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Middleware xác thực token, dùng cho route cần người dùng đăng nhập
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Không có token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Token không hợp lệ' });
    }

    req.user = decoded; // Thông tin người dùng từ token (id, role, v.v...)
    next();
  });
};

module.exports = authenticateToken;
