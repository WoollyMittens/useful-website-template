/*
	Source:
	van Creij, Maurice (2012). "useful.instances.js: A library of useful functions to ease working with instances of constructors.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// public functions
	useful.Instances = function (objs, constructor, cfg) {
		// properties
		this.objs = objs;
		this.constructor = constructor;
		this.cfg = cfg;
		this.constructs = [];
		// starts and stores an instance of the constructor for every element
		this.start = function () {
			for (var a = 0, b = this.objs.length; a < b; a += 1) {
				// store a constructed instance with cloned cfg object
				this.constructs[a] = new this.constructor(this.objs[a], Object.create(this.cfg));
			}
			// disable the start function so it can't be started twice
			this.start = function () {};
			// empty the timeout
			return null;
		};
		// returns the constructs
		this.getAll = function () {
			return this.constructs;
		};
		// returns the object that goes with the element
		this.getByObject = function (element) {
			return this.constructs[this.constructs.indexOf(element)];
		};
		// returns the object that goes with the index
		this.getByIndex = function (index) {
			return this.constructs[index];
		};
		this.start();
	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Instances;
	}

})();

/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.polyfills = {

		// enabled the use of HTML5 elements in Internet Explorer
		html5 : function () {
			var a, b, elementsList;
			elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
			if (navigator.userAgent.match(/msie/gi)) {
				for (a = 0 , b = elementsList.length; a < b; a += 1) {
					document.createElement(elementsList[a]);
				}
			}
		},

		// allow array.indexOf in older browsers
		arrayIndexOf : function () {
			if (!Array.prototype.indexOf) {
				Array.prototype.indexOf = function (obj, start) {
					for (var i = (start || 0), j = this.length; i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}
		},

		// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
		querySelectorAll : function () {
			if (!document.querySelectorAll) {
				document.querySelectorAll = function (a) {
					var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
					return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
				};
			}
		},

		// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
		addEventListener : function () {
			!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
				WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
					var target = this;
					registry.unshift([target, type, listener, function (event) {
						event.currentTarget = target;
						event.preventDefault = function () { event.returnValue = false; };
						event.stopPropagation = function () { event.cancelBubble = true; };
						event.target = event.srcElement || target;
						listener.call(target, event);
					}]);
					this.attachEvent("on" + type, registry[0][3]);
				};
				WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
					for (var index = 0, register; register = registry[index]; ++index) {
						if (register[0] == this && register[1] == type && register[2] == listener) {
							return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
						}
					}
				};
				WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
					return this.fireEvent("on" + eventObject.type, eventObject);
				};
			})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
		},

		// allow console.log
		consoleLog : function () {
			var overrideTest = new RegExp('console-log', 'i');
			if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
				window.console = {};
				window.console.log = function () {
					// if the reporting panel doesn't exist
					var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
					if (!reportPanel) {
						// create the panel
						reportPanel = document.createElement('DIV');
						reportPanel.id = 'reportPanel';
						reportPanel.style.background = '#fff none';
						reportPanel.style.border = 'solid 1px #000';
						reportPanel.style.color = '#000';
						reportPanel.style.fontSize = '12px';
						reportPanel.style.padding = '10px';
						reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
						reportPanel.style.right = '10px';
						reportPanel.style.bottom = '10px';
						reportPanel.style.width = '180px';
						reportPanel.style.height = '320px';
						reportPanel.style.overflow = 'auto';
						reportPanel.style.zIndex = '100000';
						reportPanel.innerHTML = '&nbsp;';
						// store a copy of this node in the move buffer
						document.body.appendChild(reportPanel);
					}
					// truncate the queue
					var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
					// process the arguments
					for (a = 0, b = arguments.length; a < b; a += 1) {
						messages += arguments[a] + '<br/>';
					}
					// add a break after the message
					messages += '<hr/>';
					// output the queue to the panel
					reportPanel.innerHTML = messages + reportString;
				};
			}
		},

		// allows Object.create (https://gist.github.com/rxgx/1597825)
		objectCreate : function () {
			if (typeof Object.create !== "function") {
				Object.create = function (original) {
					function Clone() {}
					Clone.prototype = original;
					return new Clone();
				};
			}
		},

		// allows String.trim (https://gist.github.com/eliperelman/1035982)
		stringTrim : function () {
			if (!String.prototype.trim) {
				String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
			}
			if (!String.prototype.ltrim) {
				String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
			}
			if (!String.prototype.rtrim) {
				String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
			}
			if (!String.prototype.fulltrim) {
				String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
			}
		},

		// allows localStorage support
		localStorage : function () {
			if (!window.localStorage) {
				if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)){
					window.localStorage = {
						getItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return null;
							}
							return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
						},
						key: function(nKeyId) {
							return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
						},
						setItem: function(sKey, sValue) {
							if (!sKey) {
								return;
							}
							document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
							this.length = document.cookie.match(/\=/g).length;
						},
						length: 0,
						removeItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return;
							}
							document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
							this.length--;
						},
						hasOwnProperty: function(sKey) {
							return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
						}
					};
					window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
				} else {
				    Object.defineProperty(window, "localStorage", new(function() {
				        var aKeys = [],
				            oStorage = {};
				        Object.defineProperty(oStorage, "getItem", {
				            value: function(sKey) {
				                return sKey ? this[sKey] : null;
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "key", {
				            value: function(nKeyId) {
				                return aKeys[nKeyId];
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "setItem", {
				            value: function(sKey, sValue) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "length", {
				            get: function() {
				                return aKeys.length;
				            },
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "removeItem", {
				            value: function(sKey) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        this.get = function() {
				            var iThisIndx;
				            for (var sKey in oStorage) {
				                iThisIndx = aKeys.indexOf(sKey);
				                if (iThisIndx === -1) {
				                    oStorage.setItem(sKey, oStorage[sKey]);
				                } else {
				                    aKeys.splice(iThisIndx, 1);
				                }
				                delete oStorage[sKey];
				            }
				            for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
				                oStorage.removeItem(aKeys[0]);
				            }
				            for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
				                aCouple = aCouples[nIdx].split(/\s*=\s*/);
				                if (aCouple.length > 1) {
				                    oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
				                    aKeys.push(iKey);
				                }
				            }
				            return oStorage;
				        };
				        this.configurable = false;
				        this.enumerable = true;
				    })());
				}
			}
		}

	};

	// startup
	useful.polyfills.html5();
	useful.polyfills.arrayIndexOf();
	useful.polyfills.querySelectorAll();
	useful.polyfills.addEventListener();
	useful.polyfills.consoleLog();
	useful.polyfills.objectCreate();
	useful.polyfills.stringTrim();
	useful.polyfills.localStorage();

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.polyfills;
	}

})();

