;(function ($, window, document, undefined) {
		var dateFillName = "datefill",
			defaults = {
				format: "mm-dd-yyyy",
				dateLabels: {
					days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
					daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
					months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
				},
				modes: [{mode: 'day'}, {mode: 'week'}, {mode: 'month'}, {mode: 'year'}, {mode: 'years'}],
				modeIndices: {'day':0, 'week': 1, 'month':2, 'year':3, 'years':4}
			};

		function DateFill (element, options) {
			this.date = null;
			this.element = element;
			this.options = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._currentMode = this._defaults.modes[2];//month
			this._name = dateFillName;
			this.init();
		}

		DateFill.prototype = {
			init: function () {
				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.options
				// you can add more functions like the one below and
				// call them like so: this.yourOtherFunction(this.element, this.options).
				console.log("xD");
			},
			getCurrentMode: function () {
				return this._currentMode;
			},
			setCurrentMode: function (modeKey) {
				var indice = this._defaults.modeIndices[modeKey];
				if (indice < 0 || indice > 4 || indice === undefined) throw new Error("Invalid mode indice.");
				this._currentMode = this._defaults.modes[indice];
				return this._currentMode;
			},
			getDate: function() {
				return this.date;
			},
			setDate: function(date) {
	      if (typeof date === 'string') {
	        try {
	        	this.date = moment(date);
	        } catch (err) {
	        	if (err.name === 'TypeError' || err.name === 'ReferenceError') {
							throw new ReferenceError("Setting date by string requires moment.js library");
	        	} else {
							throw new Error("Unknown error setting date by string");
	        	}
	        }
	      } else {
	        this.date = new Date(date);
	      }
	      return date;
	    },
			isLeapYear: function (yr) { //ref: http://www.timeanddate.com/date/leapyear.html
				var isLeap = yr % 4 === 0;
				if (yr % 100 === 0) {
					isLeap = false;
					if (yr % 400 === 0) {
						isLeap = true;
					}
				}
				return isLeap;
			},
			getNumberOfDaysInMonth: function(yr, monthIndex) {
				return [31,(this.isLeapYear(yr) ? 28 : 29),31,30,31,30,31,31,30,31,30,31][monthIndex];
			}
		};
		$.fn[dateFillName] = function (options) {
			return this.each(function() {
				if(!$.data(this, dateFillName)) {
					$.data(this, dateFillName, new DateFill(this, options));
				}
			});
		};
})(jQuery, window, document);
