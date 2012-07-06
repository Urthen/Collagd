var passport = require('passport');

module.exports = function(app){
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', 
			passport.authenticate('facebook', { successRedirect: '/#/authsucceed',
												failureRedirect: '/#/authfail' }));
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', 
			passport.authenticate('twitter', { successRedirect: '/#/authsucceed',
												failureRedirect: '/#/authfail' }));
};
