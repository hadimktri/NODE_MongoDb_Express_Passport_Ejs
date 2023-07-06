const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express();

const passportSetup = require('./middleware/passport_setup')
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.set('strictQuery', true);
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb://127.0.0.1:27017/Shop';
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'session'
});
mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(3000, () => {
            console.log('Listening on http://localhost:3000/')
        });
    })
    .catch(err => { console.log(err); })

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    },
    store: store
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use((req, res, next) => {
    if (!req.session.user) { return next() };
    User.findById((req.session.user._id))
        .then(user => { req.user = user; next(); })
        .catch(err => console.log(err))
})