const FriendRequest = require("../models/FriendRequest");
const Message = require("../models/Message");

exports.getTotalNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await FriendRequest.getIncomingRequests(userId);
    const totalUnread = await Message.countTotalUnreadByUser(userId);

    res.json({
      userId,
      totalFriendRequests: requests.length,
      totalUnreadMessages: totalUnread,
      totalNotifications: requests.length + totalUnread
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy tổng thông báo:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};
