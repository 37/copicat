var braintree = require("braintree");

var gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: "qrbb4ynf6p6v2hvk",
	publicKey: "d3t9t4pw2jzm4gr3",
	privateKey: "f5021d4aa8d7932b8778c341ae3a793e"
});

return gateway;
