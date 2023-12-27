const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel');
const Listener = require('../Model/listenerModel');
const Music = require('../Model/musicModel');
const { default: mongoose } = require('mongoose');

const router = express.Router();
// Route to handle listening to music
router.post('/listen/:musicId', asyncHandler(async (req, res) => {
    const { musicId } = req.params;
    const userId = req.user ? req.user._id : req.listener._id;
  
    if (!mongoose.Types.ObjectId.isValid(musicId)) {
      res.status(400).json({ error: 'Invalid musicId' });
      return;
    }
  
    const UserModel = req.user ? User : Listener;
  
    try {
      const [user, music] = await Promise.all([
        UserModel.findById(userId),
        Music.findById(musicId),
      ]);
  
      if (!user || !music) {
        res.status(404).json({ error: 'User or music not found' });
        return;
      }
  
     
    //   user.points += 1;
      user.listenedSongs.push(musicId);

      if (user.listenedSongs.length % 4 === 0) {
        user.points += 1;
      }
  
      // Check if the count of listened songs is a multiple of 4
      const shouldPlayAdvertisement = user.listenedSongs.length % 4 === 0;
  
      await user.save();
  
      res.status(200).json({
        message: 'Song listened successfully',
        playAdvertisement: shouldPlayAdvertisement,
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }));
  
  module.exports = router;