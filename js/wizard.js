/*!
 * A plugin for reveal.js which provides some wizard style functionality.
 * 
 * Copyright (c) Simon Elvery
 */
var Wizard = (function($, undefined){$(function(){
	
	// An array of arrays to store excluded solutions by question
	var excluded = [],
		started = false, // Has the wizard been started?
		log = [], // Stores the navigation history
		$solutions = $('#solutions div.solution'),
		$count = $('#solutions-count span');
		
	$count.html($solutions.not('.excluded').length);
	
	$solutions.find('a').attr('target', '_blank');
	
	Reveal.addEventListener( 'slidechanged', function( event ) {
		var location = '#/'+event.indexh;
		
		if (event.indexv > 0) {
			location += '/'+event.indexv;
		}
		
		log.push(location);
		if (log.length > 2) log.shift();
	});
	
	function updateAvailableSolutions() {
		var i,j, id, count;
		
		$solutions.removeClass('excluded');
		
		for (i in excluded) {
			for (j in excluded[i]) {
				
				id = excluded[i][j];
				
				$solutions.each(function(){
					var $this = $(this);
					if ($this.is('#'+id)) {
						$this.addClass('excluded');
					}
				});
			}
		}
		count = $solutions.not('.excluded').length;
		$count.html(count);
		
		if (count <= 1) {
			$('#result').removeClass('count-1').removeClass('count-0').addClass('count-'+count);
			window.location = '#/result';
		}
		
		return count;
	}
	
	$(document).on('click', '.responses button', function(){
		var $this = $(this),
			indices = Reveal.getIndices(),
			exclude = $this.data('exclude'),
			next = ($this.data('next')) ? Reveal[$this.data('next')] : Reveal.right;
		
		$this.addClass('btn-success').siblings('button').removeClass('btn-success');
		excluded[indices.v + '/' + indices.h] = (exclude === undefined) ? [] : exclude.split(',');
		updateAvailableSolutions();
		if (updateAvailableSolutions() > 1) next();
	});
	
	$(document).on('click', '.responses span', function() {
		var $this = $(this),
			$slide = $this.parents('section').first();
			
		$slide.toggleClass('help');
	});
	
	$(document).on('click', 'button.start', function(){
		started = true;
		Reveal.next();
	});
	
	$(document).on('click', 'button.prev', function(){
		window.location = log[0];
	});
	
	$(document).on('click', 'button.restart', function(){
		excluded = [];
		$('button').removeClass('btn-success');
		updateAvailableSolutions();
		window.location = '#';
	});
	
});}(jQuery));
