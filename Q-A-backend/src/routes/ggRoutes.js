const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../config/gg"); // Load cấu hình Google Strategy
const ggController = require("../controllers/ggController");

// Bước 1: Gửi người dùng đến Google để xác thực
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Bước 2: Google trả về → xử lý callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  ggController.googleLoginCallback
);

module.exports = router;
