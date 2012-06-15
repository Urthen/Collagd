var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.setup = function(config) {
	var port = config.needsPort ? ':' + config.port : '';

	passport.use(new FacebookStrategy({
			clientID: "370217413033720",
			clientSecret: "17d986cd0d6a3c72f39807b0299eae68",
			callbackURL: "http://collage.fritbot.com" + port + "/auth/facebook/callback"
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({fbid: profile.id}, function(err, user) {
				console.log("authorize", user, profile)
				if (!user) {
					user = new User();
					user.fbid = profile.id;
					user.name = profile.displayName;
					user.save()
					console.log("Created new user", user)
				}
				done(false, user);	
			})
		}
	));

	//Places the user into the session
	passport.serializeUser(function(user, done) {
		done(null, user.toJSON());
	});

	//Retrieves the user from the session
	passport.deserializeUser(function(json, done) {
		done(null, new User(json));
	});
}