window._ = function() {
  "use strict";
  var t = {};
  "object" == typeof window && window._ && (t = window._);
  var n = t.isObj = function() {
      return function(t) {
        var n = typeof t;
        return !!t && ("function" === n || "object" === n)
      }
    }(),
    e = t.isUndef = function() {
      return function(t) {
        return void 0 === t
      }
    }(),
    r = t.inherits = function() {
      function t() {}
      var n = Object.create;
      return function(e, r) {
        if (n)
          return e.prototype = n(r.prototype);
        t.prototype = r.prototype,
          e.prototype = new t
      }
    }(),
    i = t.has = function() {
      var t = Object.prototype.hasOwnProperty;
      return function(n, e) {
        return t.call(n, e)
      }
    }(),
    o = t.noop = function() {
      return function() {}
    }(),
    u = t.allKeys = function() {
      return function(t) {
        var n, e = [];
        for (n in t)
          e.push(n);
        return e
      }
    }(),
    a = t.idxOf = function() {
      return function(t, n, e) {
        return Array.prototype.indexOf.call(t, n, e)
      }
    }(),
    c = t.keys = Object.keys || function(t) {
      var n, e = [];
      for (n in t)
        i(t, n) && e.push(n);
      return e
    },
    s = t.optimizeCb = function() {
      return function(t, n, r) {
        if (e(n))
          return t;
        switch (null == r ? 3 : r) {
          case 1:
            return function(e) {
              return t.call(n, e)
            };
          case 3:
            return function(e, r, i) {
              return t.call(n, e, r, i)
            };
          case 4:
            return function(e, r, i, o) {
              return t.call(n, e, r, i, o)
            }
        }
        return function() {
          return t.apply(n, arguments)
        }
      }
    }(),
    l = t.identity = function() {
      return function(t) {
        return t
      }
    }(),
    f = t.objToStr = function() {
      var t = Object.prototype.toString;
      return function(n) {
        return t.call(n)
      }
    }(),
    h = t.isArgs = function() {
      return function(t) {
        return "[object Arguments]" === f(t)
      }
    }(),
    d = t.isArr = Array.isArray || function(t) {
      return "[object Array]" === f(t)
    },
    p = t.castPath = function() {
      var t = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        n = /\\(\\)?/g;
      return function(e, r) {
        if (d(e))
          return e;
        if (r && i(r, e))
          return [e];
        var o = [];
        return e.replace(t, function(t, e, r, i) {
            o.push(r ? i.replace(n, "$1") : e || t)
          }),
          o
      }
    }(),
    g = t.safeGet = function() {
      return function(t, n) {
        n = p(n, t);
        for (var r; r = n.shift();)
          if (t = t[r],
            e(t))
            return;
        return t
      }
    }(),
    m = t.isFn = function() {
      return function(t) {
        var n = f(t);
        return "[object Function]" === n || "[object GeneratorFunction]" === n
      }
    }(),
    v = t.isStr = function() {
      return function(t) {
        return "[object String]" === f(t)
      }
    }(),
    y = t.isNum = function() {
      return function(t) {
        return "[object Number]" === f(t)
      }
    }(),
    w = t.isArrLike = function() {
      var t = Math.pow(2, 53) - 1;
      return function(n) {
        if (!n)
          return !1;
        var e = n.length;
        return y(e) && e >= 0 && e <= t && !m(n)
      }
    }(),
    b = t.each = function() {
      return function(t, n, e) {
        n = s(n, e);
        var r, i;
        if (w(t))
          for (r = 0,
            i = t.length; r < i; r++)
            n(t[r], r, t);
        else {
          var o = c(t);
          for (r = 0,
            i = o.length; r < i; r++)
            n(t[o[r]], o[r], t)
        }
        return t
      }
    }(),
    T = t.createAssigner = function() {
      return function(t, n) {
        return function(r) {
          return b(arguments, function(i, o) {
              if (0 !== o) {
                var u = t(i);
                b(u, function(t) {
                  n && !e(r[t]) || (r[t] = i[t])
                })
              }
            }),
            r
        }
      }
    }(),
    x = t.defaults = T(u, !0),
    M = t.extend = T(u),
    S = t.extendOwn = T(c),
    A = t.values = function() {
      return function(t) {
        var n = [];
        return b(t, function(t) {
            n.push(t)
          }),
          n
      }
    }(),
    C = t.contain = function() {
      return function(t, n) {
        return w(t) || (t = A(t)),
          a(t, n) >= 0
      }
    }(),
    P = t.isBrowser = "object" == typeof window && "object" == typeof document && 9 === document.nodeType,
    j = t.isEmpty = function() {
      return function(t) {
        return null == t || (w(t) && (d(t) || v(t) || h(t)) ? 0 === t.length : 0 === c(t).length)
      }
    }(),
    k = t.isMatch = function() {
      return function(t, n) {
        var e = c(n),
          r = e.length;
        if (null == t)
          return !r;
        t = Object(t);
        for (var i = 0; i < r; i++) {
          var o = e[i];
          if (n[o] !== t[o] || !(o in t))
            return !1
        }
        return !0
      }
    }(),
    I = t.ltrim = function() {
      var t = /^\s+/;
      return function(n, e) {
        if (null == e)
          return n.replace(t, "");
        for (var r, i, o = 0, u = n.length, a = e.length, c = !0; c && o < u;)
          for (c = !1,
            r = -1,
            i = n.charAt(o); ++r < a;)
            if (i === e[r]) {
              c = !0,
                o++;
              break
            }
        return o >= u ? "" : n.substr(o, u)
      }
    }(),
    E = t.matcher = function() {
      return function(t) {
        return t = S({}, t),
          function(n) {
            return k(n, t)
          }
      }
    }(),
    O = t.safeCb = function(t, e, r) {
      return null == t ? l : m(t) ? s(t, e, r) : n(t) ? E(t) : function(t) {
        return function(n) {
          return null == n ? void 0 : n[t]
        }
      }
    },
    z = t.filter = function() {
      return function(t, n, e) {
        var r = [];
        return n = O(n, e),
          b(t, function(t, e, i) {
            n(t, e, i) && r.push(t)
          }),
          r
      }
    }(),
    L = t.map = function() {
      return function(t, n, e) {
        n = O(n, e);
        for (var r = !w(t) && c(t), i = (r || t).length, o = Array(i), u = 0; u < i; u++) {
          var a = r ? r[u] : u;
          o[u] = n(t[a], a, t)
        }
        return o
      }
    }(),
    R = t.toArr = function() {
      return function(t) {
        return t ? d(t) ? t : w(t) && !v(t) ? L(t) : [t] : []
      }
    }(),
    D = t.Class = function() {
      function t(t, n) {
        return e.extend(t, n)
      }

      function n(t, e, i) {
        i = i || {};
        var o = e.className || g(e, "initialize.name") || "";
        delete e.className;
        var u = new Function("toArr", "return function " + o + "(){var args = toArr(arguments);return this.initialize ? this.initialize.apply(this, args) || this : this;};")(R);
        return r(u, t),
          u.prototype.constructor = u,
          u.extend = function(t, e) {
            return n(u, t, e)
          },
          u.inherits = function(t) {
            r(u, t)
          },
          u.methods = function(t) {
            return M(u.prototype, t),
              u
          },
          u.statics = function(t) {
            return M(u, t),
              u
          },
          u.methods(e).statics(i),
          u
      }
      var e = t.Base = n(Object, {
        className: "Base",
        callSuper: function(t, n, e) {
          return t.prototype[n].apply(this, e)
        },
        toString: function() {
          return this.constructor.name
        }
      });
      return t
    }(),
    N = t.Select = function(t) {
      function n(t, n) {
        for (var e = n.length, r = t.length, i = 0; i < e; i++)
          t[r++] = n[i];
        return t.length = r,
          t
      }
      var e = new(t = D({
        className: "Select",
        initialize: function(t) {
          return this.length = 0,
            t ? v(t) ? e.find(t) : void(t.nodeType && (this[0] = t,
              this.length = 1)) : this
        },
        find: function(t) {
          var e = new N;
          return this.each(function() {
              n(e, this.querySelectorAll(t))
            }),
            e
        },
        each: function(t) {
          return b(this, function(n, e) {
              t.call(n, e, n)
            }),
            this
        }
      }))(document);
      return t
    }({}),
    F = t.$safeEls = function() {
      return function(t) {
        return R(v(t) ? new N(t) : t)
      }
    }(),
    q = t.$attr = function() {
      function t(t, o, u) {
        if (t = F(t),
          e(u) && v(o))
          return r(t[0], o);
        var a = o;
        n(a) || ((a = {})[o] = u),
          i(t, a)
      }

      function r(t, n) {
        return t.getAttribute(n)
      }

      function i(t, n) {
        b(t, function(t) {
          b(n, function(n, e) {
            t.setAttribute(e, n)
          })
        })
      }
      return t.remove = function(t, n) {
          t = F(t),
            n = R(n),
            b(t, function(t) {
              b(n, function(n) {
                t.removeAttribute(n)
              })
            })
        },
        t
    }(),
    $ = (t.$data = function() {
        return function(t, e, r) {
          var i = e;
          return v(e) && (i = "data-" + e),
            n(e) && (i = {},
              b(e, function(t, n) {
                i["data-" + n] = t
              })),
            q(t, i, r)
        }
      }(),
      t.delegate = function(t) {
        function n() {
          return !0
        }

        function e() {
          return !1
        }

        function r(n) {
          var e, r = this.events[n.type],
            o = i.call(this, n, r);
          n = new t.Event(n);
          for (var u, a, c = 0;
            (a = o[c++]) && !n.isPropagationStopped();)
            for (n.curTarget = a.el,
              u = 0;
              (e = a.handlers[u++]) && !n.isImmediatePropagationStopped();)
              !1 === e.handler.apply(a.el, [n]) && (n.preventDefault(),
                n.stopPropagation())
        }

        function i(t, n) {
          var e, r, i, o, u = t.target,
            a = [],
            c = n.delegateCount;
          if (u.nodeType)
            for (; u !== this; u = u.parentNode || this) {
              for (r = [],
                o = 0; o < c; o++)
                void 0 === r[e = (i = n[o]).selector + " "] && (r[e] = C(this.querySelectorAll(e), u)),
                r[e] && r.push(i);
              r.length && a.push({
                el: u,
                handlers: r
              })
            }
          return c < n.length && a.push({
              el: this,
              handlers: n.slice(c)
            }),
            a
        }
        return t = {
          add: function(t, n, e, i) {
            var o, u = {
              selector: e,
              handler: i
            };
            t.events || (t.events = {}),
              (o = t.events[n]) || ((o = t.events[n] = []).delegateCount = 0,
                t.addEventListener(n, function(n) {
                  r.apply(t, arguments)
                }, !1)),
              e ? o.splice(o.delegateCount++, 0, u) : o.push(u)
          },
          remove: function(t, n, e, r) {
            var i = t.events;
            if (i && i[n])
              for (var o, u = i[n], a = u.length; a--;)
                o = u[a],
                e && o.selector != e || o.handler != r || (u.splice(a, 1),
                  o.selector && u.delegateCount--)
          },
          Event: D({
            className: "Event",
            initialize: function(t) {
              this.origEvent = t
            },
            isDefaultPrevented: e,
            isPropagationStopped: e,
            isImmediatePropagationStopped: e,
            preventDefault: function() {
              var t = this.origEvent;
              this.isDefaultPrevented = n,
                t && t.preventDefault && t.preventDefault()
            },
            stopPropagation: function() {
              var t = this.origEvent;
              this.isPropagationStopped = n,
                t && t.stopPropagation && t.stopPropagation()
            },
            stopImmediatePropagation: function() {
              var t = this.origEvent;
              this.isImmediatePropagationStopped = n,
                t && t.stopImmediatePropagation && t.stopImmediatePropagation(),
                this.stopPropagation()
            }
          })
        }
      }({})),
    B = t.$event = function(t) {
      function n(t) {
        return function(n, r, i, o) {
          n = F(n),
            e(o) && (o = i,
              i = void 0),
            b(n, function(n) {
              $[t](n, r, i, o)
            })
        }
      }
      return {
        on: n("add"),
        off: n("remove")
      }
    }(),
    U = t.now = Date.now || function() {
      return (new Date).getTime()
    },
    X = t.raf = function(t) {
      var n, e;
      if (P) {
        n = window.requestAnimationFrame,
          e = window.cancelAnimationFrame;
        for (var r = 0, i = ["ms", "moz", "webkit", "o"], o = 0, u = i.length; o < u && !n; o++)
          n = window[i[o] + "RequestAnimationFrame"],
          e = window[i[o] + "CancelAnimationFrame"] || window[i[o] + "CancelRequestAnimationFrame"]
      }
      return n = n || function(t) {
          var n = U(),
            e = Math.max(0, 16 - (n - r)),
            i = setTimeout(function() {
              t(n + e)
            }, e);
          return r = n + e,
            i
        },
        e = e || function(t) {
          clearTimeout(t)
        },
        n.cancel = e,
        n
    }(),
    G = t.rtrim = function() {
      var t = /\s+$/;
      return function(n, e) {
        if (null == e)
          return n.replace(t, "");
        for (var r, i, o = n.length - 1, u = e.length, a = !0; a && o >= 0;)
          for (a = !1,
            r = -1,
            i = n.charAt(o); ++r < u;)
            if (i === e[r]) {
              a = !0,
                o--;
              break
            }
        return o >= 0 ? n.substring(0, o + 1) : ""
      }
    }(),
    Y = t.trim = function() {
      var t = /^\s+|\s+$/g;
      return function(n, e) {
        return null == e ? n.replace(t, "") : I(G(n, e), e)
      }
    }(),
    H = t.query = function(t) {
      t = {
        parse: function(t) {
          var n = {};
          return t = Y(t).replace(r, ""),
            b(t.split("&"), function(t) {
              var r = t.split("="),
                i = r.shift(),
                o = r.length > 0 ? r.join("=") : null;
              i = decodeURIComponent(i),
                o = decodeURIComponent(o),
                e(n[i]) ? n[i] = o : d(n[i]) ? n[i].push(o) : n[i] = [n[i], o]
            }),
            n
        },
        stringify: function(e, r) {
          return z(L(e, function(e, i) {
            return n(e) && j(e) ? "" : d(e) ? t.stringify(e, i) : (r ? encodeURIComponent(r) : encodeURIComponent(i)) + "=" + encodeURIComponent(e)
          }), function(t) {
            return t.length > 0
          }).join("&")
        }
      };
      var r = /^(\?|#|&)/g;
      return t
    }({}),
    _ = t.ajax = function() {
      function t(e) {
        x(e, t.setting);
        var r, i = e.type,
          u = e.url,
          a = e.data,
          c = e.dataType,
          s = e.success,
          l = e.error,
          f = e.timeout,
          h = e.complete,
          d = e.xhr();
        return d.onreadystatechange = function() {
            if (4 === d.readyState) {
              clearTimeout(r);
              var t, n = d.status;
              if (n >= 200 && n < 300 || 304 === n) {
                t = d.responseText,
                  "xml" === c && (t = d.responseXML);
                try {
                  "json" === c && (t = JSON.parse(t))
                } catch (t) {}
                s(t, d)
              } else
                l(d);
              h(d)
            }
          },
          "GET" === i ? (a = H.stringify(a),
            u += u.indexOf("?") > -1 ? "&" + a : "?" + a) : n(a) && (a = H.stringify(a)),
          d.open(i, u, !0),
          d.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
          f > 0 && (r = setTimeout(function() {
            d.onreadystatechange = o,
              d.abort(),
              l(d, "timeout"),
              h(d)
          }, f)),
          d.send("GET" === i ? null : a),
          d
      }

      function e(t, n, e, r) {
        return m(n) && (r = e,
          e = n,
          n = {}), {
          url: t,
          data: n,
          success: e,
          dataType: r
        }
      }
      return t.setting = {
          type: "GET",
          success: o,
          error: o,
          complete: o,
          dataType: "json",
          data: {},
          xhr: function() {
            return new XMLHttpRequest
          },
          timeout: 0
        },
        t.get = function() {
          return t(e.apply(null, arguments))
        },
        t.post = function() {
          var n = e.apply(null, arguments);
          return n.type = "POST",
            t(n)
        },
        t
    }();
  return function() {
      function t() {
        X(t),
          ++a,
          o.globalCompositeOperation = "source-over",
          o.shadowBlur = 0,
          o.fillStyle = "rgba(237, 162, 155,alp)".replace("alp", u.repaintAlpha),
          o.fillRect(0, 0, r, i),
          o.globalCompositeOperation = "lighter",
          c.length < u.count && Math.random() < u.spawnChance && c.push(new h),
          c.map(function(t) {
            t.step()
          })
      }

      function n() {
        return window.innerWidth > 800 ? 800 : window.innerWidth
      }

      var e = document.getElementById("c"),
        r = e.width = n(),
        i = e.height = 210,
        o = e.getContext("2d"),
        u = {
          len: 20,
          count: 50,
          baseTime: 10,
          addedTime: 10,
          dieChance: .05,
          spawnChance: 1,
          sparkChance: .1,
          sparkDist: 10,
          sparkSize: 2,
          color: "hsl(hue,100%,light%)",
          baseLight: 50,
          addedLight: 10,
          shadowToTimePropMult: 6,
          baseLightInputMultiplier: .01,
          addedLightInputMultiplier: .02,
          cx: r / 2,
          cy: i / 2,
          repaintAlpha: .04,
          hueChange: .1
        },
        a = 0,
        c = [],
        s = r / 2 / u.len,
        l = i / 2 / u.len,
        f = 2 * Math.PI / 6;
      o.fillStyle = "#fff",
        o.fillRect(0, 0, r, i);
      var h = D({
        className: "Line",
        initialize: function() {
          this.reset()
        },
        reset: function() {
          this.x = 0,
            this.y = 0,
            this.addedX = 0,
            this.addedY = 0,
            this.rad = 0,
            this.lightInputMultiplier = u.baseLightInputMultiplier + u.addedLightInputMultiplier * Math.random(),
            this.color = u.color.replace("hue", a * u.hueChange),
            this.cumulativeTime = 0,
            this.beginPhase()
        },
        beginPhase: function() {
          this.x += this.addedX,
            this.y += this.addedY,
            this.time = 0,
            this.targetTime = u.baseTime + u.addedTime * Math.random() | 0,
            this.rad += f * (Math.random() < .5 ? 1 : -1),
            this.addedX = Math.cos(this.rad),
            this.addedY = Math.sin(this.rad),
            (Math.random() < u.dieChance || this.x > s || this.x < -s || this.y > l || this.y < -l) && this.reset()
        },
        step: function() {
          ++this.time,
            ++this.cumulativeTime,
            this.time >= this.targetTime && this.beginPhase();
          var t = this.time / this.targetTime,
            n = Math.sin(t * Math.PI / 2),
            e = this.addedX * n,
            r = this.addedY * n;
          o.shadowBlur = t * u.shadowToTimePropMult,
            o.fillStyle = o.shadowColor = this.color.replace("light", u.baseLight + u.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier)),
            o.fillRect(u.cx + (this.x + e) * u.len, u.cy + (this.y + r) * u.len, 2, 2),
            Math.random() < u.sparkChance && o.fillRect(u.cx + (this.x + e) * u.len + Math.random() * u.sparkDist * (Math.random() < .5 ? 1 : -1) - u.sparkSize / 2, u.cy + (this.y + r) * u.len + Math.random() * u.sparkDist * (Math.random() < .5 ? 1 : -1) - u.sparkSize / 2, u.sparkSize, u.sparkSize)
        }
      });
      t(),
        window.addEventListener("resize", function() {
          r = e.width = n(),
            i = e.height = 210,
            o.fillStyle = "#fff",
            o.fillRect(0, 0, r, i),
            u.cx = r / 2,
            u.cy = i / 2,
            s = r / 2 / u.len,
            l = i / 2 / u.len
        })
    }(),
    t
}();
