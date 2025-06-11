const Message = require("../models/Message");

exports.getChatHistory = async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    const messages = await Message.getByUsers(userId, friendId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

exports.sendMessage = async (req, res) => {
  const { sender_id, receiver_id, text } = req.body;
  let image_url = null;
  let file_url = null;

  if (req.file) {
    if (req.fileType === "image") {
      image_url = req.file.path;
    } else {
      file_url = req.file.path;
    }
  }


  const time_sent = new Date();

  try {
    
    const messageId = await Message.create({ sender_id, receiver_id, text, image_url, file_url, time_sent });

    const newMessage = {
      id: messageId,
      sender_id,
      receiver_id,
      text,
      image_url,
      file_url,
      time_sent
    };

    req.io.to(`chat-${receiver_id}`).emit("newMessage", newMessage);
    req.io.to(`notification-${receiver_id}`).emit("notificationUpdate");

    res.json(newMessage);
  } catch (err) {
    console.error("Lỗi gửi tin nhắn:", err);
    res.status(500).json({ message: "Lỗi khi gửi tin nhắn", error: err });
  }
};
exports.getUnreadCounts = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const counts = await Message.countUnreadMessages(userId);
    res.json(counts);
  } catch (err) {
    console.error("❌ Lỗi khi lấy số tin nhắn chưa đọc:", err);
    res.status(500).json({ message: "Lỗi khi lấy số tin nhắn chưa đọc", error: err });
  }
};
exports.markMessagesAsRead = async (req, res) => {
  const { userId, friendId } = req.body;
  
  try {
    await Message.markAsRead(userId, friendId);
    req.io.to(`notification-${userId}`).emit("notificationUpdate");
    res.json({ message: "Đã đánh dấu các tin nhắn là đã đọc" });
  } catch (err) {
    console.error("❌ Lỗi khi đánh dấu tin nhắn đã đọc:", err);
    res.status(500).json({ message: "Lỗi khi đánh dấu đã đọc", error: err });
  }
};
exports.getTotalUnreadByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const totalUnread = await Message.countTotalUnreadByUser(userId);
    res.json({ userId, totalUnread });
  } catch (err) {
    console.error("❌ Lỗi khi lấy tổng số tin nhắn chưa đọc của user:", err);
    res.status(500).json({ message: "Lỗi khi lấy tổng số tin nhắn chưa đọc", error: err });
  }
};
