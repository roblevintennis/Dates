if (!String.prototype.trim) {//trim polyfill
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
