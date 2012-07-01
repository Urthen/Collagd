var mongoose = require('mongoose'),
	Image = mongoose.model("Image");

function shuffle(a, b) {
	return Math.floor(Math.random() * 2) - 1;
}

function getImages(done) {
	Image.find({status: "APPROVED"}, function (err, images) {
		if (!images) {
			done([]);
			return;
		}
		console.log(images);
		done(images.map(function (img) {
			return img.url;
		}));
	});
}

module.exports = function(app){
	app.get('/img', function (req, resp) {
		resp.setHeader("Content-Type", "text/plain");
		getImages(function (urls) {
			var random;
			if (urls && urls.length > 0) {
				urls.sort(shuffle);
				random = urls.slice(0, 100);
				resp.end(random.join(','));
			} else {
				console.log("no urls available");
				resp.statusCode = 500;
				resp.end("error");
			}
		});
	});
};
