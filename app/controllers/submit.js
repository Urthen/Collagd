var mongoose = require('mongoose');

module.exports = function(app){
	app.post('/submit', function(req, res){

		res.end('ok');
	});
};
