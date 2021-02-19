const fetch = require('node-fetch');
const get = require('../services/redis-command').get;
const hget = require('../services/redis-command').hget;
const hmset = require('../services/redis-command').hmset;

async function login(x) {
    try {
        console.log('logging in ...');
        const body = {
            "user_email": await hget('account:' + x, 'user_email'),
            "password": await hget('account:' + x, 'password'),
            "app_key": await hget('account:' + x, 'app_key')
        }
        const options = {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'user-agent': await hget('account:' + x, 'user_agent'),
                'accept': 'application/json',
                'host': 'api.fshare.vn',
                'content-type': 'application/json'
            }
        };
        const response = await (await fetch('https://api.fshare.vn/api/user/login', options)).json();
        console.log(JSON.stringify(response));
        const data = [
            'token', response.token, 
            'session_id', response.session_id
        ];

        await hmset('account:' + x, data);  
        return;
    } catch (err) {
        throw new Error('login err: ' + err);
    }
}

async function main() {
    const n = await get('total_accounts');
    for (let i = 0; i < n; i++) await login(i);
    return;
}

// main();

module.exports = main;

