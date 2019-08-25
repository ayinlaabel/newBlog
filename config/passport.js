const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('../config/database');

module.exports = (passport) => {
    //Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {

        //Match Username

        let query = {username:username};
        User.findOne(query, (err, user) => {
            if(err) throw err;
            if (!user) {
                return done(null, false, {message:'No User Find'});
            }

            //Match Password with user
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch) {
                    return done(null, user);
                } else{
                    return done(null, false, {message: 'Password does not match user!'});
                }
            })
        })
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}