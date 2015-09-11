module.exports = function loader(){
	var braintree 	= require("braintree"),
		express 	= require('express'),
		router 		= express.Router(),
		bodyParser 	= require('body-parser');

	router.use(bodyParser.json());       // to support JSON-encoded bodies
	router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
	}));

	var gateway = braintree.connect({
	  environment: braintree.Environment.Sandbox,
	  merchantId: "qrbb4ynf6p6v2hvk",
	  publicKey: "d3t9t4pw2jzm4gr3",
	  privateKey: "f5021d4aa8d7932b8778c341ae3a793e"
	});

	router.post("/", function (req, res) {
		console.log(req.body);
		var nonce = req.body.nonce;

		// Use payment method nonce here
		gateway.transaction.sale({
			amount: '10.00',
			paymentMethodNonce: nonce,
		}, function (err, result) {
			if (err) {
				res.send(err);
			} else {
				console.log('success!');
				res.send(result);
			}
		});
	});

	return router;
}