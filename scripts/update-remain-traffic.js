const schedule = require('node-schedule');
const hset = require('../services/redis-command').hset;
const get = require('../services/redis-command').get;

console.log('schedule update is running');

schedule.scheduleJob('0 0 0 * * *', async () => {
    console.log('update remain traffic');
    const total_accounts = await get('total_accounts');
    for (let i = 0; i < total_accounts; i++) {
        hset('account:' + i, 'remain', 100*1024*1024*1024);
    }
});
