const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');

const MongoClient = require("mongodb")

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/mongodbservice');
const { validateRequest } = require('twilio/lib/webhooks/webhooks');

let db = undefined;
connectDB().then((db) => {
  db = db
})


const router = express.Router();
module.exports = router;

router.post('/register', asyncHandler(register), login);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.post('/getpermissions', passport.authenticate('local', { session: false }), getpermissions);



// **Users Endpoints**
router.post("/users", asyncHandler(createUser));
router.get("/users",asyncHandler(getAllUsers));
router.get("/users/:email", asyncHandler(getUserById));
router.put("/users/:id", asyncHandler(updateUser));
router.delete("/users/:id", asyncHandler(deleteUser));

async function getAllUsers(req, res)
{
  let db = await connectDB()

  res.json(await db.collection("users").find().toArray())
}

async function getUserById(req, res)
{
  let db = await connectDB()

  res.json(await db.collection("users").find({"email": req.params.email}).toArray())
}

async function updateUser(req, res)
{
  let db = await connectDB()

  res.json(await db.collection("users").updateOne({ id: req.params.id }, { $set: req.body }))
}

async function createUser(req, res)
{
  let db = await connectDB()

  res.json(await db.collection("users").insertOne(req.body))
}

async function deleteUser(req, res)
{
  let db = await connectDB()
  let deleteResult = await db.collection("users").deleteOne({ _id:MongoClient.ObjectId( req.params.id) })
  res.json(deleteResult)
}

async function getAllUsers(req, res)
{
  let db = await connectDB()

  res.json(await db.collection("users").find().toArray())
}

async function register(req, res, next) {
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  req.user = user;
  next()
}

function login(req, res) {
  const rolesActionsData = require('../assets/roles-actions.json')
  let user = req.user;
  user.roles = ['admin'];

  let token = authCtrl.generateToken(user);
  res.json({ user, token });
}

function getpermissions(req, res) {
  const rolesActionsData = require('../assets/roles-actions.json')
  let filteredByRole = rolesActionsData.filter(x=> x.rolename.toLowerCase() == req.user.roles[0]?.toLowerCase())
  let matches = [];
  filteredByRole.forEach((value, index)=>{
    matches.push({"actions": value.actions, "pageName": value.pageName})
  })
 
  if (matches.length > 0) {
    res.json(matches)
  }
  else
  {
    res.json({"message": "actions for page not found"})
  }
}
