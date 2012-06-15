var mongoose = require('mongoose');

module.exports = function(app){
	app.post('/submit', function(req, res){
		req.session = null;
		res.end('ok');
	});
};
