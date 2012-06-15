define([
	'jquery',
	'underscore',
	'backbone',
	'hbs!template/collage'
], function($, _, Backbone, collageTemplate){

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
			remove: null
		},
		running: false,
		images: [],

		initialize: function () {
			this.addImage = _.throttle(this.addImage, 1000)
			_.bindAll(this, 'addImage', 'removeRow', 'reflow')
			this.reflow = _.wrap(this.reflow, function(func) {
				if ($(this)) $(this).attr('data-width', this.width).attr('data-height', this.height).removeClass('preloaded');
				func();
			})
		},

		reflow: function () {
			var images = $('img:not(.preloaded)'),
				$body = $('body'),
				container = $(this.el).find('.gifs');
				
			images.sort(sortImages)
			row = $("<span class='imgrow preloaded'></div>")
			sumwidth = 0
			container.find('.imgrow').remove()
			container.append(row)

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
					container.append(row);
					$('.header').remove();
					sumwidth = parseFloat($image.attr('data-width'))
				}
				row.append(image);
			});
			this.addImage();
		},

		loadMoreImages: function () {
			console.log("Loading more images...")
			var that = this;
			$.ajax({
				url: '/img', 
				success: function (data) {
					that.images = data.split(',');
					that.addImage();
				},
				error: function () {
					clearInterval(that.intervals.remove);
					that.intervals.remove = null;
					$('.error').removeClass('hidden')
				}
			});
		},

		addImage: function () {
			if (!this.running || $('body').height() > $(window).height()) return;
			var url;
			for (var i = 0; i < 10; i++) {
				if (this.images.length == 0) {
					this.loadMoreImages();
					break;
				}
				url = this.images.pop();
				if ($("[src='" + url +"']").length == 0) {
					var image = $("<img src='" + url + "' class='preloaded'/>")
					$('body').append(image);
					image.load(this.reflow);
				}
			}
			if (!this.intervals.remove) {
				this.intervals.remove = setInterval(this.removeRow, 30000);
			}
		},

		removeRow: function () {
			var images = $('.imgrow'),
				rand = Math.floor(Math.random() * images.length)
			if (images.length === 0) {
				clearInterval(this.images.remove);
				this.images.remove = null;
			} else {
				$(images[rand]).remove();
				this.addImage();
			}
		},
		render: function () {
			this.running = true;
			$(this.el).html(collageTemplate());
			this.addImage();
			$(window).resize(function() {
				if (!this.running) return;
				if ($('.imgrow').length > 0) {
					this.addImage();
				}
			})
		},
		hide: function () {
			clearInterval(this.images.remove);
			this.running = false;
		}

	});
	return CollagePage;
});
