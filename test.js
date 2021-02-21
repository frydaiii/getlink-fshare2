const getDownloadLink = require('./services/get-download-link');
const logout = require('./scripts/logout');
const login = require('./scripts/login');

// getDownloadLink(1, 'https://www.fshare.vn/file/WHEAXLXM243T')
// .then(res => res.json())
// .then(res => console.log(res));
async function main() {
    await logout();
    await login();
}

main();