var express = require('express');
var stormpath = require('express-stormpath');
var forms = require('forms');
var csurf = require('csurf');
var collectFormErrors = require('express-stormpath/lib/helpers').collectFormErrors;
var extend = require('xtend');

var url = require('url');
var phantom = require('x-ray-phantom');
var Xray = require('x-ray');
var x = Xray().driver(phantom());

// A render function that will render our page and provide the values of the
// fields, as well as any situation-specific Locals.

function renderForm (data, req, res, locals){

	res.render('pages/admin', extend({
		title: 'Admin',
		items: data,
		csrfToken: req.csrfToken()
	}, locals || {} ));
}

//Export a function which will create the router and return it:
module.exports = function loader(){
	var router = express.Router();

	router.use(csurf({ sessionKey: 'stormpathSession' }));

	// LOAD PAGE -	renderForm (req, res);
	// Capture all parametised requests, the form library will regotiate between them

	//DEFAULT LOAD
	router.all ('/', stormpath.loginRequired, function(req, res){

		url = 'http://superdeals.aliexpress.com/en?spm=2114.11010108.21.1.9F0sCN';

		console.log('begin scraping!');

		x(url, '.list-items', [
			{
				name: '.pro-msg .pro-name',
				image: '.pro-msg .pro-img img@src',
				price: '.pro-msg .pro-price b',
				link: '.pro-msg .pro-name@href'
			}
		]) ( function(err, result) {
			if (err){
		  		console.log('error: ' + err);
			} else {
				console.log('checking data:');
				var data = result;
				console.log('data collecte.');

				var items = 'blank';

				//for (i=0; i < data.length; i++){
				//	var item = data[i];
				//	console.log(item.link);

					// Crawl the individual page links, this is going to take a F#CKLOAD of time.
				//}

				renderForm (data, req, res);
			}
		});
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
