# Useful Website Template

A website template for the demonstration of useful-* scripts.

Try the <a href="http://www.woollymittens.nl/">demo</a>.

## How to install

The template displays all useful- scripts if organised in the following manner:

www
- useful-aspectratio
- useful-cookies
- useful-countdown
- useful (this repository)

## How to use

Open `default.php` through an Apache web server with PHP in any modern browser like:

	http://localhost/www/useful/default.php

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
