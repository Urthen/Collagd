var http = require('http'),
	imguralbum = 'onzUR',
	refreshTime = 1000 * 60 * 5,
	albumData = [], albumRefreshed;

function loadImgurAlbum (callback) {
	if (!albumRefreshed || Date.now() - albumRefreshed > refreshTime) {
		var options = {
			host: 'api.imgur.com',
			port: 80,
			path: '/2/album/' + imguralbum + ".json",
			method: 'GET'
		};
		http.get(options, function(res){
			var data = '';

			res.on('data', function (chunk){
				data += chunk;
			});

			res.on('end',function(){
				try {
					albumData = JSON.parse(data).album.images;
					albumRefreshed = Date.now();
				} catch (error) {
					console.log("Error parsing album data");
				}
				callback(albumData);
			});

		});
	} else {
		if (callback) {
			callback(albumData);
		}
	}
}

function processAlbum (album) {
	var out = [];
	for (var i in album) {
		out.push(album[i].links.original);
	}
	return out;
}

module.exports = function(app){
	app.get('/img', function (req, resp) {
		loadImgurAlbum(function (album) {
			var urls = processAlbum(album),
				random;
			
			resp.setHeader("Content-Type", "text/plain");
			if (urls.length > 0) {
				random = urls[Math.floor(Math.random() * urls.length)];
				resp.end(random);
			} else {
				resp.statusCode = 500;
				resp.end("error");
			}
			
		});
	});
};
