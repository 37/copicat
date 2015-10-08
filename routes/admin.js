// CORE PAGE DEPENDENCIES
var express = require('express');
var forms = require('forms');
var extend = require('xtend');

// SCRAPE DEPENDENCIES
var url = require('url');
var phantom = require('x-ray-phantom');
var Xray = require('x-ray');
var x = Xray().driver(phantom());

// DATABASE DEPENDENCIES
var product = require('../models/product');

//Declare the schema of new address form:
var newProduct = forms.create({
	title : forms.fields.string({
		required: true
	}),
	price : forms.fields.string({
		required: true
	}),
	defaultimage : forms.fields.string({
		required: true
	}),
	images : forms.fields.array({
		required: true
	}),
	sex : forms.fields.string({
		required: true
	}),
	category : forms.fields.string({
		required: true
	}),
	tags : forms.fields.array(),
	option : forms.fields.array(),
	rating : forms.fields.string()
});

// A render function that will render our page and provide the values of the
// fields, as well as any situation-specific Locals.

function renderForm (data, req, res, locals){

	res.render('pages/admin', extend({
		title: 'Admin',
		items: data
	}, locals || {} ));
}

//Export a function which will create the router and return it:
module.exports = function loader(){
	var router = express.Router();

	// LOAD PAGE -	renderForm (req, res);
	// Capture all parametised requests, the form library will regotiate between them

	//DEFAULT LOAD
	router.post('/new', function(req, res){
		console.log('form submission: ' + req);
		res.send('stuff: ' + req.body);
	});

	router.all ('/', function(req, res){
		newProduct.handle(req, {
			success: function (form) {
				// The form library calls this success method if the form
				// is being POSTED and does not have errors.

				if (isEmpty(form.data)){
					console.log ('Form data is empty');
				}
				else {

					// create a new user called chris
					var newProduct = new product({
						name : form.data.title,
						price : form.data.price,
						sales : 0,
						defaultimage : form.data.defaultimage,
						images : form.data.images,
						sex : form.data.sex,
						category : form.data.category,
						tags : form.data.tags,
						options : form.data.option,
						rating : form.data.rating
					});

					// Take product and generate ID
					console.log('Product created: ' + JSON.stringify(newProduct));
					newProduct.generateId(function(err, id) {
						if (err) throw err;
						console.log('The new product ID is: ' + id);
					});

					// Call save method to commit product to database;
					newProduct.save(function(err) {
						if (err) throw err;
						console.log('Product saved successfully!');
						res.send('success');
					});
				}
			},
			error: function (form) {
				// The form library calls this method if the form
				// has validation errors.  We will collect the errors
				// and render the form again, showing the errors
				// to the user
				console.log('form: ' + JSON.stringify(form));
				renderForm(req, res, {
					errors: collectFormErrors(form)
				});
			},
			empty: function (){

				// The form library calls this method if the method
				// is GET - thus we just need to render the form.

				// load page
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
				console.log('Who the fk is this kid?');
				res.redirect('/');
			}
		} else {
			// Let the parent app handle this error.
			return next(err);
		}
	});
	return router;
}

function isEmpty(str) {
	return (!str || 0 === str.length);
}
