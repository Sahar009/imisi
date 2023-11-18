const async_handler = require("express-async-handler");
const MusicModel = require("../Model/musicModel"); // Make sure to import your model correctly
const { fileSizeFormatter } = require("../utility/uploads");
const cloudinary = require("cloudinary").v2;

const addMusic = async_handler(async (req, res) => {
  const { name, description, genre, audio } = req.body;

  // validation
  if (!name || !genre) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // upload music
  let fileData = {};
  if (req.file) {
    // Save audio to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "imisi audio",
        resource_type: "audio",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Song could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // create music
  const createdMusic = await MusicModel.create({
    user: req.user.id,
    name,
    genre,
    description,
    audio: fileData,
  });

  res.status(201).json(createdMusic);
});

// // get all musics
// const getMusics = async_handler(async(req,res) =>{
// const musics = await Music.find({user:req.user.id}).sort('-createdAt')
// // user:req.user.id
// res.status(200).json(musics)
// })

// // Get single music
// const getMusic = async_handler(async (req, res) => {
//     const music = await Music.findById(req.params.id);
//     // if music doesnt exist
//     if (!music) {
//       res.status(404);
//       throw new Error("music not found");
//     }
//     // Match music to its user
//     if (music.user.toString() !== req.user.id) {
//       res.status(401);
//       throw new Error("User not authorized");
//     }
//     res.status(200).json(music);
//   });


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
    // getMusics,
    // getMusic,
    // // updateMusic,
    // deleteMusic
    
}