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
		var nonce = req.body.nonce;
		console.log('payment req body: ' + req.body);
		console.log('braintree payment nonce: ' + nonce);
		var brain_id = (req.user.id).replace('|', '');

		// Create payment method
		gateway.paymentMethod.create({
			customerId: brain_id,
			paymentMethodNonce: nonce,
			options: {
				makeDefault: true,
				failOnDuplicatePaymentMethod: true
				//verifyCard: true
			},
			deviceData: req.body.device_data
		}, function (err, result) {
			console.log(result);
		});

	});

	return router;
}
