const express = require('express');
const protect = require('../middleware/Authmiddleware');

const {
  createPlaylist,
  getPlaylists,
  getPlaylist,
  deletePlaylist,
  addMusicToPlaylist,
  removeMusicFromPlaylist
} = require('../Controller/playListController');
const router = express.Router();

//protect, addMusicToPlaylist
router.post('/:playlistId/addMusic/:musicId',protect, addMusicToPlaylist);
router.post('/create', protect, createPlaylist);
router.get('/list', protect, getPlaylists);
router.get('/:id', protect, getPlaylist);
router.delete('/:id', protect, deletePlaylist);
router.delete('/:playlistId/removeMusic/:musicId', protect, removeMusicFromPlaylist);


module.exports = router;
