const express=require("express")
const router=express.Router();
const userController=require("../controllers/usersController");
const { checkPermission } = require("../middlewares/check.middleware");

router.get('/',userController.getAllUsers)
router.get('/:id',userController.getUserById)
router.put('/:id',userController.updateUser)
router.delete('/:id',userController.deleteUser)
router.patch('/:id/role', userController.updateUserRole);

module.exports=router