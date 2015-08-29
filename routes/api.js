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
        var url, mode = req.query.url;

		// IF loading listpage (not individual) for category
		if (mode.indexOf('http://') == -1) {
			switch(mode) {
			    case 'H': //Home
			        url = '';
			        break;

			    case 'MS': // Male shirts
			        url = 'http://www.aliexpress.com/af/category/200000668.html?site=glo&g=n&SortType=total_tranpro_desc&tag=&isFavorite=y&isAffiliate=y&shipCountry=AU&needQuery=n&isFreeShip=y';
			        break;

			    case 'MJ': // Male Jackets
			        url = 'http://www.aliexpress.com/af/category/200000662.html?isrefine=y&site=glo&g=n&SortType=total_tranpro_desc&tag=&isFavorite=y&isAffiliate=y&shipCountry=AU&needQuery=n&isFreeShip=y';
			        break;

			    case 'MA': // Male Accessories
			        url = 'http://www.aliexpress.com/af/category/200000599.html?isrefine=y&site=glo&g=n&SortType=total_tranpro_desc&tag=&isAffiliate=y&shipCountry=AU&needQuery=n';
			        break;

			    case 'MW': // Male Watches
			        url = 'http://www.aliexpress.com/af/category/200214006.html?shipCountry=AU&shipFromCountry=&shipCompanies=&SearchText=&minPrice=&maxPrice=&minQuantity=&maxQuantity=&isFreeShip=y&isFavorite=y&isRtl=all&isOnSale=n&isBigSale=n&similar_style=n&similar_style_id=&isAtmOnline=n&CatId=200214006&isAffiliate=y&needQuery=n&tag=&isOverseaTag=n';
			        break;

			    case 'WS': // Female Shirts
			        url = 'http://www.aliexpress.com/af/category/200001648.html?isrefine=y&site=glo&SortType=total_tranpro_desc&tag=&isFavorite=y&isAffiliate=y&shipCountry=AU&needQuery=n&isFreeShip=y';
			        break;

			    case 'WJ': // Female Jackets
			        url = 'http://www.aliexpress.com/af/category/200000775.html?isrefine=y&site=glo&SortType=default&tag=&isFavorite=y&isAffiliate=y&shipCountry=AU&needQuery=n&isFreeShip=y';
			        break;

			    case 'WD': // Female Dresses
			        url = 'http://www.aliexpress.com/af/category/200003482.html?site=glo&SortType=total_tranpro_desc&tag=&isFavorite=y&isAffiliate=y&shipCountry=AU&needQuery=n&isFreeShip=y';
			        break;

			    case 'WA': // Female Accessories
			        url = 'http://www.aliexpress.com/af/category/200000724.html?isrefine=y&site=glo&SortType=total_tranpro_desc&tag=&isFavorite=y&isAffiliate=y&shipCountry=AU&needQuery=n&isFreeShip=y';
			        break;

			    case 'WW': // Female Watches
			        url = 'http://www.aliexpress.com/af/category/200214031.html?isrefine=y&site=glo&g=n&SortType=total_tranpro_desc&tag=&isFavorite=y&isAffiliate=y&shipCountry=AU&needQuery=n&isRtl=yes&isFreeShip=y';
			        break;

			    default: // None Applicable
					console.log('Err: no applicable mode.')
					break;
			}
			console.log(url);

			// Crawl
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
					// IF ERRORS
			  		console.log('error: ' + err);
				} else {
					// IF no error, return data back to page
					var data = result;
					res.send(data);
				}
			});

		} else {
		// ELSE loading individual product
			var url = mode;
			x(url, 'body',
				{
					name: '.product-name',
					imagePrimary: x('.image-nav', ['.image-nav-item span img@src']),
					imageSecondary: x('#extend .col-main .main-content .detail-tab #pdt #product-desc #custom-description .ui-box-body', ['img@src']),
					rating: '#product-star b',
					discountPrice: '#sku-discount-price',
					multiPrice: x('#sku-price', ['span']),
					price: '#sku-price',
					select: x('#product-info-sku dl', [{
	                    type: 'dt',
	                    options: x('dd ul li', [{
	                        labelSize: 'a span',
	                        labelColor: 'a@title',
							labelImage: 'a img@src',
	                        id: 'a@id'
	                    }]),
	                }]),
					tags: x('#product-desc .ui-box-body .ui-attr-list', [{
						label: 'dt',
						content: 'dd'
					}])
				}
			)(function(err, product) {
				if (err){
			  		console.log('error: ' + err);
				} else {
					console.log('received initial data;');
					var items = 'blank';

					//for (i=0; i < data.length; i++){
					//	var item = data[i];
					//	console.log(item.link);

					            // Crawl the individual page links, this is going to take a F#CKLOAD of time.
					//}

					res.send(product);
				}
			});
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
