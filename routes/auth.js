const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/auth');
const user = require('../models/user');

router.get('/login', authController.getLogin);


router.get('/logOut', authController.gettLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', passport.authenticate('google'), authController.getGoogle);

router.post('/login', passport.authenticate('local'), (req, res) => { console.log("logged in"); res.redirect('/'); });

// router.get('/github', passport.authenticate('github',{ scope: ['email', 'profile'] }));

// router.get('/github/callback', passport.authenticate('github'), authController.getGithub);

module.exports = router; 