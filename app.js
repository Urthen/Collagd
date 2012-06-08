var express = require("express"),
	fs = require("fs"),
	http = require("http");

// Setup Express Application
var app = express.createServer(),
	imgurkey = '7d959347242311e94fcc60f761e9e373',
	imguralbum = 'onzUR',
	refreshTime = 1000 * 60 * 5,
	albumData = [], albumRefreshed;

app.configure(function () {
	app.set("views", __dirname);
	app.set("view options", { layout: false });
	app.register('.html', {
	    compile: function(str, options){
	      return function(locals){
	        return str;
	      };
	    }
	  });
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, resp){
    resp.render('index.html');
});

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
		        callback(albumData)
		    })

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

app.get('/img', function (req, resp) {
	loadImgurAlbum(function (album) {
		var urls = processAlbum(album),
			random;
		
		resp.setHeader("Content-Type", "text/plain");
		if (urls.length > 0) {
			random = urls[Math.floor(Math.random() * urls.length)];
			resp.end(random);
		} else {
			resp.statusCode = 500
			resp.end("error")
		}
		
	})
})

// Good to go, brah
var port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});