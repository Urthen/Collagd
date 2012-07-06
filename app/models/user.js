var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var User = new Schema({
	fbid: String,
	twid: String,
	name: String
});

mongoose.model('User', User);