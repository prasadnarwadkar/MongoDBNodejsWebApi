const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');

const MongoClient = require("mongodb")

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/mongodbservice');

connectDB().then((db) => {
  db = db
})


const router = express.Router();
module.exports = router;

router.post('/register', asyncHandler(register), login);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.post('/getpermissions', passport.authenticate('local', { session: false }), getpermissions);
//router.post('/logout', passport.authenticate('jwt', { session: false }), asyncHandler(logout));
router.post('/logout', asyncHandler(logout));
router.post('/registerwithoutlogin', asyncHandler(registerwithoutlogin));
router.post('/getpermissionsbyrole',  getpermissionsbyrole);

// **Users Endpoints**
router.post("/users", asyncHandler(createUser));
router.get("/users", asyncHandler(getAllUsers));
router.get("/users/:id", asyncHandler(getUserById));
router.put("/users/:id", asyncHandler(updateUser));
router.delete("/users/disable/:id", asyncHandler(disableUser));
router.delete("/users/enable/:id", asyncHandler(enabledUser));

// **Roles Endpoints**
router.post("/roles", asyncHandler(createRole));
router.get("/roles", asyncHandler(getAllRoles));


// **Role-Action Maps Endpoints**
router.post("/roleactions", asyncHandler(createRoleActionMap));
router.get("/roleactions", asyncHandler(getAllRoleactionMaps));
router.get("/roleactions/:role/:page", asyncHandler(getRoleActionsByRoleAndPage));
router.put("/roleactions/:id", asyncHandler(updateRoleActionMap));

async function getAllUsers(req, res) {
  let db = await connectDB()

  res.json(await db.collection("users").find().toArray())
}

async function getUserById(req, res) {
  let db = await connectDB()

  let users = await db.collection("users").find({ "_id": MongoClient.ObjectId(req.params.id) }).toArray()

  res.json(users)
}

async function updateUser(req, res) {
  let db = await connectDB()
  let updateResult = await db.collection("users").updateOne({ _id: MongoClient.ObjectId(req.params.id) }, { $set: { fullname: req.body.fullname, roles: req.body.roles } })
  console.log(JSON.stringify(updateResult))
  res.json(updateResult)
}

async function disableUser(req, res) {
  let db = await connectDB()
  let updateResult = await db.collection("users").updateOne({ _id: MongoClient.ObjectId(req.params.id) }, { $set: { enabled: false } })
  console.log(JSON.stringify(updateResult))
  res.json(updateResult)
}

async function enabledUser(req, res) {
  let db = await connectDB()
  let updateResult = await db.collection("users").updateOne({ _id: MongoClient.ObjectId(req.params.id) }, { $set: { enabled: true } })
  console.log(JSON.stringify(updateResult))
  res.json(updateResult)
}

async function createUser(req, res) {
  let db = await connectDB()

  let existingUsersCount = (await db.collection("users").find({ "email": req.body.email }).toArray()).length

  if (existingUsersCount > 0) {

    throw new Error("Email has already been used")
  }
  else {

    res.json(await db.collection("users").insertOne(req.body))
  }
}

async function deleteUser(req, res) {
  let db = await connectDB()
  let deleteResult = await db.collection("users").deleteOne({ _id: MongoClient.ObjectId(req.params.id) })
  res.json(deleteResult)
}

async function getAllRoles(req, res) {
  let db = await connectDB()

  res.json(await db.collection("roles").find().toArray())
}

function mapRole(x)
{
  let newMap = x;
  
  newMap.role = x.rolename;
  delete newMap.rolename;
  return newMap; 
}

async function getAllRoleactionMaps(req, res) {
  let db = await connectDB()
  let data = await db.collection("roleactionmaps").find().toArray()
  let data2 = data.map((x) =>  mapRole(x))
  res.json(data2)
}

async function getAllRoleactionMaps2() {
  let db = await connectDB()
  let data = await db.collection("roleactionmaps").find().toArray()
  return data
}



async function updateRoleActionMap(req, res) {
  let db = await connectDB()

  let updateResult = await db.collection("roleactionmaps").updateOne({ "_id": MongoClient.ObjectId(req.params.id) }, { $set: { actions: req.body.actions } })

  res.json(updateResult)
}

async function createRole(req, res) {
  let db = await connectDB()

  let existingRolesCount = (await db.collection("roles").find({ "role": req.body.role }).toArray()).length

  if (existingRolesCount > 0) {

    throw new Error("This role has already been added")
  }
  else {

    res.json(await db.collection("roles").insertOne(req.body))
  }
}

async function createRoleActionMap(req, res) {
  let db = await connectDB()

  let existingCount = (await db.collection("roleactionmaps").find({ "rolename": req.body.rolename, "pageName": req.body.pageName }).toArray()).length

  if (existingCount > 0) {

    throw new Error("This role and page pair has already been added")
  }
  else {

    res.json(await db.collection("roleactionmaps").insertOne(req.body))
  }
}

async function getRoleActionsByRoleAndPage(req, res) {
  let db = await connectDB()

  let existing = (await db.collection("roleactionmaps").find({ "rolename": req.params.role, "pageName": req.params.page }).toArray())

  res.json(existing.map((x) =>  mapRole(x)))
}







async function register(req, res, next) {
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  req.user = user;
  next()
}

async function registerwithoutlogin(req, res, next) {
  let db = await connectDB()
  let existingUsersCount = (await db.collection("users").find({ "email": req.body.email }).toArray()).length

  if (existingUsersCount == 0) {

    let user = await userCtrl.insert(req.body);
    user = user.toObject();
    delete user.hashedPassword;
    req.user = user;

    let token = authCtrl.generateToken(user);

    console.log("User Token updated in MongoDB")

    res.json({ user, token });
  }
  else {
    let user = await db.collection("users").findOne({ "email": req.body.email })
    let token = authCtrl.generateToken(user);

    console.log("User Token updated in MongoDB")

    res.json({ user, token });
  }
}

async function logout(req, res, next) {
  req.logout();
  delete req.session;

  return res.json({ "message": "ok" })
}

function login(req, res) {
  let user = req.user;

  let token = authCtrl.generateToken(user);
  res.json({ user, token });
}


async function getpermissions(req, res) {
  let rolesActionsData = await getAllRoleactionMaps2()
  let filteredByRole = rolesActionsData.filter(x => req.user.roles.includes(x.rolename.toLowerCase()))
  let matches = [];
  filteredByRole.forEach((value) => {
    matches.push({ "actions": value.actions, "pageName": value.pageName })
  })

  if (matches.length > 0) {
    res.json(matches)
  }
  else {
    res.json([])
  }
}

async function getpermissionsbyrole(req, res) {
  let rolesActionsData = await getAllRoleactionMaps2()
  let filteredByRole = rolesActionsData.filter(x => req.body.includes(x.rolename.toLowerCase()))
  let matches = [];
  filteredByRole.forEach((value) => {
    matches.push({ "actions": value.actions, "pageName": value.pageName })
  })

  if (matches.length > 0) {
    res.json(matches)
  }
  else {
    res.json([])
  }
}
