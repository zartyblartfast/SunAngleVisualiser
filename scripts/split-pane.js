/**! @preserve
Split Pane v0.4.0
Copyright (c) 2014 Simon Hagström
Released under the MIT license
https://raw.github.com/shagstrom/split-pane/master/LICENSE
*/
!(function (t) {
    t.fn.splitPane = function () {
        var e = this;
        e.each(i),
            e.append('<div class="split-pane-resize-shim">'),
            e.children(".split-pane-divider").bind("mousedown touchstart", n),
            setTimeout(function () {
                e.each(function () {
                    t(this).bind(
                        "_splitpaneparentresize",
                        (function (t) {
                            var e = t[0],
                                i = t.children(".split-pane-component:first")[0],
                                n = t.children(".split-pane-divider")[0],
                                s = t.children(".split-pane-component:last")[0];
                            {
                                if (t.is(".fixed-top")) {
                                    var f = r(s);
                                    return function (r) {
                                        var o = e.offsetHeight - f - n.offsetHeight;
                                        i.offsetHeight > o && a(i, n, s, o + "px"), t.resize();
                                    };
                                }
                                if (t.is(".fixed-bottom")) {
                                    var c = r(i);
                                    return function (f) {
                                        var r = e.offsetHeight - c - n.offsetHeight;
                                        s.offsetHeight > r && h(i, n, s, r + "px"), t.resize();
                                    };
                                }
                                if (t.is(".horizontal-percent")) {
                                    var f = r(s),
                                        c = r(i);
                                    return function (r) {
                                        var o = e.offsetHeight - c - n.offsetHeight;
                                        s.offsetHeight > o ? h(i, n, s, (o / e.offsetHeight) * 100 + "%") : e.offsetHeight - i.offsetHeight - n.offsetHeight < f && h(i, n, s, (f / e.offsetHeight) * 100 + "%"), t.resize();
                                    };
                                }
                                if (t.is(".fixed-left")) {
                                    var u = o(s);
                                    return function (f) {
                                        var r = e.offsetWidth - u - n.offsetWidth;
                                        i.offsetWidth > r && p(i, n, s, r + "px"), t.resize();
                                    };
                                }
                                if (t.is(".fixed-right")) {
                                    var l = o(i);
                                    return function (f) {
                                        var r = e.offsetWidth - l - n.offsetWidth;
                                        s.offsetWidth > r && d(i, n, s, r + "px"), t.resize();
                                    };
                                }
                                if (t.is(".vertical-percent")) {
                                    var u = o(s),
                                        l = o(i);
                                    return function (f) {
                                        var r = e.offsetWidth - l - n.offsetWidth;
                                        s.offsetWidth > r ? d(i, n, s, (r / e.offsetWidth) * 100 + "%") : e.offsetWidth - i.offsetWidth - n.offsetWidth < u && d(i, n, s, (u / e.offsetWidth) * 100 + "%"), t.resize();
                                    };
                                }
                            }
                        })(t(this))
                    );
                }),
                    t(window).trigger("resize");
            }, 100);
    };
    var e = "_splitpaneparentresizeHandler";
    function i() {
        var e = t(this),
            i = e.children(".split-pane-component:first"),
            n = e.children(".split-pane-divider"),
            s = e.children(".split-pane-component:last");
        e.is(".fixed-top, .fixed-bottom, .horizontal-percent") ? e.css("min-height", r(i) + r(s) + n.height() + "px") : e.css("min-width", o(i) + o(s) + n.width() + "px");
    }
    function n(e) {
        e.preventDefault();
        var i = e.type.match(/^touch/),
            n = i ? "touchmove" : "mousemove",
            c = i ? "touchend" : "mouseup",
            u = t(this),
            l = u.parent(),
            v = u.siblings(".split-pane-resize-shim");
        v.show(),
            u.addClass("dragged"),
            i && u.addClass("touch"),
            t(document).on(
                n,
                (function (t, e, i) {
                    var n = t[0],
                        c = t.children(".split-pane-component:first")[0],
                        u = t.children(".split-pane-divider")[0],
                        l = t.children(".split-pane-component:last")[0];
                    {
                        if (t.is(".fixed-top")) {
                            var v = r(c),
                                g = n.offsetHeight - r(l) - u.offsetHeight,
                                m = u.offsetTop - i;
                            return function (e) {
                                e.preventDefault();
                                var i = Math.min(Math.max(v, m + f(e)), g);
                                a(c, u, l, i + "px"), t.resize();
                            };
                        }
                        if (t.is(".fixed-bottom")) {
                            var x = r(l),
                                z = n.offsetHeight - r(c) - u.offsetHeight,
                                H = l.offsetHeight + i;
                            return function (e) {
                                e.preventDefault();
                                var i = Math.min(Math.max(x, H - f(e)), z);
                                h(c, u, l, i + "px"), t.resize();
                            };
                        }
                        if (t.is(".horizontal-percent")) {
                            var W = n.offsetHeight,
                                x = r(l),
                                z = W - r(c) - u.offsetHeight,
                                H = l.offsetHeight + i;
                            return function (e) {
                                e.preventDefault();
                                var i = Math.min(Math.max(x, H - f(e)), z);
                                h(c, u, l, (i / W) * 100 + "%"), t.resize();
                            };
                        }
                        if (t.is(".fixed-left")) {
                            var y = o(c),
                                w = n.offsetWidth - o(l) - u.offsetWidth,
                                M = u.offsetLeft - e;
                            return function (e) {
                                e.preventDefault();
                                var i = Math.min(Math.max(y, M + s(e)), w);
                                p(c, u, l, i + "px"), t.resize();
                            };
                        }
                        if (t.is(".fixed-right")) {
                            var b = o(l),
                                D = n.offsetWidth - o(c) - u.offsetWidth,
                                T = l.offsetWidth + e;
                            return function (e) {
                                e.preventDefault();
                                var i = Math.min(Math.max(b, T - s(e)), D);
                                d(c, u, l, i + "px"), t.resize();
                            };
                        }
                        if (t.is(".vertical-percent")) {
                            var E = n.offsetWidth,
                                b = o(l),
                                D = E - o(c) - u.offsetWidth,
                                T = l.offsetWidth + e;
                            return function (e) {
                                e.preventDefault();
                                var i = Math.min(Math.max(b, T - s(e)), D);
                                d(c, u, l, (i / E) * 100 + "%"), t.resize();
                            };
                        }
                    }
                })(l, s(e), f(e))
            ),
            t(document).one(c, function (e) {
                t(document).unbind(n), u.removeClass("dragged touch"), v.hide();
            });
    }
    function s(t) {
        var e = t.pageX || t.originalEvent.pageX;
        if (!e) {
            var i = t.targetTouches || t.originalEvent.targetTouches;
            if (i && i.length > 0) e = i[0].pageX;
        }
        return e;
    }
    function f(t) {
        var e = t.pageY || t.originalEvent.pageY;
        if (!e) {
            var i = t.targetTouches || t.originalEvent.targetTouches;
            if (i && i.length > 0) e = i[0].pageY;
        }
        return e;
    }
    function r(e) {
        return parseInt(t(e).css("min-height")) || 0;
    }
    function o(e) {
        return parseInt(t(e).css("min-width")) || 0;
    }
    function a(t, e, i, n) {
        (t.style.height = n), (e.style.top = n), (i.style.top = n);
    }
    function h(t, e, i, n) {
        (t.style.bottom = n), (e.style.bottom = n), (i.style.height = n);
    }
    function p(t, e, i, n) {
        (t.style.width = n), (e.style.left = n), (i.style.left = n);
    }
    function d(t, e, i, n) {
        (t.style.right = n), (e.style.right = n), (i.style.width = n);
    }
    jQuery.event.special._splitpaneparentresize = {
        setup: function (i, n) {
            var s = this,
                f = t(this).parent().closest(".split-pane")[0] || window;
            t(this).data(e, function (t) {
                (t.target === document ? window : t.target) === f ? ((t.type = "_splitpaneparentresize"), jQuery.event.dispatch.apply(s, arguments)) : t.stopPropagation();
            }),
                t(f).bind("resize", t(this).data(e));
        },
        teardown: function (i) {
            var n = t(this).parent().closest(".split-pane")[0] || window;
            t(n).unbind("resize", t(this).data(e)), t(this).removeData(e);
        },
    };
})(jQuery);
