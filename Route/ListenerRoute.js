const express = require('express');
const { registerListener, loginListener, logOutListener, getListener, loggedInStatus, UpdateListener, ChangePassword, forgotpassword, resetPassword } = require('../Controller/ListenerController.js');
const protect = require('../middleware/listenermiddleware');
const router = express.Router()


router.post("/register", registerListener)
router.post('/login', loginListener)
router.get('/logout', logOutListener);
router.get('/getuser',protect, getListener);
router.get('/loggedin', loggedInStatus);
router.patch('/updateuser',protect, UpdateListener);
router.patch('/changepassword',protect, ChangePassword);
router.post('/forgotpassword', forgotpassword)
router.put('/resetpassword/:resetToken', resetPassword)

module.exports = router