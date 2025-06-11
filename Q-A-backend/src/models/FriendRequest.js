const db = require("../config/db");

const FriendRequest = {
  async sendRequest(senderId, receiverId) {
    return db.query(
      "INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (?, ?, 'pending')",
      [senderId, receiverId]
    );
  },

  async getIncomingRequests(userId) {
    const [rows] = await db.query(
      `SELECT fr.id, u.id AS user_id, u.name, u.avt, fr.status
       FROM friend_requests fr
       JOIN users u ON fr.sender_id = u.id
       WHERE fr.receiver_id = ? AND fr.status = 'pending'`,
      [userId]
    );
    return rows;
  },

  async respondToRequest(requestId, status) {
  // Cập nhật status
  await db.query(
    "UPDATE friend_requests SET status = ? WHERE id = ?",
    [status, requestId]
  );

  // Truy vấn lại để lấy row đã cập nhật
  const [rows] = await db.query(
    "SELECT * FROM friend_requests WHERE id = ?",
    [requestId]
  );

  return rows[0]; // Trả về dòng đã cập nhật
},


  async getFriends(userId) {
    const [rows] = await db.query(
      `SELECT DISTINCT u.id, u.name, u.email, u.avt
       FROM friend_requests fr
       JOIN users u 
       ON (u.id = fr.sender_id AND fr.receiver_id = ?) 
       OR (u.id = fr.receiver_id AND fr.sender_id = ?)
       WHERE fr.status = 'accepted' AND u.id != ?`,
      [userId, userId, userId]
    );
    return rows;
  },

  async alreadySent(senderId, receiverId) {
    const [rows] = await db.query(
      `SELECT * FROM friend_requests
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)`,
      [senderId, receiverId, receiverId, senderId]
    );
    return rows.length > 0;
  },
  async searchUsersByName(query, currentUserId) {
  const [rows] = await db.query(
    `
    SELECT 
      u.id, 
      u.name, 
      u.avt,
      EXISTS (
        SELECT 1 FROM friend_requests fr 
        WHERE (
          (fr.sender_id = ? AND fr.receiver_id = u.id) OR
          (fr.receiver_id = ? AND fr.sender_id = u.id)
        )
        AND fr.status = 'accepted'
      ) AS isFriend,
      EXISTS (
        SELECT 1 FROM friend_requests fr 
        WHERE fr.sender_id = ? AND fr.receiver_id = u.id AND fr.status = 'pending'
      ) AS isPending
    FROM users u
    WHERE u.name LIKE ? AND u.id != ?
    `,
    [currentUserId, currentUserId, currentUserId, `%${query}%`, currentUserId]
  );

  return rows.map((u) => ({
    ...u,
    isFriend: !!u.isFriend,
    isPending: !!u.isPending,
  }));
},
async isFriend(userId1, userId2) {
  const [rows] = await db.query(
    `SELECT 1 FROM friend_requests
     WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
       AND status = 'accepted'`,
    [userId1, userId2, userId2, userId1]
  );
  return rows.length > 0;
}

}

module.exports = FriendRequest;
