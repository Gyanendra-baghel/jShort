var jShort = (function() {
  'use strict';
  function DOM(obj) {
    'strict_mode';
    if (this === window) {
      return new DOM(obj);
    }

    var that = this;
    if (typeof obj === 'string') {
      this.el = document.querySelector(obj);
    } else if (obj instanceof HTMLElement) {
      this.el = obj;
      console.log(obj);
    } else if (typeof obj === 'object' && obj[0] !== undefined) {
      var items = obj.forEach(function(val, index, arr) {
        arr[index] = '';
      });
      console.log(items);
      return items;
    } else {
      log(obj, 'DOM');
    }
    this.class = function(str) {
      if (!str) {
        return  that.el.className;
      }
      that.el.className = str;
    };
    this.class.has = function(str) {
      if (!str) {
        log();
      }
      return (' '+that.el.className+' ').indexOf(' '+str+' ') !== -1;
    };
    this.class.add = function(str) {
      var c = str.split(/\s+/);
      for (var i = 0; i < c.length; i++) {
        if (!this.has(c[i])) {
          that.el.className += ' '+c[i];
        }
      }
    };
    this.class.rem = function(str) {
      var c = str.split(/\s+/),
      a;
      for (var i = 0; i < c.length; i++) {
        if (this.has(c[i])) {
          that.el.className = (' '+that.el.className+' ').replace(' '+c[1]+' ', ' ');
        }
      }
    };
    return this;
  }

  if (typeof addEventListener !== 'undefined') {
    DOM.addEvent = function (obj, evt, fn, ext = false) {
      obj.addEventListener(evt, fn, ext);
    };
    DOM.remEvent = function(ob, evt, fn, ext = false) {
      obj.removeEventListener(evt, fn, ext);
    };
  } else if (typeof attachEvent === 'undefined') {
    DOM.addEvent = function(obj, evt, fn) {
      var fnHash = 'e_'+evt+fn;
      obj[fnHash] = function(event) {
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
          preventDefault: function() {
            this._event.returnValue = false;
          },
          stopPropagation: function() {
            this._event.cancelBubble = true;
          },
        });
      };
      obj.attachEvent('on'+evt, obj[fnHash]);
    };
    DOM.remEvent = function(obj, evt, fn) {
      var fnHash = 'e_'+evt+fn;
      if (fnHash !== undefined) {
        obj.detachEvent('on'+evt, obj[fnHash]);
        delete obj[fnHash];
      }
    };
  } else {
    DOM.addEvent = function(obj, evt, fn) {
      obj['on'+evt] = fn;
    };
    DOM.removeEvent = function(obj, evt, fn) {
      obj['on'+evt] = null;
    };
  }

  DOM.css = function(el, css, value) {
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
  DOM.child = function(el, val) {
    if (!val) {
      return el.childNodes;
    }
    if (!val.el) {
      return el.appendChild(val);
    } else {
      return el.appendChild(val.el);
    }
  };
  DOM.attr = function(el, attr, val) {
    if (!val) {
      return el.getAttribute(attr);
    }
    el.setAttribute(attr, val);
  };
  DOM.html = function(el, val) {
    if (!val) {
      return el.innerHTML;
    }
    el.innerHTML = val;
  };
  DOM.text = function(el, val) {
    if (!val) {
      return el.innerText;
    }
    el.innerText = val;
  };
  DOM.create = function(el, obj) {
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
        obj.childs.forEach(function(value) {
          value = value.toUpperCase();
          DOM(e.appendChild(document.createElement(value)));
        });
      }
      el.appendChild(e);
      return $(e);
    }
  };

  /***   PROTOTYPE ELEMENTS   ***/
  DOM.prototype.addEvent = function(evt, fn) {
    DOM.addEvent(this.el, evt, fn, ext = false);
    return this;
  };
  DOM.prototype.removeEvent = function(evt, fn) {
    DOM.removeEvent(this.el, evt, fn, ext = false);
    return this;
  };
  DOM.prototype.css = function(css, value) {
    return DOM.css(this.el, css, value) || this;
  };
  DOM.prototype.child = function(val) {
    return DOM.child(this.el, val) || this;
  };
  DOM.prototype.html = function(val) {
    return DOM.html(this.el, val) || this;
  };
  DOM.prototype.text = function(val) {
    return DOM.text(this.el, val) || this;
  };
  DOM.prototype.attr = function(attr, val) {
    return DOM.attr(this.el, attr, val) || this;
  };
  DOM.prototype.create = function(val) {
    return DOM.create(this.el, val) || this;
  };
  DOM.prototype.rem = function(child) {
    return this.el.removeChild(child);
  };
  DOM.prototype.repl = function(child, nchild) {
    return this.el.replaceChild(child, nchild);
  };
  DOM.prototype.clone = function() {
    return $(this.el.cloneNode());
  };
  DOM.prototype.click = function(fun) {
    alert('hello');
    DOM.addEvent('click', fun);
  };
  DOM.prototype.show = function() {
    return this.el.style.display = 'block';
  }
  DOM.prototype.hide = function() {
    return this.el.style.display = 'none';
  }

  return DOM;
})();

export { jShort, jShort as $ };