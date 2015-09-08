var mongoose = require('mongoose');

var uristring = 'mongodb://application:Kinetikx37&&@ec2-54-206-83-33.ap-southeast-2.compute.amazonaws.com:27017/copicat';

mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// grab the things we need
//var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var postalAddressSchema = new Schema({
  uid: { type: String, required: true},
  name: { type: String, required: true },
  phone: String,
  address1: { type: String, required: true },
  address2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: String,
  country: { type: String, required: true },
  date: Date,
  default: Boolean
});

// Generate date method
postalAddressSchema.pre('save', function(next) {
    now = new Date();
    this.date = now;
    next();
});

// we need to create a model using it
var postage = mongoose.model('postage', postalAddressSchema);

// make this available to our users in our Node applications
module.exports = postage;
