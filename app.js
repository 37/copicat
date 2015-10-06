// DECLARE APP DEPENDANCIES
var express =      require('express'),
    app =          express(),
    server =       require('http').Server(app),
    config =       require('./config');

// Configure Logging
config.log(app);

// Configure templates
config.template(app);

// Configure session
config.session(app);

// Configure passport
config.passport(app);

// Configure static folders
config.static(app);

// Configure routes
app.use('/', require('./routes/index')());
app.use('/profile', require('./routes/profile')());
app.use('/man', require('./routes/man')());
app.use('/woman', require('./routes/woman')());
app.use('/admin', require('./routes/admin')());

// API routes
app.use('/admin_api', require('./routes/admin_api')());
app.use('/user_api', require('./routes/middleware/user_api')());
app.use('/client_token', require('./routes/middleware/client_token')());
app.use('/checkout', require('./routes/middleware/checkout')());
app.use('/404', require('./routes/404')());

// LOGIN MECHANISMS
app.use('/login', require('./routes/middleware/login')());

// INITIALISE SERVER
app.set('case sensitive routing', false);
app.set('port', (process.env.PORT || 8080));
server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
