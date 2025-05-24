const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');

const MongoClient = require("mongodb")

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/mongodbservice');

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
router.get("/users", asyncHandler(getAllUsers));
router.get("/users/:id", asyncHandler(getUserById));
router.put("/users/:id", asyncHandler(updateUser));
router.delete("/users/:id", asyncHandler(deleteUser));

// **Roles Endpoints**
router.post("/roles", asyncHandler(createRole));
router.get("/roles", asyncHandler(getAllRoles));


// **Role-Action Maps Endpoints**
router.post("/roleactions", asyncHandler(createRoleActionMap));
router.get("/roleactions", asyncHandler(getAllRoleactionMaps));
router.get("/roleactions/:role/:page", asyncHandler(getRoleActionsByRoleAndPage));
router.put("/roleactions/:id", asyncHandler(updateRoleActionMap));

// **Pages Endpoints**
router.post("/pages", asyncHandler(createPage));
router.get("/pages", asyncHandler(getAllPages));

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

async function getAllRoleactionMaps(req, res) {
  let db = await connectDB()
  let data = await db.collection("roleactionmaps").find().toArray()
  res.json(data)
}

async function getAllRoleactionMaps2() {
  let db = await connectDB()
  let data = await db.collection("roleactionmaps").find().toArray()
  return data
}

async function getRoleByName(req, res) {
  let db = await connectDB()

  res.json(await db.collection("users").find({ "role": req.params.role }).toArray())
}

async function updateRole(req, res) {
  let db = await connectDB()

  res.json(await db.collection("roles").updateOne({ "role": req.params.role }, { $set: req.body }))
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

  res.json(existing)
}

async function deleteRole(req, res) {
  let db = await connectDB()
  let deleteResult = await db.collection("roles").deleteOne({ "role": req.params.role })
  res.json(deleteResult)
}

async function getAllPages(req, res) {
  let db = await connectDB()

  res.json(await db.collection("pages").find().toArray())
}

async function getPageByName(req, res) {
  let db = await connectDB()

  res.json(await db.collection("pages").find({ "pages": req.params.page }).toArray())
}

async function updatePage(req, res) {
  let db = await connectDB()

  res.json(await db.collection("pages").updateOne({ "page": req.params.page }, { $set: req.body }))
}

async function createPage(req, res) {
  let db = await connectDB()


  let existingCount = (await db.collection("pages").find({ "page": req.body.page }).toArray()).length

  if (existingCount > 0) {

    throw new Error("Page has already been used")
  }
  else {
    res.json(await db.collection("pages").insertOne(req.body))
  }
}

async function deletePage(req, res) {
  let db = await connectDB()
  let deleteResult = await db.collection("pages").deleteOne({ "page": req.params.page })
  res.json(deleteResult)
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

  let token = authCtrl.generateToken(user);
  res.json({ user, token });
}

async function getpermissions(req, res) {
  let rolesActionsData = await getAllRoleactionMaps2()
  let filteredByRole = rolesActionsData.filter(x => req.user.roles.includes(x.rolename.toLowerCase()))
  let matches = [];
  filteredByRole.forEach((value, index) => {
    matches.push({ "actions": value.actions, "pageName": value.pageName })
  })

  if (matches.length > 0) {
    res.json(matches)
  }
  else {
    res.json([])
  }
}
