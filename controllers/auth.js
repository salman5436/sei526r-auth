//require express
const express = require('express')
//import router
const router = express.Router()
//import db
const db = require('../models')
//import middleware
const flash = require('flash');
// Linking the requiring passport to config file path
const passport = require('../config/ppConfig')
// ^ What pp config does is require passport and customize the strategy we will use with a specfic database to authenticate


// register get route
router.get('/register', function(req, res) {
    res.render('auth/register');
})
// register post route
router.post('/register', function(req, res) {
    db.user.findOrCreate({
        where: {
            email: req.body.email
        }, defaults: {
            name: req.body.name,
            password: req.body.password
        }
    }).then(function([user, created]) {
        // if user was created
        if (created) {
            // authenticate user and start authorization process
            console.log("User created! 🎉");
            res.redirect("/");
        } else {
            // else if user already exists
            //send error user that email already exists
            // redirect back to register get route
            console.log("User email already exists 🚫.");
            req.flash('error', 'Error: email already exists for user. Try again.');
            res.redirect('/auth/register');
        }
    }).catch(function(err) {
        console.log(`Error found. \nMessage: ${err.message}. \nPlease review - ${err}`);
        req.flash('error', err.message);
        res.redirect('/auth/register');
    })
})


// login get route
router.get('/login', function(req, res) {
    res.render('auth/login');
});

// login post route ---> values of error and user are taken from the passport LocalStrategy in the ppConfig
// pass next param to function -- next is the only other param  -- function built into express and will find the next route pattern and run that
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        // if no user authenticated
        if (!user) {
            req.flash('error', 'Invalid username or password');
            // save to our user session no username
            req.session.save(function() {
                // redirect our user to try logging in again
                return res.redirect('/auth/login');
            });
        }
        if (error) {
            // add next param from function -- go to the next error call, which is the route below
            return next(error);
        }
        
        //.login & .logout are built into passport
        req.login(function(user, error) {
            // if error move to error
            if (error) next(error);
            // if success flash success message
            req.flash('success', 'You are validated and logged in.');
            // if success save session and redirect user
            req.session.save(function() {
                return res.redirect('/');
            })
        })
    })
})

// key value pairs based on if authenticate goes well
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: 'Welcome to our app!',
    failureFlash: 'Invalid username or password.'
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})

// export router
module.exports = router;