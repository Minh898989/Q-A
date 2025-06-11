const db = require("../config/db");

const ResetPasswordModel = {
  // Tạo yêu cầu reset mới
  createRequest: async (email) => {
    await db.execute(
      "INSERT INTO reset_requests (email, status) VALUES (?, 'pending')",
      [email]
    );
  },

  // Tìm tất cả yêu cầu reset đang chờ xử lý
  findAllPending: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM reset_requests WHERE status = 'pending'"
    );
    return rows;
  },

  // Cập nhật mật khẩu người dùng
  updatePassword: async (email, newPassword) => {
    await db.execute(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [newPassword, email]
    );
  },

  // Đánh dấu yêu cầu đã xử lý
  markAsDone: async (email) => {
    await db.execute(
      "UPDATE reset_requests SET status = 'done' WHERE email = ?",
      [email]
    );
  },
  isUserExist: async (email) => {
  const [rows] = await db.execute("SELECT 1 FROM users WHERE email = ?", [email]);
  return rows.length > 0;
},
// Kiểm tra xem email đã có yêu cầu reset đang chờ chưa
hasPendingRequest: async (email) => {
  const [rows] = await db.execute(
    "SELECT 1 FROM reset_requests WHERE email = ? AND status = 'pending'",
    [email]
  );
  return rows.length > 0;
},
// Tìm tất cả yêu cầu reset đã xử lý
findAllCompleted: async () => {
  const [rows] = await db.execute(
    "SELECT * FROM reset_requests WHERE status = 'done' ORDER BY updated_at DESC"
  );
  return rows;
},

};

module.exports = ResetPasswordModel;
