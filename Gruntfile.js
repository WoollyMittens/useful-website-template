module.exports = function(grunt) {

	// components
	var name = 'interface';
	var libs = [
		'../useful-polyfills/src/js/useful-polyfills.js',
		'../useful-transitions/src/js/useful-transitions.js',
		'../useful-positions/src/js/useful-positions.js',
		'../useful-scrolllock/src/js/useful-scrolllock.js',
		'../useful-toggles/src/js/useful-toggles.js',
		'../useful-toggles/src/js/useful-toggles-main.js',
		'../useful-toggles/src/js/useful-toggles-buttons.js',
		'../useful-toggles/src/js/useful-toggles-automatic.js',
		'../useful-toggles/src/js/useful-toggles-articles.js'
	];

	// configuration.
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			serve: {
				options: {
					port: 8000,
					base: './'
				}
			}
		},
		watch: {
			compass: {
				files: ['./src/scss/*.{scss,sass}'],
				tasks: ['compass']
			},
			jshint: {
				files: ['./src/js/*.js'],
				tasks: ['jshint']
			},
			concat: {
				files: ['./src/js/*.js'],
				tasks: ['concat']
			}
		},
		copy: {
			target: {
				flatten: true,
				expand: true,
				src: libs,
				dest: './src/lib/'
			}
		},
		compass: {
			dev : {
				options: {
					sassDir: ['./src/scss'],
					cssDir: ['./inc/css'],
					environment: 'development'
				}
			},
			prod : {
				options: {
					sassDir: ['./src/scss'],
					cssDir: ['./inc/css'],
					environment: 'production'
				}
			}
		},
		jshint: {
			files: ['./src/js/*.js'],
			options: {
				globals: {
					console: true
				}
			}
		},
		concat: {
			all : {
				src: ['./src/lib/*.js', './src/js/*.js'],
				dest: './inc/js/useful-' + name + '.js'
			}
		},
		uglify: {
			all : {
				src: ['./src/lib/*.js', './src/js/*.js'],
				dest: './inc/js/useful-' + name + '.js'
			}
		},
		font_optimizer: {
			all: {
				options: {
					chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-_+={}\\/":;><.,\'',
					includeFeatures: ['kern']
				},
				files: {
					'./inc/fonts/': ['./src/fonts/*.ttf']
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 version', 'ie 8', 'ie 9']
			},
			no_dest: {
				src: '**/inc/css/*.css'
			}
		}
	};

	// init
	grunt.initConfig(config);

	// dependencies
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-font-optimizer');
	grunt.loadNpmTasks('grunt-autoprefixer');

	// tasts
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('serve', ['connect', 'watch']);
	grunt.registerTask('dev', ['compass', 'autoprefixer', 'concat']);
	grunt.registerTask('prod', ['compass', 'autoprefixer', 'uglify']);
	grunt.registerTask('import', ['copy']);
	grunt.registerTask('fonts', ['font_optimizer']);

};
