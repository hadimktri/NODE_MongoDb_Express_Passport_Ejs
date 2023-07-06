const Product = require('../models/product')

exports.getProducts = (req, res) => {
    Product.find().then(products =>
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            user: req.user
        })).catch(err => console.log(err));
}

exports.getAddProduct = (req, res) =>
    res.render('admin/add-product', {
        path: '/add-product',
        pageTitle: 'Add Product',
        editing: false,
        user: req.user
    });

exports.postAddProduct = (req, res) => {
    const product = new Product({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        userId: req.user
    })
    product.save().then(result => res.redirect('/'));
};

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    !editMode ? res.redirect('/') : '';
    Product.findById(req.params.productId).then(product => {
        !product ? res.redirect('/') : '';
        res.render('admin/add-product', { product: product, pageTitle: "Edit Product", path: 'admin/edit-product', editing: editMode, user: req.user })
    }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res) => {
    Product.findById(req.body.productId).then(product => {
        !product ? res.redirect("/") : "";
        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.price = req.body.price;
        product.description = req.body.description;
        product.save();
    }).then(result => res.redirect('/'))
}

exports.getDeleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.productId)
        .then(() => { res.redirect('/admin/products') })
        .catch(err => console.log(err))
};


