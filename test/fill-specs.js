// Cheat sheet: ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises
// browserify src/index.js -o lib.js

//////////////////////////////////////////////////////////////////////
// UTILITIES /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
module('Utilities', {
  setup: function() {
    this.defaultFormat = "mm-dd-yyyy";
    this.input = $('<input type="text" value="03-23-2014">')
      .appendTo('#qunit-fixture')
      .datefill({format: this.defaultFormat});
    this.plugin = this.input.data().datefill;
  },
  teardown: function(context) {
    this.input.remove();
    this.plugin = null;
  }
});
test("attempting to use without moment.js throws error", function() {
  var oldMoment = window.moment ? window.moment : null;
  window.moment = null;
  throws(
    function () {
      this.plugin.init();
    },
    Error,
    "Throws Error if no moment dependency loaded.");

  window.moment = oldMoment;
});
test("date modes plugin can be bootstraped", function() {
  ok(true, "this test is fine");
  ok(this.plugin._defaults.format === this.defaultFormat, 'expected default format property');
  ok(this.plugin._name === 'datefill', 'expected plugin name');
});
test("start of week defaults to Sunday", function() {
  ok(this.plugin.weekStartsOn === 0, 'expected default start of week');
  ok(this.plugin.weekEndsOn === 6, 'sets default end of week');
});
test("can set start of week", function() {
  this.input = $('<input type="text" value="03-23-2014">')
      .appendTo('#qunit-fixture')
      .datefill({weekStartsOn: 3});
    this.plugin = this.input.data().datefill;

  ok(this.plugin.weekStartsOn === 3, 'sets start of week');
  ok(this.plugin.weekEndsOn === 2, 'sets corresponding end of week');
});
test("can determine if leap year", function() {
  var randLeapYears = [2000,2188,2400,2108,2012,2116,2120];
  for (var i = randLeapYears.length - 1; i >= 0; i--) {
    var y = randLeapYears[i];
    ok(this.plugin.isLeapYear(y) == true, 'is leap year');
  };
});
test("can determine if NOT leap year", function() {
  var normalYears = [1800,1803,1805,1843,1845,1891,1893,1900,2100,2200,2300,2500];
  for (var i = normalYears.length - 1; i >= 0; i--) {
    var y = normalYears[i];
    ok(this.plugin.isLeapYear(y) == false, 'is NOT leap year');
  };
});
test("can get days in month for months other than February", function() {
  var expected = [31,'pass',31,30,31,30,31,31,30,31,30,31];
  for (var i = 0; i < 12; i++) {
    if (i !== 1) { //skip February (has own tests)
      ok(this.plugin.getNumberOfDaysInMonth(1999, i) === expected[i], "number of days in month");
    }
  }
});
test("can get days in February when IS a leap year", function() {
  var leapYears = [2000,2004,2008,2012,2016,2020];
  var feb = 1;
  for (var i = 0; i < leapYears.length; i++) {
    ok(this.plugin.getNumberOfDaysInMonth(leapYears[i], feb) === 28, "days february when leap year");
  }
});
test("can get days in February when not a leap year", function() {
  var notLeapYears = [2001,2002,2003,2005,1700,1800,1900];
  var feb = 1;
  for (var i = 0; i < notLeapYears.length; i++) {
    ok(this.plugin.getNumberOfDaysInMonth(notLeapYears[i], feb) === 29, "days February when NOT leapyear");
  }
});
test("can get current mode", function() {
  ok(this.plugin.getCurrentMode().mode === "month", "gets default mode (month)");
});
test("can set current mode and returns updated mode", function() {
  ok(this.plugin.setCurrentMode('week').mode === "week", "sets/returns updated week mode");
  ok(this.plugin.setCurrentMode('month').mode === "month", "sets/returns updated month mode");
  ok(this.plugin.setCurrentMode('year').mode === "year", "sets/returns updated year mode");
  ok(this.plugin.setCurrentMode('years').mode === "years", "sets/returns updated years mode");
  ok(this.plugin.setCurrentMode('day').mode === "day", "sets/returns updated day mode");
});
test("can set a date", function() {
  var d = new Date();
  var actual = null;
  this.plugin.setDate(d);
  actual = this.plugin.getDate();
  equal(d.getTime(), actual.getTime(), "set date should be same");
});

