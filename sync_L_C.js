const { connectToMongo, getDb } = require('./db');

async function syncLocalToCloud() {
    await connectToMongo();
    const db = getDb();
    const localCollection = db.collection('local_data');
    const cloudCollection = db.collection('cloud_data');
    const syncMeta = db.collection('sync_meta'); // this stores last sync time

     const syncInfo = await syncMeta.findOne({ direction: 'local_to_cloud' });
    const lastSyncTime = syncInfo?.lastSyncTime || new Date(0); // if never synced before, use Jan 1, 1970

       const recordsToSync = await localCollection.find({
        updatedAt: { $gt: lastSyncTime }
    }).toArray();

    console.log(`🔍 Found ${recordsToSync.length} new/updated record(s) in local_data.`);

       for (const record of recordsToSync) {
        await cloudCollection.updateOne(
            { _id: record._id },                   // match by ID
            { $set: { ...record, source: 'LOCAL' } }, // overwrite the cloud copy with the local one
            { upsert: true }                        // insert if it doesn't exist yet
        );
    }

     await syncMeta.updateOne(
        { direction: 'local_to_cloud' },
        { $set: { lastSyncTime: new Date() } },
        { upsert: true }
    );

    console.log('Sync from LOCAL → CLOUD complete.');
    process.exit(); 
}

// syncLocalToCloud();
module.exports = syncLocalToCloud;