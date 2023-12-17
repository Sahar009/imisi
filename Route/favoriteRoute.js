// routes/favoriteRoutes.js
const express = require('express');
const protect = require('../middleware/Authmiddleware');
const { addFavorite, getAllFavoriteMusic,removeFavorite } = require('../Controller/favoriteController');

const router = express.Router();

// Add music to favorites
router.post('/favorites/:musicId', protect, addFavorite);

router.delete('/favorites/:musicId', protect, removeFavorite);
router.get('/favorites/music', protect, getAllFavoriteMusic);

module.exports = router;
