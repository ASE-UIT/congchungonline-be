// Plugin glassy-worms. Beautiful worms on background
// Aunthor: Nick Iv. Sorced 17 May 2014
// Promo: http://dev.nim579.ru/glassy-worms
// Version: 0.0.2 (Sat May 17 2014 14:29:43)
(function () {
  $.glassyWorms = {
    version: '0.0.2',
    Particle: (function () {
      function _Class(x, y, mass, colors) {
        this.x = x != null ? x : 0.0;
        this.y = y != null ? y : 0.0;
        this.mass = mass != null ? mass : 1.0;
        if (colors == null) {
          colors = ['#000000'];
        }
        this.tail = [];
        this.radius = this.mass * 0.15;
        this.charge = random([-1, 1]);
        this.color = random(colors);
        this.fx = this.fy = 0.0;
        this.vx = this.vy = 0.0;
      }

      return _Class;
    })(),
    setup() {
      let i;
      let m;
      let x;
      let y;
      let _i;
      let _ref;
      let _results;
      _results = [];
      for (i = _i = 0, _ref = this.glassyWormsOptins.numParticles; _i <= _ref; i = _i += 1) {
        x = random(this.width);
        y = random(this.height);
        m = random(8.0, 14.0);
        _results.push(this.particles.push(new $.glassyWorms.Particle(x, y, m, this.glassyWormsOptins.colors)));
      }
      return _results;
    },
    draw() {
      let a;
      let b;
      let dSq;
      let dst;
      let dx;
      let dy;
      let f;
      let fx;
      let fy;
      let i;
      let j;
      let len;
      let p;
      let rad;
      let _i;
      let _j;
      let _k;
      let _len;
      let _ref;
      let _ref1;
      let _ref2;
      let _ref3;
      let _results;
      this.lineCap = this.lineJoin = 'round';
      _results = [];
      for (i = _i = 0, _ref = this.glassyWormsOptins.numParticles; _i <= _ref; i = _i += 1) {
        a = this.particles[i];
        if (random() < 0.5) {
          a.charge = -a.charge;
        }
        for (j = _j = _ref1 = i + 1, _ref2 = this.glassyWormsOptins.numParticles; _j <= _ref2; j = _j += 1) {
          b = this.particles[j];
          dx = b.x - a.x;
          dy = b.y - a.y;
          dst = sqrt((dSq = dx * dx + dy * dy + 0.1));
          rad = a.radius + b.radius;
          if (dst >= rad) {
            len = 1.0 / dst;
            fx = dx * len;
            fy = dy * len;
            f = min(this.glassyWormsOptins.maxForce, (this.glassyWormsOptins.gravity * a.mass * b.mass) / dSq);
            a.fx += f * fx * b.charge;
            a.fy += f * fy * b.charge;
            b.fx += -f * fx * a.charge;
            b.fy += -f * fy * a.charge;
          }
        }
        a.vx += a.fx;
        a.vy += a.fy;
        a.vx *= this.glassyWormsOptins.friction;
        a.vy *= this.glassyWormsOptins.friction;
        a.tail.unshift({
          x: a.x,
          y: a.y,
        });
        if (a.tail.length > this.glassyWormsOptins.tailLength) {
          a.tail.pop();
        }
        a.x += a.vx;
        a.y += a.vy;
        a.fx = a.fy = 0.0;
        if (a.x > this.width + a.radius) {
          a.x = -a.radius;
          a.tail = [];
        } else if (a.x < -a.radius) {
          a.x = this.width + a.radius;
          a.tail = [];
        }
        if (a.y > this.height + a.radius) {
          a.y = -a.radius;
          a.tail = [];
        } else if (a.y < -a.radius) {
          a.y = this.height + a.radius;
          a.tail = [];
        }
        this.strokeStyle = a.color;
        this.lineWidth = a.radius * 0.1;
        this.beginPath();
        this.moveTo(a.x, a.y);
        _ref3 = a.tail;
        for (_k = 0, _len = _ref3.length; _k < _len; _k++) {
          p = _ref3[_k];
          this.lineTo(p.x, p.y);
        }
        _results.push(this.stroke());
      }
      return _results;
    },
  };

  $.fn.glassyWorms = function (options) {
    let element;
    if (typeof options === 'string') {
      this.each(function (index, el) {
        let _ref;
        let _ref1;
        console.log(el.glassyWorms, (_ref = el.glassyWorms) != null ? _ref[options] : void 0);
        return (_ref1 = el.glassyWorms) != null
          ? typeof _ref1[options] === 'function'
            ? _ref1[options]()
            : void 0
          : void 0;
      });
      return this;
    }
    options = $.extend(
      {
        numParticles: 250,
        tailLength: 12,
        maxForce: 8,
        friction: 0.75,
        gravity: 9.81,
        interval: 3,
        colors: ['#fff'],
        element: $('<canvas class="worms"></canvas>')[0],
        useStyles: false,
      },
      options
    );
    if (options.className || options.id) {
      element = $('<canvas></canvas>');
      if (options.className) {
        element.addClass(options.className);
      }
      if (options.id) {
        element.attr('id', options.id);
      }
      options.element = element[0];
    }
    if (options.useStyles) {
      element = $(options.element);
      element.css({
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      });
      options.element = element[0];
    }
    this.each(function (index, el) {
      return (el.glassyWorms = Sketch.create({
        container: el,
        element: options.element,
        particles: [],
        interval: options.interval,
        setup: $.glassyWorms.setup,
        draw: $.glassyWorms.draw,
        glassyWormsOptins: options,
      }));
    });
    return this;
  };
}).call(this);

