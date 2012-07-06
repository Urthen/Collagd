var express = require("express"),
	fs = require("fs"),
	db_module = require("./app/dbconnect");

var config = {},
	port = process.env.PORT || 5000;

config.port = port;
config.env = process.env.NODE_ENV;
config.salt = process.env.SALT;
config.db = {
	hostname: process.env.DB_HOST,
	db: process.env.DB_DB,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD
};

db_module.connect(config, express);

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
require('./app/controllers/admin')(app);

// Good to go, brah
app.listen(port, function () {
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});