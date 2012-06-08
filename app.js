var express = require("express"),
	expressMongoose = require("express-mongoose"),
	fs = require("fs"),
	config_file = require("yaml-config"),
	config = config_file.readConfig("./config.yaml"),
	db_module = require("./app/dbconnect");

db_module.connect(config);

// Bootstrap models
var models_path = __dirname + "/app/models";
var model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
	if (file.substr(-3) === ".js") {
		require(models_path + "/" + file);
	}
});

// Setup Express Application
var app = express.createServer();
require("./app/settings").boot(app, config);

// Bootstrap controllers
var controllers_path = __dirname + "/app/controllers",
	controller_files = fs.readdirSync(controllers_path);

controller_files.forEach(function (file) {
	if (file.substr(-3) === ".js") {
		require(controllers_path + "/" + file)(app);
	}
});

// Good to go, brah
var port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});