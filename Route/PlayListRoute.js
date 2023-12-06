const express = require('express');
const protect = require('../middleware/listenermiddleware');
const {
  createPlaylist,
  getPlaylists,
  getPlaylist,
  deletePlaylist,
} = require('../Controller/playListController');
const router = express.Router();

router.post('/create', protect, createPlaylist);
router.get('/list', protect, getPlaylists);
router.get('/:id', protect, getPlaylist);
router.delete('/:id', protect, deletePlaylist);

module.exports = router;
