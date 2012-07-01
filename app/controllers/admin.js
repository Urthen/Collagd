var mongoose = require('mongoose'),
	Image = mongoose.model("Image");

module.exports = function(app){
	app.get('/admin', function (req, res){
		var user = "";
		if (req.user) {
			user = req.user.fbid;
		}
		if (user != "17505088") {
			res.render('admin', {user: null});
			return;
		}
		
		Image.findOne({status: 'SUBMITTED'}, function (err, image) {
			res.render('admin', {user: user, image: image});
		});
	});

	app.post('/admin', function (req, res) {
		Image.findOne({_id: req.body.id}, function (err, image) {
			if (image) {
				image.status = req.body.status;
				image.save();
			}
			res.redirect('/admin');
		});
	});
};
