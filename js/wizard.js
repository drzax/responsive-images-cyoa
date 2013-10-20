/*!
 * A plugin for reveal.js which provides some wizard style functionality.
 * 
 * Copyright (c) Simon Elvery
 */
var Wizard = (function($, undefined){$(function(){
	
	// An array of arrays to store excluded solutions by question
	var log = [], // Stores a log of the previously viewed question slides
		$solutions = $('#solutions div.solution'),
		$questionsNav = $('#question-nav'),
		$count = $('#solutions-count span');
		
	$count.html($solutions.not('.excluded').length);
	$solutions.find('a').attr('target', '_blank');

	// Update slide nav at the start, in case anyone lands in the middle.
	updateSlideNav()
	
	/**
	 * Update the visibility of solutions count and reset/back buttons.
	 * @return {null}
	 */
	function updateSlideNav() {

		var $current;

		$current = $(Reveal.getCurrentSlide());
		if ($current.hasClass('question') || $current.hasClass('answers')) {
			$('#solutions-count').show();
			$('button.restart').css('display', 'inline');
			if (log.length) {
				$('button.back').css('display', 'inline');
			}
		} else {
			$('#solutions-count').hide();
			$('#question-nav button').hide();
		}
	}
	
	/**
	 * Update the available solutions
	 * @return {Number} The remaining available solutions
	 */
	function updateAvailableSolutions() {
		var excluded;

		excluded = [];
		
		$solutions.removeClass('excluded');
		
		$('.responses button.selected').each(function(){
			var exclude = $(this).data('exclude');
			excluded += (exclude === undefined) ? [] : exclude.split(',');
		});

		$solutions.each(function(idx){
			var $this = $(this);

			if (excluded.indexOf($this.attr('id')) > -1) {

				// Mark the solution as excluded
				$this.addClass('excluded');
			}
		});

		count = $solutions.not('.excluded').length;
		$count.html(count);
		
		return count;
	}

	/**
	 * Return a hash link to the slide with the supplied indicies. If no indicies object
	 * is supplied, use the current slide.
	 * 
	 * @param  {Object} indicies The indicies of the slide to return link to
	 * @return {String}          The fragment link
	 */
	function getHashLink(indicies) {
		var link;

		// If indicies isn't supplied, use the current slide.
		if (indicies === undefined) {
			indicies = Reveal.getIndices();
		}

		// Always include the horizontal link
		link = '#/'+indicies.h;

		// Only include vertical if it's greater than zero
		if (indicies.v > 0) {
			link += '/'+indicies.v;
		}

		return link;
	}
	
	/*
	 * Handle response button clicks
	 */
	$(document).on('click', 'button.answer', function(){
		var $this;

		$this = $(this);

		// Record the selected answer
		$this.addClass('selected').siblings('button').removeClass('selected');

		// Record the answered slide in the log
		if ($(Reveal.getCurrentSlide()).hasClass('question')) {
			log.push(getHashLink());
		}

		// Update the available solutions and find the next appropriate slide.
		if (updateAvailableSolutions() > 1) {
			(($this.data('next')) ? Reveal[$this.data('next')] : Reveal.right)();
		} else {
			$('#result').removeClass('count-1').removeClass('count-0').addClass('count-'+count);
			window.location = '#/result';
		}
		return false;
	});
	
	/*
	 * Handle clicks on more info toggle buttons
	 */
	$(document).on('click', '.more-toggle', function() {
		var $section = $(this).parents('section').first();
		$section.toggleClass('show-more');
		$(this).text(($section.hasClass('show-more')?'Less':'More'));
		return false;
	});
	
	/*
	 * Start button click handler, just move to the next slide!
	 */
	$(document).on('click', 'button.start', function(){
		Reveal.next();
		return false;
	});
	
	/*
	 * Handle clicks on the back button
	 */
	$(document).on('click', 'button.back', function(){
		var location = log.pop();

		if (location !== undefined) {
			window.location = location;
		}

		if (location === undefined || log.length < 1) {
			$questionsNav.find('button.back').hide();
		}

		return false;
	});
	
	/*
	 * Handle clicks on the reset button
	 */
	$(document).on('click', 'button.restart', function(){
		$('button').removeClass('selected');
		updateAvailableSolutions();
		log = [];
		window.location = '#/start';
		return false;
	});

	/*
	 * Handle slide change event to record analytics and update display.
	 */
	Reveal.addEventListener( 'slidechanged', function( event ) {
		
		// Track it in Google Analytics
		if (_gaq) _gaq.push(['_trackPageview', getHashLink({h:event.indexh,v:event.indexv})]);

		// Should the slide nav be displayed?
		updateSlideNav();
		
	});

	
});}(jQuery));
