define([
  'jquery',
  'underscore',
  'backbone',
  'hbs!template/index'
], function($, _, Backbone, indexTemplate){
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
			var that = this,
          user = $('body').attr('data-user');
      console.log('Rendering main.')
      $(this.el).html(indexTemplate({user: user}))
		} 
	});
  return AppView;
});
