TBD

Compilation is now done using browserify:

```shell
browserify src/index.js -o lib.js
```

This allows me to put different modules in different files and then simply require
them from index.js, potentially allowing for multiple modules.


View types
----------

Weekly Calendar
  Generaly Sun-Sat with labels on top and hours to left and full day coverage

2 Week w/list view below (Sunrise)
  2 weeks of a month calendar view combined with a scrollable list view below

Week w/Slider
  A slider week view on top with selected day detail below

4 Days
  Same as week view essentially

Day
  Large view of a single day

Monthly Overview
  calendar view with day labels and boxes. Optional: Selected day additionally shows a detail view.

Yearly Calendar
  List or table view of years

Yearly Calendar (by Months)
  Shows a whole year but with mini-months

Agenda
  Generally a top to bottom list view of actual appointments scheduled


