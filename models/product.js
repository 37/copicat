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
var productSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  price: { type: String, required: true },
  sales: Number,
  sex: { type: String, required: true },
  category: { type: String, required: true },
  options: Array,
  defaultimage: String,
  images: Array,
  tags: Array,
  rating: String,
  date: Date
});

// Generate id method
productSchema.methods.generateId = function () {
	//generate ID
	this.id = new mongoose.Types.ObjectId();
	return this.id;
};

// Generate date method
productSchema.pre('save', function(next) {
    now = new Date();
    this.date = now;
    next();
});

// we need to create a model using it
var product = mongoose.model('products', productSchema);

// make this available to our users in our Node applications
module.exports = product;
