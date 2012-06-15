module.exports = function(app){
	app.get('/', function(req, res){
		var user = "";
		console.log("User:", req.user)
		if (req.user) {
			user = req.user.fbid;
		}
		res.render('index', {user: user});
	});
};
