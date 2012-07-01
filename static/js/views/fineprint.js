define([
	'jquery',
	'underscore',
	'backbone',
	'hbs!template/fineprint'
], function($, _, Backbone, finePrintTemplate){

	var FinePrintPage = Backbone.View.extend({
		el: '.container',

		render: function () {
			$(this.el).append(finePrintTemplate());
			$('.finePrintBox').fadeIn();
		},
		hide: function () {
			$('.finePrintBox').fadeOut();
		}

	});
	return FinePrintPage;
});
