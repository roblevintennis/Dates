// Cheat sheet: ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises
module('date-utils', {
  setup: function() {
    this.defaultFormat = "mm-dd-yyyy";
    this.input = $('<input type="text" value="03-23-2014">')
      .appendTo('#qunit-fixture')
      .datefill({format: this.defaultFormat});
    this.plugin = this.input.data().datefill;
  },
  teardown: function() {
    this.input.remove();
    plugin = null;
  }
});
test("date modes plugin can be bootstraped", function() {
  ok(true, "this test is fine");
  ok(this.plugin._defaults.format === this.defaultFormat, 'expected default format property');
  ok(this.plugin._name === 'datefill', 'expected plugin name');
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
test("setting date by string without moment.js throws error", function() {
  var oldMoment = window.moment ? window.moment : null;
  debugger; 
  window.moment = null;
  throws(function () {this.plugin.setDate('January 03, 2000'); },
    ReferenceError,
    "Must throw ReferenceError if date string but no momentjs.");
  window.moment = oldMoment;
});
// test("can get a wrap a header", function() {
//   //set the mode to week
//   this.plugin.setCurrentMode('week');
//   var html = this.plugin.getHeader();
// });
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
//       <td class="day ">5</td>
//       <td class="day ">6</td>
//       <td class="day ">7</td>
//       <td class="day ">8</td>
//       <td class="day ">9</td>
//       <td class="day ">10</td>
//       <td class="day ">11</td>
//     </tr>
//   </tbody>
// </table>
