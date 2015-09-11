module.exports = function loader(){
var express 	= require('express'),
	braintree 	= require("braintree"),
	router 		= express.Router(),
	forms 		= require('forms'),
	postal	 	= require('../../models/postage');

	var gateway = braintree.connect({
	  environment: braintree.Environment.Sandbox,
	  merchantId: "qrbb4ynf6p6v2hvk",
	  publicKey: "d3t9t4pw2jzm4gr3",
	  privateKey: "f5021d4aa8d7932b8778c341ae3a793e"
	});

//DECLAR SCHEMA OF NEW ADDRESS FORM:
var newAddress = forms.create({
	contactName: forms.fields.string({
		required: true
	}),
	contactId: forms.fields.string({
		required: true
	}),
	contactNumber: forms.fields.string(),
	address1: forms.fields.string({
		required: true
	}),
	address2: forms.fields.string(),
	postalCity: forms.fields.string({
		required: true
	}),
	postalState: forms.fields.string({
		required: true
	}),
	postalZip: forms.fields.string(),
	postalCountry: forms.fields.string({
		required: true
	})
});

//DEFAULT LOAD
router.all ('/:user_id', function(req, res){
	console.log('Loading user data for: ' + req.params.user_id);
	if (req.query.pass == 'sneakypassword') {
		var user_id = req.params.user_id;
		console.log('query : ' + cat);
		postage.find({ uid: user_id}, function(err, result) {
			if (err) throw err;
			// object of all the users returned in result variable
			res.send(result);
		});
	} else {
		res.send('Nice try Morty.');
	}
});

router.all ('/postage/:user_id', function(req, res){
	newProduct.handle(req, {
		success: function (form) {
			if (isEmpty(form.data)){
				console.log ('Form data is empty');
			}
			else {
				var brain_id = $(req.user.user_id).replace('|', '');
				gateway.address.create({
					customerId: brain_id,
					firstName: form.data.contactName,
					streetAddress: form.data.address1,
					extendedAddress: form.data.address2,
					locality: form.data.postalCity,
					region: form.data.postalState,
					postalCode: form.data.postalZip,
					countryCodeAlpha2: form.data.postalCountry
				}, function (err, result) {
					console.log('New address saved to Braintree');
				});

				// MONGODB ---------------------
				// create a new user called chris
				var newAddress = new postal({
					uid : 		req.user.user_id,
					name : 		form.data.contactName,
					phone : 	form.data.contactNumber,
					address1 : 	form.data.address1,
					address2 : 	form.data.address2,
					city : 		form.data.postalCity,
					state : 	form.data.postalState,
					zip : 		form.data.postalZip,
					country : 	form.data.postalCountry,
					default : 	0
				});

				// Call save method to commit product to database;
				newAddress.save(function(err) {
					if (err) throw err;
					console.log('New postal address saved successfully!');
					res.send('success');
				});
			}
		},
		error: function (form) {
			res.send('Errors: ' + collectFormErrors(form));
		},
		empty: function (){
			res.send('Form is empty');
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