/*-------------------------------------------
Included Sketch / Canvas StyleOne
---------------------------------------------*/

/* Copyright (C) 2013 Justin Windle, http://soulwire.co.uk */
var Sketch = (function () {
  function e(e) {
    return Object.prototype.toString.call(e) == '[object Array]';
  }
  function t(e) {
    return typeof e === 'function';
  }
  function n(e) {
    return typeof e === 'number';
  }
  function o(e) {
    return typeof e === 'string';
  }
  function r(e) {
    return E[e] || String.fromCharCode(e);
  }
  function i(e, t, n) {
    for (const o in t) (n || !e.hasOwnProperty(o)) && (e[o] = t[o]);
    return e;
  }
  function u(e, t) {
    return function () {
      e.apply(t, arguments);
    };
  }
  function a(e) {
    const n = {};
    for (const o in e) n[o] = t(e[o]) ? u(e[o], e) : e[o];
    return n;
  }
  function c(e) {
    function n(n) {
      t(n) && n.apply(e, [].splice.call(arguments, 1));
    }
    function u(e) {
      for (_ = 0; _ < J.length; _++)
        (G = J[_]), o(G) ? O[`${e ? 'add' : 'remove'}EventListener`].call(O, G, k, !1) : t(G) ? (k = G) : (O = G);
    }
    function c() {
      L(T),
        (T = I(c)),
        U || (n(e.setup), (U = t(e.setup)), n(e.resize)),
        e.running &&
          !j &&
          ((e.dt = (B = +new Date()) - e.now),
          (e.millis += e.dt),
          (e.now = B),
          n(e.update),
          e.autoclear && K && e.clear(),
          n(e.draw)),
        (j = ++j % e.interval);
    }
    function l() {
      (O = Y ? e.style : e.canvas),
        (D = Y ? 'px' : ''),
        e.fullscreen && ((e.height = w.innerHeight), (e.width = w.innerWidth)),
        (O.height = e.height + D),
        (O.width = e.width + D),
        e.retina &&
          K &&
          X &&
          ((O.height = e.height * X),
          (O.width = e.width * X),
          (O.style.height = `${e.height}px`),
          (O.style.width = `${e.width}px`),
          e.scale(X, X)),
        U && n(e.resize);
    }
    function s(e, t) {
      return (N = t.getBoundingClientRect()), (e.x = e.pageX - N.left - w.scrollX), (e.y = e.pageY - N.top - w.scrollY), e;
    }
    function f(t, n) {
      return (
        s(t, e.element),
        (n = n || {}),
        (n.ox = n.x || t.x),
        (n.oy = n.y || t.y),
        (n.x = t.x),
        (n.y = t.y),
        (n.dx = n.x - n.ox),
        (n.dy = n.y - n.oy),
        n
      );
    }
    function g(e) {
      if ((e.preventDefault(), (W = a(e)), (W.originalEvent = e), W.touches))
        for (M.length = W.touches.length, _ = 0; _ < W.touches.length; _++) M[_] = f(W.touches[_], M[_]);
      else (M.length = 0), (M[0] = f(W, V));
      return i(V, M[0], !0), W;
    }
    function h(t) {
      for (
        t = g(t),
          q = (Q = J.indexOf((z = t.type))) - 1,
          e.dragging = /down|start/.test(z) ? !0 : /up|end/.test(z) ? !1 : e.dragging;
        q;

      )
        o(J[q]) ? n(e[J[q--]], t) : o(J[Q]) ? n(e[J[Q++]], t) : (q = 0);
    }
    function p(t) {
      (F = t.keyCode), (H = t.type == 'keyup'), (Z[F] = Z[r(F)] = !H), n(e[t.type], t);
    }
    function v(t) {
      e.autopause && (t.type == 'blur' ? b : C)(), n(e[t.type], t);
    }
    function C() {
      (e.now = +new Date()), (e.running = !0);
    }
    function b() {
      e.running = !1;
    }
    function P() {
      (e.running ? b : C)();
    }
    function A() {
      K && e.clearRect(0, 0, e.width, e.height);
    }
    function S() {
      (R = e.element.parentNode), (_ = x.indexOf(e)), R && R.removeChild(e.element), ~_ && x.splice(_, 1), u(!1), b();
    }
    let T;
    let k;
    let O;
    let R;
    let N;
    let _;
    let D;
    let B;
    let G;
    let W;
    let z;
    let F;
    let H;
    let q;
    let Q;
    var j = 0;
    var M = [];
    var U = !1;
    var X = w.devicePixelRatio;
    var Y = e.type == m;
    var K = e.type == d;
    var V = { x: 0, y: 0, ox: 0, oy: 0, dx: 0, dy: 0 };
    var J = [
      e.element,
      h,
      'mousedown',
      'touchstart',
      h,
      'mousemove',
      'touchmove',
      h,
      'mouseup',
      'touchend',
      h,
      'click',
      y,
      p,
      'keydown',
      'keyup',
      w,
      v,
      'focus',
      'blur',
      l,
      'resize',
    ];
    var Z = {};
    for (F in E) Z[E[F]] = !1;
    return (
      i(e, {
        touches: M,
        mouse: V,
        keys: Z,
        dragging: !1,
        running: !1,
        millis: 0,
        now: 0 / 0,
        dt: 0 / 0,
        destroy: S,
        toggle: P,
        clear: A,
        start: C,
        stop: b,
      }),
      x.push(e),
      e.autostart && C(),
      u(!0),
      l(),
      c(),
      e
    );
  }
  for (
    var l,
      s,
      f =
        'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split(
          ' '
        ),
      g = '__hasSketch',
      h = Math,
      d = 'canvas',
      p = 'webgl',
      m = 'dom',
      y = document,
      w = window,
      x = [],
      v = {
        fullscreen: !0,
        autostart: !0,
        autoclear: !0,
        autopause: !0,
        container: y.body,
        interval: 1,
        globals: !0,
        retina: !1,
        type: d,
      },
      E = {
        8: 'BACKSPACE',
        9: 'TAB',
        13: 'ENTER',
        16: 'SHIFT',
        27: 'ESCAPE',
        32: 'SPACE',
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN',
      },
      C = {
        CANVAS: d,
        WEB_GL: p,
        WEBGL: p,
        DOM: m,
        instances: x,
        install(t) {
          if (!t[g]) {
            for (let o = 0; o < f.length; o++) t[f[o]] = h[f[o]];
            i(t, {
              TWO_PI: 2 * h.PI,
              HALF_PI: h.PI / 2,
              QUATER_PI: h.PI / 4,
              random(t, o) {
                return e(t) ? t[~~(h.random() * t.length)] : (n(o) || ((o = t || 1), (t = 0)), t + h.random() * (o - t));
              },
              lerp(e, t, n) {
                return e + n * (t - e);
              },
              map(e, t, n, o, r) {
                return ((e - t) / (n - t)) * (r - o) + o;
              },
            }),
              (t[g] = !0);
          }
        },
        create(e) {
          return (
            (e = i(e || {}, v)),
            e.globals && C.install(self),
            (l = e.element = e.element || y.createElement(e.type === m ? 'div' : 'canvas')),
            (s = e.context =
              e.context ||
              (function () {
                switch (e.type) {
                  case d:
                    return l.getContext('2d', e);
                  case p:
                    return l.getContext('webgl', e) || l.getContext('experimental-webgl', e);
                  case m:
                    return (l.canvas = l);
                }
              })()),
            e.container.appendChild(l),
            C.augment(s, e)
          );
        },
        augment(e, t) {
          return (t = i(t || {}, v)), (t.element = e.canvas || e), (t.element.className += ' sketch'), i(e, t, !0), c(e);
        },
      },
      b = ['ms', 'moz', 'webkit', 'o'],
      P = self,
      A = 0,
      S = 'AnimationFrame',
      T = `request${S}`,
      k = `cancel${S}`,
      I = P[T],
      L = P[k],
      O = 0;
    O < b.length && !I;
    O++
  )
    (I = P[`${b[O]}Request${S}`]), (L = P[`${b[O]}Cancel${T}`]);
  return (
    (P[T] = I =
      I ||
      function (e) {
        const t = +new Date();
        const n = h.max(0, 16 - (t - A));
        const o = setTimeout(function () {
          e(t + n);
        }, n);
        return (A = t + n), o;
      }),
    (P[k] = L =
      L ||
      function (e) {
        clearTimeout(e);
      }),
    C
  );
})();
