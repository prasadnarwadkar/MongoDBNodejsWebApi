const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = {
  generateToken
}


function generateToken(user) {
  user.roles = [];
  user.roles = ['admin'];
  const payload = JSON.stringify(user);
  return jwt.sign(payload, config.jwtSecret);
}
