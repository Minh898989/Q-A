const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");

router.get("/total/:userId", NotificationController.getTotalNotifications);

module.exports = router;
