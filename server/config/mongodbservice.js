const { MongoClient, ObjectId } = require("mongodb")
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  await client.connect();
  db = client.db(process.env.MONGO_DB_NAME);
  console.log("Connected to MongoDB database " + db.s.namespace.db  + " at server: " , db.s.topology.s.host);
  return db;
}

function getDB() {
  return db;
}

module.exports = connectDB;