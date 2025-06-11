const express=require("express")
const router=express.Router();
const authController=require('../controllers/authController');
const authenticateToken = require("../middlewares/auth.middleware");
const { upload } = require('../config/cloudinary'); 
const adminController = require('../controllers/adminController'); 

router.post('/register',authController.createUser)
router.post('/login',authController.login)
router.get('/profile',authenticateToken,authController.getProfile)
router.post('/upload-avatar', authenticateToken, upload.single('avatar'), authController.uploadAvatar);
router.patch('/lock-user', authenticateToken, adminController.lockUser);
router.patch('/unlock-user', authenticateToken, adminController.unlockUser);
module.exports = router;