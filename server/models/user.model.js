const { bool, boolean } = require('joi');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  hashedPassword: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  roles: [{
    type: String,
  }],
  picture: {
    type: String
  },
  idP: {
    type: String
  },
  token: {
    type: String
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: String,
    required: false
  },
  enabled: {
    type: Boolean,
    required: false
  },
  picData: {
    type: Buffer,
    required: false
  },
}, {
  versionKey: false
});


module.exports = mongoose.model('User', UserSchema);
