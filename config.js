var passport =      require('passport')
    logger =        require('morgan'),
    cors =          require('cors'),
    express =       require('express'),
    Auth0Strategy = require('passport-auth0');
    cookieParser =  require('cookie-parser'),
    session =       require('express-session');

exports.template = function(app) {
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
}

exports.log = function(app) {
  if (process.env.NODE_ENV === 'development') {
    app.use(express.logger('dev'));
  }
}

exports.session = function(app) {
  app.use(session({ secret: 'cockadoodledoomotherfucker' }));
}

exports.static = function(app) {
  app.use(express.static(__dirname + '/public'));
}

exports.passport = function(app) {
  var strategy = new Auth0Strategy({
	  domain:       'copicat.auth0.com',
      clientID:     'aDP9vhLVwnXkCUXCUXebeU6g6Y15tX6p',
      clientSecret: 'ngvaY4oQAox1w-EmizzSKzLqO4spihPhBvcgAXZOBh5jDslIlegSbJB0P48Qm7kp',
      callbackURL:  '/login'
  }, function(accessToken, refreshToken, profile, done) {
    //Some tracing info
    console.log('profile is', profile);
    //save the profile
    return done(null, profile);
  });

  passport.use(strategy);

  // you can use this section to keep a smaller payload
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());

}
