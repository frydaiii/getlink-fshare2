const fetch = require('node-fetch');
const get = require('./redis-command').get;
const logger = require('../methods/logger');

async function getDownloadLink(url) {
    try {
        await logger.info('getting download link...');

        const token = await get.key('token');
        const session_id = await get.key('session_id');
        const user_agent = await get.key('user_agent');
        const password = await get.key('password');
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

        const response = await (await fetch('https://api.fshare.vn/api/session/download', options)).json();
        logger.info(JSON.stringify(response));

        if (response.location && response.location.search('http://download') != -1) 
            return response.location;
        else return '';
    } catch (err) {
        throw new Error('get-download-link service: ' + err);
    }
}

module.exports = getDownloadLink;