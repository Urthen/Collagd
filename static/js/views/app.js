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
    },
    render: function () {
			var user = $('body').attr('data-user');
      $(this.el).html(indexTemplate({user: user}))
      $('#addgifbtn').click(function() {
        $('#submitmsg').html("Submitting...");
        $.ajax({
          url: "/submit/image",
          type: "POST",
          data: {url: $('#addgiftxt').val()},
          success: function(data) {
            $('#submitmsg').html(data);
          },
          error: function() {
            $('#submitmsg').html('Whoops, something went wrong.');
          }
        })
      });

      $('#addalbumbtn').click(function() {
        $('#submitmsg').html("Submitting...");
        $.ajax({
          url: "/submit/album",
          type: "POST",
          data: {albumid: $('#addalbumtxt').val()},
          success: function(data) {
            $('#submitmsg').html(data);
          },
          error: function() {
            $('#submitmsg').html('Whoops, something went wrong.');
          }
        })
      })
		} 
	});
  return AppView;
});
