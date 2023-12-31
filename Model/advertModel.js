const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema({
  advertisements: [{
    type: {
      type: String,
      enum: ['audio', 'video'],
      required: true,
    },
    content: {
      audio:  {
        type: Object,
        default: {},
      },
      video:  {
        type: Object,
        default: {},
      },
    },
  }],
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
module.exports = Advertisement;
