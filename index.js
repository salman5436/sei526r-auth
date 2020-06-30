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
const flash = require('flash');
// ---[flash allows us to bind a message onto the request object - the reaction to the request before the response happens


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

// //----------> ROUTES <-------------
app.get('/', function(req, res) {
    // check to see if user logged in
    res.render('index');
})

// include auth controller
app.use('/auth', require('./controllers/auth'));

// initialize App on Port
app.listen(process.env.PORT || 3000, function() {
    console.log(`Listening to the smooth sweet sounds of port ${process.env.PORT} in the morning ☕️.`);
});