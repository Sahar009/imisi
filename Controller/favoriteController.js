// controllers/favoriteController.js
const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel');
const Listener = require('../Model/listenerModel');
const Favorite = require('../Model/favoriteModel');
const { default: mongoose } = require('mongoose');
// Add music to favorites

const addFavorite = asyncHandler(async (req, res) => {
    const { musicId } = req.params;
  
    // Assume req.user or req.listener is available based on authentication middleware
    const userId = req.user ? req.user._id : req.listener._id;
  
    // Validate if musicId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(musicId)) {
      res.status(400);
      throw new Error('Invalid musicId');
    }
  
    // Check if the user or listener already has the music in favorites
    const userOrListener = req.user ? User : Listener;
    const existingFavorite = await userOrListener.findOne({
      _id: userId,
      'favorites.music': musicId,
    });
  
    if (existingFavorite) {
      res.status(400);
      throw new Error('Music is already in favorites');
    }
  
    // Create a new Favorite instance
    const favorite = new Favorite({
      user: userId,
      music: musicId,
    });
  
    // Save the new Favorite instance
    await favorite.save();
  
    res.status(201).json({ message: 'Music added to favorites successfully' });
  });

// Get all favorites for the user or listener
const getAllFavorites = asyncHandler(async (req, res) => {
    // Assume req.user or req.listener is available based on authentication middleware
    const userId = req.user ? req.user._id : req.listener._id;
  
    const userOrListener = req.user ? User : Listener;
    const userWithFavorites = await userOrListener.findById(userId).populate({
      path: 'favorites',
      populate: {
                path: 'music',
                model: 'Music', // Adjust this to match your music model name
              }
    });
  
    if (!userWithFavorites) {
      res.status(404);
      throw new Error(`${req.user ? 'User' : 'Listener'} not found`);
    }
  
        const favoritesWithMusicDetails = userWithFavorites.favorites.map((favorite) => ({
          id: favorite.music._id,
          title: favorite.music.title,
          artist: favorite.music.artist,
          music : favorite.music.audio
          // Add other music details as needed
        }));
      
        res.status(200).json(favoritesWithMusicDetails);
      });
  
  
  
module.exports = { addFavorite, getAllFavorites };
