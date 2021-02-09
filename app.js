let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let getLinkRouter = require('./routes/get-link');
let downloadRouter = require('./routes/download');
let addAccountRouter = require('./routes/account');

let app = express();

app.enable('trust proxy');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/get', getLinkRouter);
app.use('/download', downloadRouter);
app.use('/account', addAccountRouter);

module.exports = app;
