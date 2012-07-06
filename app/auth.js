var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.setup = function(config) {
	var port = config.env != 'production' ? ':' + config.port : '';

	passport.use(new FacebookStrategy({
			clientID: config.auth.fb.id,
			clientSecret: config.auth.fb.secret,
			callbackURL: "http://collage.fritbot.com" + port + "/auth/facebook/callback"
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({fbid: profile.id}, function(err, user) {
				if (err) return done(err);
				if (!user) {
					user = new User();
					user.fbid = profile.id;
					user.name = profile.displayName;
					user.save();
				}
				done(false, user);	
			});
		}
	));

	passport.use(new TwitterStrategy({
			consumerKey: config.auth.twitter.key,
			consumerSecret: config.auth.twitter.secret,
			callbackURL: "http://collage.fritbot.com" + port + "/auth/twitter/callback"
		},
		function(token, tokenSecret, profile, done) {
			User.findOne({twid: profile.id}, function(err, user) {
				if (err) return done(err);
				if (!user) {
					user = new User();
					user.twid = profile.id;
					user.name = profile.displayName;
					user.save();
				}
				done(false, user);	
			});
		}
	));

	//Places the user into the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	//Retrieves the user from the session
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			if (err) return done(err);
			done(null, user);
		});
	});
};