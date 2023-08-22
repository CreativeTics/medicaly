/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
;(function () {
  function i() {}
  function u(n) {
    return n
  }
  function ot(n) {
    return !!n
  }
  function c(n) {
    return !n
  }
  function s(n) {
    return function () {
      if (n === null) throw new Error('Callback was already called.')
      n.apply(this, arguments)
      n = null
    }
  }
  function o(n) {
    return function () {
      n !== null && (n.apply(this, arguments), (n = null))
    }
  }
  function k(n) {
    return (
      f(n) ||
      (typeof n.length == 'number' && n.length >= 0 && n.length % 1 == 0)
    )
  }
  function r(n, t) {
    for (var i = -1, r = n.length; ++i < r; ) t(n[i], i, n)
  }
  function h(n, t) {
    for (var i = -1, r = n.length, u = Array(r); ++i < r; ) u[i] = t(n[i], i, n)
    return u
  }
  function ht(n) {
    return h(Array(n), function (n, t) {
      return t
    })
  }
  function kt(n, t, i) {
    return (
      r(n, function (n, r, u) {
        i = t(i, n, r, u)
      }),
      i
    )
  }
  function dt(n, t) {
    r(a(n), function (i) {
      t(n[i], i)
    })
  }
  function ct(n, t) {
    for (var i = 0; i < n.length; i++) if (n[i] === t) return i
    return -1
  }
  function d(n) {
    var t = -1,
      i,
      r
    return k(n)
      ? ((i = n.length),
        function () {
          return t++, t < i ? t : null
        })
      : ((r = a(n)),
        (i = r.length),
        function () {
          return t++, t < i ? r[t] : null
        })
  }
  function t(n, t) {
    return (
      (t = t == null ? n.length - 1 : +t),
      function () {
        for (
          var u = Math.max(arguments.length - t, 0), r = Array(u), i = 0;
          i < u;
          i++
        )
          r[i] = arguments[i + t]
        switch (t) {
          case 0:
            return n.call(this, r)
          case 1:
            return n.call(this, arguments[0], r)
        }
      }
    )
  }
  function g(n) {
    return function (t, i, r) {
      return n(t, r)
    }
  }
  function y(n) {
    return function (t, r, u) {
      var e
      if (((u = o(u || i)), (t = t || []), (e = d(t)), n <= 0)) return u(null)
      var h = !1,
        f = 0,
        c = !1
      ;(function l() {
        if (h && f <= 0) return u(null)
        while (f < n && !c) {
          var i = e()
          if (i === null) {
            h = !0
            f <= 0 && u(null)
            return
          }
          f += 1
          r(
            t[i],
            i,
            s(function (n) {
              f -= 1
              n ? (u(n), (c = !0)) : l()
            })
          )
        }
      })()
    }
  }
  function p(t) {
    return function (i, r, u) {
      return t(n.eachOf, i, r, u)
    }
  }
  function tt(n) {
    return function (t, i, r, u) {
      return n(y(i), t, r, u)
    }
  }
  function w(t) {
    return function (i, r, u) {
      return t(n.eachOfSeries, i, r, u)
    }
  }
  function it(n, t, r, u) {
    u = o(u || i)
    t = t || []
    var f = k(t) ? [] : {}
    n(
      t,
      function (n, t, i) {
        r(n, function (n, r) {
          f[t] = r
          i(n)
        })
      },
      function (n) {
        u(n, f)
      }
    )
  }
  function b(n, t, i, r) {
    var u = []
    n(
      t,
      function (n, t, r) {
        i(n, function (i) {
          i && u.push({ index: t, value: n })
          r()
        })
      },
      function () {
        r(
          h(
            u.sort(function (n, t) {
              return n.index - t.index
            }),
            function (n) {
              return n.value
            }
          )
        )
      }
    )
  }
  function rt(n, t, i, r) {
    b(
      n,
      t,
      function (n, t) {
        i(n, function (n) {
          t(!n)
        })
      },
      r
    )
  }
  function e(n, t, i) {
    return function (r, u, f, e) {
      function o() {
        e && e(i(!1, void 0))
      }
      function s(n, r, u) {
        if (!e) return u()
        f(n, function (r) {
          e && t(r) && (e(i(!0, n)), (e = f = !1))
          u()
        })
      }
      arguments.length > 3 ? n(r, u, s, o) : ((e = f), (f = u), n(r, s, o))
    }
  }
  function ut(n, t) {
    return t
  }
  function ft(n, r, u) {
    u = u || i
    var f = k(r) ? [] : {}
    n(
      r,
      function (n, i, r) {
        n(
          t(function (n, t) {
            t.length <= 1 && (t = t[0])
            f[i] = t
            r(n)
          })
        )
      },
      function (n) {
        u(n, f)
      }
    )
  }
  function lt(n, t, i, r) {
    var u = []
    n(
      t,
      function (n, t, r) {
        i(n, function (n, t) {
          u = u.concat(t || [])
          r(n)
        })
      },
      function (n) {
        r(n, u)
      }
    )
  }
  function at(t, u, e) {
    function a(t, u, e, o) {
      if (o != null && typeof o != 'function')
        throw new Error('task callback must be a function')
      if (((t.started = !0), f(u) || (u = [u]), u.length === 0 && t.idle()))
        return n.setImmediate(function () {
          t.drain()
        })
      r(u, function (n) {
        var r = { data: n, callback: o || i }
        e ? t.tasks.unshift(r) : t.tasks.push(r)
        t.tasks.length === t.concurrency && t.saturated()
      })
      n.setImmediate(t.process)
    }
    function v(n, t) {
      return function () {
        c -= 1
        var i = !1,
          u = arguments
        r(t, function (n) {
          r(l, function (t, r) {
            t !== n || i || (l.splice(r, 1), (i = !0))
          })
          n.callback.apply(n, u)
        })
        n.tasks.length + c === 0 && n.drain()
        n.process()
      }
    }
    if (u == null) u = 1
    else if (u === 0) throw new Error('Concurrency must not be zero')
    var c = 0,
      l = [],
      o = {
        tasks: [],
        concurrency: u,
        payload: e,
        saturated: i,
        empty: i,
        drain: i,
        started: !1,
        paused: !1,
        push: function (n, t) {
          a(o, n, !1, t)
        },
        kill: function () {
          o.drain = i
          o.tasks = []
        },
        unshift: function (n, t) {
          a(o, n, !0, t)
        },
        process: function () {
          var n, i, r
          if (!o.paused && c < o.concurrency && o.tasks.length)
            while (c < o.concurrency && o.tasks.length)
              (n = o.payload
                ? o.tasks.splice(0, o.payload)
                : o.tasks.splice(0, o.tasks.length)),
                (i = h(n, function (n) {
                  return n.data
                })),
                o.tasks.length === 0 && o.empty(),
                (c += 1),
                l.push(n[0]),
                (r = s(v(o, n))),
                t(i, r)
        },
        length: function () {
          return o.tasks.length
        },
        running: function () {
          return c
        },
        workersList: function () {
          return l
        },
        idle: function () {
          return o.tasks.length + c === 0
        },
        pause: function () {
          o.paused = !0
        },
        resume: function () {
          var i, t
          if (o.paused !== !1)
            for (
              o.paused = !1, i = Math.min(o.concurrency, o.tasks.length), t = 1;
              t <= i;
              t++
            )
              n.setImmediate(o.process)
        },
      }
    return o
  }
  function vt(n) {
    return t(function (i, u) {
      i.apply(
        null,
        u.concat([
          t(function (t, i) {
            typeof console == 'object' &&
              (t
                ? console.error && console.error(t)
                : console[n] &&
                  r(i, function (t) {
                    console[n](t)
                  }))
          }),
        ])
      )
    })
  }
  function yt(n) {
    return function (t, i, r) {
      n(ht(t), i, r)
    }
  }
  function pt(n) {
    return t(function (i, r) {
      var u = t(function (t) {
        var r = this,
          u = t.pop()
        return n(
          i,
          function (n, i, u) {
            n.apply(r, t.concat([u]))
          },
          u
        )
      })
      return r.length ? u.apply(this, r) : u
    })
  }
  function et(i) {
    return t(function (t) {
      var u = t.pop(),
        r
      t.push(function () {
        var t = arguments
        r
          ? n.setImmediate(function () {
              u.apply(null, t)
            })
          : u.apply(null, t)
      })
      r = !0
      i.apply(this, t)
      r = !1
    })
  }
  var n = {},
    st,
    l =
      (typeof self == 'object' && self.self === self && self) ||
      (typeof global == 'object' && global.global === global && global) ||
      this,
    a,
    v,
    nt
  l != null && (st = l.async)
  n.noConflict = function () {
    return (l.async = st), n
  }
  var wt = Object.prototype.toString,
    f =
      Array.isArray ||
      function (n) {
        return wt.call(n) === '[object Array]'
      },
    bt = function (n) {
      var t = typeof n
      return t === 'function' || (t === 'object' && !!n)
    }
  a =
    Object.keys ||
    function (n) {
      var t = []
      for (var i in n) n.hasOwnProperty(i) && t.push(i)
      return t
    }
  v = typeof setImmediate == 'function' && setImmediate
  nt = v
    ? function (n) {
        v(n)
      }
    : function (n) {
        setTimeout(n, 0)
      }
  n.nextTick =
    typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : nt
  n.setImmediate = v ? nt : n.nextTick
  n.forEach = n.each = function (t, i, r) {
    return n.eachOf(t, g(i), r)
  }
  n.forEachSeries = n.eachSeries = function (t, i, r) {
    return n.eachOfSeries(t, g(i), r)
  }
  n.forEachLimit = n.eachLimit = function (n, t, i, r) {
    return y(t)(n, g(i), r)
  }
  n.forEachOf = n.eachOf = function (n, t, r) {
    function h(n) {
      f--
      n ? r(n) : u === null && f <= 0 && r(null)
    }
    r = o(r || i)
    n = n || []
    for (var e = d(n), u, f = 0; (u = e()) != null; ) (f += 1), t(n[u], u, s(h))
    f === 0 && r(null)
  }
  n.forEachOfSeries = n.eachOfSeries = function (t, r, u) {
    function e() {
      var i = !0
      if (f === null) return u(null)
      r(
        t[f],
        f,
        s(function (t) {
          if (t) u(t)
          else {
            if (((f = h()), f === null)) return u(null)
            i ? n.setImmediate(e) : e()
          }
        })
      )
      i = !1
    }
    u = o(u || i)
    t = t || []
    var h = d(t),
      f = h()
    e()
  }
  n.forEachOfLimit = n.eachOfLimit = function (n, t, i, r) {
    y(t)(n, i, r)
  }
  n.map = p(it)
  n.mapSeries = w(it)
  n.mapLimit = tt(it)
  n.inject =
    n.foldl =
    n.reduce =
      function (t, i, r, u) {
        n.eachOfSeries(
          t,
          function (n, t, u) {
            r(i, n, function (n, t) {
              i = t
              u(n)
            })
          },
          function (n) {
            u(n, i)
          }
        )
      }
  n.foldr = n.reduceRight = function (t, i, r, f) {
    var e = h(t, u).reverse()
    n.reduce(e, i, r, f)
  }
  n.transform = function (t, i, r, u) {
    arguments.length === 3 && ((u = r), (r = i), (i = f(t) ? [] : {}))
    n.eachOf(
      t,
      function (n, t, u) {
        r(i, n, t, u)
      },
      function (n) {
        u(n, i)
      }
    )
  }
  n.select = n.filter = p(b)
  n.selectLimit = n.filterLimit = tt(b)
  n.selectSeries = n.filterSeries = w(b)
  n.reject = p(rt)
  n.rejectLimit = tt(rt)
  n.rejectSeries = w(rt)
  n.any = n.some = e(n.eachOf, ot, u)
  n.someLimit = e(n.eachOfLimit, ot, u)
  n.all = n.every = e(n.eachOf, c, c)
  n.everyLimit = e(n.eachOfLimit, c, c)
  n.detect = e(n.eachOf, u, ut)
  n.detectSeries = e(n.eachOfSeries, u, ut)
  n.detectLimit = e(n.eachOfLimit, u, ut)
  n.sortBy = function (t, i, r) {
    function u(n, t) {
      var i = n.criteria,
        r = t.criteria
      return i < r ? -1 : i > r ? 1 : 0
    }
    n.map(
      t,
      function (n, t) {
        i(n, function (i, r) {
          i ? t(i) : t(null, { value: n, criteria: r })
        })
      },
      function (n, t) {
        if (n) return r(n)
        r(
          null,
          h(t.sort(u), function (n) {
            return n.value
          })
        )
      }
    )
  }
  n.auto = function (u, e, s) {
    function p(n) {
      v.unshift(n)
    }
    function w(n) {
      var t = ct(v, n)
      t >= 0 && v.splice(t, 1)
    }
    function b() {
      c--
      r(v.slice(0), function (n) {
        n()
      })
    }
    var y, c
    if (
      (s || ((s = e), (e = null)),
      (s = o(s || i)),
      (y = a(u)),
      (c = y.length),
      !c)
    )
      return s(null)
    e || (e = c)
    var h = {},
      l = 0,
      v = []
    p(function () {
      c || s(null, h)
    })
    r(y, function (i) {
      function y() {
        return (
          l < e &&
          kt(
            o,
            function (n, t) {
              return n && h.hasOwnProperty(t)
            },
            !0
          ) &&
          !h.hasOwnProperty(i)
        )
      }
      function k() {
        y() && (l++, w(k), r[r.length - 1](a, h))
      }
      for (
        var r = f(u[i]) ? u[i] : [u[i]],
          a = t(function (t, r) {
            if ((l--, r.length <= 1 && (r = r[0]), t)) {
              var u = {}
              dt(h, function (n, t) {
                u[t] = n
              })
              u[i] = r
              s(t, u)
            } else (h[i] = r), n.setImmediate(b)
          }),
          o = r.slice(0, r.length - 1),
          v = o.length,
          c;
        v--;

      ) {
        if (!(c = u[o[v]])) throw new Error('Has inexistant dependency')
        if (f(c) && ct(c, i) >= 0) throw new Error('Has cyclic dependencies')
      }
      y() ? (l++, r[r.length - 1](a, h)) : p(k)
    })
  }
  n.retry = function (t, i, r) {
    function c(n, t) {
      if (typeof t == 'number') n.times = parseInt(t, 10) || f
      else if (typeof t == 'object')
        (n.times = parseInt(t.times, 10) || f),
          (n.interval = parseInt(t.interval, 10) || s)
      else throw new Error("Unsupported argument type for 'times': " + typeof t)
    }
    function h(t, i) {
      function f(n, t) {
        return function (r) {
          n(function (n, i) {
            r(!n || t, { err: n, result: i })
          }, i)
        }
      }
      function o(n) {
        return function (t) {
          setTimeout(function () {
            t(null)
          }, n)
        }
      }
      while (u.times) {
        var r = !(u.times -= 1)
        e.push(f(u.task, r))
        !r && u.interval > 0 && e.push(o(u.interval))
      }
      n.series(e, function (n, i) {
        i = i[i.length - 1]
        ;(t || u.callback)(i.err, i.result)
      })
    }
    var f = 5,
      s = 0,
      e = [],
      u = { times: f, interval: s },
      o = arguments.length
    if (o < 1 || o > 3)
      throw new Error(
        'Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)'
      )
    else o <= 2 && typeof t == 'function' && ((r = i), (i = t))
    return (
      typeof t != 'function' && c(u, t),
      (u.callback = r),
      (u.task = i),
      u.callback ? h() : h
    )
  }
  n.waterfall = function (r, u) {
    function e(n) {
      return t(function (t, i) {
        if (t) u.apply(null, [t].concat(i))
        else {
          var r = n.next()
          r ? i.push(e(r)) : i.push(u)
          et(n).apply(null, i)
        }
      })
    }
    if (((u = o(u || i)), !f(r))) {
      var s = new Error(
        'First argument to waterfall must be an array of functions'
      )
      return u(s)
    }
    if (!r.length) return u()
    e(n.iterator(r))()
  }
  n.parallel = function (t, i) {
    ft(n.eachOf, t, i)
  }
  n.parallelLimit = function (n, t, i) {
    ft(y(t), n, i)
  }
  n.series = function (t, i) {
    ft(n.eachOfSeries, t, i)
  }
  n.iterator = function (n) {
    function t(i) {
      function r() {
        return n.length && n[i].apply(null, arguments), r.next()
      }
      return (
        (r.next = function () {
          return i < n.length - 1 ? t(i + 1) : null
        }),
        r
      )
    }
    return t(0)
  }
  n.apply = t(function (n, i) {
    return t(function (t) {
      return n.apply(null, i.concat(t))
    })
  })
  n.concat = p(lt)
  n.concatSeries = w(lt)
  n.whilst = function (n, r, u) {
    if (((u = u || i), n())) {
      var f = t(function (t, i) {
        t ? u(t) : n.apply(this, i) ? r(f) : u(null)
      })
      r(f)
    } else u(null)
  }
  n.doWhilst = function (t, i, r) {
    var u = 0
    return n.whilst(
      function () {
        return ++u <= 1 || i.apply(this, arguments)
      },
      t,
      r
    )
  }
  n.until = function (t, i, r) {
    return n.whilst(
      function () {
        return !t.apply(this, arguments)
      },
      i,
      r
    )
  }
  n.doUntil = function (t, i, r) {
    return n.doWhilst(
      t,
      function () {
        return !i.apply(this, arguments)
      },
      r
    )
  }
  n.during = function (n, r, u) {
    u = u || i
    var e = t(function (t, i) {
        t ? u(t) : (i.push(f), n.apply(this, i))
      }),
      f = function (n, t) {
        n ? u(n) : t ? r(e) : u(null)
      }
    n(f)
  }
  n.doDuring = function (t, i, r) {
    var u = 0
    n.during(
      function (n) {
        u++ < 1 ? n(null, !0) : i.apply(this, arguments)
      },
      t,
      r
    )
  }
  n.queue = function (n, t) {
    return at(
      function (t, i) {
        n(t[0], i)
      },
      t,
      1
    )
  }
  n.priorityQueue = function (t, u) {
    function o(n, t) {
      return n.priority - t.priority
    }
    function s(n, t, i) {
      for (var r = -1, f = n.length - 1, u; r < f; )
        (u = r + ((f - r + 1) >>> 1)), i(t, n[u]) >= 0 ? (r = u) : (f = u - 1)
      return r
    }
    function h(t, u, e, h) {
      if (h != null && typeof h != 'function')
        throw new Error('task callback must be a function')
      if (((t.started = !0), f(u) || (u = [u]), u.length === 0))
        return n.setImmediate(function () {
          t.drain()
        })
      r(u, function (r) {
        var u = {
          data: r,
          priority: e,
          callback: typeof h == 'function' ? h : i,
        }
        t.tasks.splice(s(t.tasks, u, o) + 1, 0, u)
        t.tasks.length === t.concurrency && t.saturated()
        n.setImmediate(t.process)
      })
    }
    var e = n.queue(t, u)
    return (
      (e.push = function (n, t, i) {
        h(e, n, t, i)
      }),
      delete e.unshift,
      e
    )
  }
  n.cargo = function (n, t) {
    return at(n, 1, t)
  }
  n.log = vt('log')
  n.dir = vt('dir')
  n.memoize = function (i, r) {
    var e = {},
      f = {},
      o
    return (
      (r = r || u),
      (o = t(function (u) {
        var s = u.pop(),
          o = r.apply(null, u)
        o in e
          ? n.setImmediate(function () {
              s.apply(null, e[o])
            })
          : o in f
          ? f[o].push(s)
          : ((f[o] = [s]),
            i.apply(
              null,
              u.concat([
                t(function (n) {
                  var i, t, r
                  for (
                    e[o] = n, i = f[o], delete f[o], t = 0, r = i.length;
                    t < r;
                    t++
                  )
                    i[t].apply(null, n)
                }),
              ])
            ))
      })),
      (o.memo = e),
      (o.unmemoized = i),
      o
    )
  }
  n.unmemoize = function (n) {
    return function () {
      return (n.unmemoized || n).apply(null, arguments)
    }
  }
  n.times = yt(n.map)
  n.timesSeries = yt(n.mapSeries)
  n.timesLimit = function (t, i, r, u) {
    return n.mapLimit(ht(t), i, r, u)
  }
  n.seq = function () {
    var r = arguments
    return t(function (u) {
      var e = this,
        f = u[u.length - 1]
      typeof f == 'function' ? u.pop() : (f = i)
      n.reduce(
        r,
        u,
        function (n, i, r) {
          i.apply(
            e,
            n.concat([
              t(function (n, t) {
                r(n, t)
              }),
            ])
          )
        },
        function (n, t) {
          f.apply(e, [n].concat(t))
        }
      )
    })
  }
  n.compose = function () {
    return n.seq.apply(null, Array.prototype.reverse.call(arguments))
  }
  n.applyEach = pt(n.eachOf)
  n.applyEachSeries = pt(n.eachOfSeries)
  n.forever = function (n, t) {
    function r(n) {
      if (n) return u(n)
      f(r)
    }
    var u = s(t || i),
      f = et(n)
    r()
  }
  n.ensureAsync = et
  n.constant = t(function (n) {
    var t = [null].concat(n)
    return function (n) {
      return n.apply(this, t)
    }
  })
  n.wrapSync = n.asyncify = function (n) {
    return t(function (t) {
      var r = t.pop(),
        i
      try {
        i = n.apply(this, t)
      } catch (u) {
        return r(u)
      }
      bt(i) && typeof i.then == 'function'
        ? i
            .then(function (n) {
              r(null, n)
            })
            ['catch'](function (n) {
              r(n.message ? n : new Error(n))
            })
        : r(null, i)
    })
  }
  typeof module == 'object' && module.exports
    ? (module.exports = n)
    : typeof define == 'function' && define.amd
    ? define('async', function () {
        return n
      })
    : (l.async = n)
})(),
  (function (n) {
    'use strict'
    typeof define == 'function' && define.amd
      ? define('sha1', [], n)
      : (window.sha1 = n())
  })(function () {
    var n = function () {
      function t(n) {
        for (var i = '', t = 7; t >= 0; t--) i += e.charAt((n >> (t * 4)) & 15)
        return i
      }
      function o(n) {
        for (
          var r = ((n.length + 8) >> 6) + 1, i = new Array(r * 16), t = 0;
          t < r * 16;
          t++
        )
          i[t] = 0
        for (t = 0; t < n.length; t++)
          i[t >> 2] |= n.charCodeAt(t) << (24 - (t % 4) * 8)
        return (
          (i[t >> 2] |= 128 << (24 - (t % 4) * 8)),
          (i[r * 16 - 1] = n.length * 8),
          i
        )
      }
      function s(n) {
        for (
          var r = (n.length + 1) >> 1,
            u = ((r + 8) >> 6) + 1,
            i = new Array(u * 16),
            t = 0;
          t < u * 16;
          t++
        )
          i[t] = 0
        for (t = 0; t < r; t++)
          i[t >> 2] |= parseInt(n.substr(2 * t, 2), 16) << (24 - (t % 4) * 8)
        return (
          (i[t >> 2] |= 128 << (24 - (t % 4) * 8)), (i[u * 16 - 1] = r * 8), i
        )
      }
      function u(n, t, i) {
        for (
          var f = ((i + 8) >> 6) + 1, u = new Array(f * 16), r = 0;
          r < f * 16;
          r++
        )
          u[r] = 0
        for (r = 0; r < i; r++)
          u[r >> 2] |= (n[t + r] & 255) << (24 - (r % 4) * 8)
        return (
          (u[r >> 2] |= 128 << (24 - (r % 4) * 8)), (u[f * 16 - 1] = i * 8), u
        )
      }
      function n(n, t) {
        var i = (n & 65535) + (t & 65535),
          r = (n >> 16) + (t >> 16) + (i >> 16)
        return (r << 16) | (i & 65535)
      }
      function r(n, t) {
        return (n << t) | (n >>> (32 - t))
      }
      function h(n, t, i, r) {
        return n < 20
          ? (t & i) | (~t & r)
          : n < 40
          ? t ^ i ^ r
          : n < 60
          ? (t & i) | (t & r) | (i & r)
          : t ^ i ^ r
      }
      function c(n) {
        return n < 20
          ? 1518500249
          : n < 40
          ? 1859775393
          : n < 60
          ? -1894007588
          : -899497514
      }
      function l(n) {
        return i(o(n))
      }
      function a(n) {
        return i(s(n))
      }
      function v(n) {
        return i(u(n, 0, n.length))
      }
      function y(n, t, r) {
        return i(u(n, t, r))
      }
      function i(n) {
        var i = f(n)
        return t(i[0]) + t(i[1]) + t(i[2]) + t(i[3]) + t(i[4])
      }
      function f(t) {
        for (
          var i,
            v,
            s = new Array(80),
            u = 1732584193,
            f = -271733879,
            e = -1732584194,
            o = 271733878,
            l = -1009589776,
            a = 0;
          a < t.length;
          a += 16
        ) {
          var y = u,
            p = f,
            w = e,
            b = o,
            k = l
          for (i = 0; i < 80; i++)
            (s[i] =
              i < 16
                ? t[a + i]
                : r(s[i - 3] ^ s[i - 8] ^ s[i - 14] ^ s[i - 16], 1)),
              (v = n(n(r(u, 5), h(i, f, e, o)), n(n(l, s[i]), c(i)))),
              (l = o),
              (o = e),
              (e = r(f, 30)),
              (f = u),
              (u = v)
          u = n(u, y)
          f = n(f, p)
          e = n(e, w)
          o = n(o, b)
          l = n(l, k)
        }
        return [u, f, e, o, l]
      }
      var e = '0123456789abcdef'
      return { calcSHA1: l, calcSHA1Hex: a, calcSHA1BA: v, calcSHA1BAEx: y }
    }
    return n()
  }),
  (function (n) {
    'use strict'
    typeof define == 'function' && define.amd
      ? define('sjcl', [], n)
      : (window.sjcl = n())
  })(function () {
    function t(n) {
      throw n
    }
    function e(i, r, u) {
      4 !== r.length && t(new n.exception.invalid('invalid aes block size'))
      var f = i.a[u],
        o = r[0] ^ f[0],
        s = r[u ? 3 : 1] ^ f[1],
        h = r[2] ^ f[2]
      r = r[u ? 1 : 3] ^ f[3]
      var e,
        w,
        b,
        d = f.length / 4 - 2,
        c,
        l = 4,
        k = [0, 0, 0, 0]
      e = i.j[u]
      i = e[0]
      var a = e[1],
        v = e[2],
        y = e[3],
        p = e[4]
      for (c = 0; c < d; c++)
        (e =
          i[o >>> 24] ^
          a[(s >> 16) & 255] ^
          v[(h >> 8) & 255] ^
          y[r & 255] ^
          f[l]),
          (w =
            i[s >>> 24] ^
            a[(h >> 16) & 255] ^
            v[(r >> 8) & 255] ^
            y[o & 255] ^
            f[l + 1]),
          (b =
            i[h >>> 24] ^
            a[(r >> 16) & 255] ^
            v[(o >> 8) & 255] ^
            y[s & 255] ^
            f[l + 2]),
          (r =
            i[r >>> 24] ^
            a[(o >> 16) & 255] ^
            v[(s >> 8) & 255] ^
            y[h & 255] ^
            f[l + 3]),
          (l += 4),
          (o = e),
          (s = w),
          (h = b)
      for (c = 0; 4 > c; c++)
        (k[u ? 3 & -c : c] =
          (p[o >>> 24] << 24) ^
          (p[(s >> 16) & 255] << 16) ^
          (p[(h >> 8) & 255] << 8) ^
          p[r & 255] ^
          f[l++]),
          (e = o),
          (o = s),
          (s = h),
          (h = r),
          (r = e)
      return k
    }
    function o(n, t) {
      for (
        var r,
          o,
          s = t.slice(0),
          i = n.q,
          p = n.a,
          v = i[0],
          f = i[1],
          h = i[2],
          l = i[3],
          e = i[4],
          a = i[5],
          c = i[6],
          y = i[7],
          u = 0;
        64 > u;
        u++
      )
        16 > u
          ? (r = s[u])
          : ((r = s[(u + 1) & 15]),
            (o = s[(u + 14) & 15]),
            (r = s[u & 15] =
              (((r >>> 7) ^ (r >>> 18) ^ (r >>> 3) ^ (r << 25) ^ (r << 14)) +
                ((o >>> 17) ^ (o >>> 19) ^ (o >>> 10) ^ (o << 15) ^ (o << 13)) +
                s[u & 15] +
                s[(u + 9) & 15]) |
              0)),
          (r =
            r +
            y +
            ((e >>> 6) ^
              (e >>> 11) ^
              (e >>> 25) ^
              (e << 26) ^
              (e << 21) ^
              (e << 7)) +
            (c ^ (e & (a ^ c))) +
            p[u]),
          (y = c),
          (c = a),
          (a = e),
          (e = (l + r) | 0),
          (l = h),
          (h = f),
          (f = v),
          (v =
            (r +
              ((f & h) ^ (l & (f ^ h))) +
              ((f >>> 2) ^
                (f >>> 13) ^
                (f >>> 22) ^
                (f << 30) ^
                (f << 19) ^
                (f << 10))) |
            0)
      i[0] = (i[0] + v) | 0
      i[1] = (i[1] + f) | 0
      i[2] = (i[2] + h) | 0
      i[3] = (i[3] + l) | 0
      i[4] = (i[4] + e) | 0
      i[5] = (i[5] + a) | 0
      i[6] = (i[6] + c) | 0
      i[7] = (i[7] + y) | 0
    }
    function s(t, i) {
      var r,
        u = n.random.z[t],
        f = []
      for (r in u) u.hasOwnProperty(r) && f.push(u[r])
      for (r = 0; r < f.length; r++) f[r](i)
    }
    function h(t) {
      t.a = u(t).concat(u(t))
      t.A = new n.cipher.aes(t.a)
    }
    function u(n) {
      for (var t = 0; 4 > t && !((n.e[t] = (n.e[t] + 1) | 0), n.e[t]); t++);
      return n.A.encrypt(n.e)
    }
    var i = void 0,
      r = !1,
      n = {
        cipher: {},
        hash: {},
        keyexchange: {},
        mode: {},
        misc: {},
        codec: {},
        exception: {
          corrupt: function (n) {
            this.toString = function () {
              return 'CORRUPT: ' + this.message
            }
            this.message = n
          },
          invalid: function (n) {
            this.toString = function () {
              return 'INVALID: ' + this.message
            }
            this.message = n
          },
          bug: function (n) {
            this.toString = function () {
              return 'BUG: ' + this.message
            }
            this.message = n
          },
          notReady: function (n) {
            this.toString = function () {
              return 'NOT READY: ' + this.message
            }
            this.message = n
          },
        },
      },
      f
    'undefined' != typeof module && module.exports && (module.exports = n)
    n.cipher.aes = function (i) {
      var r, u, e, h, f, o, s
      for (
        this.j[0][0][0] || this.D(),
          f = this.j[0][4],
          o = this.j[1],
          r = i.length,
          s = 1,
          4 !== r &&
            6 !== r &&
            8 !== r &&
            t(new n.exception.invalid('invalid aes key size')),
          this.a = [(e = i.slice(0)), (h = [])],
          i = r;
        i < 4 * r + 28;
        i++
      )
        (u = e[i - 1]),
          (0 == i % r || (8 === r && 4 == i % r)) &&
            ((u =
              (f[u >>> 24] << 24) ^
              (f[(u >> 16) & 255] << 16) ^
              (f[(u >> 8) & 255] << 8) ^
              f[u & 255]),
            0 == i % r &&
              ((u = (u << 8) ^ (u >>> 24) ^ (s << 24)),
              (s = (s << 1) ^ (283 * (s >> 7))))),
          (e[i] = e[i - r] ^ u)
      for (r = 0; i; r++, i--)
        (u = e[r & 3 ? i : i - 4]),
          (h[r] =
            4 >= i || 4 > r
              ? u
              : o[0][f[u >>> 24]] ^
                o[1][f[(u >> 16) & 255]] ^
                o[2][f[(u >> 8) & 255]] ^
                o[3][f[u & 255]])
    }
    n.cipher.aes.prototype = {
      encrypt: function (n) {
        return e(this, n, 0)
      },
      decrypt: function (n) {
        return e(this, n, 1)
      },
      j: [
        [[], [], [], [], []],
        [[], [], [], [], []],
      ],
      D: function () {
        for (
          var e = this.j[0],
            o = this.j[1],
            c = e[4],
            a = o[4],
            i,
            r,
            f = [],
            l = [],
            h,
            u,
            t,
            s,
            n = 0;
          256 > n;
          n++
        )
          l[(f[n] = (n << 1) ^ (283 * (n >> 7))) ^ n] = n
        for (i = r = 0; !c[i]; i ^= h || 1, r = l[r] || 1)
          for (
            t = r ^ (r << 1) ^ (r << 2) ^ (r << 3) ^ (r << 4),
              t = (t >> 8) ^ (t & 255) ^ 99,
              c[i] = t,
              a[t] = i,
              u = f[(n = f[(h = f[i])])],
              s = (16843009 * u) ^ (65537 * n) ^ (257 * h) ^ (16843008 * i),
              u = (257 * f[t]) ^ (16843008 * t),
              n = 0;
            4 > n;
            n++
          )
            (e[n][i] = u = (u << 24) ^ (u >>> 8)),
              (o[n][t] = s = (s << 24) ^ (s >>> 8))
        for (n = 0; 5 > n; n++) (e[n] = e[n].slice(0)), (o[n] = o[n].slice(0))
      },
    }
    n.bitArray = {
      bitSlice: function (t, r, u) {
        return (
          (t = n.bitArray.O(t.slice(r / 32), 32 - (r & 31)).slice(1)),
          u === i ? t : n.bitArray.clamp(t, u - r)
        )
      },
      extract: function (n, t, i) {
        var r = Math.floor((-t - i) & 31)
        return (
          (((t + i - 1) ^ t) & -32
            ? (n[(t / 32) | 0] << (32 - r)) ^ (n[(t / 32 + 1) | 0] >>> r)
            : n[(t / 32) | 0] >>> r) &
          ((1 << i) - 1)
        )
      },
      concat: function (t, i) {
        if (0 === t.length || 0 === i.length) return t.concat(i)
        var r = t[t.length - 1],
          u = n.bitArray.getPartial(r)
        return 32 === u
          ? t.concat(i)
          : n.bitArray.O(i, u, r | 0, t.slice(0, t.length - 1))
      },
      bitLength: function (t) {
        var i = t.length
        return 0 === i ? 0 : 32 * (i - 1) + n.bitArray.getPartial(t[i - 1])
      },
      clamp: function (t, i) {
        if (32 * t.length < i) return t
        t = t.slice(0, Math.ceil(i / 32))
        var r = t.length
        return (
          (i &= 31),
          0 < r &&
            i &&
            (t[r - 1] = n.bitArray.partial(
              i,
              t[r - 1] & (2147483648 >> (i - 1)),
              1
            )),
          t
        )
      },
      partial: function (n, t, i) {
        return 32 === n ? t : (i ? t | 0 : t << (32 - n)) + 1099511627776 * n
      },
      getPartial: function (n) {
        return Math.round(n / 1099511627776) || 32
      },
      equal: function (t, i) {
        if (n.bitArray.bitLength(t) !== n.bitArray.bitLength(i)) return r
        for (var f = 0, u = 0; u < t.length; u++) f |= t[u] ^ i[u]
        return 0 === f
      },
      O: function (t, r, u, f) {
        var e
        for (e = 0, f === i && (f = []); 32 <= r; r -= 32) f.push(u), (u = 0)
        if (0 === r) return f.concat(t)
        for (e = 0; e < t.length; e++)
          f.push(u | (t[e] >>> r)), (u = t[e] << (32 - r))
        return (
          (e = t.length ? t[t.length - 1] : 0),
          (t = n.bitArray.getPartial(e)),
          f.push(n.bitArray.partial((r + t) & 31, 32 < r + t ? u : f.pop(), 1)),
          f
        )
      },
      k: function (n, t) {
        return [n[0] ^ t[0], n[1] ^ t[1], n[2] ^ t[2], n[3] ^ t[3]]
      },
    }
    n.codec.utf8String = {
      fromBits: function (t) {
        for (var u = '', f = n.bitArray.bitLength(t), r, i = 0; i < f / 8; i++)
          0 == (i & 3) && (r = t[i / 4]),
            (u += String.fromCharCode(r >>> 24)),
            (r <<= 8)
        return decodeURIComponent(escape(u))
      },
      toBits: function (t) {
        t = unescape(encodeURIComponent(t))
        for (var u = [], r = 0, i = 0; i < t.length; i++)
          (r = (r << 8) | t.charCodeAt(i)), 3 == (i & 3) && (u.push(r), (r = 0))
        return i & 3 && u.push(n.bitArray.partial(8 * (i & 3), r)), u
      },
    }
    n.codec.hex = {
      fromBits: function (t) {
        for (var r = '', i = 0; i < t.length; i++)
          r += ((t[i] | 0) + 0xf00000000000).toString(16).substr(4)
        return r.substr(0, n.bitArray.bitLength(t) / 4)
      },
      toBits: function (t) {
        var i,
          r = [],
          u
        for (
          t = t.replace(/\s|0x/g, ''), u = t.length, t += '00000000', i = 0;
          i < t.length;
          i += 8
        )
          r.push(parseInt(t.substr(i, 8), 16) ^ 0)
        return n.bitArray.clamp(r, 4 * u)
      },
    }
    n.codec.base64 = {
      I: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      fromBits: function (t, i, r) {
        var u = '',
          f = 0,
          e = n.codec.base64.I,
          o = 0,
          s = n.bitArray.bitLength(t)
        for (r && (e = e.substr(0, 62) + '-_'), r = 0; 6 * u.length < s; )
          (u += e.charAt((o ^ (t[r] >>> f)) >>> 26)),
            6 > f
              ? ((o = t[r] << (6 - f)), (f += 26), r++)
              : ((o <<= 6), (f -= 6))
        for (; u.length & 3 && !i; ) u += '='
        return u
      },
      toBits: function (i, r) {
        i = i.replace(/\s|=/g, '')
        var s = [],
          e,
          u = 0,
          h = n.codec.base64.I,
          o = 0,
          f
        for (r && (h = h.substr(0, 62) + '-_'), e = 0; e < i.length; e++)
          (f = h.indexOf(i.charAt(e))),
            0 > f && t(new n.exception.invalid("this isn't base64!")),
            26 < u
              ? ((u -= 26), s.push(o ^ (f >>> u)), (o = f << (32 - u)))
              : ((u += 6), (o ^= f << (32 - u)))
        return u & 56 && s.push(n.bitArray.partial(u & 56, o, 1)), s
      },
    }
    n.codec.base64url = {
      fromBits: function (t) {
        return n.codec.base64.fromBits(t, 1, 1)
      },
      toBits: function (t) {
        return n.codec.base64.toBits(t, 1)
      },
    }
    n.hash.sha256 = function (n) {
      this.a[0] || this.D()
      n
        ? ((this.q = n.q.slice(0)), (this.m = n.m.slice(0)), (this.g = n.g))
        : this.reset()
    }
    n.hash.sha256.hash = function (t) {
      return new n.hash.sha256().update(t).finalize()
    }
    n.hash.sha256.prototype = {
      blockSize: 512,
      reset: function () {
        return (this.q = this.M.slice(0)), (this.m = []), (this.g = 0), this
      },
      update: function (t) {
        'string' == typeof t && (t = n.codec.utf8String.toBits(t))
        var i,
          r = (this.m = n.bitArray.concat(this.m, t))
        for (
          i = this.g,
            t = this.g = i + n.bitArray.bitLength(t),
            i = (512 + i) & -512;
          i <= t;
          i += 512
        )
          o(this, r.splice(0, 16))
        return this
      },
      finalize: function () {
        for (
          var t = this.m,
            r = this.q,
            t = n.bitArray.concat(t, [n.bitArray.partial(1, 1)]),
            i = t.length + 2;
          i & 15;
          i++
        )
          t.push(0)
        for (
          t.push(Math.floor(this.g / 4294967296)), t.push(this.g | 0);
          t.length;

        )
          o(this, t.splice(0, 16))
        return this.reset(), r
      },
      M: [],
      a: [],
      D: function () {
        function r(n) {
          return (4294967296 * (n - Math.floor(n))) | 0
        }
        var n = 0,
          t = 2,
          i
        n: for (; 64 > n; t++) {
          for (i = 2; i * i <= t; i++) if (0 == t % i) continue n
          8 > n && (this.M[n] = r(Math.pow(t, 0.5)))
          this.a[n] = r(Math.pow(t, 1 / 3))
          n++
        }
      },
    }
    n.mode.ccm = {
      name: 'ccm',
      encrypt: function (i, r, u, f, e) {
        var o,
          s = r.slice(0),
          h = n.bitArray,
          c = h.bitLength(u) / 8,
          l = h.bitLength(s) / 8
        for (
          e = e || 64,
            f = f || [],
            7 > c &&
              t(new n.exception.invalid('ccm: iv must be at least 7 bytes')),
            o = 2;
          4 > o && l >>> (8 * o);
          o++
        );
        return (
          o < 15 - c && (o = 15 - c),
          (u = h.clamp(u, 8 * (15 - o))),
          (r = n.mode.ccm.K(i, r, u, f, e, o)),
          (s = n.mode.ccm.n(i, s, u, r, e, o)),
          h.concat(s.data, s.tag)
        )
      },
      decrypt: function (i, r, u, f, e) {
        e = e || 64
        f = f || []
        var o = n.bitArray,
          c = o.bitLength(u) / 8,
          h = o.bitLength(r),
          s = o.clamp(r, h - e),
          l = o.bitSlice(r, h - e),
          h = (h - e) / 8
        for (
          7 > c &&
            t(new n.exception.invalid('ccm: iv must be at least 7 bytes')),
            r = 2;
          4 > r && h >>> (8 * r);
          r++
        );
        return (
          r < 15 - c && (r = 15 - c),
          (u = o.clamp(u, 8 * (15 - r))),
          (s = n.mode.ccm.n(i, s, u, l, e, r)),
          (i = n.mode.ccm.K(i, s.data, u, f, e, r)),
          o.equal(s.tag, i) ||
            t(new n.exception.corrupt("ccm: tag doesn't match")),
          s.data
        )
      },
      K: function (i, r, u, f, e, o) {
        var h = [],
          s = n.bitArray,
          c = s.k
        if (
          ((e /= 8),
          (e % 2 || 4 > e || 16 < e) &&
            t(new n.exception.invalid('ccm: invalid tag length')),
          (4294967295 < f.length || 4294967295 < r.length) &&
            t(new n.exception.bug("ccm: can't deal with 4GiB or more data")),
          (o = [s.partial(8, (f.length ? 64 : 0) | ((e - 2) << 2) | (o - 1))]),
          (o = s.concat(o, u)),
          (o[3] |= s.bitLength(r) / 8),
          (o = i.encrypt(o)),
          f.length)
        )
          for (
            u = s.bitLength(f) / 8,
              65279 >= u
                ? (h = [s.partial(16, u)])
                : 4294967295 >= u &&
                  (h = s.concat([s.partial(16, 65534)], [u])),
              h = s.concat(h, f),
              f = 0;
            f < h.length;
            f += 4
          )
            o = i.encrypt(c(o, h.slice(f, f + 4).concat([0, 0, 0])))
        for (f = 0; f < r.length; f += 4)
          o = i.encrypt(c(o, r.slice(f, f + 4).concat([0, 0, 0])))
        return s.clamp(o, 8 * e)
      },
      n: function (t, i, r, u, f, e) {
        var o,
          s = n.bitArray,
          h,
          c
        if (
          ((o = s.k),
          (h = i.length),
          (c = s.bitLength(i)),
          (r = s
            .concat([s.partial(8, e - 1)], r)
            .concat([0, 0, 0])
            .slice(0, 4)),
          (u = s.bitSlice(o(u, t.encrypt(r)), 0, f)),
          !h)
        )
          return { tag: u, data: [] }
        for (o = 0; o < h; o += 4)
          r[3]++,
            (f = t.encrypt(r)),
            (i[o] ^= f[0]),
            (i[o + 1] ^= f[1]),
            (i[o + 2] ^= f[2]),
            (i[o + 3] ^= f[3])
        return { tag: u, data: s.clamp(i, c) }
      },
    }
    n.mode.ocb2 = {
      name: 'ocb2',
      encrypt: function (i, r, u, f, e, o) {
        var l, v
        128 !== n.bitArray.bitLength(u) &&
          t(new n.exception.invalid('ocb iv must be 128 bits'))
        var h,
          y = n.mode.ocb2.G,
          a = n.bitArray,
          s = a.k,
          c = [0, 0, 0, 0]
        for (
          u = y(i.encrypt(u)), v = [], f = f || [], e = e || 64, h = 0;
          h + 4 < r.length;
          h += 4
        )
          (l = r.slice(h, h + 4)),
            (c = s(c, l)),
            (v = v.concat(s(u, i.encrypt(s(u, l))))),
            (u = y(u))
        return (
          (l = r.slice(h)),
          (r = a.bitLength(l)),
          (h = i.encrypt(s(u, [0, 0, 0, r]))),
          (l = a.clamp(s(l.concat([0, 0, 0]), h), r)),
          (c = s(c, s(l.concat([0, 0, 0]), h))),
          (c = i.encrypt(s(c, s(u, y(u))))),
          f.length && (c = s(c, o ? f : n.mode.ocb2.pmac(i, f))),
          v.concat(a.concat(l, a.clamp(c, e)))
        )
      },
      decrypt: function (i, r, u, f, e, o) {
        128 !== n.bitArray.bitLength(u) &&
          t(new n.exception.invalid('ocb iv must be 128 bits'))
        e = e || 64
        var y = n.mode.ocb2.G,
          a = n.bitArray,
          s = a.k,
          h = [0, 0, 0, 0],
          l = y(i.encrypt(u)),
          c,
          v,
          p = n.bitArray.bitLength(r) - e,
          w = []
        for (f = f || [], u = 0; u + 4 < p / 32; u += 4)
          (c = s(l, i.decrypt(s(l, r.slice(u, u + 4))))),
            (h = s(h, c)),
            (w = w.concat(c)),
            (l = y(l))
        return (
          (v = p - 32 * u),
          (c = i.encrypt(s(l, [0, 0, 0, v]))),
          (c = s(c, a.clamp(r.slice(u), v).concat([0, 0, 0]))),
          (h = s(h, c)),
          (h = i.encrypt(s(h, s(l, y(l))))),
          f.length && (h = s(h, o ? f : n.mode.ocb2.pmac(i, f))),
          a.equal(a.clamp(h, e), a.bitSlice(r, p)) ||
            t(new n.exception.corrupt("ocb: tag doesn't match")),
          w.concat(a.clamp(c, v))
        )
      },
      pmac: function (t, i) {
        for (
          var e = n.mode.ocb2.G,
            s = n.bitArray,
            f = s.k,
            o = [0, 0, 0, 0],
            u = t.encrypt([0, 0, 0, 0]),
            u = f(u, e(e(u))),
            r = 0;
          r + 4 < i.length;
          r += 4
        )
          (u = e(u)), (o = f(o, t.encrypt(f(u, i.slice(r, r + 4)))))
        return (
          (r = i.slice(r)),
          128 > s.bitLength(r) &&
            ((u = f(u, e(u))), (r = s.concat(r, [-2147483648, 0, 0, 0]))),
          (o = f(o, r)),
          t.encrypt(f(e(f(u, e(u))), o))
        )
      },
      G: function (n) {
        return [
          (n[0] << 1) ^ (n[1] >>> 31),
          (n[1] << 1) ^ (n[2] >>> 31),
          (n[2] << 1) ^ (n[3] >>> 31),
          (n[3] << 1) ^ (135 * (n[0] >>> 31)),
        ]
      },
    }
    n.mode.gcm = {
      name: 'gcm',
      encrypt: function (t, i, r, u, f) {
        var e = i.slice(0)
        return (
          (i = n.bitArray),
          (u = u || []),
          (t = n.mode.gcm.n(!0, t, e, u, r, f || 128)),
          i.concat(t.data, t.tag)
        )
      },
      decrypt: function (i, u, f, e, o) {
        var s = u.slice(0),
          h = n.bitArray,
          c = h.bitLength(s)
        return (
          (o = o || 128),
          (e = e || []),
          o <= c
            ? ((u = h.bitSlice(s, c - o)), (s = h.bitSlice(s, 0, c - o)))
            : ((u = s), (s = [])),
          (i = n.mode.gcm.n(r, i, s, e, f, o)),
          h.equal(i.tag, u) ||
            t(new n.exception.corrupt("gcm: tag doesn't match")),
          i.data
        )
      },
      U: function (t, i) {
        var f,
          u,
          e,
          r,
          o,
          s = n.bitArray.k
        for (e = [0, 0, 0, 0], r = i.slice(0), f = 0; 128 > f; f++) {
          for (
            (u = 0 != (t[Math.floor(f / 32)] & (1 << (31 - (f % 32))))) &&
              (e = s(e, r)),
              o = 0 != (r[3] & 1),
              u = 3;
            0 < u;
            u--
          )
            r[u] = (r[u] >>> 1) | ((r[u - 1] & 1) << 31)
          r[0] >>>= 1
          o && (r[0] ^= -520093696)
        }
        return e
      },
      f: function (t, i, r) {
        var u,
          f = r.length
        for (i = i.slice(0), u = 0; u < f; u += 4)
          (i[0] ^= 4294967295 & r[u]),
            (i[1] ^= 4294967295 & r[u + 1]),
            (i[2] ^= 4294967295 & r[u + 2]),
            (i[3] ^= 4294967295 & r[u + 3]),
            (i = n.mode.gcm.U(i, t))
        return i
      },
      n: function (t, i, r, u, f, e) {
        var h,
          s,
          o,
          c,
          v,
          p,
          a,
          y,
          l = n.bitArray
        for (
          p = r.length,
            a = l.bitLength(r),
            y = l.bitLength(u),
            s = l.bitLength(f),
            h = i.encrypt([0, 0, 0, 0]),
            96 === s
              ? ((f = f.slice(0)), (f = l.concat(f, [1])))
              : ((f = n.mode.gcm.f(h, [0, 0, 0, 0], f)),
                (f = n.mode.gcm.f(h, f, [
                  0,
                  0,
                  Math.floor(s / 4294967296),
                  s & 4294967295,
                ]))),
            s = n.mode.gcm.f(h, [0, 0, 0, 0], u),
            v = f.slice(0),
            u = s.slice(0),
            t || (u = n.mode.gcm.f(h, s, r)),
            c = 0;
          c < p;
          c += 4
        )
          v[3]++,
            (o = i.encrypt(v)),
            (r[c] ^= o[0]),
            (r[c + 1] ^= o[1]),
            (r[c + 2] ^= o[2]),
            (r[c + 3] ^= o[3])
        return (
          (r = l.clamp(r, a)),
          t && (u = n.mode.gcm.f(h, s, r)),
          (t = [
            Math.floor(y / 4294967296),
            y & 4294967295,
            Math.floor(a / 4294967296),
            a & 4294967295,
          ]),
          (u = n.mode.gcm.f(h, u, t)),
          (o = i.encrypt(f)),
          (u[0] ^= o[0]),
          (u[1] ^= o[1]),
          (u[2] ^= o[2]),
          (u[3] ^= o[3]),
          { tag: l.bitSlice(u, 0, e), data: r }
        )
      },
    }
    n.misc.hmac = function (t, i) {
      this.L = i = i || n.hash.sha256
      var u = [[], []],
        r,
        f = i.prototype.blockSize / 32
      for (
        this.o = [new i(), new i()], t.length > f && (t = i.hash(t)), r = 0;
        r < f;
        r++
      )
        (u[0][r] = t[r] ^ 909522486), (u[1][r] = t[r] ^ 1549556828)
      this.o[0].update(u[0])
      this.o[1].update(u[1])
    }
    n.misc.hmac.prototype.encrypt = n.misc.hmac.prototype.mac = function (n) {
      return (
        (n = new this.L(this.o[0]).update(n).finalize()),
        new this.L(this.o[1]).update(n).finalize()
      )
    }
    n.misc.pbkdf2 = function (i, r, u, f, e) {
      u = u || 1e3
      ;(0 > f || 0 > u) && t(n.exception.invalid('invalid params to pbkdf2'))
      'string' == typeof i && (i = n.codec.utf8String.toBits(i))
      e = e || n.misc.hmac
      i = new e(i)
      for (
        var s, c, h, o = [], a = n.bitArray, l = 1;
        32 * o.length < (f || 1);
        l++
      ) {
        for (e = s = i.encrypt(a.concat(r, [l])), c = 1; c < u; c++)
          for (s = i.encrypt(s), h = 0; h < s.length; h++) e[h] ^= s[h]
        o = o.concat(e)
      }
      return f && (o = a.clamp(o, f)), o
    }
    n.prng = function (t) {
      this.b = [new n.hash.sha256()]
      this.h = [0]
      this.F = 0
      this.t = {}
      this.C = 0
      this.J = {}
      this.N = this.c = this.i = this.T = 0
      this.a = [0, 0, 0, 0, 0, 0, 0, 0]
      this.e = [0, 0, 0, 0]
      this.A = i
      this.B = t
      this.p = r
      this.z = { progress: {}, seeded: {} }
      this.l = this.S = 0
      this.u = 1
      this.w = 2
      this.Q = 65536
      this.H = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024]
      this.R = 3e4
      this.P = 80
    }
    n.prng.prototype = {
      randomWords: function (i, r) {
        var c = [],
          f,
          e,
          s,
          o
        if (
          ((f = this.isReady(r)),
          f === this.l && t(new n.exception.notReady("generator isn't seeded")),
          f & this.w)
        ) {
          for (
            f = !(f & this.u),
              e = [],
              s = 0,
              this.N = e[0] = new Date().valueOf() + this.R,
              o = 0;
            16 > o;
            o++
          )
            e.push((4294967296 * Math.random()) | 0)
          for (
            o = 0;
            o < this.b.length &&
            !((e = e.concat(this.b[o].finalize())),
            (s += this.h[o]),
            (this.h[o] = 0),
            !f && this.F & (1 << o));
            o++
          );
          for (
            this.F >= 1 << this.b.length &&
              (this.b.push(new n.hash.sha256()), this.h.push(0)),
              this.c -= s,
              s > this.i && (this.i = s),
              this.F++,
              this.a = n.hash.sha256.hash(this.a.concat(e)),
              this.A = new n.cipher.aes(this.a),
              f = 0;
            4 > f && !((this.e[f] = (this.e[f] + 1) | 0), this.e[f]);
            f++
          );
        }
        for (f = 0; f < i; f += 4)
          0 == (f + 1) % this.Q && h(this),
            (e = u(this)),
            c.push(e[0], e[1], e[2], e[3])
        return h(this), c.slice(0, i)
      },
      setDefaultParanoia: function (n) {
        this.B = n
      },
      addEntropy: function (r, u, f) {
        f = f || 'user'
        var o,
          h,
          l = new Date().valueOf(),
          e = this.t[f],
          a = this.isReady(),
          c = 0
        o = this.J[f]
        o === i && (o = this.J[f] = this.T++)
        e === i && (e = this.t[f] = 0)
        this.t[f] = (this.t[f] + 1) % this.b.length
        switch (typeof r) {
          case 'number':
            u === i && (u = 1)
            this.b[e].update([o, this.C++, 1, u, l, 1, r | 0])
            break
          case 'object':
            if (
              ((f = Object.prototype.toString.call(r)),
              '[object Uint32Array]' === f)
            ) {
              for (h = [], f = 0; f < r.length; f++) h.push(r[f])
              r = h
            } else
              for (
                '[object Array]' !== f && (c = 1), f = 0;
                f < r.length && !c;
                f++
              )
                'number' != typeof r[f] && (c = 1)
            if (!c) {
              if (u === i)
                for (f = u = 0; f < r.length; f++)
                  for (h = r[f]; 0 < h; ) u++, (h >>>= 1)
              this.b[e].update([o, this.C++, 2, u, l, r.length].concat(r))
            }
            break
          case 'string':
            u === i && (u = r.length)
            this.b[e].update([o, this.C++, 3, u, l, r.length])
            this.b[e].update(r)
            break
          default:
            c = 1
        }
        c &&
          t(
            new n.exception.bug(
              'random: addEntropy only supports number, array of numbers or string'
            )
          )
        this.h[e] += u
        this.c += u
        a === this.l &&
          (this.isReady() !== this.l && s('seeded', Math.max(this.i, this.c)),
          s('progress', this.getProgress()))
      },
      isReady: function (n) {
        return (
          (n = this.H[n !== i ? n : this.B]),
          this.i && this.i >= n
            ? this.h[0] > this.P && new Date().valueOf() > this.N
              ? this.w | this.u
              : this.u
            : this.c >= n
            ? this.w | this.l
            : this.l
        )
      },
      getProgress: function (n) {
        return (
          (n = this.H[n ? n : this.B]),
          this.i >= n ? 1 : this.c > n ? 1 : this.c / n
        )
      },
      startCollectors: function () {
        this.p ||
          (window.addEventListener
            ? (window.addEventListener('load', this.r, r),
              window.addEventListener('mousemove', this.s, r))
            : document.attachEvent
            ? (document.attachEvent('onload', this.r),
              document.attachEvent('onmousemove', this.s))
            : t(new n.exception.bug("can't attach event")),
          (this.p = !0))
      },
      stopCollectors: function () {
        this.p &&
          (window.removeEventListener
            ? (window.removeEventListener('load', this.r, r),
              window.removeEventListener('mousemove', this.s, r))
            : window.detachEvent &&
              (window.detachEvent('onload', this.r),
              window.detachEvent('onmousemove', this.s)),
          (this.p = r))
      },
      addEventListener: function (n, t) {
        this.z[n][this.S++] = t
      },
      removeEventListener: function (n, t) {
        var r,
          i,
          u = this.z[n],
          f = []
        for (i in u) u.hasOwnProperty(i) && u[i] === t && f.push(i)
        for (r = 0; r < f.length; r++) (i = f[r]), delete u[i]
      },
      s: function (t) {
        n.random.addEntropy(
          [
            t.x || t.clientX || t.offsetX || 0,
            t.y || t.clientY || t.offsetY || 0,
          ],
          2,
          'mouse'
        )
      },
      r: function () {
        n.random.addEntropy(new Date().valueOf(), 2, 'loadtime')
      },
    }
    n.random = new n.prng(6)
    try {
      f = new Uint32Array(32)
      crypto.getRandomValues(f)
      n.random.addEntropy(f, 1024, "crypto['getRandomValues']")
    } catch (c) {}
    return (
      (n.json = {
        defaults: {
          v: 1,
          iter: 1e3,
          ks: 128,
          ts: 64,
          mode: 'ccm',
          adata: '',
          cipher: 'aes',
        },
        encrypt: function (i, r, u, f) {
          u = u || {}
          f = f || {}
          var s = n.json,
            e = s.d({ iv: n.random.randomWords(4, 0) }, s.defaults),
            o
          return (
            s.d(e, u),
            (u = e.adata),
            'string' == typeof e.salt &&
              (e.salt = n.codec.base64.toBits(e.salt)),
            'string' == typeof e.iv && (e.iv = n.codec.base64.toBits(e.iv)),
            (!n.mode[e.mode] ||
              !n.cipher[e.cipher] ||
              ('string' == typeof i && 100 >= e.iter) ||
              (64 !== e.ts && 96 !== e.ts && 128 !== e.ts) ||
              (128 !== e.ks && 192 !== e.ks && 256 !== e.ks) ||
              2 > e.iv.length ||
              4 < e.iv.length) &&
              t(new n.exception.invalid('json encrypt: invalid parameters')),
            'string' == typeof i
              ? ((o = n.misc.cachedPbkdf2(i, e)),
                (i = o.key.slice(0, e.ks / 32)),
                (e.salt = o.salt))
              : n.ecc &&
                i instanceof n.ecc.elGamal.publicKey &&
                ((o = i.kem()),
                (e.kemtag = o.tag),
                (i = o.key.slice(0, e.ks / 32))),
            'string' == typeof r && (r = n.codec.utf8String.toBits(r)),
            'string' == typeof u && (u = n.codec.utf8String.toBits(u)),
            (o = new n.cipher[e.cipher](i)),
            s.d(f, e),
            (f.key = i),
            (e.ct = n.mode[e.mode].encrypt(o, r, e.iv, u, e.ts)),
            s.encode(e)
          )
        },
        decrypt: function (i, r, u, f) {
          var e, o
          return (
            (u = u || {}),
            (f = f || {}),
            (e = n.json),
            (r = e.d(e.d(e.d({}, e.defaults), e.decode(r)), u, !0)),
            (u = r.adata),
            'string' == typeof r.salt &&
              (r.salt = n.codec.base64.toBits(r.salt)),
            'string' == typeof r.iv && (r.iv = n.codec.base64.toBits(r.iv)),
            (!n.mode[r.mode] ||
              !n.cipher[r.cipher] ||
              ('string' == typeof i && 100 >= r.iter) ||
              (64 !== r.ts && 96 !== r.ts && 128 !== r.ts) ||
              (128 !== r.ks && 192 !== r.ks && 256 !== r.ks) ||
              !r.iv ||
              2 > r.iv.length ||
              4 < r.iv.length) &&
              t(new n.exception.invalid('json decrypt: invalid parameters')),
            'string' == typeof i
              ? ((o = n.misc.cachedPbkdf2(i, r)),
                (i = o.key.slice(0, r.ks / 32)),
                (r.salt = o.salt))
              : n.ecc &&
                i instanceof n.ecc.elGamal.secretKey &&
                (i = i
                  .unkem(n.codec.base64.toBits(r.kemtag))
                  .slice(0, r.ks / 32)),
            'string' == typeof u && (u = n.codec.utf8String.toBits(u)),
            (o = new n.cipher[r.cipher](i)),
            (u = n.mode[r.mode].decrypt(o, r.ct, r.iv, u, r.ts)),
            e.d(f, r),
            (f.key = i),
            n.codec.utf8String.fromBits(u)
          )
        },
        encode: function (i) {
          var r,
            u = '{',
            f = ''
          for (r in i)
            if (i.hasOwnProperty(r))
              switch (
                (r.match(/^[a-z0-9]+$/i) ||
                  t(
                    new n.exception.invalid(
                      'json encode: invalid property name'
                    )
                  ),
                (u += f + '"' + r + '":'),
                (f = ','),
                typeof i[r])
              ) {
                case 'number':
                case 'boolean':
                  u += i[r]
                  break
                case 'string':
                  u += '"' + escape(i[r]) + '"'
                  break
                case 'object':
                  u += '"' + n.codec.base64.fromBits(i[r], 0) + '"'
                  break
                default:
                  t(new n.exception.bug('json encode: unsupported type'))
              }
          return u + '}'
        },
        decode: function (i) {
          i = i.replace(/\s/g, '')
          i.match(/^\{.*\}$/) ||
            t(new n.exception.invalid("json decode: this isn't json!"))
          i = i.replace(/^\{|\}$/g, '').split(/,/)
          for (var f = {}, r, u = 0; u < i.length; u++)
            (r = i[u].match(
              /^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i
            )) || t(new n.exception.invalid("json decode: this isn't json!")),
              (f[r[2]] = r[3]
                ? parseInt(r[3], 10)
                : r[2].match(/^(ct|salt|iv)$/)
                ? n.codec.base64.toBits(r[4])
                : unescape(r[4]))
          return f
        },
        d: function (r, u, f) {
          if ((r === i && (r = {}), u === i)) return r
          for (var e in u)
            u.hasOwnProperty(e) &&
              (f &&
                r[e] !== i &&
                r[e] !== u[e] &&
                t(new n.exception.invalid('required parameter overridden')),
              (r[e] = u[e]))
          return r
        },
        X: function (n, t) {
          var r = {}
          for (var i in n) n.hasOwnProperty(i) && n[i] !== t[i] && (r[i] = n[i])
          return r
        },
        W: function (n, t) {
          for (var u = {}, r = 0; r < t.length; r++)
            n[t[r]] !== i && (u[t[r]] = n[t[r]])
          return u
        },
      }),
      (n.encrypt = n.json.encrypt),
      (n.decrypt = n.json.decrypt),
      (n.misc.V = {}),
      (n.misc.cachedPbkdf2 = function (t, r) {
        var u = n.misc.V,
          f
        return (
          (r = r || {}),
          (f = r.iter || 1e3),
          (u = u[t] = u[t] || {}),
          (f = u[f] =
            u[f] || {
              firstSalt:
                r.salt && r.salt.length
                  ? r.salt.slice(0)
                  : n.random.randomWords(2, 0),
            }),
          (u = r.salt === i ? f.firstSalt : r.salt),
          (f[u] = f[u] || n.misc.pbkdf2(t, u, r.iter)),
          { key: f[u].slice(0), salt: u.slice(0) }
        )
      }),
      n
    )
  }),
  (function (n) {
    'use strict'
    typeof define == 'function' && define.amd
      ? define('BigInteger', [], n)
      : (window.BigInteger = n())
  })(function () {
    function n(n, t, i) {
      n != null &&
        ('number' == typeof n
          ? this.fromNumber(n, t, i)
          : t == null && 'string' != typeof n
          ? this.fromString(n, 256)
          : this.fromString(n, t))
    }
    function t() {
      return new n(null)
    }
    function it(n, t, i, r, u, f) {
      while (--f >= 0) {
        var e = t * this[n++] + i[r] + u
        u = Math.floor(e / 67108864)
        i[r++] = e & 67108863
      }
      return u
    }
    function rt(n, t, i, r, u, f) {
      for (var o = t & 32767, s = t >> 15; --f >= 0; ) {
        var e = this[n] & 32767,
          h = this[n++] >> 15,
          c = s * e + h * o
        e = o * e + ((c & 32767) << 15) + i[r] + (u & 1073741823)
        u = (e >>> 30) + (c >>> 15) + s * h + (u >>> 30)
        i[r++] = e & 1073741823
      }
      return u
    }
    function ut(n, t, i, r, u, f) {
      for (var o = t & 16383, s = t >> 14; --f >= 0; ) {
        var e = this[n] & 16383,
          h = this[n++] >> 14,
          c = s * e + h * o
        e = o * e + ((c & 16383) << 14) + i[r] + u
        u = (e >> 28) + (c >> 14) + s * h
        i[r++] = e & 268435455
      }
      return u
    }
    function b(n) {
      return w.charAt(n)
    }
    function k(n, t) {
      var i = c[n.charCodeAt(t)]
      return i == null ? -1 : i
    }
    function ft(n) {
      for (var t = this.t - 1; t >= 0; --t) n[t] = this[t]
      n.t = this.t
      n.s = this.s
    }
    function et(n) {
      this.t = 1
      this.s = n < 0 ? -1 : 0
      n > 0 ? (this[0] = n) : n < -1 ? (this[0] = n + DV) : (this.t = 0)
    }
    function f(n) {
      var i = t()
      return i.fromInt(n), i
    }
    function ot(t, i) {
      var u, f
      if (i == 16) u = 4
      else if (i == 8) u = 3
      else if (i == 256) u = 8
      else if (i == 2) u = 1
      else if (i == 32) u = 5
      else if (i == 4) u = 2
      else {
        this.fromRadix(t, i)
        return
      }
      this.t = 0
      this.s = 0
      for (var e = t.length, o = !1, r = 0; --e >= 0; ) {
        if (((f = u == 8 ? t[e] & 255 : k(t, e)), f < 0)) {
          t.charAt(e) == '-' && (o = !0)
          continue
        }
        o = !1
        r == 0
          ? (this[this.t++] = f)
          : r + u > this.DB
          ? ((this[this.t - 1] |= (f & ((1 << (this.DB - r)) - 1)) << r),
            (this[this.t++] = f >> (this.DB - r)))
          : (this[this.t - 1] |= f << r)
        r += u
        r >= this.DB && (r -= this.DB)
      }
      u == 8 &&
        (t[0] & 128) != 0 &&
        ((this.s = -1),
        r > 0 && (this[this.t - 1] |= ((1 << (this.DB - r)) - 1) << r))
      this.clamp()
      o && n.ZERO.subTo(this, this)
    }
    function st() {
      for (var n = this.s & this.DM; this.t > 0 && this[this.t - 1] == n; )
        --this.t
    }
    function ht(n) {
      var t
      if (this.s < 0) return '-' + this.negate().toString(n)
      if (n == 16) t = 4
      else if (n == 8) t = 3
      else if (n == 2) t = 1
      else if (n == 32) t = 5
      else if (n == 4) t = 2
      else return this.toRadix(n)
      var o = (1 << t) - 1,
        u,
        f = !1,
        e = '',
        r = this.t,
        i = this.DB - ((r * this.DB) % t)
      if (r-- > 0)
        for (
          i < this.DB && (u = this[r] >> i) > 0 && ((f = !0), (e = b(u)));
          r >= 0;

        )
          i < t
            ? (u =
                ((this[r] & ((1 << i) - 1)) << (t - i)) |
                (this[--r] >> (i += this.DB - t)))
            : ((u = (this[r] >> (i -= t)) & o),
              i <= 0 && ((i += this.DB), --r)),
            u > 0 && (f = !0),
            f && (e += b(u))
      return f ? e : '0'
    }
    function ct() {
      var i = t()
      return n.ZERO.subTo(this, i), i
    }
    function lt() {
      return this.s < 0 ? this.negate() : this
    }
    function at(n) {
      var t = this.s - n.s,
        i
      if (t != 0) return t
      if (((i = this.t), (t = i - n.t), t != 0)) return this.s < 0 ? -t : t
      while (--i >= 0) if ((t = this[i] - n[i]) != 0) return t
      return 0
    }
    function v(n) {
      var i = 1,
        t
      return (
        (t = n >>> 16) != 0 && ((n = t), (i += 16)),
        (t = n >> 8) != 0 && ((n = t), (i += 8)),
        (t = n >> 4) != 0 && ((n = t), (i += 4)),
        (t = n >> 2) != 0 && ((n = t), (i += 2)),
        (t = n >> 1) != 0 && ((n = t), (i += 1)),
        i
      )
    }
    function vt() {
      return this.t <= 0
        ? 0
        : this.DB * (this.t - 1) + v(this[this.t - 1] ^ (this.s & this.DM))
    }
    function yt(n, t) {
      for (var i = this.t - 1; i >= 0; --i) t[i + n] = this[i]
      for (i = n - 1; i >= 0; --i) t[i] = 0
      t.t = this.t + n
      t.s = this.s
    }
    function pt(n, t) {
      for (var i = n; i < this.t; ++i) t[i - n] = this[i]
      t.t = Math.max(this.t - n, 0)
      t.s = this.s
    }
    function wt(n, t) {
      for (
        var u = n % this.DB,
          e = this.DB - u,
          o = (1 << e) - 1,
          r = Math.floor(n / this.DB),
          f = (this.s << u) & this.DM,
          i = this.t - 1;
        i >= 0;
        --i
      )
        (t[i + r + 1] = (this[i] >> e) | f), (f = (this[i] & o) << u)
      for (i = r - 1; i >= 0; --i) t[i] = 0
      t[r] = f
      t.t = this.t + r + 1
      t.s = this.s
      t.clamp()
    }
    function bt(n, t) {
      var i, r
      if (((t.s = this.s), (i = Math.floor(n / this.DB)), i >= this.t)) {
        t.t = 0
        return
      }
      var u = n % this.DB,
        f = this.DB - u,
        e = (1 << u) - 1
      for (t[0] = this[i] >> u, r = i + 1; r < this.t; ++r)
        (t[r - i - 1] |= (this[r] & e) << f), (t[r - i] = this[r] >> u)
      u > 0 && (t[this.t - i - 1] |= (this.s & e) << f)
      t.t = this.t - i
      t.clamp()
    }
    function kt(n, t) {
      for (var r = 0, i = 0, u = Math.min(n.t, this.t); r < u; )
        (i += this[r] - n[r]), (t[r++] = i & this.DM), (i >>= this.DB)
      if (n.t < this.t) {
        for (i -= n.s; r < this.t; )
          (i += this[r]), (t[r++] = i & this.DM), (i >>= this.DB)
        i += this.s
      } else {
        for (i += this.s; r < n.t; )
          (i -= n[r]), (t[r++] = i & this.DM), (i >>= this.DB)
        i -= n.s
      }
      t.s = i < 0 ? -1 : 0
      i < -1 ? (t[r++] = this.DV + i) : i > 0 && (t[r++] = i)
      t.t = r
      t.clamp()
    }
    function dt(t, i) {
      var u = this.abs(),
        f = t.abs(),
        r = u.t
      for (i.t = r + f.t; --r >= 0; ) i[r] = 0
      for (r = 0; r < f.t; ++r) i[r + u.t] = u.am(0, f[r], i, r, 0, u.t)
      i.s = 0
      i.clamp()
      this.s != t.s && n.ZERO.subTo(i, i)
    }
    function gt(n) {
      for (var i = this.abs(), t = (n.t = 2 * i.t), r; --t >= 0; ) n[t] = 0
      for (t = 0; t < i.t - 1; ++t)
        (r = i.am(t, i[t], n, 2 * t, 0, 1)),
          (n[t + i.t] += i.am(t + 1, 2 * i[t], n, 2 * t + 1, r, i.t - t - 1)) >=
            i.DV && ((n[t + i.t] -= i.DV), (n[t + i.t + 1] = 1))
      n.t > 0 && (n[n.t - 1] += i.am(t, i[t], n, 2 * t, 0, 1))
      n.s = 0
      n.clamp()
    }
    function ni(i, r, u) {
      var s = i.abs(),
        l,
        e,
        a,
        p
      if (!(s.t <= 0)) {
        if (((l = this.abs()), l.t < s.t)) {
          r != null && r.fromInt(0)
          u != null && this.copyTo(u)
          return
        }
        u == null && (u = t())
        var f = t(),
          w = this.s,
          k = i.s,
          c = this.DB - v(s[s.t - 1])
        if (
          (c > 0
            ? (s.lShiftTo(c, f), l.lShiftTo(c, u))
            : (s.copyTo(f), l.copyTo(u)),
          (e = f.t),
          (a = f[e - 1]),
          a != 0)
        ) {
          var b = a * (1 << this.F1) + (e > 1 ? f[e - 2] >> this.F2 : 0),
            d = this.FV / b,
            g = (1 << this.F1) / b,
            nt = 1 << this.F2,
            h = u.t,
            y = h - e,
            o = r == null ? t() : r
          for (
            f.dlShiftTo(y, o),
              u.compareTo(o) >= 0 && ((u[u.t++] = 1), u.subTo(o, u)),
              n.ONE.dlShiftTo(e, o),
              o.subTo(f, f);
            f.t < e;

          )
            f[f.t++] = 0
          while (--y >= 0)
            if (
              ((p =
                u[--h] == a
                  ? this.DM
                  : Math.floor(u[h] * d + (u[h - 1] + nt) * g)),
              (u[h] += f.am(0, p, u, y, 0, e)) < p)
            )
              for (f.dlShiftTo(y, o), u.subTo(o, u); u[h] < --p; ) u.subTo(o, u)
          r != null && (u.drShiftTo(e, r), w != k && n.ZERO.subTo(r, r))
          u.t = e
          u.clamp()
          c > 0 && u.rShiftTo(c, u)
          w < 0 && n.ZERO.subTo(u, u)
        }
      }
    }
    function ti(i) {
      var r = t()
      return (
        this.abs().divRemTo(i, null, r),
        this.s < 0 && r.compareTo(n.ZERO) > 0 && i.subTo(r, r),
        r
      )
    }
    function e(n) {
      this.m = n
    }
    function ii(n) {
      return n.s < 0 || n.compareTo(this.m) >= 0 ? n.mod(this.m) : n
    }
    function ri(n) {
      return n
    }
    function ui(n) {
      n.divRemTo(this.m, null, n)
    }
    function fi(n, t, i) {
      n.multiplyTo(t, i)
      this.reduce(i)
    }
    function ei(n, t) {
      n.squareTo(t)
      this.reduce(t)
    }
    function oi() {
      var t, n
      return this.t < 1
        ? 0
        : ((t = this[0]), (t & 1) == 0)
        ? 0
        : ((n = t & 3),
          (n = (n * (2 - (t & 15) * n)) & 15),
          (n = (n * (2 - (t & 255) * n)) & 255),
          (n = (n * (2 - (((t & 65535) * n) & 65535))) & 65535),
          (n = (n * (2 - ((t * n) % this.DV))) % this.DV),
          n > 0 ? this.DV - n : -n)
    }
    function o(n) {
      this.m = n
      this.mp = n.invDigit()
      this.mpl = this.mp & 32767
      this.mph = this.mp >> 15
      this.um = (1 << (n.DB - 15)) - 1
      this.mt2 = 2 * n.t
    }
    function si(i) {
      var r = t()
      return (
        i.abs().dlShiftTo(this.m.t, r),
        r.divRemTo(this.m, null, r),
        i.s < 0 && r.compareTo(n.ZERO) > 0 && this.m.subTo(r, r),
        r
      )
    }
    function hi(n) {
      var i = t()
      return n.copyTo(i), this.reduce(i), i
    }
    function ci(n) {
      for (var i, t, r; n.t <= this.mt2; ) n[n.t++] = 0
      for (i = 0; i < this.m.t; ++i)
        for (
          t = n[i] & 32767,
            r =
              (t * this.mpl +
                (((t * this.mph + (n[i] >> 15) * this.mpl) & this.um) << 15)) &
              n.DM,
            t = i + this.m.t,
            n[t] += this.m.am(0, r, n, i, 0, this.m.t);
          n[t] >= n.DV;

        )
          (n[t] -= n.DV), n[++t]++
      n.clamp()
      n.drShiftTo(this.m.t, n)
      n.compareTo(this.m) >= 0 && n.subTo(this.m, n)
    }
    function li(n, t) {
      n.squareTo(t)
      this.reduce(t)
    }
    function ai(n, t, i) {
      n.multiplyTo(t, i)
      this.reduce(i)
    }
    function vi() {
      return (this.t > 0 ? this[0] & 1 : this.s) == 0
    }
    function yi(i, r) {
      var s
      if (i > 4294967295 || i < 1) return n.ONE
      var u = t(),
        f = t(),
        e = r.convert(this),
        o = v(i) - 1
      for (e.copyTo(u); --o >= 0; )
        r.sqrTo(u, f),
          (i & (1 << o)) > 0 ? r.mulTo(f, e, u) : ((s = u), (u = f), (f = s))
      return r.revert(u)
    }
    function pi(n, t) {
      var i
      return (i = n < 256 || t.isEven() ? new e(t) : new o(t)), this.exp(n, i)
    }
    function wi() {
      var n = t()
      return this.copyTo(n), n
    }
    function bi() {
      if (this.s < 0) {
        if (this.t == 1) return this[0] - this.DV
        if (this.t == 0) return -1
      } else {
        if (this.t == 1) return this[0]
        if (this.t == 0) return 0
      }
      return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0]
    }
    function ki() {
      return this.t == 0 ? this.s : (this[0] << 24) >> 24
    }
    function di() {
      return this.t == 0 ? this.s : (this[0] << 16) >> 16
    }
    function gi(n) {
      return Math.floor((Math.LN2 * this.DB) / Math.log(n))
    }
    function nr() {
      return this.s < 0
        ? -1
        : this.t <= 0 || (this.t == 1 && this[0] <= 0)
        ? 0
        : 1
    }
    function tr(n) {
      if ((n == null && (n = 10), this.signum() == 0 || n < 2 || n > 36))
        return '0'
      var s = this.chunkSize(n),
        e = Math.pow(n, s),
        o = f(e),
        i = t(),
        r = t(),
        u = ''
      for (this.divRemTo(o, i, r); i.signum() > 0; )
        (u = (e + r.intValue()).toString(n).substr(1) + u), i.divRemTo(o, i, r)
      return r.intValue().toString(n) + u
    }
    function ir(t, i) {
      var u, e
      this.fromInt(0)
      i == null && (i = 10)
      var o = this.chunkSize(i),
        h = Math.pow(i, o),
        s = !1,
        f = 0,
        r = 0
      for (u = 0; u < t.length; ++u) {
        if (((e = k(t, u)), e < 0)) {
          t.charAt(u) == '-' && this.signum() == 0 && (s = !0)
          continue
        }
        r = i * r + e
        ++f >= o && (this.dMultiply(h), this.dAddOffset(r, 0), (f = 0), (r = 0))
      }
      f > 0 && (this.dMultiply(Math.pow(i, f)), this.dAddOffset(r, 0))
      s && n.ZERO.subTo(this, this)
    }
    function rr(t, i, r) {
      if ('number' == typeof i)
        if (t < 2) this.fromInt(1)
        else
          for (
            this.fromNumber(t, r),
              this.testBit(t - 1) ||
                this.bitwiseTo(n.ONE.shiftLeft(t - 1), y, this),
              this.isEven() && this.dAddOffset(1, 0);
            !this.isProbablePrime(i);

          )
            this.dAddOffset(2, 0),
              this.bitLength() > t && this.subTo(n.ONE.shiftLeft(t - 1), this)
      else {
        var u = [],
          f = t & 7
        u.length = (t >> 3) + 1
        i.nextBytes(u)
        f > 0 ? (u[0] &= (1 << f) - 1) : (u[0] = 0)
        this.fromString(u, 256)
      }
    }
    function ur() {
      var i = this.t,
        u = [],
        n,
        t,
        r
      if (
        ((u[0] = this.s), (n = this.DB - ((i * this.DB) % 8)), (r = 0), i-- > 0)
      )
        for (
          n < this.DB &&
          (t = this[i] >> n) != (this.s & this.DM) >> n &&
          (u[r++] = t | (this.s << (this.DB - n)));
          i >= 0;

        )
          n < 8
            ? (t =
                ((this[i] & ((1 << n) - 1)) << (8 - n)) |
                (this[--i] >> (n += this.DB - 8)))
            : ((t = (this[i] >> (n -= 8)) & 255),
              n <= 0 && ((n += this.DB), --i)),
            (t & 128) != 0 && (t |= -256),
            r == 0 && (this.s & 128) != (t & 128) && ++r,
            (r > 0 || t != this.s) && (u[r++] = t)
      return u
    }
    function fr(n) {
      return this.compareTo(n) == 0
    }
    function er(n) {
      return this.compareTo(n) < 0 ? this : n
    }
    function or(n) {
      return this.compareTo(n) > 0 ? this : n
    }
    function sr(n, t, i) {
      for (var u, f = Math.min(n.t, this.t), r = 0; r < f; ++r)
        i[r] = t(this[r], n[r])
      if (n.t < this.t) {
        for (u = n.s & this.DM, r = f; r < this.t; ++r) i[r] = t(this[r], u)
        i.t = this.t
      } else {
        for (u = this.s & this.DM, r = f; r < n.t; ++r) i[r] = t(u, n[r])
        i.t = n.t
      }
      i.s = t(this.s, n.s)
      i.clamp()
    }
    function hr(n, t) {
      return n & t
    }
    function cr(n) {
      var i = t()
      return this.bitwiseTo(n, hr, i), i
    }
    function y(n, t) {
      return n | t
    }
    function lr(n) {
      var i = t()
      return this.bitwiseTo(n, y, i), i
    }
    function d(n, t) {
      return n ^ t
    }
    function ar(n) {
      var i = t()
      return this.bitwiseTo(n, d, i), i
    }
    function g(n, t) {
      return n & ~t
    }
    function vr(n) {
      var i = t()
      return this.bitwiseTo(n, g, i), i
    }
    function yr() {
      for (var n = t(), i = 0; i < this.t; ++i) n[i] = this.DM & ~this[i]
      return (n.t = this.t), (n.s = ~this.s), n
    }
    function pr(n) {
      var i = t()
      return n < 0 ? this.rShiftTo(-n, i) : this.lShiftTo(n, i), i
    }
    function wr(n) {
      var i = t()
      return n < 0 ? this.lShiftTo(-n, i) : this.rShiftTo(n, i), i
    }
    function br(n) {
      if (n == 0) return -1
      var t = 0
      return (
        (n & 65535) == 0 && ((n >>= 16), (t += 16)),
        (n & 255) == 0 && ((n >>= 8), (t += 8)),
        (n & 15) == 0 && ((n >>= 4), (t += 4)),
        (n & 3) == 0 && ((n >>= 2), (t += 2)),
        (n & 1) == 0 && ++t,
        t
      )
    }
    function kr() {
      for (var n = 0; n < this.t; ++n)
        if (this[n] != 0) return n * this.DB + br(this[n])
      return this.s < 0 ? this.t * this.DB : -1
    }
    function dr(n) {
      for (var t = 0; n != 0; ) (n &= n - 1), ++t
      return t
    }
    function gr() {
      for (var t = 0, i = this.s & this.DM, n = 0; n < this.t; ++n)
        t += dr(this[n] ^ i)
      return t
    }
    function nu(n) {
      var t = Math.floor(n / this.DB)
      return t >= this.t ? this.s != 0 : (this[t] & (1 << n % this.DB)) != 0
    }
    function tu(t, i) {
      var r = n.ONE.shiftLeft(t)
      return this.bitwiseTo(r, i, r), r
    }
    function iu(n) {
      return this.changeBit(n, y)
    }
    function ru(n) {
      return this.changeBit(n, g)
    }
    function uu(n) {
      return this.changeBit(n, d)
    }
    function fu(n, t) {
      for (var r = 0, i = 0, u = Math.min(n.t, this.t); r < u; )
        (i += this[r] + n[r]), (t[r++] = i & this.DM), (i >>= this.DB)
      if (n.t < this.t) {
        for (i += n.s; r < this.t; )
          (i += this[r]), (t[r++] = i & this.DM), (i >>= this.DB)
        i += this.s
      } else {
        for (i += this.s; r < n.t; )
          (i += n[r]), (t[r++] = i & this.DM), (i >>= this.DB)
        i += n.s
      }
      t.s = i < 0 ? -1 : 0
      i > 0 ? (t[r++] = i) : i < -1 && (t[r++] = this.DV + i)
      t.t = r
      t.clamp()
    }
    function eu(n) {
      var i = t()
      return this.addTo(n, i), i
    }
    function ou(n) {
      var i = t()
      return this.subTo(n, i), i
    }
    function su(n) {
      var i = t()
      return this.multiplyTo(n, i), i
    }
    function hu() {
      var n = t()
      return this.squareTo(n), n
    }
    function cu(n) {
      var i = t()
      return this.divRemTo(n, i, null), i
    }
    function lu(n) {
      var i = t()
      return this.divRemTo(n, null, i), i
    }
    function au(n) {
      var i = t(),
        r = t()
      return this.divRemTo(n, i, r), [i, r]
    }
    function vu(n) {
      this[this.t] = this.am(0, n - 1, this, 0, 0, this.t)
      ++this.t
      this.clamp()
    }
    function yu(n, t) {
      if (n != 0) {
        while (this.t <= t) this[this.t++] = 0
        for (this[t] += n; this[t] >= this.DV; )
          (this[t] -= this.DV), ++t >= this.t && (this[this.t++] = 0), ++this[t]
      }
    }
    function l() {}
    function nt(n) {
      return n
    }
    function pu(n, t, i) {
      n.multiplyTo(t, i)
    }
    function wu(n, t) {
      n.squareTo(t)
    }
    function bu(n) {
      return this.exp(n, new l())
    }
    function ku(n, t, i) {
      var r = Math.min(this.t + n.t, t),
        u
      for (i.s = 0, i.t = r; r > 0; ) i[--r] = 0
      for (u = i.t - this.t; r < u; ++r)
        i[r + this.t] = this.am(0, n[r], i, r, 0, this.t)
      for (u = Math.min(n.t, t); r < u; ++r) this.am(0, n[r], i, r, 0, t - r)
      i.clamp()
    }
    function du(n, t, i) {
      --t
      var r = (i.t = this.t + n.t - t)
      for (i.s = 0; --r >= 0; ) i[r] = 0
      for (r = Math.max(t - this.t, 0); r < n.t; ++r)
        i[this.t + r - t] = this.am(t - r, n[r], i, 0, 0, this.t + r - t)
      i.clamp()
      i.drShiftTo(1, i)
    }
    function h(i) {
      this.r2 = t()
      this.q3 = t()
      n.ONE.dlShiftTo(2 * i.t, this.r2)
      this.mu = this.r2.divide(i)
      this.m = i
    }
    function gu(n) {
      if (n.s < 0 || n.t > 2 * this.m.t) return n.mod(this.m)
      if (n.compareTo(this.m) < 0) return n
      var i = t()
      return n.copyTo(i), this.reduce(i), i
    }
    function nf(n) {
      return n
    }
    function tf(n) {
      for (
        n.drShiftTo(this.m.t - 1, this.r2),
          n.t > this.m.t + 1 && ((n.t = this.m.t + 1), n.clamp()),
          this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
          this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        n.compareTo(this.r2) < 0;

      )
        n.dAddOffset(1, this.m.t + 1)
      for (n.subTo(this.r2, n); n.compareTo(this.m) >= 0; ) n.subTo(this.m, n)
    }
    function rf(n, t) {
      n.squareTo(t)
      this.reduce(t)
    }
    function uf(n, t, i) {
      n.multiplyTo(t, i)
      this.reduce(i)
    }
    function ff(n, i) {
      var r = n.bitLength(),
        w,
        u = f(1),
        c,
        d
      if (r <= 0) return u
      w = r < 18 ? 1 : r < 48 ? 3 : r < 144 ? 4 : r < 768 ? 5 : 6
      c = r < 8 ? new e(i) : i.isEven() ? new h(i) : new o(i)
      var y = [],
        s = 3,
        b = w - 1,
        g = (1 << w) - 1
      if (((y[1] = c.convert(this)), w > 1))
        for (d = t(), c.sqrTo(y[1], d); s <= g; )
          (y[s] = t()), c.mulTo(d, y[s - 2], y[s]), (s += 2)
      var l = n.t - 1,
        p,
        nt = !0,
        a = t(),
        k
      for (r = v(n[l]) - 1; l >= 0; ) {
        for (
          r >= b
            ? (p = (n[l] >> (r - b)) & g)
            : ((p = (n[l] & ((1 << (r + 1)) - 1)) << (b - r)),
              l > 0 && (p |= n[l - 1] >> (this.DB + r - b))),
            s = w;
          (p & 1) == 0;

        )
          (p >>= 1), --s
        if (((r -= s) < 0 && ((r += this.DB), --l), nt))
          y[p].copyTo(u), (nt = !1)
        else {
          while (s > 1) c.sqrTo(u, a), c.sqrTo(a, u), (s -= 2)
          s > 0 ? c.sqrTo(u, a) : ((k = u), (u = a), (a = k))
          c.mulTo(a, y[p], u)
        }
        while (l >= 0 && (n[l] & (1 << r)) == 0)
          c.sqrTo(u, a),
            (k = u),
            (u = a),
            (a = k),
            --r < 0 && ((r = this.DB - 1), --l)
      }
      return c.revert(u)
    }
    function ef(n) {
      var i = this.s < 0 ? this.negate() : this.clone(),
        t = n.s < 0 ? n.negate() : n.clone(),
        f,
        u,
        r
      if (
        (i.compareTo(t) < 0 && ((f = i), (i = t), (t = f)),
        (u = i.getLowestSetBit()),
        (r = t.getLowestSetBit()),
        r < 0)
      )
        return i
      for (
        u < r && (r = u), r > 0 && (i.rShiftTo(r, i), t.rShiftTo(r, t));
        i.signum() > 0;

      )
        (u = i.getLowestSetBit()) > 0 && i.rShiftTo(u, i),
          (u = t.getLowestSetBit()) > 0 && t.rShiftTo(u, t),
          i.compareTo(t) >= 0
            ? (i.subTo(t, i), i.rShiftTo(1, i))
            : (t.subTo(i, t), t.rShiftTo(1, t))
      return r > 0 && t.lShiftTo(r, t), t
    }
    function of(n) {
      var r, t, i
      if (n <= 0) return 0
      if (((r = this.DV % n), (t = this.s < 0 ? n - 1 : 0), this.t > 0))
        if (r == 0) t = this[0] % n
        else for (i = this.t - 1; i >= 0; --i) t = (r * t + this[i]) % n
      return t
    }
    function sf(t) {
      var h = t.isEven()
      if ((this.isEven() && h) || t.signum() == 0) return n.ZERO
      for (
        var u = t.clone(),
          e = this.clone(),
          o = f(1),
          r = f(0),
          s = f(0),
          i = f(1);
        u.signum() != 0;

      ) {
        while (u.isEven())
          u.rShiftTo(1, u),
            h
              ? ((o.isEven() && r.isEven()) ||
                  (o.addTo(this, o), r.subTo(t, r)),
                o.rShiftTo(1, o))
              : r.isEven() || r.subTo(t, r),
            r.rShiftTo(1, r)
        while (e.isEven())
          e.rShiftTo(1, e),
            h
              ? ((s.isEven() && i.isEven()) ||
                  (s.addTo(this, s), i.subTo(t, i)),
                s.rShiftTo(1, s))
              : i.isEven() || i.subTo(t, i),
            i.rShiftTo(1, i)
        u.compareTo(e) >= 0
          ? (u.subTo(e, u), h && o.subTo(s, o), r.subTo(i, r))
          : (e.subTo(u, e), h && s.subTo(o, s), i.subTo(r, i))
      }
      if (e.compareTo(n.ONE) != 0) return n.ZERO
      if (i.compareTo(t) >= 0) return i.subtract(t)
      if (i.signum() < 0) i.addTo(t, i)
      else return i
      return i.signum() < 0 ? i.add(t) : i
    }
    function hf(n) {
      var t,
        r = this.abs(),
        u,
        f
      if (r.t == 1 && r[0] <= i[i.length - 1]) {
        for (t = 0; t < i.length; ++t) if (r[0] == i[t]) return !0
        return !1
      }
      if (r.isEven()) return !1
      for (t = 1; t < i.length; ) {
        for (u = i[t], f = t + 1; f < i.length && u < tt; ) u *= i[f++]
        for (u = r.modInt(u); t < f; ) if (u % i[t++] == 0) return !1
      }
      return r.millerRabin(n)
    }
    function cf(r) {
      var f = this.subtract(n.ONE),
        e = f.getLowestSetBit(),
        h,
        o,
        s,
        u,
        c
      if (e <= 0) return !1
      for (
        h = f.shiftRight(e),
          r = (r + 1) >> 1,
          r > i.length && (r = i.length),
          o = t(),
          s = 0;
        s < r;
        ++s
      )
        if (
          (o.fromInt(i[Math.floor(Math.random() * i.length)]),
          (u = o.modPow(h, this)),
          u.compareTo(n.ONE) != 0 && u.compareTo(f) != 0)
        ) {
          for (c = 1; c++ < e && u.compareTo(f) != 0; )
            if (((u = u.modPowInt(2, this)), u.compareTo(n.ONE) == 0)) return !1
          if (u.compareTo(f) != 0) return !1
        }
      return !0
    }
    var u,
      p = (0xdeadbeefcafe & 16777215) == 15715070,
      a,
      w,
      c,
      s,
      r,
      i,
      tt
    for (
      p && navigator.appName == 'Microsoft Internet Explorer'
        ? ((n.prototype.am = rt), (u = 30))
        : p && navigator.appName != 'Netscape'
        ? ((n.prototype.am = it), (u = 26))
        : ((n.prototype.am = ut), (u = 28)),
        n.prototype.DB = u,
        n.prototype.DM = (1 << u) - 1,
        n.prototype.DV = 1 << u,
        a = 52,
        n.prototype.FV = Math.pow(2, a),
        n.prototype.F1 = a - u,
        n.prototype.F2 = 2 * u - a,
        w = '0123456789abcdefghijklmnopqrstuvwxyz',
        c = [],
        s = '0'.charCodeAt(0),
        r = 0;
      r <= 9;
      ++r
    )
      c[s++] = r
    for (s = 'a'.charCodeAt(0), r = 10; r < 36; ++r) c[s++] = r
    for (s = 'A'.charCodeAt(0), r = 10; r < 36; ++r) c[s++] = r
    return (
      (e.prototype.convert = ii),
      (e.prototype.revert = ri),
      (e.prototype.reduce = ui),
      (e.prototype.mulTo = fi),
      (e.prototype.sqrTo = ei),
      (o.prototype.convert = si),
      (o.prototype.revert = hi),
      (o.prototype.reduce = ci),
      (o.prototype.mulTo = ai),
      (o.prototype.sqrTo = li),
      (n.prototype.copyTo = ft),
      (n.prototype.fromInt = et),
      (n.prototype.fromString = ot),
      (n.prototype.clamp = st),
      (n.prototype.dlShiftTo = yt),
      (n.prototype.drShiftTo = pt),
      (n.prototype.lShiftTo = wt),
      (n.prototype.rShiftTo = bt),
      (n.prototype.subTo = kt),
      (n.prototype.multiplyTo = dt),
      (n.prototype.squareTo = gt),
      (n.prototype.divRemTo = ni),
      (n.prototype.invDigit = oi),
      (n.prototype.isEven = vi),
      (n.prototype.exp = yi),
      (n.prototype.toString = ht),
      (n.prototype.negate = ct),
      (n.prototype.abs = lt),
      (n.prototype.compareTo = at),
      (n.prototype.bitLength = vt),
      (n.prototype.mod = ti),
      (n.prototype.modPowInt = pi),
      (n.ZERO = f(0)),
      (n.ONE = f(1)),
      (l.prototype.convert = nt),
      (l.prototype.revert = nt),
      (l.prototype.mulTo = pu),
      (l.prototype.sqrTo = wu),
      (h.prototype.convert = gu),
      (h.prototype.revert = nf),
      (h.prototype.reduce = tf),
      (h.prototype.mulTo = uf),
      (h.prototype.sqrTo = rf),
      (i = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
        71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139,
        149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223,
        227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293,
        307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383,
        389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
        467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569,
        571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647,
        653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743,
        751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839,
        853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941,
        947, 953, 967, 971, 977, 983, 991, 997,
      ]),
      (tt = 67108864 / i[i.length - 1]),
      (n.prototype.chunkSize = gi),
      (n.prototype.toRadix = tr),
      (n.prototype.fromRadix = ir),
      (n.prototype.fromNumber = rr),
      (n.prototype.bitwiseTo = sr),
      (n.prototype.changeBit = tu),
      (n.prototype.addTo = fu),
      (n.prototype.dMultiply = vu),
      (n.prototype.dAddOffset = yu),
      (n.prototype.multiplyLowerTo = ku),
      (n.prototype.multiplyUpperTo = du),
      (n.prototype.modInt = of),
      (n.prototype.millerRabin = cf),
      (n.prototype.clone = wi),
      (n.prototype.intValue = bi),
      (n.prototype.byteValue = ki),
      (n.prototype.shortValue = di),
      (n.prototype.signum = nr),
      (n.prototype.toByteArray = ur),
      (n.prototype.equals = fr),
      (n.prototype.min = er),
      (n.prototype.max = or),
      (n.prototype.and = cr),
      (n.prototype.or = lr),
      (n.prototype.xor = ar),
      (n.prototype.andNot = vr),
      (n.prototype.not = yr),
      (n.prototype.shiftLeft = pr),
      (n.prototype.shiftRight = wr),
      (n.prototype.getLowestSetBit = kr),
      (n.prototype.bitCount = gr),
      (n.prototype.testBit = nu),
      (n.prototype.setBit = iu),
      (n.prototype.clearBit = ru),
      (n.prototype.flipBit = uu),
      (n.prototype.add = eu),
      (n.prototype.subtract = ou),
      (n.prototype.multiply = su),
      (n.prototype.divide = cu),
      (n.prototype.remainder = lu),
      (n.prototype.divideAndRemainder = au),
      (n.prototype.modPow = ff),
      (n.prototype.modInverse = sf),
      (n.prototype.pow = bu),
      (n.prototype.gcd = ef),
      (n.prototype.isProbablePrime = hf),
      (n.prototype.square = hu),
      n
    )
  }),
  (function (n) {
    'use strict'
    typeof define == 'function' && define.amd
      ? define('SRPClient', ['sha1', 'sjcl', 'BigInteger'], n)
      : (window.SRPClient = n(sha1, sjcl, BigInteger))
  })(function (n, t, r) {
    var u = function (n, t, i, u) {
      if (!n) throw 'Username cannot be empty.'
      this.username = n
      this.password = t
      this.hashFn = u || 'sha-1'
      var i = i || 1024,
        f = this.initVals[i]
      this.N = new r(f.N, 16)
      this.g = new r(f.g, 16)
      this.gBn = new r(f.g, 16)
      this.k = this.k()
      this.one = new r('1', 16)
      this.two = new r('2', 16)
    }
    return (
      (u.prototype = {
        toHexString: function (n) {
          var t = n.toString(16)
          return t.length % 2 == 1 && (t = '0' + t), t
        },
        padLeft: function (n, t) {
          if (n.length > t) return n
          var i = Array(t - n.length + 1)
          return i.join('0') + n
        },
        bytesToHex: function (n) {
          var t = this,
            i = n.map(function (n) {
              return t.padLeft(t.toHexString(n), 2)
            })
          return i.join('')
        },
        hexToBytes: function (n) {
          if (n.length % 2 == 1)
            throw new Error(
              "hexToBytes can't have a string with an odd number of characters."
            )
          return (
            n.indexOf('0x') === 0 && (n = n.slice(2)),
            n.match(/../g).map(function (n) {
              return parseInt(n, 16)
            })
          )
        },
        stringToBytes: function (n) {
          for (var i = [], t = 0; t < n.length; ++t) i.push(n.charCodeAt(t))
          return i
        },
        bytesToString: function (n) {
          for (var i = '', t = 0; t < n.length; t++)
            i += String.fromCharCode(n[t])
          return i
        },
        k: function () {
          var n = [this.toHexString(this.N), this.toHexString(this.g)]
          return this.paddedHash(n)
        },
        calculateX: function (t) {
          var u
          if (!t) throw 'Missing parameter.'
          if (!this.username || !this.password)
            throw 'Username and password cannot be empty.'
          var f = this.stringToBytes(this.username),
            e = this.hexToBytes(this.password),
            o = f.concat([58]).concat(e),
            s = n.calcSHA1(this.bytesToString(o)),
            h = this.hexToBytes(s),
            c = this.hexToBytes(t),
            l = c.concat(h),
            a = n.calcSHA1(this.bytesToString(l)),
            i = new r(a, 16)
          return i.compareTo(this.N) < 0
            ? i
            : ((u = new r(1, 16)), i.mod(this.N.subtract(u)))
        },
        calculateV: function (n) {
          if (!n) throw 'Missing parameter.'
          var t = this.calculateX(n)
          return this.g.modPow(t, this.N)
        },
        calculateU: function (n, t) {
          if (!n || !t) throw 'Missing parameter(s).'
          if (
            n.mod(this.N).toString() == '0' ||
            t.mod(this.N).toString() == '0'
          )
            throw 'ABORT: illegal_parameter'
          var i = [this.toHexString(n), this.toHexString(t)]
          return this.paddedHash(i)
        },
        canCalculateA: function (n) {
          if (!n) throw 'Missing parameter.'
          return Math.ceil(n.bitLength() / 8) >= 32
        },
        calculateA: function (n) {
          if (!n) throw 'Missing parameter.'
          if (!this.canCalculateA(n))
            throw 'Client key length is less than 256 bits.'
          var t = this.g.modPow(n, this.N)
          if (t.mod(this.N).toString() == '0') throw 'ABORT: illegal_parameter'
          return t
        },
        calculateM1: function (n, t, i, u) {
          var f, e
          if (!n || !t || !i || !u) throw 'Missing parameter(s).'
          if (
            n.mod(this.N).toString() == '0' ||
            t.mod(this.N).toString() == '0'
          )
            throw 'ABORT: illegal_parameter'
          var l = this.hexHash(this.toHexString(this.N)),
            a = this.hexHash(this.toHexString(this.g)),
            v = this.hash(this.username),
            o = [],
            s = this.hexToBytes(l),
            y = this.hexToBytes(a)
          for (f = 0; f < s.length; f++) o[f] = s[f] ^ y[f]
          var p = this.bytesToHex(o),
            w = this.toHexString(n),
            b = this.toHexString(t),
            h = [p, v, u, w, b, i],
            c = ''
          for (e = 0; e < h.length; e++) c += h[e]
          return new r(this.hexHash(c), 16)
        },
        calculateM2: function (n, t, i) {
          var u
          if (!n || !t || !i) throw 'Missing parameter(s).'
          if (
            n.mod(this.N).toString() == '0' ||
            t.mod(this.N).toString() == '0'
          )
            throw 'ABORT: illegal_parameter'
          var o = this.toHexString(n),
            s = this.toHexString(t),
            f = [o, s, i],
            e = ''
          for (u = 0; u < f.length; u++) e += f[u]
          return new r(this.hexHash(e), 16)
        },
        calculateS: function (n, t, i, r) {
          if (!n || !t || !i || !r) throw 'Missing parameters.'
          if (n.mod(this.N).toString() == '0') throw 'ABORT: illegal_parameter'
          var u = this.calculateX(t),
            f = this.g.modPow(u, this.N),
            e = n
              .add(this.N.multiply(this.k))
              .subtract(f.multiply(this.k))
              .mod(this.N)
          return e.modPow(u.multiply(i).add(r), this.N)
        },
        calculateK: function (n) {
          return this.hexHash(this.toHexString(n))
        },
        srpRandom: function () {
          var u = t.random.randomWords(8, 0),
            i = t.codec.hex.fromBits(u),
            n
          if (i.length != 64) throw 'Invalid random number size.'
          return (
            (n = new r(i, 16)),
            n.compareTo(this.N) >= 0 && (n = a.mod(this.N.subtract(this.one))),
            n.compareTo(this.two) < 0 && (n = two),
            n
          )
        },
        randomHexSalt: function () {
          var n = t.random.randomWords(8, 0)
          return t.codec.hex.fromBits(n)
        },
        paddedHash: function (n) {
          for (
            var u,
              f = 2 * ((this.toHexString(this.N).length * 4 + 7) >> 3),
              i = '',
              t = 0;
            t < n.length;
            t++
          )
            i += this.nZeros(f - n[t].length) + n[t]
          return (u = new r(this.hexHash(i), 16)), u.mod(this.N)
        },
        hash: function (i) {
          switch (this.hashFn.toLowerCase()) {
            case 'sha-256':
              var r = t.codec.hex.fromBits(t.hash.sha256.hash(i))
              return this.nZeros(64 - r.length) + r
            case 'sha-1':
            default:
              return n.calcSHA1(i)
          }
        },
        hexHash: function (n) {
          switch (this.hashFn.toLowerCase()) {
            case 'sha-256':
              var i = t.codec.hex.fromBits(
                t.hash.sha256.hash(t.codec.hex.toBits(n))
              )
              return this.nZeros(64 - i.length) + i
            case 'sha-1':
            default:
              return this.hash(this.pack(n))
          }
        },
        pack: function (n) {
          for (
            n.length % 2 != 0 && (n = '0' + n), i = 0, ascii = '';
            i < n.length / 2;

          )
            (ascii =
              ascii + String.fromCharCode(parseInt(n.substr(i * 2, 2), 16))),
              i++
          return ascii
        },
        nZeros: function (n) {
          if (n < 1) return ''
          var t = this.nZeros(n >> 1)
          return (n & 1) == 0 ? t + t : t + t + '0'
        },
        initVals: {
          1024: {
            N: 'EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE48E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B297BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9AFD5138FE8376435B9FC61D2FC0EB06E3',
            g: '2',
          },
          1536: {
            N: '9DEF3CAFB939277AB1F12A8617A47BBBDBA51DF499AC4C80BEEEA9614B19CC4D5F4F5F556E27CBDE51C6A94BE4607A291558903BA0D0F84380B655BB9A22E8DCDF028A7CEC67F0D08134B1C8B97989149B609E0BE3BAB63D47548381DBC5B1FC764E3F4B53DD9DA1158BFD3E2B9C8CF56EDF019539349627DB2FD53D24B7C48665772E437D6C7F8CE442734AF7CCB7AE837C264AE3A9BEB87F8A2FE9B8B5292E5A021FFF5E91479E8CE7A28C2442C6F315180F93499A234DCF76E3FED135F9BB',
            g: '2',
          },
          2048: {
            N: 'AC6BDB41324A9A9BF166DE5E1389582FAF72B6651987EE07FC3192943DB56050A37329CBB4A099ED8193E0757767A13DD52312AB4B03310DCD7F48A9DA04FD50E8083969EDB767B0CF6095179A163AB3661A05FBD5FAAAE82918A9962F0B93B855F97993EC975EEAA80D740ADBF4FF747359D041D5C33EA71D281E446B14773BCA97B43A23FB801676BD207A436C6481F1D2B9078717461A5B9D32E688F87748544523B524B0D57D5EA77A2775D2ECFA032CFBDBF52FB3786160279004E57AE6AF874E7303CE53299CCC041C7BC308D82A5698F3A8D0C38271AE35F8E9DBFBB694B5C803D89F7AE435DE236D525F54759B65E372FCD68EF20FA7111F9E4AFF73',
            g: '2',
          },
          3072: {
            N: 'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF',
            g: '5',
          },
          4096: {
            N: 'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A92108011A723C12A787E6D788719A10BDBA5B2699C327186AF4E23C1A946834B6150BDA2583E9CA2AD44CE8DBBBC2DB04DE8EF92E8EFC141FBECAA6287C59474E6BC05D99B2964FA090C3A2233BA186515BE7ED1F612970CEE2D7AFB81BDD762170481CD0069127D5B05AA993B4EA988D8FDDC186FFB7DC90A6C08F4DF435C934063199FFFFFFFFFFFFFFFF',
            g: '5',
          },
          6144: {
            N: 'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A92108011A723C12A787E6D788719A10BDBA5B2699C327186AF4E23C1A946834B6150BDA2583E9CA2AD44CE8DBBBC2DB04DE8EF92E8EFC141FBECAA6287C59474E6BC05D99B2964FA090C3A2233BA186515BE7ED1F612970CEE2D7AFB81BDD762170481CD0069127D5B05AA993B4EA988D8FDDC186FFB7DC90A6C08F4DF435C93402849236C3FAB4D27C7026C1D4DCB2602646DEC9751E763DBA37BDF8FF9406AD9E530EE5DB382F413001AEB06A53ED9027D831179727B0865A8918DA3EDBEBCF9B14ED44CE6CBACED4BB1BDB7F1447E6CC254B332051512BD7AF426FB8F401378CD2BF5983CA01C64B92ECF032EA15D1721D03F482D7CE6E74FEF6D55E702F46980C82B5A84031900B1C9E59E7C97FBEC7E8F323A97A7E36CC88BE0F1D45B7FF585AC54BD407B22B4154AACC8F6D7EBF48E1D814CC5ED20F8037E0A79715EEF29BE32806A1D58BB7C5DA76F550AA3D8A1FBFF0EB19CCB1A313D55CDA56C9EC2EF29632387FE8D76E3C0468043E8F663F4860EE12BF2D5B0B7474D6E694F91E6DCC4024FFFFFFFFFFFFFFFF',
            g: '5',
          },
          8192: {
            N: 'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A92108011A723C12A787E6D788719A10BDBA5B2699C327186AF4E23C1A946834B6150BDA2583E9CA2AD44CE8DBBBC2DB04DE8EF92E8EFC141FBECAA6287C59474E6BC05D99B2964FA090C3A2233BA186515BE7ED1F612970CEE2D7AFB81BDD762170481CD0069127D5B05AA993B4EA988D8FDDC186FFB7DC90A6C08F4DF435C93402849236C3FAB4D27C7026C1D4DCB2602646DEC9751E763DBA37BDF8FF9406AD9E530EE5DB382F413001AEB06A53ED9027D831179727B0865A8918DA3EDBEBCF9B14ED44CE6CBACED4BB1BDB7F1447E6CC254B332051512BD7AF426FB8F401378CD2BF5983CA01C64B92ECF032EA15D1721D03F482D7CE6E74FEF6D55E702F46980C82B5A84031900B1C9E59E7C97FBEC7E8F323A97A7E36CC88BE0F1D45B7FF585AC54BD407B22B4154AACC8F6D7EBF48E1D814CC5ED20F8037E0A79715EEF29BE32806A1D58BB7C5DA76F550AA3D8A1FBFF0EB19CCB1A313D55CDA56C9EC2EF29632387FE8D76E3C0468043E8F663F4860EE12BF2D5B0B7474D6E694F91E6DBE115974A3926F12FEE5E438777CB6A932DF8CD8BEC4D073B931BA3BC832B68D9DD300741FA7BF8AFC47ED2576F6936BA424663AAB639C5AE4F5683423B4742BF1C978238F16CBE39D652DE3FDB8BEFC848AD922222E04A4037C0713EB57A81A23F0C73473FC646CEA306B4BCBC8862F8385DDFA9D4B7FA2C087E879683303ED5BDD3A062B3CF5B3A278A66D2A13F83F44F82DDF310EE074AB6A364597E899A0255DC164F31CC50846851DF9AB48195DED7EA1B1D510BD7EE74D73FAF36BC31ECFA268359046F4EB879F924009438B481C6CD7889A002ED5EE382BC9190DA6FC026E479558E4475677E9AA9E3050E2765694DFC81F56E880B96E7160C980DD98EDD3DFFFFFFFFFFFFFFFFF',
            g: '19',
          },
        },
        calculateB: function (n, t) {
          if (!n || !t) throw 'Missing parameters.'
          var i = this.g.modPow(n, this.N)
          return i.add(t.multiply(this.k)).mod(this.N)
        },
        calculateServerS: function (n, t, i, r) {
          if (!n || !t || !i || !r) throw 'Missing parameters.'
          if (
            n.mod(this.N).toString() == '0' ||
            r.mod(this.N).toString() == '0'
          )
            throw 'ABORT: illegal_parameter'
          return t.modPow(i, this.N).multiply(n).mod(this.N).modPow(r, this.N)
        },
      }),
      u
    )
  }),
  function () {
    ;(function (n, t) {
      return typeof define == 'function' && define.amd
        ? define('ifvisible', function () {
            return t()
          })
        : typeof exports == 'object'
        ? (module.exports = t())
        : (n.ifvisible = t())
    })(this, function () {
      var u, t, i, v, f, s, e, l, r, h, c, n, a, o
      return (
        (r = {}),
        (i = document),
        (c = !1),
        (n = 'active'),
        (e = 6e4),
        (s = !1),
        (t = (function () {
          var i, r, n, u, e, t, f
          return (
            (i = function () {
              return (((1 + Math.random()) * 65536) | 0)
                .toString(16)
                .substring(1)
            }),
            (e = function () {
              return (
                i() +
                i() +
                '-' +
                i() +
                '-' +
                i() +
                '-' +
                i() +
                '-' +
                i() +
                i() +
                i()
              )
            }),
            (t = {}),
            (n = '__ceGUID'),
            (r = function (i, r, u) {
              return (
                (i[n] = undefined),
                i[n] || (i[n] = 'ifvisible.object.event.identifier'),
                t[i[n]] || (t[i[n]] = {}),
                t[i[n]][r] || (t[i[n]][r] = []),
                t[i[n]][r].push(u)
              )
            }),
            (u = function (i, r, u) {
              var s, f, h, e, o
              if (i[n] && t[i[n]] && t[i[n]][r]) {
                for (e = t[i[n]][r], o = [], f = 0, h = e.length; f < h; f++)
                  (s = e[f]), o.push(s(u || {}))
                return o
              }
            }),
            (f = function (i, r, u) {
              var e, f, o, h, s
              if (u) {
                if (i[n] && t[i[n]] && t[i[n]][r])
                  for (s = t[i[n]][r], f = o = 0, h = s.length; o < h; f = ++o)
                    if (((e = s[f]), e === u)) return t[i[n]][r].splice(f, 1), e
              } else if (i[n] && t[i[n]] && t[i[n]][r]) return delete t[i[n]][r]
            }),
            { add: r, remove: f, fire: u }
          )
        })()),
        (u = (function () {
          var n
          return (
            (n = !1),
            function (t, i, r) {
              return (
                n ||
                  (n = t.addEventListener
                    ? function (n, t, i) {
                        return n.addEventListener(t, i, !1)
                      }
                    : t.attachEvent
                    ? function (n, t, i) {
                        return n.attachEvent('on' + t, i, !1)
                      }
                    : function (n, t, i) {
                        return (n['on' + t] = i)
                      }),
                n(t, i, r)
              )
            }
          )
        })()),
        (v = function (n, t) {
          var r
          return i.createEventObject
            ? n.fireEvent('on' + t, r)
            : ((r = i.createEvent('HTMLEvents')),
              r.initEvent(t, !0, !0),
              !n.dispatchEvent(r))
        }),
        (l = (function () {
          var r, u, t, f, n
          for (
            f = void 0,
              n = 3,
              t = i.createElement('div'),
              r = t.getElementsByTagName('i'),
              u = function () {
                return (
                  (t.innerHTML =
                    '<!--[if gt IE ' + ++n + ']><i></i><![endif]-->'),
                  r[0]
                )
              };
            u();

          )
            continue
          return n > 4 ? n : f
        })()),
        (f = !1),
        (o = void 0),
        typeof i.hidden != 'undefined'
          ? ((f = 'hidden'), (o = 'visibilitychange'))
          : typeof i.mozHidden != 'undefined'
          ? ((f = 'mozHidden'), (o = 'mozvisibilitychange'))
          : typeof i.msHidden != 'undefined'
          ? ((f = 'msHidden'), (o = 'msvisibilitychange'))
          : typeof i.webkitHidden != 'undefined' &&
            ((f = 'webkitHidden'), (o = 'webkitvisibilitychange')),
        (a = function () {
          var f, t
          return (
            (f = !1),
            (t = function () {
              return (
                clearTimeout(f),
                n !== 'active' && r.wakeup(),
                (s = +new Date()),
                (f = setTimeout(function () {
                  if (n === 'active') return r.idle()
                }, e))
              )
            }),
            t(),
            u(i, 'mousemove', t),
            u(i, 'keyup', t),
            u(window, 'scroll', t),
            r.focus(t),
            r.wakeup(t)
          )
        }),
        (h = function () {
          var n
          return c
            ? !0
            : (f === !1
                ? ((n = 'blur'),
                  l < 9 && (n = 'focusout'),
                  u(window, n, function () {
                    return r.blur()
                  }),
                  u(window, 'focus', function () {
                    return r.focus()
                  }))
                : u(
                    i,
                    o,
                    function () {
                      return i[f] ? r.blur() : r.focus()
                    },
                    !1
                  ),
              (c = !0),
              a())
        }),
        (r = {
          setIdleDuration: function (n) {
            return (e = n * 1e3)
          },
          getIdleDuration: function () {
            return e
          },
          getIdleInfo: function () {
            var i, t
            return (
              (i = +new Date()),
              (t = {}),
              n === 'idle'
                ? ((t.isIdle = !0),
                  (t.idleFor = i - s),
                  (t.timeLeft = 0),
                  (t.timeLeftPer = 100))
                : ((t.isIdle = !1),
                  (t.idleFor = i - s),
                  (t.timeLeft = s + e - i),
                  (t.timeLeftPer = (100 - (t.timeLeft * 100) / e).toFixed(2))),
              t
            )
          },
          focus: function (i) {
            return typeof i == 'function'
              ? this.on('focus', i)
              : ((n = 'active'),
                t.fire(this, 'focus'),
                t.fire(this, 'wakeup'),
                t.fire(this, 'statusChanged', { status: n }))
          },
          blur: function (i) {
            return typeof i == 'function'
              ? this.on('blur', i)
              : ((n = 'hidden'),
                t.fire(this, 'blur'),
                t.fire(this, 'idle'),
                t.fire(this, 'statusChanged', { status: n }))
          },
          idle: function (i) {
            return typeof i == 'function'
              ? this.on('idle', i)
              : ((n = 'idle'),
                t.fire(this, 'idle'),
                t.fire(this, 'statusChanged', { status: n }))
          },
          wakeup: function (i) {
            return typeof i == 'function'
              ? this.on('wakeup', i)
              : ((n = 'active'),
                t.fire(this, 'wakeup'),
                t.fire(this, 'statusChanged', { status: n }))
          },
          on: function (n, i) {
            return h(), t.add(this, n, i)
          },
          off: function (n, i) {
            return h(), t.remove(this, n, i)
          },
          onEvery: function (t, i) {
            var r, u
            return (
              h(),
              (r = !1),
              i &&
                (u = setInterval(function () {
                  if (n === 'active' && r === !1) return i()
                }, t * 1e3)),
              {
                stop: function () {
                  return clearInterval(u)
                },
                pause: function () {
                  return (r = !0)
                },
                resume: function () {
                  return (r = !1)
                },
                code: u,
                callback: i,
              }
            )
          },
          now: function (t) {
            return h(), n === (t || 'active')
          },
        })
      )
    })
  }.call(this),
  (function (n) {
    'use strict'
    typeof define == 'function' && define.amd
      ? define(
          'WebSdk',
          ['async', 'sjcl', 'BigInteger', 'SRPClient', 'ifvisible'],
          n
        )
      : (window.WebSdk = n(async, sjcl, BigInteger, SRPClient, ifvisible))
  })(function (n, t, i, r, u) {
    function o(n, t) {
      var i = RegExp('[?&]' + t + '=([^&]*)').exec(n)
      return i ? decodeURIComponent(i[1].replace(/\+/g, ' ')) : null
    }
    function h(n, t, i) {
      return new window.Promise(function (r, u) {
        var f = new XMLHttpRequest(),
          e,
          o,
          s
        if (
          (f.open(n, t, !0),
          (f.responseType = 'json'),
          f.setRequestHeader('Accept', 'application/json'),
          (f.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE)
              if (this.status === 200) {
                var n
                n =
                  this.responseType === '' &&
                  typeof this.responseText == 'string'
                    ? JSON.parse(this.responseText)
                    : this.response
                r(n)
              } else u(this)
          }),
          n.toLowerCase() === 'post' && i)
        ) {
          e = ''
          o = []
          for (s in i)
            o.push(encodeURIComponent(s) + '=' + encodeURIComponent(i[s]))
          e = o.join('&').replace(/%20/g, '+')
          f.send(e)
        } else {
          try {
            f.send()
          } catch (c) {}
        }
      })
    }
    function c(n) {
      return (
        (n.promise = new window.Promise(function (t, i) {
          n.resolve = t
          n.reject = i
        })),
        n
      )
    }
    function s() {
      return this instanceof s ? c(this) : c(Object.create(s.prototype))
    }
    function f() {
      e.Debug &&
        (console.log.apply
          ? console.log.apply(console, [].slice.call(arguments))
          : console.log(arguments[0]))
    }
    function v(n) {
      if (!n) return null
      var t
      try {
        t = JSON.parse(n)
      } catch (i) {
        t = null
      }
      return t
    }
    var e = { Debug: !1, Promise: null },
      a = 2,
      y = (function () {
        function n() {
          this.m_key = 'websdk'
          var n = v(sessionStorage.getItem(this.m_key))
          n &&
            ((this.m_port = parseInt(n.port)),
            (this.m_host = n.host || '127.0.0.1'),
            (this.m_isSecure = n.isSecure),
            (this.m_srp = n.srp))
        }
        return (
          Object.defineProperty(n.prototype, 'url', {
            get: function () {
              if (!this.m_port || !this.m_host) return null
              var n = this.m_isSecure ? 'https' : 'http'
              return n + '://' + this.m_host + ':' + this.m_port.toString()
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(n.prototype, 'srp', {
            get: function () {
              return this.m_srp
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(n.prototype, 'sessionId', {
            get: function () {
              return sessionStorage.getItem('websdk.sessionId')
            },
            set: function (n) {
              return sessionStorage.setItem('websdk.sessionId', n)
            },
            enumerable: !0,
            configurable: !0,
          }),
          (n.prototype.ensureLoaded = function (n) {
            if ((f('Configurator: ensureLoaded'), !!this.url && !!this.srp))
              return n(null)

            var t = this
            h('get', 'https://127.0.0.1:52181/get_connection')
              .then(function (i) {
                f('Configurator: findConfiguration -> ', i)
                i && i.endpoint && t.tryParse(i.endpoint)
                  ? n(null)
                  : n(new Error('Cannot load configuration'))
              })
              .catch(function (t) {
                f('Configurator: findConfiguration -> ERROR ', t)
                n(t)
              })
          }),
          (n.prototype.tryParse = function (n) {
            var t
            f('Configurator: tryParse ' + n)
            t = document.createElement('a')
            t.href = n
            var i = parseInt(o(t.search, 'web_sdk_port') || ''),
              h = o(t.search, 'web_sdk_secure') == 'true',
              r = t.hostname,
              u = o(t.search, 'web_sdk_username'),
              e = o(t.search, 'web_sdk_password'),
              s = o(t.search, 'web_sdk_salt')
            return !i || !r || !u || !e || !s
              ? !1
              : ((this.m_port = i),
                (this.m_host = r),
                (this.m_isSecure = h),
                (this.m_srp = { p1: u, p2: e, salt: s }),
                sessionStorage.setItem(
                  this.m_key,
                  JSON.stringify({
                    port: this.m_port,
                    host: this.m_host,
                    isSecure: this.m_isSecure,
                    srp: this.m_srp,
                  })
                ),
                !0)
          }),
          n
        )
      })(),
      p = (function () {
        function n(n) {
          this.m_items = []
          this.m_maxSize = n
        }
        return (
          Object.defineProperty(n.prototype, 'length', {
            get: function () {
              return this.m_items.length
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(n.prototype, 'items', {
            get: function () {
              return this.m_items
            },
            enumerable: !0,
            configurable: !0,
          }),
          (n.prototype.trimHead = function () {
            this.m_items.length <= this.m_maxSize ||
              Array.prototype.splice.call(
                this.m_items,
                0,
                this.m_items.length - this.m_maxSize
              )
          }),
          (n.prototype.trimTail = function () {
            this.m_items.length <= this.m_maxSize ||
              Array.prototype.splice.call(
                this.m_items,
                this.m_maxSize,
                this.m_items.length - this.m_maxSize
              )
          }),
          (n.prototype.push = function () {
            var n = Array.prototype.push.apply(this.m_items, arguments)
            return this.trimHead(), n
          }),
          (n.prototype.splice = function () {
            var n = Array.prototype.splice.apply(this.m_items, arguments)
            return this.trimTail(), n
          }),
          (n.prototype.unshift = function () {
            var n = Array.prototype.unshift.apply(this.m_items, arguments)
            return this.trimTail(), n
          }),
          n
        )
      })(),
      l = (function () {
        function n(n) {
          var t = i(n)
          return btoa(t)
        }
        function t(n) {
          var t = atob(n)
          return r(t)
        }
        function i(n) {
          var t = encodeURIComponent(n)
          return t.replace(/%([0-9A-F]{2})/g, function (n, t) {
            return String.fromCharCode(parseInt(t, 16))
          })
        }
        function r(n) {
          var t = n.replace(/(.)/g, function (n, t) {
            var i = t.charCodeAt(0).toString(16).toUpperCase()
            return i.length < 2 && (i = '0' + i), '%' + i
          })
          return decodeURIComponent(t)
        }
        function u(n, t) {
          return n.charCodeAt(Math.floor(t % n.length))
        }
        return {
          encode: function (t, i) {
            return n(i)
          },
          decode: function (n, i) {
            return t(i)
          },
        }
      })(),
      w = (function () {
        function o(n) {
          if (
            (typeof e.Promise == 'function' && (window.Promise = e.Promise),
            typeof Promise != 'function')
          )
            throw 'Promise implementation not found'
          if (!n) throw new Error('clientPath cannot be empty')
          this.clientPath = n
          this.wsThreshold = 10240
          this.wsQueueInterval = 1e3
          this.wsQueueLimit = 100
          this.wsReconnectInterval = 5e3
          this.queue = new p(this.wsQueueLimit)
          this.queueInterval = null
          this.webSocket = null
          this.configurator = new y()
          this.sessionKey = null
          this.reconnectTimer = null
          this.onConnectionFailed = null
          this.onConnectionSucceed = null
          this.onDataReceivedBin = null
          this.onDataReceivedTxt = null
          var t = this
          u.on('blur', function () {
            t.resetReconnectTimer()
            t.notifyFocusChanged(!1)
          })
          u.on('focus', function () {
            t.isConnected() ? t.notifyFocusChanged(!0) : t.connectInternal(!1)
          })
        }
        return (
          (o.prototype.notifyFocusChanged = function (n) {
            if (this.isConnected()) {
              f('WebChannelClientImpl: notifyFocusChanged ->', n)
              var t = { type: 'sdk.focusChanged', data: n }
              this.sendData(JSON.stringify(t))
            }
          }),
          (o.prototype.fireConnectionFailed = function () {
            u.now() && this.setReconnectTimer()
            this.onConnectionFailed && this.onConnectionFailed()
          }),
          (o.prototype.fireConnectionSucceed = function () {
            this.onConnectionSucceed && this.onConnectionSucceed()
          }),
          (o.prototype.fireDataReceivedBin = function (n) {
            if (this.onDataReceivedBin) this.onDataReceivedBin(n)
          }),
          (o.prototype.fireDataReceivedTxt = function (n) {
            if (this.onDataReceivedTxt) {
              n = l.decode(this.sessionKey, n)
              this.onDataReceivedTxt(n)
            }
          }),
          (o.prototype.resetReconnectTimer = function () {
            this.reconnectTimer &&
              (clearInterval(this.reconnectTimer), (this.reconnectTimer = null))
          }),
          (o.prototype.setReconnectTimer = function () {
            this.resetReconnectTimer()
            var n = this
            this.reconnectTimer = setInterval(function () {
              n.connectInternal(!1)
            }, this.wsReconnectInterval)
          }),
          (o.prototype.wsconnect = function (n) {
            f('WebChannelClientImpl: wsconnect ' + n)
            var t = this,
              i = s()
            if (
              this.webSocket &&
              this.webSocket.readyState !== WebSocket.CLOSED
            )
              throw new Error('wsdisconnect has not been called')
            return (
              (this.webSocket = new WebSocket(n)),
              (this.webSocket.onclose = function () {
                return f('WebChannelClientImpl: wsonclose'), t.wsonclose(!0)
              }),
              (this.webSocket.onopen = function () {
                f('WebChannelClientImpl: wsonopen')
                i.resolve()
                u.now() && t.notifyFocusChanged(!0)
              }),
              (this.webSocket.onerror = function () {
                return (
                  f('WebChannelClientImpl: wsonerror ' + arguments),
                  i.reject(new Error('WebSocket connection failed.'))
                )
              }),
              (this.webSocket.onmessage = function (n) {
                return t.wsonmessage(n)
              }),
              i.promise
            )
          }),
          (o.prototype.wsdisconnect = function () {
            var t = this,
              n = s()
            return (
              this.webSocket && this.webSocket.readyState === WebSocket.OPEN
                ? ((this.webSocket.onclose = function () {
                    t.wsonclose(!1)
                    n.resolve()
                  }),
                  this.webSocket.close())
                : n.resolve(),
              n.promise
            )
          }),
          (o.prototype.wsonclose = function (n) {
            f('WebChannelClientImpl: connection closed')
            this.webSocket.onclose = null
            this.webSocket.onopen = null
            this.webSocket.onmessage = null
            this.webSocket.onerror = null
            this.deactivateBufferCheck()
            n && this.fireConnectionFailed()
          }),
          (o.prototype.wsonmessage = function (n) {
            typeof n.data == 'string'
              ? this.fireDataReceivedTxt(n.data)
              : this.fireDataReceivedBin(n.data)
          }),
          (o.prototype.wssend = function (n) {
            return this.isConnected()
              ? this.webSocket.bufferedAmount >= this.wsThreshold
                ? (this.activateBufferCheck(), !1)
                : (this.webSocket.send(n), !0)
              : !1
          }),
          (o.prototype.generateSessionKey = function (n) {
            var u = this.configurator.srp,
              t,
              f,
              e
            if (!u.p1 || !u.p2 || !u.salt)
              return n(new Error('No data available for authentication'))
            t = new r(u.p1, u.p2)
            do f = t.srpRandom()
            while (!t.canCalculateA(f))
            e = t.calculateA(f)
            h('post', this.configurator.url + '/connect', {
              username: u.p1,
              A: t.toHexString(e),
            })
              .then(function (r) {
                var o = new i(r.B, 16),
                  s = t.calculateU(e, o),
                  h = t.calculateS(o, u.salt, s, f),
                  c = t.calculateK(h),
                  l = t.calculateM1(e, o, c, u.salt)
                n(null, t.toHexString(l))
              })
              .catch(n)
          }),
          (o.prototype.setupSecureChannel = function (i) {
            f('WebChannelClientImpl.setupSecureChannel')
            var r = this
            n.waterfall(
              [
                function (n) {
                  r.generateSessionKey(n)
                },
                function (n, i) {
                  r.sessionKey = n
                  var u =
                    r.configurator.url.replace('http', 'ws') +
                    '/' +
                    r.clientPath +
                    '?username=' +
                    r.configurator.srp.p1 +
                    '&M1=' +
                    n
                  r.configurator.sessionId ||
                    (r.configurator.sessionId = t.codec.hex.fromBits(
                      t.random.randomWords(2, 0)
                    ))
                  u += '&sessionId=' + r.configurator.sessionId
                  u += '&version=' + a.toString()
                  r.wsconnect(u)
                    .then(function () {
                      i(null)
                    })
                    .catch(function (n) {
                      f(n)
                      i(n)
                    })
                },
              ],
              i
            )
          }),
          (o.prototype.isConnected = function () {
            return (
              !!this.webSocket && this.webSocket.readyState === WebSocket.OPEN
            )
          }),
          (o.prototype.sendData = function (n) {
            this.wssend(n) || this.queue.push(n)
          }),
          (o.prototype.deactivateBufferCheck = function () {
            this.queueInterval &&
              (clearInterval(this.queueInterval), (this.queueInterval = null))
          }),
          (o.prototype.activateBufferCheck = function () {
            if (!this.queueInterval) {
              var n = this
              this.queueInterval = setInterval(function () {
                n.processMessageQueue()
                n.queue.length === 0 && n.deactivateBufferCheck()
              }, this.wsQueueInterval)
            }
          }),
          (o.prototype.processMessageQueue = function () {
            if (
              (f(
                'WebChannelClientImpl: processMessageQueue ' + this.queue.length
              ),
              this.queue.length !== 0)
            )
              for (var n = 0; n < this.queue.length; ) {
                if (!this.wssend(this.queue.items[n])) break
                this.queue.splice(n, 1)
              }
          }),
          (o.prototype.connectInternal = function (t) {
            f('WebChannelClientImpl.connectInternal')
            this.resetReconnectTimer()
            var i = this
            n.waterfall(
              [
                function (n) {
                  i.configurator.ensureLoaded(n)
                },
                function (r) {
                  n.retry(
                    t ? 3 : 1,
                    function () {
                      i.setupSecureChannel(r)
                    },
                    r
                  )
                },
              ],
              function (n) {
                if (n) return i.fireConnectionFailed()
                i.fireConnectionSucceed()
                i.processMessageQueue()
              }
            )
          }),
          (o.prototype.connect = function () {
            this.connectInternal(!0)
          }),
          (o.prototype.sendDataBin = function (n) {
            this.sendData(n)
          }),
          (o.prototype.sendDataTxt = function (n) {
            n = l.encode(this.sessionKey, n)
            this.sendData(n)
          }),
          o
        )
      })(),
      b = (function () {
        function n(n) {
          var t = new w(n)
          Object.defineProperties(this, {
            path: {
              get: function () {
                return n
              },
              enumerable: !0,
            },
            onConnectionFailed: {
              get: function () {
                return t.onConnectionFailed
              },
              set: function (n) {
                t.onConnectionFailed = n
              },
              enumerable: !0,
            },
            onConnectionSucceed: {
              get: function () {
                return t.onConnectionSucceed
              },
              set: function (n) {
                t.onConnectionSucceed = n
              },
              enumerable: !0,
            },
            onDataReceivedBin: {
              get: function () {
                return t.onDataReceivedBin
              },
              set: function (n) {
                t.onDataReceivedBin = n
              },
              enumerable: !0,
            },
            onDataReceivedTxt: {
              get: function () {
                return t.onDataReceivedTxt
              },
              set: function (n) {
                t.onDataReceivedTxt = n
              },
              enumerable: !0,
            },
          })
          this.connect = function () {
            t.connect()
          }
          this.sendDataBin = function (n) {
            t.sendDataBin(n)
          }
          this.sendDataTxt = function (n) {
            t.sendDataTxt(n)
          }
        }
        return n
      })()
    return (e.WebChannelClient = b), e
  })
