const async_handler = require('express-async-handler');
const Advertisement = require('../Model/advertModel');
const {upload, fileSizeFormatter } = require("../utility/uploads");
const cloudinary = require("cloudinary").v2;
const multer = require('multer');

const createAdvertisement = async_handler(async (req, res) => {
  const { type, link } = req.body;

  if (!type || !link) {
    res.status(400).json({ error: 'Invalid request parameters' });
    return;
  }

  try {
    // Find the existing advertisement (assuming you have a single document for all advertisements)
    let existingAdvertisement = await Advertisement.findOne();

    // If no existing document, create a new one
    if (!existingAdvertisement) {
      existingAdvertisement = await Advertisement.create({});
    }

    // Push the new advertisement into the array
    existingAdvertisement.advertisements.push({ type, content: { [type]: { link } } });

    // Save the updated document
    const updatedAdvertisement = await existingAdvertisement.save();

    res.status(201).json(updatedAdvertisement);
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//play random advert
const playRandomAdvertisement = async_handler(async (req, res) => {
  // Retrieve all advertisements
  const advertisement = await Advertisement.findOne();

  if (!advertisement || !advertisement.advertisements || advertisement.advertisements.length === 0) {
    res.status(404);
    throw new Error('No advertisements available');
  }

  // Choose a random advertisement
  const randomIndex = Math.floor(Math.random() * advertisement.advertisements.length);
  const randomAd = advertisement.advertisements[randomIndex];

  // Logic to play the advertisement (you may have a different mechanism)
  console.log(`Playing Advertisement: ${randomAd.content}`);

  // Assuming 'link' is the property where you store the video link
  const videoLink = randomAd.content.video.link;

  res.status(200).json({ message: 'Advertisement played successfully', videoLink });
});

module.exports = {
  playRandomAdvertisement,
  createAdvertisement,
};
