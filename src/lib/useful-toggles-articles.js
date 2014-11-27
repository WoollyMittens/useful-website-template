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
useful.Toggles.prototype.Articles = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	// methods
	this.setup = function () {
		// store the articles
		this.cfg.outlets.articles = [];
		// for all the links
		for (var a = 0, b = this.cfg.outlets.buttons.length; a < b; a += 1) {
			// if this link has a href and an #
			if (this.cfg.outlets.buttons[a].href && this.cfg.outlets.buttons[a].href.match('#')) {
				// store the referenced article
				this.cfg.outlets.articles[a] = document.getElementById(this.cfg.outlets.buttons[a].href.split('#')[1]);
			// else if this link is a button with a value
			} else if (this.cfg.outlets.buttons[a].value && this.cfg.outlets.buttons[a].value.match('#')) {
				// store the referenced article
				this.cfg.outlets.articles[a] = document.getElementById(this.cfg.outlets.buttons[a].value.split('#')[1]);
			// else
			} else {
				// store the next sibling as the article
				var target = this.cfg.outlets.buttons[a].nextSibling, tries = 0;
				while (target.nodeName.match(/#/) && tries < 50) {
					target = target.nextSibling;
					tries += 1;
				}
				this.cfg.outlets.articles[a] = target;
			}
			// apply the default class name
			this.cfg.outlets.articles[a].className += ' ' + this.cfg.classes.closed;
		}
		// initial update
		this.update();
	};
	this.update = function () {
		// formulate regular expressions for the class names
		var active = new RegExp(this.cfg.classes.active, 'gi');
		// for each link
		for (var a = 0, b = this.cfg.outlets.buttons.length; a < b; a += 1) {
			// if the element is active
			if (this.cfg.outlets.buttons[a].className.match(active)) {
				// open its content section
				useful.transitions.byClass(this.cfg.outlets.articles[a], this.cfg.classes.closed, this.cfg.classes.open);
			// else
			} else {
				// close its content section
				useful.transitions.byClass(this.cfg.outlets.articles[a], this.cfg.classes.open, this.cfg.classes.closed);
			}
		}
	};
	// go
	this.setup();
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Toggles.Articles;
}
