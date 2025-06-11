const authenticateToken = require("../middlewares/auth.middleware");
const express = require("express")
const router = express.Router();
const tagController = require('../controllers/tag.controller')

router.get('/', authenticateToken, tagController.getAllTags);

module.exports = router;