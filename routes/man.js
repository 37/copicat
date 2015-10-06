var express = require('express');
var forms = require('forms');
var extend = require('xtend');
var url = require('url');
var gateway = require('../models/braintree');

// DATABASE DEPENDENCIES
var products = require('../models/product'),
	postage	 = require('../models/postage');

// A render function that will render our page and provide the values of the
// fields, as well as any situation-specific Locals.

function product(product, ref, stage, req, res, locals){
	if (req.user) {
		var user_id = req.user.id;
		console.log('getting user postage addresses for: ' + user_id);
		postage.find({uid: user_id}, function(err, result) {
			if (err) {
				return('none');
				throw err;
			} else {
				// object of all the users returned in result variable
				console.log('result: ' + result);
				res.render('pages/product', extend({
					title: 'Copicat',
					root: ref,
					stage: stage,
					items: product,
					user: req.user,
					addresses: result
				}, locals || {} ));
			}
		});

	} else {
		res.render('pages/product', extend({
			title: 'Copicat',
			root: ref,
			stage: stage,
			items: product,
			user: req.user
		}, locals || {} ));
	}
}

function category(data, req, res, locals){
	res.render('pages/man', extend({
		title: 'Admin',
		items: data
	}, locals || {} ));
}

//Export a function which will create the router and return it:
module.exports = function loader(){
	var router = express.Router();

	// LOAD PAGE -	category (req, res);
	// Capture all parametised requests, the form library will regotiate between them

	//DEFAULT LOAD
	router.all ('/', function(req, res){

		products.find({}, function(err, result) {
			if (err) throw err;
			// object of all the users returned in result variable
			category(result, req, res);
		});
	});

	router.all ('/:category', function(req, res){
		console.log('Loading category: ' + req.params.category);

		switch (req.params.category.toLowerCase()) {
			case 'shirts':
				var cat = 'Shirts';
				break;
			case 'jackets':
				var cat = 'Jackets';
				break;
			case 'accessories':
				var cat = 'Accessories';
				break;
			case 'watches':
				var cat = 'Watches';
				break;
		}
		var sex = 'man';

		console.log('query : ' + cat);

		products.find({ sex: sex, category: cat }, function(err, result) {
			if (err) throw err;
			// object of all the users returned in result variable
			category(result, req, res);
		});
	});

	router.get ('/products/:id', function(req, res){
		var stage = 1;
		var ref = 'man/products/' + req.params.id;
		var prodName = req.params.id.split('-').join(' ');
		var item;

		console.log('Loading product with name: ' + prodName);
		if (req.query.stage) {
			console.log('Buy stage is :' + req.query.stage);
			stage = req.query.stage;
		}
		// OLD DATA = item = { "title": "Dank-ass leather bag", "price": "$60", "images": [ "http://i00.i.aliimg.com/wsphoto/v3/32224932756_1/Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg", "http://i00.i.aliimg.com/wsphoto/v3/32224932756_2/Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg", "http://i00.i.aliimg.com/wsphoto/v3/32224932756_3/Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg", "http://i00.i.aliimg.com/wsphoto/v3/32224932756_4/Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg", "http://i00.i.aliimg.com/wsphoto/v3/32224932756_5/Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg" ], "sex": "woman", "category": "Accessories", "tags": [ "Handbag", "Interior Slot Pocket", "Zip Pocket", "Cell Phone Pocket", "Soft Leather", "Vintage", "Versatile", "Cow split leather", "Zipper", "700g", "30cm x 40cm x 20cm" ], "option": [ [ [ "Black", "['sku-1-193', 'http://i00.i.aliimg.com/wsphoto/sku/v3/32224932756/32224932756_193/Black-Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg_50x50.jpg']" ], [ "Brown", "['sku-1-365458', 'http://i00.i.aliimg.com/wsphoto/sku/v3/32224932756/32224932756_365458/Brown-Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg_50x50.jpg']" ], [ "Dark Coffee", "['sku-1-200004890', 'http://i00.i.aliimg.com/wsphoto/sku/v3/32224932756/32224932756_200004890/Dark-Grey-Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg_50x50.jpg']" ], [ "Deep Green", "['sku-1-175', 'http://i00.i.aliimg.com/wsphoto/sku/v3/32224932756/32224932756_175/Green-Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg_50x50.jpg']" ], [ "Wine Red", "['sku-1-10', 'http://i00.i.aliimg.com/wsphoto/sku/v3/32224932756/32224932756_10/Red-Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg_50x50.jpg']" ], [ "Dark Blue", "['sku-1-173', 'http://i00.i.aliimg.com/wsphoto/sku/v3/32224932756/32224932756_173/Blue-Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg_50x50.jpg']" ], [ "Rose Red", "['sku-1-200002984', 'http://i00.i.aliimg.com/wsphoto/sku/v3/32224932756/32224932756_200002984/Burgundy-Hot-Genuine-Leather-Ladies-Bag-New-Style-Oil-Wax-Women-Handbag-Fashion-2015-Women-Leather-Handbag.jpg_50x50.jpg']" ] ] ], "rating": "100.0%" };
		products.findOne({ name: prodName }, function(err, result) {
			if (err) throw err;
			// object of all the users returned in result variable
			product(result, ref, stage, req, res);
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
				category(req, res, {
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
