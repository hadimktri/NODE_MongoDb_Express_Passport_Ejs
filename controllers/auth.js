const bcrypt = require('bcryptjs')
const passport = require('passport');
const User = require('../models/user')


exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/Login',
        pageTitle: 'login',
        user: req.user
    });
}

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // req.user = user;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/')
                })
            } res.redirect('/login');
        })
    })
}

exports.gettLogout = (req, res, next) => { req.logout(err => err ? next(err) : res.redirect('/login')); }

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        user: req.user
    })
}

exports.postSignup = (req, res) => {
    // const confPass = req.body.confPass;
    User.findOne({ email: req.body.email }).then(userDoc => {
        if (userDoc) { return res.redirect('/signup') }
        return bcrypt.hash(req.body.password, 12).then(hashedPassword => {
            const user = new User({
                googleId: " ",
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                profileImage: req.body.profileImage,
                password: hashedPassword,
                email: req.body.email,
                cart: { items: [] }
            });
            return user.save();
        }).then(() => res.redirect('/login'))
    }).catch(err => console.log(err))
}

exports.getGoogle = (req, res) => res.redirect('/') 
exports.getGithub = (req, res) => res.redirect('/') 

