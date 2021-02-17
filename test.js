const refresh_token = require('./services/refresh-token');
const fetch = require('node-fetch');
const getDownloadLink = require('./services/get-download-link');

// fetch('https://api.fshare.vn/api/user/get', {
//     headers: {
//         'user-agent': 'oke123-VJTCRL',
//         'cookie': 'session_id=10ond3g7sgd8laphpg2h40ek5d'
//     }
// }).then(res => res.text()).then(res => console.log(res));

// refresh_token(0);

// getDownloadLink(0, 'https://www.fshare.vn/file/EB4BZRJ6XZTT')
// .then(res => res.json())
// .then(res => console.log(res));

console.log(typeof (typeof 9))