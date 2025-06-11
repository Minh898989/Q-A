const db = require('../config/db');

const Message = {
  async create({ sender_id, receiver_id, text, image_url, file_url,}) {
  const time_sent = new Date(); // Hoặc dùng dayjs().toISOString()
  const [result] = await db.query(
    `INSERT INTO messages (sender_id, receiver_id, text, image_url, file_url, time_sent,is_read )
     VALUES (?, ?, ?, ?, ?, ?,FALSE)`,
    [sender_id, receiver_id, text, image_url, file_url, time_sent]
  );
  return { id: result.insertId, time_sent };
},


  async getByUsers(userId1, userId2) {
    const [rows] = await db.query(
      `SELECT * FROM messages WHERE 
      (sender_id = ? AND receiver_id = ?) OR 
      (sender_id = ? AND receiver_id = ?)
      ORDER BY time_sent ASC`,
      [userId1, userId2, userId2, userId1]
    );
    return rows;
  },
  async countUnreadMessages(userId) {
  const [rows] = await db.query(
    `SELECT sender_id, COUNT(*) as unread_count
     FROM messages
     WHERE receiver_id = ? AND is_read = FALSE
     GROUP BY sender_id`,
    [userId]
  );
  return rows; // Trả về [{ sender_id: 1, unread_count: 5 }, ...]
},
async markAsRead(userId, friendId) {
  await db.query(
    `UPDATE messages 
     SET is_read = TRUE 
     WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE`,
    [userId, friendId]
  );
},
async countTotalUnreadByUser(userId) {
  const [rows] = await db.query(
    `SELECT COUNT(*) as total_unread
     FROM messages
     WHERE receiver_id = ? AND is_read = FALSE`,
    [userId]
  );
  return rows[0].total_unread;
}



};

module.exports = Message;
