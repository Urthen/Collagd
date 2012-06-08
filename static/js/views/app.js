define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
  var AppView = Backbone.View.extend({
    el: '.container',
    initialize: function () {
      window._csrf = $('body').attr('data-csrf');

      $("body").bind("ajaxSend", function(elm, xhr, s){
         if (s.type == "POST") {
            xhr.setRequestHeader('X-CSRF-Token', window._csrf);
         }
      });

      var that = this;
    },
    render: function () {
			var that = this;
      console.log('Rendering main.')

      require(['views/collage'], function(CollagePage) {
        var collagePage = new CollagePage;
        console.log('rendering collage')
        collagePage.render();
      });

		} 
	});
  return AppView;
});
