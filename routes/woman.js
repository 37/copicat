var express = require('express');
var forms = require('forms');
var extend = require('xtend');

var url = require('url');
var phantom = require('x-ray-phantom');
var Xray = require('x-ray');
var x = Xray().driver(phantom());

// A render function that will render our page and provide the values of the
// fields, as well as any situation-specific Locals.

function renderForm (data, req, res, locals){

	res.render('pages/woman', extend({
		title: 'Admin',
		items: data,
		csrfToken: req.csrfToken()
	}, locals || {} ));
}

//Export a function which will create the router and return it:
module.exports = function loader(){
	var router = express.Router();

	// LOAD PAGE -	renderForm (req, res);
	// Capture all parametised requests, the form library will regotiate between them

	//DEFAULT LOAD
	router.all ('/', function(req, res){

		url = 'http://www.aliexpress.com/af/category/200001648.html?isrefine=y&site=glo&SortType=total_tranpro_desc&tag=&isFavorite=y&isAffiliate=y&shipCountry=AU&needQuery=n&isFreeShip=y';

		console.log('begin scraping!');

		x(url, '.list-item', [
            {
                name: '.detail a.product',
                image: '.img .picRind img@src',
                imagesrc: '.img .picRind img@image-src',
                price: '.price .value',
                link: '.detail .product@href'
            }
		]) ( function(err, result) {
			if (err){
		  		console.log('error: ' + err);
			} else {
				console.log('checking data:');
				var data = result;
				console.log('data collected.');

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
