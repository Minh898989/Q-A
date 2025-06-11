const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");

router.post("/request", friendController.sendRequest);
router.get("/incoming/:userId", friendController.getIncomingRequests);
router.post("/respond", friendController.respondToRequest);
router.get("/list/:userId", friendController.getFriends);
router.get("/search", friendController.searchUsers);
router.get("/incoming-count/:userId", friendController.countIncomingRequests);

module.exports = router;
