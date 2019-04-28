/*
	Source:
	van Creij, Maurice (2018). "toggles.js: Simple collapsible content", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Toggles = function (config) {

	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this);
	};

	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context);
		}
		// return the instances
		return instances;
	};

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Toggles });
if (typeof module != 'undefined') module.exports = Toggles;

// extend the class
Toggles.prototype.Articles = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

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
				transitions.byClass(this.config.outlets.articles[a], this.config.classes.closed, this.config.classes.open);
			// else
			} else {
				// close its content section
				transitions.byClass(this.config.outlets.articles[a], this.config.classes.open, this.config.classes.closed);
			}
		}
	};

	this.init();
};

// extend the class
Toggles.prototype.Automatic = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.init = function () {
		// set the event handlers for (un)pausing
		// start the interval
		// return the object
		return this;
	};

	this.start = function () {
		// cancel any interval
		// resume the interval
	};

	this.pause = function () {
		// cancel any interval
	};

	this.init();
};

// extend the class
Toggles.prototype.Buttons = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.init = function () {
		// store the links in this group
		this.config.outlets.buttons = transitions.select(this.config.buttons, this.config.outlets.parent);
		// for each link
		for (var a = 0, b = this.config.outlets.buttons.length; a < b; a += 1) {
			// apply the default class name
			this.config.outlets.buttons[a].className += ' ' + this.config.classes.passive;
			// set the event handlers
			this.config.outlets.buttons[a].addEventListener('click', this.onClicked.bind(this, a), false);
		}
		// initial update
		this.update();
		// return the object
		return this;
	};

	this.onClicked = function (index, event) {
		// change the active index
		this.change(index);
		// cancel the click
		event.preventDefault();
	};

	this.change = function (index) {
		// update the index
		this.config.index = index;
		// redraw the parent
		this.parent.update();
	};

	this.update = function () {
		// formulate regular expressions for the class names
		var passive = new RegExp(this.config.classes.passive, 'gi');
		var active = new RegExp(this.config.classes.active, 'gi');
		// for each link
		for (var a = 0, b = this.config.outlets.buttons.length; a < b; a += 1) {
			// if this is the active index
			if (a === this.config.index) {
				// if toggling is allowed
				if (this.config.toggle) {
					// toggle the class name
					this.config.outlets.buttons[a].className = (this.config.outlets.buttons[a].className.match(active)) ?
						this.config.outlets.buttons[a].className.replace(active, this.config.classes.passive):
						this.config.outlets.buttons[a].className.replace(passive, this.config.classes.active);
				// else
				} else {
					// activate the link
					this.config.outlets.buttons[a].className = this.config.outlets.buttons[a].className.replace(passive, this.config.classes.active);
				}
			// else if grouping is allowed
			} else if (this.config.grouped) {
				// deactivate the link
				this.config.outlets.buttons[a].className = this.config.outlets.buttons[a].className.replace(active, this.config.classes.passive);
			}
		}
	};

	this.init();
};

// extend the class
Toggles.prototype.Main = function (config, context) {

	// PROPERTIES

	this.config = config;
	this.context = context;

	// METHODS

	this.init = function () {
		// setup the context
		this.config.outlets = {};
		this.config.outlets.parent = this.config.element;
		this.config.index = this.config.index || 0;
		// setup the components
		this.automatic = new this.context.Automatic(this);
		this.buttons = new this.context.Buttons(this);
		this.articles = new this.context.Articles(this);
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

	this.init();
};
