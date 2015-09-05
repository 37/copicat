module.exports = function loader(){
var express 	= require('express'),
	router 		= express.Router(),
	postal 		= require('../models/product');

//DEFAULT LOAD
router.all ('/:user_id', function(req, res){
	console.log('Loading user data for: ' + req.params.user_id);
	if (req.query.pass == 'sneakypassword') {
		var user_id = req.params.user_id;
		console.log('query : ' + cat);
		postal.find({ uid: user_id}, function(err, result) {
			if (err) throw err;
			// object of all the users returned in result variable
			res.send(result);
		});
	} else {
		res.send('Nice try Morty.');
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
