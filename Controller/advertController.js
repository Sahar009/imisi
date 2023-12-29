const async_handler = require('express-async-handler');
const Advertisement = require('../Model/advertModel');
const {upload, fileSizeFormatter } = require("../utility/uploads");
const cloudinary = require("cloudinary").v2;
const multer = require('multer');

const createAdvertisement = async_handler(async (req, res) => {
  const { type, duration } = req.body;

  // Validate request parameters
  if (!type || !['audio', 'video'].includes(type) || !duration) {
    res.status(400);
    throw new Error('Invalid request parameters');
  }

  let contentData = {};

  // Check if the request contains an audio or video file
  if (type === 'audio' && req.files && req.files['audio']) {
    const audioFile = req.files['audio'][0];
    contentData.audio = await uploadFile(audioFile);
  } else if (type === 'video' && req.files && req.files['video']) {
    const videoFile = req.files['video'][0];
    contentData.video = await uploadFile(videoFile);
  } else {
    res.status(400);
    throw new Error('Please provide a valid audio or video file');
  }

  // Create the advertisement
  const createdAdvertisement = await Advertisement.create({
    type,
    content: contentData,
    duration,
  });

  res.status(201).json({ message: 'Advertisement created successfully', advertisement: createdAdvertisement });
});

// Helper function to upload a file to Cloudinary
const uploadFile = async (file) => {
  try {
    const uploadedFile = await cloudinary.uploader.upload(file.path, {
      folder: 'imisi audio',
      resource_type: 'auto',
    });

    return {
      fileName: file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: file.mimetype,
    };
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error('File could not be uploaded');
  }
};



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

  res.status(200).json({ message: 'Advertisement played successfully', advertisement: randomAd });
});

module.exports = {
  playRandomAdvertisement,
  createAdvertisement,
};
