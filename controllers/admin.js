const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const product = new Product(
        prodId,
        updatedTitle,
        updatedPrice,
        updatedDesc,
        updatedImageUrl
    );
    product
        .save()
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(
        null,
        title,
        price,
        description,
        imageUrl,
        req.user._id
    );
    product.save()
        .then(result => {
            console.log('Created a product');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
};


exports.getProducts = (req, res, next) => {
    req.fetctAll()
        .then(products => {
            res.render('admin/products', {
                pageTitle: 'List Of Products',
                prods: products,
                path: '/admin/products',
            });
        })
        .catch(err => {
            console.log(err);
        }
        );
};