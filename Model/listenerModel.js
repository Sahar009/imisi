const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Profile = require('./profileModel');
const listenerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please add a name'],
  },
  email: {
    type: String,
    required: [true, 'please add an email'],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'please add a password'],
    minLenght: [6, 'password must be up to 6 characters'],
  },
//   role: {
//     type: String,
//     enum: ['user', 'listener'],
//     default: 'listener',
//   },
favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Favorite',
  },
],
},
{
  timestamps: true,
});

// encrypt password before saving to DB
listenerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.password = hashedPassword;
});

const Listener = Profile.discriminator('Listener', listenerSchema);
module.exports = Listener;
