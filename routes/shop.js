const express = require('express');
const path = require('path');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', {pageTitle: 'List Of Products', prods: products, docTitle:'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCSS: true});
});

module.exports = router;