// routes/favoriteRoutes.js
const express = require('express');
const protect = require('../middleware/Authmiddleware');
const { addFavorite, getAllFavorites } = require('../Controller/favoriteController');

const router = express.Router();

// Add music to favorites
router.post('/favorites/:musicId', protect, addFavorite);

// Get all favorites for the user or listener
router.get('/favorites', protect, getAllFavorites);

module.exports = router;
