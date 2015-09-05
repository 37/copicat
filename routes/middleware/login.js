var express = require('express');
var forms = require('forms');
var extend = require('xtend');
var forms = require('forms');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//Export a function which will create the router and return it:
module.exports = function loader(){
	var router = express.Router();

	// Capture all parametised requests, the form library will regotiate between them

	router.get('/', passport.authenticate('auth0', {
		failureRedirect: '/oshitdawg' }),
		function(req, res) {
			if (!req.user) {
				throw new Error('user null');
			}

			if (req.query.redir) {
				res.redirect(req.query.redir);
			} else {
				res.send('Your login deets are dank.');
			}
	});


	// This is an error handler for this router
	router.use(function (err, req, res, next) {
		// This handler catches errors for this router
		if (err.code ==='EBADCSRFTOKEN'){
			// The csrf library is telling us that it can't find a
			// valid token on the form
			if (req.user){
				// session token is invalid or expired.
				// render the form anyway but tell them what happened.
				renderForm(req, res, {
					errors: [{error: 'Your form has expired, please try again.'}]
				});
			} else {
				// The user's cookies have been deleted, we don't know their
				// intention. Send them back to the home page!
				res.redirect('/');
			}
		} else {
			// Let the parent app handle this error.
			return next(err);
		}
	});
	return router;
}
