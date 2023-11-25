
const express = require('express');
const router = express.Router()
const protect = require('../middleware/Authmiddleware');
const { addMusic, getMusics, getMusic, deleteMusic, updateMusic} = require('../Controller/musicController');
const { upload } = require("../utility/uploads");

router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), addMusic);
router.get('/',protect,  getMusics);
router.get("/:id", protect,getMusic);
// router.delete("/:id", protect, deleteMusic);
// router.patch("/:id", protect, upload.single("image"), updateMusic);

module.exports = router