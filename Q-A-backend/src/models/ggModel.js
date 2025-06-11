const pool = require("../config/db");

const ggModel = {
  findOrCreateGoogleUser: async (profile) => {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const avt = profile.photos[0].value;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length > 0) {
      return rows[0]; // Dùng lại nếu đã có
    }

    // Có thể để password_hash rỗng vì user đăng nhập bằng Google OAuth
    const defaultPasswordHash = '';

    const [result] = await pool.query(`
      INSERT INTO users (name, email, password_hash, avt, role, is_active, isLock, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, [name, email, defaultPasswordHash, avt, 'student', 1, 0]);

    return {
      id: result.insertId,
      name,
      email,
      password_hash: defaultPasswordHash,
      avt,
      role: 'student',
      is_active: 1,
      isLock: 0,
      created_at: new Date()
    };
  }
};

module.exports = ggModel;
