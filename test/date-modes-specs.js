/*
Cheat sheet: ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises

test( "Appends a div", function() {
  var $fixture = $( "#qunit-fixture" );
  $fixture.append( "<div>hello!</div>" );
  equal( $( "div", $fixture ).length, 1, "div added successfully!" );
});
asyncTest("asyncTest & start", function() {
  var actual = false;
  setTimeout(function() {
    ok(actual, "this test actually runs, and fails");
    start();
  }, 1000);
});
*/
module('date-utils', {
  setup: function() {
    this.defaultFormat = "mm-dd-yyyy";
    this.input = $('<input type="text" value="03-23-2014">')
      .appendTo('#qunit-fixture')
      .datemodes({format: this.defaultFormat});
    this.plugin = this.input.data().datemodes;
  },
  teardown: function() {
    this.input.remove();
    plugin = null;
  }
});
test("date modes plugin can be bootstraped", function() {
  ok(true, "this test is fine");
  ok(this.plugin._defaults.format === this.defaultFormat, 'expected default format property');
  ok(this.plugin._name === 'datemodes', 'expected plugin name');
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
test("can get days in February taking leap years into account", function() {
  var notLeapYears = [2001,2002,2003,2005,1700,1800,1900];
  var feb = 1;
  for (var i = 0; i < notLeapYears.length; i++) {
    ok(this.plugin.getNumberOfDaysInMonth(notLeapYears[i], feb) === 29, "days February when NOT leapyear");
  }
});
test("can get days in February taking leap years into account", function() {
  var leapYears = [2000,2004,2008,2012,2016,2020];
  var feb = 1;
  for (var i = 0; i < leapYears.length; i++) {
    ok(this.plugin.getNumberOfDaysInMonth(leapYears[i], feb) === 28, "days february when leap year");
  }
});
test("can get current mode", function() {
  ok(this.plugin.getCurrentMode().mode === "month", "gets default mode (month)");
});
test("can set current mode and returns updated mode", function() {
  ok(this.plugin.setCurrentMode('week').mode === "week", "sets and returns updated mode");
});
