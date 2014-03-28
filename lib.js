(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//polyfills has stuff like shims for String.prototype.trim etc.
require('./polyfills');

//Date fill module stuff
var dateFillName = require('./fill').dateFillName;
var DateFill = require('./fill').DateFill;

//JQUERY PLUGIN
;(function ($, window, document, undefined) {
	$.fn[dateFillName] = function (options) {
		return this.each(function() {
			if(!$.data(this, dateFillName)) {
				$.data(this, dateFillName, new DateFill(this, options));
			}
		});
	};
})(jQuery, window, document);

},{"./fill":2,"./polyfills":4}],2:[function(require,module,exports){
;(function () {

  var dateFillName = "datefill",
    defaults = {
      format: "mm-dd-yyyy",
      dateLabels: {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      modes: [{mode: 'day'}, {mode: 'week'}, {mode: 'month'}, {mode: 'year'}, {mode: 'years'}],
      modeIndices: {'day':0, 'week': 1, 'month':2, 'year':3, 'years':4}
    };

  function DateFill (element, options) {
    this.date = new Date();
    this.element = element;
    this.options = $.extend( {}, defaults, options );
    this.useLi = this.options.useList || this.options.useLi || false;
    this.prev = this.options.prev || '‹';
    this.nxt = this.options.nxt || '›';
    this._defaults = defaults;
    this.dateLabels = this.options.dateLabels || this._defaults.dateLabels;
    this._currentMode = this._defaults.modes[2];//month
    this._name = dateFillName;
    this.weekStartsOn = this.options.weekStartsOn || 0;
    this.weekEndsOn = this.weekStartsOn === 0 ? 6 : this.weekStartsOn-1;
    this.init();
  }

  DateFill.prototype = {
    init: function () {
      if (!moment) throw new Error("moment.js is a required dependency");
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
        if (moment(date).isValid()) {
          this.date = moment(date);
        } else {
          throw new Error("Invalid date string (according to momentjs)");
        }
      } else {
        this.date = new Date(date);
      }
      return date;
    },
    _getHeaderWrap: function() {
      return this.useLi ? ['<ul>', '<li>', '</li>', '</ul>'] : ['<tr>', '<th>', '</th>', '</tr>'];
    },
    _getRowWrap: function() {
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
      return unclosedOpenTag+inner.trim()+'>'+value+close;
    },
    _getDay: function(dayLabel, extraContent) {
      var wrap = this._getRowWrap();//<li> or <td>
      extraContent = extraContent || '';
      var content = '<span>'+dayLabel+'</span>'+extraContent;
      var attrs = ['class', 'day'];
      return this._getTagWithAttr(wrap[1]+wrap[2], attrs, content);
    },
    _getDaysForRange: function(startDate, endDate) {
      var wrap = this._getRowWrap();//<li> or <td>
      var inner = [];
      startDate = moment.isMoment(startDate) ? startDate : moment(startDate);
      endDate   = moment.isMoment(endDate) ? endDate : moment(endDate);
      for (var m = startDate; m.isBefore(endDate); m.add('days', 1)) {
        inner.push(this._getDay(m.date()));
      }
      return wrap[0] + inner.join('') + wrap[3];
    },
    getRange: function(periodType, options) {
      var multiple = options && options.multiple ? options.multiple : 1;
      var startDate=this.date, endDate=this.date;
      var wrap = this._getRowWrap();//<li> or <td>
      var inner = [], monthsPerRow;
      var m, d = this.date;
      var open = this.useLi ? '<div>' : '<tbody>';//gets mutated later
      var close = this.useLi ? '</div>' : '</tbody>';

      switch(periodType) {
        case 'week':
          open  = this.useLi ? '<div class="week">' : '<tbody class="week">';
          startDate = moment(d).weekday(0);
          endDate = moment(d).weekday(7);
          break;
        case 'month':
          open  = this.useLi ? '<div class="month">' : '<tbody class="month">';
          startDate = moment(d).startOf('month');
          endDate = moment(d).add('months', 1).startOf('month');
          break;
        case 'year':
          monthsPerRow = options.monthsPerRow || 4;
          open = this.useLi ? '<div class="year"><div class="month">' : '<tbody class="year"><tr class="months">';
          startDate = moment(d).startOf('month');
          endDate = moment(d).add('months', 12).startOf('month');
          break;
        default:
          console.log("Unknown range type.");
      }

      //Push an open tag for week
      var firstTime = true;
      var weekOpenTag = wrap[0], weekCloseTag = wrap[3];
      weekOpenTag = weekOpenTag.substr(0, weekOpenTag.length-1) + ' class="week">';
      inner.push(weekOpenTag);

      //Determine if the range crosses month boundaries. If so, we'll need to wrap
      //our range of days in a month div
      debugger;
      var isMultiMonthRange = moment(startDate).endOf('month').isBefore(endDate);
      console.log("isMultiMonthRange: ", isMultiMonthRange);

      for (m = startDate; m.isBefore(endDate); m.add('days', 1)) {
        //If first day of week (and not the first time in loop, since we've already
        //placed an open tag above loop), then push an open tag to start new week
        if (!firstTime && m.day() === 0) {
          inner.push(weekOpenTag);
        } else {
          firstTime = false;
        }

        inner.push(this._getDay(m.date()));

        //If last day of week push the closing tag
        if (m.day() === 6) {
          inner.push(weekCloseTag);
        }
      }
      if (weekCloseTag !== inner[inner.length-1]) {
        inner.push(weekCloseTag);
      }

      return open + inner.join('') + close;
    },
    _getTitle: function(formattedTitle, wrap) {
      //we only want the colspan attribute for table header (not if using LIs)
      var attrs = this.useLi ? ['class', 'switch'] : ['colspan', '5', 'class', 'switch'];
      return this._getTagWithAttr(wrap[1]+wrap[2], attrs, formattedTitle);
    },
    getTitle: function(formattedTitle) {
      var wrap = this._getHeaderWrap();
      var html = wrap[0] +
        this._getTagWithAttr(wrap[1]+wrap[2], ['class', 'prev'], this.prev) +
        this._getTitle(formattedTitle, wrap) +
        this._getTagWithAttr(wrap[1]+wrap[2], ['class', 'next'], this.nxt) +
      wrap[3];
      return html;
    },
    getDaysOfWeekLabels: function(dayTypeKey) {
      var wrap = this._getHeaderWrap();
      dayTypeKey = dayTypeKey ? dayTypeKey : 'daysShort';
      var dayLabels = this.dateLabels[dayTypeKey];
      var days = wrap[0];
      for (var i = 0; i < dayLabels.length; i++) {
        var indice = (i + this.weekStartsOn) % 7;
        days += this._getTagWithAttr(wrap[1]+wrap[2], ['class', 'dow'], dayLabels[indice]);
      };
      days += wrap[3];
      return days;
    },
    getMonthLabels: function(monthTypeKey) {
      monthTypeKey = monthTypeKey ? monthTypeKey : 'monthsShort';
      var wrap = this._getRowWrap();//<li> or <td>
      var months = this.dateLabels[monthTypeKey];
      var monthLabels= wrap[0];
      for (var i = 0; i < months.length; i++) {
        monthLabels += this._getTagWithAttr(wrap[1]+wrap[2], ['class', 'month'], months[i]);
      };
      monthLabels += wrap[3];
      return monthLabels;
    },
    getHeader: function(format, dayTypeKey) {
      //TODO: WE'LL NEED TO UPDATE ALL THIS BASED ON CURRENT MODE E.G. DAY||WEEK||MONTH ETC.
      format = format ? format : 'MMMM YYYY';
      var formatted = moment(this.date).format("MMMM YYYY");
      var open  = this.useLi ? '<div class="header">' : '<thead class="header">';
      var close = this.useLi ? '</div>' : '</thead>';
      return open+ this.getTitle(formatted) + this.getDaysOfWeekLabels(dayTypeKey) +close;
    }
  };

  module.exports.DateFill = DateFill;
  module.exports.dateFillName = dateFillName;

})();

},{}],3:[function(require,module,exports){
require('./datefill');


},{"./datefill":1}],4:[function(require,module,exports){
if (!String.prototype.trim) {//trim polyfill
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

},{}]},{},[3])