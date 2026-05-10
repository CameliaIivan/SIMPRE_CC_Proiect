import { MongoClient } from 'mongodb';

const uri = process.env.NEXT_ATLAS_URI;
const dbName = process.env.NEXT_ATLAS_DATABASE;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (!dbName) {
  throw new Error('Please add your MongoDB database name to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { db, client };
}