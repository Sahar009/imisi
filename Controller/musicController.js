const async_handler = require("express-async-handler");
const MusicModel = require("../Model/musicModel"); // Make sure to import your model correctly
const { fileSizeFormatter } = require("../utility/uploads");
const cloudinary = require("cloudinary").v2;

const addMusic = async_handler(async (req, res) => {
  const { name, description, genre } = req.body;

  // Validation
  if (!name || !genre) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Upload image
  let imageFileData = {};
  if (req.files && req.files['image'] && req.files['image'][0]) {
    try {
      const uploadedImage = await cloudinary.uploader.upload(req.files['image'][0].path, {
        folder: "imisi audio",
        resource_type: "image",
        cloud_name: 'dvjdvvnn3', 
        api_key: '897445842132443', 
        api_secret: 'H1XjbfjR1TOhWQeEhSjZWXcGyzs' 
      });

      imageFileData = {
        fileName: req.files['image'][0].originalname,
        filePath: uploadedImage.secure_url,
        fileType: req.files['image'][0].mimetype,
        fileSize: fileSizeFormatter(req.files['image'][0].size, 2),
      };
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      res.status(500).json({ error: "Image could not be uploaded", details: error.message });
      return;
    }
  }

  // Upload audio
  let audioFileData = {};
  if (req.files && req.files['audio'] && req.files['audio'][0]) {
    try {
      const uploadedAudio = await cloudinary.uploader.upload(req.files['audio'][0].path, {
        folder: "imisi audio",
        resource_type: "auto",
        cloud_name: 'dvjdvvnn3', 
        api_key: '897445842132443', 
        api_secret: 'H1XjbfjR1TOhWQeEhSjZWXcGyzs' 
      });
     
      audioFileData = {
        fileName: req.files['audio'][0].originalname,
        filePath: uploadedAudio.secure_url,
        fileType: req.files['audio'][0].mimetype,
        fileSize: fileSizeFormatter(req.files['audio'][0].size, 2),
      };
    } catch (error) {
      console.error("Error uploading audio to Cloudinary:", error);
  res.status(500).json({ error: "Audio could not be uploaded", details: error.message });
  return;
    }
  }

  // Create music
  const createdMusic = await MusicModel.create({
    user: req.user.id,
    name,
    genre,
    description,
    image: imageFileData,
    audio: audioFileData,
  });

  res.status(201).json(createdMusic);
});

// // get all musics
const getMusics = async_handler(async (req, res) => {
  // Assuming you have a MusicModel defined

  // Use the 'find' method to retrieve all music records
  const musics = await MusicModel.find().sort('-createdAt');

  // Respond with a JSON containing all the retrieved music records
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
// const deleteMusic = async_handler(async (req, res) => {
//     const music = await Music.findById(req.params.id);
//     // if Music doesnt exist
//     if (!music) {
//       res.status(404);
//       throw new Error("Music not found");
//     }
//     // Match Music to its user
//     if (music.user.toString() !== req.user.id) {
//       res.status(401);
//       throw new Error("User not authorized");
//     }
//     await music.deleteOne();
//     res.status(200).json({ message: "Music successfully deleted." });
//   });


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
  


module.exports ={
    addMusic,
    getMusics,
    getMusic,
    // // updateMusic,
    // deleteMusic
    
}