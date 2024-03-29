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
