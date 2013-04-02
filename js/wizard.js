/*!
 * A plugin for reveal.js which provides some wizard style functionality.
 * 
 * Copyright (c) Simon Elvery
 */
var Wizard = (function($, undefined){$(function(){
	
	// An array of arrays to store excluded solutions by question
	var excluded = [],
		$solutions = $('#solutions div.solution'),
		$count = $('#solutions-count span');
		
	$count.html($solutions.not('.excluded').length);
	
	function updateAvailableSolutions() {
		var i,j, id;
		
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
		
		$count.html($solutions.not('.excluded').length);
	}
	
	$(document).on('click', '.responses button', function(){
		var $this = $(this),
			indices = Reveal.getIndices(),
			exclude = $this.data('exclude'),
			next = ($this.data('next')) ? Reveal[$this.data('next')] : Reveal.right;
		
		$this.addClass('btn-success').siblings('button').removeClass('btn-success');
		excluded[indices.v + '/' + indices.h] = (exclude === undefined) ? [] : exclude.split(',');
		updateAvailableSolutions();
		next();
	});
	
	$(document).on('click', '.responses span', function() {
		var $this = $(this),
			$slide = $this.parents('section').first();
			
		$slide.toggleClass('help');
	});
});}(jQuery));
