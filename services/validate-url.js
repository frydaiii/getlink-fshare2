const fetch = require('node-fetch');
const logger = require('../methods/logger');

module.exports = async (req, res, next) => {
    try {
        const file_url = decodeURIComponent(req.params.file_url);
        const response = await fetch(file_url);
        const plainHtml = await response.text();
        const fileExist = plainHtml.search('id="linkcode"') == -1 ? false : true;
        
        if (fileExist == false) res.status(404).send('Không tìm thấy file');
        else {
            // get file size 
            const begin = plainHtml.search(/\((.*)GB\)/) + 1;
            const end = plainHtml.search(/\sGB\)/);
            const filesize = Number(plainHtml.slice(begin, end));
            if (filesize > 6) res.status(406).send('Chỉ tải file dưới 6 Gb');
            else next();
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}