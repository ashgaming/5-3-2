const express = require('express')
const router = express.Router();
const { body , query } = require("express-validator")
const userController = require('../controllers/users.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/register',[
   body('email').isEmail().withMessage('Invalid Email'),
   body('firstname').isLength({min:3}).withMessage('First name must be 3 character long'),
   body('lastname').isLength({min:3}).withMessage('Last name must be 3 character long'),
   body('password').isLength({min:8}).withMessage('Password must be 8 letter long')
],userController.registerUser)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:8}).withMessage('Password must be 8 letter long')
],userController.loginUser)


router.get('/profile',authMiddleware.authUser,userController.getUserProfile)
router.get('/logout',authMiddleware.authUser,userController.logoutUser)


module.exports = router;