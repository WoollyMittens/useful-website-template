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
useful.Toggles.prototype.Main = function (cfg, parent) {
	// properties
	"use strict";
	this.cfg = cfg;
	this.parent = parent;
	// methods
	this.start = function () {
		// setup the parent
		this.cfg.outlets = {};
		this.cfg.outlets.parent = this.cfg.element;
		this.cfg.index = this.cfg.index || 0;
		// setup the components
		this.automatic = new this.parent.Automatic(this);
		this.buttons = new this.parent.Buttons(this);
		this.articles = new this.parent.Articles(this);
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
	// go
	this.start();
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Toggles.Main;
}
