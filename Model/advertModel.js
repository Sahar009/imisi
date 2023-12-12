const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ['audio', 'video'],
    required: true,
  },
  content: {
    // For audio, you might store the audio file information
    audio: {
      fileName: String,
      filePath: String,
      fileType: String,
      // Add other audio-related fields as needed
    },
    // For video, you might store the video file information
    video: {
      fileName: String,
      filePath: String,
      fileType: String,
      // Add other video-related fields as needed
    },
    // required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  // Add other fields as needed
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
module.exports = Advertisement;
