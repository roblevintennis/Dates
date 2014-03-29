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
    _getTags: function() {
      if (this.useLi) {
        return {
          header: {
            mainOpen: '<div>',
            mainClose: '</div>',
            headOpen: '<div class="header">',
            headClose: '</div>',
            rowOpen: '<ul>',
            rowClose: '</ul>',
            colOpen: '<li>',
            colClose: '</li>'
          },
          body: {
            mainOpen: '<div>',
            mainOpenYear: '<div class="year">',
            mainOpenMonth: '<div class="month">',
            mainOpenWeek: '<div class="week">',
            mainClose: '</div>',
            bodyOpen: '<div class="body">',
            bodyClose: '</div>',
            rowOpen: '<ul>',
            rowClose: '</ul>',
            colOpen: '<li>',
            colClose: '</li>'
          }
        };

      } else {
        return {
          header: {
            mainOpen: '<table>',
            mainClose: '</table>',
            headOpen: '<thead class="header">',
            headClose: '</thead>',
            rowOpen: '<tr>',
            rowClose: '</tr>',
            colOpen: '<th>',
            colClose: '</th>'
          },
          body: {
            mainOpen: '<table>',
            mainOpenYear: '<table class="year">',
            mainOpenMonth: '<table class="month">',
            mainOpenWeek: '<table class="week">',
            mainClose: '</table>',
            bodyOpen: '<tbody class="body">',
            bodyClose: '</tbody>',
            rowOpen: '<tr>',
            rowClose: '</tr>',
            colOpen: '<td>',
            colClose: '</td>'
          }
        };
      }
    },
    //tag is like '<tr>' or '<ul>'
    //attrs is an array of key vals for attributes like: ['class', 'foo', 'colspan', '5']
    _getTagWithAttr: function(tag, attrs) {
      var parts = tag.split('>');
      var unclosedOpenTag = parts[0] +' ';
      var inner = '';
      //add attributes
      for (var i = 0; i < attrs.length; i+=2) {
        inner += attrs[i] + '="' + attrs[i+1] +'" ';
      };
      return unclosedOpenTag+inner.trim()+'>';
    },
    _getDay: function(dayLabel, extraContent) {
      var wrap = this._getTags().body;
      extraContent = extraContent || '';
      var content = '<span>'+dayLabel+'</span>'+extraContent;
      var attrs = ['class', 'day'];
      return this._getTagWithAttr(wrap.colOpen, attrs) + content + wrap.colClose;
    },
    _getDaysForRange: function(startDate, endDate) {
      var wrap = this._getTags().body;
      var inner = [];
      startDate = moment.isMoment(startDate) ? startDate : moment(startDate);
      endDate   = moment.isMoment(endDate) ? endDate : moment(endDate);
      for (var m = startDate; m.isBefore(endDate); m.add('days', 1)) {
        inner.push(this._getDay(m.date()));
      }
      return wrap.rowOpen + inner.join('') + wrap.rowClose;
    },
    getRange: function(periodType, options) {
      options = options || {};
      var startDate=this.date, endDate=this.date;
      var wrap = this._getTags().body;
      var inner = [], monthsPerRow;
      var m, d = this.date;
      var open = wrap.mainOpen;
      var close = wrap.mainClose;
      var includeHeader = options.includeHeader || false;

      switch(periodType) {
        case 'week':
          open = wrap.mainOpenWeek;
          startDate = moment(d).weekday(0);
          endDate = moment(d).weekday(7);
          break;
        case 'month':
          open = wrap.mainOpenMonth;
          startDate = moment(d).startOf('month');
          endDate = moment(d).add('months', 1).startOf('month');
          break;
        case 'year':
          monthsPerRow = options.monthsPerRow || 4;
          open = wrap.mainOpenYear;
          startDate = moment(d).startOf('year');
          endDate = moment(d).add('months', 12).startOf('month');
          break;
        default:
          console.log("Unknown range type.");
      }

      if (includeHeader) {

        // return {
        //   header: {
        //     mainOpen: '<table>',
        //     mainClose: '</table>',
        //     headOpen: '<thead class="header">',
        //     headClose: '</thead>',
        //     rowOpen: '<tr>',
        //     rowClose: '</tr>',
        //     colOpen: '<th>',
        //     colClose: '</th>'
        //   },
        //   body: {
        //     mainOpen: '<table>',
        //     mainOpenYear: '<table class="year">',
        //     mainOpenMonth: '<table class="month">',
        //     mainOpenWeek: '<table class="week">',
        //     mainClose: '</table>',
        //     bodyOpen: '<tbody>',
        //     bodyClose: '</tbody>',
        //     rowOpen: '<tr>',
        //     rowClose: '</tr>',
        //     colOpen: '<td>',
        //     colClose: '</td>'
        //If following options props are undefined it will fallback to defaults
        var headerTags = this._getTags().header;
        open += headerTags.headOpen + this._getHeaderContent(options.headerLabelFormat, options.dayTypeKey) + headerTags.headClose + wrap.bodyOpen;
      } else {
        open += wrap.bodyOpen;
      }

      //Push an open tag for week
      var firstTime = true;
      var weekOpenTag = wrap.rowOpen, weekCloseTag = wrap.rowClose;
      weekOpenTag = weekOpenTag.substr(0, weekOpenTag.length-1) + ' class="week">';
      inner.push(weekOpenTag);

      //Determine if the range crosses month boundaries. If so, we'll need to wrap
      //our range of days in a month div
      // debugger;
      // var isMultiMonthRange = moment(startDate).endOf('month').isBefore(endDate);
      // console.log("isMultiMonthRange: ", isMultiMonthRange);

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

      return open + inner.join('') + wrap.bodyClose + close;
    },
    _getTitle: function(formattedTitle, wrap) {
      //we only want the colspan attribute for table header (not if using LIs)
      var attrs = this.useLi ? ['class', 'switch'] : ['colspan', '5', 'class', 'switch'];
      return this._getTagWithAttr(wrap.colOpen, attrs) + formattedTitle + wrap.colClose;
    },
    getTitle: function(formattedTitle) {
      var wrap = this._getTags().header;
      var html = wrap.rowOpen +
        this._getTagWithAttr(wrap.colOpen, ['class', 'prev']) + this.prev + wrap.colClose +
        this._getTitle(formattedTitle, wrap) +
        this._getTagWithAttr(wrap.colOpen, ['class', 'next']) + this.nxt + wrap.colClose +
      wrap.rowClose;
      return html;
    },
    getDaysOfWeekLabels: function(dayTypeKey) {
      var wrap = this._getTags().header;
      dayTypeKey = dayTypeKey ? dayTypeKey : 'daysShort';
      var dayLabels = this.dateLabels[dayTypeKey];
      var days = wrap.rowOpen;
      for (var i = 0; i < dayLabels.length; i++) {
        var indice = (i + this.weekStartsOn) % 7;
        days += this._getTagWithAttr(wrap.colOpen, ['class', 'dow']) + dayLabels[indice] + wrap.colClose;
      };
      days += wrap.rowClose;
      return days;
    },
    getMonthLabels: function(monthTypeKey) {
      monthTypeKey = monthTypeKey ? monthTypeKey : 'monthsShort';
      var wrap = this._getTags().body;//<li> or <td>
      var months = this.dateLabels[monthTypeKey];
      var monthLabels= wrap.rowOpen;
      for (var i = 0; i < months.length; i++) {
        monthLabels += this._getTagWithAttr(wrap.colOpen, ['class', 'month']) + months[i] + wrap.colClose;
      };
      monthLabels += wrap.rowClose;
      return monthLabels;
    },
    _getHeaderContent: function(format, dayTypeKey) {
      //TODO: WE'LL NEED TO UPDATE ALL THIS BASED ON CURRENT MODE E.G. DAY||WEEK||MONTH ETC.
      format = format ? format : 'MMMM YYYY';
      var formatted = moment(this.date).format("MMMM YYYY");
      return this.getTitle(formatted) + this.getDaysOfWeekLabels(dayTypeKey);
    }
  };

  module.exports.DateFill = DateFill;
  module.exports.dateFillName = dateFillName;

})();
