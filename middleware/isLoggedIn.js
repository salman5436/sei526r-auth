// write a function we are going to use as middleware
module.exports = function(req, res, next) {
    // being sent from req.user.locals from index.js where we established current user
    if(!req.user) {
        // but if we don't we will let user know they have to be logged in to access
        req.flash('error', 'You must be logged in to view this page.');
        // redirect user to /auth/login
        res.redirect('/auth/login')
    } else {
        // check to see if we have a user variable set
        // if we do we will allow our app to carry on
        next();
    }

}

