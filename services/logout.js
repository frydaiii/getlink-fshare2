const fetch = require('node-fetch');
const logger = require('../methods/logger');

async function logout(session_id) {
    try {
        await logger.info('logging out');
        const response = await (await fetch('https://api.fshare.vn/api/user/logout', {
            headers: {
                'host': 'api.fshare.vn',
                'cookie': 'session_id=' + session_id
            }
        })).json();
        await logger.info(JSON.stringify(response));
    } catch (err) {
        throw new Error('logout service: ' + err);
    }
}

module.exports = logout;