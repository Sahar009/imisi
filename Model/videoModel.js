const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  listener: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listener',
  },
  name: {
    type: String,
    required: [true, 'please add a name'],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, 'please add a genre'],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, 'please add an artist'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'please add a description'],
    trim: true,
  },
  image: {
    type: Object,
    // required: [true, 'please add thumbnail'],
    default: {},
  },
  video: {
    type: Object,
    // required: [true, 'please add a video file'],
    default: {},
  },
}, {
  timestamps: true,
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
