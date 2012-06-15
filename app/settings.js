var express = require("express"),
	MongoStore = require("connect-mongodb"),
	db = require("./dbconnect").db,
	passport = require("passport");

exports.boot = function (app, config) {

	app.configure(function () {
		app.use(express.static(__dirname + "/../static/"));
		app.set("views", __dirname + "/views");
		app.set("view engine", "jade");
		app.set("view options", {"layout": false});
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({ secret: config.security.salt, store: new MongoStore({db: db})}));
		app.use(express.csrf());
		app.use(passport.initialize());
		app.use(passport.session());
		app.dynamicHelpers({
			token: function(req, res) {
				return req.session._csrf;
			}
		});
		app.use(app.router);
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

};
