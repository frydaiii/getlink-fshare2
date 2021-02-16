const fetch = require('node-fetch');
const hget = require('./redis-command').hget;
const logger = require('../methods/logger');

async function getDownloadLink(x, url) {
    try {
        await logger.info('getting download link...');

        const token = await hget('account:' + x, 'token');
        const session_id = await hget('account:' + x, 'session_id');
        const user_agent = await hget('account:' + x, 'user_agent');
        const body = {
            'url': url,
            'password': '',
            'token': token,
            'zipflag': 0
          }
        const options = {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'user-agent': user_agent,
                'content-type': 'application/json',
                'accept': 'application/json',
                'host': 'api.fshare.vn',
                'cookie': 'session_id=' + session_id
            }
        };

        const response = await fetch('https://api.fshare.vn/api/session/download', options);
        return response;
    } catch (err) {
        throw new Error('get-download-link service: ' + err);
    }
}

module.exports = getDownloadLink;