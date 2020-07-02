//-----------> Required NPM libraries <------------
// configure dotenv
require('dotenv').config();
// require express and setup an express app instance
const Express = require('express');
// require and set view engine using ejs
const ejsLayouts = require('express-ejs-layouts');
// require all middleware for app/authentication
// helmet, morgan, passport, and custom middleware, express-sessions, sequelize-sessions, flash
const helmet = require('helmet');
const session = require('express-session');
//flash : if something was to happen in between middleware, like an error, you need a flash message
const flash = require('connect-flash');
// ---[flash allows us to bind a message onto the request object - the reaction to the request before the response happens
const passport = require('./config/ppConfig');
const db = require('./models');
// want to add a link to our customer middleware for isLogged --> which we use as a function for the profile get route
const isLoggedIn = require('./middleware/isLoggedIn')
//session library that can store session data - its a class
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// NOTE: Flash messages weren't working because we didn't connect Flash so the alerts were undefined




// -------------> app setup <--------------
const app = Express();
// set app to use false urlencoding -- when we call an https request, we don't need to go too deep into it
app.use(Express.urlencoded({ extended: false}));
// set app public directory for use
app.use(Express.static(__dirname + '/public'));
// set app ejsLayouts for render
app.set('view engine', 'ejs');
app.use(ejsLayouts);
// How morgan is required and use
app.use(require('morgan')('dev'));
app.use(helmet());

// create new instance of class Sequelize Store
const sessionStore = new SequelizeStore({
    db: db.sequelize,
    // sequelize database and create a session for 30 mins
    expiration:  1000 * 60 * 30
})


//For each session, pass these key value pairs:
app.use(session ({
    //instead of a jwt token, we will use the secret to check for authentication 
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}))

//Need to sync the session store that we have above^
sessionStore.sync()

//TODO: initialize and link flash message and passport and session
// want to be able to use passport throughout my app
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
    //linking the partial alerts to flash messages --> being able to use the use in the response (res)
    //locals is a key of local variables - alert, etc. ---> this is creating local variables that you can use [inLoggedIn]
    res.locals.alerts = req.flash();
    //setting the flash alerts for the current user
    res.locals.currentUser = req.user;
    
    //go to the next route 
    next();
})



// //----------> ROUTES <-------------
app.get('/', function(req, res) {
    // check to see if user logged in
    res.render('index');
})

//passing isLoggedIn middleware so that it runs before req and res to see if the user is there?
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {test: "another test"});
})


// include auth controller
app.use('/auth', require('./controllers/auth'));

// initialize App on Port
app.listen(process.env.PORT || 3000, function() {
    console.log(`Listening to the smooth sweet sounds of port ${process.env.PORT} in the morning ☕️.`);
});