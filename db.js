const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let db;

async function connectToMongo() {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB: ${dbName}`);
    return db;
}

function getDb() {
    if (!db) throw new Error('Call connectToMongo() first!');
    return db;
}

module.exports = { connectToMongo, getDb };
