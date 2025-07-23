const { connectToMongo, getDb } = require('./db');

async function seedData() {
    await connectToMongo();
    const db = getDb();

    const local = db.collection('local_data');
    const cloud = db.collection('cloud_data');

    await local.deleteMany({});
    await cloud.deleteMany({});

    const now = new Date();

    await local.insertMany([
        { _id: 1, name: 'Himanshu1', updatedAt: now, source: 'LOCAL' },
        { _id: 2, name: 'Himanshu Dubey', updatedAt: now, source: 'LOCAL' },
        { _id: 2, name: 'Shreya', updatedAt: now, source: 'LOCAL' }
    ]);

    await cloud.insertMany([
        { _id: 3, name: 'Tiya', updatedAt: now, source: 'CLOUD' }
    ]);

    console.log('Seeded sample local and cloud data');
    process.exit();
}

seedData();
