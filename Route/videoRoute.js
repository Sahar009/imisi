
const express = require('express');
const router = express.Router()
const protect = require('../middleware/Authmiddleware');
const { upload } = require("../utility/uploads");
const { addVideo, getVideo, getVideos, deleteVideo } = require('../Controller/videoController');

router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), addVideo);
// // For regular users
router.get('/', getVideos);


router.get("/:id",getVideo);
router.delete("/:id", protect, deleteVideo);

module.exports = router