module.exports = function(app){
	app.get('/', function(req, res){
		var user = "";
		console.log("User:", req.user)
		console.log("Session:", req.session)
		if (req.user) {
			user = req.user.fbid;
		}
		res.render('index', {user: user});
	});
};
