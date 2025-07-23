const cron = require('node-cron');
const syncWithConflictResolution = require('./sync_Conflict');

console.log('⏰ Cron Scheduler Started');

cron.schedule('*/5 * * * *', async () => {
    console.log(`\n🕒 Running scheduled sync at ${new Date().toLocaleTimeString()}`);
    await syncWithConflictResolution();
});
