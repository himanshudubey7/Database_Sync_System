const readline = require('readline');
require('dotenv').config();

const syncLocalToCloud = require('./sync_L_C');
const syncCloudToLocal = require('./sync_C_L');
const syncWithConflictResolution = require('./sync_Conflict');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n==== Data Sync CLI ====');
console.log('1. Sync Local → Cloud');
console.log('2. Sync Cloud → Local');
console.log('3. Sync with Conflict Resolution');
console.log('0. Exit');

rl.question('\nChoose an option: ', async (answer) => {
    switch (answer.trim()) {
        case '1':
            await syncLocalToCloud();
            break;
        case '2':
            await syncCloudToLocal();
            break;
        case '3':
            await syncWithConflictResolution();
            break;
        case '0':
            console.log('Exiting...');
            break;
        default:
            console.log('Invalid option');
    }
    rl.close();
});
