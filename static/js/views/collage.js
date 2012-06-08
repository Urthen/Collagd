define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone){

	function sortImages(a, b) {
		var ah = parseFloat($(a).attr('data-height')),
			bh = parseFloat($(b).attr('data-height'));

		if (ah > bh) {
			return 1;
		} else if (ah < bh) {
			return -1;
		} else {
			return 0;
		}
	}

	var CollagePage = Backbone.View.extend({
		el: '.container',
		intervals: {
			add: null,
			remove: null
		},

		reflow: function () {
			console.log("reflow...")
			if ($(this)) $(this).attr('data-width', this.width).attr('data-height', this.height).removeClass('preloaded')

			var images = $('img:not(.preloaded)'),
				$body = $('body');
				
			images.sort(sortImages)
			row = $("<span class='imgrow preloaded'></div>")
			sumwidth = 0
			$('body .imgrow').remove()
			$body.append(row)

			images.each(function (index, image){
				var $image = $(image);
				sumwidth += parseInt($image.attr('data-width'));
				if (sumwidth > ($body.innerWidth() + parseFloat($image.attr('data-width')) / 2)) {
					var total = 0, num = 0, average, scale;
					row.find('img').each(function(index, image){
						var $image = $(image);
						total += parseFloat($image.attr('data-height'));
						num += 1;
					})
					average = total / num;
					total = 0
					row.find('img').each(function(index, image) {
						var $image = $(image);
						$(image).attr('data-scale', average / parseFloat($(image).attr('data-height')))
						total += parseFloat($image.attr('data-width'))
					})
					scale = ($body.innerWidth() - 30) / total
					row.find('img').each(function(index, image) {
						var $image = $(image);
						image.height = parseFloat($image.attr('data-height')) * parseFloat($image.attr('data-scale')) * scale
						image.width = parseFloat($image.attr('data-width')) * parseFloat($image.attr('data-scale')) * scale
					})
					row.removeClass('preloaded');
					row = $("<div class='imgrow preloaded'></div>");
					$body.append(row);
					$('.header').remove();
					sumwidth = parseFloat($image.attr('data-width'))
				}
				row.append(image);
			})
		},

		addImage: function () {
			if ($('body').height() > $(window).height()) return;

			var that = this;

			$.ajax({
				url: '/img', 
				success: function (data) {
				if ($("[src='" + data +"']").length == 0) {
					var image = $("<img src='" + data + "' class='preloaded'/>")
					$('body').append(image);
					$('img').load(that.reflow)
				} else {
					console.log("skipped", data)
					that.addImage();
				}},
				error: function () {
					clearInterval(that.intervals.add);
					clearInterval(that.intervals.remove);
					$('body').prepend("<h2>Oops... Something went wrong. Enjoy the GIFs while you can and refresh in a while.</h2>");
				}
			});
		},

		removeRow: function () {
			var images = $('.imgrow'),
				rand = Math.floor(Math.random() * images.length)
			$(images[rand]).remove();
		},
		render: function () {
			_.bindAll(this, 'addImage', 'removeRow')

			this.intervals.add = setInterval(this.addImage, 500);
			this.intervals.remove = setInterval(this.removeRow, 30000);
		},

	});
	return CollagePage;
});
