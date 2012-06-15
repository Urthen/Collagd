var passport = require('passport');

module.exports = function(app){
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', 
			passport.authenticate('facebook', { successRedirect: '/',
												failureRedirect: '/' }));
};
