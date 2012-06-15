module.exports = function(app){
	app.get('/', function(req, res){
		var user=""
		if (req.user) {
			user = req.user.fbid;
		}
		res.render('index', {user: user});
	});
};
