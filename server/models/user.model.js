const { bool, boolean } = require('joi');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: false
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
    default: Date.now,
    required: false
  },
  roles: [{
    type: String,
    required: false
  }],
  picture: {
    type: String,
    required: false
  },
  idP: {
    type: String,
    required: false
  },
  token: {
    type: String,
    required: false
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
  doctor_id: {
    type: String,
    required: false
  },
}, {
  versionKey: false
});


module.exports = mongoose.model('User', UserSchema);
