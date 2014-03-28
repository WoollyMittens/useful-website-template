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

This project uses grunt.js from http://gruntjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `grunt import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `grunt dev` - Builds the project for development purposes.
+ `grunt prod` - Builds the project for deployment purposes.
+ `grunt watch` - Continuously recompiles updated files during development sessions.
+ `grunt serve` - Serves the project on a temporary web server at http://localhost:8000/ .

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
