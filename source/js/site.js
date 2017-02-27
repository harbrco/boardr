// @codekit-prepend "libs/modernizr.js"
// @codekit-prepend "libs/fastclick.js"
// @codekit-prepend "libs/aos.js"
// @codekit-prepend "libs/jquery.stellar.min.js"
// @codekit-prepend "libs/jquery.waypoints.min.js"
// @codekit-prepend "libs/jquery.easing.min.js"

// DOM Ready
(function($, window, undefined) {
	$(function() {


		if ($('html').hasClass('touch')) {
			// Helps mobile/touch devices to "click" faster
			FastClick.attach(document.body);
		}


		// Vertical Align Elements
		var vAlignShow = function() {
			$('.vAlign').fadeIn(50).css('visibility', 'visible'); // fixes the css "hidden" style for the flash before complete page load (.vAlign in _common.scss)
		};
		vAlignShow();
		var vAlignFun = function() {
			(function ($) {
			$.fn.vAlign = function() {
				return this.each(function(){
					var div = $(this).children('div.vAlign');
					var ph = $(this).innerHeight();
					var dh = div.height();
					var mh = (ph - dh) / 2;
					div.css('top', mh);
				});
			};
			})(jQuery);
			$('.vAlign').parent().vAlign();
		};
		$(window).load(function() {
			vAlignFun();
		});

		$(window).resize(function() {
			vAlignFun();
		}).resize();

		// Listen for resize changes (mobile orientation change)
		window.addEventListener("resize", function() {
			vAlignFun();
		}, false);



		// Screen Size Calculations
		var vpHeight;
		var screenSizeCalc = function(){
			vpHeight = $(window).height();
			$('.fullVP').css('min-height', vpHeight);
			$('.mediumVP').css('min-height', vpHeight * 0.7);
		};
		screenSizeCalc();

		var headerHeight;
		var headerHeightCalc = function(){
			headerHeight = $('.header-outer').outerHeight();
		};
		headerHeightCalc();


		$(window).resize(function() {
			screenSizeCalc();
			headerHeightCalc();
		}).resize();



		// Hero Scripts
		var heroSlider = $('.hero-slider');
		var headerWrapper = $('.header-wrapper');

		if ( heroSlider.length >= 1 ) {
			// Hero Slider
			// heroSlider.on('init', function(){
			// 	var thisSlider = $(this);
			// 	var thisCurrentSlide = thisSlider.find('.slick-current');
			// 	var thisSliderPager = thisSlider.closest('.slider-container').find('.slick-dots');

			// 	if ( thisCurrentSlide.hasClass('light-pager') ) {
			// 		thisSliderPager.addClass('pagerIsLight');
			// 	} else {
			// 		thisSliderPager.addClass('pagerIsDark');
			// 	}
			// });

			heroSlider.slick({
				dots: false,
				fade: true,
				infinite: true,
				draggable: false,
				appendArrows: '.slider-arrows .inner',
				customPaging : function(slider, i) {
					$(slider.$slides[i]).data();
					return '<a class="btn btn--alt">0'+(i+1)+'</a>';
				}
			}).on('beforeChange', function(event, slick, currentSlide, nextSlide){
				var thisSlider = $(this);
				var thisSliderPager = thisSlider.closest('.slider-container').find('.slick-dots');
				var nextSlideEl = $(slick.$slides.get(nextSlide));

				thisSliderPager.removeClass('pagerIsLight pagerIsDark');

				if ( nextSlideEl.hasClass('light-pager') ) {
					thisSliderPager.addClass('pagerIsLight');
				} else {
					thisSliderPager.addClass('pagerIsDark');
				}
			});

			// make header transparent initially
			headerWrapper.addClass('headerAtHeroTop');

			var headerHeroTop = $('.header-wrapper.headerAtHeroTop');

			// toggle menu background change on hover
			headerWrapper.mouseenter(function() {
				headerHeroTop.addClass('hasBackground');
			}).mouseleave(function() {
				headerHeroTop.removeClass('hasBackground');
			});


			// Waypoint to make header appear/dissapear
			heroSlider.waypoint({
				handler: function(direction) {
					if (direction === 'down') {
						headerWrapper.addClass('hasBackground');
					} else {
						headerWrapper.removeClass('hasBackground');
					}
				},
				offset: -10
			});

			heroSlider.waypoint({
				handler: function(direction) {
					if (direction === 'down') {
						headerWrapper.removeClass('headerAtHeroTop');
					} else {
						headerWrapper.addClass('headerAtHeroTop');
					}
				},
				offset: -10
			});

		} else {
			// NO HERO on page - add top padding to middle-wrapper to push content down.
			var headerSpacingCalc = function(){
				$('.middle-wrapper').css('padding-top', headerHeight);
			};
			headerSpacingCalc();

			$(window).resize(function() {
				headerSpacingCalc();
			}).resize();
		}

		// Header appear disappear when scrolling down and up on page
		var headerAppearBuffer;
		var headerOuter = $('.header-outer');
		var headerAppearBufferCalc = function(){
			headerAppearBuffer = $('.middle-wrapper').position().top + 600;
		};
		headerAppearBufferCalc();

		var lastScrollTop = 0;
		$(window).scroll(function(){
			var st = $(this).scrollTop();
			if (st > headerAppearBuffer && st > lastScrollTop){
				headerOuter.addClass('headerHidden');
			} else {
				headerOuter.removeClass('headerHidden');
			}
			lastScrollTop = st;
		});




		// AOS - Animate On Scroll
		/* global AOS */
		var aosInit = function() {
			AOS.init({
				disable: 'mobile'
			});
		};
		aosInit();



		// Stellar.js - parallax effects
		var stellarJsInit = function(){
			if ( ! $('html').hasClass('touch') ) {
				$(window).on('scroll', function(){
					$.stellar({
						horizontalScrolling: false,
						responsive: true,
						positionProperty: 'transform',
						hideDistantElements: false
					});
				});
			}
		};
		stellarJsInit();



		// Smooth scrolling to anchors
		var smoothScroll = function() {
			$('a[href*=#]:not([href=#])').click(function() {
				if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
					var target = $(this.hash);
					target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
					if (target.length) {
						$('html,body').animate({
							scrollTop: target.offset().top
						}, 900, "easeInOutQuart");
						return false;
					}
				}
			});
		};
		setTimeout(function() {
			smoothScroll();
		}, 260);



		//Waypoints.js
		var waypointInit = function() {
			// var stickyHeader = new Waypoint({
			// 	element: document.getElementById('belowHero'),
			// 	handler: function(direction) {
			// 		if (direction === 'down') {
			// 			$(".fixed-nav").removeClass("non-sticky");
			// 		} else {
			// 			$(".fixed-nav").addClass("non-sticky");
			// 		}
			// 	}
			// });
		};
		waypointInit();



		// MAKE SURE TO ADD ANY NEW LIBRARIES TO THIS INIT FUNCTION (For AJAX script reloading) - - - - - - -
		/* jshint ignore:start */
		// var libsInit = function() {
		// 	vAlignShow();
		// 	vAlignFun();
		// 	aosInit();

		// 	$.stellar('destroy');
		// 	setTimeout(function(){
		// 		stellarJsInit();
		// 	}, 200);

		// 	screenSizeCalc();
		// 	smoothScroll();

		// 	setTimeout(function(){
		// 		Waypoint.refreshAll();
		// 		waypointInit();
		// 	}, 200);

		// 	$(window).resize(function() {
		// 		vAlignFun();
		// 		screenSizeCalc();
		// 	}).resize();

		// 	// Listen for resize changes (mobile orientation change)
		// 	window.addEventListener("resize", function() {
		// 		vAlignFun();
		// 	}, false);
		// };
		/* jshint ignore:end */


	});
})(jQuery, window);
