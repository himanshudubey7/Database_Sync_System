const { connectToMongo, getDb } = require('./db');

async function syncCloudToLocal() {
    await connectToMongo();
    const db = getDb();

    const localCollection = db.collection('local_data');
    const cloudCollection = db.collection('cloud_data');
    const syncMeta = db.collection('sync_meta');

      const syncInfo = await syncMeta.findOne({ direction: 'cloud_to_local' });
    const lastSyncTime = syncInfo?.lastSyncTime || new Date(0); // default to very old date

       const recordsToSync = await cloudCollection.find({
        updatedAt: { $gt: lastSyncTime }
    }).toArray();

    console.log(` Found ${recordsToSync.length} new/updated record(s) in cloud_data.`);

    for (const record of recordsToSync) {
        await localCollection.updateOne(
            { _id: record._id },
            { $set: { ...record, source: 'CLOUD' } },
            { upsert: true }
        );
    }

    await syncMeta.updateOne(
        { direction: 'cloud_to_local' },
        { $set: { lastSyncTime: new Date() } },
        { upsert: true }
    );

    console.log('Sync from CLOUD → LOCAL complete.');
    process.exit();
}

// syncCloudToLocal();
module.exports = syncCloudToLocal;