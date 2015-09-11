var passport =      require('passport')
    logger =        require('morgan'),
    cors =          require('cors'),
    express =       require('express'),
    Auth0Strategy = require('passport-auth0');
    cookieParser =  require('cookie-parser'),
    session =       require('express-session'),
	braintree =     require('braintree');

    var gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
        merchantId: "qrbb4ynf6p6v2hvk",
        publicKey: "d3t9t4pw2jzm4gr3",
        privateKey: "f5021d4aa8d7932b8778c341ae3a793e"
    });

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
    console.log('Login || Register complete, registering handshake with braintree.');
    if (profile) {
        console.log('User has id: ' + profile.id);
        var brain_id = (profile.id).replace('|', '');
        gateway.customer.find(brain_id, function(err, customer) {
            if (err) console.log(err);
            // if braintree customer exists
            if (customer) {
                console.log('User already registered with braintree.');
            } else { // else create braintree customer
                console.log('User not registered with braintree.');
                gateway.customer.create({
                    id: brain_id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                }, function (err, result) {
                    if (err) console.log(err);
                    console.log('braintree result: ' + result.success);
                    // true
                    console.log('created user with id: ' + result.customer.id);
                    // e.g. 494019
                });
            }
        });

    }
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
