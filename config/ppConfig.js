//new config file for passport config:
// ----> import necessary libraries and modules <-----
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// ^ npm i passport-local
const db = require('../models');

// serialize user -- using builtin function and have to tell which model to have serialized: in this case user
passport.serializeUser(function(user, callback) {
    //cb-- or callback-- is an error that would happen if user was null, which we can't have
    callback(null, user.id);
})

// To deserialize our user
passport.deserializeUser(function(id, callback) {
    //using primary key to find the user
    db.user.findByPk(id).then(function(user) {
        callback(null, user);
    }).catch(callback);
})

// passport local variables/settings
// I want to create a new instance of the LocalStrategies class
// localStrategy:  for each request, we will check for user & password 
passport.use(new LocalStrategy({
    //every instance of LocalStrategy has username and password fields
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, callback) {
    db.user.findOne({ where: { email }}).then(function(user) {
        //find me a user where the password is the password above -- matching login queries
        //if the user doesn't exist OR the user password is invalid
        if (!user || !user.validPassword(password)) {
            //if there is no user, or user put in the wrong passowrd, then the user value on the request value will be false
            callback(null, false);
        } else {
            //otherwise the user value for the password will match the one with 
            callback(null, user);
        }
    }).catch(callback);
}));

// export out passport now -- Build A Bear example
module.exports = passport;