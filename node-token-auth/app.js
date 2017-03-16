var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
//app.engine('.html', require('ejs').renderFile);
// view engine setup
app.set('views', __dirname + '/views/');
//var ejs = require('ejs')
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*-----------------------------setup to allow for cross domain use-----------------------------------*/
app.all('*', function(req,res,next){
    var htt= req.headers.origin;
    res.header("Access-Control-Allow-Origin", htt);
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token, Authorization");
    next();
});

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(passport.initialize());

// Initialize Passport
var initPassport = require('./reg/init');
initPassport(passport);

var routes = require('./reg/routes')(passport);
app.use('/', routes);
var myroutes = require('../routes')(passport);
app.use('/', myroutes);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.jsonp({
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
