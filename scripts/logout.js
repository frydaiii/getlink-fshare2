const get = require('../services/redis-command').get;
const fetch = require('node-fetch');
const session_id = get.key('session_id');

async function logout(session_id) {
    await console.log('logging out');
    const response = await fetch('https://api.fshare.vn/api/user/logout', {
        headers: {
            'cookie': session_id,
            'accept': 'application/json'
        }
    }).json();
    console.log(response);
}

logout(session_id).catch(err => console.log(err));