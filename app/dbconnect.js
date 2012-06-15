var mongoose = require("mongoose");

module.exports.db = null;
module.exports.connect = function (config, express) {
	var mongodb = require("connect-mongo")(express);
	var user = config.db.username ? config.db.username + ":" + config.db.password + "@" : '',
		uri = "mongodb://" + user + config.db.hostname + ":" + config.db.port + "/" + config.db.db,
		dbconf = {
			db: config.db.db,
			host: config.db.hostname,
			port: config.db.port
		};

	if (config.db.username) {
		dbconf.username = config.db.username;
		dbconf.password = config.db.password;
	}
	
	module.exports.db = new mongodb(dbconf);
	

	mongoose.connect(uri);

	console.log("Mongo connected to", uri)
};