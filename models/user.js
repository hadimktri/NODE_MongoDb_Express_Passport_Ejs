const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleId: {
        type: String,
        required: true
    },
    
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: false,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        uinque: true,
        lowercase: true,
        minlength: 8,
        meaxlength: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product", required: true
            },
            quantity: { type: Number, required: true }
        }]
    }
});

UserSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(prod => prod.productId.toString() === product._id.toString());
    const newQuantity = 1;
    const updatedcartItems = [...this.cart.items];
    if (cartProductIndex >= 0) { updatedcartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1 }
    else { updatedcartItems.push({ productId: product._id, quantity: newQuantity }) };

    this.cart = { items: updatedcartItems }
    this.save()
}

UserSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    })
    this.cart.items = updatedCartItems;
    return this.save();
}

UserSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', UserSchema);

