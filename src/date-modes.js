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
			this.useLi = this.options.useList || this.options.useLi || false;
			this.prev = this.options.prev || '‹';
			this.nxt = this.options.nxt || '›';
			this._defaults = defaults;
			this._currentMode = this._defaults.modes[2];//month
			this._name = dateFillName;
			this.init();
		}

		DateFill.prototype = {
			init: function () {},
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
	    getDaysOfWeek: function(typeKey) {
	    	var wrap = this.getHeaderWrap();
	    	typeKey = typeKey ? typeKey : 'daysShort';
				var sDays = this._defaults.dateLabels[typeKey];
				var days = wrap[0];
				for (var i = 0; i < sDays.length; i++) {
					days += '<th class="dow">' + sDays[i] + '</th>';
				};
				days += wrap[3];
				return days;
	    },
	    getHeaderWrap: function() {
	    	return this.useLi ? ['<ul>', '<li>', '</li>', '</ul>'] : ['<tr>', '<th>', '</th>', '</tr>'];
	    },
	    getRowWrap: function() {
	    	return this.useLi ? ['<ul>', '<li>', '</li>', '</ul>'] : ['<tr>', '<td>', '</td>', '</tr>'];
	    },
	    //tag is like '<tr></tr>' or '<ul></ul>'
	    //attrs is an array like ['class', 'foo', 'colspan', '5']
	    //value is optional value to put in between open close tags
	    _getTagWithAttr: function(tag, attrs, value) {
	    	value = value || '';
				var parts = tag.split('><');
				var unclosedOpenTag = parts[0] +' ';
				var close = '<' + parts[1];
				var inner = '';
				//add attributes
	    	for (var i = 0; i < attrs.length; i+=2) {
	    		inner += attrs[i] + '="' + attrs[i+1] +'" ';
	    	};
	    	//close tag and return
	    	return unclosedOpenTag+inner+'>'+value+close;
	    },
	    _getTitle: function(formattedTitle, wrap) {
				if (this.useLi) {
					return this._getTagWithAttr(wrap[1]+wrap[2], ['class', 'switch'], formattedTitle);
				}
				//we only want colspan for table header
				return this._getTagWithAttr(wrap[1]+wrap[2], ['colspan', '5', 'class', 'switch'], formattedTitle);
	    },
	    getTitle: function(formattedTitle) {
	    	var wrap = this.getHeaderWrap();
	    	var html = wrap[0] +
					this._getTagWithAttr(wrap[1]+wrap[2], ['class', 'prev'], this.prev) +
					this._getTitle(formattedTitle, wrap) +
					this._getTagWithAttr(wrap[1]+wrap[2], ['class', 'next'], this.nxt) +
		    wrap[3];
		    return html;
	    },
	    getHeader: function(format) {
	    	//TODO: WE'LL NEED TO UPDATE ALL THIS BASED ON CURRENT MODE E.G. DAY||WEEK||MONTH ETC.
	    	format = format ? format : 'MMMM YYYY';
	    	var formatted = moment(this.date).format("MMMM YYYY");
	    	return '<thead>' + this.getTitle(formatted) + this.getDaysOfWeek() + '</thead>';
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
