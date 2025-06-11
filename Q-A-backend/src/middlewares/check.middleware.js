
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Kiểm tra role là 'admin'
exports.checkPermission = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({
        status: "error",
        message: "Bạn chưa đăng nhập",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Truy vấn lấy người dùng từ DB (raw SQL)
    const [rows] = await db.sequelize.query(
      'SELECT * FROM users WHERE id = :id',
      { replacements: { id: userId }, type: db.sequelize.QueryTypes.SELECT }
    );

    const user = rows[0] || rows;

    if (!user) {
      return res.status(403).json({
        status: "error",
        message: "Token không hợp lệ",
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        message: "Bạn không có quyền sử dụng chức năng này",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(500).json({
      status: "error",
      name: error.name,
      message: error.message,
    });
  }
};

// Kiểm tra role là 'lecturer'
exports.checkLecturer = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({
        status: "error",
        message: "Bạn chưa đăng nhập",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Truy vấn người dùng (raw SQL)
    const [rows] = await db.sequelize.query(
      'SELECT * FROM users WHERE id = :id',
      { replacements: { id: userId }, type: db.sequelize.QueryTypes.SELECT }
    );

    const user = rows[0] || rows;

    if (!user) {
      return res.status(403).json({
        status: "error",
        message: "Token không hợp lệ",
      });
    }

    if (user.role !== 'lecturer') {
      return res.status(403).json({
        status: "error",
        message: "Bạn không có quyền sử dụng chức năng này",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(500).json({
      status: "error",
      name: error.name,
      message: error.message,
    });
  }
};
