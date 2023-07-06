const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products-list', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.post('/cart', isAuth, shopController.postCart);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrder);

router.get('/profile', shopController.getProfile);


module.exports = router;