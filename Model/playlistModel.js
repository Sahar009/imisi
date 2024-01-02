const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Profile', // Reference the common base model
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  musics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music',
  }],
  // videos: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Video',
  // }]
}, {
  timestamps: true,
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
