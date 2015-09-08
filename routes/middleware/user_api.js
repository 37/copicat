module.exports = function loader(){
var express 	= require('express'),
	router 		= express.Router(),
	forms 		= require('forms'),
	postal	 	= require('../../models/postage');


//DECLAR SCHEMA OF NEW ADDRESS FORM:
var newAddress = forms.create({
	contactName: forms.fields.string({
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
router.get('/:user_id', function(req, res){
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

router.post('/postage/:user_id', function(req, res){
	newAddress.handle(req, {
		success: function (form) {
			if (isEmpty(form.data)){
				console.log ('Form data is empty');
			}
			else {
				// create a new user called chris
				var postalAddress = new postal({
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
				postalAddress.save(function(err) {
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
