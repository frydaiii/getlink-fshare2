const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const contentDisposition = require('content-disposition');
const hset = require('../services/redis-command').hset;
const hmset = require('../services/redis-command').hmset;
const hget = require('../services/redis-command').hget;
const logger = require('../methods/logger');

router.get('/', async (req, res, next) => {
    try {
        const slot_index = req.query.slot;
        const url = await hget('slot', String(slot_index));
        const headResponse = await fetch(url, { method: 'HEAD' });

        if (!url.search(/download(.*).fshare.vn/) || headResponse.status != 200) {
            res.status(404).send('hỏng link');
            return;
        }

        const encoded_name = url.slice(url.lastIndexOf('/') + 1);
        const filename = decodeURIComponent(encoded_name);
        const filesize = headResponse.headers.get('content-length');
        
        await logger.info('start download');
        res.set('Content-Disposition', contentDisposition(filename));

        fetch(url).then(async (file) => {
            file.body.pipe(res);
            res.on('close', async () => {
                const remain_traffic = Number(await hget('account:' + slot_index, 'remain')) - filesize;

                if (file.body.readableEnded) {
                    if (remain_traffic < 0) {
                        const data = [];
                        for (let i = slot_index; i < slot_index+3; i++) data.push(i, 'unavailable');
                        hmset('slot', data);
                    } else {
                        hset('account:' + slot_index, 'remain', remain_traffic);
                        hset('slot', String(slot_index), 'available');
                    }
                } else {
                    file.body.unpipe(res);
                    file.body.destroy();
                    hset('slot', String(slot_index), 'available');
                }

                await logger.info('done');
            });
        });
    } catch (err) {
        logger.error('download router: ' + err);
        next(err);
    }
});

module.exports = router;