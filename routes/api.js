var express = require('express');
var stormpath = require('express-stormpath');
var csurf = require('csurf');
var phantom = require('x-ray-phantom');
var Xray = require('x-ray');
var x = Xray().driver(phantom());

module.exports = function loader(){
	var router = express.Router();

	router.use(csurf({ sessionKey: 'stormpathSession' }));

	// LOAD PAGE -	renderForm (req, res);
	// Capture all parametised requests, the form library will regotiate between them

	//DEFAULT LOAD

    router.get('/', stormpath.loginRequired, function(req, res){
        var url = req.query.url;
        console.log(url);

        x(url, '.product-info-main',
			{
				name: '.product-name',
				images: x('.image-nav', ['.image-nav-item span img@src']),
				price: '.total-price',
				select: x(x('.product-info-operation .product-info-sku', ['dl']), {
                    type: 'dt',
                    options: x('dd ul li', [{
                        label: 'a span',
                        id: 'a@id'
                    }]),
                })
			}
		) ( function(err, product) {
			if (err){
		  		console.log('error: ' + err);
			} else {
				console.log('received initial data; going deeper!');
				console.log('data: ' + product);
				var items = 'blank';

				//for (i=0; i < data.length; i++){
				//	var item = data[i];
				//	console.log(item.link);

				            // Crawl the individual page links, this is going to take a F#CKLOAD of time.
				//}

				res.send(product);
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
