const db = require('../config/db'); 

const User = {
  
  async findAll() {
    const [rows] = await db.query(`SELECT * FROM users`);
    return rows;
  },
  
  
  async create({ name, email, password_hash, role = 'student', is_active = 1,isLock = false }) {
    const [result] = await db.query(
      `INSERT INTO users (name, email, password_hash, role, is_active,isLock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password_hash, role, is_active, isLock]
    );

    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    return rows[0];
  },

 
  async findByEmail(email) {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
  },

  
  async findById(id) {
    const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0];
  },

 
  async getJoinedGroups(userId) {
    const [rows] = await db.query(
      `SELECT g.*
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = ?`,
      [userId]
    );
    return rows;
  },

  
  async getGroupMemberships(userId) {
    const [rows] = await db.query(
      `SELECT * FROM group_members WHERE user_id = ?`,
      [userId]
    );
    return rows;
  },

  
  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const key in updates) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }

    values.push(id);

    await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  
  async delete(id) {
    const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]); // lấy dữ liệu trước khi xóa
    await db.query(`DELETE FROM users WHERE id = ?`, [id]);
    return rows[0];
  },
  
};

module.exports = User;
