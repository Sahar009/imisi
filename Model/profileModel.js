const mongoose = require('mongoose');

const profileSchema = mongoose.Schema(
  {
    // Common fields for both Listener and User
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    // Add other common fields if needed
  },
  {
    timestamps: true,
    discriminatorKey: 'role', // Field to differentiate between Listener and User
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
