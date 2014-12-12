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
	this.config = parent.config;
	// methods
	this.init = function () {
		// store the articles
		this.config.outlets.articles = [];
		// for all the links
		for (var a = 0, b = this.config.outlets.buttons.length; a < b; a += 1) {
			// if this link has a href and an #
			if (this.config.outlets.buttons[a].href && this.config.outlets.buttons[a].href.match('#')) {
				// store the referenced article
				this.config.outlets.articles[a] = document.getElementById(this.config.outlets.buttons[a].href.split('#')[1]);
			// else if this link is a button with a value
			} else if (this.config.outlets.buttons[a].value && this.config.outlets.buttons[a].value.match('#')) {
				// store the referenced article
				this.config.outlets.articles[a] = document.getElementById(this.config.outlets.buttons[a].value.split('#')[1]);
			// else
			} else {
				// store the next sibling as the article
				var target = this.config.outlets.buttons[a].nextSibling, tries = 0;
				while (target.nodeName.match(/#/) && tries < 50) {
					target = target.nextSibling;
					tries += 1;
				}
				this.config.outlets.articles[a] = target;
			}
			// apply the default class name
			this.config.outlets.articles[a].className += ' ' + this.config.classes.closed;
		}
		// initial update
		this.update();
		// return the object
		return this;
	};
	this.update = function () {
		// formulate regular expressions for the class names
		var active = new RegExp(this.config.classes.active, 'gi');
		// for each link
		for (var a = 0, b = this.config.outlets.buttons.length; a < b; a += 1) {
			// if the element is active
			if (this.config.outlets.buttons[a].className.match(active)) {
				// open its content section
				useful.transitions.byClass(this.config.outlets.articles[a], this.config.classes.closed, this.config.classes.open);
			// else
			} else {
				// close its content section
				useful.transitions.byClass(this.config.outlets.articles[a], this.config.classes.open, this.config.classes.closed);
			}
		}
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Toggles.Articles;
}
