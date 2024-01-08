const async_handler = require('express-async-handler');
const VideoModel = require('../Model/videoModel');
const { fileSizeFormatter } = require('../utility/uploads');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

const addVideo = async_handler(async (req, res) => {
  const { name, description, genre, artist } = req.body;

  // Validation
  if (!name || !description ||  !genre || !artist) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Check if the user is authenticated
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Unauthorized. Please provide a valid authentication token.');
  }

  const token = authToken.split(' ')[1];

  // Validate and decode the authentication token
  let userId;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    userId = decodedToken.id;
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401);
    throw new Error('Invalid authentication token.');
  }

  // Check if the video file is present
  if (!req.files || !req.files['video'] || !req.files['image']) {
    res.status(400);
    throw new Error('Please add a video file and thumbnail file.');
  }

   // Upload image
   let imageFileData = {};
   if (req.files && req.files['image'] && req.files['image'][0]) {
     try {
       const uploadedImage = await cloudinary.uploader.upload(req.files['image'][0].path, {
         folder: 'imisi videos/thumbnails',
         resource_type: 'image',
       });
 
       imageFileData = {
         fileName: req.files['image'][0].originalname,
         filePath: uploadedImage.secure_url,
         fileType: req.files['image'][0].mimetype,
         fileSize: fileSizeFormatter(req.files['image'][0].size, 2),
       };
     } catch (error) {
       console.error('Error uploading image to Cloudinary:', error);
       res.status(500).json({ error: 'Image could not be uploaded', details: error.message });
       return;
     }
   }
  // Upload video
  let videoFileData = {};
  if (req.files && req.files['video'] && req.files['video'][0]) {
    try {
      const uploadedVideo = await cloudinary.uploader.upload(req.files['video'][0].path, {
        folder: 'imisi videos',
        resource_type: 'video',
      });

      videoFileData = {
        fileName: req.files['video'][0].originalname,
        filePath: uploadedVideo.secure_url,
        fileType: req.files['video'][0].mimetype,
        fileSize: fileSizeFormatter(req.files['video'][0].size, 2),
      };
    } catch (error) {
      console.error('Error uploading video to Cloudinary:', error);
      res.status(500).json({ error: 'Video could not be uploaded', details: error.message });
      return;
    }
  }

  // Create video
  const createdVideo = await VideoModel.create({
    user: userId,
    name,
    artist,
    genre,
    description,
    image:imageFileData,
    video: videoFileData,
  });

  res.status(201).json({ message: 'Video created successfully', video: createdVideo });
});

// Get all videos
const getVideos = async_handler(async (req, res) => {
  const videos = await VideoModel.find().sort('-createdAt');
  res.status(200).json(videos);
});

// Get single video
const getVideo = async_handler(async (req, res) => {
  const video = await VideoModel.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  res.status(200).json(video);
});

// Delete Video
const deleteVideo = async_handler(async (req, res) => {
  const video = await VideoModel.findById(req.params.id);

  // if Video doesnt exist
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  // Match Video to its user
  if (video.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await video.deleteOne();
  res.status(200).json({ message: 'Video successfully deleted.' });
});

module.exports = {
  addVideo,
  getVideos,
  getVideo,
  deleteVideo,
};