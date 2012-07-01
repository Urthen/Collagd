var http = require('http'),
	mongoose = require('mongoose'),
	Image = mongoose.model("Image");

function loadImgurAlbum (albumid, callback) {
	var options = {
			host: 'api.imgur.com',
			port: 80,
			path: '/2/album/' + albumid + ".json",
			method: 'GET'
		},
		albumData = [];
		
	http.get(options, function(res){
		var data = '';

		res.on('data', function (chunk){
			data += chunk;
		});

		res.on('end',function(){
			try {
				albumData = JSON.parse(data).album.images;
			} catch (error) {
				console.log("Error parsing album data: " + albumid);
			}
			callback(albumData);
		});

	});
}

function submitImage (url, userid, callback) {
	Image.findOne({'url': url}, function(err, doc){
		if (doc === null) {
			var img = new Image();
			img.submitter = userid;
			img.url = url;
			img.save();
			callback(true);
		} else {
			callback(false);
		}
	});
}

module.exports = function(app){
	app.post('/submit/image', function(req, res){
		if (!req.user) {
			res.end('You need to be logged in!');
			return;
		}
		if (req.body.url.match(/https?:\/\/.+/i) === null) {
			res.end("That isn't a valid URL, make sure to include http/https!");
			return;
		}
		submitImage(req.body.url, req.user.id, function(result){
			if (result) {
				res.end("Your GIF has been submitted!");
			} else {
				res.end("That GIF has already been submitted.");
			}
		});
	});

	app.post('/submit/album', function(req, res){
		if (!req.user) {
			res.end('You need to be logged in!');
			return;
		}
		loadImgurAlbum(req.body.albumid, function(albumdata) {
			if (albumdata.length === 0) {
				res.end("Error parsing the album data or no images in album.<br/>Make sure you are submitting just the album ID, as in 'onzUR' if the album url is 'http://imgur.com/a/onzUR#0'");
			} else {
				var url, outstanding = 0;
				recurse = function(albumdata, output) {
					if (albumdata.length === 0) {
						res.end(output + "Ok, we're done!");
						return;
					}
					url = albumdata.pop().links.original;
					callback = function (result) {
						if (!result) {
							output += url + " wasn't added it is a duplicate.<br/>";
						}
						recurse(albumdata, output);
					};
					submitImage(url, req.user.id, callback);
				};
				recurse(albumdata, "");
			}
		});
	});
};
