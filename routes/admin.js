const express = require('express');

const productsController = require('../controllers/products');
const router = express.Router();

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

router.post('/products', productsController.getProducts);

module.exports = router;
