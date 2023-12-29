const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema({
  advertisements: [{
    type: {
      type: String,
      enum: ['audio', 'video'],
      required: true,
    },
    content: {
      audio: {
        fileName: String,
        filePath: String,
        fileType: String,
      },
      video: {
        fileName: String,
        filePath: String,
        fileType: String,
      },
    },
    duration: {
      type: Number,
      required: true,
    },
  }],
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
module.exports = Advertisement;
