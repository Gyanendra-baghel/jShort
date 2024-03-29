import { jShort } from "./core";


jShort.ajax = (function() {
  'use strict';

  // Function for making AJAX requests
  function ajax(options) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          if (typeof options.success === 'function') {
            options.success(this.responseText);
          }
        } else {
          if (typeof options.error === 'function') {
            options.error(this.status, this.statusText);
          }
        }
      }
    };

    if (options.method.toUpperCase() === 'GET' && options.data) {
      options.url += '?' + options.data;
    }

    xhttp.open(options.method.toUpperCase(), options.url);
    if (options.method.toUpperCase() === 'POST') {
      xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xhttp.send(options.data);
  }

  return ajax;
})();

export { jShort, jShort as $ };