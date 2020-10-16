var createError = require('http-errors');
var express = require('express');
var redis   = require("redis");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSesssion = require('express-session');
var redisStore = require('connect-redis')(expressSesssion);
const passport = require('passport');
const { Issuer, Strategy } = require('openid-client');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var toursRouter = require('./routes/tours');

var app = express();
var redisClient = redis.createClient({host: '192.168.1.49', port: '6379'});

redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-{cognito_instance_id}')
  .then(cognitoIssuer => {
    var client = new cognitoIssuer.Client({
      client_id: '{client-id}',
      client_secret: '{client-secret}',
      redirect_uris: [ 'http://localhost:3000/callback' ],
      post_logout_redirect_uris: [ 'http://localhost:3000/logout' ]
    });

    app.use(
      expressSesssion({
		store: new redisStore({ host: '192.168.1.49', port: 6379, client: redisClient }),
        secret: '{session cookie secret}',
        resave: false,
        saveUninitialized: true,
		cookie: {
		  domain: 'localhost'
		}
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      'oidc',
      new Strategy({ client }, (tokenSet, userinfo, done) => {
        return done(null, tokenSet.claims());
      })
    );

    // handles serialization and deserialization of authenticated user
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
	
	app.use('/', indexRouter);
	//app.use('/users', usersRouter);
	app.use('/tours', toursRouter);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  });

module.exports = app;
