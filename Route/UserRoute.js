const express = require('express');
const { registerUser, loginUser, logOutUser, getUser, loggedInStatus, UpdateUser, ChangePassword, forgotpassword, resetPassword } = require('../Controller/UserController');
const protect = require('../middleware/Authmiddleware');
const router = express.Router()


router.post("/register",protect,registerUser)
router.post('/login',protect, loginUser)
router.post('/logout',protect, logOutUser);
router.get('/getuser',protect, getUser);
router.get('/loggedin', loggedInStatus);
router.patch('/updateuser',protect, UpdateUser);
router.patch('/changepassword',protect, ChangePassword);
router.post('/forgotpassword', forgotpassword)
router.put('/resetpassword/:resetToken', resetPassword)

module.exports = router