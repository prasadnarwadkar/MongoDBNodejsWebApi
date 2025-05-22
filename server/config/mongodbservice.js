const { MongoClient, ObjectId } = require("mongodb")
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("test");
  console.log("Connected to MongoDB");
  return db;
}

function getDB() {
  return db;
}

module.exports = connectDB;