const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cors=require('cors');

const SECRET = process.env.SECRET;
const URL=process.env.URL;

const User = require('./models/UserSchema');

const app = express();


const PORT = 5001 || process.env.PORT;

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {
    res.send('Hello world');
});

mongoose.connect(URL).then((x) => {
    console.log('Connected to the database');
}).catch((err) => {
    console.log(err);
    console.log('Error connecting to the database');
});

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.identifier }).then(function (user) {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch((err) => {
        return done(err, false);
    });
}));

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
