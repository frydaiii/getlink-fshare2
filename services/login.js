const fetch = require('node-fetch');
const logger = require('../methods/logger');
const get = require('../services/redis-command').get;
const update = require('../services/redis-command').set.mset;

async function login(current) {
    try {
        await logger.info('logging in ...');
        const accounts = await get.list('accounts');
        const body = {
            "user_email": accounts[current].email,
            "password": accounts[current].password,
            "app_key": accounts[current].app_key
        }
        const options = {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'user-agent': accounts[current].user_agent,
                'accept': 'application/json',
                'host': 'api.fshare.vn',
                'content-type': 'application/json'
            }
        };
        const response = await (await fetch('https://api.fshare.vn/api/user/login', options)).json();
        await logger.info(JSON.stringify(response));
      
        const data = [
            'password', accounts[current].password,
            'user_agent', accounts[current].user_agent,
            'app_key', accounts[current].app_key,
            'token', response.token, 
            'session_id', response.session_id, 
            'current', current
        ];
        
        await update(data);
    } catch (err) {
        throw new Error('login service: ' + err);
    }
}

module.exports = login;

