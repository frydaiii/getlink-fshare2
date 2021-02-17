const fetch = require('node-fetch');
const hget = require('./redis-command').hget;
const hset = require('./redis-command').hset;
const logger = require('../methods/logger');

async function refresh(x) {
    try {
        await logger.info('refreshing account ' + x);
        
        const token = await hget('account:' + x, 'token');
        const app_key = await hget('account:' + x, 'app_key');
        const user_agent = await hget('account:' + x, 'user_agent');
        const body = {
            "token": token,
            "app_key": app_key
        }
        const opts = {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'user_agent': user_agent,
                'accept': 'application/json',
                'host': 'api.fshare.vn',
                'content-type': 'application/json'
            }
        }
        let response = await fetch('https://api.fshare.vn/api/user/refreshToken', opts);
        
        if (response.code == 200) {
            response = await response.json();
            await logger.info(response.msg);
            await hset('account:' + x, 'token', response.token);
            await hset('account:' + x, 'app_key', response.app_key);
        } else throw new Error('refresh status: ' + response.status);
    } catch (err) {
        throw new Error('refresh-token error: ' + err);
    }

}

module.exports = refresh;