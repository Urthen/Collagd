module.exports = function(app){
	app.get('/', function(req, res){
		var user = "";
		console.log("User:", user)
		if (req.user) {
			user = req.user.fbid;
		}
		res.render('index', {user: user});
	});
};
