const get = require('../services/redis-command').get;
const hget = require('../services/redis-command').hget;
const fetch = require('node-fetch');

async function logout(x) {
    await console.log('logging out ' + x);
    const session_id = await hget('account:' + x, 'session_id');
    const response = await fetch('https://api.fshare.vn/api/user/logout', {
        headers: {
            'cookie': session_id,
            'accept': 'application/json',
            'host': 'api.fshare.vn'
        }
    }).json();
    console.log(response);
}

async function main() {
    const n = await get('total_accounts');
    for (let i = 0; i < n; i++) await logout(i);
}