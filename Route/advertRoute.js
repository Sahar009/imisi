const express = require('express');
const router = express.Router();
const advertisementController = require('../Controller/advertController');
const protect = require('../middleware/Authmiddleware');
const {createAdvertisement,playRandomAdvertisement} =require('../Controller/advertController')


//create adverts
router.post('/create',createAdvertisement)
//play adverts 
router.get('/play',playRandomAdvertisement)

module.exports = router;
