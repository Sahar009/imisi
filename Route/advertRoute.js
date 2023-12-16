const express = require('express');
const router = express.Router();
const advertisementController = require('../Controller/advertController');
const protect = require('../middleware/Authmiddleware');

router.get('/play',  (req, res) => {
  res.send('dsdsds');
  // or you can call your advertisementController.playAdvertisement function here
});

module.exports = router;
