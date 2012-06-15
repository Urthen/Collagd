// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/collage'
], function ($, _, Backbone, CollageView) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Pages
			'/collage': 'collage',

			// Default - catch all
			'*actions': 'defaultAction'
		}
	});

	var initialize = function(options){
		var appView = options.appView,
			collageView = new CollageView(),
			router = new AppRouter(options);

		router.on('route:collage', function () {
			console.log('showing collage')
			collageView.render();
		});

		router.on('route:defaultAction', function (actions) {
			appView.render();
		});

		router.bind('all', function (route, router) {
			console.log(route)
			if (route != 'route:collage') {
				console.log("hiding collage")
				collageView.hide();
			}
		})
		
		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});
