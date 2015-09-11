module.exports = function loader(){
	var braintree 	= require("braintree"),
	express 		= require('express'),
	router 			= express.Router();

	var gateway = braintree.connect({
	  environment: braintree.Environment.Sandbox,
	  merchantId: "qrbb4ynf6p6v2hvk",
	  publicKey: "d3t9t4pw2jzm4gr3",
	  privateKey: "f5021d4aa8d7932b8778c341ae3a793e"
	});
	
	router.get("/", function (req, res) {
		// Generating new token for client
		gateway.clientToken.generate({}, function (err, response) {
			res.send(response.clientToken);
		});
	});

	return router;
}
