require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const store = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_LINK,
    collection: 'sessions',
})

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
}))

app.use(session({
    secret: 'a key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 1000,
    },
    store: store
}))


app.use(bodyParser.json());
app.use(helmet());
app.use('/uploads', express.static('./uploads'));

app.use(passport.initialize());
app.use(passport.session());

require('./Strategies/googleStrategy');
require('./Strategies/facebookStrategy');
require('./Strategies/githubStrategy');

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

mongoose.connect(process.env.MONGODB_CONNECTION_LINK).then((res, err) => {
    if(err) {
        console.log(err);
        return;
    }
    app.listen(5000);
})

