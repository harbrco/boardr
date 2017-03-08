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



		// Header & Hero Scripts
		var headerWrapper = $('.header-wrapper');

		var submenuSizeCalc = function(){
			$('.header .menu-desktop ul.submenu').css('top', headerHeight);
		};
		submenuSizeCalc();

		var searchResultsSizeCalc = function(){
			$('.search-results, .search-results inner').css('height', vpHeight - headerHeight);
			$('.search-results').css('top', headerHeight);
		};
		searchResultsSizeCalc();

		$(window).resize(function() {
			submenuSizeCalc();
			searchResultsSizeCalc();
		}).resize();


		// Desktop Header Search
		var searchLink = $('.search-link a');
		$('body').on('click', '.search-toggle', function(e){
			e.preventDefault();
			$('body').toggleClass('noScroll').toggleClass('searchOpen');
			searchLink.toggleClass('open-search close-search');
			$('.header-search-bar, .search-results').toggleClass('isActive');

			if (searchLink.text() === searchLink.data("text-swap")) {
				searchLink.text(searchLink.data("text-original"));
			} else {
				searchLink.data("text-original", searchLink.text());
				searchLink.text(searchLink.data("text-swap"));
			}

			$('.header-search-bar input').focus();
		});

		$('body').on('click', '.close-search', function(e){
			e.preventDefault();
			$('.header-search-bar input').val('');
		});


		var heroSlider = $('.hero-slider');

		if ( heroSlider.length >= 1 ) {
		// If there's a hero slider on the page...
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
				autoplay: true,
				autoplaySpeed: 5000,
				infinite: true,
				draggable: false,
				appendArrows: '.slider-arrows .inner',
				customPaging : function(slider, i) {
					$(slider.$slides[i]).data();
					return '<a class="btn btn--alt">0'+(i+1)+'</a>';
				}
			});

			// make header transparent initially
			headerWrapper.addClass('headerAtHeroTop');

			var headerHeroTop = $('.header-wrapper.headerAtHeroTop');

			// toggle menu background change on hover
			headerWrapper.mouseenter(function() {
				headerHeroTop.addClass('hasBackground');
			}).mouseleave(function() {
				if ( $('body').hasClass('searchOpen') ) {
					// don't remove header class 'hasBackground'
				} else {
					headerHeroTop.removeClass('hasBackground');
				}
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



		// Content Module Sliders
		var cardCarousel = $('.card-carousel .card-list');
		if ( cardCarousel.length >= 1 ) {
			cardCarousel.each(function (idx) {
				var carouselId = "carousel" + idx;
				var $el = $(this);
				var $wrapper = $el.closest('.card-carousel-wrapper');
				$wrapper.addClass(carouselId);
				$el.attr('id', carouselId);

				$el.slick({
					dots: false,
					infinite: true,
					draggable: false,
					slidesToShow: 4,
					slidesToScroll: 4,
					appendArrows: ".card-carousel-wrapper." + carouselId + " .card-carousel-arrows .inner",
					responsive: [
						{
							breakpoint: 1280,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3
							}
						},
						{
						breakpoint: 900,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						}
					]
				});
			});
		}


		var ctaSlider = $('.cta-slider');
		if ( ctaSlider.length >= 1 ) {
			ctaSlider.each(function (idx) {
				var sliderId = "slider" + idx;
				var $el = $(this);
				var $wrapper = $el.closest('.cta-slider-wrapper');
				$wrapper.addClass(sliderId);
				$el.attr('id', sliderId);

				$el.slick({
					slide: "#" + sliderId +" .slide",
					appendArrows: ".cta-slider-wrapper." + sliderId + " .cta-slider-arrows .inner",
					dots: false,
					fade: true,
					infinite: true,
					draggable: false
				});
			});
		}


		var productSlider = $('.product-slider');
		var productSliderNav = $('.product-slider-nav');
		if ( productSliderNav.length >= 1 ) {
			productSlider.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				fade: true,
				adaptiveHeight: true,
				appendArrows: '.product-slider-arrows .inner',
				asNavFor: productSliderNav
			});

			productSliderNav.slick({
				slidesToShow: 7,
				slidesToScroll: 1,
				asNavFor: productSlider,
				centerPadding: '0',
				infinite: true,
				focusOnSelect: true,
				dots: false,
				arrows: false,
				responsive: [
					{
						breakpoint: 1440,
						settings: { slidesToShow: 6 }
					},
					{
						breakpoint: 1280,
						settings: { slidesToShow: 5 }
					},
					{
					breakpoint: 1024,
						settings: { slidesToShow: 4 }
					},
					{
						breakpoint: 900,
						settings: { slidesToShow: 7 }
					},
					{
						breakpoint: 768,
						settings: { slidesToShow: 6 }
					},
					{
						breakpoint: 680,
						settings: { slidesToShow: 5 }
					},
					{
					breakpoint: 580,
						settings: { slidesToShow: 4 }
					},
					{
					breakpoint: 460,
						settings: { slidesToShow: 3 }
					}
				]
			});
		}





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


	});
})(jQuery, window);