/*
	Source:
	van Creij, Maurice (2012). "useful.positions.js: A library of useful functions to ease working with screen positions.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.positions = {

		// find the dimensions of the window
		window : function (parent) {
			// define a position object
			var dimensions = {x : 0, y : 0};
			// if an alternative was given to use as a window
			if (parent && parent !== window) {
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
		document : function (parent) {
			// define a position object
			var position = {x : 0, y : 0};
			// find the current position in the document
			if (parent && parent !== window) {
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
		object : function (node) {
			// define a position object
			var position = {x : 0, y : 0};
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
		cursor : function (event, parent) {
			// get the event properties
			event = event || window.event;
			// define a position object
			var position = {x : 0, y : 0};
			// find the current position on the document
			position.x = event.pageX || event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			position.y = event.pageY || event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
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
		exports = module.exports = useful.positions;
	}

})();

/*
	Source:
	van Creij, Maurice (2012). "useful.scrolllock.js: Manages elements that float overtop of scrolling content.", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// invoke strict mode
	"use strict";

	// private functions
	useful.Scrolllock = function (obj, cfg) {
		// properties
		this.obj = obj;
		this.cfg = cfg;
		// methods
		this.start = function () {
			var context = this;
			// set the event handlers
			window.addEventListener('scroll', function () { context.adjust(); }, false);
			window.addEventListener('resize', function () { context.adjust(); }, false);
			// measure the trigger position if none was given
			this.cfg.threshold = this.cfg.threshold || useful.positions.object(this.obj);
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		this.adjust = function () {
			// get the current scroll position
			var scrolled = useful.positions.document();
			// if scrolled far enough
			if (scrolled.y > this.cfg.threshold.y || scrolled.x > this.cfg.threshold.x) {
				// apply the scroll lock class
				if (!this.obj.className.match(/scroll-locked/gi)) {
					this.obj.className = this.obj.className.replace(/scroll-unlocked/g, '').replace(/  /g, ' ') + ' scroll-locked';
				}
			} else {
				// remove the scroll lock style
				if (!this.obj.className.match(/scroll-unlocked/gi)) {
					this.obj.className = this.obj.className.replace(/scroll-locked/g, '').replace(/  /g, ' ') + ' scroll-unlocked';
				}
			}
		};
		// go
		this.start();
	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Aspectratio;
	}

})();

/*
	Source:
	van Creij, Maurice (2012). "useful.toggles.js: Simple collapsible content", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

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
			// disable the start function so it can't be started twice
			this.start = function () {};
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
		// go
		this.start();
	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Toggles;
	}

})();

/*
	Source:
	van Creij, Maurice (2012). "useful.transitions.js: A library of useful functions to ease working with CSS3 transitions.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.transitions = {

		// applies functionality to node that conform to a given CSS rule, or returns them
		select : function (input, parent) {
			var a, b, elements;
			// validate the input
			parent = parent || document;
			input = (typeof input === 'string') ? {'rule' : input, 'parent' : parent} : input;
			input.parent = input.parent || document;
			input.data = input.data || {};
			// use querySelectorAll to select elements, or defer to jQuery
			elements = (typeof(document.querySelectorAll) !== 'undefined') ?
				input.parent.querySelectorAll(input.rule) :
				(typeof(jQuery) !== 'undefined') ? jQuery(input.parent).find(input.rule).get() : [];
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
		compatibility : function () {
			var eventName, newDiv, empty;
			// create a test div
			newDiv = document.createElement('div');
			// use various tests for transition support
			if (typeof(newDiv.style.MozTransition) !== 'undefined') { eventName = 'transitionend'; }
			try { document.createEvent('OTransitionEvent'); eventName = 'oTransitionEnd'; } catch (e) { empty = null; }
			try { document.createEvent('WebKitTransitionEvent'); eventName = 'webkitTransitionEnd'; } catch (e) { empty = null; }
			try { document.createEvent('transitionEvent'); eventName = 'transitionend'; } catch (e) { empty = null; }
			// remove the test div
			newDiv = empty;
			// pass back working event name
			return eventName;
		},

		// performs a transition between two classnames
		byClass : function (element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
			var replaceThis, replaceWith, endEventName, endEventFunction;
			// validate the input
			endEventHandler = endEventHandler || function () {};
			endEventName = this.compatibility();
			// turn the classnames into regular expressions
			replaceThis = new RegExp(removedClass.trim().replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
			replaceWith = new RegExp(addedClass, 'g');
			// if CSS3 transitions are available
			if (typeof endEventName !== 'undefined') {
				// set the onComplete handler and immediately remove it afterwards
				element.addEventListener(endEventName, endEventFunction = function () {
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
		prefix : function (property) {
			// pick the prefix that goes with the browser
			return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
				property;
		},

		// applies a list of rules
		byRules : function (element, rules, endEventHandler) {
			var rule, endEventName, endEventFunction;
			// validate the input
			rules.transitionProperty = rules.transitionProperty || 'all';
			rules.transitionDuration = rules.transitionDuration || '300ms';
			rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
			endEventHandler = endEventHandler || function () {};
			endEventName = this.compatibility();
			// if CSS3 transitions are available
			if (typeof endEventName !== 'undefined') {
				// set the onComplete handler and immediately remove it afterwards
				element.addEventListener(endEventName, endEventFunction = function () {
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
				var jQueryEasing, jQueryDuration;
				// pick the equivalent jQuery animation function
				jQueryEasing = (rules.transitionTimingFunction.match(/ease/gi)) ? 'swing' : 'linear';
				jQueryDuration = parseInt(rules.transitionDuration.replace(/s/g, '000').replace(/ms/g, ''), 10);
				// remove rules that will make Internet Explorer complain
				delete rules.transitionProperty;
				delete rules.transitionDuration;
				delete rules.transitionTimingFunction;
				// use animate from jQuery
				jQuery(element).animate(
					rules,
					jQueryDuration,
					jQueryEasing,
					endEventHandler
				);
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
		exports = module.exports = useful.transitions;
	}

})();
