// controllers/favoriteController.js
const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel');
const Listener = require('../Model/listenerModel');
const Favorite = require('../Model/favoriteModel');
const { default: mongoose } = require('mongoose');

// Add music to favorites
const addFavorite = asyncHandler(async (req, res) => {
    const { musicId } = req.params;
  
    const userId = req.user ? req.user._id : req.listener._id;
  
    const userOrListener = req.user ? User : Listener;
    const userWithFavorites = await userOrListener.findById(userId);
  
    if (!userWithFavorites) {
      res.status(404);
      throw new Error(`${req.user ? 'User' : 'Listener'} not found`);
    }
  
    // Check if the music is already in favorites
    if (!userWithFavorites.favorites.includes(musicId)) {
      userWithFavorites.favorites.push(musicId);
      await userWithFavorites.save();
      res.status(201).json({ message: 'Music added to favorites successfully' });
    } else {
      res.status(400).json({ message: 'Music is already in favorites' });
    }
  });

// Remove music from favorites
const removeFavorite = asyncHandler(async (req, res) => {
    const { musicId } = req.params;
  
    const userId = req.user ? req.user._id : req.listener._id;
  
    const userOrListener = req.user ? User : Listener;
    const userWithFavorites = await userOrListener.findById(userId);
  
    if (!userWithFavorites) {
      res.status(404);
      throw new Error(`${req.user ? 'User' : 'Listener'} not found`);
    }
  
    // Check if the music is in favorites
    const index = userWithFavorites.favorites.indexOf(musicId);
    if (index !== -1) {
      userWithFavorites.favorites.splice(index, 1);
      await userWithFavorites.save();
      res.status(200).json({ message: 'Music removed from favorites successfully' });
    } else {
      res.status(404).json({ message: 'Music not found in favorites' });
    }
  });


// Get all music details in favorites
const getAllFavoriteMusic = asyncHandler(async (req, res) => {
    const userId = req.user ? req.user._id : req.listener._id;
  
    const userOrListener = req.user ? User : Listener;
    const userWithFavorites = await userOrListener
      .findById(userId)
      .populate({
        path: 'favorites',
        model: 'Music', 
      });
  
    if (!userWithFavorites) {
      res.status(404);
      throw new Error(`${req.user ? 'User' : 'Listener'} not found`);
    }
  
    const favoritesWithMusicDetails = userWithFavorites.favorites.map((musicId) => {
      return {
        id: musicId._id,
        title: musicId.title,
        artist: musicId.artist,
        audio: musicId.audio,
        image:musicId.image
      };
    });
  
    res.status(200).json(favoritesWithMusicDetails);
  });
  
  

module.exports = { addFavorite, removeFavorite, getAllFavoriteMusic };

// asyncHandler(async (req, res) => {
//     // Assume req.user or req.listener is available based on authentication middleware
//     const userId = req.user ? req.user._id : req.listener._id;
  
//     const userOrListener = req.user ? User : Listener;
//     const userWithFavorites = await userOrListener.findById(userId).populate({
//       path: 'favorites',
//       populate: {
//                 path: 'music',
//                 model: 'Music', // Adjust this to match your music model name
//               }
//     });
  
//     if (!userWithFavorites) {
//       res.status(404);
//       throw new Error(`${req.user ? 'User' : 'Listener'} not found`);
//     }
  
//         const favoritesWithMusicDetails = userWithFavorites.favorites.map((favorite) => ({
//           id: favorite.music._id,
//           title: favorite.music.title,
//           artist: favorite.music.artist,
//           music : favorite.music.audio
//           // Add other music details as needed
//         }));
      
//         res.status(200).json(favoritesWithMusicDetails);
//       });