/*
	Source:
	van Creij, Maurice (2014). "useful.toggles.js: Simple collapsible content", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Toggles = useful.Toggles || function () {};

// extend the constructor
useful.Toggles.prototype.Main = function (config, context) {

	// PROPERTIES
	
	"use strict";
	this.config = config;
	this.context = context;

	// METHODS
	
	this.init = function () {
		// setup the context
		this.config.outlets = {};
		this.config.outlets.parent = this.config.element;
		this.config.index = this.config.index || 0;
		// setup the components
		this.automatic = new this.context.Automatic(this).init();
		this.buttons = new this.context.Buttons(this).init();
		this.articles = new this.context.Articles(this).init();
		// return the object
		return this;
	};
	
	this.update = function () {
		// update the components
		this.buttons.update();
		this.articles.update();
	};
	
	this.focus = function (index) {
		// activate the element
		this.buttons.change(index);
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Toggles.Main;
}
