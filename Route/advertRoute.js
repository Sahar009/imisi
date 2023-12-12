const express = require('express');
const router = express.Router();
const advertisementController = require('../Controller/advertController');

router.get('/play', (res,req) =>{
res.send('dsdsds')
})
//.get(advertisementController.playAdvertisement);

module.exports = router;
