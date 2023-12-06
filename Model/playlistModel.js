const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Listener',
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
}, {
  timestamps: true,
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
