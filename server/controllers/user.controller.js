const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user.model');
const connectDB = require('../config/mongodbservice');

const userSchema = Joi.object({
  fullname: Joi.string().allow(''),
  email: Joi.string().email(),
  mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
  password: Joi.string().required(),
  repeatPassword: Joi.string().required().valid(Joi.ref('password')),
  roles: Joi.array(),
  picture: Joi.string().allow(''),
  idP: Joi.string().allow(''),
  token: Joi.string().allow(''),
  name: Joi.object({ first: Joi.string().allow(''), last: Joi.string().allow('') }),
  enabled: Joi.boolean()
})


module.exports = {
  insert, update
}

async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.hashedPassword = bcrypt.hashSync(user.password, 10);

  if ('password' in user) {
    delete user.password;
  }

  let db = await connectDB()

  let existingUsersCount = (await db.collection("users").find({ "email": user.email }).toArray()).length

  if (existingUsersCount > 0) {

    throw new Error("Email has already been used")
  }
  else {
    user.enabled = true;
    user.roles = []
    user.roles.push('user')
    await db.collection("users").insertOne(user);

    return user;
  }

}

async function update(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;
  return await new User(user).updateOne();
}
