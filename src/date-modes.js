;(function ($, window, document, undefined) {
		var dateModesName = "datemodes",
			defaults = {
				format: "mm-dd-yyyy",
				dateLabels: {
					days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
					daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
					months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
				},
				modes: [{mode: 'week'}, {mode: 'month'}, {mode: 'year'}, {mode: 'years'}],
				modeIndices: {'week':0, 'month':1, 'year':2, 'years':3}
			};

		function DateModes (element, options) {
			this.element = element;
			this.options = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._currentMode = this._defaults.modes[1];//month
			this._name = dateModesName;
			this.init();
		}
		DateModes.prototype = {
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
				var indice = {'week':0, 'month':1, 'year':2, 'years':3};
				var indice = this._defaults.modeIndices[modeKey];
				if (indice < 0 || indice > 4 || indice === undefined) throw new Error("Invalid mode indice.");
				this._currentMode = this._defaults.modes[indice];
				return this._currentMode;
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
		$.fn[dateModesName] = function (options) {
			return this.each(function() {
				if(!$.data(this, dateModesName)) {
					$.data(this, dateModesName, new DateModes(this, options));
				}
			});
		};
})(jQuery, window, document);
