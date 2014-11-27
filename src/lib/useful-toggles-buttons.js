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
useful.Toggles.prototype.Buttons = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	// methods
	this.setup = function () {
		// store the links in this group
		this.cfg.outlets.buttons = useful.transitions.select(this.cfg.buttons, this.cfg.outlets.parent);
		// for each link
		for (var a = 0, b = this.cfg.outlets.buttons.length; a < b; a += 1) {
			// apply the default class name
			this.cfg.outlets.buttons[a].className += ' ' + this.cfg.classes.passive;
			// set the event handlers
			this.cfg.outlets.buttons[a].addEventListener('click', this.onClicked(a), false);
		}
		// initial update
		this.update();
	};
	this.onClicked = function (index) {
		var _this = this;
		return function (event) {
			// change the active index
			_this.change(index);
			// cancel the click
			event.preventDefault();
		};
	};
	this.change = function (index) {
		// update the index
		this.cfg.index = index;
		// redraw the parent
		this.parent.update();
	};
	this.update = function () {
		// formulate regular expressions for the class names
		var passive = new RegExp(this.cfg.classes.passive, 'gi');
		var active = new RegExp(this.cfg.classes.active, 'gi');
		// for each link
		for (var a = 0, b = this.cfg.outlets.buttons.length; a < b; a += 1) {
			// if this is the active index
			if (a === this.cfg.index) {
				// if toggling is allowed
				if (this.cfg.toggle) {
					// toggle the class name
					this.cfg.outlets.buttons[a].className = (this.cfg.outlets.buttons[a].className.match(active)) ?
						this.cfg.outlets.buttons[a].className.replace(active, this.cfg.classes.passive):
						this.cfg.outlets.buttons[a].className.replace(passive, this.cfg.classes.active);
				// else
				} else {
					// activate the link
					this.cfg.outlets.buttons[a].className = this.cfg.outlets.buttons[a].className.replace(passive, this.cfg.classes.active);
				}
			// else if grouping is allowed
			} else if (this.cfg.grouped) {
				// deactivate the link
				this.cfg.outlets.buttons[a].className = this.cfg.outlets.buttons[a].className.replace(active, this.cfg.classes.passive);
			}
		}
	};
	// go
	this.setup();
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Toggles.Buttons;
}
