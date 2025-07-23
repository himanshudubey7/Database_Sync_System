require('dotenv').config();
const { MongoClient } = require("mongodb");

const localUri = "mongodb://127.0.0.1:27017";  
const cloudUri = process.env.MONGO_URI;      

const sampleLocalData = [
  { _id: 1, name: "Himanshu1", updatedAt: new Date("2025-07-22T10:00:00Z"), source: "LOCAL" },
  { _id: 2, name: "Himanshu Dubey", updatedAt: new Date("2025-07-22T11:00:00Z"), source: "LOCAL" }
];

const sampleCloudData = [
  { _id: 3, name: "Tiya", updatedAt: new Date("2025-07-22T09:00:00Z"), source: "CLOUD" }
];

async function seedDB() {
  const localClient = new MongoClient(localUri);
  const cloudClient = new MongoClient(cloudUri);

  try {
    await localClient.connect();
    await cloudClient.connect();

    const localDB = localClient.db("local");
    const cloudDB = cloudClient.db("cloud");

    await localDB.collection("local_data").deleteMany({});
    await cloudDB.collection("cloud_data").deleteMany({});

    await localDB.collection("local_data").insertMany(sampleLocalData);
    await cloudDB.collection("cloud_data").insertMany(sampleCloudData);

    console.log("Seeded both local and cloud data successfully.");
  } catch (err) {
    console.error(" Error seeding databases:", err);
  } finally {
    await localClient.close();
    await cloudClient.close();
  }
}

seedDB();
