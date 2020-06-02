const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/', (req, res, next) => {
    //res.send('<h1>  Inside Express </h1>'); // default header is text/html
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;