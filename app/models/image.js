var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ImageModel = new Schema({
	url: String,
	status: {type: String, default: "SUBMITTED"},
	moderated: Date,
	submitted: {type: Date, default: Date.now},
	submitter: String
});

mongoose.model('Image', ImageModel);