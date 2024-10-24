!(function (t) {
  t.fn.counterUp = function (a) {
    let e;
    const n = t.extend(
      {
        time: 400,
        delay: 10,
        formatter: !1,
        callback() {},
      },
      a
    );
    return this.each(function () {
      const a = t(this);
      const u = {
        time: t(this).data('counterup-time') || n.time,
        delay: t(this).data('counterup-delay') || n.delay,
      };
      const r = function () {
        const t = [];
        const r = u.time / u.delay;
        let o = a.text();
        const c = /[0-9]+,[0-9]+/.test(o);
        o = o.replace(/,/g, '');
        const i = (o.split('.')[1] || []).length;
        const l = /[0-9]+:[0-9]+:[0-9]+/.test(o);
        if (l) {
          const s = o.split(':');
          let d = 1;
          for (e = 0; s.length > 0; ) (e += d * parseInt(s.pop(), 10)), (d *= 60);
        }
        for (let f = r; f >= 1; f--) {
          let p = parseFloat((o / r) * f).toFixed(i);
          if (l) {
            p = parseInt((e / r) * f);
            const m = parseInt(p / 3600) % 24;
            const h = parseInt(p / 60) % 60;
            const v = parseInt(p % 60, 10);
            p = `${m < 10 ? `0${m}` : m}:${h < 10 ? `0${h}` : h}:${v < 10 ? `0${v}` : v}`;
          }
          if (c) for (; /(\d+)(\d{3})/.test(p.toString()); ) p = p.toString().replace(/(\d+)(\d{3})/, '$1,$2');
          n.formatter && (p = n.formatter.call(this, p)), t.unshift(p);
        }
        a.data('counterup-nums', t), a.text('0');
        const y = function () {
          return a.data('counterup-nums')
            ? (a.html(a.data('counterup-nums').shift()),
              void (a.data('counterup-nums').length
                ? setTimeout(a.data('counterup-func'), u.delay)
                : (a.data('counterup-nums', null), a.data('counterup-func', null), n.callback.call(this))))
            : void n.callback.call(this);
        };
        a.data('counterup-func', y), setTimeout(a.data('counterup-func'), u.delay);
      };
      a.waypoint(
        function (t) {
          r(), this.destroy();
        },
        { offset: '100%' }
      );
    });
  };
})(jQuery);
