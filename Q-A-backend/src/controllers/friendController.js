const FriendRequest = require("../models/FriendRequest");

exports.sendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  const already = await FriendRequest.alreadySent(senderId, receiverId);
  if (already) return res.status(400).json({ message: "Request already sent or exists" });

  await FriendRequest.sendRequest(senderId, receiverId);
  req.io.to(`notification-${receiverId}`).emit("notificationUpdate");

  res.json({ message: "Friend request sent" });
};

exports.getIncomingRequests = async (req, res) => {
  const { userId } = req.params;
  const requests = await FriendRequest.getIncomingRequests(userId);
  res.json(requests);
};

exports.respondToRequest = async (req, res) => {
  const { requestId, status } = req.body;
  const updatedRequest = await FriendRequest.respondToRequest(requestId, status);
  const { receiver_id } = updatedRequest;

  req.io.to(`notification-${receiver_id}`).emit("notificationUpdate");
  
  
  res.json({ message: "Request updated" });
};

exports.getFriends = async (req, res) => {
  const { userId } = req.params;
  const friends = await FriendRequest.getFriends(userId);
  res.json(friends);
};

exports.searchUsers = async (req, res) => {
  const { query, userId } = req.query;
 
  try {
    const results = await FriendRequest.searchUsersByName(query, userId);
    
    res.json(results);
  } catch (err) {
    console.error("❌ searchUsers error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.countIncomingRequests = async (req, res) => {
  const { userId } = req.params;
  const requests = await FriendRequest.getIncomingRequests(userId);
  res.json({ count: requests.length });
};

