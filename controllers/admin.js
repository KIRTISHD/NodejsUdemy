const Product = require('../models/product');

const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
    // if (!req.session.isLoggedIn) {
    //     return res.redirect('/login');
    // }
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
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
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
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

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product: {
                    title: updatedTitle,
                    price: updatedPrice,
                    description: updatedDesc,
                    imageUrl: updatedImageUrl,
                    _id: prodId
                },
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
        });
    }

    Product.findById(prodId).then(product => {
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product.save().then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        });
    }).catch(err => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
                path: '/admin/edit-product',
                editing: false,
                product: {
                    title: title,
                    price: price,
                    description: description,
                    imageUrl: imageUrl
                },
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
        });
    }

    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user
    });
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
    Product.deleteOne({ _id: prodId, usedId: req.user._id })
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
};


exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
        .then(products => {
            res.render('admin/products', {
                pageTitle: 'List Of Products',
                prods: products,
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        }
        );
};