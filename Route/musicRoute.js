
const express = require('express');
const router = express.Router()
const protect = require('../middleware/Authmiddleware');
const { addMusic, getMusics, getMusic, deleteMusic, updateMusic, addMusicToFavorites} = require('../Controller/musicController');
const { upload } = require("../utility/uploads");
const listenerProtect = require('../middleware/listenermiddleware');
const { getUserFavorites } = require('../Controller/UserController');
// const { getListenerFavorites } = require('../Controller/ListenerController');

router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), addMusic);
// // For regular users
router.get('/', protect, getMusics);


router.get("/:id", protect,getMusic);
router.delete("/:id", protect, deleteMusic);
// router.patch("/:id", protect, upload.single("image"), updateMusic);
// router.post('/:musicId/add', protect, addMusicToFavorites);
// router.get('/user/favorites', protect, getUserFavorites);


module.exports = router