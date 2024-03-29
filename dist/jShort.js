if (!String.prototype.trim) {
  String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/gm, '');
  };
}
if (!String.prototype.camelCase) {
  String.prototype.camelCase = function () {
      return this.replace(/-([a-z])/ig, function (all, letter) {
          return letter.toUpperCase();
      });
  };
};

(function (global, factory) {

  "use strict";

  if (typeof module === "object" && typeof module.exports === "object") {

      // For CommonJS and CommonJS-like environments where a proper `window`
      // is present, execute the factory and get jQuery.
      // For environments that do not have a `window` with a `document`
      // (such as Node.js), expose a factory as module.exports.
      // This accentuates the need for the creation of a real `window`.
      // e.g. var jShort = require("jshort")(window);

      module.exports = global.document ?
          factory(global, true) :
          function (w) {
              if (!w.document) {
                  throw new Error("jQuery requires a window with a document");
              }
              return factory(w);
          };
  } else {
      factory(global);
  }

  // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

  function log(err, fun) {
      throw 'Invalid parameter passed in ' + fun + '(' + err + ')';
  }

  var getStyle = (function () {
      if (typeof getComputedStyle !== 'undefined') {
          return function (el, prop) {
              return getComputedStyle(el, null).getPropertyValue(prop);
          };
      } else {
          return function (el, prop) {
              return getCurrentStyle(el, prop);
          };
      }
  }());

  function jShort(obj) {
      'strict_mode';
      if (this === window) {
          return new jShort(obj);
      } else if (typeof obj === 'function') {
          // If obj is a function
          var readyFn = obj;
          // Check if the DOM is still loading
          if (document.readyState === "loading") {
              // If the DOM is still loading, add an event listener for DOMContentLoaded
              document.addEventListener('DOMContentLoaded', function() {
                  // Dispatch a custom event to indicate that jShort content is loaded
                  document.dispatchEvent(new Event('jShortContentLoaded'));
              });
              // Add an event listener for the custom event jShortContentLoaded
              document.addEventListener('jShortContentLoaded', readyFn);
          } else {
              // If the DOM is already loaded, call the function immediately
              readyFn();
          }
          return;
      }

      var that = this;
      if (typeof obj === 'string') {
          this.el = document.querySelector(obj);
      } else if (obj instanceof HTMLElement) {
          this.el = obj;
          console.log(obj);
      } else if (typeof obj === 'object' && obj[0] !== undefined) {
          var items = obj.forEach(function (val, index, arr) {
              arr[index] = '';
          });
          return items;
      } else {
          log(obj, 'jShort');
      }
      this.class = function (str) {
          if (!str) {
              return that.el.className;
          }
          that.el.className = str;
      };
      this.class.has = function (str) {
          if (!str) {
              log();
          }
          return (' ' + that.el.className + ' ').indexOf(' ' + str + ' ') !== -1;
      };
      this.class.add = function (str) {
          var c = str.split(/\s+/);
          for (var i = 0; i < c.length; i++) {
              if (!this.has(c[i])) {
                  that.el.className += ' ' + c[i];
              }
          }
      };
      this.class.rem = function (str) {
          var c = str.split(/\s+/),
              a;
          for (var i = 0; i < c.length; i++) {
              if (this.has(c[i])) {
                  that.el.className = (' ' + that.el.className + ' ').replace(' ' + c[1] + ' ', ' ');
              }
          }
      };
      return this;
  }

  if (typeof addEventListener !== 'undefined') {
      jShort.addEvent = function (obj, evt, fn, ext = false) {
          obj.addEventListener(evt, fn, ext);
      };
      jShort.remEvent = function (ob, evt, fn, ext = false) {
          obj.removeEventListener(evt, fn, ext);
      };
  } else if (typeof attachEvent === 'undefined') {
      jShort.addEvent = function (obj, evt, fn) {
          var fnHash = 'e_' + evt + fn;
          obj[fnHash] = function (event) {
              var type = event.type;
              relatedTarget = null;
              if (type === 'mouseover') {
                  relatedTarget = event.fromElement;
              } else if (type === 'mouseout') {
                  relatedTarget = event.toElement;
              }
              fn({
                  target: event.srcElement,
                  type: type,
                  relatedTarget: relatedTarget,
                  _event: event,
                  preventDefault: function () {
                      this._event.returnValue = false;
                  },
                  stopPropagation: function () {
                      this._event.cancelBubble = true;
                  },
              });
          };
          obj.attachEvent('on' + evt, obj[fnHash]);
      };
      jShort.remEvent = function (obj, evt, fn) {
          var fnHash = 'e_' + evt + fn;
          if (fnHash !== undefined) {
              obj.detachEvent('on' + evt, obj[fnHash]);
              delete obj[fnHash];
          }
      };
  } else {
      jShort.addEvent = function (obj, evt, fn) {
          obj['on' + evt] = fn;
      };
      jShort.removeEvent = function (obj, evt, fn) {
          obj['on' + evt] = null;
      };
  }

  jShort.css = function (el, css, value) {
      var cssType = typeof css,
          valueType = typeof value;

      if (cssType !== 'undefined' && valueType === 'undefined') {
          if (cssType === 'object') {
              for (var prop in css) {
                  el.style[prop] = css[prop];
              }
          } else {
              log();
          }
      } else if (cssType === 'string' && typeof valueType === 'string') {
          el.style[css] = value;
      } else {
          log('null', 'css');
      }
  };
  jShort.child = function (el, val) {
      if (!val) {
          return el.childNodes;
      }
      if (!val.el) {
          return el.appendChild(val);
      } else {
          return el.appendChild(val.el);
      }
  };
  jShort.attr = function (el, attr, val) {
      if (!val) {
          return el.getAttribute(attr);
      }
      el.setAttribute(attr, val);
  };
  jShort.html = function (el, val) {
      if (!val) {
          return el.innerHTML;
      }
      el.innerHTML = val;
  };
  jShort.text = function (el, val) {
      if (!val) {
          return el.innerText;
      }
      el.innerText = val;
  };
  jShort.create = function (el, obj) {
      var e,
          tag;
      if (typeof obj === 'string') {
          tag = obj.toUpperCase();
          e = document.createElement(tag);
      } else if (typeof obj === 'object' && obj.tag !== undefined) {
          tag = obj.tag.toUpperCase();
          e = document.createElement(tag);
          obj.id && (e.id = obj.id);
          obj.class && (e.className = obj.class);
          obj.html && (e.html = obj.html);
          if (typeof obj.attr !== 'undefined') {
              var b = obj.attr,
                  prop;
              for (prop in b) {
                  if (b.hasOwnProperty(prop)) {
                      e.setAttribute(prop, b[prop]);
                  }
              }
          }
          if (typeof obj.childs === 'object') {
              obj.childs.forEach(function (value) {
                  value = value.toUpperCase();
                  jShort(e.appendChild(document.createElement(value)));
              });
          }
          el.appendChild(e);
          return $(e);
      }
  };

  /***   PROTOTYPE ELEMENTS   ***/
  jShort.prototype.on = function (evt, fn) {
      jShort.addEvent(this.el, evt, fn, ext = false);
      return this;
  };
  jShort.prototype.off = function (evt, fn) {
      jShort.removeEvent(this.el, evt, fn, ext = false);
      return this;
  };
  jShort.prototype.css = function (css, value) {
      return jShort.css(this.el, css, value) || this;
  };
  jShort.prototype.child = function (val) {
      return jShort.child(this.el, val) || this;
  };
  jShort.prototype.html = function (val) {
      return jShort.html(this.el, val) || this;
  };
  jShort.prototype.text = function (val) {
      return jShort.text(this.el, val) || this;
  };
  jShort.prototype.attr = function (attr, val) {
      return jShort.attr(this.el, attr, val) || this;
  };
  jShort.prototype.create = function (val) {
      return jShort.create(this.el, val) || this;
  };
  jShort.prototype.rem = function (child) {
      return this.el.removeChild(child);
  };
  jShort.prototype.repl = function (child, nchild) {
      return this.el.replaceChild(child, nchild);
  };
  jShort.prototype.clone = function () {
      return $(this.el.cloneNode());
  };
  jShort.prototype.click = function (fun) {
      alert('hello');
      jShort.addEvent('click', fun);
  };
  jShort.prototype.show = function () {
      return this.el.style.display = 'block';
  }
  jShort.prototype.hide = function () {
      return this.el.style.display = 'none';
  }

  jShort.ajax = function (obj) {
      if (typeof obj == 'object') {
          var xhttp;
          if (window.XMLHttpRequest) {
              xhttp = new XMLHttpRequest();
          } else {
              xhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }

          if (obj.url && obj.data) {
              console.log(obj.url);
              if (obj.method == 'get') {
                  xhttp.open("GET", obj.url + '?' + obj.data);
                  xhttp.send();
              } else if (obj.method == 'post') {
                  xhttp.open("POST", obj.url);
                  xhttp.send(obj.data);
              }
          }
          xhttp.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 200) {
                  obj.sucess(this.responseText);
              }
          };
      }
  };
  jShort.prototype.ajax = function (obj) {
      return jShort.ajax(obj);
  };

  /***    CHANGABLE FUNCTION    ***/

  if (typeof define === "function" && define.amd) {
      define("jshort", [], function () {
          return jShort;
      });
  }
  if (typeof noGlobal === "undefined") {
      window.jShort = window.$ = jShort;
  }
  return jShort;
});