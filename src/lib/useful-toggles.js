/*
	Source:
	van Creij, Maurice (2012). "useful.toggles.js: Simple collapsible content", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
	<!--[if IE]>
		<script src="./js/html5.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Toggles = function (obj, cfg) {
		// properties
		this.obj = obj;
		this.cfg = cfg;
		// methods
		this.start = function () {
			// setup the parent
			this.cfg.outlets = {};
			this.cfg.outlets.parent = this.obj;
			this.cfg.index = this.cfg.index || 0;
			// setup the components
			this.automatic.setup(this);
			this.buttons.setup(this);
			this.articles.setup(this);
		};
		this.update = function (context) {
			// update the parent
			// update the components
			context.buttons.update(context);
			context.articles.update(context);
		};
		this.focus = function (index) {
			// establish the context
			var context = this;
			// activate the element
			context.buttons.change(index, context);
		};
		this.automatic = {};
		this.automatic.setup = function () {
			// set the event handlers for (un)pausing
			// start the interval
		};
		this.automatic.start = function () {
			// cancel any interval
			// resume the interval
		};
		this.automatic.pause = function () {
			// cancel any interval
		};
		this.buttons = {};
		this.buttons.setup = function (context) {
			// store the links in this group
			context.cfg.outlets.buttons = useful.transitions.select(context.cfg.buttons, context.cfg.outlets.parent);
			// for each link
			for (var a = 0, b = context.cfg.outlets.buttons.length; a < b; a += 1) {
				// apply the default class name
				context.cfg.outlets.buttons[a].className += ' ' + context.cfg.classes.passive;
				// set the event handlers
				context.cfg.outlets.buttons[a].addEventListener('click', context.buttons.onClicked(a, context), false);
			}
			// initial update
			context.buttons.update(context);
		};
		this.buttons.onClicked = function (index, context) {
			return function (event) {
				// change the active index
				context.buttons.change(index, context);
				// cancel the click
				event.preventDefault();
			};
		};
		this.buttons.change = function (index, context) {
			// update the index
			context.cfg.index = index;
			// redraw the parent
			context.update(context);
		};
		this.buttons.update = function (context) {
			// formulate regular expressions for the class names
			var passive = new RegExp(context.cfg.classes.passive, 'gi');
			var active = new RegExp(context.cfg.classes.active, 'gi');
			// for each link
			for (var a = 0, b = context.cfg.outlets.buttons.length; a < b; a += 1) {
				// if this is the active index
				if (a === context.cfg.index) {
					// if toggling is allowed
					if (context.cfg.toggle) {
						// toggle the class name
						context.cfg.outlets.buttons[a].className = (context.cfg.outlets.buttons[a].className.match(active)) ?
							context.cfg.outlets.buttons[a].className.replace(active, context.cfg.classes.passive) :
							context.cfg.outlets.buttons[a].className.replace(passive, context.cfg.classes.active);
					// else
					} else {
						// activate the link
						context.cfg.outlets.buttons[a].className = context.cfg.outlets.buttons[a].className.replace(passive, context.cfg.classes.active);
					}
				// else if grouping is allowed
				} else if (context.cfg.grouped) {
					// deactivate the link
					context.cfg.outlets.buttons[a].className = context.cfg.outlets.buttons[a].className.replace(active, context.cfg.classes.passive);
				}
			}
		};
		this.articles = {};
		this.articles.setup = function (context) {
			// store the articles
			context.cfg.outlets.articles = [];
			// for all the links
			for (var a = 0, b = context.cfg.outlets.buttons.length; a < b; a += 1) {
				// if this link has a href and an #
				if (context.cfg.outlets.buttons[a].href && context.cfg.outlets.buttons[a].href.match('#')) {
					// store the referenced article
					context.cfg.outlets.articles[a] = document.getElementById(context.cfg.outlets.buttons[a].href.split('#')[1]);
				// else if this link is a button with a value
				} else if (context.cfg.outlets.buttons[a].value && context.cfg.outlets.buttons[a].value.match('#')) {
					// store the referenced article
					context.cfg.outlets.articles[a] = document.getElementById(context.cfg.outlets.buttons[a].value.split('#')[1]);
				// else
				} else {
					// store the next sibling as the article
					var target = context.cfg.outlets.buttons[a].nextSibling, tries = 0;
					while (target.nodeName.match(/#/) && tries < 50) {
						target = target.nextSibling;
						tries += 1;
					}
					context.cfg.outlets.articles[a] = target;
				}
				// apply the default class name
				context.cfg.outlets.articles[a].className += ' ' + context.cfg.classes.closed;
			}
			// initial update
			context.articles.update(context);
		};
		this.articles.update = function (context) {
			// formulate regular expressions for the class names
			var active = new RegExp(context.cfg.classes.active, 'gi');
			// for each link
			for (var a = 0, b = context.cfg.outlets.buttons.length; a < b; a += 1) {
				// if the element is active
				if (context.cfg.outlets.buttons[a].className.match(active)) {
					// open its content section
					useful.transitions.byClass(context.cfg.outlets.articles[a], context.cfg.classes.closed, context.cfg.classes.open);
				// else
				} else {
					// close its content section
					useful.transitions.byClass(context.cfg.outlets.articles[a], context.cfg.classes.open, context.cfg.classes.closed);
				}
			}
		};
	};

}(window.useful = window.useful || {}));
