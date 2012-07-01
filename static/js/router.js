// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/collage',
	'views/fineprint'
], function ($, _, Backbone, CollageView, FinePrintView) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Pages
			'/collage': 'collage',
			'/collage/': 'collage',
			'/fineprint': 'fineprint',

			// Default - catch all
			'*actions': 'defaultAction'
		}
	});

	var initialize = function(options){
		var appView = options.appView,
			collageView = new CollageView(),
			finePrintView = new FinePrintView(),
			router = new AppRouter(options);

		router.on('route:collage', function () {
			collageView.render();
		});

		router.on('route:defaultAction', function (actions) {
			appView.render();
		});

		router.on('route:fineprint', function () {
			if ($('.loadingHeader').length > 0) {
				appView.render();
			}
			finePrintView.render();
		});

		router.bind('all', function (route, router) {
			if (route != 'route:collage') {
				collageView.hide();
			}
			if (route != 'route:fineprint') {
				finePrintView.hide();
			}
		})
		
		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});