//////////////////////////////////////////////////////////////////////
// BUILD TAGS—TABLE //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
module('Build Tags—Table', {
  setup: function() {
    this.input = $('<input type="text" value="03-23-2014">')
      .appendTo('#qunit-fixture')
      .datefill({format: this.defaultFormat});
    this.plugin = this.input.data().datefill;
    this.plugin.setDate(new Date());
  },
  teardown: function() {
    this.input.remove();
    this.plugin = null;
  }
});
test("can build tags with attributes", function() {
  var actual = this.plugin._getTagWithAttr('<div></div>', ['id', 'foo', 'class', 'bar']);
  var expected = '<div id="foo" class="bar"></div>'
  equal(expected, actual, "should build a tag with attributes");
});
test("can build tags with attributes and a value", function() {
  var actual = this.plugin._getTagWithAttr('<div></div>', ['id', 'foo', 'class', 'bar'], "This is my text!");
  var expected = '<div id="foo" class="bar">This is my text!</div>'
  equal(expected, actual, "should build a tag with attributes and value");
});
test("can get a header that defaults to a thead", function() {
  var html = this.plugin.getHeader();
  ok(html.substr(0,6) === '<thead');
  ok(html.substr(-8) === '</thead>');
});
test("can get a header with daysMin", function () {
  var html = this.plugin.getHeader(null, 'daysMin');
  var isDaysMin = html.indexOf('>Su<') > -1;
  ok(isDaysMin, "Used daysMin");
});
test("can get a header with 'full days' labels", function () {
  var html = this.plugin.getHeader(null, 'days');
  var isDays = html.indexOf('>Sunday<') > -1;
  ok(isDays, "Used days");
});
test("can get a specific day", function() {
  var expected = '<td class="day"><span>5</span></td>';
  var html = this.plugin._getDay(5);
  equal(expected, html, "Gets day");
});
test("can get a specific day with custom label", function() {
  var customFormattedLbl = 'Tuesday 3/25';
  var expected = '<td class="day"><span>Tuesday 3/25</span></td>';
  var html = this.plugin._getDay(customFormattedLbl);
  equal(expected, html, "Gets day with arbitrary label");
});
test("can get a specific day and include extra arbitrary content", function() {
  var extraContent = '<div class="day-info">More stuff..</div>';
  var expected = '<td class="day"><span>5</span>'+extraContent+'</td>';
  var html = this.plugin._getDay(5, extraContent);
  equal(expected, html, "Gets day with extra content");
});
test("can get days of week labels", function () {
  var expected = '<tr><th class="dow">Su</th><th class="dow">Mo</th><th class="dow">Tu</th><th class="dow">We</th><th class="dow">Th</th><th class="dow">Fr</th><th class="dow">Sa</th></tr>';
  var html = this.plugin.getDaysOfWeekLabels('daysMin');
  equal(expected, html, "days of week min");
});
test("can get days of week labels with custom start of week day", function () {
  this.input = $('<input type="text" value="03-23-2014">')
    .appendTo('#qunit-fixture')
    .datefill({weekStartsOn: 2});
  this.plugin = this.input.data().datefill;
  var expected = '<tr><th class="dow">Tu</th><th class="dow">We</th><th class="dow">Th</th><th class="dow">Fr</th><th class="dow">Sa</th><th class="dow">Su</th><th class="dow">Mo</th></tr>';
  var html = this.plugin.getDaysOfWeekLabels('daysMin');
  equal(expected, html, "days of week with custom start week day");
});
test("can get month labels", function () {
  var html = this.plugin.getMonthLabels('monthsShort');
  var expectedStart = '<tr><td class="month">Jan</td><td class="month">Feb</td>';
  ok(html.indexOf(expectedStart) === 0, 'gets months w/expected markup');
});

//////////////////////////////////////////////////////////////////////
// BUILD TAGS—LIST ///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
module('Build Tags—LIs', {
  setup: function() {
    this.input = $('<input type="text" value="03-23-2014">')
      .appendTo('#qunit-fixture')
      .datefill({useList: true, format: this.defaultFormat});
    this.plugin = this.input.data().datefill;
    this.plugin.setDate(new Date());
  },
  teardown: function() {
    this.input.remove();
    this.plugin = null;
  }
});
test("can get a header as UL wrapped in DIV", function() {
  var html = this.plugin.getHeader();
  ok(html.substr(0,4) === '<div');
  ok(html.substr(-6) === '</div>');
  var isLIs = html.toLowerCase().indexOf('<li') > -1;
  ok(isLIs, "gets an LI version of the header");
});
test("can get a specific day as LI", function() {
  var expected = '<li class="day"><span>5</span></li>';
  var html = this.plugin._getDay(5);
  equal(expected, html, "Gets day as LI");
});
test("can get a specific day as LI and include arbitrary content", function() {
  var extraContent = '<div class="day-info">This is something else</div>';
  var expected = '<li class="day"><span>5</span>'+extraContent+'</li>';
  var html = this.plugin._getDay(5, extraContent);
  equal(expected, html, "Gets day with extra content");
});
test("can get months as LIs", function () {
  var html = this.plugin.getMonthLabels('monthsShort');
  var expectedStart = '<ul><li class="month">Jan</li><li class="month">Feb</li>';
  ok(html.indexOf(expectedStart) === 0, 'gets months w/expected markup');
});
// <table>
//   <thead>
//     <tr>
//       <th class="prev">‹</th>
//       <th colspan="5" class="switch">February 2012</th>
//       <th class="next">›</th>
//     </tr>
//     <tr>
//       <th class="dow">Su</th>
//       <th class="dow">Mo</th>
//       <th class="dow">Tu</th>
//       <th class="dow">We</th>
//       <th class="dow">Th</th>
//       <th class="dow">Fr</th>
//       <th class="dow">Sa</th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td class="day">5</td>
//       <td class="day">6</td>
//       <td class="day">7</td>
//       <td class="day">8</td>
//       <td class="day">9</td>
//       <td class="day">10</td>
//       <td class="day">11</td>
//     </tr>
//   </tbody>
// </table>
