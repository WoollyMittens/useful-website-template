module.exports = function(grunt) {

	// configuration.
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			compass: {
				files: ['./scss/*.{scss,sass}'],
				tasks: ['compass']
			}
		},
		compass: {
			all: {
				options: {
					sassDir: ['./scss'],
					cssDir: ['./css'],
					environment: 'development'
				}
			},
			prod: {
				options: {
					sassDir: ['./scss'],
					cssDir: ['./css'],
					environment: 'production'
				}
			}
		}
	};

	// init
	grunt.initConfig(config);

	// dependencies
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');

	// tasts
	grunt.registerTask('default', ['compass', 'watch']);
	grunt.registerTask('watch', ['compass', 'watch']);
	grunt.registerTask('dev', ['compass']);
	grunt.registerTask('prod', ['compass']);

};