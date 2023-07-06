const Product = require('../models/product');
const Order = require('../models/order');
const { session } = require('passport');

exports.getIndex = (req, res) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products, path: '/',
                pageTitle: 'Home',
                user: req.user
            })
        })
        .catch(err => console.log(err))
};

exports.getProducts = (req, res) => {
    Product.find().then(products => {
        res.render('shop/product-list', {
            prods: products,
            path: '/products',
            pageTitle: 'Products',
            user: req.user
        })
    })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        res.render('shop/product-details', {
            product: product,
            pageTitle: product.title,
            path: 'products',
            user: req.user
        })
    }).catch(err => { console.log(err) });
}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            req.user.addToCart(product);
        })
}

exports.getCart = async (req, res) => {
    const user = await req.user.populate('cart.items.productId');
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: user.cart.items,
        user: req.user
    });
}

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        }).catch(err => {
            console.log(err);
        })
}

exports.postOrder = (req, res) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: { ...i.productId._doc }
                }
            });
            const order = new Order({
                user: {
                    firstName: req.user.firstName,
                    userId: req.user
                },
                products: products
            })
            return order.save();
        }).then(() => {
            return req.user.clearCart();
        }).then(() => {
            res.redirect('/orders');
        }).catch(err => {
            console.log(err);
        });
}

exports.getOrder = (req, res) => {
    Order.find({
        'user.userId': req.user._id
    })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: "Orders",
                path: "/orders",
                orders: orders,
                user: req.user
            });
        }).catch(err => {
            console.log(err)
        })
}


exports.getProfile = (req, res) => {
    res.render('shop/profile', {
        pageTitle: "Profile",
        path: "profile",
        user: req.user
    });
}