var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({
        domain:       'copicat.auth0.com',
        clientID:     'aDP9vhLVwnXkCUXCUXebeU6g6Y15tX6p',
        clientSecret: 'ngvaY4oQAox1w-EmizzSKzLqO4spihPhBvcgAXZOBh5jDslIlegSbJB0P48Qm7kp',
        callbackURL:  '/login'
    }, function(accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
    });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;
