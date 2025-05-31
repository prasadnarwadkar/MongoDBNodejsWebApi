const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = {
  generateToken
}


function generateToken(user) {
  
  user.token = ""
  const payload = JSON.stringify(user);
  return jwt.sign(payload, config.jwtSecret);
}
