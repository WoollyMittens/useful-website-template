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
useful.Toggles.prototype.Automatic = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	// methods
	this.setup = function () {
		// set the event handlers for (un)pausing
		// start the interval
	};
	this.start = function () {
		// cancel any interval
		// resume the interval
	};
	this.pause = function () {
		// cancel any interval
	};
	// go
	this.setup();
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Toggles.Automatic;
}