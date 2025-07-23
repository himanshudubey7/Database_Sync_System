const { connectToMongo, getDb } = require('./db');
require('dotenv').config();

async function syncWithConflictResolution() {
    await connectToMongo();
    const db = getDb();

    const local = db.collection('local_data');
    const cloud = db.collection('cloud_data');
    const meta = db.collection('sync_meta');

    const [localToCloudMeta, cloudToLocalMeta] = await Promise.all([
        meta.findOne({ direction: 'local_to_cloud' }),
        meta.findOne({ direction: 'cloud_to_local' })
    ]);

    const lastLocalToCloud = localToCloudMeta?.lastSyncTime || new Date(0);
    const lastCloudToLocal = cloudToLocalMeta?.lastSyncTime || new Date(0);

    const [localChanges, cloudChanges] = await Promise.all([
        local.find({ updatedAt: { $gt: lastLocalToCloud } }).toArray(),
        cloud.find({ updatedAt: { $gt: lastCloudToLocal } }).toArray()
    ]);

    const localMap = new Map(localChanges.map(doc => [doc._id.toString(), doc]));
    const cloudMap = new Map(cloudChanges.map(doc => [doc._id.toString(), doc]));
    const allChangedIds = new Set([...localMap.keys(), ...cloudMap.keys()]);

    console.log(` Detected ${allChangedIds.size} changed record(s) in total.`);

    for (const id of allChangedIds) {
        const localRecord = localMap.get(id);
        const cloudRecord = cloudMap.get(id);

        if (localRecord && cloudRecord) {
            if (localRecord.updatedAt > cloudRecord.updatedAt) {
                await cloud.updateOne(
                    { _id: localRecord._id },
                    { $set: { ...localRecord, source: 'LOCAL' } },
                    { upsert: true }
                );
                console.log(`Conflict: LOCAL version of _id=${id} won`);
            } else {
                await local.updateOne(
                    { _id: cloudRecord._id },
                    { $set: { ...cloudRecord, source: 'CLOUD' } },
                    { upsert: true }
                );
                console.log(` Conflict: CLOUD version of _id=${id} won`);
            }
        } else if (localRecord) {
            await cloud.updateOne(
                { _id: localRecord._id },
                { $set: { ...localRecord, source: 'LOCAL' } },
                { upsert: true }
            );
            console.log(`Synced LOCAL _id=${id} to CLOUD`);
        } else if (cloudRecord) {
            await local.updateOne(
                { _id: cloudRecord._id },
                { $set: { ...cloudRecord, source: 'CLOUD' } },
                { upsert: true }
            );
            console.log(` Synced CLOUD _id=${id} to LOCAL`);
        }
    }

    const now = new Date();
    await Promise.all([
        meta.updateOne(
            { direction: 'local_to_cloud' },
            { $set: { lastSyncTime: now } },
            { upsert: true }
        ),
        meta.updateOne(
            { direction: 'cloud_to_local' },
            { $set: { lastSyncTime: now } },
            { upsert: true }
        )
    ]);

    console.log('Sync with conflict resolution complete.');
    process.exit();
}

module.exports = syncWithConflictResolution;
// syncWithConflictResolution();
