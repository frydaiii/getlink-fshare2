const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2,
    message: '60 phút tải được 2 lần thôi'
});

const hset = require('../services/redis-command').hset;
const hget = require('../services/redis-command').hget;
const refreshToken = require('../services/refresh-token');
const getDownloadLink = require('../services/get-download-link');
const logger = require('../methods/logger');
const validateUrl = require('../services/validate-url');

router.get('/:file_url', validateUrl, limiter, async (req, res, next) => {
    try {
        await logger.info(req.ip + ' GET ' + req.params.file_url);

        // check empty slot
        let slot_index= 0;
        let state;

        while (slot_index < 6) {
            state = await hget('slot', String(slot_index));
            if (state === 'available') break;
            else slot_index++;
        }
        
        if (slot_index >= 6) {
            if (state == 'unavailable') 
                res.status(202).send('Account hết lưu lượng cmnr, mai thử lại nhé :))');
            else res.status(201).send('Server full, thử lại lúc khác nhé fen');
            return;
        }

        // slot_index is empty
        // pick account[x] to get download Url and fill it into slot_index
        const x = slot_index % 3;
        let download = await getDownloadLink(x, req.params.file_url);

        if (download.status == 201) { // token is out-dated
            refreshToken(x);
            download = await getDownloadLink(x, req.params.file_url);
        }
        
        if (download.status == 200) { // success url
            download = await download.json();
            logger.info(download.location);
            hset('slot', slot_index, download.location);

            const url = req.protocol + '://' + req.get('host') + '/redirect.html?slot=' + slot_index;
            const shorten = await (await fetch('https://link1s.com/api?api=9fce4a3ce21f62d52b6d8d0d8767d4c344bbfb2a&url=' + url)).json();
            if (shorten.status == 'error') await logger.error('shorten url error: ' + shorten.message);
            else await logger.info('shortenUrl: ' + shorten.shortenedUrl);
            
            res.status(200).send(shorten.shortenedUrl);
        } else throw new Error('fshare status for get-download-link: ' + download.status);

    } catch (err) {
        logger.error('get-link router: ' + err);
        next(err);
    }
});

module.exports = router;


