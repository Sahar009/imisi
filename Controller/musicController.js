const async_handler = require("express-async-handler");
const MusicModel = require("../Model/musicModel"); 
const { fileSizeFormatter } = require("../utility/uploads");
const cloudinary = require("cloudinary").v2;
const jwt = require('jsonwebtoken');
const Favorite = require('../Model/favoriteModel')


const addMusic = async_handler(async (req, res) => {
  const { name, description, genre, artist } = req.body;

  // Validation
  if (!name || !genre || !artist) {
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

  // Check if both audio and image files are present
  if (!req.files || !req.files['audio'] || !req.files['image']) {
    res.status(400);
    throw new Error('Please add both an audio and an image file.');
  }

  // Upload image
  let imageFileData = {};
  if (req.files && req.files['image'] && req.files['image'][0]) {
    try {
      const uploadedImage = await cloudinary.uploader.upload(req.files['image'][0].path, {
        folder: 'imisi audio',
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

  // Upload audio
  let audioFileData = {};
  if (req.files && req.files['audio'] && req.files['audio'][0]) {
    try {
      const uploadedAudio = await cloudinary.uploader.upload(req.files['audio'][0].path, {
        folder: 'imisi audio',
        resource_type: 'auto',
      });

      audioFileData = {
        fileName: req.files['audio'][0].originalname,
        filePath: uploadedAudio.secure_url,
        fileType: req.files['audio'][0].mimetype,
        fileSize: fileSizeFormatter(req.files['audio'][0].size, 2),
      };
    } catch (error) {
      console.error('Error uploading audio to Cloudinary:', error);
      res.status(500).json({ error: 'Audio could not be uploaded', details: error.message });
      return;
    }
  }

  // Create music
  const createdMusic = await MusicModel.create({
    user: userId,
    name,
    genre,
    artist,
    description,
    image: imageFileData,
    audio: audioFileData,
  });

  res.status(201).json({ message: 'Music created successfully', music: createdMusic });
});

// Get all musics
const getMusics = async_handler(async (req, res) => {
 
  const musics = await MusicModel.find().sort('-createdAt');


  res.status(200).json(musics);
});



// // Get single music
const getMusic = async_handler(async (req, res) => {
  const music = await MusicModel.findById(req.params.id);

  if (!music) {
    res.status(404);
    throw new Error("Music not found");
  }

  res.status(200).json(music);
});



//   // Delete Music
const deleteMusic = async_handler(async (req, res) => {
    const music = await MusicModel.findById(req.params.id);
    // if Music doesnt exist
    if (!music) {
      res.status(404);
      throw new Error("Music not found");
    }
    // Match Music to its user
    if (music.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }
    await music.deleteOne();
    res.status(200).json({ message: "Music successfully deleted." });
  });


  // update Music
//   const updateMusic = async_handler(async (req, res) => {
//     const {name, genre, description,  } =req.body
//     const { id } = req.params;
  
//     const music = await Music.findById(id);
  
//     // if Music doesnt exist
//     if (!music) {
//       res.status(404);
//       throw new Error("student not found");
//     }
//     // Match Music to its user
//     if (music.user.toString() !== req.user.id) {
//       res.status(401);
//       throw new Error("User not authorized");
//     }
  
//     // Handle songs upload
//     let fileData = {};
//     if (req.file) {
//       // Save songs to cloudinary
//       let uploadedFile;
//       try {
//         uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//           folder: "imisi audio",
//           resource_type: "audio",
//         });
//       } catch (error) {
//         res.status(500);
//         throw new Error("song could not be uploaded");
//       }
  
//       fileData = {
//         fileName: req.file.originalname,
//         filePath: uploadedFile.secure_url,
//         fileType: req.file.mimetype,
//         fileSize: fileSizeFormatter(req.file.size, 2),
//       };
//     }
  
//     // Update student
//     const updatedstudent = await Student.findByIdAndUpdate(
//       { _id: id },
//       {
//         name,
//         description,
//         course,
//         paid,
//         phone,
//         image: Object.keys(fileData).length === 0 ? student?.image : fileData,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
  
//     res.status(200).json(updatedstudent);
//   });
  

//add music to favorite

// const addMusicToFavorites = async_handler(async (req, res) => {
//   const { musicId } = req.params;

//   // Check if the music is already in favorites
//   const existingFavorite = await Favorite.findOne({
//     user: req.user._id,
//     music: musicId,
//   });

//   if (existingFavorite) {
//     res.status(400);
//     throw new Error('Music is already in favorites');
//   }

//   // Create a new favorite
//   const favorite = await Favorite.create({
//     user: req.user._id,
//     music: musicId,
//   });

//   // Add the favorite to the user's favorites array
//   req.user.favorites.push(favorite._id);
//   await req.user.save();

//   res.status(200).json({ message: 'Music added to favorites successfully' });
// });








module.exports ={
    addMusic,
    getMusics,
    getMusic,
    // // updateMusic,
    deleteMusic,
    // addMusicToFavorites
    
} 