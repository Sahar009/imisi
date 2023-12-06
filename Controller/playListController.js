const asyncHandler = require('express-async-handler');
const PlaylistModel = require('../Model/playlistModel');

const createPlaylist = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Validation
  if (!name) {
    res.status(400);
    throw new Error('Please provide a name for the playlist');
  }

  // Create playlist
  const createdPlaylist = await PlaylistModel.create({
    user: req.user.id,
    name,
    
  });

  res.status(201).json(createdPlaylist);
});

const getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await PlaylistModel.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json(playlists);
});

const getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await PlaylistModel.findById(req.params.id).populate('musics');
  if (!playlist) {
    res.status(404);
    throw new Error('Playlist not found');
  }
  res.status(200).json(playlist);
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await PlaylistModel.findById(req.params.id);
  if (!playlist) {
    res.status(404);
    throw new Error('Playlist not found');
  }
  if (playlist.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await playlist.deleteOne();
  res.status(200).json({ message: 'Playlist successfully deleted.' });
});

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylist,
  deletePlaylist,
};
