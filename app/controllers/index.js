module.exports = function(app){
	app.get('/', function (req, res){
		var user = "";
		if (req.user) {
			user = req.user.fbid || req.user.twid;
		}
		res.render('index', {user: user});
	});

	app.post('/', function (req, res) {
		var user = "";
		if (req.user) {
			user = req.user.fbid || req.user.twid;
		}
		res.render('index', {user: user});
	})
};
