/*
 * Setup options for grunt to work with.
 */
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		uglify: {
			production: {
				options: {
					preserveComments: 'some',
					banner: '/*! Copyright (c) <%= grunt.template.today("yyyy") %> Simon Elvery */'
				},
				files: {
					'js/wizard.min.js': ['lib/jquery/jquery-1.9.1.js', 'js/wizard.js']
				}
			}
		},
		compass: {
			production: {
				options: {
					sassDir: 'scss',
					cssDir: 'css',
					environment: 'production'
				}
			}
		},
		watch: {
			scripts: {
				files: ['js/*.js', '!js/*.min.js'],
				tasks: 'uglify'
			},
			styles: {
				files: ['**/*.scss'],
				tasks: 'compass'
			}
		}
	});
	
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');

};
