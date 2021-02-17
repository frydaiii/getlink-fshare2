const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const contentDisposition = require('content-disposition');
const hset = require('../services/redis-command').hset;
const hmset = require('../services/redis-command').hmset;
const hget = require('../services/redis-command').hget;
const get = require('../services/redis-command').get;
const logger = require('../methods/logger');

router.get('/', async (req, res, next) => {
    try {
        const base64 = req.query.base64_url;
        const ascii = new Buffer.from(base64, 'base64').toString('ascii');
        const slot_index = Number(ascii.slice(ascii.lastIndexOf('/') + 1));
        const total_accounts = Number(await get('total_accounts'));

        if (isNaN(slot_index) || slot_index >= total_accounts || slot_index < 0) {
            res.status(404).send('hỏng link');
            return;
        }

        const state = await hget('slot', String(slot_index));
        if (state != 'available') {
            res.status(202).send('Link này đã được sử dụng');
            return;
        }

        const url = ascii.slice(0, ascii.lastIndexOf('/'));
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
        await hset('slot', String(slot_index), 'using');

        fetch(url).then(async (file) => {
            file.body.pipe(res);
            res.on('close', async () => {
                const remain_traffic = Number(await hget('account:' + slot_index, 'remain')) - filesize;

                if (file.body.readableEnded) {
                    if (remain_traffic < 0) {
                        const data = [];
                        for (let i = slot_index; i < slot_index+3; i++) data.push(i, 'unavailable');
                        await hmset('slot', data);
                    } else {
                        await hset('account:' + slot_index, 'remain', remain_traffic);
                        await hset('slot', String(slot_index), 'available');
                    }
                } else {
                    file.body.unpipe(res);
                    file.body.destroy();
                    await hset('slot', String(slot_index), 'available');
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