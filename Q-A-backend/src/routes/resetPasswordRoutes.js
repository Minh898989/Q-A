const express = require("express");
const router = express.Router();
const controller = require("../controllers/resetPasswordController");

router.post("/reset-password", controller.requestReset);
router.get("/admin/reset-requests", controller.listPending);
router.post("/admin/reset-confirm", controller.confirmReset);
router.get("/admin/reset-history", controller.history);
module.exports = router;
