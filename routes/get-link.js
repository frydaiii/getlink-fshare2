const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    message: 'Đã nói 15 phút tải được 2 lần thôi'
});

const get = require('../services/redis-command').get;
const login = require('../services/login');
const logout = require('../services/logout');
const getDownloadLink = require('../services/get-download-link');
const logger = require('../methods/logger');

const validateUrl = require('../services/validate-url');

router.get('/:file_url', validateUrl, limiter, async (req, res, next) => {
    try {
        await logger.info(req.ip + ' GET ' + req.params.file_url);

        while (true) {
            let url = await getDownloadLink(req.params.file_url);
            if (url) {
                const base64_url = new Buffer.from(url).toString('base64');
                url = req.protocol + '://' + req.get('host') + '/redirect.html?base64_url=' + base64_url;
                const shortenRes = await fetch('https://link1s.com/api?api=9fce4a3ce21f62d52b6d8d0d8767d4c344bbfb2a&url=' + url);
                const shorten = await shortenRes.json();

                if (shorten.status == 'error') logger.error('shorten url error: ' + shorten.message);
                else logger.info('shortenUrl: ' + shorten.shortenedUrl);
                res.status(200).send(shorten.shortenedUrl);
                // res.status(200).send(url);
                return;
            } 

            //if get download-link failed
            const current = Number(await get.key('current'));
            const accounts = await get.list('accounts');
            if (current == accounts.length - 1) {
                await logger.info('out of storage per day');
                res.status(202).send('Account hết lưu lượng cmnr, mai thử lại nhé :))');
                return;
            }

            //there is available accounts left
            let session_id = await get.key('session_id');
            await logout(session_id);
            await logger.info('logging in with different account...');

            await login(current + 1);
        }
    } catch (err) {
        logger.error('get-link router: ' + err);
        next(err);
    }
});

module.exports = router;


