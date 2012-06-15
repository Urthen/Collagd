var express = require("express"),
	fs = require("fs"),
	config_file = require("yaml-config"),
	config = config_file.readConfig("./config.yaml"),
	db_module = require("./app/dbconnect");

db_module.connect(config, express);

var port = process.env.PORT || 5000;
config.port = port;

// Setup Express Application
var app = express.createServer();
require("./app/settings").boot(app, config);

// Setup models
require('./app/models/image');
require('./app/models/user');

// Setup Authentication
require('./app/auth').setup(config);

// Setup controllers
require('./app/controllers/img')(app);
require('./app/controllers/index')(app);
require('./app/controllers/submit')(app);
require('./app/controllers/login')(app);

// Good to go, brah
app.listen(port, function () {
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});