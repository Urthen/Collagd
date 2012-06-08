var express = require("express"),
	expressMongoose = require("express-mongoose"),
	fs = require("fs"),
	config_file = require("yaml-config"),
	config = config_file.readConfig("./config.yaml"),
	db_module = require("./app/dbconnect");

db_module.connect(config);


// Setup Express Application
var app = express.createServer();
require("./app/settings").boot(app, config);

// Setup controllers
require('./app/controllers/img')(app);
require('./app/controllers/index')(app);

// Good to go, brah
var port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});