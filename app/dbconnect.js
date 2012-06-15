var mongoose = require("mongoose"),
	mongodb = require("mongodb");

module.exports.db = null;
module.exports.connect = function (config) {
	var server_config = new mongodb.Server(config.db.hostname, config.db.port, {auto_reconnect: true, native_parser: true}),
		user = config.db.username ? config.db.username + ":" + config.db.password + "@" : '',
		uri = "mongodb://" + user + config.db.hostname + ":" + config.db.port + "/" + config.db.db;
	
	module.exports.db = new mongodb.Db(config.db.db, server_config, {});

	if (config.db.username) {
		module.exports.db.authenticate(config.db.username, config.db.password)	
	}
	

	mongoose.connect(uri);

	console.log("Mongo connected to", uri)
};