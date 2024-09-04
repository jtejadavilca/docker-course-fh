const cron = require('node-cron');
const { syncDB, indicatorSyncDB } = require('./tasks/sync-db');



cron.schedule('1-59/5 * * * * *', syncDB);

cron.schedule('1-59 * * * * *', indicatorSyncDB);

console.log('Proceso de cron-job iniciado!');