const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const ResetPasswordModel = require("../models/resetPasswordModel");


const generatePassword = () => Math.random().toString(36).slice(-8);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "minhhh270805@gmail.com",
    pass: "qofx twiw vasx ieft"
  }
});

const ResetPasswordController = {
  
  requestReset: async (req, res) => {
    try {
      const { email } = req.body;
      const exists = await ResetPasswordModel.isUserExist(email);
      if (!exists) {
        return res.status(400).json({ error: "Email không tồn tại trong hệ thống." });
      }
      const alreadyRequested = await ResetPasswordModel.hasPendingRequest(email);
      if (alreadyRequested) {
        return res.status(400).json({ error: "Yêu cầu đang được xử lý. Vui lòng chờ." });
      }
      await ResetPasswordModel.createRequest(email);
      res.json({ message: "Yêu cầu đặt lại mật khẩu đã được gửi đến admin." });
    } catch (err) {
      console.error("Error in requestReset:", err);
      res.status(500).json({ error: "Lỗi máy chủ." });
    }
  },

  // Lấy danh sách các yêu cầu đang chờ xử lý
  listPending: async (req, res) => {
    try {
      const pendingRequests = await ResetPasswordModel.findAllPending();
      res.json(pendingRequests);
    } catch (err) {
      console.error("Error in listPending:", err);
      res.status(500).json({ error: "Lỗi máy chủ." });
    }
  },

  // Xác nhận reset mật khẩu
  confirmReset: async (req, res) => {
    try {
      const { email } = req.body;
      const newPassword = generatePassword();
      const hashed = await bcrypt.hash(newPassword, 10);

      await ResetPasswordModel.updatePassword(email, hashed);
      await ResetPasswordModel.markAsDone(email);

      await transporter.sendMail({
        from: "minhhh270805@gmail.com",
        to: email,
        subject: "Mật khẩu mới của bạn",
        text: `Mật khẩu mới của bạn là: ${newPassword}`
      });

      res.json({ message: "Mật khẩu mới đã được gửi." });
    } catch (err) {
      console.error("Error in confirmReset:", err);
      res.status(500).json({ error: "Không thể gửi mật khẩu mới." });
    }
  },
  history: async (req, res) => {
  try {
    const completedRequests = await ResetPasswordModel.findAllCompleted();
    res.json(completedRequests);
  } catch (err) {
    console.error("Error in history:", err);
    res.status(500).json({ error: "Lỗi máy chủ." });
  }
},
};

module.exports = ResetPasswordController;
