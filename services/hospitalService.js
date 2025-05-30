import pkg from 'mongodb';
const { MongoClient, ObjectId } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

export default async function connectDB() {
  await client.connect();
  db = client.db("hospital");
  console.log("Connected to MongoDB");
  return db;
}

function getDB() {
  return db;
}

