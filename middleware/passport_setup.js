const passport = require('passport');
const User = require("../models/user");
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

passport.use(new GoogleStrategy({
    clientID: "981703014739-p51a4erlr34a6ce29sfd6m6jg1ei5d13.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://127.0.0.1:3000/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((existUser) => {
        if (existUser) {
            done(null, existUser)
        } else {
            new User({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                profileImage: profile.photos[0].value,
                cart: []
            }).save().then(newUser => {
                done(null, newUser)
            })
        }
    })
}
));

passport.use(new LocalStrategy({
    usernameField: "email"
}, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password).then(isMatch => {
            return ((!isMatch) ? done(null, false) : done(null, user))
        })

    });
}
));

passport.use(new GitHubStrategy({
    clientID: "1425d8864020cd32886c",
    clientSecret: "4bdb4c25969e823fddc27fa88b144ce06914b147",
    callbackURL: "http://127.0.0.1:3000/github/callback"
},
    (accessToken, refreshToken, profile, cb) => {
        User.findOne({ githubId: profile.id }).then((existUser) => {
            console.log(profile);
            // if (existUser) {
            //     done(null, existUser)
            // } else {
            //     new User({
            //         googleId: profile.id,
            //         firstName: profile.username,
            //         lastName: profile.username,
            //         email: profile.profileUrl,
            //         profileImage: profile.photos[0].value,
            //         cart: []
            //     }).save().then(newUser => {
            //         done(null, newUser)
            //     })
            // }
        })
    }
));