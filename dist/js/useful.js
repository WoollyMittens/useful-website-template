/*
Source:
van Creij, Maurice (2018). "positions.js: A library of useful functions to ease working with screen positions.", http://www.woollymittens.nl/.

License:
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var positions = {

	// find the dimensions of the window
	window: function (parent) {
		// define a position object
		var dimensions = {x: 0, y: 0};
		// if an alternative was given to use as a window
		if (parent && parent !== window && parent !== document) {
			// find the current dimensions of surrogate window
			dimensions.x = parent.offsetWidth;
			dimensions.y = parent.offsetHeight;
		} else {
			// find the current dimensions of the window
			dimensions.x = window.innerWidth || document.body.clientWidth;
			dimensions.y = window.innerHeight || document.body.clientHeight;
		}
		// return the object
		return dimensions;
	},

	// find the scroll position of an element
	document: function (parent) {
		// define a position object
		var position = {x: 0, y: 0};
		// find the current position in the document
		if (parent && parent !== window && parent !== document) {
			position.x = parent.scrollLeft;
			position.y = parent.scrollTop;
		} else {
			position.x = (window.pageXOffset) ?
			window.pageXOffset :
			(document.documentElement) ?
			document.documentElement.scrollLeft :
			document.body.scrollLeft;
			position.y = (window.pageYOffset) ?
			window.pageYOffset :
			(document.documentElement) ?
			document.documentElement.scrollTop :
			document.body.scrollTop;
		}
		// return the object
		return position;
	},

	// finds the position of the element, relative to the document
	object: function (node) {
		// define a position object
		var position = {x: 0, y: 0};
		// if offsetparent exists
		if (node.offsetParent) {
			// add every parent's offset
			while (node.offsetParent) {
				position.x += node.offsetLeft;
				position.y += node.offsetTop;
				node = node.offsetParent;
			}
		}
		// return the object
		return position;
	},

	// find the position of the mouse cursor relative to an element
	cursor: function (evt, parent) {
		// define a position object
		var position = {x: 0, y: 0};
		// find the current position on the document
		if (evt.touches && evt.touches[0]) {
			position.x = evt.touches[0].pageX;
			position.y = evt.touches[0].pageY;
		} else if (evt.pageX !== undefined) {
			position.x = evt.pageX;
			position.y = evt.pageY;
		} else {
			position.x = evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
			position.y = evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
		}
		// if a parent was given
		if (parent) {
			// retrieve the position of the parent
			var offsets = this.object(parent);
			// adjust the coordinates to fit the parent
			position.x -= offsets.x;
			position.y -= offsets.y;
		}
		// return the object
		return position;
	}

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = positions;
}

/*
	Source:
	van Creij, Maurice (2018). "scrolllock.js: Manages elements that float overtop of scrolling content.", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var ScrollLock = function (config) {

	// PROPERTIES

	this.config = null;
	this.element = null;

	// METHODS

	this.init = function (config) {
		// store the config
		this.config = config;
		this.element = config.element;
		// set the event handlers
		window.addEventListener('scroll', this.onReposition.bind(this), false);
		window.addEventListener('resize', this.onReposition.bind(this), false);
		// measure the trigger position if none was given
		this.config.threshold = this.config.threshold || positions.object(this.element);
		// return the object
		return this;
	};

	// EVENTS

	this.onReposition = function () {
		// get the current scroll position
		var scrolled = positions.document();
		// if scrolled far enough
		if (scrolled.y > this.config.threshold.y || scrolled.x > this.config.threshold.x) {
			// apply the scroll lock class
			if (!this.element.className.match(/scroll-locked/gi)) {
				this.element.className = this.element.className.replace(/scroll-unlocked/g, '').replace(/  /g, ' ') + ' scroll-locked';
			}
		} else {
			// remove the scroll lock style
			if (!this.element.className.match(/scroll-unlocked/gi)) {
				this.element.className = this.element.className.replace(/scroll-locked/g, '').replace(/  /g, ' ') + ' scroll-unlocked';
			}
		}
	};

	this.init(config);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = ScrollLock;
}

/*
	Source:
	van Creij, Maurice (2018). "transitions.js: A library of useful functions to ease working with CSS3 transitions.", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var transitions = {

	// applies functionality to node that conform to a given CSS rule, or returns them
	select: function(input, parent) {
		var a,
			b,
			elements;
		// validate the input
		parent = parent || document.body;
		input = (typeof input === 'string')
			? {
				'rule': input,
				'parent': parent
			}
			: input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined')
			? input.parent.querySelectorAll(input.rule)
			: (typeof(jQuery) !== 'undefined')
				? jQuery(input.parent).find(input.rule).get()
				: [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0, b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], input.data.create());
			}
			// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	},

	// checks the compatibility of CSS3 transitions for this browser
	compatibility: function() {
		var eventName,
			newDiv,
			empty;
		// create a test div
		newDiv = document.createElement('div');
		// use various tests for transition support
		if (typeof(newDiv.style.MozTransition) !== 'undefined') {
			eventName = 'transitionend';
		}
		try {
			document.createEvent('OTransitionEvent');
			eventName = 'oTransitionEnd';
		} catch (e) {
			empty = null;
		}
		try {
			document.createEvent('WebKitTransitionEvent');
			eventName = 'webkitTransitionEnd';
		} catch (e) {
			empty = null;
		}
		try {
			document.createEvent('transitionEvent');
			eventName = 'transitionend';
		} catch (e) {
			empty = null;
		}
		// remove the test div
		newDiv = empty;
		// pass back working event name
		return eventName;
	},

	// performs a transition between two classnames
	byClass: function(element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
		var replaceThis,
			replaceWith,
			endEventName,
			endEventFunction;
		// validate the input
		endEventHandler = endEventHandler || function() {};
		endEventName = this.compatibility();
		// turn the classnames into regular expressions
		replaceThis = new RegExp(removedClass.trim().replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
		replaceWith = new RegExp(addedClass, 'g');
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function() {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// replace the class name
			element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
			// else if jQuery UI is available
		} else if (typeof jQuery !== 'undefined' && typeof jQuery.ui !== 'undefined') {
			// retrieve any extra information for jQuery
			jQueryDuration = jQueryDuration || 500;
			jQueryEasing = jQueryEasing || 'swing';
			// use switchClass from jQuery UI to approximate CSS3 transitions
			jQuery(element).switchClass(removedClass.replace(replaceWith, ''), addedClass, jQueryDuration, jQueryEasing, endEventHandler);
			// if all else fails
		} else {
			// just replace the class name
			element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
			// and call the onComplete handler
			endEventHandler();
		}
	},

	// adds the relevant browser prefix to a style property
	prefix: function(property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi))
			? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1)
			: (navigator.userAgent.match(/firefox/gi))
				? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1)
				: (navigator.userAgent.match(/microsoft/gi))
					? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1)
					: (navigator.userAgent.match(/opera/gi))
						? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1)
						: property;
	},

	// applies a list of rules
	byRules: function(element, rules, endEventHandler) {
		var rule,
			endEventName,
			endEventFunction;
		// validate the input
		rules.transitionProperty = rules.transitionProperty || 'all';
		rules.transitionDuration = rules.transitionDuration || '300ms';
		rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
		endEventHandler = endEventHandler || function() {};
		endEventName = this.compatibility();
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function() {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[this.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// else if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			var jQueryEasing,
				jQueryDuration;
			// pick the equivalent jQuery animation function
			jQueryEasing = (rules.transitionTimingFunction.match(/ease/gi))
				? 'swing'
				: 'linear';
			jQueryDuration = parseInt(rules.transitionDuration.replace(/s/g, '000').replace(/ms/g, ''), 10);
			// remove rules that will make Internet Explorer complain
			delete rules.transitionProperty;
			delete rules.transitionDuration;
			delete rules.transitionTimingFunction;
			// use animate from jQuery
			jQuery(element).animate(rules, jQueryDuration, jQueryEasing, endEventHandler);
			// else
		} else {
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[this.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// call the onComplete handler
			endEventHandler();
		}
	}

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = transitions;
}

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
if (typeof module !== 'undefined') {
	exports = module.exports = Toggles;
}

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
