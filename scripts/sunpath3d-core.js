var pd = pd || {};
! function() {
    pd.version = "0.1.2", pd.isBrowser = "undefined" != typeof window, pd.Const = {
        EPSILON: 1e-6,
        HALF_PI: .5 * Math.PI,
        TWO_PI: 2 * Math.PI,
        DEG2RAD: Math.PI / 180,
        RAD2DEG: 180 / Math.PI
    }, pd.Align = {
        NONE: 0,
        LEFT: 1,
        CENTER: 2,
        RIGHT: 4,
        BOTTOM: 8,
        MIDDLE: 16,
        TOP: 32,
        BASELINE: 64,
        BOT_LEFT: 9,
        BOT_CENTER: 10,
        BOT_RIGHT: 12,
        MID_LEFT: 17,
        MID_CENTER: 18,
        MID_RIGHT: 20,
        TOP_LEFT: 33,
        TOP_CENTER: 34,
        TOP_RIGHT: 36,
        OUTSIDE: 1,
        INSIDE: 2
    }, pd.Align.isLeft = function(t) {
        return t & pd.Align.LEFT
    }, pd.Align.isCenter = function(t) {
        return t & pd.Align.CENTER
    }, pd.Align.isRight = function(t) {
        return t & pd.Align.RIGHT
    }, pd.Align.isTop = function(t) {
        return t & pd.Align.TOP
    }, pd.Align.isMiddle = function(t) {
        return t & pd.Align.MIDDLE
    }, pd.Align.isBottom = function(t) {
        return t & pd.Align.BOTTOM
    }, pd.sign = function(t) {
        return t < 0 ? -1 : 1
    }, pd.isNumeric = function(t) {
        return null != t && isFinite(parseFloat(t))
    }, pd.isNumber = function(t) {
        return null != t && isFinite(t)
    }, pd.toNumber = function(t, e) {
        return t = parseFloat(t), isFinite(t) ? t : e
    }, pd.toNumberInRange = function(t, e, r, n) {
        return pd.constrainTo(pd.toNumber(t, e), r, n)
    }, pd.isInteger = function(t) {
        return null != t && isFinite(t) && Math.round(t) === t
    }, pd.toInteger = function(t, e) {
        return t = parseFloat(t), isFinite(t) ? Math.round(t) : Math.round(+e)
    }, pd.toBoolean = function(t, e) {
        return null != t ? !!t : !!e
    }, pd.isBetween = function(t, e, r, n) {
        return n = +n || 0, !!isFinite(t) && (e - n < t && t < r + n || r - n < t && t < e + n)
    }, pd.isBetweenInclusive = function(t, e, r) {
        var n = pd.Const.EPSILON;
        return !(!isFinite(t) || t > Math.max(e, r) + n) && !(t < Math.min(e, r) - n)
    }, pd.isPowerOfTwo = function(t) {
        return 0 == (t & t - 1)
    }, pd.nextPowerOfTwo = function(t) {
        return --t, t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, t |= t >> 16, ++t
    }, pd.closeTo = function(t, e, r) {
        return r = r || pd.Const.EPSILON, !(!isFinite(t) || e + r < t || t < e - r)
    }, pd.constrainTo = function(t, e, r) {
        if (!isFinite(t)) return e;
        if (r < e) {
            if (e < t) return e;
            if (t < r) return r
        } else {
            if (t < e) return e;
            if (r < t) return r
        }
        return t
    }, pd.wrapAt = function(t, e, r, n) {
        var i = Math.min(r, e),
            e = Math.max(r, e);
        if (n && t > e - pd.Const.EPSILON && t < e + pd.Const.EPSILON) return i;
        if (t < i || e < t) {
            n = e - i;
            return 0 < n ? t = t < i ? e - (i - t) % n : i + (t - i) % n : i
        }
        return t
    }, pd._fastWrap = function(t, e, r) {
        if (t < e || r < t) {
            var n = r - e;
            return 0 < n ? t < e ? r - (e - t) % n : e + (t - e) % n : e
        }
        return t
    }, pd.snapTo = function(t, e) {
        return (e = e || 1) * Math.round(t / e)
    }, pd.incrementBy = function(t, e) {
        var r = (e = e || 1) * Math.floor(t / e) + e,
            n = Math.abs(.1 * e);
        return r - n < t && t < r + n ? r + e : r
    }, pd.mapAndConstrainTo = function(t, e, r, n, i) {
        r -= e;
        return Math.abs(r) < pd.Const.EPSILON ? .5 * (n + i) : pd.constrainTo(n + (t - e) / r * (i - n), n, i)
    }, pd.mapTo = function(t, e, r, n, i) {
        r -= e;
        return Math.abs(r) < pd.Const.EPSILON ? .5 * (n + i) : n + (t - e) / r * (i - n)
    }, pd.interpolate = function(t, e, r) {
        return t + r * (e - t)
    }, pd.getTickIncrement = function(t, e) {
        var r = Math.pow(10, Math.floor(Math.log10(t)));
        r < pd.Const.EPSILON && (r = 1);
        var n = t / r;
        return n <= .1 * (e = e || 20) ? .1 * r : n <= .2 * e ? .2 * r : n <= .5 * e ? .5 * r : n <= e ? r : pd.snapTo(t / e, .1 * r)
    }, pd.randomRange = function(t, e) {
        return Math.random() * (e - t) + t
    }, pd.safeDivide = function(t, e) {
        return Math.abs(e) < 1e-9 ? 0 : t / e
    }, pd.degreesToRadians = function(t) {
        return t * pd.Const.DEG2RAD
    }, pd.radiansToDegrees = function(t) {
        return t * pd.Const.RAD2DEG
    }, pd.sinDegrees = function(t) {
        return Math.sin(t * pd.Const.DEG2RAD)
    }, pd.cosDegrees = function(t) {
        return Math.cos(t * pd.Const.DEG2RAD)
    }, pd.tanDegrees = function(t) {
        return Math.tan(t * pd.Const.DEG2RAD)
    };
    var e = 987655555,
        r = 123455555,
        n = 4294967295;
    pd.randomNumber = function(t) {
        return t && (e = 987654321 + t, r = 123456789 - t), (((r = 36969 * (65535 & r) + (r >> 16) & n) << 16) + (e = 18e3 * (65535 & e) + (e >> 16) & n) & n) / 4294967296 + .5
    }, pd.randomNumberInRange = function(t, e) {
        return pd.randomNumber() * (e - t) + t
    }, pd.RandomNumberCache = function(t, e, r) {
        this.array = [], this.count = 0, this.index = 0, this.rebuild(t, e, r)
    }, pd.RandomNumberCache.prototype.rebuild = function(t, e, r) {
        if (t = pd.constrainTo(pd.toInteger(t, 64), 2, 2048), arguments.length < 2 || isNaN(e) || isNaN(r))
            for (var n = e - r, i = this.array.length, a = 0; a < t; ++a) o = pd.randomNumber(), a < i ? this.array[a] = o : this.array.push(o);
        else
            for (var o, n = e - r, i = this.array.length, a = 0; a < t; ++a) o = e + pd.randomNumber() * n, a < i ? this.array[a] = o : this.array.push(o);
        return this.count = t, this.array.length = t, this.index = 0, this
    }, pd.RandomNumberCache.prototype.next = function() {
        return ++this.index >= this.count && (this.index = 0), this.array[this.index]
    }, pd.RandomNumberCache.prototype.reset = function(t, e, r) {
        return this.index = 0, this
    }, pd.toHexColorString = function(t) {
        var e, r = "#";
        return pd.isArray(t) ? ((e = Math.round(255 * t[0])) < 16 && (r += "0"), r += e.toString(16).toUpperCase(), (e = Math.round(255 * t[1])) < 16 && (r += "0"), r += e.toString(16).toUpperCase(), (e = Math.round(255 * t[2])) < 16 && (r += "0"), r += e.toString(16).toUpperCase()) : "none"
    }, pd.visibleTextColor = function(t, e) {
        return t ? pd.isArray(t) || (t = pd.parseHexColorString(t.toString())) : t = [0, 0, 0], .65 < .265 * t[0] + .67 * t[1] + .065 * t[2] ? e ? "#888" : "#000" : e ? "#CCC" : "#FFF"
    }, pd.parseHexColorString = function(t, e) {
        if (e = e || [1, 1, 1, 1], t && 1 < t.length)
            if (0 <= t.indexOf("[") && 0 <= t.indexOf("]")) {
                if ((r = JSON.parse(t)) && pd.isArray(r)) return e[0] = pd.constrainTo(pd.toNumber(r[0], 0), 0, 1), e[1] = pd.constrainTo(pd.toNumber(r[1], 0), 0, 1), e[2] = pd.constrainTo(pd.toNumber(r[2], 0), 0, 1), e[3] = pd.constrainTo(pd.toNumber(r[3], 1), 0, 1), e
            } else {
                var r;
                t = t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(t, e, r, n) {
                    return e + e + r + r + n + n
                }), (r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t)) && (e[0] = parseInt(r[1], 16) / 255, e[1] = parseInt(r[2], 16) / 255, e[2] = parseInt(r[3], 16) / 255, e[3] = 1)
            }
        return e
    }, pd.randomColorArray = function(t, e) {
        var r, n = [];
        return t = pd.constrainTo(pd.toNumber(t, 0), -.9, .9), e && pd.randomNumber(e), 1e-4 < t ? (r = 1 - t, n[0] = t + pd.randomNumber() * r, n[1] = t + pd.randomNumber() * r, n[2] = t + pd.randomNumber() * r) : t < -1e-4 ? (r = 1 + t, n[0] = pd.randomNumber() * r, n[1] = pd.randomNumber() * r, n[2] = pd.randomNumber() * r) : (n[0] = pd.randomNumber(), n[1] = pd.randomNumber(), n[2] = pd.randomNumber()), n[3] = 1, n
    }, pd.modifiyColorArray = function(t, e, r) {
        return (t = t || [])[0] = pd.constrainTo(+e[0] * r, 0, 1), t[1] = pd.constrainTo(+e[1] * r, 0, 1), t[2] = pd.constrainTo(+e[2] * r, 0, 1), t[3] = pd.toNumber(e[3], 1), t
    }, pd.setColorArray = function(t, e, r, n, i) {
        var a;
        return t = t || [], 2 == arguments.length && pd.isArray(e) ? (a = e, t[0] = +a[0] || 0, t[1] = +a[1] || 0, t[2] = +a[2] || 0, t[3] = pd.toNumber(a[3], 1)) : (t[0] = +e || 0, t[1] = +r || 0, t[2] = +n || 0, t[3] = pd.toNumber(i, 1)), t
    }, pd.setVectorArray = function(t, e, r, n) {
        var i;
        return t = t || [], 2 == arguments.length && pd.isArray(e) ? (i = e, t[0] = +i[0] || 0, t[1] = +i[1] || 0, t[2] = +i[2] || 0) : (t[0] = +e || 0, t[1] = +r || 0, t[2] = +n || 0), t
    }, pd.notZeroLength = function(t) {
        return 1e-9 < t[0] || t[0] < -1e-9 || 1e-9 < t[1] || t[1] < -1e-9 || 1e-9 < t[2] || t[2] < -1e-9
    }, pd.cloneSimpleObject = function(t) {
        return JSON.parse(JSON.stringify(t))
    }, pd.hashMapFactory = function() {
        return Object.create(null)
    }, pd.hashMapHasEntry = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, pd.hashMapValues = function(t) {
        var e, r = [];
        for (e in t) null != e && r.push(t[e]);
        return r
    }, pd.hashMapIsEmpty = function(t) {
        for (var e in t)
            if (null != e) return !1;
        return !0
    }, pd.hashMapClear = function(t) {
        for (var e in t) delete t[e]
    }, Array.prototype.fill || Object.defineProperty(Array.prototype, "fill", {
        value: function(t) {
            if (null == this) throw new TypeError("this is null or not defined");
            for (var e = Object(this), r = e.length >>> 0, n = arguments[1] >> 0, i = n < 0 ? Math.max(r + n, 0) : Math.min(n, r), n = arguments[2], n = void 0 === n ? r : n >> 0, a = n < 0 ? Math.max(r + n, 0) : Math.min(n, r); i < a;) e[i] = t, i++;
            return e
        }
    });
    var i = 1.6 * Math.PI,
        a = Math.PI / 1.5;
    pd.colorScaleRainbow = function(t, e) {
            e = e || [];
            t = pd.constrainTo(t, 0, 1) * i;
            return e[0] = .5 - .5 * Math.sin(t), e[1] = .5 - .5 * Math.sin(t += a), e[2] = .5 - .5 * Math.sin(t += a), e[3] = 1, e
        }, pd.colorScaleRed = function(t, e) {
            e = e || [];
            var r = .75 * (t = pd.constrainTo(t, 0, 1));
            return e[0] = .25 + r, e[1] = e[2] = t * r, e[3] = 1, e
        }, pd.colorScaleGreen = function(t, e) {
            return e = e || [], t = pd.constrainTo(t, 0, 1), e[0] = .5 < t ? 1.6 * (t - .5) : 0, e[1] = .4 + .6 * t, e[2] = 0, e[3] = 1, e
        }, pd.colorScaleBlue = function(t, e) {
            e = e || [];
            var r = .75 * (t = pd.constrainTo(t, 0, 1));
            return e[0] = e[1] = t * r, e[2] = .25 + r, e[3] = 1, e
        }, pd.colorScaleRedWhiteBlue = function(t, e) {
            e = e || [];
            t = pd.constrainTo(t, 0, 1);
            return t <= .5 ? (e[0] = e[1] = 2 * t, e[2] = 1) : (e[0] = 1, e[1] = e[2] = pd.mapAndConstrainTo(t, .5, .95, 1, 0)), e[3] = 1, e
        }, pd.colorScaleSepia = function(t, e) {
            e = e || [];
            t = .1 + .9 * pd.constrainTo(t, 0, 1);
            return e[0] = t, e[1] = t, e[2] = .25 * t, e[3] = 1, e
        }, pd.colorScaleEcotect = function(t, e) {
            e = e || [];
            var r = 2.1 * pd.constrainTo(t, 0, 1),
                n = 0,
                t = 0;
            return 1 < r && (n = r - 1, r = 1), 1 < n && (n = 1), n < 0 && (n = 0), r < 0 && (r = 0), t = 1 - r, e[0] = r, e[1] = n, e[2] = t, e[3] = 1, e
        }, pd.startsWith = function(t, e) {
            return 0 === t.indexOf(e)
        }, pd.endsWith = function(t, e) {
            var r = t.length - e.length,
                e = t.indexOf(e, r);
            return -1 !== e && e === r
        }, pd.indexOfLowerCase = function(t, e) {
            return pd.isString(e) && pd.isString(t) ? t.toLowerCase().indexOf(e.toLowerCase()) : -1
        }, pd.countOccurrences = function(t, e, r) {
            if (!pd.isString(e) || !pd.isString(t) || e.length <= 0) return 0;
            for (var n = 0, i = 0, a = r ? 1 : e.length; 0 <= (n = t.indexOf(e, n));) n += a, ++i;
            return i
        }, pd.toStringWithLeadingZeros = function(t, e) {
            var r = String(t);
            for (e = pd.toInteger(e, 2); r.length < e;) r = "0" + r;
            return r
        }, pd.toStringWithPrecision = function(t, e) {
            return (t = parseFloat(t)).toFixed(pd.toInteger(e, 3))
        }, pd.toStringWithPrecisionRange = function(t, e, r) {
            if (e < 0 || r < 0) throw new Error("ERROR: Minimum and maximum decimal places must be zero or positive.");
            if (t = parseFloat(t), r <= e) return t.toFixed(e);
            var n = t.toFixed(r).split(".");
            if (n.length < 2) return t.toFixed(e);
            var i = n[1].length;
            if (i <= e) return t.toFixed(e);
            for (var a = i - 1; e <= a && "0" == n[1].charAt(a); a--) i--;
            return 0 < i ? n[0] + "." + n[1].slice(0, i) : n[0]
        }, pd.toCamelCase = function(t) {
            return t.replace(/([-_][a-z])/g, function(t) {
                return t.toUpperCase().replace(/[-_]/, "")
            })
        }, pd.fromCamelCase = function(t, e) {
            return e = e || "-", t.replace(/([A-Z])/g, function(t) {
                return e + t.toLowerCase()
            })
        }, pd.UnitType = {
            NONE: 0,
            FRACTION: 1,
            PERCENTAGE: 2,
            LENGTH: 3,
            AREA: 4,
            VOLUME: 5,
            TIME_HRS: 6,
            TIME_MINS: 7,
            DATE: 8
        }, pd.DimensionType = {
            DEFAULT: 0,
            METRIC_MM: 1,
            METRIC_SI: 2,
            IMPERIAL: 3
        }, pd.Dimension = {}, pd.Dimension.type = pd.DimensionType.METRIC_MM, pd.Dimension.formatFeetAndInches = function(t) {
            var e = "",
                r = pd.sign(t),
                n = Math.abs(t) / 25.4 / 12 + .001,
                i = 12 * (n - Math.floor(n)) + .001,
                t = 16 * (i - Math.floor(i)) + .001;
            return t = Math.floor(t), i = Math.floor(i), (0 < (n = Math.floor(n)) || i < .001 && t < .999) && (e += n.toString() + "'"), (0 < i || 1 <= t) && (0 < n && (e += " "), e += i.toString() + '"'), 1 <= t && (0 < e.length && (e += " "), e += t % 8 == 0 ? Math.round(t / 8).toString() + "/2" : t % 4 == 0 ? Math.round(t / 4).toString() + "/4" : t % 2 == 0 ? Math.round(t / 2).toString() + "/8" : t.toString() + "/16"), r < 0 ? "-" + e : e
        }, pd.Dimension.formatDimension = function(t, e, r, n) {
            switch (e = e || pd.Dimension.type) {
                default:
                    case pd.DimensionType.METRIC_MM:
                    return (!pd.isNumeric(r) || r < 0) && (r = 0), n ? t.toFixed(r) + " mm" : t.toFixed(r);
                case pd.DimensionType.METRIC_SI:
                        return (!pd.isNumeric(r) || r < 0) && (r = 3), n ? (t / 1e3).toFixed(r) + " m" : (t / 1e3).toFixed(r);
                case pd.DimensionType.IMPERIAL:
                        return pd.Dimension.formatFeetAndInches(t)
            }
        }, pd.Dimension.formatDistance = function(t, e, r, n) {
            switch (e = e || pd.Dimension.type) {
                default:
                    case pd.DimensionType.METRIC_MM:
                    case pd.DimensionType.METRIC_SI:
                    return (!pd.isNumeric(r) || r < 0) && (r = 3), n ? (t / 1e3).toFixed(r) + " m" : (t / 1e3).toFixed(r);
                case pd.DimensionType.IMPERIAL:
                        return pd.Dimension.formatFeetAndInches(t)
            }
        }, pd.Dimension.formatArea = function(t, e, r, n) {
            var i = "";
            return e = e || pd.Dimension.type, (!pd.isNumeric(r) || r < 0) && (r = 3), e !== pd.DimensionType.IMPERIAL ? (i = t.toFixed(r), n && (i += " m2")) : (i = (10.7639104 * t).toFixed(r), n && (i += " ft3")), i
        }, pd.Dimension.formatVolume = function(t, e, r, n) {
            var i = "";
            return e = e || pd.Dimension.type, (!pd.isNumeric(r) || r < 0) && (r = 3), e !== pd.DimensionType.IMPERIAL ? (i = (1e-9 * t).toFixed(r), n && (i += " m3")) : (i = (35.314666721 * t).toFixed(r), n && (i += " ft3")), i
        }, pd.Dimension.getDefaultStep = function(t) {
            switch (t = t || pd.Dimension.type) {
                default:
                    case pd.DimensionType.METRIC_MM:
                    case pd.DimensionType.METRIC_SI:
                    return 25;
                case pd.DimensionType.IMPERIAL:
                        return 25.4
            }
        }, pd.Dimension.getSmallStep = function(t) {
            switch (t = t || pd.Dimension.type) {
                default:
                    case pd.DimensionType.METRIC_MM:
                    case pd.DimensionType.METRIC_SI:
                    return 5;
                case pd.DimensionType.IMPERIAL:
                        return 6.35
            }
        }, pd.Dimension.getIncrement = function(t, e, r) {
            var n, i;
            return e = pd.toNumber(e, 0), r = pd.toNumber(r, pd.Dimension.getDefaultStep()), e = e && (pd.Dimension.type == pd.DimensionType.IMPERIAL ? (i = 1.5875, 900 < r ? (n = 4572, r = 25.4) : 300 < r ? (n = 914.4, r = 25.4) : 15 < r ? (n = 304.8, r = 25.4) : .99 < r ? (n = 304.8, r = 1) : (r = 1.5875, n = 25.4), r < i && (r = i), t && t.shiftKey ? Math.abs(e) < 10 ? n * pd.sign(e) : 5 * n * pd.sign(e) : t && (t.ctrlKey || t.metaKey) ? Math.abs(e) < 10 ? i * pd.sign(e) : 4 * i * pd.sign(e) : Math.abs(e) < 10 ? r * pd.sign(e) : n * pd.sign(e)) : (n = 5 * r, r < (i = 1) && (r = i), t && t.shiftKey ? Math.abs(e) < 5 ? n * pd.sign(e) : Math.abs(e) < 10 ? 5 * n * pd.sign(e) : 10 * n * pd.sign(e) : t && (t.ctrlKey || t.metaKey) ? Math.abs(e) < 10 ? i * pd.sign(e) : 5 * i * pd.sign(e) : Math.abs(e) < 10 ? r * pd.sign(e) : n * pd.sign(e)))
        }, pd.Dimension.incrementDimension = function(t, e, r, n) {
            return pd.incrementBy(pd.toNumber(r, 0), pd.Dimension.getIncrement(t, e, n))
        }, pd.Dimension.formatArea = function(t, e, r) {
            switch (e = e || pd.Dimension.type) {
                default:
                    case pd.DimensionType.METRIC_MM:
                    case pd.DimensionType.METRIC_SI:
                    return (!pd.isNumeric(r) || r < 0) && (r = 2), t.toFixed(r) + " m2";
                case pd.DimensionType.IMPERIAL:
                        return (!pd.isNumeric(r) || r < 0) && (r = 1), (10.76391041671 * t).toFixed(r) + " ft2"
            }
        }, pd.Dimension.parseDimension = function(t, e) {
            var r = 0 === (t = t.toString().trim()).indexOf("=");
            switch (e = e || pd.Dimension.type, /\'|\"/.test(t) ? (e = pd.DimensionType.IMPERIAL, r = !1) : 0 <= t.indexOf("ft") || 0 < t.indexOf("in") ? (t = (t = t.replace("ft", "'")).replace("in", '"'), e = pd.DimensionType.IMPERIAL, r = !1) : 0 < t.indexOf("mm") ? e = pd.DimensionType.METRIC_MM : 0 < t.indexOf("m") && (e = pd.DimensionType.METRIC_SI), e) {
                default:
                    case pd.DimensionType.METRIC_MM:
                    return pd.parseEqn(t);
                case pd.DimensionType.METRIC_SI:
                        return 1e3 * pd.parseEqn(t);
                case pd.DimensionType.IMPERIAL:
                        var n = 0,
                        i = 0,
                        a = 0;
                    if (0 <= t.indexOf("'") || 0 <= t.indexOf('"'))
                        for (var o = t.split(/([\s\'\"]+)/), s = 0; s < o.length; s += 2) {
                            0 <= o[s].indexOf("/") ? 1 < (d = o[s].split("/")).length && (h = parseFloat(d[0]), .1 < (l = parseFloat(d[1])) && (a = h / l)) : s < o.length - 1 && 0 < o[s + 1].length ? 0 <= o[s + 1].indexOf('"') || 0 <= o[s + 1].indexOf("''") || 0 <= o[s + 1].indexOf(" ") && 0 < s ? i = parseFloat(o[s]) : (0 <= o[s + 1].indexOf("'") || 0 <= o[s + 1].indexOf(" ") && 0 == s) && (n = parseFloat(o[s])) : 0 < o[s].length && (0 < s || 0 < n ? i = parseFloat(o[s]) : n = parseFloat(o[s]))
                        } else {
                            if (r) return 304.8 * pd.parseEqn(t);
                            for (var d, h, l, o = t.split(" "), s = 0; s < o.length; ++s) {
                                0 < o[s].length && (0 <= o[s].indexOf("/") ? 1 < (d = o[s].split("/")).length && (h = parseFloat(d[0]), .1 < (l = parseFloat(d[1])) && (a = h / l)) : 0 < s ? i = parseFloat(o[s]) : n = parseFloat(o[s]))
                            }
                        }
                    return 304.8 * n + 25.4 * i + 25.4 * a
            }
        }, pd.Indexer = function(t, e) {
            this.unique = pd.isArray(t) ? t : [], this.map = pd.hashMapFactory(), this.decimals = pd.toInteger(e, 3), this.indexId = 0
        }, pd.Indexer.prototype.addObject = function(t) {
            var e, r = JSON.stringify(t);
            return r in this.map ? e = this.map[r] : (e = this.map[r] = this.unique.length, this.unique.push(t)), e
        }, pd.Indexer.prototype.addById = function(t) {
            var e, r;
            return t._indexId || (t._indexId = ++this.indexId), (r = t._indexId) in this.map ? e = this.map[r] : (e = this.map[r] = this.unique.length, this.unique.push(t)), e
        }, pd.Indexer.prototype.addVectorArray = function(t) {
            var e, r = this.decimals,
                r = "[" + t[0].toFixed(r) + "," + t[1].toFixed(r) + "," + t[2].toFixed(r) + "]";
            return r in this.map ? e = this.map[r] : (e = this.map[r] = this.unique.length, this.unique.push(t)), e
        }, pd.IndexCounter = function(t) {
            this.unique = pd.isArray(t) ? t : [], this.counter = [], this.map = pd.hashMapFactory()
        }, pd.IndexCounter.prototype.count = function(t) {
            var e = JSON.stringify(t);
            e in this.map || (this.map[e] = this.unique.length, this.unique.push(t), this.counter.push(0));
            t = this.map[e];
            return this.counter[t]++, this.map[e]
        }, pd.copyArray = function(t, e, r) {
            r = r || Math.round(Math.min(t.length, e.length));
            for (var n = 0; n < r; ++n) e[n] = t[n]
        }, pd.isArray = Array.isArray || function(t) {
            return !!t && "[object Array]" === Object.prototype.toString.call(t)
        }, pd.isTypedArray = function(t) {
            return !!t && (t.BYTES_PER_ELEMENT && void 0 !== t.byteLength)
        }, pd.isObject = function(t) {
            return null !== t && ("object" == typeof t || "function" == typeof t)
        }, pd.isString = function(t) {
            return "string" == typeof t || t instanceof String
        }, pd.isFunction = function(t) {
            return "function" == typeof t
        }, pd.isAlpha = function(t) {
            return /^[A-Za-z]$/.test(t)
        }, pd.sleepFor = function(t) {
            for (var e = (new Date).getTime();
                (new Date).getTime() < e + t;);
            return pd
        }, pd.parseEqn = parseFloat, pd.parseCSV = function(t) {
            for (var e, r = [""], n = !1, i = 0, a = 0; a < t.length; ++a)
                if ('"' == (e = t[a]) && n && '"' == t[a + 1]) r[i] += e, ++a;
                else if ('"' != e)
                if ("," != e || n) {
                    if ("\n" == e && !n) break;
                    r[i] += e
                } else r[++i] = "";
            else n = !n;
            return r
        },
        /**
         * Simple class to create a 32char globally unique identifier (GUID).
         *
         * See: [Fast UUID generator, RFC4122 version 4 compliant](http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136).
         * @author Jeff Ward (jcward.com).
         * @license MIT license
         * @class
         **/
        pd.GUID = function() {
            for (var t = {}, i = [], e = 0; e < 256; ++e) i[e] = (e < 16 ? "0" : "") + e.toString(16);
            return t.generate = function() {
                var t = 4294967295 * Math.random() | 0,
                    e = 4294967295 * Math.random() | 0,
                    r = 4294967295 * Math.random() | 0,
                    n = 4294967295 * Math.random() | 0;
                return i[255 & t] + i[t >> 8 & 255] + i[t >> 16 & 255] + i[t >> 24 & 255] + "-" + i[255 & e] + i[e >> 8 & 255] + "-" + i[e >> 16 & 15 | 64] + i[e >> 24 & 255] + "-" + i[63 & r | 128] + i[r >> 8 & 255] + "-" + i[r >> 16 & 255] + i[r >> 24 & 255] + i[255 & n] + i[n >> 8 & 255] + i[n >> 16 & 255] + i[n >> 24 & 255]
            }, t
        }(), pd.addSimpleEventHandling = function(a) {
            a._pd_events = a._pd_events || {}, a.on = function(t, e) {
                return "string" == typeof t && (t = t.trim(), a._pd_events[t] && pd.isArray(a._pd_events[t]) || (a._pd_events[t] = []), e && a._pd_events[t].indexOf(e) < 0 && a._pd_events[t].push(e)), a
            }, a.off = function(t, e) {
                return "string" == typeof t && (t = t.trim(), a._pd_events[t] && pd.isArray(a._pd_events[t]) && (-1 < (e = a._pd_events[t].indexOf(e)) && a._pd_events[t].splice(e, 1))), a
            }, a.emit = function(t) {
                if (a._pd_events[t] && pd.isArray(a._pd_events[t]))
                    for (var e = [].slice.call(arguments, 1), r = a._pd_events[t], n = 0, i = r.length; n < i; ++n) r[n].apply(a, e);
                return a
            }, a.once = function(e, r) {
                return a.on(e, function t() {
                    a.removeListener(e, t), r.apply(a, arguments)
                }), a
            }
        }, pd.Easing = {
            linear: function(t) {
                return t
            },
            inSine: function(t) {
                return 1 - Math.sin(pd.Const.HALF_PI + t * pd.Const.HALF_PI)
            },
            outSine: function(t) {
                return Math.sin(t * pd.Const.HALF_PI)
            },
            inOutSine: function(t) {
                return .5 * (1 + Math.sin(-pd.Const.HALF_PI + t * Math.PI))
            },
            inOutSinePow: function(t, e) {
                return e = +e || 2, Math.pow(.5 * (1 + Math.cos(-Math.PI + t * Math.PI)), e)
            },
            inQuad: function(t) {
                return t * t
            },
            outQuad: function(t) {
                return t * (2 - t)
            },
            inOutQuad: function(t) {
                return t < .5 ? 2 * t * t : (4 - 2 * t) * t - 1
            },
            inCubic: function(t) {
                return t * t * t
            },
            outCubic: function(t) {
                return --t * t * t + 1
            },
            inOutCubic: function(t) {
                return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
            },
            inQuart: function(t) {
                return t * t * t * t
            },
            outQuart: function(t) {
                return 1 - --t * t * t * t
            },
            inOutQuart: function(t) {
                return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
            },
            inQuint: function(t) {
                return t * t * t * t * t
            },
            outQuint: function(t) {
                return 1 + --t * t * t * t * t
            },
            inOutQuint: function(t) {
                return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
            },
            inExpo: function(t) {
                return (Math.pow(2, 8 * t) - 1) / 255
            },
            outExpo: function(t) {
                return 1 - Math.pow(2, -8 * t)
            },
            inOutExpo: function(t) {
                return t < .5 ? (Math.pow(2, 16 * t) - 1) / 510 : 1 - .5 * Math.pow(2, -16 * (t - .5))
            },
            inCirc: function(t) {
                return 1 - Math.sqrt(1 - t)
            },
            outCirc: function(t) {
                return Math.sqrt(t)
            },
            inOutCirc: function(t) {
                return t < .5 ? .5 * (1 - Math.sqrt(1 - 2 * t)) : .5 * (1 + Math.sqrt(2 * t - 1))
            },
            inBack: function(t) {
                return t * t * (2.70158 * t - 1.70158)
            },
            outBack: function(t) {
                return 1 + --t * t * (2.70158 * t + 1.70158)
            },
            inOutBack: function(t) {
                return t < .5 ? t * t * (7 * t - 2.5) * 2 : 1 + --t * t * 2 * (7 * t + 2.5)
            },
            inBounce: function(t) {
                var e = t * t;
                return e * e * Math.sin(t * Math.PI * 4.5)
            },
            outBounce: function(t) {
                var e = (t - 1) * (t - 1);
                return 1 - e * e * Math.cos(t * Math.PI * 4.5)
            },
            inOutBounce: function(t) {
                var e;
                return t < .45 ? 8 * (e = t * t) * e * Math.sin(t * Math.PI * 9) : t < .55 ? .5 + .75 * Math.sin(t * Math.PI * 4) : 1 - 8 * (e = (t - 1) * (t - 1)) * e * Math.sin(t * Math.PI * 9)
            },
            inWobble: function(t) {
                return (.04 + .02 / t) * Math.sin(25 * t)
            },
            outWobble: function(t) {
                return (.04 - .04 / t) * Math.sin(25 * t) + 1
            },
            inOutWobble: function(t) {
                return (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1
            },
            outElastic: function(t, e) {
                return e = e || .35, Math.pow(2, -10 * t) * Math.sin((t - e / 4) * (2 * Math.PI) / e) + 1
            }
        }
}(),
function() {
    var d = "num",
        h = "var";

    function l(t) {
        return pd.isString(t) && null !== t.match(/^[A-Za-z]+$/)
    }
    var c = /\s*([A-Za-z]+|(\d*\.?\d+\.?)+|\S)\s*/g;

    function a(t) {
        var e = 0,
            r = function(t) {
                for (var e, r = []; null !== (e = c.exec(t));) r.push(e[1]);
                return r
            }(t);

        function n() {
            return r[e]
        }

        function i() {
            e++
        }

        function a() {
            var t, e = n();
            if (t = e, pd.isString(t) && null !== t.match(/^\d*\.?\d+\.?/)) return i(), {
                type: d,
                value: e
            };
            if (l(e)) return i(), {
                type: h,
                name: e
            };
            if ("(" === e) {
                i();
                var r = s();
                if (")" !== n()) throw new SyntaxError("Unmatched closing bracket found.");
                return i(), r
            }
            if ("-" !== e) throw new SyntaxError("Expected a number, variable or bracket, but found: " + e);
            return i(), (r = a()).value = "-" + r.value, r
        }

        function o() {
            for (var t = a(), e = n();
                "*" === e || "/" === e || "^" === e;) {
                i();
                t = {
                    type: e,
                    left: t,
                    right: a()
                }, e = n()
            }
            return t
        }

        function s() {
            for (var t = o(), e = n();
                "+" === e || "-" === e;) {
                i();
                t = {
                    type: e,
                    left: t,
                    right: o()
                }, e = n()
            }
            return t
        }
        return s()
    }
    var o = {},
        e = {
            PI: Math.PI,
            E: Math.E
        };

    function s(t) {
        switch (t.type) {
            case d:
                return parseFloat(t.value);
            case h:
                return e[t.name] || o[t.name] || 0;
            case "^":
                return Math.pow(s(t.left), s(t.right));
            case "+":
                return s(t.left) + s(t.right);
            case "-":
                return s(t.left) - s(t.right);
            case "*":
                return s(t.left) * s(t.right);
            case "/":
                return s(t.left) / s(t.right)
        }
        throw new SyntaxError("Unrecognised symbol: " + t.toString())
    }
    var u = null;
    pd.parseEqn = u = function(t, e) {
        var r, n, i;
        pd.parseEqn.error && (pd.parseEqn.error = "");
        try {
            if (pd.isString(t) && 0 <= t.indexOf("=") ? 1 < (n = t.split("=", 2)).length ? (r = s(a(n[1])), l(i = n[0].trim()) && (o[i] = r, u.emit("assign", i, r))) : r = s(a(n[0])) : r = parseFloat(t), NaN == r) throw new SyntaxError("Invalid numeric input: " + t.toString())
        } catch (t) {
            pd.parseEqn.error = t.message, u.emit("error", pd.parseEqn.error), r = NaN
        }
        return r
    }, pd.addSimpleEventHandling(u), pd.parseEqn.error = ""
}();
var pd3D = pd3D || {};
! function() {
    function n(t, e, r) {
        return e == r ? Math.abs(t - e) < 1e-9 : !(e - 1e-9 < t && r - 1e-9 < t) && !(t < e + 1e-9 && t < r + 1e-9)
    }
    pd3D.AXIS = {
        NONE: 0,
        X_POS: 1,
        X_NEG: -1,
        Y_POS: 2,
        Y_NEG: -2,
        Z_POS: 3,
        Z_NEG: -3
    }, pd3D.VectorArray = {}, pd3D.VectorArray.origin = [0, 0, 0], pd3D.VectorArray.unitX = [1, 0, 0], pd3D.VectorArray.unitY = [0, 1, 0], pd3D.VectorArray.unitZ = [0, 0, 1], pd3D.VectorArray.create = function(t, e, r) {
        return 1 == arguments.length ? pd.isArray(t) ? [+t[0] || 0, +t[1] || 0, +t[2] || 0] : [t = pd.toNumber(t, 0), t, t] : [+t || 0, +e || 0, +r || 0]
    }, pd3D.VectorArray.createFromComponents = function(t, e, r) {
        return [+t || 0, +e || 0, +r || 0]
    }, pd3D.VectorArray.createFromArray = function(t) {
        return [+t[0] || 0, +t[1] || 0, +t[2] || 0]
    }, pd3D.VectorArray.clone = pd3D.VectorArray.createFromArray, pd3D.VectorArray.min = function(t, e, r) {
        return Math.min(e[t], r[t])
    }, pd3D.VectorArray.max = function(t, e, r) {
        return Math.max(e[t], r[t])
    }, pd3D.VectorArray.getMajorAxis = function(t) {
        var e = Math.abs(t[0]),
            r = Math.abs(t[1]),
            n = Math.abs(t[2]);
        return r < e && n < e ? t[0] < 0 ? -1 : 1 : n < r ? t[1] < 0 ? -2 : 2 : t[2] < 0 ? -3 : 3
    }, pd3D.VectorArray.length = function(t) {
        return t[2] = +t[2] || 0, Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2])
    }, pd3D.VectorArray.magnitudeInMajorAxis = function(t, e) {
        var r, n;
        switch (e) {
            default: r = t[0],
            n = t[1];
            break;
            case 1:
                    case -1:
                    r = t[1],
                n = +t[2] || 0;
                break;
            case 2:
                    case -2:
                    r = t[0],
                n = +t[2] || 0
        }
        return Math.sqrt(r * r + n * n)
    }, pd3D.VectorArray.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
    }, pd3D.VectorArray.closeTo = function(t, e, r) {
        return r = r || pd.Const.EPSILON, Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r
    }, pd3D.VectorArray.closeToInMajorAxis = function(t, e, r, n) {
        switch (n = n || pd.Const.EPSILON, r) {
            default: return Math.abs(e[0] - t[0]) <= n && Math.abs(e[1] - t[1]) <= n;
            case 1:
                    case -1:
                    return Math.abs(e[1] - t[1]) <= n && Math.abs(e[2] - t[2]) <= n;
            case 2:
                    case -2:
                    return Math.abs(e[0] - t[0]) <= n && Math.abs(e[2] - t[2]) <= n
        }
    }, pd3D.VectorArray.isOpposite = function(t, e, r) {
        return r = r || pd.Const.EPSILON, Math.abs(e[0] + t[0]) <= r && Math.abs(e[1] + t[1]) <= r && Math.abs(e[2] + t[2]) <= r
    }, pd3D.VectorArray.isParallel = function(t, e, r) {
        e = pd3D.VectorArray.cross([], t, e);
        return r = r || pd.Const.EPSILON, Math.abs(e) <= r && Math.abs(e) <= r && Math.abs(e) <= r
    }, pd3D.VectorArray.isColinear = function(t, e, r, n) {
        var i = r[0] - t[0],
            a = r[1] - t[1],
            o = r[2] - t[2],
            s = e[0] - t[0],
            r = e[1] - t[1],
            e = e[2] - t[2],
            t = a * e - o * r,
            e = o * s - i * e,
            s = i * r - a * s;
        return n = n || pd.Const.EPSILON, Math.abs(t) <= n && Math.abs(e) <= n && Math.abs(s) <= n
    }, pd3D.VectorArray.isBetween = function(t, e, r) {
        return n(t[0], e[0], r[0]) && n(t[1], e[1], r[1]) && n(t[2], e[2], r[2])
    }, pd3D.VectorArray.toPolarArray = function(t) {
        var e = pd3D.VectorArray.length(t);
        return e < 1e-9 ? [0, 0] : [Math.atan2(t[1], t[0]), Math.asin(t[2] / e)]
    }, pd3D.VectorArray.azimuthOfVector = function(t) {
        return Math.atan2(t[1], t[0])
    }, pd3D.VectorArray.azimuthOfLine = function(t, e) {
        return Math.atan2(e[1] - t[1], e[0] - t[0])
    }, pd3D.VectorArray.azimuthBetweenVectors = function(t, e) {
        return Math.atan2(e[1], e[0]) - Math.atan2(t[1], t[0])
    }, pd3D.VectorArray.azimuthBetweenPoints = function(t, e, r) {
        return Math.atan2(r[1] - t[1], r[0] - t[0]) - Math.atan2(e[1] - t[1], e[0] - t[0])
    }, pd3D.VectorArray.altitudeOfVector = function(t) {
        return t[2] = +t[2] || 0, Math.asin(pd.safeDivide(t[2], pd3D.VectorArray.length(t)))
    }, pd3D.VectorArray.altitudeOfLine = function(t, e) {
        var r = e[0] - t[0],
            n = e[1] - t[1],
            t = e[2] - t[2],
            n = Math.sqrt(r * r + n * n + t * t);
        return Math.asin(pd.safeDivide(t, n))
    }, pd3D.VectorArray.altitudeBetweenVectors = function(t, e) {
        return Math.asin(pd.safeDivide(e[2], pd3D.VectorArray.length(e))) - Math.asin(pd.safeDivide(t[2], pd3D.VectorArray.length(t)))
    }, pd3D.VectorArray.altitudeBetweenPoints = function(t, e, r) {
        return pd3D.VectorArray.altitudeOfLine(t, r) - pd3D.VectorArray.altitudeOfLine(t, e)
    }, pd3D.VectorArray.angleBetweenVectors = function(t, e) {
        var r = t[0] * e[0] + t[1] * e[1] + t[2] * e[2],
            e = pd3D.VectorArray.length(t) * pd3D.VectorArray.length(e),
            e = pd.safeDivide(r, e);
        return 1 <= e ? 0 : e <= -1 ? Math.PI : Math.acos(e)
    }, pd3D.VectorArray.angleBetweenPoints = function(t, e, r) {
        var n = t[0] - e[0],
            i = t[1] - e[1],
            a = t[2] - e[2],
            o = r[0] - e[0],
            s = r[1] - e[1],
            t = r[2] - e[2],
            r = Math.sqrt(n * n + i * i + a * a),
            e = Math.sqrt(o * o + s * s + t * t),
            t = n * o + i * s + a * t,
            e = pd.safeDivide(t, r * e);
        return 1 <= e ? 0 : e <= -1 ? Math.PI : Math.acos(e)
    }, pd3D.VectorArray.signedAngleBetweenPoints = function(t, e, r, n) {
        t = pd3D.VectorArray.normalize(pd3D.VectorArray.vectorBetweenPoints([], t, e)), e = pd3D.VectorArray.normalize(pd3D.VectorArray.vectorBetweenPoints([], e, r)), r = pd3D.VectorArray.cross([], t, e), e = pd3D.VectorArray.dot(t, e), e = 1 <= e ? 0 : e <= -1 ? Math.PI : Math.acos(e);
        return pd3D.VectorArray.dot(n, r) < 0 ? -e : e
    }, pd3D.VectorArray.distancePointToPointSquared = function(t, e) {
        var r = e[0] - t[0],
            n = e[1] - t[1],
            t = e[2] - t[2];
        return r * r + n * n + t * t
    }, pd3D.VectorArray.distancePointToPoint = function(t, e) {
        var r = e[0] - t[0],
            n = e[1] - t[1],
            t = e[2] - t[2];
        return Math.sqrt(r * r + n * n + t * t)
    }, pd3D.VectorArray.distanceInMajorAxis = function(t, e, r) {
        var n, i;
        switch (r) {
            default: n = e[0] - t[0],
            i = e[1] - t[1];
            break;
            case 1:
                    case -1:
                    n = e[1] - t[1],
                i = e[2] - t[2];
                break;
            case 2:
                    case -2:
                    n = e[0] - t[0],
                i = e[2] - t[2]
        }
        return Math.sqrt(n * n + i * i)
    }, pd3D.VectorArray.distanceInVectorDirection = function(t, e, r) {
        var n = pd3D.VectorArray.distancePointToPoint(t, r),
            r = pd3D.VectorArray.normalize([r[0] - t[0], r[1] - t[1], r[2] - t[2]]),
            t = e[0] * r[0] + e[1] * r[1] + e[2] * r[2],
            r = pd3D.VectorArray.length(e) * pd3D.VectorArray.length(r);
        return pd.constrainTo(pd.safeDivide(t, r), -1, 1) * n
    }, pd3D.VectorArray.signedDistanceInVectorDirection = function(t, e, r) {
        t = [r[0] - t[0], r[1] - t[1], r[2] - t[2]], e = pd3D.VectorArray.dot(e, t), t = pd3D.VectorArray.length(t);
        return pd.sign(e) * t
    }, pd3D.VectorArray.signedMagnitudeInVectorDirection = function(t, e) {
        return pd.sign(pd3D.VectorArray.dot(e, t)) * pd3D.VectorArray.length(t)
    }, pd3D.VectorArray.distancePointToLineSegment = function(t, e, r, n) {
        var i = pd3D.VectorArray.distancePointToPoint(e, t),
            a = pd3D.VectorArray.distancePointToPoint(r, t),
            o = pd3D.VectorArray.distancePointToPoint(e, r),
            s = (t[0] - e[0]) * (r[0] - e[0]) + (t[1] - e[1]) * (r[1] - e[1]) + (t[2] - e[2]) * (r[2] - e[2]),
            t = pd.constrainTo(pd.safeDivide(s, i * o), -1, 1),
            s = Math.acos(t);
        if (s > pd.Const.HALF_PI) return n && pd3D.VectorArray.set(n, e), i;
        t *= i;
        return o < t ? (n && pd3D.VectorArray.set(n, r), a) : (n && pd3D.VectorArray.lerpBetween(n, e, r, pd.safeDivide(t, o)), i * Math.sin(s))
    }, pd3D.VectorArray.distanceRayToLineSegment = function(t, e, r, n, i) {
        i = i || [];
        var a = [e[0] - t[0], e[1] - t[1], e[2] - t[2]],
            o = [n[0] - r[0], n[1] - r[1], n[2] - r[2]],
            a = pd3D.VectorArray.cross([], a, o),
            o = pd3D.VectorArray.add([], r, a),
            o = pd3D.PlaneArray.createFromTriangle(r, n, o);
        return !o || pd3D.PlaneArray.intersect(i, t, e, o) || (pd3D.PlaneArray.calcFromNormalAndPoint(o, a, r), pd3D.PlaneArray.intersect(i, t, e, o)) ? pd3D.VectorArray.distancePointToLineSegment(i, r, n) : 1 / 0
    }, pd3D.VectorArray.closestPointOnVector = function(t, e, r, n) {
        n = n || [];
        t = pd3D.PlaneArray.createFromNormalAndPoint(r, t), r = pd3D.VectorArray.translateInVectorDirection([], e, r, 1e3);
        return pd3D.PlaneArray.intersect(n, e, r, t) || pd3D.VectorArray.set(n, e), n
    }, pd3D.VectorArray.closestPointOnLineSegment = function(t, e, r, n) {
        return pd3D.VectorArray.distancePointToLineSegment(t, e, r, n)
    }, pd3D.VectorArray.triangleArea = function(t, e, r) {
        var n = pd3D.VectorArray.distancePointToPoint(t, e),
            e = pd3D.VectorArray.distancePointToPoint(e, r),
            r = pd3D.VectorArray.distancePointToPoint(r, t),
            t = (n + e + r) / 2;
        return Math.sqrt(t * (t - n) * (t - e) * (t - r))
    }, pd3D.VectorArray.set = function(t, e, r, n) {
        return 2 == arguments.length ? pd.isArray(e) ? (t[0] = +e[0] || 0, t[1] = +e[1] || 0, t[2] = +e[2] || 0) : t[0] = t[1] = t[2] = +e || 0 : (t[0] = +e || 0, t[1] = +r || 0, t[2] = +n || 0), t
    }, pd3D.VectorArray.copyTo = function(t, e) {
        return t[0] = +e[0] || 0, t[1] = +e[1] || 0, t[2] = +e[2] || 0, t
    }, pd3D.VectorArray.add = function(t, e, r) {
        return t[0] = e[0] + r[0], t[1] = e[1] + r[1], t[2] = e[2] + r[2], t
    }, pd3D.VectorArray.addComponents = function(t, e, r, n, i) {
        return t[0] = e[0] + r, t[1] = e[1] + n, t[2] = e[2] + i, t
    }, pd3D.VectorArray.subtract = function(t, e, r) {
        return t[0] = e[0] - r[0], t[1] = e[1] - r[1], t[2] = e[2] - r[2], t
    }, pd3D.VectorArray.subtractComponents = function(t, e, r, n, i) {
        return t[0] = e[0] - r, t[1] = e[1] - n, t[2] = e[2] - i, t
    }, pd3D.VectorArray.negate = function(t, e) {
        return e = e || t, t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t
    }, pd3D.VectorArray.normalize = function(t, e) {
        var r = (e = e || t)[0],
            n = e[1],
            i = +e[2] || 0,
            e = r * r + n * n + i * i;
        return 0 < e && (e = 1 / Math.sqrt(e), t[0] = r * e, t[1] = n * e, t[2] = i * e), t
    }, pd3D.VectorArray.normalizedDirectionVector = function(t, e, r) {
        var n = r[0] - e[0],
            i = r[1] - e[1],
            r = +r[2] - +e[2],
            e = n * n + i * i + r * r;
        return 0 < e && (e = 1 / Math.sqrt(e), t[0] = n * e, t[1] = i * e, t[2] = r * e), t
    }, pd3D.VectorArray.cross = function(t, e, r) {
        return t[0] = e[1] * r[2] - e[2] * r[1], t[1] = e[2] * r[0] - e[0] * r[2], t[2] = e[0] * r[1] - e[1] * r[0], t
    }, pd3D.VectorArray.translate = function(t, e, r, n, i) {
        return 3 == arguments.length ? pd.isArray(r) ? (t[0] = e[0] + (+r[0] || 0), t[1] = e[1] + (+r[1] || 0), t[2] = e[2] + (+r[2] || 0)) : (r = +r || 0, t[0] = e[0] + r, t[1] = e[1] + r, t[2] = e[2] + r) : (t[0] = e[0] + (+r || 0), t[1] = e[1] + (+n || 0), t[2] = e[2] + (+i || 0)), t
    }, pd3D.VectorArray.translateInVectorDirection = function(t, e, r, n) {
        return t[0] = e[0] + r[0] * n, t[1] = e[1] + r[1] * n, t[2] = e[2] + r[2] * n, t
    }, pd3D.VectorArray.scale = function(t, e, r) {
        return pd.isArray(r) ? (t[0] = e[0] * r[0], t[1] = e[1] * r[1], t[2] = e[2] * r[2]) : (t[0] = e[0] * r, t[1] = e[1] * r, t[2] = e[2] * r), t
    }, pd3D.VectorArray.lerp = function(t, e, r) {
        return t[0] = e[0] * r, t[1] = e[1] * r, t[2] = e[2] * r, t
    }, pd3D.VectorArray.lerpBetween = function(t, e, r, n) {
        var i = 1 - n;
        return t[0] = i * e[0] + n * r[0], t[1] = i * e[1] + n * r[1], t[2] = i * e[2] + n * r[2], t
    }, pd3D.VectorArray.lerpByDistance = function(t, e, r, n) {
        var i = pd3D.VectorArray.distancePointToPoint(e, r);
        return 1e-9 < i ? pd3D.VectorArray.lerpBetween(t, e, r, n / i) : (t[0] = e[0], t[1] = e[1], t[2] = +e[2] || 0, t)
    }, pd3D.VectorArray.vectorBetweenPoints = function(t, e, r) {
        return t[0] = r[0] - e[0], t[1] = r[1] - e[1], t[2] = r[2] - e[2], t
    }, pd3D.VectorArray.rotateLineSegment = function(t, e, r, n, i, a) {
        a = pd3D.QuatArray.setAxisAngle([], i, a), n = pd3D.VectorArray.distancePointToPoint(r, n), e = pd3D.VectorArray.normalizedDirectionVector([], e, r), n = pd3D.VectorArray.scale([], e, n);
        return pd3D.VectorArray.applyQuaternion(t, n, a), t[0] += r[0], t[1] += r[1], t[2] += r[2], t
    }, pd3D.VectorArray.crossProductFromTriangle = function(t, e, r, n) {
        r = pd3D.VectorArray.vectorBetweenPoints([], e, r), n = pd3D.VectorArray.vectorBetweenPoints([], e, n);
        return pd3D.VectorArray.cross(t, r, n), !0
    }, pd3D.VectorArray.calcNormalFromTriangle = function(t, e, r, n) {
        pd3D.VectorArray.crossProductFromTriangle(t, e, r, n);
        var i = t[0],
            e = t[1],
            r = t[2],
            n = i * i + e * e + r * r;
        return 0 < n && (n = 1 / Math.sqrt(n), t[0] = i * n, t[1] = e * n, t[2] = r * n, !0)
    }, pd3D.VectorArray.calcNormalFromPath = function(t, e) {
        if (2 < e.length) {
            var r = e.length,
                n = [0, 0, 0],
                i = 0;
            t[0] = t[1] = t[2] = 0;
            for (var a = 2; a < r; ++a) pd3D.VectorArray.calcNormalFromTriangle(n, e[0], e[a - 1], e[a]) && (t[0] += n[0], t[1] += n[1], t[2] += n[2], ++i);
            if (0 < i) return pd3D.VectorArray.normalize(t), !0
        }
        return !1
    }, pd3D.VectorArray.applyMatrix = function(t, e, r) {
        var n = +e[0] || 0,
            i = +e[1] || 0,
            e = +e[2] || 0;
        return t[0] = r[0] * n + r[4] * i + r[8] * e + r[12], t[1] = r[1] * n + r[5] * i + r[9] * e + r[13], t[2] = r[2] * n + r[6] * i + r[10] * e + r[14], t
    }, pd3D.VectorArray.applyQuaternion = function(t, e, r) {
        var n = +e[0] || 0,
            i = +e[1] || 0,
            a = +e[2] || 0,
            o = +r[0] || 0,
            s = +r[1] || 0,
            d = +r[2] || 0,
            h = +r[3] || 0,
            l = h * n + s * a - d * i,
            e = h * i + d * n - o * a,
            r = h * a + o * i - s * n,
            a = -o * n - s * i - d * a;
        return t[0] = l * h + a * -o + e * -d - r * -s, t[1] = e * h + a * -s + r * -o - l * -d, t[2] = r * h + a * -d + l * -s - e * -o, t
    }, pd3D.VectorArray.sphericalToCartesian = function(t, e, r, n) {
        var i = Math.cos(e),
            a = Math.sin(e),
            e = Math.cos(r),
            r = Math.sin(r),
            e = n * e;
        return t[0] = e * i, t[1] = e * a, t[2] = n * r, t
    }, pd3D.VectorArray.intersectLinesInMajorAxis = function(t, e, r, n, i, a) {
        var o, s, d;
        switch (Math.abs(a)) {
            default: o = 0,
            s = 1,
            d = 2;
            break;
            case 1:
                    o = 1,
                s = 2,
                d = 0;
                break;
            case 2:
                    o = 0,
                s = 2,
                d = 1
        }
        var h = r[o] - e[o],
            l = r[s] - e[s],
            c = i[o] - n[o],
            u = i[s] - n[s],
            p = u * h - c * l;
        if (pd.closeTo(p, 0)) return !1;
        var a = h * (f = e[s] - n[s]) - l * (m = e[o] - n[o]),
            f = (c * f - u * m) / p,
            m = a / p;
        return t[o] = e[o] + f * h, t[s] = e[s] + f * l, t[d] = .25 * (e[d] + r[d] + n[d] + i[d]), !0
    }, pd3D.VectorArray.intersectLines3D = function(t, e, r, n, i, a) {
        var o = pd3D.VectorArray.vectorBetweenPoints([], e, r),
            n = pd3D.VectorArray.vectorBetweenPoints([], n, i),
            i = pd3D.VectorArray.create();
        a ? pd3D.VectorArray.set(i, a) : pd3D.VectorArray.cross(i, o, n);
        i = pd3D.VectorArray.cross([], n, i), i = pd3D.PlaneArray.createFromNormalAndPoint(i, r);
        return pd3D.PlaneArray.intersect(t, e, r, i)
    }, pd3D.VectorArray.intersectSphere3D = function(t, e, r, n, i) {
        var a = pd3D.VectorArray.subtract([], n, e),
            n = pd3D.VectorArray.normalize(pd3D.VectorArray.subtract([], r, e)),
            r = pd3D.VectorArray.dot(a, n),
            a = pd3D.VectorArray.dot(a, a) - r * r,
            i = i * i;
        if (i < a) return !1;
        i = Math.sqrt(i - a), a = r - i, r += i;
        return r < a && (i = a, a = r, r = i), !(a < 0 && (a = r) < 0) && (t[0] = e[0] + n[0] * a, t[1] = e[1] + n[1] * a, t[2] = e[2] + n[2] * a, !0)
    }, pd3D.VectorArray.spline = function(t) {
        var e, r = [],
            d = (t = t || {}).vertices || [],
            h = pd.toInteger(t.degree, 2),
            n = pd.toNumber(t.increment, .05),
            l = t.weights || null,
            c = t.knots || null,
            u = d[0].length,
            p = d.length;
        if (h < 1) throw new Error("degree must be at least 1 (linear)");
        if (p <= h) throw new Error("degree must be less than vertex count");
        if (!l)
            for (l = [], e = 0; e < p; ++e) l[e] = 1;
        if (c) {
            if (c.length !== p + h + 1) throw new Error("Bad knot vector length")
        } else {
            for (c = [], e = 0; e < h + 1; ++e) c[e] = 0;
            for (e = 3; e < p; ++e) c[e] = p - 2;
            for (e = 0; e < h + 1; ++e) c[p + e] = p - 1
        }
        var f = [h, c.length - 1 - h],
            m = c[f[1]],
            g = c[f[0]];
        for (var i = 1 + .5 * n, a = 0; a < i; a += n) r.push(function(t, e) {
            var r, n, i, a;
            if ((t = t * (m - g) + g) < g || m < t) throw new Error("Parameter 't' is out of bounds");
            for (i = f[0]; i < f[1] && !(t >= c[i] && t <= c[i + 1]); ++i);
            for (var o = [], s = 0; s < p; ++s) {
                for (o[s] = [], n = 0; n < u; ++n) o[s][n] = d[s][n] * l[s];
                o[s][u] = l[s]
            }
            for (a = 1; a <= h + 1; ++a)
                for (s = i; i - h - 1 + a < s; s--)
                    for (r = (t - c[s]) / (c[s + h + 1 - a] - c[s]), n = 0; n < u + 1; ++n) o[s][n] = (1 - r) * o[s - 1][n] + r * o[s][n];
            for (e = e || [], s = 0; s < u; ++s) e[s] = o[i][s] / o[i][u];
            return e
        }(Math.min(a, 1)));
        return r
    }, pd3D.VectorArray.toString = function(t) {
        return "[ " + pd.toStringWithPrecisionRange(t[0], 1, 9) + ", " + pd.toStringWithPrecisionRange(t[1], 1, 9) + ", " + pd.toStringWithPrecisionRange(t[2], 1, 9) + " ]"
    }, pd3D.PlaneArray = {}, pd3D.PlaneArray.create = function(t, e, r, n) {
        return [+t || 0, +e || 0, +r || 0, +n || 0]
    }, pd3D.PlaneArray.createFromNormalAndPoint = function(t, e) {
        return pd3D.PlaneArray.calcFromNormalAndPoint([], t, e)
    }, pd3D.PlaneArray.createFromPoints = function(t, e, r) {
        var n = pd3D.VectorArray.vectorBetweenPoints([], t, e),
            r = pd3D.VectorArray.vectorBetweenPoints([], t, r),
            r = pd3D.VectorArray.cross([], n, r);
        return pd3D.VectorArray.normalize(r), [r[0], r[1], r[2], -(r[0] * e[0] + r[1] * e[1] + r[2] * e[2])]
    }, pd3D.PlaneArray.createFromTriangle = function(t, e, r) {
        var n = [];
        return pd3D.VectorArray.calcNormalFromTriangle(n, t, e, r) ? (n[3] = -(n[0] * t[0] + n[1] * t[1] + n[2] * t[2]), n) : null
    }, pd3D.PlaneArray.createFromPath = function(t) {
        var e = [];
        return pd3D.VectorArray.calcNormalFromPath(e, t) ? pd3D.PlaneArray.createFromNormalAndPoint(e, t[0]) : null
    }, pd3D.PlaneArray.set = function(t, e, r, n, i) {
        return 2 == arguments.length ? pd.isArray(e) ? (t[0] = +e[0] || 0, t[1] = +e[1] || 0, t[2] = +e[2] || 0, t[3] = +e[2] || 0) : t[0] = t[1] = t[2] = t[3] = +e || 0 : (t[0] = +e || 0, t[1] = +r || 0, t[2] = +n || 0, t[3] = +i || 0), t
    }, pd3D.PlaneArray.calcFromNormalAndPoint = function(t, e, r) {
        var n = r[0],
            i = r[1],
            r = +r[2] || 0;
        return t[0] = e[0], t[1] = e[1], t[2] = +e[2] || 0, pd3D.VectorArray.normalize(t), t[3] = -(t[0] * n + t[1] * i + t[2] * r), t
    }, pd3D.PlaneArray.calcFromTriangle = function(t, e, r, n) {
        return !!pd3D.VectorArray.calcNormalFromTriangle(t, e, r, n) && (t[3] = -(t[0] * e[0] + t[1] * e[1] + t[2] * e[2]), !0)
    }, pd3D.PlaneArray.calcFromPath = function(t, e) {
        if (pd3D.VectorArray.calcNormalFromPath(t, e)) {
            e = e[0];
            return t[3] = -(t[0] * e[0] + t[1] * e[1] + t[2] * e[2]), !0
        }
        return !1
    }, pd3D.PlaneArray.isPathPlanar = function(t, e, r) {
        if (pd.isArray(e) && 2 < e.length) {
            var n;
            r = pd.toNumber(r, .001);
            for (var i = 0, a = e.length; i < a; ++i)
                if (n = e[i], r < pd3D.PlaneArray.distanceTo(n, t)) return !1;
            return !0
        }
        return !1
    }, pd3D.PlaneArray.sameOrientation = pd3D.VectorArray.closeTo, pd3D.PlaneArray.oppositeOrientation = pd3D.VectorArray.isOpposite, pd3D.PlaneArray.isParallel = pd3D.VectorArray.isParallel, pd3D.PlaneArray.distanceTo = function(t, e) {
        return Math.abs(e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3])
    }, pd3D.PlaneArray.signedDistanceTo = function(t, e) {
        return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3]
    }, pd3D.PlaneArray.inFront = function(t, e) {
        return -1e-6 <= e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3]
    }, pd3D.PlaneArray.sameSide = function(t, e, r) {
        return -1e-6 <= (r[0] * t[0] + r[1] * t[1] + r[2] * t[2] + r[3]) * (r[0] * e[0] + r[1] * e[1] + r[2] * e[2] + r[3])
    }, pd3D.PlaneArray.clockwiseWinding = function(t, e, r, n) {
        var i = (e[1] - t[1]) * (r[2] - t[2]) - (r[1] - t[1]) * (e[2] - t[2]),
            a = (e[2] - t[2]) * (r[0] - t[0]) - (r[2] - t[2]) * (e[0] - t[0]),
            t = (e[0] - t[0]) * (r[1] - t[1]) - (r[0] - t[0]) * (e[1] - t[1]);
        return 0 <= i * n[0] + a * n[1] + t * n[2]
    }, pd3D.PlaneArray.insideTriangle = function(t, e, r, n, i) {
        var a = pd3D.PlaneArray.clockwiseWinding(e, r, t, i),
            r = pd3D.PlaneArray.clockwiseWinding(r, n, t, i);
        return a == r && r == pd3D.PlaneArray.clockwiseWinding(n, e, t, i)
    }, pd3D.PlaneArray.intersect = function(t, e, r, n) {
        e[2] = +e[2] || 0, r[2] = +r[2] || 0;
        var i = -(n[0] * e[0]) - n[1] * e[1] - n[2] * e[2] - n[3],
            n = n[0] * r[0] - n[0] * e[0] + (n[1] * r[1] - n[1] * e[1]) + (n[2] * r[2] - n[2] * e[2]);
        if (Math.abs(n) < pd.Const.EPSILON) return !1;
        n = i / n;
        return t[0] = n * (r[0] - e[0]) + e[0], t[1] = n * (r[1] - e[1]) + e[1], t[2] = n * (r[2] - e[2]) + e[2], !0
    }, pd3D.PlaneArray.intersectRay = function(t, e, r, n) {
        r = pd3D.VectorArray.translateInVectorDirection([], e, r, 1e3);
        return pd3D.PlaneArray.intersect(t, e, r, n)
    }, pd3D.PlaneArray.closestPoint = function(t, e, r) {
        var n = pd3D.VectorArray.subtract([], e, r);
        return pd3D.PlaneArray.intersect(t, e, n, r)
    }, pd3D.PlaneArray.closestAxialPoint = function(t, e, r) {
        var n, i, a, o, s = -1,
            d = 1 / 0;
        switch (Math.abs(r[0]) > pd.Const.EPSILON && (i = -(r[1] * e[1] + r[2] * e[2] + r[3]) / r[0], (n = Math.abs(e[0] - i)) < d && (d = n, s = 0)), Math.abs(r[1]) > pd.Const.EPSILON && (a = -(r[0] * e[0] + r[2] * e[2] + r[3]) / r[1], (n = Math.abs(e[1] - a)) < d && (d = n, s = 1)), Math.abs(r[1]) > pd.Const.EPSILON && (o = -(r[0] * e[0] + r[2] * e[1] + r[1]) / r[2], (n = Math.abs(e[2] - o)) < d && (d = n, s = 2)), s) {
            case 0:
                return t[0] = i, t[1] = e[1], t[2] = e[2], !0;
            case 1:
                return t[0] = e[0], t[1] = a, t[2] = e[2], !0;
            case 2:
                return t[0] = e[0], t[1] = e[1], t[2] = o, !0
        }
        return !1
    }, pd3D.PlaneArray.closestPointInGivenAxis = function(t, e, r, n) {
        var i = e[0],
            a = e[1],
            e = +e[2] || 0;
        switch (n) {
            default: if (Math.abs(r[2]) > pd.Const.EPSILON) return t[0] = i, t[1] = a, t[2] = -(r[0] * i + r[1] * a + r[3]) / r[2], !0;
            break;
            case 0:
                    if (Math.abs(r[0]) > pd.Const.EPSILON) return t[0] = -(r[1] * a + r[2] * e + r[3]) / r[0], t[1] = a, t[2] = e, !0;
                break;
            case 1:
                    if (Math.abs(r[1]) > pd.Const.EPSILON) return t[0] = i, t[1] = -(r[0] * i + r[2] * e + r[3]) / r[1], t[2] = e, !0
        }
        return !1
    }, pd3D.PlaneArray.makePathPlanar = function(t, e, r) {
        var n, i = !1;
        if (pd.isArray(t)) {
            r = pd.toNumber(r, .001);
            for (var a = 0, o = t.length; a < o; ++a) n = t[a], r < pd3D.PlaneArray.distanceTo(n, e) && pd3D.PlaneArray.intersectRay(n, n, e, e) && (i = !0)
        }
        return i
    }, pd3D.QuatArray = {}, pd3D.QuatArray.create = function(t, e, r, n) {
        return [+t || 0, +e || 0, +r || 0, +n || 0]
    }, pd3D.QuatArray.normalize = function(t, e) {
        var r = +(e = e || t)[0] || 0,
            n = +e[1] || 0,
            i = +e[2] || 0,
            a = +e[3] || 0,
            a = r * r + n * n + i * i + a * a;
        return 0 < a && (a = 1 / Math.sqrt(a), t[0] = e[0] * a, t[1] = e[1] * a, t[2] = e[2] * a, t[3] = e[3] * a), t
    }, pd3D.QuatArray.invert = function(t, e) {
        var r = +(e = e || t)[0] || 0,
            n = +e[1] || 0,
            i = +e[2] || 0,
            a = +e[3] || 0,
            e = r * r + n * n + i * i + a * a,
            e = e ? 1 / e : 0;
        return t[0] = -r * e, t[1] = -n * e, t[2] = -i * e, t[3] = a * e, t
    }, pd3D.QuatArray.conjugate = function(t, e) {
        return e = e || t, t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = e[3], t
    }, pd3D.QuatArray.multiply = function(t, e, r) {
        var n = e[0],
            i = e[1],
            a = e[2],
            o = e[3],
            s = r[0],
            d = r[1],
            e = r[2],
            r = r[3];
        return t[0] = n * r + i * e - a * d + o * s, t[1] = -n * e + i * r + a * s + o * d, t[2] = n * d - i * s + a * r + o * e, t[3] = -n * s - i * d - a * e + o * r, t
    }, pd3D.QuatArray.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
    }, pd3D.QuatArray.setAxisAngle = function(t, e, r) {
        e *= .5;
        var n = Math.sin(e);
        return t[0] = n * r[0], t[1] = n * r[1], t[2] = n * r[2], t[3] = Math.cos(e), t
    }, pd3D.QuatArray.rotateBetweenVectors = function(t, e, r) {
        var n = e[0],
            i = e[1],
            a = e[2],
            o = r[0],
            s = r[1],
            d = r[2],
            e = n * o + i * s + a * d,
            r = t[0] = i * d - a * s,
            d = t[1] = a * o - n * d,
            o = t[2] = n * s - i * o;
        return t[3] = e + Math.sqrt(e * e + r * r + d * d + o * o), pd3D.QuatArray.normalize(t)
    }, pd3D.QuatArray.toMatrixArray4x4 = function(t, e) {
        var r = e[0],
            n = e[1],
            i = e[2],
            a = e[3],
            e = 1 / Math.sqrt(r * r + n * n + i * i + a * a);
        return r *= e, a *= e, (t = t || [])[0] = 1 - 2 * (n *= e) * n - 2 * (i *= e) * i, t[1] = 2 * r * n - 2 * i * a, t[2] = 2 * r * i + 2 * n * a, t[3] = 0, t[4] = 2 * r * n + 2 * i * a, t[5] = 1 - 2 * r * r - 2 * i * i, t[6] = 2 * n * i - 2 * r * a, t[7] = 0, t[8] = 2 * r * i - 2 * n * a, t[9] = 2 * n * i + 2 * r * a, t[10] = 1 - 2 * r * r - 2 * n * n, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
    }, pd3D.BBoxArray = {}, pd3D.BBoxArray.create = function(t, e, r) {
        var n = {};
        return t = t || [-1, -1, 0], e = e || [1, 1, 1], n.min = pd3D.VectorArray.create(Math.min(t[0], e[0]), Math.min(t[1], e[1]), Math.min(t[2], e[2])), n.max = pd3D.VectorArray.create(Math.max(t[0], e[0]), Math.max(t[1], e[1]), Math.max(t[2], e[2])), n.axis = pd.toInteger(r, 0), n
    }, pd3D.BBoxArray.createFromCenterAndSize = function(t, e, r) {
        var n, i = {};
        return t[0] = pd.toNumber(t[0], 0), t[1] = pd.toNumber(t[1], 0), t[2] = pd.toNumber(t[2], 0), pd.isArray(e) ? (e[0] = .5 * pd.toNumber(e[0], 1), e[1] = .5 * pd.toNumber(e[1], 1), e[2] = .5 * pd.toNumber(e[2], 1)) : e = [n = .5 * pd.toNumber(e, 1), n, n], i.min = pd3D.VectorArray.create(t[0] - e[0], t[0] - e[1], t[0] - e[2]), i.max = pd3D.VectorArray.create(t[0] + e[0], t[0] + e[1], t[0] + e[2]), i.axis = pd.toInteger(r, 0), i
    }, pd3D.BBoxArray.createFromExtentsArray = function(t, e) {
        var r = {};
        return r.min = pd3D.VectorArray.create(pd.toNumber(t[0], 0), pd.toNumber(t[1], 0), pd.toNumber(t[2], 0)), r.max = pd3D.VectorArray.create(pd.toNumber(t[3], 1), pd.toNumber(t[4], 1), pd.toNumber(t[5], 1)), r.axis = pd.toInteger(e, 0), r
    }, pd3D.BBoxArray.minBound = function(t, e, r) {
        return Math.min(e.min[t], r.min[t])
    }, pd3D.BBoxArray.maxBound = function(t, e, r) {
        return Math.max(e.max[t], r.max[t])
    }, pd3D.BBoxArray.containsPoint = function(t, e, r) {
        var n = t.min,
            t = t.max;
        return r = pd.toNumber(r, 0), e[0] >= n[0] - r && e[0] <= t[0] + r && e[1] >= n[1] - r && e[1] <= t[1] + r && e[2] >= n[2] - r && e[2] <= t[2] + r
    }, pd3D.BBoxArray.containsPointInMajorAxis = function(t, e, r, n) {
        var i = t.min,
            t = t.max;
        switch (n = pd.toNumber(n, 0), r) {
            default: return e[0] >= i[0] - n && e[0] <= t[0] + n && e[1] >= i[1] - n && e[1] <= t[1] + n;
            case 1:
                    case -1:
                    return e[1] >= i[1] - n && e[1] <= t[1] + n && e[2] >= i[2] - n && e[2] <= t[2] + n;
            case 2:
                    case -2:
                    return e[0] >= i[0] - n && e[0] <= t[0] + n && e[2] >= i[2] - n && e[2] <= t[2] + n
        }
    }, pd3D.BBoxArray.containsBox = function(t, e, r) {
        return !(!pd3D.BBoxArray.containsPoint(t, e.min, r) || !pd3D.BBoxArray.containsPoint(t, e.max, r))
    }, pd3D.BBoxArray.overlap = function(t, e, r) {
        return r = pd.toNumber(r, 0), t.min[0] <= e.max[0] + r && t.max[0] >= e.min[0] - r && t.min[1] <= e.max[1] + r && t.max[1] >= e.min[1] - r && t.min[2] <= e.max[2] + r && t.max[2] >= e.min[2] - r
    }, pd3D.BBoxArray.horzQuadrant = function(t, e, r) {
        var n = t.min,
            t = t.max;
        return r = pd.toNumber(r, 0), e[0] > t[0] + r ? e[1] > t[1] ? 2 : e[1] < n[1] ? -2 : e[1] < .5 * (t[1] + n[1]) ? -1 : 1 : e[0] < n[0] - r ? e[1] > t[1] ? 5 : e[1] < n[1] ? -5 : e[1] < .5 * (t[1] + n[1]) ? -6 : 6 : e[1] > t[1] + r ? e[0] < .5 * (t[0] + n[0]) ? 4 : 3 : e[1] < n[1] - r ? e[0] < .5 * (t[0] + n[0]) ? -4 : -3 : 0
    }, pd3D.BBoxArray.reset = function(t) {
        return pd3D.VectorArray.set(t.min, 1 / 0, 1 / 0, 1 / 0), pd3D.VectorArray.set(t.max, -1 / 0, -1 / 0, -1 / 0), t.axis = 0, t
    }, pd3D.BBoxArray.set = function(t, e, r, n) {
        return pd3D.VectorArray.set(t.min, Math.min(e[0], r[0]), Math.min(e[1], r[1]), Math.min(e[2], r[2])), pd3D.VectorArray.set(t.max, Math.max(e[0], r[0]), Math.max(e[1], r[1]), Math.max(e[2], r[2])), t.axis = pd.toInteger(n, 0), t
    }, pd3D.BBoxArray.copy = function(t, e) {
        return pd3D.BBoxArray.set(t, e.min, e.max, e.axis)
    }, pd3D.BBoxArray.setFromCenterAndSize = function(t, e, r, n) {
        var i;
        return e[0] = pd.toNumber(e[0], 0), e[1] = pd.toNumber(e[1], 0), e[2] = pd.toNumber(e[2], 0), pd.isArray(r) ? (r[0] = .5 * pd.toNumber(r[0], 1), r[1] = .5 * pd.toNumber(r[1], 1), r[2] = .5 * pd.toNumber(r[2], 1)) : r = [i = .5 * pd.toNumber(r, 1), i, i], pd3D.VectorArray.set(t.min, e[0] - r[0], e[0] - r[1], e[0] - r[2]), pd3D.VectorArray.set(t.max, e[0] + r[0], e[0] + r[1], e[0] + r[2]), t.axis = pd.toInteger(n, 0), t
    }, pd3D.BBoxArray.moveBy = function(t, e, r, n) {
        var i = t.min,
            a = t.max;
        return pd.isNumeric(e) && (i[0] += e, a[0] += e), pd.isNumeric(r) && (i[1] += r, a[1] += r), pd.isNumeric(n) && (i[2] += n, a[2] += n), t
    }, pd3D.BBoxArray.expand = function(t, e, r, n) {
        var i = t.min,
            a = t.max;
        return pd.isNumeric(e) && (i[0] -= e, a[0] += e), pd.isNumeric(r) && (i[1] -= r, a[1] += r), pd.isNumeric(n) && (i[2] -= n, a[2] += n), t
    }, pd3D.BBoxArray.includePoint = function(t, e) {
        var r = t.min,
            n = t.max;
        return r[0] > e[0] && (r[0] = e[0]), r[1] > e[1] && (r[1] = e[1]), r[2] > e[2] && (r[2] = e[2]), n[0] < e[0] && (n[0] = e[0]), n[1] < e[1] && (n[1] = e[1]), n[2] < e[2] && (n[2] = e[2]), t
    }, pd3D.BBoxArray.includeBox = function(t, e) {
        var r = t.min,
            n = t.max;
        return r[0] > e.min[0] && (r[0] = e.min[0]), r[1] > e.min[1] && (r[1] = e.min[1]), r[2] > e.min[2] && (r[2] = e.min[2]), n[0] < e.max[0] && (n[0] = e.max[0]), n[1] < e.max[1] && (n[1] = e.max[1]), n[2] < e.max[2] && (n[2] = e.max[2]), t
    }, pd3D.BBoxArray.updateCorners = function(t) {
        var e = t.min,
            r = t.max;
        return pd.isArray(t.corners) || (t.corners = []), 8 != t.corners.length ? (t.corners.length = 8, t.corners[0] = [e[0], e[1], e[2]], t.corners[1] = [r[0], e[1], e[2]], t.corners[2] = [r[0], r[1], e[2]], t.corners[3] = [e[0], r[1], e[2]], t.corners[4] = [e[0], e[1], r[2]], t.corners[5] = [r[0], e[1], r[2]], t.corners[6] = [r[0], r[1], r[2]], t.corners[7] = [e[0], r[1], r[2]]) : (pd3D.VectorArray.set(t.corners[0], e[0], e[1], e[2]), pd3D.VectorArray.set(t.corners[1], r[0], e[1], e[2]), pd3D.VectorArray.set(t.corners[2], r[0], r[1], e[2]), pd3D.VectorArray.set(t.corners[3], e[0], r[1], e[2]), pd3D.VectorArray.set(t.corners[4], e[0], e[1], r[2]), pd3D.VectorArray.set(t.corners[5], r[0], e[1], r[2]), pd3D.VectorArray.set(t.corners[6], r[0], r[1], r[2]), pd3D.VectorArray.set(t.corners[7], e[0], r[1], r[2])), t
    };
    var l = pd3D.VectorArray.create();

    function c(t, e, r, n) {
        if (0 != r[0]) {
            var i = (n - e[0]) / r[0];
            return t[0] = n, t[1] = e[1] + i * r[1], t[2] = e[2] + i * r[2], 1
        }
    }

    function u(t, e, r, n) {
        if (0 != r[1]) {
            var i = (n - e[1]) / r[1];
            return t[0] = e[0] + i * r[0], t[1] = n, t[2] = e[2] + i * r[2], 1
        }
    }

    function p(t, e, r, n) {
        if (0 != r[2]) {
            var i = (n - e[2]) / r[2];
            return t[0] = e[0] + i * r[0], t[1] = e[1] + i * r[1], t[2] = n, 1
        }
    }

    function d(t, e, r) {
        t.triangles && (t.addTriangle(e[0], e[1], e[2]), t.addTriangle(e[0], e[2], e[3]), t.addTriangle(e[4], e[5], e[6]), t.addTriangle(e[4], e[6], e[7])), r && t.lines && (t.addLine(e[0], e[1]), t.addLine(e[1], e[2]), t.addLine(e[2], e[3]), t.addLine(e[3], e[0]), t.addLine(e[4], e[5]), t.addLine(e[5], e[6]), t.addLine(e[6], e[7]), t.addLine(e[7], e[4]), t.addLine(e[0], e[7]), t.addLine(e[1], e[6]), t.addLine(e[2], e[5]), t.addLine(e[3], e[4]))
    }
    pd3D.BBoxArray.intersectRay = function(t, e, r, n) {
        var i, a = Number.MAX_VALUE,
            o = l,
            s = t.min,
            t = t.max;
        return e[(n = n || []).axis = 0] > s[0] && e[0] < t[0] && e[1] > s[1] && e[1] < t[1] && e[2] > s[2] && e[2] < t[2] ? (r[0] < 0 && c(o, e, r, s[0]) && o[1] >= s[1] && o[1] <= t[1] && o[2] >= s[2] && o[2] <= t[2] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = -1, a = i), 0 < r[0] && c(o, e, r, t[0]) && o[1] >= s[1] && o[1] <= t[1] && o[2] >= s[2] && o[2] <= t[2] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = 1, a = i), r[1] < 0 && u(o, e, r, s[1]) && o[0] >= s[0] && o[0] <= t[0] && o[2] >= s[2] && o[2] <= t[2] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = -2, a = i), 0 < r[1] && u(o, e, r, t[1]) && o[0] >= s[0] && o[0] <= t[0] && o[2] >= s[2] && o[2] <= t[2] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = 2, a = i), r[2] < 0 && p(o, e, r, s[2]) && o[0] >= s[0] && o[0] <= t[0] && o[1] >= s[1] && o[1] <= t[1] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = -3, a = i), 0 < r[2] && p(o, e, r, t[2]) && o[0] >= s[0] && o[0] <= t[0] && o[1] >= s[1] && o[1] <= t[1] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = 3, a = i)) : (0 < r[0] && e[0] <= s[0] && c(o, e, r, s[0]) && o[1] >= s[1] && o[1] <= t[1] && o[2] >= s[2] && o[2] <= t[2] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = -1, a = i), r[0] < 0 && e[0] >= t[0] && c(o, e, r, t[0]) && o[1] >= s[1] && o[1] <= t[1] && o[2] >= s[2] && o[2] <= t[2] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = 1, a = i), 0 < r[1] && e[1] <= s[1] && u(o, e, r, s[1]) && o[0] >= s[0] && o[0] <= t[0] && o[2] >= s[2] && o[2] <= t[2] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = -2, a = i), r[1] < 0 && e[1] >= t[1] && u(o, e, r, t[1]) && o[0] >= s[0] && o[0] <= t[0] && o[2] >= s[2] && o[2] <= t[2] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = 2, a = i), 0 < r[2] && e[2] <= s[2] && p(o, e, r, s[2]) && o[0] >= s[0] && o[0] <= t[0] && o[1] >= s[1] && o[1] <= t[1] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = -3, a = i), r[2] < 0 && e[2] >= t[2] && p(o, e, r, t[2]) && o[0] >= s[0] && o[0] <= t[0] && o[1] >= s[1] && o[1] <= t[1] && (i = pd3D.VectorArray.distancePointToPointSquared(e, o)) < a && (pd3D.VectorArray.set(n, o), n.axis = 3, a = i)), n.axis ? n : null
    }, pd3D.BBoxArray.intersect = function(t, e, r, n) {
        r = [r[0] - e[0], r[1] - e[1], r[2] - e[2]];
        return pd3D.BBoxArray.intersectRay(t, e, r, n)
    }, pd3D.BBoxArray.intersectFace = function(t, e, r, n, i, a) {
        var o, s = Number.MAX_VALUE,
            d = l,
            h = [n[0] - r[0], n[1] - r[1], n[2] - r[2]],
            n = t.min,
            t = t.max;
        switch (i = pd.toBoolean(i, !1), (a = a || []).axis = 0, e) {
            default: Math.abs(h[0]) > pd.Const.EPSILON && (c(d, r, h, n[0]) && d[1] >= n[1] && d[1] <= t[1] && d[2] >= n[2] && d[2] <= t[2] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = -1, s = o), i && c(d, r, h, .5 * (t[0] + n[0])) && d[1] >= n[1] && d[1] <= t[1] && d[2] >= n[2] && d[2] <= t[2] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = 1, s = o), c(d, r, h, t[0]) && d[1] >= n[1] && d[1] <= t[1] && d[2] >= n[2] && d[2] <= t[2] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = 1, s = o));
            break;
            case 1:
                    Math.abs(h[1]) > pd.Const.EPSILON && (u(d, r, h, n[1]) && d[0] >= n[0] && d[0] <= t[0] && d[2] >= n[2] && d[2] <= t[2] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = -2, s = o), i && u(d, r, h, .5 * (t[1] + n[1])) && d[0] >= n[0] && d[0] <= t[0] && d[2] >= n[2] && d[2] <= t[2] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = 2, s = o), u(d, r, h, t[1]) && d[0] >= n[0] && d[0] <= t[0] && d[2] >= n[2] && d[2] <= t[2] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = 2, s = o));
                break;
            case 2:
                    Math.abs(h[2]) > pd.Const.EPSILON && (p(d, r, h, n[2]) && d[0] >= n[0] && d[0] <= t[0] && d[1] >= n[1] && d[1] <= t[1] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = -3, s = o), i && p(d, r, h, .5 * (t[2] + n[2])) && d[0] >= n[0] && d[0] <= t[0] && d[1] >= n[1] && d[1] <= t[1] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = 3, s = o), p(d, r, h, t[2]) && d[0] >= n[0] && d[0] <= t[0] && d[1] >= n[1] && d[1] <= t[1] && (o = pd3D.VectorArray.distancePointToPointSquared(r, d)) < s && (pd3D.VectorArray.set(a, d), a.axis = 3, s = o))
        }
        return a.axis ? a : null
    }, pd3D.BBoxArray.constrainPoint = function(t, e, r) {
        var n = t.min,
            i = t.max,
            t = !1;
        return r = pd.toNumber(r, 0), e[0] < n[0] + r && (e[0] = n[0] + r, t = !0), e[0] > i[0] - r && (e[0] = i[0] - r, t = !0), e[1] < n[1] + r && (e[1] = n[1] + r, t = !0), e[1] > i[1] - r && (e[1] = i[1] - r, t = !0), e[2] < n[2] + r && (e[2] = n[2] + r, t = !0), e[2] > i[2] - r && (e[2] = i[2] - r, t = !0), t
    }, pd3D.BBoxArray.calculateUVW = function(t, e, r) {
        r = r || [];
        var n = t.min,
            t = t.max;
        return r[0] = pd.safeDivide(e[0] - n[0], t[0] - n[0]), r[1] = pd.safeDivide(e[1] - n[1], t[1] - n[1]), r[2] = pd.safeDivide(e[2] - n[2], t[2] - n[2]), r
    }, pd3D.BBoxArray.copyToMesh = function(t, e, r) {
        if (t && e) {
            r = r || {};
            var n = pd.toInteger(r.ignoreAxis, Math.abs(pd.toInteger(t.axis, 0))),
                i = pd.toBoolean(r.outlines, e.hasLines && e.lines),
                a = pd.toBoolean(r.flip, !1);
            pd.isArray(t.corners) && 8 == t.corners.length || pd3D.BBoxArray.updateCorners(t);
            var o = t.corners;
            if (i && !e.lines && e.addIndexBuffer("lines"), r.color && pd.isArray(r.color) && e.color(r.color), e.hasVertexNormals && e.normals) {
                r = new Array(8);
                a ? (1 != n && (e.normal([0, 1, 0]), r[0] = e.addVertex(o[0]), r[1] = e.addVertex(o[4]), r[2] = e.addVertex(o[5]), r[3] = e.addVertex(o[1]), e.normal([0, -1, 0]), r[4] = e.addVertex(o[2]), r[5] = e.addVertex(o[6]), r[6] = e.addVertex(o[7]), r[7] = e.addVertex(o[3]), d(e, r, i), i = !1), 2 != n && (e.normal([1, 0, 0]), r[0] = e.addVertex(o[0]), r[1] = e.addVertex(o[3]), r[2] = e.addVertex(o[7]), r[3] = e.addVertex(o[4]), e.normal([-1, 0, 0]), r[4] = e.addVertex(o[5]), r[5] = e.addVertex(o[6]), r[6] = e.addVertex(o[2]), r[7] = e.addVertex(o[1]), d(e, r, i), i = !1), 3 != n && (e.normal([0, 0, 1]), r[0] = e.addVertex(o[0]), r[1] = e.addVertex(o[1]), r[2] = e.addVertex(o[2]), r[3] = e.addVertex(o[3]), e.normal([0, 0, -1]), r[4] = e.addVertex(o[7]), r[5] = e.addVertex(o[6]), r[6] = e.addVertex(o[5]), r[7] = e.addVertex(o[4]), d(e, r, i), i = !1)) : (1 != n && (e.normal([0, -1, 0]), r[0] = e.addVertex(o[0]), r[1] = e.addVertex(o[1]), r[2] = e.addVertex(o[5]), r[3] = e.addVertex(o[4]), e.normal([0, 1, 0]), r[4] = e.addVertex(o[7]), r[5] = e.addVertex(o[6]), r[6] = e.addVertex(o[2]), r[7] = e.addVertex(o[3]), d(e, r, i), i = !1), 2 != n && (e.normal([-1, 0, 0]), r[0] = e.addVertex(o[0]), r[1] = e.addVertex(o[4]), r[2] = e.addVertex(o[7]), r[3] = e.addVertex(o[3]), e.normal([1, 0, 0]), r[4] = e.addVertex(o[2]), r[5] = e.addVertex(o[6]), r[6] = e.addVertex(o[5]), r[7] = e.addVertex(o[1]), d(e, r, i), i = !1), 3 != n && (e.normal([0, 0, -1]), r[0] = e.addVertex(o[0]), r[1] = e.addVertex(o[3]), r[2] = e.addVertex(o[2]), r[3] = e.addVertex(o[1]), e.normal([0, 0, 1]), r[4] = e.addVertex(o[5]), r[5] = e.addVertex(o[6]), r[6] = e.addVertex(o[7]), r[7] = e.addVertex(o[4]), d(e, r, i), i = !1))
            } else {
                for (var i = e.vertexCount(), s = 0; s < 8; ++s) e.addVertex(o[s]);
                a ? (1 != n && (e.addTriangle(i + 0, i + 4, i + 5), e.addTriangle(i + 0, i + 5, i + 1), e.addTriangle(i + 2, i + 6, i + 7), e.addTriangle(i + 2, i + 7, i + 3)), 2 != n && (e.addTriangle(i + 0, i + 3, i + 7), e.addTriangle(i + 0, i + 7, i + 4), e.addTriangle(i + 1, i + 5, i + 6), e.addTriangle(i + 1, i + 6, i + 2)), 3 != n && (e.addTriangle(i + 0, i + 1, i + 2), e.addTriangle(i + 0, i + 2, i + 3), e.addTriangle(i + 4, i + 7, i + 6), e.addTriangle(i + 4, i + 6, i + 5))) : (1 != n && (e.addTriangle(i + 0, i + 4, i + 7), e.addTriangle(i + 0, i + 7, i + 3), e.addTriangle(i + 1, i + 2, i + 6), e.addTriangle(i + 1, i + 6, i + 5)), 2 != n && (e.addTriangle(i + 0, i + 1, i + 5), e.addTriangle(i + 0, i + 5, i + 4), e.addTriangle(i + 2, i + 3, i + 7), e.addTriangle(i + 2, i + 7, i + 6)), 3 != n && (e.addTriangle(i + 0, i + 3, i + 2), e.addTriangle(i + 0, i + 2, i + 1), e.addTriangle(i + 4, i + 5, i + 6), e.addTriangle(i + 4, i + 6, i + 7)))
            }
        }
        return t
    }, pd3D.BBoxArray.copyOutlineToMesh = function(t, e) {
        if (t && e) {
            pd.isArray(t.corners) && 8 == t.corners.length || pd3D.BBoxArray.updateCorners(t);
            for (var r = t.corners, n = e.vertexCount(), i = 0; i < 8; ++i) e.addVertex(r[i]);
            e.addLine(n + 0, n + 1), e.addLine(n + 1, n + 2), e.addLine(n + 2, n + 3), e.addLine(n + 3, n + 0), e.addLine(n + 4, n + 5), e.addLine(n + 5, n + 6), e.addLine(n + 6, n + 7), e.addLine(n + 7, n + 4), e.addLine(n + 0, n + 4), e.addLine(n + 1, n + 5), e.addLine(n + 2, n + 6), e.addLine(n + 3, n + 7)
        }
        return t
    }, pd3D.Polyline = function(t) {
        t = t || {}, this.contours = pd.isArray(t.contours) ? t.contours : [], this.flags = 0, this.onChange = null, "hasChanged" in t && (this.hasChanged = pd.toBoolean(t.hasChanged, !1)), "isClosed" in t ? this.isClosed = pd.toBoolean(t.isClosed, !1) : "closed" in t && (this.isClosed = pd.toBoolean(t.closed, !1))
    };
    Object.defineProperty(pd3D.Polyline.prototype, "hasChanged", {
        get: function() {
            return 1 & this.flags
        },
        set: function(t) {
            t ? this.flags |= 1 : 1 & this.flags && --this.flags
        }
    }), Object.defineProperty(pd3D.Polyline.prototype, "isClosed", {
        get: function() {
            return 2 & this.flags
        },
        set: function(t) {
            t ? this.flags |= 2 : 2 & this.flags && (this.flags -= 2)
        }
    }), Object.defineProperty(pd3D.Polyline.prototype, "isPlanar", {
        get: function() {
            return !(4 & this.flags)
        },
        set: function(t) {
            t ? 4 & this.flags && (this.flags -= 4) : this.flags |= 4
        }
    }), Object.defineProperty(pd3D.Polyline.prototype, "isNotPlanar", {
        get: function() {
            return 4 & this.flags
        },
        set: function(t) {
            t ? this.flags |= 4 : 4 & this.flags && (this.flags -= 4)
        }
    }), pd3D.Polyline.prototype.clone = function(t, e) {
        var r, n, i, a, o = this.contours,
            s = o.length;
        e = e || new pd3D.Polyline, pd.isArray(t) || (t = pd3D.VectorArray.origin);
        for (var d = 0; d < s; ++d) {
            r = o[d], null == (i = e.contours[d]) && (i = e.contours[d] = []);
            for (var h = 0, l = r.length; h < l; ++h) n = r[h], null == (a = i[h]) && (a = i[h] = []), a[0] = n[0] + t[0], a[1] = n[1] + t[1], a[2] = n[2] + t[2];
            e.contours[d].length = r.length
        }
        return e.contours.length = s, e.hasChanged = !0, e.onChange && e.onChange(this), e
    }, pd3D.Polyline.prototype.setBoundary = function(t) {
        if (!pd.isArray(t) || t.length < 1) throw new TypeError("ERROR: Sent empty or invalid array to setBoundary().");
        if (t[0].length < 2) throw new TypeError("ERROR: Contour arrays must have vertices with at least two dimensions.");
        return this.contours.length < 1 ? this.contours.push(t) : this.contours[0] = t, this.hasChanged = !0, this.onChange && this.onChange(this), this
    }, pd3D.Polyline.prototype.getContourCount = function() {
        return this.contours.length
    }, pd3D.Polyline.prototype.getContour = function(t) {
        return t = pd.toInteger(t, 0), this.contours.length > t ? this.contours[t] : null
    }, pd3D.Polyline.prototype.addContour = function(t) {
        if (pd.isArray(t) || (t = []), 0 < t.length && t[0].length < 2) throw new TypeError("ERROR: Contour arrays must have vertices with at least two dimensions.");
        return this.contours.push(t), this.hasChanged = !0, this.onChange && this.onChange(this), this
    }, pd3D.Polyline.prototype.setContours = function(t, e) {
        if ((!pd.isArray(t) || t.length < 1) && (t = []), 0 < t[0].length && t[0][0].length < 2) throw new TypeError("ERROR: Contour arrays must have vertices with at least two dimensions.");
        if (this.contours && 0 < this.contours.length && this.clearContours(), e)
            for (var r = 0, n = t.length; r < n; ++r) this.contours.push(t[r]);
        else this.contours = t;
        return this.hasChanged = !0, this.onChange && this.onChange(this), this
    }, pd3D.Polyline.prototype.clearContours = function() {
        if (this.contours)
            for (var t = 0, e = this.contours.length; t < e; ++t) this.contours[t].length = 0;
        return this.contours.length = 0, this.hasChanged = !0, this.onChange && this.onChange(this), this
    }, pd3D.Polyline.prototype.lineTo = function(t, e) {
        return this.contours && (this.contours.length < 1 && this.contours.push([]), e = pd.constrainTo(pd.toInteger(e, this.contours.length - 1), 0, this.contours.length - 1), this.contours[e].push(t)), this
    }, pd3D.Polyline.prototype.splineTo = function(t, e) {
        if (this.contours) {
            this.contours.length < 1 && this.contours.push([]), e = pd.constrainTo(pd.toInteger(e, this.contours.length - 1), 0, this.contours.length - 1);
            for (var r = t.vertices || [], t = pd.toNumber(t.increment, .1), n = this.contours[e], i = pd3D.VectorArray.spline({
                    increment: t,
                    vertices: r
                }), a = 0, o = i.length; a < o; ++a) n.push(i[a])
        }
        return this
    }, pd3D.Polyline.prototype.finish = function() {
        return this.hasChanged = !0, this.onChange && this.onChange(this), this
    }, pd3D.Polygon = function(t) {
        t = t || {}, pd3D.Polyline.call(this, t), this.plane = t.plane || t.normal || null, this.color = t.color || null, this.axis = pd.toInteger(t.axis, 0), this.center = t.center || null, this.triangles = null, "noOutline" in t && (this.noOutline = pd.toBoolean(t.noOutline, !1)), 0 < this.contours.length && this.checkPlaneEqn()
    }, pd3D.Polygon.prototype = Object.create(pd3D.Polyline.prototype), pd3D.Polygon.prototype.constructor = pd3D.Polygon;
    var h = null;
    pd3D.Polygon.initTesselator = function() {
        var t = new libtess.GluTesselator;
        return t.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, function(t, e) {
            e.push(t)
        }), t.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, function(t) {
            t !== libtess.primitiveType.GL_TRIANGLES && console.warn("Tesselator: Expected TRIANGLES, but got type: " + t)
        }), t.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, function(t) {
            console.warn("Tesselator: Error number: " + t)
        }), t.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, function(t) {
            return [t[0], t[1], t[2]]
        }), t.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, function() {}), t
    }, pd3D.Polygon.releaseTesselator = function() {
        h = null
    }, Object.defineProperty(pd3D.Polygon.prototype, "noOutline", {
        get: function() {
            return 8 & this.flags
        },
        set: function(t) {
            t ? this.flags |= 8 : 8 & this.flags && (this.flags -= 8)
        }
    }), pd3D.Polygon.prototype.clone = function(t, e, r) {
        this.checkPlaneEqn(), !this.hasChanged && this.triangles || this.tesselate3D(), r = r || new pd3D.Polygon;
        var n = this.triangles;
        r.triangles || (r.triangles = []);
        var i, a, o, s, d = (n = n || (this.triangles = [])).length,
            h = this.contours,
            l = h.length;
        pd.isArray(t) || (t = pd3D.VectorArray.origin), this.center && (r.center || (r.center = []), pd3D.VectorArray.add(r.center, this.center, t)), this.plane && (r.plane || (r.plane = [])), r.color = this.color || null, r.noOutline = this.noOutline, r.hasChanged = d < 1, r.axis = 0 | +this.axis, (this.isNotPlanar || r.isNotPlanar) && (r.isNotPlanar = this.isNotPlanar);
        for (var c = 0; c < l; ++c) {
            i = h[c], null == (o = r.contours[c]) && (o = r.contours[c] = []);
            for (var u = 0, p = i.length; u < p; ++u) a = i[u], null == (s = o[u]) && (s = o[u] = []), s[0] = a[0] + t[0], s[1] = a[1] + t[1], s[2] = a[2] + t[2];
            r.contours[c].length = i.length
        }
        if (r.contours.length = l, e) {
            pd3D.VectorArray.negate(r.plane, this.plane);
            for (c = 0; c < d; c += 3) a = n[c], null == (s = r.triangles[c]) && (s = r.triangles[c] = []), s[0] = a[0] + t[0], s[1] = a[1] + t[1], s[2] = a[2] + t[2], a = n[c + 2], null == (s = r.triangles[c + 1]) && (s = r.triangles[c + 1] = []), s[0] = a[0] + t[0], s[1] = a[1] + t[1], s[2] = a[2] + t[2], a = n[c + 1], null == (s = r.triangles[c + 2]) && (s = r.triangles[c + 2] = []), s[0] = a[0] + t[0], s[1] = a[1] + t[1], s[2] = a[2] + t[2]
        } else {
            pd3D.VectorArray.copyTo(r.plane, this.plane);
            for (c = 0; c < d; ++c) a = n[c], null == (s = r.triangles[c]) && (s = r.triangles[c] = []), s[0] = a[0] + t[0], s[1] = a[1] + t[1], s[2] = a[2] + t[2]
        }
        return r.checkPlaneEqn(), r
    }, pd3D.Polygon.prototype.applyOffset = function(t) {
        this.hasChanged = !0;
        for (var e, r, n = this.contours, i = n.length, a = 0; a < i; ++a)
            for (var o = 0, s = (e = n[a]).length; o < s; ++o)(r = e[o])[0] += t[0], r[1] += t[1], r[2] += t[2];
        return this.computePlaneEqn(), this
    }, pd3D.Polygon.prototype.computeOffsetPosition = function(t, e) {
        var r = (r = this.center) || (0 < this.contours.length && 0 < this.contours[0].length ? this.contours[0][0] : pd3D.VectorArray.origin),
            t = [t[0], t[1], t[2]];
        return pd3D.VectorArray.normalize(t), [t[0] * e + r[0], t[1] * e + r[1], t[2] * e + r[2]]
    }, pd3D.Polygon.prototype.computePlaneEqn = function() {
        if (0 < this.contours.length) {
            var t, e = [0, 0, 0],
                r = [0, 0, 0],
                n = this.contours[0],
                i = n.length,
                a = 0;
            if (0 < i) {
                for (var o = n[0].slice(), s = n[0].slice(), d = 0; d < i; ++d) t = n[d], o[0] > t[0] && (o[0] = t[0]), o[1] > t[1] && (o[1] = t[1]), o[2] > t[2] && (o[2] = t[2]), s[0] < t[0] && (s[0] = t[0]), s[1] < t[1] && (s[1] = t[1]), s[2] < t[2] && (s[2] = t[2]), ++a, 1 < d && (pd3D.VectorArray.calcNormalFromTriangle(e, n[d - 2], n[d - 1], n[d]) ? (r[0] += e[0], r[1] += e[1], r[2] += e[2]) : r[2] += 1);
                0 == a && (r[2] = 1), pd3D.VectorArray.normalize(r), this.center = pd3D.VectorArray.lerpBetween(this.center || [], o, s, .5), this.plane ? pd3D.PlaneArray.calcFromNormalAndPoint(this.plane, r, this.center) : this.plane = pd3D.PlaneArray.createFromNormalAndPoint(r, this.center), this.axis = pd3D.VectorArray.getMajorAxis(r)
            }
        }
        return this.plane || (this.plane = pd3D.PlaneArray.create(0, 0, 1, 0), this.axis = pd3D.VectorArray.getMajorAxis(this.plane)), this
    }, pd3D.Polygon.prototype.checkPlaneEqn = function() {
        var t;
        return this.plane || this.computePlaneEqn(), this.plane.length < 4 && (t = 0 < this.contours.length && 2 < this.contours[0].length ? this.contours[0][0] : pd3D.VectorArray.origin, this.plane[3] = -(this.plane[0] * t[0] + this.plane[1] * t[1] + this.plane[2] * t[2])), 3 < this.plane.length
    }, pd3D.Polygon.prototype.setNormal = function(t) {
        if (!pd.isArray(t) || t.length < 3) throw new TypeError("The new normal must be a valid [x,y,z] vector array.");
        return this.plane = t, this.checkPlaneEqn(), this
    }, pd3D.Polygon.prototype.intersect = function(t, e, r) {
        return this.checkPlaneEqn(), !!pd3D.PlaneArray.intersect(r, t, e, this.plane) && (this.isNotPlanar ? this._isInsideNonPlanar(r) : this._isInside(r))
    }, pd3D.Polygon.prototype.intersectTriangles = function(t, e, r) {
        if (this.checkPlaneEqn(), this.isNotPlanar && this.triangles && 2 < this.triangles.length) {
            for (var n, i, a, o = [], s = [], d = [], h = [], l = [], c = 2, u = this.triangles.length; c < u; c += 3)
                if (i = this.triangles[c - 2], n = this.triangles[c - 1], a = this.triangles[c], pd3D.VectorArray.subtract(o, i, n), pd3D.VectorArray.subtract(s, a, n), pd3D.VectorArray.cross(h, e, s), 1e-6 < (i = pd3D.VectorArray.dot(o, h)) && (pd3D.VectorArray.subtract(d, t, n), 0 <= (a = pd3D.VectorArray.dot(d, h)) && a <= i && (pd3D.VectorArray.cross(l, d, o), 0 <= (n = pd3D.VectorArray.dot(e, l)) && a + n <= i))) return r = r || [], i = pd3D.VectorArray.dot(s, l) / i, r[0] = t[0] + i * e[0], r[1] = t[1] + i * e[1], r[2] = t[2] + i * e[2], !0;
            return !1
        }
        var p = pd3D.VectorArray.add([], t, e);
        return this.intersect(t, p, r)
    }, pd3D.Polygon.prototype._isInsideNonPlanar = function(t) {
        if (this.triangles && 2 < this.triangles.length) {
            for (var e, r, n, i = [], a = 2, o = this.triangles.length; a < o; a += 3)
                if (e = this.triangles[a - 2], r = this.triangles[a - 1], n = this.triangles[a], pd3D.VectorArray.calcNormalFromTriangle(i, e, r, n) && pd3D.PlaneArray.insideTriangle(t, e, r, n, i)) return !0
        } else if (this.isInsideOuterBoundary(t)) return !0;
        return !1
    }, pd3D.Polygon.prototype._isInside = function(t) {
        if (this.triangles && 2 < this.triangles.length) {
            for (var e = 2, r = this.triangles.length; e < r; e += 3)
                if (pd3D.PlaneArray.insideTriangle(t, this.triangles[e - 2], this.triangles[e - 1], this.triangles[e], this.plane)) return !0
        } else if (this.isInsideOuterBoundary(t)) return !0;
        return !1
    }, pd3D.Polygon.prototype.isInsideOuterBoundary = function(t) {
        if (this.contours && 0 < this.contours.length) {
            var e = this.contours[0];
            if (4 == e.length) return pd3D.PlaneArray.insideTriangle(t, e[0], e[1], e[2], this.plane) || pd3D.PlaneArray.insideTriangle(t, e[0], e[2], e[3], this.plane);
            if (3 == e.length) return pd3D.PlaneArray.insideTriangle(t, e[0], e[1], e[2], this.plane);
            var r, n = [],
                i = [],
                a = [],
                o = 0,
                s = e[e.length - 1];
            n[0] = s[0] - t[0], n[1] = s[1] - t[1], n[2] = s[2] - t[2], pd3D.VectorArray.normalize(n);
            for (var d = 0, h = e.length; d < h; ++d) r = e[d], i[0] = r[0] - t[0], i[1] = r[1] - t[1], i[2] = r[2] - t[2], pd3D.VectorArray.normalize(i), pd3D.VectorArray.cross(a, n, i), r = pd3D.VectorArray.dot(this.plane, a), o += Math.acos(pd3D.VectorArray.dot(n, i)) * pd.sign(r), n[0] = i[0], n[1] = i[1], n[2] = i[2];
            return o >= Math.PI
        }
        return !1
    }, pd3D.Polygon.prototype.tesselate2D = function() {
        if ("function" != typeof earcut) return "object" != typeof libtess ? this.triangles = [] : this.tesselate3D();
        var t;
        this.computePlaneEqn();
        var e, r, n = [],
            i = this.plane,
            a = this.center,
            o = this.contours;
        if (Math.abs(i[2]) > 1 - pd.Const.EPSILON && Math.abs(i[0]) < pd.Const.EPSILON && Math.abs(i[1]) < pd.Const.EPSILON) {
            for (d = 0; d < o.length; ++d)
                for (n.push([]), e = o[d], t = 0; t < e.length; ++t) n[d].push([e[t][0], e[t][1]]);
            r = earcut(n);
            for (var s = -i[3] / i[2], d = 0; d < r.length; ++d) r[d][2] = s;
            i[2] < 0 && r.reverse()
        } else {
            var h = pd3D.QuatArray.create();
            pd3D.QuatArray.rotateBetweenVectors(h, i, pd3D.VectorArray.unitZ);
            var l = pd3D.VectorArray.create();
            for (d = 0; d < o.length; ++d)
                for (n.push([]), e = o[d], t = 0; t < e.length; ++t) l[0] = e[t][0] - a[0], l[1] = e[t][1] - a[1], l[2] = e[t][2] - a[2], pd3D.VectorArray.applyQuaternion(l, l, h), n[d].push([l[0], l[1]]);
            for (r = earcut(n), pd3D.QuatArray.invert(h, h), d = 0; d < r.length; ++d) r[d].length < 3 && (pd3D.VectorArray.applyQuaternion(r[d], r[d], h), r[d][0] += a[0], r[d][1] += a[1], r[d][2] += a[2])
        }
        return this.triangles = r, this.hasChanged = !1, r
    }, pd3D.Polygon.prototype.tesselate3D = function() {
        if ("object" != typeof libtess) return "function" != typeof earcut ? this.triangles = [] : this.tesselate2D();
        var t, e, r = [],
            n = this.contours;
        if (this.checkPlaneEqn(), 1 == n.length && n[0].length <= 4) 3 <= (t = n[0]).length && (r.push(t[0]), r.push(t[1]), r.push(t[2]), 4 == t.length && (r.push(t[0]), r.push(t[2]), r.push(t[3])));
        else {
            h = h || pd3D.Polygon.initTesselator(), this.plane && h.gluTessNormal(this.plane[0], this.plane[1], this.plane[2]);
            try {
                h.gluTessBeginPolygon(r);
                for (var i = 0, a = n.length; i < a; ++i) {
                    t = n[i], h.gluTessBeginContour();
                    for (var o = 0, s = t.length; o < s; ++o) e = t[o], h.gluTessVertex(e, e);
                    h.gluTessEndContour()
                }
                h.gluTessEndPolygon()
            } catch (t) {
                console.warn(t)
            }
        }
        return this.triangles && (this.triangles.length = 0), this.triangles = r, this.hasChanged = !1, r
    }, pd3D.Polygon.prototype.scaleAndOffset = function(t, e, r) {
        var n, i, a = this.contours;
        t = pd.toNumber(t, 1), e = pd.isArray(e) ? e : pd3D.VectorArray.origin, r = pd.toBoolean(r, !1);
        for (var o = 0, s = a.length; o < s; ++o) {
            n = a[o], r && n.reverse();
            for (var d = 0, h = n.length; d < h; ++d) i = n[d], n[d] = [i[0] * t + e[0], i[1] * t + e[1], (+i[2] || 0) * t + e[2]]
        }
        return this.plane && this.computePlaneEqn(), this.hasChanged = !0, this
    }, pd3D.Polygon.prototype.calcSurfaceArea = function() {
        var t = 0;
        if (!this.hasChanged && this.triangles || this.tesselate3D(), !this.triangles || this.triangles.length < 3 || this.triangles[0].length < 2) {
            for (var e, r, n = [], i = 0, a = this.contours.length; i < a; ++i) {
                e = 0;
                for (var o = 2, s = (r = this.contours[i]).length; o < s; ++o) pd3D.VectorArray.crossProductFromTriangle(n, r[0], r[o - 1], r[o]) && (e += pd3D.VectorArray.length(n));
                0 < i ? t -= Math.abs(e) : t += Math.abs(e)
            }
            return Math.abs(t)
        }
        for (var d = this.triangles, h = d.length, i = 2; i < h; i += 3) t += pd3D.VectorArray.triangleArea(d[i - 2], d[i - 1], d[i]);
        return t
    }, pd3D.Polygon.prototype.trimContoursToPlane = function(t) {
        for (var e, r, n, i, a, o, s, d = [], h = this.contours, l = h.length, c = [], u = 0; u < l; ++u) {
            n = (e = h[u])[(o = e.length) - 1], i = -.5 <= pd3D.PlaneArray.signedDistanceTo(n, t), s = [];
            for (var p = 0; p < o; ++p) r = p < 1 ? o - 1 : p - 1, n = e[p], (a = -.5 <= pd3D.PlaneArray.signedDistanceTo(n, t)) != i && pd3D.PlaneArray.intersect(d, e[r], e[p], t) && (.5 <= pd3D.VectorArray.distancePointToPoint(n, d) ? s.push(d.slice()) : a || s.push(n.slice())), a && s.push(n), i = a;
            1 < s.length && c.push(s)
        }
        return c
    }, pd3D.Polygon.prototype.intersectWithPlane = function(t, e) {
        var r, n, i, a, o, s, d = [],
            h = this.contours,
            l = h.length;
        e = e || [];
        for (var c = 0; c < l; ++c) {
            i = (r = h[c])[(s = r.length) - 1], a = -.5 <= pd3D.PlaneArray.signedDistanceTo(i, t), 0;
            for (var u = 0; u < s; ++u) n = u < 1 ? s - 1 : u - 1, i = r[u], (o = -.5 <= pd3D.PlaneArray.signedDistanceTo(i, t)) != a && pd3D.PlaneArray.intersect(d, r[n], r[u], t) && e.push(d.slice()), a = o
        }
        return e
    }, pd3D.Polygon.prototype.intersectTrianglesWithPlane = function(t, e) {
        if (!this.hasChanged && this.triangles || this.tesselate3D(), !this.triangles || this.triangles.length < 3) return !1;
        var r, n, i, a, o, s, d = this.triangles,
            h = [],
            l = [];
        e = e || [];
        for (var c = 0; c < d.length; c += 3) r = d[c + (l.length = 0)], n = d[c + 1], i = d[c + 2], a = 0 <= pd3D.PlaneArray.signedDistanceTo(r, t), o = 0 <= pd3D.PlaneArray.signedDistanceTo(n, t), s = 0 <= pd3D.PlaneArray.signedDistanceTo(i, t), a != o && pd3D.PlaneArray.intersect(h, r, n, t) && l.push(h.slice()), o != s && pd3D.PlaneArray.intersect(h, n, i, t) && l.push(h.slice()), s != a && pd3D.PlaneArray.intersect(h, i, r, t) && l.push(h.slice()), 2 == l.length && e.push([l[0], l[1]]);
        return e
    }, pd3D.Polygon.prototype.copyToMeshIndexed = function(e, t, r) {
        var n;
        if (!this.hasChanged && this.triangles || this.tesselate3D(), !this.triangles || this.triangles.length < 3) return !1;
        if (this.triangles[0][0].length < 2) return console.warn("WARNING: Polygon triangles must have vertices in the form [x,y] or [x,y,z]."), !1;
        var i, a, o, s, d = e.vertexCount(),
            h = !isNaN(t) && t < 0,
            l = null != r,
            c = this.contours,
            u = this.triangles;
        if (r = r || new pd.Indexer, t = pd.toBoolean(t, !1), !this.noOutline && e.lines)
            for (n = 0; n < c.length; ++n) {
                (i = c[n])[0]._indexId = 0, a = s = d + r.addById(i[0]);
                for (var p = 1; p < i.length; ++p) i[p]._indexId = 0, o = d + r.addById(i[p]), e.addLine(a, o), a = o;
                e.addLine(o, s)
            }
        if (h && !e.twoSided)
            for (n = 0; n < u.length; n += 3) a = d + r.addById(u[n + 0]), o = d + r.addById(u[n + 1]), s = d + r.addById(u[n + 2]), e.addTriangle(a, s, o), e.addTriangle(a, o, s);
        else
            for (n = 0; n < u.length; n += 3) a = d + r.addById(u[n + 0]), o = d + r.addById(u[n + 1]), s = d + r.addById(u[n + 2]), t ? e.addTriangle(a, s, o) : e.addTriangle(a, o, s);
        return this.color && e.color(this.color), this.plane && (t ? e.normal(-this.plane[0], -this.plane[1], -this.plane[2]) : e.normal(this.plane)), l || r.unique.map(function(t) {
            e.addVertex(t)
        }), !0
    }, pd3D.Polygon.prototype.copyToMeshRaw = function(t, e) {
        var r, n, i, a = this.isNotPlanar && null != t.lines;
        if (!this.hasChanged && this.triangles || this.tesselate3D(), !this.triangles || this.triangles.length < 3) return !1;
        if (this.triangles[0][0].length < 2) return console.warn("WARNING: Polygon triangles must have vertices in the form [x,y] or [x,y,z]."), !1;
        var o, s = !isNaN(e) && e < 0,
            d = this.contours,
            h = this.triangles;
        if (e = pd.toBoolean(e, !1), this.color && t.color(this.color), this.plane && (e ? t.normal(-this.plane[0], -this.plane[1], -this.plane[2]) : t.normal(this.plane)), !this.noOutline && t.lines)
            for (var l = 0, c = d.length; l < c; ++l) {
                o = d[l], r = n = t.addVertex(o[0]);
                for (var u = 1, p = o.length; u < p; ++u) i = t.addVertex(o[u]), t.addLine(n, i), n = i;
                t.addLine(i, r)
            }
        if (s && !t.twoSided)
            for (var l = 0, f = h.length; l < f; l += 3) r = t.addVertex(h[l + 0]), n = t.addVertex(h[l + 1]), i = t.addVertex(h[l + 2]), t.addTriangle(r, i, n), t.addTriangle(r, n, i), a && (t.addLine(r, n), t.addLine(n, i), t.addLine(i, r));
        else
            for (l = 0, f = h.length; l < f; l += 3) r = t.addVertex(h[l + 0]), n = t.addVertex(h[l + 1]), i = t.addVertex(h[l + 2]), e ? t.addTriangle(r, i, n) : t.addTriangle(r, n, i), a && (t.addLine(r, n), t.addLine(n, i), t.addLine(i, r));
        return !0
    }, pd3D.Polygon.prototype.copyTrianglesToMeshIndexed = function(e, t, r) {
        if (!this.hasChanged && this.triangles || this.tesselate3D(), !this.triangles || this.triangles.length < 3) return !1;
        if (this.triangles[0][0].length < 2) return console.warn("WARNING: Polygon triangles must have vertices in the form [x, y] or [x,y,z]."), !1;
        var n, i, a, o = e.vertexCount(),
            s = null != r,
            d = this.triangles;
        r = r || new pd.Indexer, t = t || !1;
        for (var h = 0, l = d.length; h < l; h += 3) n = o + r.addVectorArray(d[h + 0]), i = o + r.addVectorArray(d[h + 1]), a = o + r.addVectorArray(d[h + 2]), t ? e.addTriangle(n, a, i) : e.addTriangle(n, i, a);
        return this.color && e.color(this.color), this.plane && (t ? e.normal(-this.plane[0], -this.plane[1], -this.plane[2]) : e.normal(this.plane)), s || r.unique.map(function(t) {
            e.addVertex(t)
        }), !0
    }, pd3D.Polygon.prototype.copyTrianglesToMeshRaw = function(t, e) {
        if (!this.hasChanged && this.triangles || this.tesselate3D(), !this.triangles || this.triangles.length < 3 || this.triangles[0][0].length < 2) return !1;
        var r, n = 0,
            i = !isNaN(e) && e < 0,
            a = this.triangles;
        e = pd.toBoolean(e, !1), this.color && t.color(this.color), this.plane && (e ? t.normal(-this.plane[0], -this.plane[1], -this.plane[2]) : t.normal(this.plane));
        for (var o = 0, s = a.length; o < s; o += 3) {
            for (var d = 0; d < 3; ++d) r = a[o + d], n = t.addVertex([r[0], r[1], r[2]]);
            i && !t.twoSided ? (t.addTriangle(n - 2, n, n - 1), t.addTriangle(n - 2, n - 1, n)) : e ? t.addTriangle(n - 2, n, n - 1) : t.addTriangle(n - 2, n - 1, n)
        }
        return !0
    }, pd3D.Polygon.prototype.copyTrianglesToMeshRawExt = function(t, e, r, n) {
        if (!this.hasChanged && this.triangles || this.tesselate3D(), !this.triangles || this.triangles.length < 3) return !1;
        if (this.triangles[0][0].length < 2) return console.warn("WARNING: Polygon triangles must have vertices in the form [x, y] or [x,y,z]."), !1;
        e = pd.toNumber(e, 1), r = pd.isArray(r) ? r : pd3D.VectorArray.origin, n = pd.toBoolean(n, !1);
        var i, a = 0,
            o = this.triangles;
        this.color && t.color(this.color), this.plane && (n ? t.normal(-this.plane[0], -this.plane[1], -this.plane[2]) : t.normal(this.plane));
        for (var s = 0, d = o.length; s < d; s += 3) {
            for (var h = 0; h < 3; ++h) i = o[s + h], a = t.addVertex([i[0] * e + r[0], i[1] * e + r[1], (+i[2] || 0) * e + r[2]]);
            n ? t.addTriangle(a - 2, a, a - 1) : t.addTriangle(a - 2, a - 1, a)
        }
        return !0
    }, pd3D.Polygon.prototype.copyOutlineToMesh = function(t) {
        var e, r, n = this.contours;
        if (t.lines || t.addIndexBuffer("lines"), this.isNotPlanar && this.triangles && 2 < this.triangles.length)
            for (var i, a = 0, o = this.triangles, s = 0, d = o.length; s < d; s += 3) {
                for (var h = 0; h < 3; ++h) i = o[s + h], a = t.addVertex([i[0], i[1], i[2]]);
                t.addLine(a - 1, a - 2), t.addLine(a - 1, a), t.addLine(a - 2, a)
            } else
                for (s = 0; s < n.length; ++s)
                    if (1 < (e = n[s]).length) {
                        r = t.vertexCount();
                        for (a = t.addVertex(e[0]), h = 1, d = e.length; h < d; ++h) a = t.addVertex(e[h]), t.addLine(a - 1, a);
                        t.addLine(a, r)
                    }
        return !0
    }, pd3D.Polygon.prototype.copyOutlineToMeshExt = function(t, e, r) {
        e = pd.toNumber(e, 1), r = pd.isArray(r) ? r : pd3D.VectorArray.origin;
        var n, i, a, o, s = this.contours;
        t.lines || t.addIndexBuffer("lines");
        for (var d = 0; d < s.length; ++d)
            if (1 < (n = s[d]).length) {
                a = t.vertexCount();
                for (var h = 0, l = n.length; h < l; ++h) i = n[h], o = t.addVertex([+i[0] * e + r[0], +i[1] * e + r[1], +i[2] * e + r[2]]), 0 < h && t.addLine(o - 1, o);
                t.addLine(o, a)
            }
        return !0
    }, pd3D.Polygon.prototype.copyDraftinglinesToMesh = function(t, e) {
        e = pd.toNumber(e, 250);
        var r, n = this.contours;
        t.lines || t.addIndexBuffer("lines");
        for (var i = 0; i < n.length; ++i) {
            for (var a, o, s = t.vertexCount(), d = 0, h = (o = n[i]).length; d < h; ++d) r = o[d], a = t.addVertex([r[0], r[1], +r[2] || 0]), 0 < d && (t.addLine(a - 1, a, e), t.addDraftingLine(a - 1, a, e));
            t.addDraftingLine(a, s, e)
        }
        return !0
    }, pd3D.Polygon.prototype.checkPlanar = function(t) {
        return this.checkPlaneEqn(), 0 < this.contours.length && pd3D.PlaneArray.isPathPlanar(this.plane, this.contours[0], t)
    }, pd3D.Polygon.prototype.makePlanar = function(t) {
        var e = !1;
        this.checkPlaneEqn();
        for (var r = 0, n = this.contours.length; r < n; ++r) pd3D.PlaneArray.makePathPlanar(this.contours[r], this.plane, t) && (e = !0);
        return e
    }, pd3D.Polygon.prototype.sameSide = function(t, e) {
        return this.checkPlaneEqn(), -1e-9 <= (this.plane[0] * t[0] + this.plane[1] * t[1] + this.plane[2] * t[2] + this.plane[3]) * (this.plane[0] * e[0] + this.plane[1] * e[1] + this.plane[2] * e[2] + this.plane[3])
    }, pd3D.Polygon.prototype.inFront = function(t) {
        this.checkPlaneEqn();
        var e = this.computeOffsetPosition(this.plane, 5);
        return this.sameSide(t, e)
    }, pd3D.Polygon.prototype.extrude = function(t) {
        var e, r, n;
        this.checkPlaneEqn();
        var i, a, o, s, d, h = [],
            l = this.contours;
        if (this.sameSide(this.computeOffsetPosition(t, 5), this.computeOffsetPosition(this.plane, 5))) {
            for (i = new pd3D.Polygon, e = 0; e < l.length; ++e) {
                for (a = [], r = (o = l[e]).length - 1; 0 <= r; r--) s = o[r], a.push([s[0], s[1], +s[2] || 0]);
                i.addContour(a)
            }
            i.computePlaneEqn(), h.push(i)
        } else h.push(this);
        for (l = h[0].contours, e = 0; e < l.length; ++e)
            for (n = (o = l[e]).length, r = 0; r < n; ++r) n <= (d = r + 1) && (d = 0), s = o[r], d = o[d], s[2] = +s[2] || 0, d[2] = +d[2] || 0, (a = []).push([d[0], d[1], d[2]]), a.push([s[0], s[1], s[2]]), a.push([s[0] + t[0], s[1] + t[1], s[2] + t[2]]), a.push([d[0] + t[0], d[1] + t[1], d[2] + t[2]]), i = (new pd3D.Polygon).addContour(a), h.push(i);
        for (i = new pd3D.Polygon, e = 0; e < l.length; ++e) {
            for (a = [], r = (o = l[e]).length - 1; 0 <= r; r--) s = o[r], a.push([s[0] + t[0], s[1] + t[1], (+s[2] || 0) + t[2]]);
            i.addContour(a)
        }
        return h.push(i), h
    }
}();
pd3D = pd3D || {};
! function() {
    var i = 35044;
    pd3D.canUse32BitBuffers = !1, pd3D.RENDER_FIRST = -1, pd3D.RENDER_LAST = -2, pd3D.RENDER_ALL = -99;
    var t = 100;
    pd3D.getUniqueID = function() {
        return t++
    }, pd3D.peekNextUniqueID = function() {
        return t
    };
    pd3D.Mesh = function(t) {
        t = t || {}, this.id = pd3D.getUniqueID(), this.visible = !1 !== t.visible, this.defaultNormal = t.defaultNormal || [0, 0, 1], this.defaultColor = t.defaultColor || [.8, .8, .8, 1], this.defaultLineColor = t.defaultLineColor || this.defaultColor, this.defaultCoord = t.defaultCoord || [0, 0], this.hasVertexNormals = !1, this.hasVertexColors = !1, this.hasVertexCoords = !1, this.hasLines = !1, this.twoSided = null != t.twoSided ? !!t.twoSided : null, this.usageHint = pd.toInteger(t.usageHint, t.dynamic ? 35048 : i), this.activeSubMesh = null, this.boundingBox = null, this.vertexBuffers = {}, this.indexBuffers = {}, this._changeFlag = 4, this._data = {}, this._vtx_index = 0, this._tri_index = 0, this._lin_index = 0, this._pts_index = 0, this.addVertexBuffer("vertices", "gl_Vertex"), t.coords && this.addVertexBuffer("coords", "gl_TexCoord"), t.normals && this.addVertexBuffer("normals", "gl_Normal"), t.colors && this.addVertexBuffer("colors", "gl_Color"), !t.triangles && "triangles" in t || this.addIndexBuffer("triangles"), t.points && this.addIndexBuffer("points"), t.lines && this.addIndexBuffer("lines")
    }, pd3D.Mesh.prototype = {
        clone: function(t, e) {
            var r, n, i, a, o = this.isReusing;
            o && this.reuseEnd(), "normals" in (t = t || {}) || (t.normals = pd.isArray(this.normals)), "colors" in t || (t.colors = pd.isArray(this.colors)), "coords" in t || (t.coords = pd.isArray(this.coords)), "triangles" in t || (t.triangles = pd.isArray(this.triangles)), "points" in t || (t.points = pd.isArray(this.points)), "lines" in t || (t.lines = pd.isArray(this.lines));
            t = new pd3D.Mesh(t);
            if (t.vertices && this.vertices) {
                if (i = this.vertices, a = t.vertices, e) {
                    if (pd.isArray(e))
                        for (e[0] = +e[0], e[1] = +e[1], e[2] = +e[2], r = 0, n = i.length; r < n; ++r) a.push([i[r][0] + e[0], i[r][1] + e[1], i[r][2] + e[2]]);
                    else if ("x" in e)
                        for (r = 0, n = i.length; r < n; ++r) a.push([i[r][0] + e.x, i[r][1] + e.y, i[r][2] + e.z])
                } else
                    for (r = 0, n = i.length; r < n; ++r) a.push(i[r].slice());
                t._vtx_index = t.vertices.length
            }
            if (t.normals)
                for (i = this.normals, a = t.normals, r = 0, n = i.length; r < n; ++r) a.push(i[r].slice());
            if (t.colors && this.colors)
                for (i = this.colors, a = t.colors, r = 0, n = i.length; r < n; ++r) a.push(i[r].slice());
            if (t.coords && this.coords)
                for (i = this.coords, a = t.coords, r = 0, n = i.length; r < n; ++r) a.push(i[r].slice());
            return t.triangles && this.triangles && (t.triangles = this.triangles.slice(), t._tri_index = t.triangles.length), t.lines && this.lines && (t.lines = this.lines.slice(), t._lin_index = t.lines.length), t.points && this.points && (t.points = this.points.slice(), t._pts_index = t.points.length), "twoSided" in this && (t.twoSided = this.twoSided), this.isReusing = o, t.setChangeFlag(4), t
        },
        checkChangeFlag: function(t) {
            return this._changeFlag & t
        },
        setChangeFlag: function(t, e) {
            var r;
            switch (t) {
                case 4:
                    this._changeFlag |= t;
                    break;
                case 1:
                    e && null != (r = this.vertexBuffers[e]) && (r.updateRequired = !0, this._changeFlag |= t);
                    break;
                case 2:
                    e && null != (r = this.indexBuffers[e]) && (r.updateRequired = !0, this._changeFlag |= t)
            }
        },
        checkToCompile: function() {
            if (this._changeFlag) {
                if (4 & this._changeFlag) this.compile();
                else {
                    if (1 & this._changeFlag)
                        for (var t in this.vertexBuffers) {
                            (r = this.vertexBuffers[t]) && r.updateRequired && (r.data = this[r.name], r.compile())
                        }
                    if (2 & this._changeFlag)
                        for (var e in this.indexBuffers) {
                            var r;
                            (r = this.indexBuffers[e]) && r.updateRequired && (r.data = this[e], r.compile())
                        }
                }
                this._changeFlag = 0
            }
        },
        addVertexBuffer: function(t, e, r) {
            r = pd.toInteger(r, this.usageHint);
            r = this.vertexBuffers[e] = new pd3D.Buffer({
                usageHint: r,
                target: 34962,
                type: Float32Array
            });
            return this[r.name = t] = [], this.hasVertexNormals = void 0 !== this.normals, this.hasVertexColors = void 0 !== this.colors, this.hasVertexCoords = void 0 !== this.coords, this.setChangeFlag(4), this
        },
        addIndexBuffer: function(t, e) {
            e = pd.toInteger(e, this.usageHint);
            e = this.indexBuffers[t] = new pd3D.Buffer({
                usageHint: e,
                target: 34963,
                type: Uint16Array
            });
            return this[e.name = t] = [], this.hasLines = void 0 !== this.lines, this.setChangeFlag(4), this
        },
        hide: function() {
            return this.visible = !1, this
        },
        show: function(t) {
            return this.visible = !1 !== t, this
        },
        begin: function(t) {
            if (this.activeSubMesh && 0 <= pd.toNumber(this.activeSubMesh.mode, -1)) throw new Error("Mismatched 'mesh.begin()' and 'mesh.end()' calls.");
            switch (t) {
                case 0:
                    this.points || this.addIndexBuffer("points");
                    break;
                case 1:
                case 2:
                case 3:
                    this.lines || this.addIndexBuffer("lines");
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    this.triangles || this.addIndexBuffer("triangles");
                    break;
                default:
                    throw new TypeError("Given primitive `mode` (" + t.toString() + ") is invalid.")
            }
            return null != this.activeSubMesh && this.endSubMesh(this.activeSubMesh), this.activeSubMesh = new pd3D.SubMesh, this.startSubMesh(this.activeSubMesh), this.activeSubMesh.mode = t, this
        },
        normal: function(t) {
            switch (arguments.length) {
                case 0:
                    return this.defaultNormal;
                case 1:
                    if (pd.isArray(t) && 3 <= t.length) 3 < t.length ? this.defaultNormal = [t[0], t[1], t[2]] : this.defaultNormal = t;
                    else {
                        if (!(t instanceof pd3D.Vector)) throw new TypeError("Invalid vector, must be either a pd3D.Vector() or an [x,y,z] array.");
                        this.defaultNormal = t.toArray()
                    }
                    break;
                case 3:
                case 4:
                    this.defaultNormal = [+t, +arguments[1], +arguments[2]];
                    break;
                default:
                    throw new Error("Invalid arguments, must be given as x, y and z values.")
            }
            return this
        },
        color: function(t) {
            switch (arguments.length) {
                case 0:
                    return this.defaultColor;
                case 2:
                    if (!pd.isArray(t) || t.length < 3) throw new TypeError("Invalid color, must be either an [r,g,b] or an [r,g,b,a] array.");
                    t = [t[0], t[1], t[2], pd.constrainTo(+arguments[1], 0, 1)];
                case 1:
                    var e;
                    if (pd.isArray(t))
                        if (4 == t.length) this.defaultColor = t;
                        else {
                            if (3 != t.length) throw new TypeError("Invalid color, must be either an [r,g,b] or an [r,g,b,a] array.");
                            this.defaultColor = [+t[0], +t[1], +t[2], 1]
                        }
                    else t instanceof pd3D.Vector ? this.defaultColor = [t.x, t.y, t.z, 1] : 7 < (e = (+t).toString(16)).length ? this.defaultColor = [parseInt(e.substring(2, 4), 16) / 255, parseInt(e.substring(4, 6), 16) / 255, parseInt(e.substring(6, 8), 16) / 255, parseInt(e.substring(0, 2), 16) / 255] : (t = pd.toInteger(t, 0), this.defaultColor = [(255 & t) / 255, ((65280 & t) >> 8) / 255, ((16711680 & t) >> 16) / 255, 1]);
                    break;
                case 3:
                    this.defaultColor = [+arguments[0], +arguments[1], +arguments[2], 1];
                    break;
                case 4:
                    this.defaultColor = [+arguments[0], +arguments[1], +arguments[2], +arguments[3]];
                    break;
                default:
                    throw new TypeError("Invalid arguments, must be given as r, g, b [, a] values.")
            }
            return this
        },
        texCoord: function(t) {
            switch (arguments.length) {
                case 0:
                    return this.defaultCoord;
                case 1:
                    if (pd.isArray(t) && 2 <= t.length) 2 < t.length ? this.defaultCoord = [t[0], t[1]] : this.defaultCoord = t;
                    else {
                        if (!(t instanceof pd3D.Vector)) throw new TypeError("Invalid vector, must be either a pd3D.Vector() or an [x,y,z] array.");
                        this.defaultCoord = t.toArray(2)
                    }
                    break;
                case 2:
                case 3:
                    this.defaultCoord = [+t, +arguments[1]];
                    break;
                default:
                    throw new Error("Invalid arguments, must be given as an x, y and z values.")
            }
            return this
        },
        vertex: function(t) {
            var e = -1;
            return t && (2 == t.length && (t[2] = 0), this.isReusing && this._vtx_index < this.vertices.length ? (e = this._vtx_index, this.vertices[e] = t, this.hasVertexColors && (this.colors[e] = this.defaultColor), this.hasVertexNormals && (this.normals[e] = this.defaultNormal), this.hasVertexCoords && (this.coords[e] = this.defaultCoord), e = this._vtx_index++) : (e = this.vertices.length, this.vertices.push(t), this.hasVertexColors && this.colors.push(this.defaultColor), this.hasVertexNormals && this.normals.push(this.defaultNormal), this.hasVertexCoords && this.coords.push(this.defaultCoord), this._vtx_index = e + 1)), e
        },
        end: function() {
            var t = this.activeSubMesh;
            if (this.endSubMesh(t), !t || -1 == pd.toNumber(t.mode, -1)) throw new Error("Mismatched 'mesh.begin()' and 'mesh.end()' calls.");
            var e = t.vtx_start,
                r = t.vtx_stop;
            switch (t.mode) {
                case 0:
                    for (var n = e; n < r; ++n) this.addPoint(n);
                    break;
                case 1:
                    for (n = e + 1; n < r; n += 2) this.addLine(n - 1, n);
                    break;
                case 2:
                    this.addLine(r - 1, e);
                case 3:
                    for (n = e + 1; n < r; ++n) this.addLine(n - 1, n);
                    break;
                case 4:
                    for (n = e + 2; n < r; n += 3) this.addTriangle(n - 2, n - 1, n);
                    break;
                case 5:
                    for (var i = !0, n = e + 2; n < r; ++n) i ? this.addTriangle(n - 2, n - 1, n) : this.addTriangle(n - 1, n - 2, n), i = !i;
                    break;
                case 6:
                    for (n = e + 2; n < r; ++n) this.addTriangle(e, n - 1, n);
                    break;
                case 7:
                    for (n = e + 3; n < r; n += 4) this.addTriangle(n - 3, n - 2, n - 1), this.addTriangle(n - 3, n - 1, n);
                    break;
                case 8:
                    for (n = e + 3; n < r; n += 2) this.addTriangle(n - 3, n - 2, n - 1), this.addTriangle(n - 3, n - 1, n)
            }
            return this
        },
        getVertex: function(t) {
            if ((t = pd.toNumber(t, -1)) < 0 || t >= this.vertices.length) throw new Error("Invalid vertex index, must be a number between zero and `vertices` array length.");
            return this.vertices[t]
        },
        getNormal: function(t) {
            if ((t = pd.toNumber(t, -1)) < 0 || t >= this.normals.length) throw new Error("Invalid normal index, must be a number between zero and `normals` array length.");
            return this.normals[t]
        },
        setNormal: function(t, e) {
            if (this.hasVertexNormals) {
                if (this.normals.length != this.vertices.length) {
                    if (this.normals.length < this.vertices.length)
                        for (var r = this.normals.length, n = this.vertices.length; r < n; ++r) this.normals[r] = this.defaultNormal;
                    this.normals.length = this.vertices.length
                }
                if (t < this.normals.length) return this.normals[t] = e, !0
            }
            return !1
        },
        reuseStart: function(t) {
            return null != this.activeSubMesh && this.endSubMesh(this.activeSubMesh), this.isReusing = !0, null != t ? (this._vtx_index = +t.vtx_start || 0, this._tri_index = +t.tri_start || 0, this._lin_index = +t.lin_start || 0, this._pts_index = +t.pts_start || 0) : (this._vtx_index = 0, this._tri_index = 0, this._lin_index = 0, this._pts_index = 0), this
        },
        addVertex: function(t, e, r, n) {
            var i = -1;
            return t && (2 == t.length && (t[2] = 0), this.isReusing && this._vtx_index < this.vertices.length ? (i = this._vtx_index, this.vertices[i] = t, this.hasVertexColors && (this.colors[i] = e || this.defaultColor), this.hasVertexNormals && (this.normals[i] = r || this.defaultNormal), this.hasVertexCoords && (this.coords[i] = n || this.defaultCoord), this._vtx_index++) : (i = this.vertices.length, this.vertices.push(t), this.hasVertexColors && this.colors.push(e || this.defaultColor), this.hasVertexNormals && this.normals.push(r || this.defaultNormal), this.hasVertexCoords && this.coords.push(n || this.defaultCoord), this._vtx_index = i + 1)), i
        },
        addVertexObject: function(t) {
            var e = -1;
            if (t) {
                if (!t.pos) throw new TypeError("Vertex data must at least have a valid 'pos' property.");
                2 == t.pos.length && (t.pos[2] = 0), this.isReusing && this._vtx_index < this.vertices.length ? (e = this._vtx_index, this.vertices[e] = t.pos, this.hasVertexColors && (this.colors[e] = t.color || this.defaultColor), this.hasVertexNormals && (this.normals[e] = t.normal || this.defaultNormal), this.hasVertexCoords && (this.coords[e] = t.coord || this.defaultCoord), this._vtx_index++) : (e = this.vertices.length, this.vertices.push(t.pos), this.hasVertexColors && this.colors.push(t.color || this.defaultColor), this.hasVertexNormals && this.normals.push(t.normal || this.defaultNormal), this.hasVertexCoords && this.coords.push(t.coord || this.defaultCoord), this._vtx_index = e + 1)
            }
            return e
        },
        addTriangle: function(t, e, r) {
            if (this.isReusing && this._tri_index < this.triangles.length) {
                var n = this.triangles[this._tri_index];
                return n[0] = t, n[1] = e, n[2] = r, this._tri_index++
            }
            return this.triangles.push([t, e, r]), this._tri_index = this.triangles.length, this._tri_index - 1
        },
        addQuad: function(t, e, r, n) {
            e = this.addTriangle(t, e, r);
            return this.addTriangle(t, r, n), e
        },
        addLine: function(t, e) {
            if (this.isReusing && this._lin_index < this.lines.length) {
                var r = this.lines[this._lin_index];
                return r[0] = t, r[1] = e, this._lin_index++
            }
            return this.lines.push([t, e]), this._lin_index = this.lines.length, this.lines.length - 1
        },
        addLineStrip: function(t) {
            for (var e = pd.isArray(t) ? t : arguments, r = e.length, n = this.lineCount(), i = 1; i < r; ++i) this.addLine(e[i - 1], e[i]);
            return n
        },
        addLineLoop: function(t) {
            for (var e = pd.isArray(t) ? t : arguments, r = e.length, n = this.lineCount(), i = 1; i < r; ++i) this.addLine(e[i - 1], e[i]);
            return 2 < r && this.addLine(e[r - 1], e[0]), n
        },
        addDraftingLine: function(t, e, r, n) {
            var i, a, o, s = this.addLine(t, e);
            return 0 < r && (i = [this.defaultColor[0], this.defaultColor[1], this.defaultColor[2], 0], a = this.vertices[t], o = this.vertices[e], r = new pd3D.Vector(o[0] - a[0], o[1] - a[1], o[2] - a[2]).normalize().scale(r), this.addLine(e, this.addVertex([o[0] + r.x, o[1] + r.y, o[2] + r.z], i)), n || this.addLine(t, this.addVertex([a[0] - r.x, a[1] - r.y, a[2] - r.z], i))), s
        },
        addDraftingLines: function(t, e) {
            var r = -1,
                n = t.length;
            if (1 < n) {
                r = this.addLine(t[0], t[1]);
                for (var i, a, o, s, d = 2; d < n; ++d) this.addLine(t[d - 1], t[d]);
                0 < e && (i = [this.defaultColor[0], this.defaultColor[1], this.defaultColor[2], 0], a = this.vertices[t[0]], o = this.vertices[t[1]], s = new pd3D.Vector(o[0] - a[0], o[1] - a[1], o[2] - a[2]).normalize().scale(e), this.addLine(t[0], this.addVertex([a[0] - s.x, a[1] - s.y, a[2] - s.z], i)), a = this.vertices[t[n - 2]], o = this.vertices[t[n - 1]], s.init(o[0] - a[0], o[1] - a[1], o[2] - a[2]).normalize().scale(e), this.addLine(t[n - 1], this.addVertex([o[0] + s.x, o[1] + s.y, o[2] + s.z], i)))
            }
            return r
        },
        addSketchLine: function(t, e, r, n, i) {
            if (0 < r) {
                var a = [this.defaultColor[0], this.defaultColor[1], this.defaultColor[2], 0],
                    o = this.vertices[t],
                    s = this.vertices[e],
                    d = .4 * r,
                    h = (pd.randomNumber(), 0),
                    l = new pd3D.Vector(o[0], o[1], o[2]),
                    c = new pd3D.Vector(s[0], s[1], s[2]),
                    u = new pd3D.Vector.subtract(c, l),
                    p = pd.safeDivide(r, u.length()),
                    f = new pd3D.Vector;
                n = Math.round(pd.constrainTo(pd.toNumber(n, 1), 1, 8));
                for (var m = 0; m < n; ++m) {
                    for (var g, y = 1 - .5 * p, v = t, D = p; D < y; D += p) pd3D.Vector.lerp(l, c, D, f), h = (pd.randomNumber() - .5) * d, this.addLine(v, g = this.addVertex([f.x - h, f.y - h, f.z - h])), v = g;
                    this.addLine(v, e)
                }
                u.normalize().scale(r), this.addLine(e, this.addVertex([s[0] + u.x, s[1] + u.y, s[2] + u.z], a)), i || this.addLine(t, this.addVertex([o[0] - u.x, o[1] - u.y, o[2] - u.z], a))
            }
            return 0
        },
        addPoint: function(t) {
            return this.isReusing && this._pts_index < this.points.length ? (this.points[this._pts_index] = t, this._pts_index++) : (this.points.push(t), this._pts_index = this.points.length, this.points.length - 1)
        },
        addPrimitive: function(t, e) {
            if (!pd.isArray(e) || !pd.isArray(e[0])) throw new TypeError("Vertices must be given as an array of vector arrays.");
            this.begin(t);
            for (var r = 0, n = e.length; r < n; ++r) this.vertex(e[r]);
            return this.end(), this
        },
        reuseEnd: function() {
            return this.vertices && this.vertices.length > this._vtx_index && (this.vertices.length = this._vtx_index), this.hasVertexNormals && this.normals.length > this._vtx_index && (this.normals.length = this._vtx_index), this.hasVertexColors && this.colors.length > this._vtx_index && (this.colors.length = this._vtx_index), this.hasVertexCoords && this.coords.length > this._vtx_index && (this.coords.length = this._vtx_index), this.triangles && this.triangles.length > this._tri_index && (this.triangles.length = this._tri_index), this.lines && this.lines.length > this._lin_index && (this.lines.length = this._lin_index), this.points && this.points.length > this._pts_index && (this.points.length = this._pts_index), this.isReusing = !1, this.setChangeFlag(4), this
        },
        hasContent: function() {
            if (this.isReusing) {
                if (0 < this._vtx_index && (0 < this._tri_index || 0 < this._pts_index || 0 < this._lin_index)) return !0
            } else if (this.vertices && 0 < this.vertices.length && (this.triangles && 0 < this.triangles.length || this.points && 0 < this.points.length || this.lines && 0 < this.lines.length)) return !0;
            return !1
        },
        vertexCount: function() {
            return this.isReusing ? this._vtx_index : this.vertices ? this.vertices.length : 0
        },
        triangleCount: function() {
            return this.isReusing ? this._tri_index : this.triangles ? this.triangles.length : 0
        },
        lineCount: function() {
            return this.isReusing ? this._lin_index : this.lines ? this.lines.length : 0
        },
        pointCount: function() {
            return this.isReusing ? this._pts_index : this.points ? this.points.length : 0
        },
        startSubMesh: function(t) {
            return null != this.activeSubMesh && this.endSubMesh(this.activeSubMesh), (t = t || new pd3D.SubMesh).vtx_start = t.vtx_stop = this.vertexCount(), t.tri_start = t.tri_stop = this.triangleCount(), t.lin_start = t.lin_stop = this.lineCount(), t.pts_start = t.pts_stop = this.pointCount(), this.activeSubMesh = t
        },
        endSubMesh: function(t) {
            return null != (t = t || this.activeSubMesh) && (t.vtx_stop = this.vertexCount(), t.tri_stop = this.triangleCount(), t.lin_stop = this.lineCount(), t.pts_stop = this.pointCount()), this.activeSubMesh = null, t
        },
        merge: function(t, e) {
            if (t) {
                var r, n, i, a = this.vertexCount(),
                    o = this.isReusing;
                o && this.reuseEnd();
                var s = t.vertices,
                    d = this.vertices;
                if (e) {
                    if (pd.isArray(e))
                        for (e[0] = +e[0], e[1] = +e[1], e[2] = +e[2], r = 0, n = s.length; r < n; ++r) d.push([s[r][0] + e[0], s[r][1] + e[1], s[r][2] + e[2]]);
                    else if ("x" in e)
                        for (r = 0, n = s.length; r < n; ++r) d.push([s[r][0] + e.x, s[r][1] + e.y, s[r][2] + e.z])
                } else
                    for (r = 0, n = s.length; r < n; ++r) d.push(s[r]);
                if (this.hasVertexNormals)
                    if (d = this.normals, t.hasVertexNormals)
                        for (r = 0, n = (s = t.normals).length; r < n; ++r) d.push(s[r]);
                    else
                        for (i = t.defaultNormal, r = 0, n = t.vertices.length; r < n; ++r) d.push(i);
                if (this.hasVertexColors)
                    if (d = this.colors, t.hasVertexColors)
                        for (r = 0, n = (s = t.colors).length; r < n; ++r) d.push(s[r]);
                    else
                        for (i = t.defaultColor, r = 0, n = t.vertices.length; r < n; ++r) d.push(i);
                if (this.hasVertexCoords)
                    if (d = this.coords, t.hasVertexCoords)
                        for (r = 0, n = (s = t.coords).length; r < n; ++r) d.push(s[r]);
                    else
                        for (i = t.defaultCoord, r = 0, n = t.vertices.length; r < n; ++r) d.push(i);
                if (this.triangles && t.triangles && 0 < t.triangles.length)
                    for (s = t.triangles, d = this.triangles, r = 0, n = s.length; r < n; ++r) i = s[r], d.push([i[0] + a, i[1] + a, i[2] + a]);
                if (this.lines && t.lines && 0 < t.lines.length)
                    for (s = t.lines, d = this.lines, r = 0, n = s.length; r < n; ++r) i = s[r], d.push([i[0] + a, i[1] + a]);
                if (this.points && t.points && 0 < t.points.length)
                    for (s = t.points, d = this.points, r = 0, n = s.length; r < n; ++r) d.push(s[r] + a);
                this.vertices && (this._vtx_index = this.vertices.length), this.triangles && (this._tri_index = this.triangles.length), this.lines && (this._lin_index = this.lines.length), this.points && (this._pts_index = this.points.length), this.isReusing = o
            }
            return this.setChangeFlag(4), this
        },
        addLineExtensions: function(t, e, r, n, i) {
            if (t && 0 < e && t.lines && t.lineCount()) {
                this.lines || this.addIndexBuffer("lines");
                var a, o, s, d, h = new pd3D.Vector,
                    l = t.vertices,
                    c = this.defaultColor,
                    u = [c[0], c[1], c[2], 0],
                    p = t.lineCount();
                n = pd.constrainTo(pd.toNumber(n, 0), 0, p), i = pd.constrainTo(pd.toNumber(i, p), 0, p);
                for (var f = n; f < i; ++f) o = l[(d = t.lines[f])[0]], a = l[d[1]], h.x = a[0] - o[0], h.y = a[1] - o[1], h.z = a[2] - o[2], s = Math.min(e, .2 * h.length()), h.normalize().scale(s), d = this.addVertex(o, c), s = this.addVertex(a, c), r && this.addLine(d, s), o = this.addVertex([o[0] - h.x, o[1] - h.y, o[2] - h.z], u), this.addLine(d, o), o = this.addVertex([a[0] + h.x, a[1] + h.y, a[2] + h.z], u), this.addLine(s, o);
                this.defaultColor = c, this.setChangeFlag(1, "gl_Vertex"), this.setChangeFlag(2, "lines")
            }
            return this
        },
        updateOpacity: function(t) {
            if (this.colors) {
                t = pd.constrainTo(t, 0, 1);
                for (var e, r = this.colors.length, n = 0; n < r; ++n)(e = this.colors[n]).fade || (e[3] = t);
                this.setChangeFlag(1, "gl_Color")
            }
            return this
        },
        compile: function() {
            if (this.isReusing && this.reuseEnd(), null != this.activeSubMesh && this.endSubMesh(this.activeSubMesh), 0 < this.vertices.length) {
                var t, e, r, n = pd3D.canUse32BitBuffers && 65535 < this.vertices.length;
                for (t in this.vertexBuffers) {
                    (r = this.vertexBuffers[t]).data = this[r.name], r.compile()
                }
                for (e in this.indexBuffers) {
                    (r = this.indexBuffers[e]).type = n ? Uint32Array : Uint16Array, r.data = this[e], r.compile()
                }
            }
            return this._changeFlag = 0, this
        },
        compileBuffer: function(t) {
            var e;
            return this.isReusing && this.reuseEnd(), null != this.activeSubMesh && this.endSubMesh(this.activeSubMesh), this.vertexBuffers[t] ? ((e = this.vertexBuffers[t]).data = this[e.name], e.compile()) : this.indexBuffers[t] && ((e = this.indexBuffers[t]).type = pd3D.canUse32BitBuffers && 65535 < this.vertices.length ? Uint32Array : Uint16Array, e.data = this[t], e.compile()), this
        },
        compileBuffers: function(t) {
            this.isReusing && this.reuseEnd(), null != this.activeSubMesh && this.endSubMesh(this.activeSubMesh);
            for (var e = pd3D.canUse32BitBuffers && 65535 < this.vertices.length, r = pd.isArray(t) ? t : arguments, n = 0, i = r.length; n < i; ++n) {
                var a, o = r[n];
                this.vertexBuffers[o] ? ((a = this.vertexBuffers[o]).data = this[a.name], a.compile()) : this.indexBuffers[o] && ((a = this.indexBuffers[o]).type = e ? Uint32Array : Uint16Array, a.data = this[o], a.compile())
            }
            return this
        },
        clear: function() {
            for (var t in this.isReusing && this.reuseEnd(), null != this.activeSubMesh && this.endSubMesh(this.activeSubMesh), this.vertices && (this.vertices.length = 0), this.normals && (this.normals.length = 0), this.colors && (this.colors.length = 0), this.coords && (this.coords.length = 0), this.triangles && (this.triangles.length = 0), this.points && (this.points.length = 0), this.lines && (this.lines.length = 0), this.vertexBuffers) this.vertexBuffers[t].data = null;
            for (var e in this.indexBuffers) this.indexBuffers[e].data = null;
            return this._changeFlag = 4, this
        },
        destroy: function() {
            for (var t in this.clear(), this.vertexBuffers) {
                var e = this.vertexBuffers[t];
                e.buffer && (gl.bindBuffer(e.target, e.buffer), gl.bufferData(e.target, 1, i), gl.deleteBuffer(e.buffer))
            }
            for (var r in this.indexBuffers) {
                var n = this.indexBuffers[r];
                n.buffer && (gl.bindBuffer(n.target, n.buffer), gl.bufferData(n.target, 1, i), gl.deleteBuffer(n.buffer))
            }
            return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null), gl.bindBuffer(gl.ARRAY_BUFFER, null), this.vertexBuffers = {}, this.indexBuffers = {}, this._changeFlag = 0, this
        },
        transform: function(t, e, r, n) {
            var i, a = this.vertexCount();
            r = pd.toNumber(r, 0), n = pd.toNumber(n, a), a <= r && (r = a - 1), r < 0 && (r = 0);
            for (var o = r; o < n; ++o) i = this.vertices[o].slice(), t.applyPointTransformToArray(i), this.vertices[o] = i;
            if (this.normals && this.normals.length == a) {
                e = e || t.inverse().transpose();
                for (o = r; o < n; ++o) i = this.normals[o].slice(), pd3D.Vector.normaliseArrayInPlace(e.applyVectorTransformToArray(i)), this.normals[o] = i
            }
            return this.setChangeFlag(1, "gl_Vertex"), this.setChangeFlag(1, "gl_Normal"), this
        },
        transformInPlace: function(t, e, r, n) {
            var i = this.vertexCount();
            r = pd.toNumber(r, 0), n = pd.toNumber(n, i), i <= r && (r = i - 1), r < 0 && (r = 0);
            for (var a = r; a < n; ++a) t.applyPointTransformToArray(this.vertices[a]);
            if (this.normals && this.normals.length == i) {
                e = e || t.inverse().transpose();
                for (a = r; a < n; ++a) pd3D.Vector.normaliseArrayInPlace(e.applyVectorTransformToArray(this.normals[a]))
            }
            return this.setChangeFlag(1, "gl_Vertex"), this.setChangeFlag(1, "gl_Normal"), this
        },
        reverseNormals: function() {
            return this.normals && (this.isReusing && this.normals.length > this._vtx_index && (this.normals.length = this._vtx_index), this.normals = this.normals.map(function(t) {
                return [-t[0], -t[1], -t[2]]
            }), this.setChangeFlag(1, "gl_Normal")), this
        },
        reverseTriangles: function() {
            if (this.triangles) {
                for (var t, e, r = this.triangleCount(), n = 0; n < r; ++n) t = (e = this.triangles[n])[1], e[1] = e[2], e[2] = t;
                this.setChangeFlag(2, "triangles")
            }
            return this
        },
        translate: function(e, r, n) {
            return this.vertices && (this.isReusing && this.vertices.length > this._vtx_index && (this.vertices.length = this._vtx_index), this.vertices = this.vertices.map(function(t) {
                return [t[0] + e, t[1] + r, t[2] + n]
            }), this.setChangeFlag(1, "gl_Vertex")), this
        },
        scale: function(e, r, n) {
            return this.vertices && (this.isReusing && this.vertices.length > this._vtx_index && (this.vertices.length = this._vtx_index), this.vertices = this.vertices.map(function(t) {
                return [t[0] * e, t[1] * r, t[2] * n]
            }), this.setChangeFlag(1, "gl_Vertex")), this
        },
        swapYZ: function() {
            return this.vertices && (this.isReusing && this.vertices.length > this._vtx_index && (this.vertices.length = this._vtx_index), this.vertices = this.vertices.map(function(t) {
                return [t[0], -t[2], t[1]]
            }), this.setChangeFlag(1, "gl_Vertex")), this.normals && (this.isReusing && this.normals.length > this._vtx_index && (this.normals.length = this._vtx_index), this.normals = this.normals.map(function(t) {
                return [t[0], -t[2], t[1]]
            }), this.setChangeFlag(1, "gl_Normal")), this
        },
        mirrorY: function() {
            return this.vertices && (this.isReusing && this.vertices.length > this._vtx_index && (this.vertices.length = this._vtx_index), this.vertices = this.vertices.map(function(t) {
                return [t[0], -t[1], t[2]]
            }), this.setChangeFlag(1, "gl_Vertex")), this.normals && (this.isReusing && this.normals.length > this._vtx_index && (this.normals.length = this._vtx_index), this.normals = this.normals.map(function(t) {
                return [t[0], -t[1], t[2]]
            }), this.setChangeFlag(1, "gl_Normal")), this.reverseTriangles(), this
        },
        computeNormals: function() {
            this.normals || this.addVertexBuffer("normals", "gl_Normal"), this.isReusing && this.reuseEnd();
            var t = this.vertices.length,
                e = this.normals.length;
            e != t && (e = this.normals.length = t);
            for (var r = this.triangles.length, n = 0; n < e; ++n) this.normals[n] = new pd3D.Vector;
            for (n = 0; n < r; ++n) {
                var i = this.triangles[n],
                    a = pd3D.Vector.fromArray(this.vertices[i[0]]),
                    o = pd3D.Vector.fromArray(this.vertices[i[1]]),
                    s = pd3D.Vector.fromArray(this.vertices[i[2]]),
                    a = o.subtract(a).cross(s.subtract(a)).normalize();
                this.normals[i[0]] = this.normals[i[0]].add(a), this.normals[i[1]] = this.normals[i[1]].add(a), this.normals[i[2]] = this.normals[i[2]].add(a)
            }
            for (n = 0; n < e; ++n) this.normals[n] = this.normals[n].normalize().toArray();
            return this.setChangeFlag(1, "gl_Normal"), this
        },
        computeWireframe: function(t) {
            var e, r, n, i, a, o, s = new pd.IndexCounter;
            if (this.isReusing && this.reuseEnd(), t) {
                for (r = this.triangles.length, d = 0; d < r; ++d) i = (n = this.triangles[d])[0], a = n[1], o = n[2], s.count([Math.min(i, a), Math.max(i, a)]), s.count([Math.min(a, o), Math.max(a, o)]), s.count([Math.min(o, i), Math.max(o, i)]);
                this.lines || this.addIndexBuffer("lines"), r = s.unique.length;
                for (var d = 0; d < r; ++d) 0 < s.counter[d] % 2 && this.lines.push(s.unique[d])
            } else {
                for (r = this.triangles.length, d = 0; d < r; ++d)
                    for (n = this.triangles[d], e = 0; e < n.length; ++e) i = n[e], a = n[(e + 1) % n.length], s.count([Math.min(i, a), Math.max(i, a)]);
                this.lines || this.addIndexBuffer("lines"), this.lines = s.unique
            }
            return this.setChangeFlag(2, "lines"), this
        },
        computeBoundingBox: function() {
            var t, e, r, n;
            this.boundingBox ? ((t = this.boundingBox).min.init(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE), t.max = pd3D.Vector.negative(t.min, t.max)) : t = this.boundingBox = {
                min: new pd3D.Vector(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE),
                max: new pd3D.Vector(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE)
            }, r = t.min, n = t.max;
            for (var i = this.vertexCount(), a = 0; a < i; ++a) e = this.vertices[a], r.x > e[0] && (r.x = e[0]), r.y > e[1] && (r.y = e[1]), r.z > e[2] && (r.z = e[2]), n.x < e[0] && (n.x = e[0]), n.y < e[1] && (n.y = e[1]), n.z < e[2] && (n.z = e[2]);
            return this
        },
        getAABB: function(t) {
            var e, r, n;
            t && t.min || ((t = {
                min: new pd3D.Vector(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
            }).max = t.min.negative()), r = t.min, n = t.max;
            for (var i = this.vertexCount(), a = 0; a < i; ++a) e = this.vertices[a], r.x > e[0] && (r.x = e[0]), r.y > e[1] && (r.y = e[1]), r.z > e[2] && (r.z = e[2]), n.x < e[0] && (n.x = e[0]), n.y < e[1] && (n.y = e[1]), n.z < e[2] && (n.z = e[2]);
            return t
        },
        getBoundingSphere: function() {
            for (var t = this.getAABB(), e = {
                    center: t.min.add(t.max).divide(2),
                    radius: 0
                }, r = new pd3D.Vector, n = this.vertexCount(), i = 0; i < n; ++i) e.radius = Math.max(e.radius, pd3D.Vector.fromArray(this.vertices[i], r).subtract(e.center).length());
            return e
        }
    }, pd3D.Mesh.load = function(t, e, r) {
        return "coords" in (e = e || {}) || (e.coords = !!t.coords), "normals" in e || (e.normals = !!t.normals), "colors" in e || (e.colors = !!t.colors), "triangles" in e || (e.triangles = !!t.triangles), "points" in e || (e.points = !!t.points), "lines" in e || (e.lines = !!t.lines), r ? r.clear() : r = new pd3D.Mesh(e), r.vertices = t.vertices, r.coords && (r.coords = t.coords), r.normals && (r.normals = t.normals), r.colors && (r.colors = t.colors), r.triangles && (r.triangles = t.triangles), r.points && (r.points = t.points), r.lines && (r.lines = t.lines), "twoSided" in t && (r.twoSided = t.twoSided), r.compile(), r
    }, pd3D.SubMesh = function() {
        this.vtx_start = 0, this.vtx_stop = 0, this.tri_start = 0, this.tri_stop = 0, this.lin_start = 0, this.lin_stop = 0, this.pts_start = 0, this.pts_stop = 0
    }, pd3D.Buffer = function(t) {
        t = t || {}, this.buffer = null, this.target = pd.toInteger(t.target, 34962), this.type = t.type || Float32Array, this.usageHint = pd.toInteger(t.usageHint, i), this.name = t.name || "", this.updateRequired = !0, this.spacing = pd.toInteger(t.spacing, 1), this.length = pd.toInteger(t.length, 0), this.data = 0 < this.length ? this.type(this.length) : []
    }, pd3D.Buffer.prototype.compile = function(t) {
        var e = this.data;
        if (!pd.isTypedArray(e)) {
            var r = [];
            if (0 < e.length && !pd.isArray(e[0])) r = e;
            else if (Array.prototype.flat) r = e.flat();
            else
                for (var n = 0; n < e.length; n += 1e4) r = Array.prototype.concat.apply(r, e.slice(n, n + 1e4));
            var i = 0 < e.length ? r.length / e.length : 0;
            if (i != Math.round(i)) throw "buffer elements not of consistent size, average size is " + i;
            e = new this.type(r), this.spacing = i
        }
        this.buffer = this.buffer || gl.createBuffer(), this.length = e.length, gl.bindBuffer(this.target, this.buffer), gl.bufferData(this.target, e, t || this.usageHint), this.updateRequired = !1
    }, pd3D.Vector = function(t, e, r) {
        this.x = 0, this.y = 0, (this.z = 0) < arguments.length && (1 == arguments.length ? t instanceof pd3D.Vector ? (this.x = t.x, this.y = t.y, this.z = t.z) : pd.isArray(t) ? (this.x = +t[0] || 0, this.y = +t[1] || 0, this.z = +t[2] || 0) : (t = +t || 0, this.x = t, this.y = t, this.z = t) : (this.x = +t || 0, this.y = +e || 0, this.z = +r || 0))
    }, pd3D.Vector.prototype = {
        negate: function() {
            return this.x = -this.x, this.y = -this.y, this.z = -this.z, this
        },
        normalize: function() {
            var t = this.length();
            return 0 < t && (this.x /= t, this.y /= t, this.z /= t), this
        },
        move: function(t, e, r) {
            return 1 == arguments.length ? t instanceof pd3D.Vector ? (this.x += t.x, this.y += t.y, this.z += t.z) : pd.isArray(t) ? (this.x += +t[0] || 0, this.y += +t[1] || 0, this.z += +t[2] || 0) : (t = +t || 0, this.x += t, this.y += t, this.z += t) : (this.x += +t || 0, this.y += +e || 0, this.z += +r || 0), this
        },
        scale: function(t, e, r) {
            return 1 == arguments.length ? t instanceof pd3D.Vector ? (this.x *= t.x, this.y *= t.y, this.z *= t.z) : pd.isArray(t) ? (this.x *= +t[0] || 0, this.y *= +t[1] || 0, this.z *= +t[2] || 0) : (t = +t || 0, this.x *= t, this.y *= t, this.z *= t) : (this.x *= +t || 0, this.y *= +e || 0, this.z *= +r || 0), this
        },
        fromPolarAngles: function(t, e) {
            var r = Math.cos(e);
            return this.init(r * Math.sin(t), r * Math.cos(t), Math.sin(e)), this
        },
        fromArray: function(t) {
            return this.x = t[0], this.y = t[1], this.z = t[2], this
        },
        init: function(t, e, r) {
            return 1 == arguments.length ? t instanceof pd3D.Vector ? (this.x = t.x, this.y = t.y, this.z = t.z) : pd.isArray(t) ? (this.x = +t[0] || 0, this.y = +t[1] || 0, this.z = +t[2] || 0) : (t = +t || 0, this.x = t, this.y = t, this.z = t) : (this.x = +t || 0, this.y = +e || 0, this.z = +r || 0), this
        },
        distanceTo: function(t) {
            var e = t.x - this.x,
                r = t.y - this.y,
                t = t.z - this.z;
            return Math.sqrt(e * e + r * r + t * t)
        },
        negative: function() {
            return new pd3D.Vector(-this.x, -this.y, -this.z)
        },
        add: function(t) {
            return t instanceof pd3D.Vector ? new pd3D.Vector(this.x + t.x, this.y + t.y, this.z + t.z) : new pd3D.Vector(this.x + t, this.y + t, this.z + t)
        },
        subtract: function(t) {
            return t instanceof pd3D.Vector ? new pd3D.Vector(this.x - t.x, this.y - t.y, this.z - t.z) : new pd3D.Vector(this.x - t, this.y - t, this.z - t)
        },
        multiply: function(t) {
            return t instanceof pd3D.Vector ? new pd3D.Vector(this.x * t.x, this.y * t.y, this.z * t.z) : new pd3D.Vector(this.x * t, this.y * t, this.z * t)
        },
        divide: function(t) {
            return t instanceof pd3D.Vector ? new pd3D.Vector(this.x / t.x, this.y / t.y, this.z / t.z) : new pd3D.Vector(this.x / t, this.y / t, this.z / t)
        },
        closeTo: function(t, e) {
            return e = pd.toNumber(e, pd.Const.EPSILON), !(this.x > t.x + e || this.x < t.x - e) && (!(this.y > t.y + e || this.y < t.y - e) && !(this.z > t.z + e || this.z < t.z - e))
        },
        equals: function(t) {
            return this.x == t.x && this.y == t.y && this.z == t.z
        },
        dot: function(t) {
            return this.x * t.x + this.y * t.y + this.z * t.z
        },
        cross: function(t) {
            return new pd3D.Vector(this.y * t.z - this.z * t.y, this.z * t.x - this.x * t.z, this.x * t.y - this.y * t.x)
        },
        length: function() {
            return Math.sqrt(this.dot(this))
        },
        unit: function() {
            return this.divide(this.length())
        },
        min: function() {
            return Math.min(Math.min(this.x, this.y), this.z)
        },
        max: function() {
            return Math.max(Math.max(this.x, this.y), this.z)
        },
        toAngles: function() {
            return {
                theta: Math.atan2(this.y, this.x),
                phi: Math.asin(this.z / this.length())
            }
        },
        toArray: function(t) {
            return t ? [this.x, this.y, this.z].slice(0, t) : [this.x, this.y, this.z]
        },
        clone: function() {
            return new pd3D.Vector(this.x, this.y, this.z)
        },
        angleBetweenPoints: function(t, e) {
            var r = this.distanceTo(t) * this.distanceTo(e),
                e = (t.x - this.x) * (e.x - this.x) + (t.y - this.y) * (e.y - this.y) + (t.z - this.z) * (e.z - this.z),
                r = 1e-12 < Math.abs(r) ? e / r : 0;
            return 1 <= r ? 0 : r <= -1 ? Math.PI : Math.acos(r)
        }
    }, pd3D.Vector.negative = function(t, e) {
        return (e = e || new pd3D.Vector).x = -t.x, e.y = -t.y, e.z = -t.z, e
    }, pd3D.Vector.add = function(t, e, r) {
        return r = r || new pd3D.Vector, e instanceof pd3D.Vector ? (r.x = t.x + e.x, r.y = t.y + e.y, r.z = t.z + e.z) : (r.x = t.x + e, r.y = t.y + e, r.z = t.z + e), r
    }, pd3D.Vector.subtract = function(t, e, r) {
        return r = r || new pd3D.Vector, e instanceof pd3D.Vector ? (r.x = t.x - e.x, r.y = t.y - e.y, r.z = t.z - e.z) : (r.x = t.x - e, r.y = t.y - e, r.z = t.z - e), r
    }, pd3D.Vector.multiply = function(t, e, r) {
        return r = r || new pd3D.Vector, e instanceof pd3D.Vector ? (r.x = t.x * e.x, r.y = t.y * e.y, r.z = t.z * e.z) : (r.x = t.x * e, r.y = t.y * e, r.z = t.z * e), r
    }, pd3D.Vector.divide = function(t, e, r) {
        return r = r || new pd3D.Vector, e instanceof pd3D.Vector ? (r.x = t.x / e.x, r.y = t.y / e.y, r.z = t.z / e.z) : (r.x = t.x / e, r.y = t.y / e, r.z = t.z / e), r
    }, pd3D.Vector.cross = function(t, e, r) {
        r = r || new pd3D.Vector;
        var n = t.y * e.z - t.z * e.y,
            i = t.z * e.x - t.x * e.z,
            e = t.x * e.y - t.y * e.x;
        return r.x = n, r.y = i, r.z = e, r
    }, pd3D.Vector.unit = function(t, e) {
        e = e || new pd3D.Vector;
        var r = t.length();
        return e.x = t.x / r, e.y = t.y / r, e.z = t.z / r, e
    }, pd3D.Vector.fromAngles = function(t, e, r) {
        return (r = r || new pd3D.Vector).x = Math.cos(t) * Math.cos(e), r.y = Math.sin(t) * Math.cos(e), r.z = Math.sin(e), r
    }, pd3D.Vector.rotateX = function(t, e, r, n) {
        var i = t.y - e.y,
            a = t.z - e.z,
            o = Math.cos(r),
            r = Math.sin(r);
        return (n = n || new pd3D.Vector).y = i * o - a * r + e.y, n.z = a * o + i * r + e.z, n.x = t.x, n
    }, pd3D.Vector.rotateY = function(t, e, r, n) {
        var i = t.x - e.x,
            a = t.z - e.z,
            o = Math.cos(r),
            r = Math.sin(r);
        return (n = n || new pd3D.Vector).x = i * o - a * r + e.x, n.z = a * o + i * r + e.z, n.y = t.y, n
    }, pd3D.Vector.rotateZ = function(t, e, r, n) {
        var i = t.x - e.x,
            a = t.y - e.y,
            o = Math.cos(r),
            r = Math.sin(r);
        return (n = n || new pd3D.Vector).x = i * o - a * r + e.x, n.y = a * o + i * r + e.y, n.z = t.z, n
    }, pd3D.Vector.sphericalToCartesian3D = function(t, e, r, n) {
        var i = Math.cos(t),
            a = Math.sin(t),
            t = r * Math.cos(e);
        return (n = n || new pd3D.Vector).x = t * i, n.y = t * a, n.z = r * Math.sin(e), n
    }, pd3D.Vector.angleBetweenPoints = function(t, e, r) {
        var n = t.distanceTo(e) * t.distanceTo(r),
            t = (e.x - t.x) * (r.x - t.x) + (e.y - t.y) * (r.y - t.y) + (e.z - t.z) * (r.z - t.z),
            n = 1e-12 < Math.abs(n) ? t / n : 0;
        return 1 <= n ? 0 : n <= -1 ? Math.PI : Math.acos(n)
    }, pd3D.Vector.randomDirection = function(t) {
        return pd3D.Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(2 * Math.random() - 1), t)
    }, pd3D.Vector.min = function(t, e, r) {
        return (r = r || new pd3D.Vector).x = Math.min(t.x, e.x), r.y = Math.min(t.y, e.y), r.z = Math.min(t.z, e.z), r
    }, pd3D.Vector.max = function(t, e, r) {
        return (r = r || new pd3D.Vector).x = Math.max(t.x, e.x), r.y = Math.max(t.y, e.y), r.z = Math.max(t.z, e.z), r
    }, pd3D.Vector.lerp = function(t, e, r, n) {
        var i;
        return n = n || new pd3D.Vector, r instanceof pd3D.Vector ? (n.x = (1 - r.x) * t.x + r.x * e.x, n.y = (1 - r.y) * t.y + r.y * e.y, n.z = (1 - r.z) * t.z + r.z * e.z) : (r = 1 - (i = +r), n.x = r * t.x + i * e.x, n.y = r * t.y + i * e.y, n.z = r * t.z + i * e.z), n
    }, pd3D.Vector.fromArray = function(t, e) {
        return (e = e || new pd3D.Vector).x = +t[0] || 0, e.y = +t[1] || 0, e.z = +t[2] || 0, e
    }, pd3D.Vector.normaliseArrayInPlace = function(t) {
        var e = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]);
        return 0 < e && (t[0] /= e, t[1] /= e, t[2] /= e), t
    }, pd3D.Vector.UnitX = new pd3D.Vector(1, 0, 0), pd3D.Vector.UnitY = new pd3D.Vector(0, 1, 0), pd3D.Vector.UnitZ = new pd3D.Vector(0, 0, 1);
    var r = "undefined" != typeof Float32Array;
    pd3D.Matrix = function() {
        var t = Array.prototype.concat.apply([], arguments);
        t.length || (t = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), this.m = r ? new Float32Array(t) : t
    }, pd3D.Matrix.prototype = {
        inverse: function(t) {
            return t = t || new pd3D.Matrix, pd3D.Matrix.inverse(this, t)
        },
        transpose: function(t) {
            return t = t || new pd3D.Matrix, pd3D.Matrix.transpose(this, t)
        },
        multiply: function(t, e) {
            return e = e || new pd3D.Matrix, pd3D.Matrix.multiply(this, t, e)
        },
        multiplyBy: function(t, e) {
            return e = e || new pd3D.Matrix, pd3D.Matrix.multiply(this, t, e), this.init(e)
        },
        init: function(t) {
            if (null != t)
                for (var e = this.m, r = t.m, n = 0; n < 16; ++n) e[n] = r[n];
            return this
        },
        transformPoint: function(t, e) {
            var r = this.m,
                n = r[12] * t.x + r[13] * t.y + r[14] * t.z + r[15]; - 1e-12 < n && n < 1e-12 && (n = 1);
            var i = (r[0] * t.x + r[1] * t.y + r[2] * t.z + r[3]) / n,
                a = (r[4] * t.x + r[5] * t.y + r[6] * t.z + r[7]) / n,
                n = (r[8] * t.x + r[9] * t.y + r[10] * t.z + r[11]) / n;
            return e ? e.init(i, a, n) : new pd3D.Vector(i, a, n)
        },
        transformVector: function(t, e) {
            var r = this.m,
                n = r[0] * t.x + r[1] * t.y + r[2] * t.z,
                i = r[4] * t.x + r[5] * t.y + r[6] * t.z,
                t = r[8] * t.x + r[9] * t.y + r[10] * t.z;
            return e ? e.init(n, i, t) : new pd3D.Vector(n, i, t)
        },
        copyToColumnMajorArray: function(t) {
            var e = this.m;
            return (t = t || new Float32Array(16))[0] = e[0], t[4] = e[1], t[8] = e[2], t[12] = e[3], t[1] = e[4], t[5] = e[5], t[9] = e[6], t[13] = e[7], t[2] = e[8], t[6] = e[9], t[10] = e[10], t[14] = e[11], t[3] = e[12], t[7] = e[13], t[11] = e[14], t[15] = e[15], t
        },
        applyPointTransformToArray: function(t) {
            var e = this.m,
                r = e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3],
                n = e[4] * t[0] + e[5] * t[1] + e[6] * t[2] + e[7],
                i = e[8] * t[0] + e[9] * t[1] + e[10] * t[2] + e[11],
                e = e[12] * t[0] + e[13] * t[1] + e[14] * t[2] + e[15];
            return 0 < Math.abs(e) ? (t[0] = r / e, t[1] = n / e, t[2] = i / e) : (t[0] = r, t[1] = n, t[2] = i), t
        },
        applyVectorTransformToArray: function(t) {
            var e = this.m,
                r = e[0] * t[0] + e[1] * t[1] + e[2] * t[2],
                n = e[4] * t[0] + e[5] * t[1] + e[6] * t[2],
                e = e[8] * t[0] + e[9] * t[1] + e[10] * t[2];
            return t[0] = r, t[1] = n, t[2] = e, t
        }
    }, pd3D.Matrix.fromArray = function(t, e) {
        if (!t || 16 != t.length) throw new TypeError("Argument 'array' must be a valid Array containing 16 numeric values.");
        return (e = e || new pd3D.Matrix).m = r ? new Float32Array(t) : t, e
    }, pd3D.Matrix.clone = function(t, e) {
        if (e = e || new pd3D.Matrix, null != t)
            for (var r = e.m, n = t.m, i = 0; i < 16; ++i) r[i] = n[i];
        return e
    }, pd3D.Matrix.inverse = function(t, e) {
        e = e || new pd3D.Matrix;
        var t = t.m,
            r = e.m;
        r[0] = t[5] * t[10] * t[15] - t[5] * t[14] * t[11] - t[6] * t[9] * t[15] + t[6] * t[13] * t[11] + t[7] * t[9] * t[14] - t[7] * t[13] * t[10], r[1] = -t[1] * t[10] * t[15] + t[1] * t[14] * t[11] + t[2] * t[9] * t[15] - t[2] * t[13] * t[11] - t[3] * t[9] * t[14] + t[3] * t[13] * t[10], r[2] = t[1] * t[6] * t[15] - t[1] * t[14] * t[7] - t[2] * t[5] * t[15] + t[2] * t[13] * t[7] + t[3] * t[5] * t[14] - t[3] * t[13] * t[6], r[3] = -t[1] * t[6] * t[11] + t[1] * t[10] * t[7] + t[2] * t[5] * t[11] - t[2] * t[9] * t[7] - t[3] * t[5] * t[10] + t[3] * t[9] * t[6], r[4] = -t[4] * t[10] * t[15] + t[4] * t[14] * t[11] + t[6] * t[8] * t[15] - t[6] * t[12] * t[11] - t[7] * t[8] * t[14] + t[7] * t[12] * t[10], r[5] = t[0] * t[10] * t[15] - t[0] * t[14] * t[11] - t[2] * t[8] * t[15] + t[2] * t[12] * t[11] + t[3] * t[8] * t[14] - t[3] * t[12] * t[10], r[6] = -t[0] * t[6] * t[15] + t[0] * t[14] * t[7] + t[2] * t[4] * t[15] - t[2] * t[12] * t[7] - t[3] * t[4] * t[14] + t[3] * t[12] * t[6], r[7] = t[0] * t[6] * t[11] - t[0] * t[10] * t[7] - t[2] * t[4] * t[11] + t[2] * t[8] * t[7] + t[3] * t[4] * t[10] - t[3] * t[8] * t[6], r[8] = t[4] * t[9] * t[15] - t[4] * t[13] * t[11] - t[5] * t[8] * t[15] + t[5] * t[12] * t[11] + t[7] * t[8] * t[13] - t[7] * t[12] * t[9], r[9] = -t[0] * t[9] * t[15] + t[0] * t[13] * t[11] + t[1] * t[8] * t[15] - t[1] * t[12] * t[11] - t[3] * t[8] * t[13] + t[3] * t[12] * t[9], r[10] = t[0] * t[5] * t[15] - t[0] * t[13] * t[7] - t[1] * t[4] * t[15] + t[1] * t[12] * t[7] + t[3] * t[4] * t[13] - t[3] * t[12] * t[5], r[11] = -t[0] * t[5] * t[11] + t[0] * t[9] * t[7] + t[1] * t[4] * t[11] - t[1] * t[8] * t[7] - t[3] * t[4] * t[9] + t[3] * t[8] * t[5], r[12] = -t[4] * t[9] * t[14] + t[4] * t[13] * t[10] + t[5] * t[8] * t[14] - t[5] * t[12] * t[10] - t[6] * t[8] * t[13] + t[6] * t[12] * t[9], r[13] = t[0] * t[9] * t[14] - t[0] * t[13] * t[10] - t[1] * t[8] * t[14] + t[1] * t[12] * t[10] + t[2] * t[8] * t[13] - t[2] * t[12] * t[9], r[14] = -t[0] * t[5] * t[14] + t[0] * t[13] * t[6] + t[1] * t[4] * t[14] - t[1] * t[12] * t[6] - t[2] * t[4] * t[13] + t[2] * t[12] * t[5], r[15] = t[0] * t[5] * t[10] - t[0] * t[9] * t[6] - t[1] * t[4] * t[10] + t[1] * t[8] * t[6] + t[2] * t[4] * t[9] - t[2] * t[8] * t[5];
        for (var n = t[0] * r[0] + t[1] * r[4] + t[2] * r[8] + t[3] * r[12], i = 0; i < 16; ++i) r[i] /= n;
        return e
    }, pd3D.Matrix.transpose = function(t, e) {
        e = e || new pd3D.Matrix;
        var r = t.m,
            t = e.m;
        return t[0] = r[0], t[1] = r[4], t[2] = r[8], t[3] = r[12], t[4] = r[1], t[5] = r[5], t[6] = r[9], t[7] = r[13], t[8] = r[2], t[9] = r[6], t[10] = r[10], t[11] = r[14], t[12] = r[3], t[13] = r[7], t[14] = r[11], t[15] = r[15], e
    }, pd3D.Matrix.multiply = function(t, e, r) {
        var n, i = t.m,
            e = e.m;
        if (t === r) {
            (n = [])[0] = i[0] * e[0] + i[1] * e[4] + i[2] * e[8] + i[3] * e[12], n[1] = i[0] * e[1] + i[1] * e[5] + i[2] * e[9] + i[3] * e[13], n[2] = i[0] * e[2] + i[1] * e[6] + i[2] * e[10] + i[3] * e[14], n[3] = i[0] * e[3] + i[1] * e[7] + i[2] * e[11] + i[3] * e[15], n[4] = i[4] * e[0] + i[5] * e[4] + i[6] * e[8] + i[7] * e[12], n[5] = i[4] * e[1] + i[5] * e[5] + i[6] * e[9] + i[7] * e[13], n[6] = i[4] * e[2] + i[5] * e[6] + i[6] * e[10] + i[7] * e[14], n[7] = i[4] * e[3] + i[5] * e[7] + i[6] * e[11] + i[7] * e[15], n[8] = i[8] * e[0] + i[9] * e[4] + i[10] * e[8] + i[11] * e[12], n[9] = i[8] * e[1] + i[9] * e[5] + i[10] * e[9] + i[11] * e[13], n[10] = i[8] * e[2] + i[9] * e[6] + i[10] * e[10] + i[11] * e[14], n[11] = i[8] * e[3] + i[9] * e[7] + i[10] * e[11] + i[11] * e[15], n[12] = i[12] * e[0] + i[13] * e[4] + i[14] * e[8] + i[15] * e[12], n[13] = i[12] * e[1] + i[13] * e[5] + i[14] * e[9] + i[15] * e[13], n[14] = i[12] * e[2] + i[13] * e[6] + i[14] * e[10] + i[15] * e[14], n[15] = i[12] * e[3] + i[13] * e[7] + i[14] * e[11] + i[15] * e[15];
            for (var a = 0; a < 16; ++a) i[a] = n[a]
        } else {
            (n = (r = r || new pd3D.Matrix).m)[0] = i[0] * e[0] + i[1] * e[4] + i[2] * e[8] + i[3] * e[12], n[1] = i[0] * e[1] + i[1] * e[5] + i[2] * e[9] + i[3] * e[13], n[2] = i[0] * e[2] + i[1] * e[6] + i[2] * e[10] + i[3] * e[14], n[3] = i[0] * e[3] + i[1] * e[7] + i[2] * e[11] + i[3] * e[15], n[4] = i[4] * e[0] + i[5] * e[4] + i[6] * e[8] + i[7] * e[12], n[5] = i[4] * e[1] + i[5] * e[5] + i[6] * e[9] + i[7] * e[13], n[6] = i[4] * e[2] + i[5] * e[6] + i[6] * e[10] + i[7] * e[14], n[7] = i[4] * e[3] + i[5] * e[7] + i[6] * e[11] + i[7] * e[15], n[8] = i[8] * e[0] + i[9] * e[4] + i[10] * e[8] + i[11] * e[12], n[9] = i[8] * e[1] + i[9] * e[5] + i[10] * e[9] + i[11] * e[13], n[10] = i[8] * e[2] + i[9] * e[6] + i[10] * e[10] + i[11] * e[14], n[11] = i[8] * e[3] + i[9] * e[7] + i[10] * e[11] + i[11] * e[15], n[12] = i[12] * e[0] + i[13] * e[4] + i[14] * e[8] + i[15] * e[12], n[13] = i[12] * e[1] + i[13] * e[5] + i[14] * e[9] + i[15] * e[13], n[14] = i[12] * e[2] + i[13] * e[6] + i[14] * e[10] + i[15] * e[14], n[15] = i[12] * e[3] + i[13] * e[7] + i[14] * e[11] + i[15] * e[15]
        }
        return r
    }, pd3D.Matrix.identity = function(t) {
        var e = (t = t || new pd3D.Matrix).m;
        return e[0] = e[5] = e[10] = e[15] = 1, e[1] = e[2] = e[3] = e[4] = e[6] = e[7] = e[8] = e[9] = e[11] = e[12] = e[13] = e[14] = 0, t
    }, pd3D.Matrix.perspective = function(t, e, r, n, i) {
        t = Math.tan(t * Math.PI / 360) * r, e *= t;
        return pd3D.Matrix.frustum(-e, e, -t, t, r, n, i)
    }, pd3D.Matrix.frustum = function(t, e, r, n, i, a, o) {
        var s = (o = o || new pd3D.Matrix).m;
        return s[0] = 2 * i / (e - t), s[1] = 0, s[2] = (e + t) / (e - t), s[3] = 0, s[4] = 0, s[5] = 2 * i / (n - r), s[6] = (n + r) / (n - r), s[7] = 0, s[8] = 0, s[9] = 0, s[10] = -(a + i) / (a - i), s[11] = -2 * a * i / (a - i), s[12] = 0, s[13] = 0, s[14] = -1, s[15] = 0, o
    }, pd3D.Matrix.ortho = function(t, e, r, n, i, a, o) {
        var s = (o = o || new pd3D.Matrix).m;
        return s[0] = 2 / (e - t), s[1] = 0, s[2] = 0, s[3] = -(e + t) / (e - t), s[4] = 0, s[5] = 2 / (n - r), s[6] = 0, s[7] = -(n + r) / (n - r), s[8] = 0, s[9] = 0, s[10] = -2 / (a - i), s[11] = -(a + i) / (a - i), s[12] = 0, s[13] = 0, s[14] = 0, s[15] = 1, o
    }, pd3D.Matrix.scale = function(t, e, r, n) {
        var i = (n = n || new pd3D.Matrix).m;
        return i[0] = +t || 0, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = +e || 0, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = +r || 0, i[11] = 0, i[12] = 0, i[13] = 0, i[14] = 0, i[15] = 1, n
    }, pd3D.Matrix.translate = function(t, e, r, n) {
        var i = (n = n || new pd3D.Matrix).m;
        return i[0] = 1, i[1] = 0, i[2] = 0, i[3] = +t || 0, i[4] = 0, i[5] = 1, i[6] = 0, i[7] = +e || 0, i[8] = 0, i[9] = 0, i[10] = 1, i[11] = +r || 0, i[12] = 0, i[13] = 0, i[14] = 0, i[15] = 1, n
    }, pd3D.Matrix.rotate = function(t, e, r, n, i) {
        if (!t || !e && !r && !n) return pd3D.Matrix.identity(i);
        var a = (i = i || new pd3D.Matrix).m,
            o = Math.sqrt(e * e + r * r + n * n);
        t *= pd.Const.DEG2RAD, e /= o, r /= o, n /= o;
        var s = Math.cos(t),
            o = Math.sin(t),
            t = 1 - s;
        return a[0] = e * e * t + s, a[1] = e * r * t - n * o, a[2] = e * n * t + r * o, a[3] = 0, a[4] = r * e * t + n * o, a[5] = r * r * t + s, a[6] = r * n * t - e * o, a[7] = 0, a[8] = n * e * t - r * o, a[9] = n * r * t + e * o, a[10] = n * n * t + s, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, i
    }, pd3D.Matrix.skew = function(t, e, r) {
        r = r || new pd3D.Matrix;
        var n = Math.tan(e * pd.Const.DEG2RAD),
            e = r.m;
        switch (e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, t) {
            default:
                case e[15] = 1:
                e[4] = n;
            break;
            case 2:
                    e[8] = n;
                break;
            case 3:
                    e[1] = n;
                break;
            case 4:
                    e[9] = n;
                break;
            case 5:
                    e[2] = n;
                break;
            case 6:
                    e[6] = n
        }
        return r
    }, pd3D.Matrix.lookAt = function(t, e, r, n, i, a, o, s, d, h) {
        var l = (h = h || new pd3D.Matrix).m,
            r = new pd3D.Vector(t, e, r),
            a = new pd3D.Vector(n, i, a),
            s = new pd3D.Vector(o, s, d),
            d = r.subtract(a).unit(),
            a = s.cross(d).unit(),
            s = d.cross(a).unit();
        return l[0] = a.x, l[1] = a.y, l[2] = a.z, l[3] = -a.dot(r), l[4] = s.x, l[5] = s.y, l[6] = s.z, l[7] = -s.dot(r), l[8] = d.x, l[9] = d.y, l[10] = d.z, l[11] = -d.dot(r), l[12] = 0, l[13] = 0, l[14] = 0, l[15] = 1, h
    }, pd3D.MatrixAccumulator = function() {
        this.tempMatrix1 = new pd3D.Matrix, this.tempMatrix2 = new pd3D.Matrix, this.resultMatrix = new pd3D.Matrix
    }, pd3D.MatrixAccumulator.prototype.toMatrix = function() {
        return this.resultMatrix
    }, pd3D.MatrixAccumulator.prototype.reset = function() {
        return pd3D.Matrix.identity(this.resultMatrix), this
    }, pd3D.MatrixAccumulator.prototype.scale = function(t, e, r) {
        return 1 == arguments.length ? e = r = t : 2 == arguments.length && (r = 1), pd3D.Matrix.scale(t, e, r, this.tempMatrix1), pd3D.Matrix.multiply(this.resultMatrix, this.tempMatrix1, this.tempMatrix2), this.resultMatrix.init(this.tempMatrix2), this
    }, pd3D.MatrixAccumulator.prototype.translate = function(t, e, r) {
        return pd3D.Matrix.translate(t, e, r, this.tempMatrix1), pd3D.Matrix.multiply(this.resultMatrix, this.tempMatrix1, this.tempMatrix2), this.resultMatrix.init(this.tempMatrix2), this
    }, pd3D.MatrixAccumulator.prototype.rotate = function(t, e, r, n) {
        return pd3D.Matrix.rotate(t, e, r, n, this.tempMatrix1), pd3D.Matrix.multiply(this.resultMatrix, this.tempMatrix1, this.tempMatrix2), this.resultMatrix.init(this.tempMatrix2), this
    }, pd3D.MatrixAccumulator.prototype.inverse = function() {
        return pd3D.Matrix.inverse(this.resultMatrix, this.tempMatrix2), this.resultMatrix.init(this.tempMatrix2), this
    }, pd3D.MatrixAccumulator.prototype.transpose = function() {
        return pd3D.Matrix.transpose(this.resultMatrix, this.tempMatrix2), this.resultMatrix.init(this.tempMatrix2), this
    }, pd3D.MatrixAccumulator.prototype.multiply = function(t) {
        return pd3D.Matrix.multiply(this.resultMatrix, t, this.tempMatrix2), this.resultMatrix.init(this.tempMatrix2), this
    }, pd3D.MatrixAccumulator.prototype.init = function(t) {
        return this.resultMatrix.init(t), this
    }, pd3D.MatrixAccumulator.prototype.transformPoint = function(t, e) {
        return this.resultMatrix.transformPoint(t, e)
    }, pd3D.MatrixAccumulator.prototype.transformVector = function(t, e) {
        return this.resultMatrix.transformVector(t, e)
    }, pd3D.PolarMatrix = function() {
        pd3D.Matrix.call(this), this.angleY = 0, this.angleZ = 0, this.isIdentity = !0, this._matrixY = new pd3D.Matrix, this._matrixZ = new pd3D.Matrix, this._matrixY.hasChanged = !1, this._matrixZ.hasChanged = !1, this._matrixY.isIdentity = !0, this._matrixZ.isIdentity = !0
    }, pd3D.PolarMatrix.prototype = Object.create(pd3D.Matrix.prototype), pd3D.PolarMatrix.prototype.constructor = pd3D.PolarMatrix, pd3D.PolarMatrix.prototype._update = function() {
        var t = this.angleY,
            e = this._matrixY;
        e.hasChanged && (Math.abs(t) > pd.Const.EPSILON ? (pd3D.Matrix.rotate(t, 0, 1, 0, e), e.isIdentity = !1) : (e.isIdentity = !0, pd3D.Matrix.identity(e)));
        var r = this.angleZ,
            t = this._matrixZ;
        return t.hasChanged && (Math.abs(r) > pd.Const.EPSILON ? (pd3D.Matrix.rotate(r, 0, 0, 1, t), t.isIdentity = !1) : (t.isIdentity = !0, pd3D.Matrix.identity(t))), (e.hasChanged || t.hasChanged) && (t.isIdentity ? e.isIdentity ? (this.isIdentity = !0, pd3D.Matrix.identity(this)) : (pd3D.Matrix.clone(e, this), this.isIdentity = !1) : (e.isIdentity ? pd3D.Matrix.clone(t, this) : pd3D.Matrix.multiply(t, e, this), this.isIdentity = !1), e.hasChanged = !1, t.hasChanged = !1), this
    }, pd3D.PolarMatrix.prototype.setXZ = function(t, e) {
        var r = this._matrixY;
        pd.closeTo(this.angleY, t) || (r.hasChanged = !0, this.angleY = t);
        t = this._matrixZ;
        return pd.closeTo(this.angleZ, e) || (t.hasChanged = !0, this.angleZ = e), (r.hasChanged || t.hasChanged) && this._update(), this
    }, pd3D.PolarMatrix.prototype.setAziAlt = function(t, e) {
        return this.setXZ(90 - e, t)
    }, pd3D.PolarMatrix.prototype.setDirection = function(t) {
        var e, r = this.angleZ - 90,
            n = 90 - this.angleY;
        return pd.isArray(t) ? 1e-12 < (e = pd3D.VectorArray.length(t)) && (r = t[0] * t[0] < 1e-12 ? 0 : Math.atan2(t[1], t[0]) * pd.Const.RAD2DEG, n = Math.asin(t[2] / e) * pd.Const.RAD2DEG) : (e = t.length()) < 1e-9 ? r = n = 0 : (r = t.x * t.x < 1e-12 ? 0 : Math.atan2(t.y, t.x) * pd.Const.RAD2DEG, n = Math.asin(t.z / e) * pd.Const.RAD2DEG), this.setXZ(90 - n, 90 + r)
    }, pd3D.PolarMatrix.prototype.multiplyBy = function(t, e) {
        return e = e || new pd3D.Matrix, this.isIdentity || (t ? e = pd3D.Matrix.multiply(t, this, e) : pd3D.Matrix.clone(this, e)), e
    }, pd3D.Transform = function() {
        this.isIdentity = !0, this.hasChanged = !1, this._cachedMatrix = new pd3D.Matrix, Object.defineProperty(this, "m", {
            get: function() {
                return this.hasChanged && this.checkForChanges(), this._cachedMatrix.m
            }
        }), this.getMatrix = function() {
            return this.hasChanged && this.checkForChanges(), this._cachedMatrix
        }, this._xformData = [0, 0, 0, 0, 0, 0, 1, 1, 1], this._cachedData = [0, 0, 0, 0, 0, 0, 1, 1, 1], this._cachedTranslation = new pd3D.Matrix, this._cachedRotation = new pd3D.Matrix, this._cachedScale = new pd3D.Matrix, this._vectorRotation = !1, this._cachedTranslation.isIdentity = !0, this._cachedRotation.isIdentity = !0, this._cachedScale.isIdentity = !0
    }, pd3D.Transform.prototype = Object.create(pd3D.Matrix.prototype), pd3D.Transform.prototype.constructor = pd3D.Transform, pd3D.Transform.prototype.reset = function() {
        var t = this._xformData;
        return t[0] = t[1] = t[2] = 0, t[3] = t[4] = t[5] = 0, t[6] = t[7] = t[8] = 1, this._cachedTranslation.isIdentity = !0, this._cachedRotation.isIdentity = !0, this._cachedScale.isIdentity = !0, this.hasChanged = !0, this
    }, pd3D.Transform.prototype.setTranslation = function(t, e, r) {
        var n = pd.Const.EPSILON,
            i = this._xformData;
        if (1 == arguments.length) {
            var a = t;
            if (!pd.isArray(a)) throw new TypeError("Parameters must be either three numeric values or an [tx,ty,tz] vector array.");
            t = +a[0] || 0, e = +a[1] || 0, r = +a[2] || 0
        }
        return (Math.abs(t - i[0]) > n || Math.abs(e - i[1]) > n || Math.abs(r - i[2]) > n) && (this.hasChanged = !0), i[0] = t, i[1] = e, i[2] = r, this
    }, pd3D.Transform.prototype.addTranslation = function(t, e, r) {
        var n = pd.Const.EPSILON,
            i = this._xformData;
        if (1 == arguments.length) {
            var a = t;
            if (!pd.isArray(a)) throw new TypeError("Parameters must be either three numeric values or a [tx,ty,tz] vector array.");
            t = +a[0] || 0, e = +a[1] || 0, r = +a[2] || 0
        }
        return (Math.abs(t) > n || Math.abs(e) > n || Math.abs(r) > n) && (this.hasChanged = !0), i[0] += t, i[1] += e, i[2] += r, this
    }, pd3D.Transform.prototype.setVectorRotation = function(t, e, r, n) {
        var i = pd.Const.EPSILON,
            a = this._xformData;
        if (t = pd.toNumber(t, 0), 2 == arguments.length) {
            var o = e;
            if (!pd.isArray(o)) throw new TypeError("Parameters must be either three numeric values or a [rx,ry,rz] vector array.");
            e = +o[0] || 0, r = +o[1] || 0, n = +o[2] || 0
        }
        this._vectorAngles || (this._vectorAngles = []), this._vectorAngles[0] = t, this._vectorAngles[1] = e, this._vectorAngles[2] = r, this._vectorAngles[3] = n;
        o = e * e + r * r + n * n;
        return 0 < o && (e *= o = 1 / Math.sqrt(o), r *= o, n *= o), e *= t, r *= t, n *= t, this._vectorRotation || (o = this._cachedData, this.hasChanged = !0, o[3] = e - 1, o[4] = r - 1, o[5] = n - 1), (Math.abs(e - a[3]) > i || Math.abs(r - a[4]) > i || Math.abs(n - a[5]) > i) && (this.hasChanged = !0), a[3] = e, a[4] = r, a[5] = n, this._vectorRotation = !0, this
    }, pd3D.Transform.prototype.setAxialRotation = function(t, e, r) {
        var n = pd.Const.EPSILON,
            i = this._xformData;
        if (1 == arguments.length) {
            var a = t;
            if (!pd.isArray(a)) throw new TypeError("Parameters must be either three numeric values or a [rx,ry,rz] vector array.");
            t = +a[0] || 0, e = +a[1] || 0, r = +a[2] || 0
        }
        return this._vectorRotation && (a = this._cachedData, this.hasChanged = !0, a[3] = t - 1, a[4] = e - 1, a[5] = r - 1), (Math.abs(t - i[3]) > n || Math.abs(e - i[4]) > n || Math.abs(r - i[5]) > n) && (this.hasChanged = !0), i[3] = t, i[4] = e, i[5] = r, this._vectorRotation = !1, this
    }, pd3D.Transform.prototype.addRotation = function(t, e, r) {
        var n = pd.Const.EPSILON,
            i = this._xformData;
        if (this._vectorRotation) throw new Error("Cannot acumulate vector rotations, use `setAxialRotation()` to reset to axial mode.");
        if (1 == arguments.length) {
            var a = t;
            if (!pd.isArray(a)) throw new TypeError("Parameters must be either three numeric values or a [rx,ry,rz] vector array.");
            t = +a[0] || 0, e = +a[1] || 0, r = +a[2] || 0
        }
        return (Math.abs(t) > n || Math.abs(e) > n || Math.abs(r) > n) && (this.hasChanged = !0), i[3] += t, i[4] += e, i[5] += r, this
    }, pd3D.Transform.prototype.setScale = function(t, e, r) {
        var n = pd.Const.EPSILON,
            i = this._xformData;
        if (1 == arguments.length) {
            var a = t;
            if (!pd.isArray(a)) throw new TypeError("Parameters must be either three numeric values or a [sx,sy,sz] vector array.");
            t = +a[0] || 0, e = +a[1] || 0, r = +a[2] || 0
        }
        return (Math.abs(t - i[6]) > n || Math.abs(e - i[7]) > n || Math.abs(r - i[8]) > n) && (this.hasChanged = !0), i[6] = t, i[7] = e, i[8] = r, this
    }, pd3D.Transform.prototype.addScale = function(t, e, r) {
        var n = pd.Const.EPSILON,
            i = this._xformData;
        if (1 == arguments.length) {
            var a = t;
            if (!pd.isArray(a)) throw new TypeError("Parameters must be either three numeric values or a [sx,sy,sz] vector array.");
            t = +a[0] || 0, e = +a[1] || 0, r = +a[2] || 0
        }
        return (Math.abs(t - 1) > n || Math.abs(e - 1) > n || Math.abs(r - 1) > n) && (this.hasChanged = !0), i[6] *= t, i[7] *= e, i[8] *= r, this
    }, pd3D.Transform.prototype.checkForChanges = function() {
        var t, e, r, n = !1,
            i = this._xformData,
            a = this._cachedData,
            o = pd.Const.EPSILON;
        return (Math.abs(a[0] - i[0]) > o || Math.abs(a[1] - i[1]) > o || Math.abs(a[2] - i[2]) > o) && (r = this._cachedTranslation, Math.abs(i[0]) > o || Math.abs(i[1]) > o || Math.abs(i[2]) > o ? (pd3D.Matrix.translate(i[0], i[1], i[2], r), r.isIdentity = !1) : (pd3D.Matrix.identity(r), r.isIdentity = !0), a[0] = i[0], a[1] = i[1], a[2] = i[2], n = !0), (Math.abs(a[3] - i[3]) > o || Math.abs(a[4] - i[4]) > o || Math.abs(a[5] - i[5]) > o) && (e = !0, r = this._cachedRotation, this._vectorRotation ? e = (t = this._vectorAngles) && Math.abs(t[0]) > o ? (pd3D.Matrix.rotate(t[0], t[1], t[2], t[3], r), !1) : (pd3D.Matrix.identity(r), !0) : (Math.abs(i[5]) > o && (pd3D.Matrix.rotate(i[5], 0, 0, 1, r), e = !1), Math.abs(i[3]) > o && (e ? pd3D.Matrix.rotate(i[3], 1, 0, 0, r) : pd3D.Matrix.multiply(r, pd3D.Matrix.rotate(i[3], 1, 0, 0), r), e = !1), Math.abs(i[4]) > o && (e ? pd3D.Matrix.rotate(i[4], 0, 1, 0, r) : pd3D.Matrix.multiply(r, pd3D.Matrix.rotate(i[5], 0, 1, 0), r), e = !1)), r.isIdentity = e, a[3] = i[3], a[4] = i[4], a[5] = i[5], n = !0), (Math.abs(a[6] - i[6]) > o || Math.abs(a[7] - i[7]) > o || Math.abs(a[8] - i[8]) > o) && (r = this._cachedScale, Math.abs(i[0] - 1) > o || Math.abs(i[1] - 1) > o || Math.abs(i[2] - 1) > o ? (pd3D.Matrix.scale(i[6], i[7], i[8], r), r.isIdentity = !1) : (pd3D.Matrix.identity(r), r.isIdentity = !0), a[6] = i[6], a[7] = i[7], a[8] = i[8], n = !0), n && (this.isIdentity = !0, (r = this._cachedTranslation).isIdentity || (pd3D.Matrix.clone(r, this._cachedMatrix), this.isIdentity = !1), (r = this._cachedRotation).isIdentity || (this.isIdentity ? pd3D.Matrix.clone(r, this._cachedMatrix) : pd3D.Matrix.multiply(this._cachedMatrix, r, this._cachedMatrix), this.isIdentity = !1), (r = this._cachedScale).isIdentity || (this.isIdentity ? pd3D.Matrix.clone(r, this._cachedMatrix) : pd3D.Matrix.multiply(this._cachedMatrix, r, this._cachedMatrix), this.isIdentity = !1), this.isIdentity && pd3D.Matrix.identity(this._cachedMatrix)), this.hasChanged = !1, this
    }, pd3D.Transform.prototype.multiplyBy = function(t, e) {
        return e = e || new pd3D.Matrix, this.isIdentity || (t ? e = pd3D.Matrix.multiply(t, this, e) : pd3D.Matrix.clone(this, e)), e
    }, pd3D.Transform.prototype.copyTo = function(t) {
        return t = t || new pd3D.Matrix, pd3D.Matrix.clone(this, t), t
    }, pd3D.Material = function(t) {
        t = t || {}, this.id = pd3D.getUniqueID(), this.name = t.name || "Material_" + pd.toStringWithLeadingZeros(this.id, 5)
    }, pd3D.Node = function(t, e) {
        this.id = pd3D.getUniqueID(), this.nodeType = e || "Node", this.name = t || this.nodeType + "_" + pd.toStringWithLeadingZeros(this.id, 5), this.transformMatrix = null, this.inverseMatrix = null, this.visible = !0, this.active = !0, this.geometry = {}, this.children = [], this.hasChanged = !1, this.callbackOnDraw = null
    }, pd3D.Node.prototype.hide = function() {
        return this.visible = !1, this
    }, pd3D.Node.prototype.show = function(t) {
        return t = !1 !== t, this.visible = t, this
    }, pd3D.Node.prototype.getTransform = function() {
        return this.transformMatrix
    }, pd3D.Node.prototype.setTransform = function(t) {
        return this.transformMatrix = t, this.transformMatrix ? this.inverseMatrix = pd3D.Matrix.inverse(this.transformMatrix, this.inverseMatrix) : this.inverseMatrix = null, this
    }, pd3D.Node.prototype.addChild = function(t) {
        if (!t) throw new TypeError("ERROR: Undefined object not added as child node.");
        if (!(t instanceof pd3D.Node)) {
            if (!(t.draw || t.drawSurfaces && t.drawOutlines)) throw new TypeError("ERROR: Unsupported object not added as child node.");
            t.id || (t.id = pd3D.getUniqueID()), t.name || (t.name = "Object_" + pd.toStringWithLeadingZeros(t.id, 5))
        }
        return this.children.push(t), this.hasChanged = !0, this
    }, pd3D.Node.prototype.getChildByIndex = function(t) {
        return 0 <= t && t < this.children.length ? this.children[t] : null
    }, pd3D.Node.prototype.findChildrenById = function(t, e) {
        var r, n = e || [];
        if (pd.isNumeric(t)) {
            this.id == t && n.push(this);
            for (var i = 0, a = this.children.length; i < a; ++i) null != (r = this.children[i]) && (r.id == t ? n.push(r) : r.findChildrenById && r.findChildrenById(t, n))
        }
        return n
    }, pd3D.Node.prototype.findChildrenByName = function(t, e) {
        var r, n = e || [];
        if (t && t.length) {
            this.name == t && n.push(this);
            for (var i = 0, a = this.children.length; i < a; ++i) null != (r = this.children[i]) && (r.name == t ? n.push(r) : r.findChildrenByName && r.findChildrenByName(t, n))
        }
        return n
    }, pd3D.Node.prototype.removeChildByIndex = function(t) {
        return 0 <= t && t < this.children.length && (this.children.splice(t, 1), this.hasChanged = !0), this
    }, pd3D.Node.prototype.removeChild = function(t, e) {
        if (t) {
            var r = this.children.indexOf(t);
            if (-1 < r) return this.children.splice(r, 1), this.hasChanged = !0, this;
            if (e)
                for (var n = 0, i = this.children.length; n < i; ++n) this.children[n] && this.children[n].removeChild && this.children[n].removeChild(t)
        }
        return this
    }, pd3D.Node.prototype.clearChildren = function() {
        for (var t, e = 0, r = this.children.length; e < r; ++e)(t = this.children[e]) && t.clear && t.clear();
        return this.children.length = 0, this.hasChanged = !0, this
    }, pd3D.Node.prototype.addMesh = function(t, e) {
        if (!(t && t instanceof pd3D.Mesh)) throw new TypeError("ERROR: Only valid pd3D.Mesh objects can be added as pd3D.Node geometry.");
        if (!(e && e instanceof pd3D.Material)) throw new TypeError("ERROR: Only valid pd3D.Material objects can be assigned to pd3D.Node geometry.");
        var r = e.id.toString();
        return this.geometry[r] || (this.geometry[r] = {
            material: e,
            meshes: []
        }), this.geometry[r].meshes.push(t), this.hasChanged = !0, this
    }, pd3D.Node.prototype.addMeshes = function(t, e) {
        if (!t || !pd.isArray(t)) throw new TypeError("ERROR: Only valid arrays of pd3D.Mesh objects can be added as pd3D.Node geometry.");
        if (!(e && e instanceof pd3D.Material)) throw new TypeError("ERROR: Only valid pd3D.Material objects can be assigned to pd3D.Node geometry.");
        var r = e.id.toString();
        this.geometry[r] || (this.geometry[r] = {
            material: e,
            meshes: []
        });
        for (var n = 0, i = t.length; n < i; ++n) {
            var a = t[n];
            a && a instanceof pd3D.Mesh && (this.geometry[r].meshes.push(a), this.hasChanged = !0)
        }
        return this
    }, pd3D.Node.prototype.findMeshById = function(t) {
        for (var e in this.geometry)
            if (this.geometry.hasOwnProperty(e))
                for (var r = this.geometry[e].meshes, n = 0, i = r.length; n < i; ++n)
                    if (r[n].id == t) return r[n];
        for (var a, o, n = 0, i = this.children.length; n < i; ++n)
            if ((a = this.children[n]) && a.findMeshById && null != (o = a.findMeshById(t))) return o;
        return null
    }, pd3D.Node.prototype.getMeshList = function() {
        var t, e = [];
        for (t in this.geometry)
            if (this.geometry.hasOwnProperty(t))
                for (var r = this.geometry[t].meshes, n = 0, i = r.length; n < i; ++n) e.push(r[n]);
        return e
    }, pd3D.Node.prototype.getMeshesByMaterial = function(t) {
        if (!t || !t.id) throw new TypeError("ERROR: Only valid pd3D.Material objects can be used to obtain meshes.");
        t = t.id.toString();
        return this.geometry[t] ? this.geometry[t].meshes : []
    }, pd3D.Node.prototype.setMaterialForAllMeshes = function(t) {
        if (!t || !t.id) throw new TypeError("ERROR: New material must be valid pd3D.Material object.");
        var e, r = [];
        for (e in this.geometry)
            if (this.geometry.hasOwnProperty(e))
                for (var n = this.geometry[e].meshes, i = 0, a = n.length; i < a; ++i) r.push(n[i]);
        this.geometry = {}, this.hasChanged = !0;
        var o = t.id.toString();
        this.geometry[o] = {
            material: t,
            meshes: r
        };
        for (i = 0, a = this.children.length; i < a; ++i) this.children[i].setMaterial && this.children[i].setMaterial(new_material);
        return this
    }, pd3D.Node.prototype.swapMaterials = function(t, e) {
        if (!(t && t.id && e && e.id)) throw new TypeError("ERROR: Both arguments must be valid pd3D.Material objects.");
        if (t.id != e.id) {
            var r, n = t.id.toString(),
                i = e.id.toString();
            this.geometry[n] && (r = this.geometry[n].meshes, this.geometry[i] ? Array.prototype.push.apply(this.geometry[i].meshes, r) : this.geometry[i] = {
                material: e,
                meshes: r
            }, delete this.geometry[n]);
            for (var a = 0, o = this.children.length; a < o; ++a) this.children[a].swapMaterials && this.children[a].swapMaterials(t, e)
        }
        return this
    }, pd3D.Node.prototype.clearGeometry = function(t) {
        if (!t)
            for (var e in this.geometry)
                if (this.geometry.hasOwnProperty(e))
                    for (var r = this.geometry[e].meshes, n = 0, i = r.length; n < i; ++n) r[n].clear();
        return this.geometry = {}, this.hasChanged = !0, this
    }, pd3D.Node.prototype.destroy = function() {
        for (var t in this.geometry)
            if (this.geometry.hasOwnProperty(t))
                for (var e = this.geometry[t].meshes, r = 0, n = e.length; r < n; ++r) e[r].destroy();
        for (var i, r = 0, n = this.children.length; r < n; ++r) null != (i = this.children[r]) && (i.destroy ? i.destroy() : i.clear && i.clear());
        return this.geometry = {}, this.children.length = 0, this.hasChanged = !0, this
    }, pd3D.Node.prototype.reverseNormals = function() {
        for (var t in this.geometry)
            if (this.geometry.hasOwnProperty(t))
                for (var e = this.geometry[t].meshes, r = 0, n = e.length; r < n; ++r) e[r].reverseNormals();
        for (var i, r = 0, n = this.children.length; r < n; ++r)(i = this.children[r]) && i.reverseNormals && i.reverseNormals();
        return this
    }, pd3D.Node.prototype.reverseTriangles = function() {
        for (var t in this.geometry)
            if (this.geometry.hasOwnProperty(t))
                for (var e = this.geometry[t].meshes, r = 0, n = e.length; r < n; ++r) e[r].reverseTriangles();
        for (var i, r = 0, n = this.children.length; r < n; ++r)(i = this.children[r]) && i.reverseTriangles && i.reverseTriangles();
        return this
    }, pd3D.Node.prototype.swapYZ = function() {
        for (var t in this.geometry)
            if (this.geometry.hasOwnProperty(t))
                for (var e = this.geometry[t].meshes, r = 0, n = e.length; r < n; ++r) e[r].swapYZ();
        for (var i, r = 0, n = this.children.length; r < n; ++r)(i = this.children[r]) && i.swapYZ && i.swapYZ();
        return this
    }, pd3D.Node.prototype.mirrorY = function() {
        for (var t in this.geometry)
            if (this.geometry.hasOwnProperty(t))
                for (var e = this.geometry[t].meshes, r = 0, n = e.length; r < n; ++r) e[r].mirrorY();
        for (var i, r = 0, n = this.children.length; r < n; ++r)(i = this.children[r]) && i.mirrorY && i.mirrorY();
        return this
    }, pd3D.Node.prototype.translate = function(t, e, r) {
        for (var n in this.geometry)
            if (this.geometry.hasOwnProperty(n))
                for (var i = this.geometry[n].meshes, a = 0, o = i.length; a < o; ++a) i[a].translate(t, e, r);
        for (var s, a = 0, o = this.children.length; a < o; ++a)(s = this.children[a]) && s.translate && s.translate(t, e, r);
        return this
    }, pd3D.Node.prototype.applyMatrix = function(t, e) {
        if (t) {
            var r, n, e = e || t.inverse().transpose();
            for (r in this.geometry)
                if (this.geometry.hasOwnProperty(r))
                    for (var i = this.geometry[r].meshes, a = 0, o = i.length; a < o; ++a) i[a].transform(t, e);
            for (a = 0, o = this.children.length; a < o; ++a)(n = this.children[a]) && n.applyMatrix && n.applyMatrix(t, e)
        }
        return this
    }, pd3D.Node.prototype.getAABB = function(t, e) {
        for (var r in t && t.min || ((t = {
                min: new pd3D.Vector(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
            }).max = t.min.negative()), this.geometry)
            if (this.geometry.hasOwnProperty(r))
                for (var n = this.geometry[r].meshes, i = 0, a = n.length; i < a; ++i) e && n[i].computeBoundingBox(), n[i].getAABB(t);
        for (var o, i = 0, a = this.children.length; i < a; ++i)(o = this.children[i]) && o.getAABB && o.getAABB(t, e);
        return t
    }, pd3D.Node.prototype.compileGeometry = function() {
        var t, e = [];
        for (t in this.geometry)
            if (this.geometry.hasOwnProperty(t)) {
                for (var r, n = this.geometry[t].meshes, i = 0, a = n.length; i < a; ++i)(r = n[i]) && r.hasContent() && r.compile();
                this.geometry[t].meshes.length < 1 && e.push(t)
            }
        if (0 < e.length)
            for (i = 0, a = e.length; i < a; ++i) delete this.geometry[e[i]];
        return this
    }, pd3D.Node.prototype.compile = function() {
        for (var t, e = 0, r = this.children.length; e < r; ++e)(t = this.children[e]) && t.compile && t.compile();
        return this.compileGeometry()
    }, pd3D.Node.prototype.intersectRay = function(t, e, r) {
        if (r = r || null, this.visible) {
            for (var n in this.geometry)
                if (this.geometry.hasOwnProperty(n))
                    for (var i = this.geometry[n].meshes, a = 0, o = i.length; a < o; ++a) r = pd3D.RayTrace.intersectMesh(t, e, i[a], r);
            for (var s, a = 0, o = this.children.length; a < o; ++a)(s = this.children[a]) && s.intersectRay && (r = s.intersectRay(t, e, r))
        }
        return r
    }, pd3D.Node.prototype.obstructedRay = function(t, e) {
        if (this.visible) {
            for (var r in this.geometry)
                if (this.geometry.hasOwnProperty(r))
                    for (var n = this.geometry[r].meshes, i = 0, a = n.length; i < a; ++i)
                        if (pd3D.RayTrace.getFirstHitOnMesh(t, e, n[i])) return !0;
            for (var o, i = 0, a = this.children.length; i < a; ++i)
                if ((o = this.children[i]) && o.obstructedRay && o.obstructedRay(t, e)) return !0
        }
        return !1
    }, pd3D.Node.prototype.clear = function() {
        return this.clearChildren(), this.clearGeometry(), this.transformMatrix = null, delete this.transformMatrix, this.inverseMatrix = null, delete this.inverseMatrix, this.hasChanged = !0, this
    }, pd3D.RayTrace = function(t, e, r, n) {
        this.t = 0 < arguments.length ? t : Number.MAX_VALUE, this.mesh = n || null, this.normal = r, this.hit = e
    }, pd3D.RayTrace.prototype.mergeWith = function(t) {
        0 < t.t && t.t < this.t && (this.t = t.t, t.mesh ? this.mesh = t.mesh : this.mesh && (this.mesh = null), this.normal = t.normal, this.hit = t.hit)
    }, pd3D.RayTrace.insideBox = function(t, e, r) {
        return t.x >= e.x && t.x <= r.x && t.y >= e.y && t.y <= r.y && t.z >= e.z && t.z <= r.z
    }, pd3D.RayTrace.intersectBox = function(t, e, r, n) {
        var i = r.subtract(t).divide(e),
            a = n.subtract(t).divide(e),
            o = pd3D.Vector.min(i, a),
            a = pd3D.Vector.max(i, a),
            o = o.max(),
            a = a.min();
        if (0 < o && o < a) {
            e = t.add(e.multiply(o));
            return r = r.add(1e-6), n = n.subtract(1e-6), new pd3D.RayTrace(o, e, new pd3D.Vector((e.x > n.x) - (e.x < r.x), (e.y > n.y) - (e.y < r.y), (e.z > n.z) - (e.z < r.z)))
        }
        return null
    }, pd3D.RayTrace.intersectSphere = function(t, e, r, n) {
        var i = t.subtract(r),
            a = e.dot(e),
            o = 2 * e.dot(i),
            i = o * o - 4 * a * (i.dot(i) - n * n);
        if (0 < i) {
            a = (-o - Math.sqrt(i)) / (2 * a), e = t.add(e.multiply(a));
            return new pd3D.RayTrace(a, e, e.subtract(r).divide(n))
        }
        return null
    }, pd3D.RayTrace.intersectTriangle = function(t, e, r, n, i) {
        var a = n.subtract(r),
            o = i.subtract(r),
            s = a.cross(o).unit(),
            d = s.dot(r.subtract(t)) / s.dot(e);
        if (0 < d) {
            n = t.add(e.multiply(d)), i = n.subtract(r), t = o.dot(o), e = o.dot(a), r = o.dot(i), o = a.dot(a), a = a.dot(i), i = t * o - e * e, o = (o * r - e * a) / i, i = (t * a - e * r) / i;
            if (0 <= o && 0 <= i && o + i <= 1) return new pd3D.RayTrace(d, n, s)
        }
        return null
    }, pd3D.RayTrace.intersectMesh = function(t, e, r, n) {
        var i = null;
        if (n = n || null, !r.boundingBox || pd3D.RayTrace.insideBox(t, r.boundingBox.min, r.boundingBox.max) || pd3D.RayTrace.intersectBox(t, e, r.boundingBox.min, r.boundingBox.max))
            for (var a, o = r.vertices, s = r.triangles.length, d = r.triangles, h = new pd3D.Vector, l = new pd3D.Vector, c = new pd3D.Vector, u = 0; u < s; ++u) a = d[u], pd3D.Vector.fromArray(o[a[0]], h), pd3D.Vector.fromArray(o[a[1]], l), pd3D.Vector.fromArray(o[a[2]], c), null != (i = pd3D.RayTrace.intersectTriangle(t, e, h, l, c)) && (n ? (i.mesh = r, n.mergeWith(i)) : n = new pd3D.RayTrace(i.t, i.hit, i.normal, r));
        return n
    }, pd3D.RayTrace.getFirstHitOnMesh = function(t, e, r) {
        if (!r.boundingBox || pd3D.RayTrace.insideBox(t, r.boundingBox.min, r.boundingBox.max) || pd3D.RayTrace.intersectBox(t, e, r.boundingBox.min, r.boundingBox.max))
            for (var n, i = r.vertices, a = r.triangles.length, o = r.triangles, s = new pd3D.Vector, d = new pd3D.Vector, h = new pd3D.Vector, l = 0; l < a; ++l)
                if (n = o[l], pd3D.Vector.fromArray(i[n[0]], s), pd3D.Vector.fromArray(i[n[1]], d), pd3D.Vector.fromArray(i[n[2]], h), null != (n = pd3D.RayTrace.intersectTriangle(t, e, s, d, h))) return new pd3D.RayTrace(n.t, n.hit, n.normal, r);
        return null
    }
}(), pd3D.Shapes = pd3D.Shapes || {},
    function() {
        var E = .5 * Math.PI,
            _ = 2 * Math.PI;

        function z(t) {
            var e = t[0],
                r = t[1],
                n = +t[2] || 0,
                i = e * e + r * r + n * n;
            0 < i && (i = 1 / Math.sqrt(i), t[0] = e * i, t[1] = r * i, t[2] = n * i)
        }
        pd3D.Shapes.plane = function(t, e) {
            var r = !1,
                n = (t = t || {}).detailX || t.detail || 1,
                i = t.detailY || t.detail || 1,
                a = {};
            e || (e = new pd3D.Mesh(t), r = !0);
            for (var o = 0; o <= i; ++o)
                for (var s = o / i, d = 0; d <= n; ++d) {
                    var h = d / n;
                    a.pos = [2 * h - 1, 2 * s - 1, 0], e.coords && (a.coord = [h, s]), e.addVertexObject(a), d < n && o < i && (h = d + o * (n + 1), e.addTriangle(h, h + 1, h + n + 1), e.addTriangle(h + n + 1, h + 1, h + n + 2))
                }
            return r && e.compile(), e
        };
        var y = [
            [0, 4, 2, 6, -1, 0, 0],
            [1, 3, 5, 7, 1, 0, 0],
            [0, 1, 4, 5, 0, -1, 0],
            [2, 6, 3, 7, 0, 1, 0],
            [0, 2, 1, 3, 0, 0, -1],
            [4, 5, 6, 7, 0, 0, 1]
        ];

        function v(t) {
            return new pd3D.Vector(2 * (1 & t) - 1, (2 & t) - 1, (4 & t) / 2 - 1)
        }
        pd3D.Shapes.cube = function(t, e) {
            t = t || {};
            var r = !1,
                n = [1, 1, 1],
                i = {};
            pd.isArray(t.size) ? (n[0] = .5 * pd.toNumber(t.size[0], 1), n[1] = .5 * pd.toNumber(t.size[1], 1), n[2] = .5 * pd.toNumber(t.size[2], 1)) : (n[0] = .5 * pd.toNumber(t.size, 1), n[1] = n[2] = n[0]), e || (e = new pd3D.Mesh(t), r = !0);
            for (var a = e.vertexCount(), o = 0; o < y.length; ++o) {
                for (var s = a + 4 * o, d = Math.floor(.5 * o), h = y[o], l = 0; l < 4; ++l) {
                    var c = h[l];
                    i.pos = v(c).scale(n[d]).toArray(), e.coords && (i.coord = [1 & l, (2 & l) / 2]), e.normals && (i.normal = h.slice(4, 7)), e.addVertexObject(i)
                }
                if (e.triangles)
                    if (t.invert) {
                        if (e.addTriangle(s + 2, s + 1, s), e.addTriangle(s + 3, s + 1, s + 2), e.normals)
                            for (var u = 0; u < 4; ++u) {
                                var p = e.normals[s + u];
                                p[0] = -p[0], p[1] = -p[1], p[2] = -p[2]
                            }
                    } else e.addTriangle(s, s + 1, s + 2), e.addTriangle(s + 2, s + 1, s + 3)
            }
            if (e.lines && (e.addLine(a + 0, a + 1), e.addLine(a + 1, a + 3), e.addLine(a + 3, a + 2), e.addLine(a + 2, a + 0), e.addLine(a + 4, a + 5), e.addLine(a + 5, a + 7), e.addLine(a + 7, a + 6), e.addLine(a + 6, a + 4), e.addLine(a + 0, a + 4), e.addLine(a + 1, a + 6), e.addLine(a + 3, a + 7), e.addLine(a + 2, a + 5)), pd.isArray(t.center) && e.vertices) {
                var f = t.center;
                f[0] = pd.toNumber(f[0], 0), f[1] = pd.toNumber(f[1], 0), f[2] = pd.toNumber(f[2], 0);
                for (var o = a, m = e.vertexCount(); o < m; ++o) {
                    var g = e.vertices[o];
                    g[0] += f[0], g[1] += f[1], g[2] += f[2]
                }
            }
            return r && e.compile(), e
        }, pd3D.Shapes.rectangle = function(t, r) {
            var e, n, i, a, o, s, d, h, l = !1,
                c = (t = t || {}).transform || null,
                u = pd.toNumber(t.scale, 1),
                p = .5 * pd.toNumber(t.width, 250),
                f = .5 * pd.toNumber(t.height, 100),
                m = pd.toNumber(t.borderWidth, 0) * u,
                g = pd.toBoolean(t.background, !0),
                y = pd.toBoolean(t.border, !1),
                v = [0, 0, 0, 0],
                D = [0, 0, 0],
                b = -1,
                x = {
                    edge1: -1,
                    edge2: -1
                },
                M = t.min || [0, 0, 0],
                T = t.max || [M[0] + p, M[1] + f, M[2]],
                A = _ / Math.max(4, 4 * pd.toNumber(t.segments, 6)),
                w = {
                    pos: []
                },
                p = .5 * (T[0] - M[0]),
                f = .5 * (T[1] - M[1]);
            if (t.cornerRadius && (pd.isArray(t.cornerRadius) ? (h = t.cornerRadius, v[0] = pd.toNumber(h[0] || 0) * u, v[1] = pd.toNumber(h[1] || 0) * u, v[2] = pd.toNumber(h[2] || 0) * u, v[3] = pd.toNumber(h[3] || 0) * u) : (n = pd.toNumber(t.cornerRadius, 0) * u, v[0] = n, v[1] = n, v[2] = n, v[3] = n), h = Math.min(p, f), v[0] = pd.sign(v[0]) * Math.min(h, Math.abs(v[0])), v[1] = pd.sign(v[0]) * Math.min(h, Math.abs(v[1])), v[2] = pd.sign(v[0]) * Math.min(h, Math.abs(v[2])), v[3] = pd.sign(v[0]) * Math.min(h, Math.abs(v[3]))), t.center && pd.isArray(t.center) ? (D[0] = pd.toNumber(t.center[0], 0), D[1] = pd.toNumber(t.center[1], 0), D[2] = pd.toNumber(t.center[2], 0), M[0] = D[0] - p, T[0] = D[0] + p, M[1] = D[1] - p, T[1] = D[1] + p, M[2] = T[2] = +D[2] || 0) : (M[2] = +M[2] || 0, T[2] = +T[2] || 0, D[0] = .5 * (M[0] + T[0]), D[1] = .5 * (M[1] + T[1]), D[2] = .5 * (M[2] + T[2])), r || (r = new pd3D.Mesh(t), l = !0), g = g && r.triangles, y = y && r.lines, r.normals && (h = [0, 0, 1], c && c.applyVectorTransformToArray(h), r.normal(h)), g || y && !(m < .001)) {
                if (g ? pd.isArray(t.backgroundColor) && r.color(t.backgroundColor) : y && pd.isArray(t.borderColor) && r.color(t.borderColor), t.notch) {
                    if (x.length = pd.toNumber(t.notchLength, 15), x.width = .5 * pd.toNumber(t.notchWidth, Math.abs(x.length)), x.position = pd.toNumber(t.notchPosition, .5), x.edge = pd.toInteger(t.notchEdge, -1), x.type = pd.toInteger(t.notchType, 0), x.vertices = [], x.length *= u, x.width *= u, pd.isArray(t.notchTarget)) x.x = +t.notchTarget[0] || 0, x.y = +t.notchTarget[1] || 0;
                    else if (0 <= x.edge) switch (x.edge) {
                        case pd.Align.BOTTOM:
                            x.x = pd.mapTo(x.position, 0, 1, M[0], T[0]), x.y = M[1] - x.length;
                            break;
                        case pd.Align.RIGHT:
                            x.x = T[0] + x.length, x.y = pd.mapTo(x.position, 0, 1, M[1], T[1]);
                            break;
                        case pd.Align.TOP:
                            x.x = pd.mapTo(x.position, 0, 1, M[0], T[0]), x.y = T[1] + x.length;
                            break;
                        case pd.Align.LEFT:
                            x.x = M[0] - x.length, x.y = pd.mapTo(x.position, 0, 1, M[1], T[1]);
                            break;
                        default:
                            x.x = D[0], x.y = D[1]
                    }(x.x < M[0] || x.x > T[0] || x.y < M[1] || x.y > T[1]) && (x.type ? x.x < D[0] ? x.y < D[1] ? (i = x.x + pd.safeDivide(M[1] - x.y, D[1] - x.y) * (D[0] - x.x), (a = x.y + pd.safeDivide(M[0] - x.x, D[0] - x.x) * (D[1] - x.y)) + x.width >= M[1] ? (x.edge1 = 3, x.vertices[0] = [M[0], Math.max(a + x.width, M[1])], x.vertices[0][1] < M[1] + Math.abs(v[0]) && (v[0] = 0)) : (x.edge1 = 0, x.vertices[0] = [Math.max(i - x.width, M[0]), M[1]], x.vertices[0][0] < M[0] + Math.abs(v[0]) && (v[0] = 0)), x.vertices[1] = [x.x, x.y], i + x.width >= M[0] ? (x.edge2 = 0, x.vertices[2] = [Math.max(i + x.width, M[0]), M[1]], x.vertices[2][0] < M[0] + Math.abs(v[0]) && (v[0] = 0)) : (x.edge2 = 3, x.vertices[2] = [M[0], Math.max(a - x.width, M[1])], x.vertices[2][1] < M[1] + Math.abs(v[0]) && (v[0] = 0))) : (i = x.x - pd.safeDivide(x.y - T[1], D[1] - x.y) * (D[0] - x.x), a = x.y + pd.safeDivide(M[0] - x.x, D[0] - x.x) * (D[1] - x.y), i + x.width >= M[0] ? (x.edge1 = 2, x.vertices[0] = [Math.max(i + x.width, M[0]), T[1]], x.vertices[0][0] < M[0] + Math.abs(v[3]) && (v[3] = 0)) : (x.edge1 = 3, x.vertices[0] = [M[0], Math.min(a + x.width, T[1])], x.vertices[0][1] > T[1] - Math.abs(v[3]) && (v[3] = 0)), x.vertices[1] = [x.x, x.y], a - x.width <= T[1] ? (x.edge2 = 3, x.vertices[2] = [M[0], Math.min(a - x.width, T[1])], x.vertices[2][1] > T[1] - Math.abs(v[3]) && (v[3] = 0)) : (x.edge2 = 2, x.vertices[2] = [Math.max(i - x.width, M[0]), T[1]], x.vertices[2][0] < M[0] + Math.abs(v[3]) && (v[3] = 0))) : x.y < D[1] ? (i = x.x + pd.safeDivide(M[1] - x.y, D[1] - x.y) * (D[0] - x.x), a = x.y + pd.safeDivide(T[0] - x.x, D[0] - x.x) * (D[1] - x.y), i - x.width <= T[0] ? (x.edge1 = 0, x.vertices[0] = [Math.min(i - x.width, T[0]), M[1]], x.vertices[0][0] > T[0] - Math.abs(v[1]) && (v[1] = 0)) : (x.edge1 = 1, x.vertices[0] = [T[0], Math.max(a - x.width, M[1])], x.vertices[0][1] < M[1] + Math.abs(v[1]) && (v[1] = 0)), x.vertices[1] = [x.x, x.y], a + x.width > M[1] ? (x.edge2 = 1, x.vertices[2] = [T[0], Math.max(a + x.width, M[1])], x.vertices[2][1] < M[1] + Math.abs(v[1]) && (v[1] = 0)) : (x.edge2 = 0, x.vertices[2] = [Math.min(i + x.width, T[0]), M[1]], x.vertices[2][0] > T[0] - Math.abs(v[1]) && (v[1] = 0))) : (i = x.x + pd.safeDivide(T[1] - x.y, D[1] - x.y) * (D[0] - x.x), a = x.y + pd.safeDivide(T[0] - x.x, D[0] - x.x) * (D[1] - x.y), i + x.width <= T[0] ? (x.edge1 = 2, x.vertices[0] = [Math.min(i + x.width, T[0]), T[1]], x.vertices[0][0] > T[0] - Math.abs(v[2]) && (v[2] = 0)) : (x.edge1 = 1, x.vertices[0] = [T[0], Math.min(a - x.width, T[1])], x.vertices[0][1] > T[1] - Math.abs(v[2]) && (v[2] = 0)), x.vertices[1] = [x.x, x.y], a + x.width <= T[1] ? (x.edge2 = 1, x.vertices[2] = [T[0], Math.min(a + x.width, T[1])], x.vertices[2][1] > T[1] - Math.abs(v[2]) && (v[2] = 0)) : (x.edge2 = 2, x.vertices[2] = [Math.min(i - x.width, T[0]), T[1]], x.vertices[2][0] > T[0] - Math.abs(v[2]) && (v[2] = 0))) : x.x < D[0] ? x.y < D[1] ? (x.x >= M[0] ? (x.edge1 = x.edge2 = 0, x.vertices[0] = [pd.constrainTo(x.x - x.width, M[0], T[0]), M[1]], x.vertices[1] = [x.x, x.y], x.vertices[2] = [pd.constrainTo(x.x + x.width, M[0] + 2 * x.width, T[0]), M[1]]) : x.y >= M[1] ? (x.edge1 = x.edge2 = 3, x.vertices[0] = [M[0], pd.constrainTo(x.y + x.width, M[1] + 2 * x.width, T[1])], x.vertices[1] = [x.x, x.y], x.vertices[2] = [M[0], pd.constrainTo(x.y - x.width, M[1], T[1])]) : (x.edge1 = 3, x.edge2 = 0, i = M[0] - x.x, a = M[1] - x.y, o = Math.sqrt(i * i + a * a), i = pd.safeDivide(i, o), a = pd.safeDivide(a, o), x.vertices[0] = [M[0], pd.constrainTo(M[1] + 2 * i * x.width, M[1], T[1])], x.vertices[1] = [x.x, x.y], x.vertices[2] = [pd.constrainTo(M[0] + a * x.width, M[0], T[0]), M[1]]), e = Math.abs(v[0]), (x.vertices[0][0] < M[0] + e && x.vertices[0][1] < M[1] + e || x.vertices[2][0] < M[0] + e && x.vertices[2][1] < M[1] + e) && (v[0] = 0)) : (x.x >= M[0] ? (x.edge1 = x.edge2 = 2, x.vertices[0] = [pd.constrainTo(x.x + x.width, M[0] + 2 * x.width, T[0]), T[1]], x.vertices[1] = [x.x, x.y], x.vertices[2] = [pd.constrainTo(x.x - x.width, M[0], T[0]), T[1]]) : x.y <= T[1] ? (x.edge1 = x.edge2 = 3, x.vertices[0] = [M[0], pd.constrainTo(x.y + x.width, M[1], T[1])], x.vertices[1] = [x.x, x.y], x.vertices[2] = [M[0], pd.constrainTo(x.y - x.width, M[1], T[1] - 2 * x.width)]) : (x.edge1 = 2, x.edge2 = 3, i = M[0] - x.x, a = x.y - T[1], o = Math.sqrt(i * i + a * a), i = pd.safeDivide(i, o), a = pd.safeDivide(a, o), x.vertices[0] = [pd.constrainTo(M[0] + 2 * a * x.width, M[0], T[0]), T[1]], x.vertices[1] = [x.x, x.y], x.vertices[2] = [M[0], pd.constrainTo(T[1] - 2 * i * x.width, M[1], T[1])]), e = Math.abs(v[3]), (x.vertices[0][0] < M[0] + e && x.vertices[0][1] > T[1] - e || x.vertices[2][0] < M[0] + e && x.vertices[2][1] > T[1] - e) && (v[3] = 0)) : x.y < D[1] ? (x.x <= T[0] ? (x.edge1 = x.edge2 = 0, x.vertices[0] = [pd.constrainTo(x.x - x.width, M[0], T[0] - 2 * x.width), M[1]], x.vertices[1] = [x.x, x.y], x.vertices[2] = [pd.constrainTo(x.x + x.width, M[0], T[0]), M[1]]) : x.y >= M[1] ? (x.edge1 = x.edge2 = 1, x.vertices[0] = [T[0], pd.constrainTo(x.y - x.width, M[1], T[1])], x.vertices[1] = [x.x, x.y], x.vertices[2] = [T[0], pd.constrainTo(x.y + x.width, M[1] + 2 * x.width, T[1])]) : (x.edge1 = 0, x.edge2 = 1, i = x.x - T[0], a = M[1] - x.y, o = Math.sqrt(i * i + a * a), i = pd.safeDivide(i, o), a = pd.safeDivide(a, o), x.vertices[0] = [pd.constrainTo(T[0] - 2 * a * x.width, M[0], T[0]), M[1]], x.vertices[1] = [x.x, x.y], x.vertices[2] = [T[0], pd.constrainTo(M[1] + 2 * i * x.width, M[1], T[1])]), e = Math.abs(v[1]), (x.vertices[0][0] > T[0] - e && x.vertices[0][1] < M[1] + e || x.vertices[2][0] > T[0] - e && x.vertices[2][1] < M[1] + e) && (v[1] = 0)) : (x.x <= T[0] ? (x.edge1 = x.edge2 = 2, x.vertices[0] = [pd.constrainTo(x.x + x.width, M[0], T[0]), T[1]], x.vertices[1] = [x.x, x.y], x.vertices[2] = [pd.constrainTo(x.x - x.width, M[0], T[0] - 2 * x.width), T[1]]) : x.y <= T[1] ? (x.edge1 = x.edge2 = 1, x.vertices[0] = [T[0], pd.constrainTo(x.y - x.width, M[1], T[1] - 2 * x.width)], x.vertices[1] = [x.x, x.y], x.vertices[2] = [T[0], pd.constrainTo(x.y + x.width, M[1], T[1])]) : (x.edge1 = 1, x.edge2 = 2, i = x.x - T[0], a = x.y - T[1], o = Math.sqrt(i * i + a * a), i = pd.safeDivide(i, o), a = pd.safeDivide(a, o), x.vertices[0] = [T[0], pd.constrainTo(T[1] - 2 * i * x.width, M[1], T[1])], x.vertices[1] = [x.x, x.y], x.vertices[2] = [pd.constrainTo(T[0] - 2 * a * x.width, M[0], T[0]), T[1]]), e = Math.abs(v[2]), (x.vertices[0][0] > T[0] - e && x.vertices[0][1] > T[1] - e || x.vertices[2][0] > T[0] - e && x.vertices[2][1] > T[1] - e) && (v[2] = 0)))
                }
                if (s = k(D[0], D[1]), 3 == x.edge1 && 0 == x.edge2 ? P(x) : (n = v[0], .4999 < (e = Math.abs(n)) ? (k(M[0], M[1] + e), 0 < n && I([M[0] + e, M[1] + e], -Math.PI, -E, e), k(M[0] + e, M[1])) : k(M[0], M[1])), 0 == x.edge1 && 0 == x.edge2 && P(x), 0 == x.edge1 && 1 == x.edge2 ? P(x) : (n = v[1], .4999 < (e = Math.abs(n)) ? (k(T[0] - e, M[1]), 0 < n && I([T[0] - n, M[1] + e], -E, 0, n), k(T[0], M[1] + e)) : k(T[0], M[1])), 1 == x.edge1 && 1 == x.edge2 && P(x), 1 == x.edge1 && 2 == x.edge2 ? P(x) : (n = v[2], .4999 < (e = Math.abs(n)) ? (k(T[0], T[1] - e), 0 < n && I([T[0] - e, T[1] - e], 0, E, e), k(T[0] - e, T[1])) : k(T[0], T[1])), 2 == x.edge1 && 2 == x.edge2 && P(x), 2 == x.edge1 && 3 == x.edge2 ? P(x) : (n = v[3], .4999 < (e = Math.abs(n)) ? (k(M[0] + e, T[1]), 0 < n && I([M[0] + e, T[1] - e], E, Math.PI, e), k(M[0], T[1] - e)) : k(M[0], T[1])), 3 == x.edge1 && 3 == x.edge2 && P(x), d = r.vertexCount(), y && .001 < m)
                    if (r.hasVertexColors && pd.isArray(t.borderColor)) {
                        var O, V = pd.toNumber(t.borderZOffset, 0) * u;
                        r.color(t.borderColor);
                        for (var C = s + 1; C < d; ++C) O = r.getVertex(C), w.pos = [O[0], O[1], O[2] + V], r.coords && (w.coord = r.coords[C]), r.addVertexObject(w);
                        if (1 < m) {
                            for (var S = [], N = r.vertexCount(), C = d; C < N; ++C) S.push(r.getVertex(C));
                            pd3D.Shapes.thickLine({
                                vertices: S,
                                side: pd.toInteger(t.borderAlign, pd.Align.INSIDE),
                                shaft: m,
                                closed: !0
                            }, r)
                        } else {
                            N = r.vertexCount();
                            r.addLine(d, N - 1);
                            for (C = d + 1; C < N; ++C) r.addLine(C - 1, C)
                        }
                    } else {
                        r.addLine(s + 1, d - 1);
                        for (C = s + 2; C < d; ++C) r.addLine(C - 1, C)
                    }
                if (g) {
                    r.addTriangle(s, d - 1, s + 1);
                    for (C = s + 2; C < d; ++C) C == b ? (r.addTriangle(b - 1, b, b + 1), r.addTriangle(s, C - 1, C + 1), C++) : r.addTriangle(s, C - 1, C)
                }
                return l && r.compile(), t = null, r
            }

            function k(t, e) {
                return w.pos = [t, e, D[2]], c && c.applyPointTransformToArray(w.pos), r.coords && (w.coord = [((e = w.pos)[0] - M[0]) / p, (e[1] - M[2]) / f]), r.addVertexObject(w)
            }

            function I(t, e, r, n) {
                r -= .5 * A;
                for (var i = e + A; i < r; i += A) k(t[0] + n * Math.cos(i), t[1] + n * Math.sin(i))
            }

            function P(t) {
                k(t.vertices[0][0], t.vertices[0][1]), b = k(t.vertices[1][0], t.vertices[1][1]), k(t.vertices[2][0], t.vertices[2][1])
            }
            l && r.compile()
        }, pd3D.Shapes.circle = function(t, e) {
            t = t || {};
            var r, n, i, a = !1,
                o = pd.toNumber(t.radius, 1),
                s = pd.toNumber(t.radiusInner, -1),
                d = pd.isArray(t.center) ? t.center : [0, 0, 0],
                h = _ / pd.toNumber(t.segments, 24),
                l = pd.toBoolean(t.background, !0),
                c = pd.toBoolean(t.border, !0),
                u = pd.toNumber(t.fromAngle, 0) * pd.Const.DEG2RAD,
                p = pd.toNumber(t.toAngle, 360) * pd.Const.DEG2RAD,
                f = e.vertexCount(),
                m = {
                    pos: []
                },
                g = null;
            if (e || (e = new pd3D.Mesh(t), a = !0), t.transform instanceof pd3D.Matrix && (g = t.transform), e.normals && (t = [0, 0, 1], g && g.applyVectorTransformToArray(t), e.normal(t)), l = l && e.triangles, c = c && e.lines, 0 < o)
                if (0 < s)
                    for (var y, v, D, b, x = u; x < p; x += h) r = Math.sin(x), n = Math.cos(x), m.pos = [d[0] + s * r, d[1] + s * n, d[2]], e.coords && (m.coord = [r, n]), y = e.addVertexObject(m), m.pos = [d[0] + o * r, d[1] + o * n, d[2]], D = e.addVertexObject(m), u < x && (l && (e.addTriangle(D, b, v), e.addTriangle(y, D, v)), c && (e.addLine(v, y), e.addLine(b, D))), v = y, b = D;
                else {
                    m.pos = [d[0], d[1], d[2]], e.coords && (m.coord = [0, 0]);
                    var M = e.addVertexObject(m);
                    m.pos = [d[0] + o * Math.sin(u), d[1] + o * Math.cos(u), d[2]], e.coords && (m.coord = [0, 1]), e.addVertexObject(m), i = M + 2;
                    for (x = u + h; x < p; x += h) r = Math.sin(x), n = Math.cos(x), m.pos = [d[0] + o * r, d[1] + o * n, d[2]], e.coords && (m.coord = [r, n]), e.addVertexObject(m), l && (e.addTriangle(M, i - 1, i), e.addTriangle(M, i, i - 1)), c && e.addLine(i - 1, i), i++
                }
            return g && e.transform(g, null, f), a && e.compile(), e
        }, pd3D.Shapes.sphere = function(t, e) {
            var n = !1;

            function r(t, e, r) {
                return n ? [t, r, e] : [t, e, r]
            }

            function i(t) {
                return t + (t - t * t) / 2
            }
            var a = (t = t || {}).detail || 6,
                o = new pd.Indexer;
            e ? e.clear() : e = new pd3D.Mesh(t);
            for (var s, d = 0; d < 8; ++d)
                for (var h, l = [], n = 0 < (h = v(d)).x * h.y * h.z, c = 0; c <= a; ++c) {
                    for (var u = 0; c + u <= a; ++u) {
                        var p = c / a,
                            f = u / a,
                            m = (a - c - u) / a,
                            g = new pd3D.Vector(i(p), i(f), i(m)).unit().multiply(h),
                            m = {
                                vertex: g.toArray()
                            };
                        e.coords && (g = g.toAngles(), m.coord = [(g.theta + Math.PI) / _, (g.phi + E) / Math.PI]), l.push(o.addObject(m))
                    }
                    if (0 < c)
                        for (u = 0; c + u <= a; ++u) {
                            p = (c - 1) * (a + 1) + (c - 1 - (c - 1) * (c - 1)) / 2 + u, f = c * (a + 1) + (c - c * c) / 2 + u;
                            e.triangles.push(r(l[p], l[p + 1], l[f])), c + u < a && e.triangles.push(r(l[f], l[p + 1], l[f + 1]))
                        }
                }
            return e.vertices = o.unique.map(function(t) {
                return t.vertex
            }), e.coords && (e.coords = o.unique.map(function(t) {
                return t.coord
            })), e.normals && (e.normals = e.vertices.map(function(t) {
                return [t[0], t[1], t[2]]
            })), (t.radius || t.center) && (s = t.center || [0, 0, 0], h = t.scale || (t.radius ? [t.radius, t.radius, t.radius] : [1, 1, 1]), e.vertices = e.vertices.map(function(t) {
                return [s[0] + t[0] * h[0], s[1] + t[1] * h[1], s[2] + t[2] * h[2]]
            })), e.compile(), e
        }, pd3D.Shapes.sphereLatLng = function(t, e) {
            t = t || {};
            var r, n, i, a, o, s, d, h, l = pd.Const.DEG2RAD,
                c = t.latIncrement ? pd.constrainTo(t.latIncrement, 1, 45) * l : t.increment ? pd.constrainTo(t.increment, 1, 45) * l : 5 * l,
                u = t.lngIncrement ? pd.constrainTo(t.lngIncrement, 1, 45) * l : t.increment ? pd.constrainTo(t.increment, 1, 45) * l : 5 * l,
                p = t.scale || (t.radius ? [t.radius, t.radius, t.radius] : [1, 1, 1]),
                f = t.center || [0, 0, 0],
                m = Math.ceil(Math.PI / c),
                g = Math.ceil(_ / u),
                y = 0;
            e ? e.clear() : e = new pd3D.Mesh(t), n = E + c;
            for (var v = 0; v <= m; ++v) {
                n -= c, a = Math.cos(n), o = Math.sin(n), y = e.vertices.length - (g + 1), r = e.vertices.length, i = -E - u;
                for (var D = 0; D <= g; ++D) i += u, s = a * Math.sin(i), d = a * Math.cos(i), h = o, e.vertices.push([f[0] + s * p[0], f[1] + d * p[1], f[2] + h * p[2]]), e.normals && e.normals.push([s, d, h]), e.coords && e.coords.push([1 - D / g, 1 - v / m]), 0 < v && 0 < D && (e.triangles.push([r, r - 1, y - 1]), e.triangles.push([y, r, y - 1])), y++, r++
            }
            if (e.lines) {
                for (var b = t.graticule ? pd.constrainTo(t.graticule, 1, 10) : 2, x = t.poleGraticule ? pd.constrainTo(t.poleGraticule, 1, 10) : 3, v = b; v < m; v += b) {
                    r = v * (g + 1);
                    for (D = 0; D <= g; ++D) e.lines.push([r - 1, r++])
                }
                for (D = 0; D < g; D += b) {
                    D % x == 0 && (r = g + 1 + D, e.lines.push([r - (g + 1), r]));
                    for (v = 2; v < m; ++v) r = v * (g + 1) + D, e.lines.push([r - (g + 1), r]);
                    D % x == 0 && (r = m * (g + 1) + D, e.lines.push([r - (g + 1), r]))
                }
            }
            return e.compile(), e
        }, pd3D.Shapes.thickLine = function(t, e) {
            var r = t.vertices;
            if (r && 1 < r.length) {
                t = t || {};
                var n = !1;
                e || (e = new pd3D.Mesh(t), n = !0);
                var i, a, o, s, d, h, l, c, u = r.length,
                    p = pd.toInteger(t.side, 0),
                    f = pd.toNumber(t.scale, 1),
                    m = pd.toInteger(t.joints, 0),
                    g = pd.toInteger(t.endcap, 0),
                    y = pd.toNumber(t.width, 0),
                    v = t.normal || [0, 0, 1],
                    D = e.triangles && pd.toBoolean(t.triangles, !0),
                    b = e.lines && pd.toBoolean(t.lines, !1),
                    x = pd.toBoolean(t.closed, !1),
                    M = e.vertexCount(),
                    T = [],
                    A = [],
                    w = [],
                    O = [],
                    V = [],
                    C = [],
                    S = [],
                    N = [],
                    k = [];
                if (t.style && (c = t.style, p = pd.toInteger(c.lineSide, p), y = pd.toNumber(c.lineWidth, y), m = pd.toInteger(c.lineJoint, m), g = pd.toInteger(c.lineCap, g), D = e.triangles && pd.toBoolean(c.triangles, D), b = e.lines && pd.toBoolean(c.lines, b)), x && (g = 0), f > pd.Const.EPSILON && (y *= f), "offset" in t) var f = pd.constrainTo(pd.toNumber(t.offset, .5), 0, 1),
                    I = (1 - f) * y,
                    P = f * y;
                else switch (p) {
                    default: P = I = .5 * y;
                    break;
                    case pd.Align.OUTSIDE:
                            P = 0,
                        I = y;
                        break;
                    case pd.Align.INSIDE:
                            P = y,
                        I = 0
                }
                if (1.001 < y) {
                    _ = x ? 0 : 1, i = r[E = x ? u - 1 : 0], a = r[_], N[0] = a[0] - i[0], N[1] = a[1] - i[1], N[2] = (+a[2] || 0) - (+i[2] || 0), t.normals && (v = t.normals[E]), d = Math.sqrt(N[0] * N[0] + N[1] * N[1] + N[2] * N[2]), w[0] = N[1] * v[2] - N[2] * v[1], w[1] = N[2] * v[0] - N[0] * v[2], w[2] = N[0] * v[1] - N[1] * v[0], z(w);
                    for (var E, _, L = 0; L < u; ++L) {
                        u <= (_ = L + 1) && (_ = 0), i = r[E = L], a = r[_], !x && _ < 1 && 0 < E ? (k[0] = i[0] - r[E - 1][0], k[1] = i[1] - r[E - 1][1], k[2] = (+i[2] || 0) - (+r[E - 1][2] || 0)) : (k[0] = a[0] - i[0], k[1] = a[1] - i[1], k[2] = (+a[2] || 0) - (+i[2] || 0)), t.normals && (v = t.normals[E]), h = Math.sqrt(k[0] * k[0] + k[1] * k[1] + k[2] * k[2]), O[0] = k[1] * v[2] - k[2] * v[1], O[1] = k[2] * v[0] - k[0] * v[2], O[2] = k[0] * v[1] - k[1] * v[0], z(O), R = d * h, l = N[0] * k[0] + N[1] * k[1] + N[2] * k[2], l = 1 <= (F = R > pd.Const.EPSILON ? l / R : 0) ? 0 : F <= -1 ? Math.PI : Math.acos(F), pd3D.VectorArray.cross(A, N, k), 1 != g || E && _ || (z(B = k.slice()), 0 == E && (i = [i[0] - .5 * B[0] * y, i[1] - .5 * B[1] * y, i[2] - .5 * B[2] * y]), 0 == _ && (i = [i[0] + .5 * B[0] * y, i[1] + .5 * B[1] * y, i[2] + .5 * B[2] * y])), R = Math.cos(.5 * l), F = pd.safeDivide(P, R), B = pd.safeDivide(I, R), T[0] = w[0] + O[0], T[1] = w[1] + O[1], T[2] = w[2] + O[2], z(T);
                        var R = Math.min(d, h) + 1.4142136 * y,
                            B = Math.min(B, R),
                            F = Math.min(F, R);
                        V[0] = i[0] + T[0] * B, V[1] = i[1] + T[1] * B, V[2] = i[2] + T[2] * B, C[0] = i[0] - T[0] * F, C[1] = i[1] - T[1] * F, C[2] = i[2] - T[2] * F, l < 2.0943951022 ? (e.addVertex(C.slice()), o = e.addVertex(V.slice()), 0 < L ? (D && (e.addTriangle(o - 3, o, o - 1), e.addTriangle(o - 3, o - 2, o)), b && (e.addLine(o - 3, o - 1), e.addLine(o - 2, o))) : !x && b && e.addLine(o - 1, o)) : A[2] < 0 ? ((d < B || h < B) && (B = Math.min(d, h)), s = Math.sin(.5 * l) * P, S[0] = i[0] - T[0] * P, S[1] = i[1] - T[1] * P, S[2] = i[2] - T[2] * P, e.addVertex([S[0] + O[0] * s, S[1] + O[1] * s, S[2] + O[2] * s]), e.addVertex([S[0] + w[0] * s, S[1] + w[1] * s, S[2] + w[2] * s]), o = e.addVertex(V.slice()), 0 < L ? (D && (e.addTriangle(o - 3, o, o - 2), e.addTriangle(o - 4, o - 3, o - 2), e.addTriangle(o - 1, o - 2, o)), b && (e.addLine(o - 3, o), e.addLine(o - 4, o - 2), e.addLine(o - 2, o - 1))) : !x && b && e.addLine(o - 1, o)) : ((d < F || h < F) && (F = Math.min(d, h)), s = Math.sin(.5 * l) * I, S[0] = i[0] + T[0] * I, S[1] = i[1] + T[1] * I, S[2] = i[2] + T[2] * I, e.addVertex([S[0] + w[0] * s, S[1] + w[1] * s, S[2] + w[2] * s]), e.addVertex(C.slice()), o = e.addVertex([S[0] + O[0] * s, S[1] + O[1] * s, S[2] + O[2] * s]), 0 < L ? (D && (e.addTriangle(o - 4, o - 2, o - 1), e.addTriangle(o - 4, o - 3, o - 2), e.addTriangle(o - 1, o - 2, o)), b && (e.addLine(o - 4, o - 1), e.addLine(o - 3, o - 2), e.addLine(o - 2, o))) : !x && b && e.addLine(o - 1, o)), w[0] = O[0], w[1] = O[1], w[2] = O[2], d = h, N[0] = k[0], N[1] = k[1], N[2] = k[2]
                    }
                    x ? (D && (e.addTriangle(M, o - 1, o), e.addTriangle(M, o, M + 1)), b && (e.addLine(M, o - 1), e.addLine(M + 1, o))) : b && e.addLine(o - 1, o)
                } else if (e.lines) {
                    e.addVertex(r[0]);
                    for (L = 1; L < u - 1; ++L) o = e.addVertex(r[L]), e.addLine(o - 1, o);
                    o = e.addVertex(r[u - 1]), e.addLine(o - 1, o), x && e.addLine(M, o), M = e.vertexCount()
                }
                t.transform instanceof pd3D.Matrix && e.transform(t.transform, null, M), n && e.compile()
            }
            return e
        }, pd3D.Shapes.arrow = function(t, e) {
            var r = !1,
                n = !1;
            t = t || {}, e || (e = new pd3D.Mesh(t), r = !0);
            var i = pd.toInteger(t.type, 0),
                a = pd.toNumber(t.scale, 1),
                o = pd.toNumber(t.shaft, 0),
                s = pd.toNumber(t.indent, 0),
                d = pd.toNumber(t.thickness, .25),
                h = Math.max(1, pd.toNumber(t.length, 0 < i ? 25 : 40)),
                l = Math.max(1, pd.toNumber(t.width, h * (0 < i ? 1 : .6))),
                c = e.triangles && pd.toBoolean(t.triangles, !0),
                u = e.lines && pd.toBoolean(t.lines, !1);
            t.style && (D = t.style, i = pd.toInteger(D.arrowType, i), o = pd.toNumber(D.lineWidth, o), s = pd.toNumber(D.arrowIndent, s), d = pd.toNumber(D.arrowThickness, d), l = Math.max(1, pd.toNumber(D.arrowWidth, l)), h = Math.max(1, pd.toNumber(D.arrowLength, h)), c = e.triangles && pd.toBoolean(D.triangles, c), u = e.lines && pd.toBoolean(D.lines, u));
            var p = -1,
                f = -1,
                m = l / h;
            t.vertices && 0 < t.vertices.length && (t.side = pd.Align.CENTER, n = t.ignoreEnd = !0, pd3D.Shapes.thickLine(t, e)), a > pd.Const.EPSILON && (l *= a, h *= a, s *= a, o *= a);
            var g = 4;
            1 <= d ? g = 1 / (d * a / h) : 0 < d && (g = 1 / d);
            var y = h / g,
                v = l / g,
                D = t.to;
            null == D && (D = t.vertices && 0 < t.vertices.length ? t.vertices[t.vertices.length - 1] : [0, 0, 0]);
            a = t.from || null;
            null == a && t.vertices && 1 < t.vertices.length && (a = t.vertices[t.vertices.length - 2]);
            d = o < 1.001 ? 0 : .5 * o, o = .5 * l, l = e.vertexCount();
            switch (i) {
                default:
                    case 0:
                    s = Math.min(s, .9 * h),
                pd.closeTo(s, 0, .1) && !n ? (e.addVertex([0, 0, 0]), e.addVertex([-h, o, 0]), e.addVertex([-h, -o, 0]), c && e.addTriangle(l, l + 1, l + 2), u && (e.addLine(l, l + 1), e.addLine(l + 1, l + 2), e.addLine(l + 2, l))) : (e.addVertex([0, 0, 0]), e.addVertex([-h, o, 0]), p = e.addVertex([-h + s, d, 0]), f = e.addVertex([-h + s, -d, 0]), e.addVertex([-h, -o, 0]), c && (e.addTriangle(l, l + 1, l + 2), e.addTriangle(l, l + 3, l + 4)), u && (e.addLine(l, l + 1), e.addLine(l + 1, l + 2), e.addLine(l + 3, l + 4), e.addLine(l + 4, l)));
                break;
                case 1:
                        e.addVertex([0, 0, 0]),
                    e.addVertex([-(g + .25) * y, (g + .25) * v, 0]),
                    e.addVertex([-(g + .75) * y, (g - .25) * v, 0]),
                    p = e.addVertex([-y - d, d * m, 0]),
                    f = e.addVertex([-y - d, -d * m, 0]),
                    e.addVertex([-(g + .75) * y, -(g - .25) * v, 0]),
                    e.addVertex([-(g + .25) * y, -(g + .25) * v, 0]),
                    c && (e.addTriangle(l, l + 1, l + 3), e.addTriangle(l + 1, l + 2, l + 3), e.addTriangle(l + 4, l + 5, l + 6), e.addTriangle(l, l + 4, l + 6)),
                    u && (e.addLine(l, l + 1), e.addLine(l + 1, l + 2), e.addLine(l + 2, l + 3), e.addLine(l + 4, l + 5), e.addLine(l + 5, l + 6), e.addLine(l + 6, l));
                    break;
                case 2:
                        e.addVertex([0, 0, 0]),
                    e.addVertex([-g * y, g * v, 0]),
                    e.addVertex([-(g + 1) * y, g * v, 0]),
                    p = e.addVertex([-y - d, d * m, 0]),
                    f = e.addVertex([-y - d, -d * m, 0]),
                    e.addVertex([-(g + 1) * y, -g * v, 0]),
                    e.addVertex([-g * y, -g * v, 0]),
                    c && (e.addTriangle(l, l + 1, l + 3), e.addTriangle(l + 1, l + 2, l + 3), e.addTriangle(l + 4, l + 5, l + 6), e.addTriangle(l, l + 4, l + 6)),
                    u && (e.addLine(l, l + 1), e.addLine(l + 1, l + 2), e.addLine(l + 2, l + 3), e.addLine(l + 4, l + 5), e.addLine(l + 5, l + 6), e.addLine(l + 6, l));
                    break;
                case 3:
                        e.addVertex([0, 0, 0]),
                    e.addVertex([-(g + .5) * y, (g + .5) * v, 0]),
                    e.addVertex([-(g + .5) * y, (g - .5) * v, 0]),
                    p = e.addVertex([-y - d, d * m, 0]),
                    f = e.addVertex([-y - d, -d * m, 0]),
                    e.addVertex([-(g + .5) * y, -(g - .5) * v, 0]),
                    e.addVertex([-(g + .5) * y, -(g + .5) * v, 0]),
                    c && (e.addTriangle(l, l + 1, l + 3), e.addTriangle(l + 1, l + 2, l + 3), e.addTriangle(l + 4, l + 5, l + 6), e.addTriangle(l, l + 4, l + 6)),
                    u && (e.addLine(l, l + 1), e.addLine(l + 1, l + 2), e.addLine(l + 2, l + 3), e.addLine(l + 4, l + 5), e.addLine(l + 5, l + 6), e.addLine(l + 6, l));
                    break;
                case 4:
                        e.addVertex([0, 0, 0]),
                    e.addVertex([-g * y, g * v, 0]),
                    e.addVertex([-(g + .5) * y, g * v, 0]),
                    e.addVertex([-(g + .5) * y, (g - .5) * v, 0]),
                    p = e.addVertex([-y - d, d * m, 0]),
                    f = e.addVertex([-y - d, -d * m, 0]),
                    e.addVertex([-(g + .5) * y, -(g - .5) * v, 0]),
                    e.addVertex([-(g + .5) * y, -g * v, 0]),
                    e.addVertex([-g * y, -g * v, 0]),
                    c && (e.addTriangle(l, l + 1, l + 4), e.addTriangle(l + 1, l + 2, l + 3), e.addTriangle(l + 1, l + 3, l + 4), e.addTriangle(l + 5, l + 6, l + 8), e.addTriangle(l + 6, l + 7, l + 8), e.addTriangle(l, l + 5, l + 8)),
                    u && (e.addLine(l, l + 1), e.addLine(l + 1, l + 2), e.addLine(l + 2, l + 3), e.addLine(l + 3, l + 4), e.addLine(l + 5, l + 6), e.addLine(l + 6, l + 7), e.addLine(l + 7, l + 8), e.addLine(l + 8, l))
            }
            return 0 <= p && 0 <= f && (d < .1 && e.lines ? e.addLine(l - 1, f) : (c && 0 < d && (e.addTriangle(l, p, f), n && (e.addTriangle(l - 1, p, l - 2), e.addTriangle(l - 1, f, p))), u && (n ? (e.addLine(l - 2, p), e.addLine(l - 1, f)) : 0 < d && e.addLine(p, f)))), pd.isArray(D) && (f = pd3D.Matrix.translate(+D[0] || 0, +D[1] || 0, +D[2] || 0), pd.isArray(a) && (a = Math.atan2(D[1] - a[1], D[0] - a[0]) * pd.Const.RAD2DEG, pd.closeTo(a, 0) || (f = pd3D.Matrix.multiply(f, pd3D.Matrix.rotate(a, 0, 0, 1), f))), e.transform(f, null, l)), t.transform instanceof pd3D.Matrix && e.transform(t.transform, null, l), r && e.compile(), e
        }, pd3D.Shapes.Type = {
            CIRCLE: 1,
            CIRCLE_HOLLOW: -1,
            TRIANGLE: 2,
            TRIANGLE_HOLLOW: -2,
            SQUARE: 3,
            SQUARE_HOLLOW: -3,
            DIAMOND: 4,
            DIAMOND_HOLLOW: -4,
            STAR: 5,
            STAR_HOLLOW: -5,
            SPOKES: 6,
            CROSS: -6
        }, pd3D.Shapes.polygon = function(t, e, r) {
            var n = !1;
            t = t || {}, e || (e = new pd3D.Mesh(t), n = !0);
            var i, a, o, s, d, h, l, c = null,
                u = pd.toInteger(t.type, 0),
                p = pd.toNumber(t.size, 20),
                f = pd.toNumber(t.rotation, 0),
                m = pd.toNumber(t.thickness, 2.5),
                g = pd.constrainTo(pd.toNumber(t.angle, 360), 0, 360),
                y = pd.constrainTo(pd.toInteger(t.segments, 24), 2, 720),
                v = e.triangles && pd.toBoolean(t.triangles, !0),
                D = e.lines && pd.toBoolean(t.lines, !1),
                b = {
                    pos: []
                },
                x = t.center || null;
            null == x && t.vertices && 0 < t.vertices.length && (x = t.vertices[t.vertices.length - 1]), r = pd.toNumber(r, 0), pd.closeTo(r, 0) && (r = pd.toNumber(t.scale, 0)), pd.closeTo(r, 0) && (r = 1), pd.isArray(t.offset) && (null == x && (x = [0, 0, 0]), x[0] += (+t.offset[0] || 0) * r, x[1] += (+t.offset[1] || 0) * r, x[2] += (+t.offset[2] || 0) * r);
            var M = t.from || null;
            null == M && t.vertices && 1 < t.vertices.length && (M = t.vertices[t.vertices.length - 2]), pd.closeTo(g, 0) && (g = 360), r > pd.Const.EPSILON && (m *= r, p *= r), pd.isArray(t.color) && e.color(t.color), t.transform instanceof pd3D.Matrix && (c = t.transform), e.normals && (T = [0, 0, 1], c && c.applyVectorTransformToArray(T), e.normal(T));
            var T = e.vertexCount();
            switch (u) {
                case 2:
                case -2:
                    y = 3, m *= 2, f += 60;
                    break;
                case 3:
                case -3:
                    y = 4, m *= 1.41421356, f += 45;
                    break;
                case 4:
                case -4:
                    y = 4, m *= 1.41421356;
                    break;
                case 5:
                case -5:
                    y *= 2, f += 180;
                    break;
                case -6:
                    y = 4
            }
            switch (u) {
                default:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    var A = p,
                    w = Math.max(2, pd.toInteger(t.tickIncr, 2));
                if (0 < A) {
                    b.pos = [0, 0, 0], e.coords && (b.coord = [0, 0]);
                    var O = e.addVertexObject(b);
                    y < 2 && (y = pd.mapAndConstrainTo(g, 0, 360, 2, 24)), f *= pd.Const.DEG2RAD, g *= pd.Const.DEG2RAD;
                    for (var V = l = 0, C = 1 + (N = .5 * (k = 1 / Math.round(y))); V < C; V += k) E = Math.min(V, 1) * g, d = Math.cos(E + f), h = Math.sin(E + f), 5 == u && (A = l++ % w ? p - m : p), b.pos = [A * d, A * h, 0], e.coords && (b.coord = [d, h]), i = e.addVertexObject(b), N < V && (v && e.addTriangle(O, a, i), D && e.addLine(a, i)), a = i;
                    D && g < _ && (e.addLine(O, O + 1), e.addLine(O, i))
                }
                break;
                case -1:
                        case -2:
                        case -3:
                        case -4:
                        case -5:
                        var A = p,
                        S = Math.max(0, p - m),
                        w = Math.max(2, pd.toInteger(t.tickIncr, 2));
                    if (0 < A) {
                        y < 2 && (y = pd.mapAndConstrainTo(g, 0, 360, 2, 24)), f *= pd.Const.DEG2RAD, g *= pd.Const.DEG2RAD;
                        for (var N, V = l = 0, C = 1 + (N = .5 * (k = 1 / Math.round(y))); V < C; V += k) E = Math.min(V, 1) * g, d = Math.cos(E + f), h = Math.sin(E + f), -5 == u && (A = l++ % w ? p - m : p), b.pos = [S * d, S * h, 0], e.coords && (b.coord = [d, h]), i = e.addVertexObject(b), b.pos = [A * d, A * h, 0], o = e.addVertexObject(b), N < V && (v && (e.addTriangle(o, a, s), e.addTriangle(i, a, o)), D && (e.addLine(a, i), e.addLine(s, o))), a = i, s = o;
                        D && g < _ && (e.addLine(T, T + 1), e.addLine(a, s))
                    }
                    break;
                case 6:
                        case -6:
                        A = p,
                    r = pd.toNumber(t.tickSize, m) * r,
                    S = Math.max(0, p - r);
                    if (0 < A) {
                        y < 2 && (y = pd.mapAndConstrainTo(g, 0, 360, 2, 24)), l = 0;
                        var k = 1 / Math.round(y),
                            I = new pd3D.Matrix;
                        if (m < 1e-6 && D)
                            for (var P = [new pd3D.Vector(0, S, 0), new pd3D.Vector(0, A, 0)], V = 0; V < 1; V += k) E = Math.min(V, 1) * g, I = pd3D.Matrix.rotate(E + f, 0, 0, 1, I), b.pos = I.transformPoint(P[0]).toArray(), i = e.addVertexObject(b), b.pos = I.transformPoint(P[1]).toArray(), e.addVertexObject(b), D && e.addLine(i, i + 1);
                        else {
                            m = Math.max(1e-6, m *= .5);
                            for (var E, P = [new pd3D.Vector(-m, S, 0), new pd3D.Vector(m, S, 0), new pd3D.Vector(m, A, 0), new pd3D.Vector(-m, A, 0)], V = 0; V < 1; V += k) E = Math.min(V, 1) * g, I = pd3D.Matrix.rotate(E + f, 0, 0, 1, I), b.pos = I.transformPoint(P[0]).toArray(), i = e.addVertexObject(b), b.pos = I.transformPoint(P[1]).toArray(), e.addVertexObject(b), b.pos = I.transformPoint(P[2]).toArray(), e.addVertexObject(b), b.pos = I.transformPoint(P[3]).toArray(), e.addVertexObject(b), v && (e.addTriangle(i, i + 1, i + 2), e.addTriangle(i, i + 2, i + 3)), D && (e.addLine(i, i + 1), e.addLine(i + 1, i + 2), e.addLine(i + 2, i + 3), e.addLine(i + 3, i))
                        }
                    }
            }
            return pd.isArray(M) && (y = 0, y = null != x ? Math.atan2(x[1] - M[1], x[0] - M[0]) * pd.Const.RAD2DEG : Math.atan2(-M[1], -M[0]) * pd.Const.RAD2DEG, pd.closeTo(y, 0) || e.transform(pd3D.Matrix.rotate(y, 0, 0, 1), null, T)), null != x && e.transform(pd3D.Matrix.translate(x[0], x[1], x[2]), null, T), c && e.transform(c, null, T), n && e.compile(), e
        }, pd3D.Shapes.circularArrow = function(t, e) {
            var r = !1;
            t = t || {}, e || (e = new pd3D.Mesh(t), r = !0);
            var n = pd.Const.DEG2RAD,
                i = pd.toNumber(t.width, 1),
                a = pd.toNumber(t.radius, 1),
                o = t.center || [0, 0, 0],
                s = pd.toNumber(t.fromAngle, 0) * n,
                d = pd.toNumber(t.toAngle, Math.PI) * n,
                h = e.triangles && pd.toBoolean(t.triangles, !0),
                l = e.lines && pd.toBoolean(t.lines, !1),
                c = e.vertexCount(),
                u = 2.5 * n,
                p = d - s,
                f = Math.ceil(Math.abs(p) / u),
                n = a + i,
                u = a - i,
                m = a + .5 * i,
                g = a - .5 * i;
            f < 3 && (f = 3);
            var y = s,
                v = p / f,
                D = Math.sin(s),
                b = Math.cos(s);
            e.addVertex([o[0] + a * D, o[1] + a * b, o[2]]), y += v, D = Math.sin(y), b = Math.cos(y), e.addVertex([o[0] + n * D, o[1] + n * b, o[2]]), e.addVertex([o[0] + u * D, o[1] + u * b, o[2]]), h && e.addTriangle(c, c + 2, c + 1), e.addVertex([o[0] + g * D, o[1] + g * b, o[2]]), e.addVertex([o[0] + m * D, o[1] + m * b, o[2]]), l && (e.addLine(c, c + 1), e.addLine(c, c + 2), e.addLine(c + 2, c + 3), e.addLine(c + 1, c + 4));
            for (var x = e.vertexCount(), M = 2; M < f; ++M) y += v, D = Math.sin(y), b = Math.cos(y), e.addVertex([o[0] + g * D, o[1] + g * b, o[2]]), e.addVertex([o[0] + m * D, o[1] + m * b, o[2]]), h && (e.addTriangle(x - 1, x - 2, x), e.addTriangle(x + 1, x - 1, x)), l && (e.addLine(x - 2, x), e.addLine(x - 1, x + 1)), x += 2;
            return e.addVertex([o[0] + u * D, o[1] + u * b, o[2]]), e.addVertex([o[0] + n * D, o[1] + n * b, o[2]]), D = Math.sin(d), b = Math.cos(d), e.addVertex([o[0] + a * D, o[1] + a * b, o[2]]), h && e.addTriangle(x, x + 2, x + 1), l && (e.addLine(x - 2, x), e.addLine(x - 1, x + 1), e.addLine(x, x + 2), e.addLine(x + 1, x + 2)), t.transform instanceof pd3D.Matrix && e.transform(t.transform, null, c), r && e.compile(), e
        }
    }(), String.prototype.trim || function() {
        var t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(t, "")
        }
    }(),
    function() {
        var u, p, g, y = null,
            f = null,
            B = .1,
            F = .5 * B,
            z = .8,
            Y = 1.25,
            U = 1,
            q = .1,
            H = 0,
            j = 0,
            G = .8,
            W = .25,
            K = null,
            X = null,
            m = 0,
            $ = null;
        pd3D.FontInstance = function(t) {
            t = t || {}, this.isTriangulated = !0, this._width = pd.toNumber(t.width, .1), this._aspectRatio = pd.toNumber(t.aspectRatio, 1.25), this._chamfer = pd.toNumber(t.chamfer, .1), this._italic = pd.toNumber(t.italic, 0), this._skew = pd.toNumber(t.skew, 0), this._weight = pd.toNumber(t.weight, 0), this._weight > pd.Const.EPSILON ? this._width = this._weight / 900 * .35 : this._weight = Math.round(this._width / .35 * 900), this._extrusion = pd.toNumber(t.extrusion, 0), this._updateMetrics = !0, this._metrics = [
                [],
                []
            ], this._letterSpacing = pd.toNumber(t.letterSpacing, .25), this._wordSpacing = pd.toNumber(t.wordSpacing, .8), this._lineSpacing = pd.toNumber(t.lineSpacing, .5), this._smallCapsRatio = pd.toNumber(t.smallCapsRatio, .8), this._includeOutline = !1;
            var a = null,
                o = null,
                s = !1,
                d = null,
                h = !1;
            this.maxTextWidth = 0, this.blockHeight = 0, this.blockWidth = 0, this.setSize = function(t) {
                return pd.isArray(t) ? (h = !0, d = pd3D.Matrix.scale(+t[0] || 1, +t[1] || 1, +t[2] || 1, d)) : (t = +t || 0, h = !pd.closeTo(t, 0) && (d = pd3D.Matrix.scale(t, t, t, d), !0)), this
            }, this.setRotationPolar = function(t, e, r) {
                return s = pd.closeTo(t, 0) ? pd.closeTo(e, 0) ? (o = pd3D.Matrix.identity(o), !1) : (o = r ? pd3D.Matrix.rotate(-e, 0, 1, 0, o) : pd3D.Matrix.rotate(e, 1, 0, 0, o), !0) : (o = pd3D.Matrix.rotate(t, 0, 0, 1, o), pd.closeTo(e, 0) || (r ? o.multiplyBy(pd3D.Matrix.rotate(-e, 0, 1, 0)) : o.multiplyBy(pd3D.Matrix.rotate(e, 1, 0, 0))), !0), this
            }, this.setRotation = function(t, e, r, n) {
                return s = pd.closeTo(t, 0) ? (o = pd3D.Matrix.identity(o), !1) : (o = pd3D.Matrix.rotate(t, e, r, n, o), !0), this
            }, this.addRotation = function(t, e, r, n) {
                return pd.closeTo(t, 0) || (o ? o.multiplyBy(pd3D.Matrix.rotate(t, e, r, n)) : o = pd3D.Matrix.rotate(t, e, r, n, o), s = !0), this
            }, this.clearRotations = function() {
                return o = pd3D.Matrix.identity(o), s = !1, this
            }, this.drawText = function(t, e, r, n, i) {
                return a = pd3D.Matrix.translate(e[0], e[1], e[2], a), s && null != o && a.multiplyBy(o), h && null != d && a.multiplyBy(d), this.addText(t, n || pd.Align.CENTER, i || pd.Align.CENTER, a, r), this
            }
        }, pd3D.FontInstance.prototype.italicSlant = function(t) {
            return arguments.length ? (this._italic = pd.constrainTo(parseFloat(t), -1, 1), this) : this._italic
        }, pd3D.FontInstance.prototype.verticalSkew = function(t) {
            return arguments.length ? (this._skew = pd.constrainTo(parseFloat(t), -1, 1), this) : this._skew
        }, pd3D.FontInstance.prototype.averageKerning = function(t) {
            return arguments.length ? (this._letterSpacing = pd.constrainTo(parseFloat(t) - 1, 0, 10), this) : this._letterSpacing + 1
        }, pd3D.FontInstance.prototype.letterSpacing = function(t) {
            return arguments.length ? (this._letterSpacing = pd.constrainTo(parseFloat(t), 0, 10), this) : this._letterSpacing
        }, pd3D.FontInstance.prototype.wordSpacing = function(t) {
            return arguments.length ? (this._wordSpacing = pd.constrainTo(parseFloat(t), 0, 10), this) : this._wordSpacing
        }, pd3D.FontInstance.prototype.lineSpacing = function(t) {
            return arguments.length ? (this._lineSpacing = pd.constrainTo(parseFloat(t), 0, 10), this) : this._lineSpacing
        }, pd3D.FontInstance.prototype.smallCapsRatio = function(t) {
            return arguments.length ? (this._smallCapsRatio = pd.constrainTo(parseFloat(t), .1, 1), this) : this._smallCapsRatio
        }, pd3D.FontInstance.prototype.aspectRatio = function(t, e, r) {
            return arguments.length ? (this._aspectRatio = pd.constrainTo(t, .1, 10), e > pd.Const.EPSILON && (this._letterSpacing = pd.constrainTo(e - 1, 0, 10)), r > pd.Const.EPSILON && (this._wordSpacing = pd.constrainTo(r, 0, 10)), this._updateMetrics = !0, this) : this._aspectRatio
        }, pd3D.FontInstance.prototype.weight = function(t) {
            if (!arguments.length) return this._weight;
            var e = pd.constrainTo(parseFloat(t), 0, 900);
            return pd.closeTo(this._weight, e, .5) || (this._width = 333333e-9 * e, this._weight = Math.round(e), this._updateMetrics = !0), this
        }, pd3D.FontInstance.prototype.chamfer = function(t) {
            if (!arguments.length) return this._chamfer / .275 * 1e3;
            var e = 275e-6 * pd.constrainTo(parseFloat(t), 1, 1e3);
            return pd.closeTo(this._chamfer, e, .001) || (this._updateMetrics = !0, this._chamfer = e), this
        }, pd3D.FontInstance.prototype.includeOutline = function(t) {
            return arguments.length ? (this._includeOutline = !!t, this) : this._includeOutline
        }, pd3D.FontInstance.prototype.extrusion = function(t) {
            return arguments.length ? (this._extrusion = pd.toNumber(t, 0), this) : this._extrusion
        }, pd3D.FontInstance.prototype.resetMetrics = function() {
            return this._aspectRatio = pd.constrainTo(this._aspectRatio, .1, 10), this._letterSpacing = .25, this._wordSpacing = .8, this._lineSpacing = .5, this._italic = 0, this._skew = 0, this._calculateFontVertices(), this
        }, pd3D.FontInstance.prototype._calculateFontVertices = function() {
            var t = this._width,
                e = this._chamfer,
                r = this._aspectRatio,
                n = t / 2.414213,
                i = .5 * r,
                a = .5 * (t = Math.min(i, t)),
                o = t + .01,
                s = this._metrics[0],
                d = this._metrics[1];
            s[0] = 0, s[1] = t, s[2] = e, s[3] = Math.max(t, e + n), s[4] = i - a, s[5] = i + a, s[6] = Math.max(o, Math.min(r - t, r - e - n)), s[7] = Math.max(o, r - e), s[8] = Math.max(o, r - t), s[9] = r, s[10] = pd.mapAndConstrainTo(e, 0, t, 0, t), d[0] = 0, d[1] = t, d[2] = e, d[3] = Math.max(t, e + n), d[4] = .5 + a - e - n, d[5] = Math.min(.5, .5 + a - e), d[6] = .5 - a, d[7] = .5, d[8] = .5 + a, d[9] = Math.max(.5, .5 - a + e), d[10] = Math.max(d[8], .5 - a + e + n), d[11] = Math.min(1 - t, 1 - e - n), d[12] = 1 - e, d[13] = 1 - t, d[14] = 1, d[4] = Math.min(d[4], d[6]), d[3] > d[4] && (d[3] = d[4] = .5 * (d[3] + d[4])), d[10] > d[11] && (d[10] = d[11] = .5 * (d[10] + d[11])), this._updateMetrics = !1
        }, pd3D.FontInstance.prototype.getLineWidth = function(t) {
            var e, r, n, i = 0,
                a = 0,
                o = this._aspectRatio,
                s = this._width,
                d = this._smallCapsRatio,
                h = this._letterSpacing * o,
                l = this._wordSpacing,
                c = !1,
                u = !1,
                p = t.length,
                f = !0;
            0 < p && 97 <= (n = t.charCodeAt(0)) && n < 123 && (u = !0);
            for (var m = 0; m < p; m++) {
                switch (e = c, c = u, m < p - (a = r = 1) ? u = 97 <= (n = t.charCodeAt(m + 1)) && n < 123 : f = u = !1, t.charAt(m)) {
                    default: c && (r = d);
                    break;
                    case "i":
                            r = d;
                    case "I":
                            a = Math.max(.5, 1.25 * s / o);
                        break;
                    case "\b":
                            case "\f":
                            a = r = 0;
                        break;
                    case " ":
                            a = l;
                        break;
                    case "1":
                            case "{":
                            case "}":
                            a = .5;
                        break;
                    case "(":
                            case ")":
                            case "[":
                            case "]":
                            a = s / o + .2;
                        break;
                    case '"':
                            a = s / o * 2 + .1;
                        break;
                    case "|":
                            case "`":
                            a = .5;
                        break;
                    case ",":
                            case ".":
                            case ":":
                            case ";":
                            (e || u) && (r = d);
                    case "!":
                            case "'":
                            a = s / o
                }
                i += a * o * r, f && (i += u ? h * d : h * r)
            }
            return i
        }, pd3D.FontInstance.prototype.getTextWidth = function(t) {
            for (var e, r = t.match(/[^\r\n]+/g), n = 0, i = 0, a = r.length; i < a; ++i) n < (e = this.getLineWidth(r[i].trim())) && (n = e);
            return n
        }, pd3D.FontInstance.prototype.addText = function(t, e, r, n, i) {
            if (this._updateMetrics && this._calculateFontVertices(), !t || t.length < 1) return i;
            n = n || new pd3D.Matrix, v.init(n), B = this._width, F = .5 * B, z = this._smallCapsRatio, Y = this._aspectRatio, q = this._chamfer, H = this._italic, j = this._skew, p = this._lineSpacing, G = this._wordSpacing, W = this._letterSpacing * Y, g = this._includeOutline && i.hasLines, m = this._extrusion, K = this._metrics[0], X = this._metrics[1], y = i || new pd3D.Mesh, u = y.defaultColor, f = y.defaultLineColor, g && y.hasVertexColors && y.defaultLineColor != y.defaultColor || (f = null), y.triangles || y.addIndexBuffer("triangles"), $ = m > pd.Const.EPSILON ? y.hasVertexNormals ? T : M : x;
            var a, o, s, d = t.match(/[^\r\n]+/g),
                h = d ? d.length : 0,
                l = 0,
                t = Math.max(1, h + (h - 1) * p);
            switch (r) {
                default:
                    case pd.Align.BASELINE:
                    break;
                case pd.Align.TOP:
                        case pd.Align.TOP_LEFT:
                        case pd.Align.TOP_RIGHT:
                        h < 2 && (t += .5 * p),
                    v.multiplyBy(pd3D.Matrix.translate(0, -1, 0));
                    break;
                case pd.Align.CENTER:
                        v.multiplyBy(pd3D.Matrix.translate(0, .5 * t - 1, 0));
                    break;
                case pd.Align.BOTTOM:
                        case pd.Align.BOT_LEFT:
                        case pd.Align.BOT_RIGHT:
                        h < 2 && (t += .5 * p),
                    v.multiplyBy(pd3D.Matrix.translate(0, -1 + t, 0))
            }
            for (var c = 0; c < h; ++c) {
                switch (a = d[c].trim(), s = 0, l < (o = this.getLineWidth(a)) && (l = o), e) {
                    default: s = .5 * -o;
                    break;
                    case pd.Align.LEFT:
                            case pd.Align.TOP_LEFT:
                            case pd.Align.BOT_LEFT:
                            case pd.Align.BASELINE:
                            break;
                    case pd.Align.RIGHT:
                            case pd.Align.TOP_RIGHT:
                            case pd.Align.BOT_RIGHT:
                            s = -o
                }
                pd.closeTo(s, 0) ? A(a) : (v.multiplyBy(pd3D.Matrix.translate(s, 0, 0)), A(a), v.multiplyBy(pd3D.Matrix.translate(-s, 0, 0))), 1 < d.length && v.multiplyBy(pd3D.Matrix.translate(0, -(1 + p), 0))
            }
            return this.maxTextWidth < l && (this.maxTextWidth = l), this.blockHeight = t, this.blockWidth = l, y.hasVertexColors && y.color(u), y
        };
        var n = new pd3D.Vector,
            v = new pd3D.Matrix,
            Z = 0;

        function D(t, e) {
            var r = Z + (t + H * (e - .5)) * U,
                e = (e + j * e * (t - .5)) * U,
                t = v.m;
            return n.init(t[0] * r + t[1] * e + t[3], t[4] * r + t[5] * e + t[7], t[8] * r + t[9] * e + t[11]).divide(t[12] * r + t[13] * e + t[15]), n.toArray()
        }

        function b(t, e) {
            return n.init(Z + (t + H * (e - .5)) * U, (e + j * e * (t - .5)) * U, m), v.transformPoint(n, n), n.toArray()
        }

        function x(t, e, r) {
            var n, i, a, o = t.length;
            y.hasVertexColors && y.color(u);
            for (var s = y.addVertex(D(t[0][0], t[0][1])), d = 1; d < o; ++d) y.addVertex(D(t[d][0], t[d][1]));
            if (.001 < B)
                for (o = e.length, d = 0; d < o; ++d) y.addTriangle(s + e[d][0], s + e[d][1], s + e[d][2]), 3 < e[d].length && y.addTriangle(s + e[d][0], s + e[d][2], s + e[d][3]);
            if (g && r) {
                if (f && y.hasVertexColors)
                    for (o = t.length, y.color(f), s = y.addVertex(D(t[0][0], t[0][1])), d = 1; d < o; ++d) y.addVertex(D(t[d][0], t[d][1]));
                for (n = s, o = r.length, d = 0; d < o; ++d) {
                    for (i = s + r[d], a = n + 1; a <= i; ++a) y.addLine(a - 1, a);
                    y.addLine(i, n), n = i + 1
                }
            }
        }

        function M(t, e, r) {
            for (var n, i, a, o, s = t.length, d = y.addVertex(D(t[0][0], t[0][1])), h = 1; h < s; ++h) y.addVertex(D(t[h][0], t[h][1]));
            for (o = y.addVertex(b(t[0][0], t[0][1])), h = 1; h < s; ++h) y.addVertex(b(t[h][0], t[h][1]));
            for (s = e.length, h = 0; h < s; ++h) y.addTriangle(d + e[h][2], d + e[h][1], d + e[h][0]), 3 < e[h].length && y.addTriangle(d + e[h][3], d + e[h][2], d + e[h][0]), y.addTriangle(o + e[h][0], o + e[h][1], o + e[h][2]), 3 < e[h].length && y.addTriangle(o + e[h][0], o + e[h][2], o + e[h][3]);
            for (h = 0; h < s; ++h) y.addTriangle(d + e[h][2], d + e[h][1], d + e[h][0]), 3 < e[h].length && y.addTriangle(d + e[h][3], d + e[h][2], d + e[h][0]), y.addTriangle(o + e[h][0], o + e[h][1], o + e[h][2]), 3 < e[h].length && y.addTriangle(o + e[h][0], o + e[h][2], o + e[h][3]);
            if (r) {
                for (n = d, s = r.length, vtx_dif = o - d, h = 0; h < s; ++h) {
                    for (i = d + r[h], a = n + 1; a <= i; ++a) y.addTriangle(a - 1, a, a + vtx_dif), y.addTriangle(a - 1, a + vtx_dif, a - 1 + vtx_dif);
                    y.addTriangle(i, n, n + vtx_dif), y.addTriangle(i, n + vtx_dif, i + vtx_dif), n = i + 1
                }
                if (g) {
                    for (n = d, h = 0; h < s; ++h) {
                        for (i = d + r[h], a = n + 1; a <= i; ++a) y.addLine(a - 1, a);
                        y.addLine(i, n), n = i + 1
                    }
                    for (n = o, h = 0; h < s; ++h) {
                        for (i = o + r[h], a = n + 1; a <= i; ++a) y.addLine(a - 1, a);
                        y.addLine(i, n), n = i + 1
                    }
                    for (h = 0; h < s; ++h)
                        for (a = r[h]; 0 <= a; --a) y.addLine(a + d, a + o)
                }
            }
        }

        function T(t, e, r) {
            var n, i, a, o, s, d, h, l, c, u, p = t.length,
                f = [0, 0, -1],
                m = y.defaultNormal;
            for (v.applyVectorTransformToArray(f), y.defaultNormal = f.slice(), a = y.addVertex(D(t[0][0], t[0][1])), s = 1; s < p; ++s) y.addVertex(D(t[s][0], t[s][1]));
            for (pd3D.VectorArray.negate(f), y.defaultNormal = f.slice(), o = y.addVertex(b(t[0][0], t[0][1])), s = 1; s < p; ++s) y.addVertex(b(t[s][0], t[s][1]));
            for (p = e.length, s = 0; s < p; ++s) y.addTriangle(a + e[s][2], a + e[s][1], a + e[s][0]), 3 < e[s].length && y.addTriangle(a + e[s][3], a + e[s][2], a + e[s][0]), y.addTriangle(o + e[s][0], o + e[s][1], o + e[s][2]), 3 < e[s].length && y.addTriangle(o + e[s][0], o + e[s][2], o + e[s][3]);
            for (s = 0; s < p; ++s) y.addTriangle(a + e[s][2], a + e[s][1], a + e[s][0]), 3 < e[s].length && y.addTriangle(a + e[s][3], a + e[s][2], a + e[s][0]), y.addTriangle(o + e[s][0], o + e[s][1], o + e[s][2]), 3 < e[s].length && y.addTriangle(o + e[s][0], o + e[s][2], o + e[s][3]);
            if (r) {
                for (n = 0, p = r.length, s = 0; s < p; ++s) {
                    for (i = r[s], d = n + 1; d <= i; ++d) h = D(t[d - 1][0], t[d - 1][1]), l = D(t[d][0], t[d][1]), c = b(t[d][0], t[d][1]), u = b(t[d - 1][0], t[d - 1][1]), pd3D.VectorArray.calcNormalFromTriangle(f, h, l, c), y.defaultNormal = f.slice(), y.addTriangle(y.addVertex(h), y.addVertex(l), y.addVertex(c)), y.addTriangle(y.addVertex(h), y.addVertex(c), y.addVertex(u));
                    h = D(t[i][0], t[i][1]), l = D(t[n][0], t[n][1]), c = b(t[n][0], t[n][1]), u = b(t[i][0], t[i][1]), pd3D.VectorArray.calcNormalFromTriangle(f, h, l, c), y.defaultNormal = f.slice(), y.addTriangle(y.addVertex(h), y.addVertex(l), y.addVertex(c)), y.addTriangle(y.addVertex(h), y.addVertex(c), y.addVertex(u)), n = i + 1
                }
                if (g) {
                    for (n = a, s = 0; s < p; ++s) {
                        for (i = a + r[s], d = n + 1; d <= i; ++d) y.addLine(d - 1, d);
                        y.addLine(i, n), n = i + 1
                    }
                    for (n = o, s = 0; s < p; ++s) {
                        for (i = o + r[s], d = n + 1; d <= i; ++d) y.addLine(d - 1, d);
                        y.addLine(i, n), n = i + 1
                    }
                    for (s = 0; s < p; ++s)
                        for (d = r[s]; 0 <= d; --d) y.addLine(d + a, d + o)
                }
            }
            y.defaultNormal = m
        }

        function A(t) {
            var e, r, n, i = t.length,
                a = !1,
                o = !1,
                s = H,
                d = j,
                h = 0;
            (Z = 0) < i && 97 <= (n = t.charCodeAt(0)) && n < 123 && (o = !0);
            for (var l = 0; l < i; l++) {
                O = N = 0, r = a, a = o, o = l < i - (e = U = 1) && (97 <= (n = t.charCodeAt(l + 1)) && n < 123);
                t.charAt(l);
                switch (t.charAt(l)) {
                    default: S = .25 * Y,
                    N = X[1] + pd.mapAndConstrainTo(B, 0, .3, .2, .1),
                    $([
                        [K[0], X[0]],
                        [K[9], X[0]],
                        [K[9], X[14]],
                        [K[0], X[14]],
                        [K[1], X[1]],
                        [K[8], X[1]],
                        [K[8], X[13]],
                        [K[0], X[13]]
                    ], [
                        [0, 1, 7, 4],
                        [1, 2, 6, 7],
                        [2, 3, 5, 6],
                        [3, 0, 4, 5]
                    ], [3, 7]);
                    break;
                    case " ":
                            e = G;
                        break;
                    case "\f":
                            h = veryClose(h, 0) ? .15 : 0,
                        H = s + h,
                        e = 0;
                        break;
                    case "!":
                            N = X[1] + pd.mapAndConstrainTo(B, 0, .3, .2, .1),
                        $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[1]],
                            [K[0], X[1]],
                            [K[0], N],
                            [K[1], N],
                            [K[1], X[14]],
                            [K[0], X[14]]
                        ], [
                            [0, 1, 2, 3],
                            [4, 5, 6, 7]
                        ], [3, 7]),
                        e = B / Y;
                        break;
                    case '"':
                            S = K[1] + .1,
                        $([
                            [K[0], X[13]],
                            [K[0] + F, X[13] - B],
                            [K[1], X[13]],
                            [K[1], X[14]],
                            [K[0], X[14]],
                            [S, X[13]],
                            [S + F, X[13] - B],
                            [S + B, X[13]],
                            [S + B, X[14]],
                            [S, X[14]]
                        ], [
                            [0, 1, 2],
                            [0, 2, 3, 4],
                            [5, 6, 7],
                            [6, 7, 8, 9]
                        ], [4, 9]),
                        e = B / Y * 2 + .1;
                        break;
                    case "'":
                            $([
                            [K[0], X[13]],
                            [K[0] + F, X[13] - B],
                            [K[1], X[13]],
                            [K[1], X[14]],
                            [K[0], X[14]]
                        ], [
                            [0, 1, 2],
                            [0, 2, 3, 4]
                        ], [4]),
                        e = B / Y;
                        break;
                    case "#":
                            O = pd.mapAndConstrainTo(Y, 0, 5, 0, .2 * Y),
                        N = pd.mapAndConstrainTo(B, 0, .3, .2, .05);
                        var c = .3 * Y,
                            u = Math.atan(1 / c),
                            p = B / Math.sin(u),
                            f = Math.cos(u),
                            m = X[7] - N,
                            g = X[7] - N - B,
                            y = X[7] + N + B,
                            v = X[7] + N,
                            D = m * f,
                            b = g * f,
                            x = y * f,
                            M = v * f,
                            T = X[14] * f,
                            A = pd.mapAndConstrainTo(Y, 0, 2, 0, O + N),
                            w = K[0] + O,
                            c = K[0] + A,
                            f = K[9] - A - T - p,
                            A = K[9] - O;$([
                            [c, X[0]],
                            [c + p, X[0]],
                            [c + b + p, g],
                            [f + b, g],
                            [f, X[0]],
                            [f + p, X[0]],
                            [f + b + p, g],
                            [A, g],
                            [A, m],
                            [f + D + p, m],
                            [f + M + p, v],
                            [A, v],
                            [A, y],
                            [f + x + p, y],
                            [f + T + p, X[14]],
                            [f + T, X[14]],
                            [f + x, y],
                            [c + x + p, y],
                            [c + T + p, X[14]],
                            [c + T, X[14]],
                            [c + x, y],
                            [w, y],
                            [w, v],
                            [c + M, v],
                            [c + D, m],
                            [w, m],
                            [w, g],
                            [c + b, g],
                            [c + D + p, m],
                            [c + M + p, v],
                            [f + M, v],
                            [f + D, m]
                        ], [
                            [0, 1, 2, 27],
                            [3, 4, 5, 6],
                            [9, 10, 30, 31],
                            [13, 14, 15, 16],
                            [17, 18, 19, 20],
                            [23, 24, 28, 29],
                            [26, 7, 8, 25],
                            [22, 11, 12, 21]
                        ], [27, 31]);
                        break;
                    case "$":
                            $([
                            [K[2], X[0]],
                            [K[4], X[0]],
                            [K[4], X[0] - .2],
                            [K[5], X[0] - .2],
                            [K[5], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[5]],
                            [K[7], X[8]],
                            [K[3], X[8]],
                            [K[1], X[10]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[9], X[11]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[5], X[14]],
                            [K[5], X[14] + .2],
                            [K[4], X[14] + .2],
                            [K[4], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[9]],
                            [K[2], X[6]],
                            [K[6], X[6]],
                            [K[8], X[4]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[0], X[3]],
                            [K[0], X[2]]
                        ], [
                            [0, 5, 29, 30],
                            [5, 6, 28, 29],
                            [6, 7, 27, 28],
                            [7, 8, 26, 27],
                            [8, 9, 25, 26],
                            [9, 10, 24, 25],
                            [10, 11, 23, 24],
                            [11, 12, 22, 23],
                            [12, 13, 17, 22],
                            [13, 14, 16, 17],
                            [14, 15, 16],
                            [30, 31, 33, 0],
                            [31, 32, 33],
                            [1, 2, 3, 4],
                            [18, 19, 20, 21]
                        ], [33]);
                        break;
                    case "%":
                            var O, V = Math.min(.15, B),
                            C = pd.mapAndConstrainTo(B, 0, .2, .05, .15),
                            S = K[9] - 1.5 * C,
                            N = (O = F / Math.sin(Math.atan(1 / Y))) / Y;$([
                            [K[0], X[0]],
                            [K[0] + O, X[0]],
                            [K[9], X[14] - N],
                            [K[9], X[14]],
                            [K[9] - O, X[14]],
                            [K[0], X[0] + N],
                            [S - (O = 1.5 * C), (N = X[0] + 1.5 * C) - O],
                            [S + O, N - O],
                            [S + O, N + O],
                            [S - O, N + O],
                            [S - (O -= V), N - O],
                            [S - O, N + O],
                            [S + O, N + O],
                            [S + O, N - O],
                            [(S = K[0] + 1.5 * C) - (O = 1.5 * C), (N = X[14] - 1.5 * C) - O],
                            [S + O, N - O],
                            [S + O, N + O],
                            [S - O, N + O],
                            [S - (O -= V), N - O],
                            [S - O, N + O],
                            [S + O, N + O],
                            [S + O, N - O]
                        ], [
                            [0, 1, 5],
                            [1, 2, 4, 5],
                            [2, 3, 4],
                            [6, 7, 13, 10],
                            [7, 8, 12, 13],
                            [8, 9, 11, 12],
                            [9, 6, 10, 11],
                            [14, 15, 21, 18],
                            [15, 16, 20, 21],
                            [16, 17, 19, 20],
                            [17, 14, 18, 19]
                        ], [5, 9, 13, 17, 21]);
                        break;
                    case "&":
                            S = K[4],
                        O = Math.min(K[4] - .05, K[0] + Math.max(0, X[9] - .5)),
                        $([
                            [S, X[0] - .2],
                            [S + B, X[0] - .2],
                            [S + B, X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[3]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [S + B, X[1]],
                            [S + B, X[6]],
                            [K[6], X[6]],
                            [K[6], X[8]],
                            [S + B, X[8]],
                            [S + B, X[13]],
                            [K[6] - O, X[13]],
                            [K[8] - O, X[11]],
                            [K[9] - O, X[11]],
                            [K[9] - O, X[12]],
                            [K[7] - O, X[14]],
                            [S + B, X[14]],
                            [S + B, X[14] + .2],
                            [S, X[14] + .2],
                            [S, X[14]],
                            [K[2] + O, X[14]],
                            [K[0] + O, X[12]],
                            [K[0] + O, X[7]],
                            [K[0], X[5]],
                            [K[0], X[2]],
                            [K[2], X[0]],
                            [S, X[0]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[4]],
                            [K[3], X[6]],
                            [S, X[6]],
                            [S, X[1]],
                            [K[3], X[8]],
                            [K[1] + O, X[11]],
                            [K[3] + O, X[13]],
                            [S, X[13]],
                            [S, X[8]]
                        ], [
                            [0, 1, 20, 21],
                            [2, 3, 7, 8],
                            [3, 4, 6, 7],
                            [4, 5, 6],
                            [9, 10, 11, 12],
                            [13, 14, 18, 19],
                            [14, 15, 17, 18],
                            [15, 16, 17],
                            [22, 23, 38, 39],
                            [23, 24, 37, 38],
                            [24, 25, 36, 37],
                            [25, 33, 36],
                            [33, 34, 40, 36],
                            [25, 26, 32, 33],
                            [26, 27, 31, 32],
                            [27, 28, 30, 31],
                            [28, 29, 35, 30]
                        ], [29, 35, 40]);
                        break;
                    case "(":
                            O = (N = .2) * Y,
                        $([
                            [K[1] + O, X[0] - N],
                            [K[1], X[2]],
                            [K[1], X[12]],
                            [K[1] + O, X[14] + N],
                            [K[0], X[12]],
                            [K[0], X[2]]
                        ], [
                            [0, 1, 5],
                            [1, 2, 4, 5],
                            [2, 3, 4]
                        ], [5]),
                        e = B / Y + .2;
                        break;
                    case ")":
                            N = .2,
                        O = K[1] - K[0],
                        S = K[1] + .2 * Y,
                        $([
                            [K[0], X[0] - N],
                            [S, X[2]],
                            [S, X[12]],
                            [K[0], X[14] + N],
                            [S - O, X[12]],
                            [S - O, X[2]]
                        ], [
                            [0, 1, 5],
                            [1, 2, 4, 5],
                            [2, 3, 4]
                        ], [5]),
                        e = B / Y + .2;
                        break;
                    case "*":
                            var k = pd.mapAndConstrainTo(B, .1, .3, .1, X[0]),
                            I = pd.mapAndConstrainTo(B, .1, .3, .9, X[14]),
                            P = pd.mapAndConstrainTo(Y, 0, 5, 0, .2 * Y),
                            E = K[9] - P,
                            _ = K[0] + P,
                            u = Math.atan((E - _) / ((I - k) * Y));O = F / Math.sin(u),
                        N = F / Math.cos(u),
                        $([
                            [K[4], k],
                            [K[5], k],
                            [K[5], X[6] - N],
                            [E - O, k],
                            [E, k],
                            [E, k + N],
                            [K[5] + O, X[6]],
                            [E, X[6]],
                            [E, X[8]],
                            [K[5] + O, X[8]],
                            [E, I - N],
                            [E, I],
                            [E - O, I],
                            [K[5], X[8] + N],
                            [K[5], I],
                            [K[4], I],
                            [K[4], X[8] + N],
                            [_ + O, I],
                            [_, I],
                            [_, I - N],
                            [K[4] - O, X[8]],
                            [_, X[8]],
                            [_, X[6]],
                            [K[4] - O, X[6]],
                            [_, k + N],
                            [_, k],
                            [_ + O, k],
                            [K[4], X[6] - N]
                        ], [
                            [0, 1, 2, 27],
                            [2, 3, 5, 6],
                            [3, 4, 5],
                            [6, 7, 8, 9],
                            [9, 10, 12, 13],
                            [10, 11, 12],
                            [13, 14, 15, 16],
                            [16, 17, 19, 20],
                            [17, 18, 19],
                            [20, 21, 22, 23],
                            [23, 24, 26, 27],
                            [24, 25, 26],
                            [27, 16, 20, 23],
                            [2, 13, 16, 27],
                            [2, 6, 9, 13]
                        ], [27]);
                        break;
                    case "+":
                            k = pd.mapAndConstrainTo(B, .1, .3, .1, X[0]),
                        I = pd.mapAndConstrainTo(B, .1, .3, .9, X[14]);O = pd.mapAndConstrainTo(Y, 0, 5, 0, .2 * Y),
                        $([
                            [K[4], k],
                            [K[5], k],
                            [K[5], X[6]],
                            [S = K[9] - O, X[6]],
                            [S, X[8]],
                            [K[5], X[8]],
                            [K[5], I],
                            [K[4], I],
                            [K[4], X[8]],
                            [S = K[0] + O, X[8]],
                            [S, X[6]],
                            [K[4], X[6]]
                        ], [
                            [1, 6, 7, 0],
                            [2, 3, 4, 5],
                            [8, 9, 10, 11]
                        ], [11]);
                        break;
                    case "-":
                            O = pd.mapAndConstrainTo(Y, 0, 5, .1 * Y, .3 * Y),
                        $([
                            [K[0] + O, X[6]],
                            [S = K[9] - O, X[6]],
                            [S, X[8]],
                            [K[0] + O, X[8]]
                        ], [
                            [0, 1, 2, 3]
                        ], [3]);
                        break;
                    case ",":
                            S = F,
                        N = X[1] + pd.mapAndConstrainTo(B, 0, .3, .2, .1),
                        (r || o) && (U = z),
                        $([
                            [K[0], X[0]],
                            [K[0] + F, X[0]],
                            [K[0] + F, X[0] - B],
                            [K[1], X[0]],
                            [K[1], X[1]],
                            [K[0], X[1]]
                        ], [
                            [0, 3, 4, 5],
                            [1, 2, 3]
                        ], [5]),
                        e = B / Y;
                        break;
                    case ".":
                            S = .25 * Y,
                        N = X[1] + pd.mapAndConstrainTo(B, 0, .3, .2, .1),
                        (r || o) && (U = z),
                        $([
                            [K[0], X[0]],
                            [X[1], X[0]],
                            [K[1], X[1]],
                            [K[0], X[1]]
                        ], [
                            [0, 1, 2, 3]
                        ], [3]),
                        e = B / Y;
                        break;
                    case "/":
                            N = (O = F / Math.sin(Math.atan(1 / Y))) / Y,
                        $([
                            [K[0], X[0] - .2],
                            [K[0] + O, X[0] - .2],
                            [K[9], X[14] + .2 - N],
                            [K[9], X[14] + .2],
                            [K[9] - O, X[14] + .2],
                            [K[0], X[0] - .2 + N]
                        ], [
                            [0, 1, 5],
                            [1, 2, 4, 5],
                            [2, 3, 4]
                        ], [5]);
                        break;
                    case "0":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[2]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[8], X[11] - B],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[1], X[3] + B],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]]
                        ], [
                            [0, 1, 12, 8],
                            [1, 2, 11, 12],
                            [2, 3, 17, 11],
                            [3, 4, 16, 17],
                            [4, 5, 15, 16],
                            [5, 6, 14, 15],
                            [6, 7, 9, 14],
                            [7, 0, 8, 9],
                            [9, 10, 17, 13]
                        ], [7, 12, 17]);
                        break;
                    case "1":
                            $([
                            [O = .25 * Y - F, N = X[0]],
                            [O += B, N],
                            [O, N = X[14]],
                            [O -= B, N],
                            [O -= B, N = X[13]],
                            [O += B, N]
                        ], [
                            [0, 1, 2, 3],
                            [3, 4, 5]
                        ], [5]),
                        e = .5;
                        break;
                    case "2":
                            $([
                            [K[0], X[0]],
                            [K[9], X[0]],
                            [K[9], X[1]],
                            [K[1], X[1]],
                            [K[1], X[4]],
                            [K[3], X[6]],
                            [K[7], X[6]],
                            [K[9], X[9]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[11]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[10]],
                            [K[6], X[8]],
                            [K[2], X[8]],
                            [K[0], X[5]]
                        ], [
                            [0, 1, 2, 3],
                            [3, 4, 20, 0],
                            [4, 5, 19, 20],
                            [5, 6, 18, 19],
                            [6, 7, 17, 18],
                            [7, 8, 16, 17],
                            [8, 9, 15, 16],
                            [9, 10, 14, 15],
                            [10, 11, 13, 14],
                            [11, 12, 13]
                        ], [20]);
                        break;
                    case "3":
                            $([
                            [K[0], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[5]],
                            [K[9] - Math.max(0, X[9] - .5), X[7]],
                            [K[9], X[9]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[0], X[14]],
                            [K[0] + K[10], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[10]],
                            [K[6], X[8]],
                            [.5 * Y, X[8]],
                            [.5 * Y, X[6]],
                            [K[6], X[6]],
                            [K[8], X[4]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[0] + K[10], X[1]]
                        ], [
                            [0, 1, 19, 20],
                            [1, 2, 18, 19],
                            [2, 3, 17, 18],
                            [3, 4, 16, 17],
                            [4, 13, 16],
                            [13, 14, 15, 16],
                            [4, 5, 12, 13],
                            [5, 6, 11, 12],
                            [6, 7, 10, 11],
                            [7, 8, 9, 10]
                        ], [20]);
                        break;
                    case "4":
                            S = .7 * Y,
                        O = B / Math.sin(Math.atan(1 / Y)),
                        N = B / Y,
                        $([
                            [S - F, X[0]],
                            [S + F, X[0]],
                            [S + F, .35 - F],
                            [K[9], .35 - F],
                            [K[9], .35 + F],
                            [S + F, .35 + F],
                            [S + F, X[14]],
                            [S + F - O, X[14]],
                            [K[0], .35 + F],
                            [K[0], .35 - F],
                            [S - F, .35 - F],
                            [K[0] + O, .35 + F],
                            [S - F, X[14] - N],
                            [S - F, .35 + F]
                        ], [
                            [0, 1, 6, 12],
                            [7, 8, 11, 6],
                            [9, 10, 13, 8],
                            [2, 3, 4, 5]
                        ], [10, 13]);
                        break;
                    case "5":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[5]],
                            [K[7], X[8]],
                            [K[1], X[8]],
                            [K[1], X[13]],
                            [K[9] - K[10], X[13]],
                            [K[9], X[14]],
                            [K[0], X[14]],
                            [K[0], X[6]],
                            [K[6], X[6]],
                            [K[8], X[4]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[0], X[3]],
                            [K[0], X[2]]
                        ], [
                            [0, 1, 14, 15],
                            [1, 2, 13, 14],
                            [2, 3, 12, 13],
                            [3, 4, 11, 12],
                            [4, 5, 10, 11],
                            [5, 6, 9, 10],
                            [6, 7, 8, 9],
                            [0, 15, 16, 18],
                            [16, 17, 18]
                        ], [18]);
                        break;
                    case "6":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[5]],
                            [K[7], X[8]],
                            [K[1], X[8]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[9] - K[10], X[13]],
                            [K[9], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[2]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[6]],
                            [K[6], X[6]],
                            [K[8], X[4]],
                            [K[8], X[3]],
                            [K[6], X[1]]
                        ], [
                            [0, 1, 19, 13],
                            [1, 2, 18, 19],
                            [2, 3, 17, 18],
                            [3, 4, 16, 17],
                            [4, 5, 15, 16],
                            [0, 13, 14, 12],
                            [12, 14, 6, 11],
                            [6, 7, 10, 11],
                            [7, 8, 9, 10]
                        ], [12, 19]);
                        break;
                    case "7":
                            $([
                            [K[8] - q, X[0]],
                            [K[9] - q, X[0]],
                            [K[9], X[14]],
                            [K[0], X[14]],
                            [K[0] + K[10], X[13]],
                            [K[8], X[13]]
                        ], [
                            [0, 1, 2, 5],
                            [2, 3, 4, 5]
                        ], [5]);
                        break;
                    case "8":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[5]],
                            [K[9] - Math.max(0, X[9] - .5), X[7]],
                            [K[9], X[9]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[9]],
                            [K[0] + Math.max(0, X[9] - .5), X[7]],
                            [K[0], X[5]],
                            [K[0], X[2]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[4]],
                            [K[3], X[6]],
                            [K[6], X[6]],
                            [K[8], X[4]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[3], X[8]],
                            [K[1], X[10]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[10]],
                            [K[6], X[8]]
                        ], [
                            [0, 1, 21, 14],
                            [1, 2, 20, 21],
                            [2, 3, 19, 20],
                            [3, 4, 18, 19],
                            [4, 29, 18],
                            [18, 29, 22, 17],
                            [4, 5, 28, 29],
                            [5, 6, 27, 28],
                            [6, 7, 26, 27],
                            [7, 8, 25, 26],
                            [8, 9, 24, 25],
                            [9, 10, 23, 24],
                            [10, 11, 22, 23],
                            [11, 17, 22],
                            [11, 12, 16, 17],
                            [12, 13, 15, 16],
                            [13, 0, 14, 15]
                        ], [13, 21, 29]);
                        break;
                    case "9":
                            $([
                            [K[0], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[9]],
                            [K[2], X[6]],
                            [K[8], X[6]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[0] + K[10], X[1]],
                            [K[3], X[8]],
                            [K[1], X[10]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[8]]
                        ], [
                            [0, 1, 11, 12],
                            [1, 2, 10, 11],
                            [2, 3, 18, 10],
                            [3, 4, 17, 18],
                            [4, 5, 16, 17],
                            [5, 6, 15, 16],
                            [6, 7, 14, 15],
                            [7, 8, 13, 14],
                            [8, 9, 19, 13]
                        ], [12, 19]);
                        break;
                    case ":":
                            N = pd.mapAndConstrainTo(B, 0, .3, .2, .05),
                        (r || o) && (U = z),
                        $([
                            [K[0], X[7] - N - B],
                            [K[1], X[7] - N - B],
                            [K[1], X[7] - N],
                            [K[0], X[7] - N],
                            [K[0], X[7] + N],
                            [K[1], X[7] + N],
                            [K[1], X[7] + N + B],
                            [K[0], X[7] + N + B]
                        ], [
                            [0, 1, 2, 3],
                            [4, 5, 6, 7]
                        ], [3, 7]),
                        e = B / Y;
                        break;
                    case ";":
                            N = pd.mapAndConstrainTo(B, 0, .3, .2, .05),
                        (r || o) && (U = z),
                        $([
                            [K[0], X[7] - N - B],
                            [K[0] + F, X[7] - N - B],
                            [K[0] + F, X[7] - N - B - B],
                            [K[1], X[7] - N - B],
                            [K[1], X[7] - N],
                            [K[0], X[7] - N],
                            [K[0], X[7] + N],
                            [K[1], X[7] + N],
                            [K[1], X[7] + N + B],
                            [K[0], X[7] + N + B]
                        ], [
                            [0, 3, 4, 5],
                            [1, 2, 3],
                            [6, 7, 8, 9]
                        ], [5, 9]),
                        e = B / Y;
                        break;
                    case "<":
                            O = B / Math.sin(Math.atan(1 / Y)),
                        $([
                            [f = .75 * Y - (N = .5 * O), .1],
                            [f + O, .1],
                            [(c = .25 * Y - N) + O, .5],
                            [f + O, .9],
                            [f, .9],
                            [c, .5]
                        ], [
                            [1, 2, 5, 0],
                            [2, 3, 4, 5]
                        ], [5]);
                        break;
                    case "=":
                            O = pd.mapAndConstrainTo(Y, 0, 5, 0, .2 * Y),
                        N = pd.mapAndConstrainTo(B, 0, .3, .2, .05),
                        $([
                            [K[0] + O, X[7] - N - B],
                            [S = K[9] - O, X[7] - N - B],
                            [S, X[7] - N],
                            [S = K[0] + O, X[7] - N],
                            [S, X[7] + N],
                            [S = K[9] - O, X[7] + N],
                            [S, X[7] + N + B],
                            [K[0] + O, X[7] + N + B]
                        ], [
                            [0, 1, 2, 3],
                            [4, 5, 6, 7]
                        ], [3, 7]);
                        break;
                    case ">":
                            O = B / Math.sin(Math.atan(1 / Y)),
                        $([
                            [c = .25 * Y - (N = .5 * O), .1],
                            [c + O, .1],
                            [(f = .75 * Y - N) + O, .5],
                            [c + O, .9],
                            [c, .9],
                            [f, .5]
                        ], [
                            [1, 2, 5, 0],
                            [2, 3, 4, 5]
                        ], [5]);
                        break;
                    case "?":
                            N = Math.min(X[6], X[1] + pd.mapAndConstrainTo(B, 0, .3, .2, .1)),
                        $([
                            [K[4], X[0]],
                            [K[5], X[0]],
                            [K[5], X[1]],
                            [K[4], X[1]],
                            [K[4], N],
                            [K[5], N],
                            [K[5], X[6]],
                            [K[7], X[6]],
                            [K[9], X[9]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[11]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[10]],
                            [K[6], X[8]],
                            [K[4], X[8]]
                        ], [
                            [0, 1, 2, 3],
                            [4, 5, 6, 20],
                            [6, 7, 19, 20],
                            [7, 8, 18, 19],
                            [8, 9, 17, 18],
                            [9, 10, 16, 17],
                            [10, 11, 15, 16],
                            [11, 12, 14, 15],
                            [12, 13, 14]
                        ], [3, 20]);
                        break;
                    case "@":
                            S = .5 * Y,
                        N = pd.mapAndConstrainTo(B, 0, .3, .2, .05);m = Math.min(S, K[1] + N + B),
                        P = Math.max(S, K[8] - N - B),
                        E = Math.min(X[7], X[1] + N + B),
                        _ = Math.max(X[7], X[13] - N - B);$([
                            [K[2], X[0]],
                            [K[9], X[0]],
                            [K[9] - K[10], X[1]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[1] + N + B],
                            [P + B, E],
                            [P + B, _ + B],
                            [m - B, _ + B],
                            [m - B, E - B],
                            [K[9], E - B],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[2]],
                            [m, E],
                            [m, _],
                            [P, _],
                            [P, E]
                        ], [
                            [0, 1, 2, 3],
                            [3, 4, 19, 0],
                            [4, 5, 18, 19],
                            [5, 6, 17, 18],
                            [6, 7, 16, 17],
                            [7, 8, 15, 16],
                            [8, 9, 14, 15],
                            [9, 20, 13, 14],
                            [10, 11, 22, 23],
                            [11, 12, 21, 22],
                            [12, 13, 20, 21]
                        ], [19, 23]);
                        break;
                    case "a":
                            U = z;
                    case "A":
                            $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[6]],
                            [K[8], X[6]],
                            [K[8], X[0]],
                            [K[9], X[0]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[1], X[8]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[8]]
                        ], [
                            [4, 5, 6, 14],
                            [6, 7, 13, 14],
                            [7, 8, 12, 13],
                            [8, 9, 11, 12],
                            [9, 0, 1, 11],
                            [2, 3, 15, 10]
                        ], [9, 15]);
                        break;
                    case "b":
                            U = z;
                    case "B":
                            $([
                            [K[0], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[5]],
                            [K[9] - Math.max(0, X[9] - .5), X[7]],
                            [K[9], X[9]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[0], X[14]],
                            [K[1], X[1]],
                            [K[1], X[6]],
                            [K[6], X[6]],
                            [K[8], X[4]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[1], X[8]],
                            [K[1], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[10]],
                            [K[6], X[8]]
                        ], [
                            [0, 1, 14, 9],
                            [1, 2, 13, 14],
                            [2, 3, 12, 13],
                            [3, 4, 11, 12],
                            [4, 20, 11],
                            [4, 5, 19, 20],
                            [5, 6, 18, 19],
                            [6, 7, 17, 18],
                            [7, 8, 16, 17],
                            [8, 0, 9, 16],
                            [10, 11, 20, 15]
                        ], [8, 14, 20]);
                        break;
                    case "c":
                            U = z;
                    case "C":
                            $([
                            [K[2], X[0]],
                            [K[9], X[0]],
                            [K[9] - K[10], X[1]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[9] - K[10], X[13]],
                            [K[9], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[2]]
                        ], [
                            [2, 3, 0, 1],
                            [3, 4, 11, 0],
                            [4, 5, 10, 11],
                            [5, 6, 9, 10],
                            [6, 7, 8, 9]
                        ], [11]);
                        break;
                    case "d":
                            U = z;
                    case "D":
                            $([
                            [K[0], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[0], X[14]],
                            [K[1], X[1]],
                            [K[1], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[3]],
                            [K[6], X[1]]
                        ], [
                            [0, 1, 11, 6],
                            [1, 2, 10, 11],
                            [2, 3, 9, 10],
                            [3, 4, 8, 9],
                            [4, 5, 7, 8],
                            [5, 0, 6, 7]
                        ], [5, 11]);
                        break;
                    case "e":
                            U = z;
                    case "E":
                            $([
                            [K[0], X[0]],
                            [K[9], X[0]],
                            [K[9] - K[10], X[1]],
                            [K[1], X[1]],
                            [K[1], X[6]],
                            [K[5], X[6]],
                            [K[5], X[8]],
                            [K[1], X[8]],
                            [K[1], X[13]],
                            [K[9] - K[10], X[13]],
                            [K[9], X[14]],
                            [K[0], X[14]]
                        ], [
                            [2, 3, 0, 1],
                            [3, 8, 11, 0],
                            [8, 9, 10, 11],
                            [4, 5, 6, 7]
                        ], [11]);
                        break;
                    case "f":
                            U = z;
                    case "F":
                            $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[6]],
                            [K[5], X[6]],
                            [K[5], X[8]],
                            [K[1], X[8]],
                            [K[1], X[13]],
                            [K[9] - K[10], X[13]],
                            [K[9], X[14]],
                            [K[0], X[14]]
                        ], [
                            [0, 1, 6, 9],
                            [6, 7, 8, 9],
                            [2, 3, 4, 5]
                        ], [9]);
                        break;
                    case "g":
                            U = z;
                    case "G":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[8]],
                            [Math.min(K[8], K[5]), X[8]],
                            [Math.min(K[8], K[5]), X[6]],
                            [K[8], X[6]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[9] - K[10], X[13]],
                            [K[9], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[2]]
                        ], [
                            [0, 1, 8, 9],
                            [1, 2, 7, 8],
                            [2, 3, 6, 7],
                            [3, 4, 5, 6],
                            [9, 10, 17, 0],
                            [10, 11, 16, 17],
                            [11, 12, 15, 16],
                            [12, 13, 14, 15]
                        ], [17]);
                        break;
                    case "h":
                            U = z;
                    case "H":
                            $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[6]],
                            [K[8], X[6]],
                            [K[8], X[0]],
                            [K[9], X[0]],
                            [K[9], X[14]],
                            [K[8], X[14]],
                            [K[8], X[8]],
                            [K[1], X[8]],
                            [K[1], X[14]],
                            [K[0], X[14]]
                        ], [
                            [0, 1, 10, 11],
                            [2, 3, 8, 9],
                            [4, 5, 6, 7]
                        ], [11]);
                        break;
                    case "i":
                            U = z;
                    case "I":
                            S = .5 * Math.max(.5 * Y, 1.25 * B),
                        N = Math.min(.5 * (S - F), B),
                        $([
                            [O = S - F - N, X[0]],
                            [O += B + N + N, X[0]],
                            [O, X[1]],
                            [O -= N, X[1]],
                            [O, X[13]],
                            [O += N, X[13]],
                            [O, X[14]],
                            [O -= B + N + N, X[14]],
                            [O, X[13]],
                            [O += N, X[13]],
                            [O, X[1]],
                            [O -= N, X[1]]
                        ], [
                            [0, 1, 2, 11],
                            [3, 4, 9, 10],
                            [6, 7, 8, 5]
                        ], [11]),
                        e = Math.max(.5, 1.25 * B / Y);
                        break;
                    case "j":
                            U = z;
                    case "J":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[14]],
                            [K[4], X[14]],
                            [K[4], X[13]],
                            [K[8], X[13]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[0], X[3]],
                            [K[0], X[2]]
                        ], [
                            [0, 1, 8, 9],
                            [1, 2, 7, 8],
                            [2, 3, 6, 7],
                            [3, 4, 5, 6],
                            [9, 10, 12, 0],
                            [10, 11, 12]
                        ], [12]);
                        break;
                    case "k":
                            U = z;
                    case "K":
                            var L = .5 / (Y - (S = .5 * Y));O = B / Math.sin(Math.atan(L)),
                        N = (.5 - F) / L,
                        K[9] - O - N < K[1] && (S = K[1] + (O - B / (2 * L)), N = K[9] - O - K[1]),
                        $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[6]],
                            [K[9] - O - N, X[6]],
                            [Math.max(K[1], K[9] - O), X[0]],
                            [K[9], X[0]],
                            [S, X[7]],
                            [K[9], X[14]],
                            [Math.max(K[1], K[9] - O), X[14]],
                            [K[9] - O - N, X[8]],
                            [K[1], X[8]],
                            [K[1], X[14]],
                            [K[0], X[14]]
                        ], [
                            [0, 1, 11, 12],
                            [2, 3, 9, 10],
                            [3, 6, 9],
                            [3, 4, 5, 6],
                            [6, 7, 8, 9]
                        ], [12]);
                        break;
                    case "l":
                            U = z;
                    case "L":
                            $([
                            [K[0], X[0]],
                            [K[9], X[0]],
                            [K[9] - K[10], X[1]],
                            [K[1], X[1]],
                            [K[1], X[14]],
                            [K[0], X[14]]
                        ], [
                            [0, 1, 2, 3],
                            [3, 4, 5, 0]
                        ], [5]);
                        break;
                    case "m":
                            U = z;
                    case "M":
                            S = .5 * Y,
                        O = Math.atan((S - B) / (.5 - F)),
                        N = pd.constrainTo(B / Math.sin(O), 0, .75),
                        $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[14] - N],
                            [S, X[8] > N ? X[8] - N : X[0]],
                            [K[8], X[14] - N],
                            [K[8], X[0]],
                            [K[9], X[0]],
                            [K[9], X[14]],
                            [K[8], X[14]],
                            [S, X[8] > N ? X[8] : X[0] + N],
                            [K[1], X[14]],
                            [K[0], X[14]]
                        ], [
                            [1, 10, 11, 0],
                            [2, 3, 9, 10],
                            [3, 4, 8, 9],
                            [8, 5, 6, 7]
                        ], [11]);
                        break;
                    case "n":
                            U = z;
                    case "N":
                            O = Math.atan(1 / Y),
                        N = B / Math.cos(O),
                        $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[14] - N],
                            [K[8], X[0]],
                            [K[9], X[0]],
                            [K[9], X[14]],
                            [K[8], X[14]],
                            [K[8], X[0] + N],
                            [K[1], X[14]],
                            [K[0], X[14]]
                        ], [
                            [1, 8, 9, 0],
                            [2, 3, 7, 8],
                            [4, 5, 6, 3]
                        ], [9]);
                        break;
                    case "o":
                            U = z;
                    case "O":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[2]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[3]],
                            [K[6], X[1]]
                        ], [
                            [0, 1, 15, 8],
                            [1, 2, 14, 15],
                            [2, 3, 13, 14],
                            [3, 4, 12, 13],
                            [4, 5, 11, 12],
                            [5, 6, 10, 11],
                            [6, 7, 9, 10],
                            [7, 0, 8, 9]
                        ], [7, 15]);
                        break;
                    case "p":
                            U = z;
                    case "P":
                            $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[6]],
                            [K[7], X[6]],
                            [K[9], X[9]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[0], X[14]],
                            [K[1], X[8]],
                            [K[1], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[10]],
                            [K[6], X[8]]
                        ], [
                            [0, 1, 9, 7],
                            [2, 3, 13, 8],
                            [3, 4, 12, 13],
                            [4, 5, 11, 12],
                            [5, 6, 10, 11],
                            [6, 7, 9, 10]
                        ], [7, 13]);
                        break;
                    case "q":
                            U = z;
                    case "Q":
                            O = .1 * Y,
                        $([
                            [K[2], X[0]],
                            [K[9], X[0]],
                            [Math.max(K[9] - O, K[9] - K[10]), X[1]],
                            [K[9] - O, X[1]],
                            [K[9] - O, X[12]],
                            [K[7] - O, X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[2]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6] - O, X[13]],
                            [K[8] - O, X[11]],
                            [K[8] - O, X[1]]
                        ], [
                            [0, 1, 2, 9],
                            [3, 4, 14, 15],
                            [4, 5, 13, 14],
                            [5, 6, 12, 13],
                            [6, 7, 11, 12],
                            [7, 8, 10, 11],
                            [8, 0, 9, 10]
                        ], [8, 15]);
                        break;
                    case "r":
                            U = z;
                    case "R":
                            L = (.5 - F) / (Y - (S = .6 * Y + F));O = B / Math.sin(Math.atan(L)),
                        N = (.5 - F) / L,
                        K[9] - O - N < K[1] && (S = K[1] + (O - B / (2 * L)), N = K[9] - O - K[1]),
                        $([
                            [K[0], X[0]],
                            [K[1], X[0]],
                            [K[1], X[6]],
                            [Math.max(K[1], S - O), X[6]],
                            [Math.max(K[1], K[9] - O), X[0]],
                            [K[9], X[0]],
                            [S > K[7] ? K[7] : S, X[6]],
                            [K[7], X[6]],
                            [K[9], X[9]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[0], X[14]],
                            [K[1], X[8]],
                            [K[1], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[8], X[10]],
                            [K[6], X[8]]
                        ], [
                            [0, 1, 13, 11],
                            [2, 7, 17, 12],
                            [3, 4, 5, 6],
                            [7, 8, 16, 17],
                            [8, 9, 15, 16],
                            [9, 10, 14, 15],
                            [10, 11, 13, 14]
                        ], [11, 17]);
                        break;
                    case "s":
                            U = z;
                    case "S":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[5]],
                            [K[7], X[8]],
                            [K[3], X[8]],
                            [K[1], X[10]],
                            [K[1], X[11]],
                            [K[3], X[13]],
                            [K[6], X[13]],
                            [K[8], X[11]],
                            [K[9], X[11]],
                            [K[9], X[12]],
                            [K[7], X[14]],
                            [K[2], X[14]],
                            [K[0], X[12]],
                            [K[0], X[9]],
                            [K[2], X[6]],
                            [K[6], X[6]],
                            [K[8], X[4]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[0], X[3]],
                            [K[0], X[2]]
                        ], [
                            [0, 1, 21, 22],
                            [1, 2, 20, 21],
                            [2, 3, 19, 20],
                            [3, 4, 18, 19],
                            [4, 5, 17, 18],
                            [5, 6, 16, 17],
                            [6, 7, 15, 16],
                            [7, 8, 14, 15],
                            [8, 9, 13, 14],
                            [9, 10, 12, 13],
                            [10, 11, 12],
                            [22, 23, 25, 0],
                            [23, 24, 25]
                        ], [25]);
                        break;
                    case "t":
                            U = z;
                    case "T":
                            $([
                            [K[4], X[0]],
                            [K[5], X[0]],
                            [K[5], X[13]],
                            [K[9], X[13]],
                            [K[9], X[14]],
                            [K[0], X[14]],
                            [K[0], X[13]],
                            [K[4], X[13]]
                        ], [
                            [0, 1, 2, 7],
                            [4, 5, 6, 3]
                        ], [7]);
                        break;
                    case "u":
                            U = z;
                    case "U":
                            $([
                            [K[2], X[0]],
                            [K[7], X[0]],
                            [K[9], X[2]],
                            [K[9], X[14]],
                            [K[8], X[14] - K[10]],
                            [K[8], X[3]],
                            [K[6], X[1]],
                            [K[3], X[1]],
                            [K[1], X[3]],
                            [K[1], X[14] - K[10]],
                            [K[0], X[14]],
                            [K[0], X[2]]
                        ], [
                            [0, 1, 6, 7],
                            [1, 2, 5, 6],
                            [2, 3, 4, 5],
                            [7, 8, 11, 0],
                            [8, 9, 10, 11]
                        ], [11]);
                        break;
                    case "v":
                            U = z;
                    case "V":
                            S = .5 * Y;u = Math.atan(S);O = Math.min(S, B / Math.cos(u)),
                        N = Math.min(X[13], B / Math.sin(u)),
                        $([
                            [S, X[0]],
                            [K[9], X[14]],
                            [K[9] - O, X[14]],
                            [S, X[0] + N],
                            [K[0] + O, X[14]],
                            [K[0], X[14]]
                        ], [
                            [0, 1, 2, 3],
                            [0, 3, 4, 5]
                        ], [5]);
                        break;
                    case "w":
                            U = z;
                    case "W":
                            S = .5 * Y,
                        O = Math.atan((S - B) / (.5 - F));
                        var R = (N = pd.constrainTo(B / Math.sin(O), 0, .75)) * q;$([
                            [K[0] + q, X[0]],
                            [Math.min(S, K[1] + q), X[0]],
                            [S, X[8] > N ? X[6] : X[14] - N],
                            [Math.max(S, K[8] - q), X[0]],
                            [K[9] - q, X[0]],
                            [K[9], X[14]],
                            [K[8], X[14]],
                            [Math.max(S, K[8] - q) + R, X[0] + N],
                            [S, X[8] > N ? X[6] + N : X[14]],
                            [Math.min(S, K[1] + q) - R, X[0] + N],
                            [K[1], X[14]],
                            [K[0], X[14]]
                        ], [
                            [0, 1, 9],
                            [0, 9, 11],
                            [9, 10, 11],
                            [1, 2, 8, 9],
                            [2, 3, 7, 8],
                            [3, 4, 7],
                            [4, 7, 5],
                            [5, 6, 7]
                        ], [11]);
                        break;
                    case "x":
                            U = z;
                    case "X":
                            S = .5 * Y,
                        N = (O = F / Math.sin(Math.atan(1 / Y))) / Y,
                        $([
                            [K[0], X[0]],
                            [K[0] + O, X[0]],
                            [S, X[7] - N],
                            [K[9] - O, X[0]],
                            [K[9], X[0]],
                            [K[9], X[0] + N],
                            [S + O, X[7]],
                            [K[9], X[14] - N],
                            [K[9], X[14]],
                            [K[9] - O, X[14]],
                            [S, X[7] + N],
                            [K[0] + O, X[14]],
                            [K[0], X[14]],
                            [K[0], X[14] - N],
                            [S - O, X[7]],
                            [K[0], X[0] + N]
                        ], [
                            [0, 1, 15],
                            [1, 2, 14, 15],
                            [2, 3, 5, 6],
                            [3, 4, 5],
                            [6, 7, 9, 10],
                            [7, 8, 9],
                            [10, 11, 13, 14],
                            [11, 12, 13],
                            [2, 6, 10, 14]
                        ], [15]);
                        break;
                    case "y":
                            U = z;
                    case "Y":
                            S = .5 * Y;R = 1 / Y * (K[4] - K[0]);N = (O = F / Math.sin(Math.atan(1 / Y))) / Y,
                        $([
                            [K[4], X[0]],
                            [K[5], X[0]],
                            [K[5], X[14] - R - N],
                            [K[9], X[14] - N],
                            [K[9], X[14]],
                            [K[9] - O, X[14]],
                            [S, X[7] + N],
                            [K[0] + O, X[14]],
                            [K[0], X[14]],
                            [K[0], X[14] - N],
                            [K[4], X[14] - R - N]
                        ], [
                            [2, 6, 10],
                            [0, 1, 2, 10],
                            [2, 3, 5, 6],
                            [3, 4, 5],
                            [6, 7, 9, 10],
                            [7, 8, 9]
                        ], [10]);
                        break;
                    case "z":
                            U = z;
                    case "Z":
                            O = Math.atan(1 / Y),
                        N = B / Math.sin(O),
                        $([
                            [K[0], X[0]],
                            [K[9], X[0]],
                            [K[9], X[1]],
                            [K[0] + N, X[1]],
                            [K[9], X[13]],
                            [K[9], X[14]],
                            [K[0], X[14]],
                            [K[0], X[13]],
                            [K[9] - N, X[13]],
                            [K[0], X[1]]
                        ], [
                            [0, 1, 2, 9],
                            [3, 4, 8, 9],
                            [5, 6, 7, 4]
                        ], [9]);
                        break;
                    case "\\":
                            N = (O = F / Math.sin(Math.atan(1 / Y))) / Y,
                        $([
                            [K[9] - O, X[0] - .2],
                            [K[9], X[0] - .2],
                            [K[9], X[0] - .2 + N],
                            [K[0] + O, X[14] + .2],
                            [K[0], X[14] + .2],
                            [K[0], X[14] + .2 - N]
                        ], [
                            [0, 1, 2],
                            [2, 3, 5, 0],
                            [3, 4, 5]
                        ], [5]);
                        break;
                    case "[":
                            O = (N = .2) * Y,
                        $([
                            [K[0], X[0] - N],
                            [K[1] + O, X[0] - N],
                            [K[1] + O, X[1] - N],
                            [K[1], X[1] - N],
                            [K[1], X[13] + N],
                            [K[1] + O, X[13] + N],
                            [K[1] + O, X[14] + N],
                            [K[0], X[14] + N]
                        ], [
                            [0, 1, 2, 3],
                            [3, 4, 7, 0],
                            [4, 5, 6, 7]
                        ], [7]),
                        e = B / Y + .2;
                        break;
                    case "]":
                            N = .2,
                        O = K[1] - K[0],
                        S = K[1] + .2 * Y,
                        $([
                            [K[0], X[0] - N],
                            [S, X[0] - N],
                            [S, X[14] + N],
                            [K[0], X[14] + N],
                            [K[0], X[13] + N],
                            [S - O, X[13] + N],
                            [S - O, X[1] - N],
                            [K[0], X[1] - N]
                        ], [
                            [0, 1, 6, 7],
                            [1, 2, 5, 6],
                            [2, 3, 4, 5]
                        ], [7]),
                        e = B / Y + .2;
                        break;
                    case "^":
                            S = .5 * Y;u = Math.atan(Y);O = B / Math.cos(u),
                        N = B / Math.sin(u),
                        $([
                            [K[0], X[7]],
                            [K[0] + O, X[7]],
                            [S, Math.max(X[7], X[14] - N)],
                            [K[9] - O, X[7]],
                            [K[9], X[7]],
                            [S, X[14]]
                        ], [
                            [1, 2, 5, 0],
                            [2, 3, 4, 5]
                        ], [5]);
                        break;
                    case "_":
                            S = .25 * Y,
                        N = X[0] - F,
                        $([
                            [K[0], X[0]],
                            [K[9], X[0]],
                            [K[9], X[1]],
                            [K[0], X[1]]
                        ], [
                            [0, 1, 2, 3]
                        ], [3]);
                        break;
                    case "°":
                            case "°":
                            case "`":
                            S = .25 * Y;V = Math.min(.15, B),
                        C = pd.mapAndConstrainTo(B, 0, .2, .05, .15);N = X[14] - 1.5 * C,
                        $([
                            [S - (O = 1.5 * C), N - O],
                            [S + O, N - O],
                            [S + O, N + O],
                            [S - O, N + O],
                            [S - (O -= V), N - O],
                            [S - O, N + O],
                            [S + O, N + O],
                            [S + O, N - O]
                        ], [
                            [0, 1, 7, 4],
                            [1, 2, 6, 7],
                            [2, 3, 5, 6],
                            [3, 0, 4, 5]
                        ], [3, 7]),
                        e = .5;
                        break;
                    case "{":
                            N = .2,
                        O = pd.mapAndConstrainTo(Y, 0, 5, .25 * Y, .1 * Y),
                        O = B + Math.max(.1 / Y, O),
                        S = .25 * Y - .5 * O + .5 * Math.max(.1, B),
                        $([
                            [S + O, X[0] - N],
                            [S + B, X[2]],
                            [S + B, X[5]],
                            [S - Math.max(.1, B) + B, X[7]],
                            [S + B, X[9]],
                            [S + B, X[12]],
                            [S + O, X[14] + N],
                            [S, X[12]],
                            [S, X[10]],
                            [S - Math.max(.1, B), X[7]],
                            [S, X[4]],
                            [S, X[2]]
                        ], [
                            [0, 1, 11],
                            [1, 2, 10, 11],
                            [2, 3, 9, 10],
                            [3, 4, 8, 9],
                            [4, 5, 7, 8],
                            [5, 6, 7]
                        ], [11]),
                        e = .5;
                        break;
                    case "|":
                            N = .2,
                        $([
                            [(S = .25 * Y) - F, X[0] - N],
                            [S + F, X[0] - N],
                            [S + F, X[14] + N],
                            [S - F, X[14] + N]
                        ], [
                            [0, 1, 2, 3]
                        ], [3]),
                        e = .5;
                        break;
                    case "}":
                            N = .2,
                        O = pd.mapAndConstrainTo(Y, 0, 5, .25 * Y, .1 * Y),
                        O = B + Math.max(.1 / Y, O),
                        S = .25 * Y + .5 * O - .5 * Math.max(.1, B),
                        $([
                            [S - O, X[0] - N],
                            [S, X[2]],
                            [S, X[4]],
                            [S + Math.max(.1, B), X[7]],
                            [S, X[10]],
                            [S, X[12]],
                            [S - O, X[14] + N],
                            [S - B, X[12]],
                            [S - B, X[9]],
                            [S + Math.max(.1, B) - B, X[7]],
                            [S - B, X[5]],
                            [S - B, X[2]]
                        ], [
                            [0, 1, 11],
                            [1, 2, 10, 11],
                            [2, 3, 9, 10],
                            [3, 4, 8, 9],
                            [4, 5, 7, 8],
                            [5, 6, 7]
                        ], [11]),
                        e = .5;
                        break;
                    case "~":
                            O = pd.mapAndConstrainTo(Y, 0, 5, 0, .2 * Y);N = .333333333 * (K[9] - K[0] - O - O),
                        c = K[0] + O + N,
                        f = K[9] - O - N;$([
                            [K[0] + O, .25],
                            [c, .6 - F],
                            [f, .4 - F],
                            [K[9] - O, .75],
                            [f, .4 + F],
                            [c, .6 + F]
                        ], [
                            [0, 1, 5],
                            [1, 2, 4, 5],
                            [2, 3, 4]
                        ], [5])
                }
                Z += e * Y * U, Z += o ? W * z : W * U
            }
            H = s, j = d
        }
        pd3D.Font = new pd3D.FontInstance
    }();
var pdDOM = pdDOM || {};
! function() {
    pdDOM.mobileOS = "", pdDOM.isMobile = !1, pdDOM.devicePixelRatio = window.devicePixelRatio || 1, pdDOM.pageScale = 1,
        function() {
            var t, e, r = navigator.userAgent || navigator.vendor || window.opera;
            if (pdDOM.mobileOS = r.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) || [], pdDOM.isMobile = 0 < pdDOM.mobileOS.length, pdDOM.isMobile) /windows phone/i.test(r) ? pdDOM.isWindowsPhone = !0 : /android/i.test(r) ? pdDOM.isAndroid = !0 : /iPad|iPhone|iPod/.test(r) && !window.MSStream && (pdDOM.isiOS = !0, /iPhone/.test(r) && (pdDOM.isiPhone = !0));
            else {
                var n = r.toLowerCase();
                if (0 <= n.indexOf("macintosh") && (pdDOM.isMacintosh = !0), navigator.vendor && 0 <= navigator.vendor.indexOf("Apple") && navigator.userAgent && !navigator.userAgent.match("CriOS")) {
                    r = (r = (t = n).match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [], /trident/i.test(r[1]) ? {
                        name: "IE",
                        version: (e = /\brv[ :]+(\d+)/g.exec(t) || [])[1] || ""
                    } : "Chrome" === r[1] && null != (e = t.match(/\b(OPR|Edge)\/(\d+)/)) ? {
                        name: e[1].replace("OPR", "Opera"),
                        version: e[2]
                    } : (r = r[2] ? [r[1], r[2]] : [navigator.appName, navigator.appVersion, "-?"], null != (e = t.match(/version\/(\d+)/i)) && r.splice(1, 1, e[1]), {
                        name: r[0],
                        version: r[1]
                    })), r = parseFloat(r.version);
                    return pdDOM.isSafariOldVersion = r < 11, pdDOM.isSafari = !0
                }
                0 <= n.indexOf("firefox") && (pdDOM.isFirefox = !0), 0 <= n.indexOf("windows") && (pdDOM.isWindows10 = 0 <= n.indexOf("10."), pdDOM.isWindows = !0)
            }
        }();
    var i = !0,
        n = null,
        a = !0;
    pdDOM.checkForSafariCanvasFix = function(t, e, r) {
        return pdDOM.isSafariOldVersion && 1.5 < window.devicePixelRatio && (a = 1441 < t || 901 < e ? (a && r && (null == n ? n = r({
            content: "<strong>WARNING</strong>: WebGL canvas resolution reduced as Safari really struggles<br />on a scaled Retina display when sized greater than 1440x900 pixels.",
            style: "primary",
            timeout: 12e3
        }) : n.hasClass("snackbar-opened") || n.snackbar("show")), !(pdDOM.devicePixelRatio = 1)) : (r && n && n.hasClass("snackbar-opened") && n.snackbar("hide"), pdDOM.devicePixelRatio = window.devicePixelRatio, !0)), pdDOM
    }, pdDOM.getClientWidth = function() {
        var t = window.innerWidth,
            e = document.documentElement.clientWidth;
        return e < t ? t : e
    }, pdDOM.getClientHeight = function() {
        var t = window.innerHeight,
            e = document.documentElement.clientHeight;
        return e < t ? t : e
    }, pdDOM.setFullSizeCanvasByDevice = function(t, e, r, n) {
        return i && pdDOM.devicePixelRatio < 2 && (i = !1, .5 < pdDOM.getLocalStorageItem("hiresWebGL") && (pdDOM.devicePixelRatio = Math.max(2, window.devicePixelRatio))), pdDOM.checkForSafariCanvasFix(e, r, n), t && t.canvas && (t.canvas.width = e * pdDOM.devicePixelRatio, t.canvas.height = r * pdDOM.devicePixelRatio, t.canvas.style.height = r, t.canvas.style.width = e, t.viewport(0, 0, t.canvas.width, t.canvas.height)), pdDOM
    }, pdDOM.applyFirefoxPageScaleFix = function(t, e, r, n) {
        return t && pdDOM.isFirefox && (t.css({
            "-moz-transform": "scale(" + n + ")",
            "-moz-transform-origin": "0 0"
        }), n < 1 ? t.css({
            width: e * pdDOM.pageScale + "px",
            height: r * pdDOM.pageScale + "px"
        }) : t.css({
            width: "100%",
            height: "100%"
        })), pdDOM
    }, pdDOM.getParamString = function(t, e, r) {
        var n, i = [];
        for (n in t) i.push(encodeURIComponent(r ? n.toUpperCase() : n) + "=" + encodeURIComponent(t[n]));
        return (e && -1 !== e.indexOf("?") ? "&" : "?") + i.join("&")
    }, pdDOM.getUrlParams = function(t) {
        var n = {};
        return (t = t || window.location.search).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(t, e, r) {
            n[e] = r
        }), n
    }, pdDOM.hasClass = function(t, e) {
        var r = new RegExp("(\\s|^)" + e + "(\\s|$)");
        if (t instanceof SVGElement) {
            e = t.getAttribute("class");
            return e ? !!e.match(r) : !1
        }
        return !!t.className.match(r)
    }, pdDOM.addClass = function(e, t, r) {
        r = pd.toBoolean(r, !1), pd.isArray(t) && t.forEach(function(t) {
            pdDOM.addClass(e, t, r)
        });
        var n = e.getAttribute("class"),
            i = new RegExp("(\\s|^)" + t + "(\\s|$)");
        return n && n.match(i) || (e instanceof SVGElement ? (n = r ? 0 < n.length ? t + " " + n : t : 0 < n.length ? n + " " + t : t, e.setAttribute("class", n)) : e.className = r ? 0 < e.className.length ? t + " " + e.className : t : 0 < e.className.length ? e.className + " " + t : t), pdDOM
    }, pdDOM.removeClass = function(e, t) {
        pd.isArray(t) && t.forEach(function(t) {
            pdDOM.removeClass(e, t)
        });
        var r = e.getAttribute("class"),
            t = new RegExp("(\\s|^)" + t + "(\\s|$)");
        return r && r.match(t) && (e instanceof SVGElement ? (r = r.replace(t, " ").trim(), e.setAttribute("class", r)) : e.className = e.className.replace(t, " ").trim()), pdDOM
    }, pdDOM.toggleClass = function(e, t, r) {
        pd.isArray(t) && t.forEach(function(t) {
            pdDOM.toggleClass(e, t, r)
        });
        var n = pdDOM.hasClass(e, t);
        return (r = pd.toBoolean(r, !n)) && !n ? pdDOM.addClass(e, t) : !r && n && pdDOM.removeClass(e, t), pdDOM
    }, pdDOM.getComputedElementStyle = function(t, e) {
        var r = "";
        if (window.getComputedStyle) r = getComputedStyle(t).getPropertyValue(e);
        else if (t.currentStyle) try {
            r = t.currentStyle[e]
        } catch (t) {}
        return r
    }, pdDOM.getElementFontSizeInPixels = function(t) {
        return parseFloat(pdDOM.getComputedElementStyle(t || document.documentElement, "font-size"))
    }, pdDOM.convertEmToPixels = function(t, e) {
        return parseFloat(t) * pdDOM.getElementFontSizeInPixels(e)
    }, pdDOM.convertToInlineStyles = function(t, e) {
        if (e = e || {}, t) {
            e.recursive && Array.prototype.forEach.call(t.children, function(t) {
                pdDOM.convertToInlineStyles(t, e)
            });
            for (var r = getComputedStyle(t), n = 0; n < r.length; ++n) {
                var i, a = r.item(n);
                (!e.properties || 0 <= e.properties.indexOf(a)) && (i = r.getPropertyValue(a), t.style[a] = i)
            }
        }
    };
    var o = "http://www.w3.org/2000/svg";

    function s(t, e, r) {
        for (; t.hasChildNodes();) t.removeChild(t.lastChild);
        if (e && pd.isString(e)) {
            var n, i = pd.toNumber(r.x, 0),
                a = pd.toNumber(r.lineHeight, 1.1),
                o = pd.toNumber(r.dy, 0),
                s = e.match(/[^\r\n]+/g);
            if (pd.isArray(s) && 1 < s.length)
                for (var d = 0, h = s.length; d < h; ++d)(n = pdDOM.svgElem("tspan", {
                    x: i,
                    dy: (0 < d ? a : o) + "em"
                })).appendChild(document.createTextNode(s[d].trim())), t.appendChild(n);
            else t.appendChild(document.createTextNode(e.trim()))
        } else t.appendChild(document.createTextNode(""));
        return t
    }
    pdDOM.svgElem = function(t, e) {
        e = e || {};
        var r, n = document.createElementNS(o, t);
        for (r in e) n.setAttributeNS(null, r, e[r]);
        return n
    }, pdDOM.svgText = function(t, e) {
        e = pdDOM.svgElem("text", e);
        return e.appendChild(document.createTextNode(t)), e
    }, pdDOM.svgTextMultiLine = function(t, e) {
        var r = pdDOM.svgElem("text", e);
        return s(r, t, e), r
    }, pdDOM.svgAttr = function(t, e) {
        if (t && pd.isObject(e))
            for (var r in e) null == e[r] ? t.removeAttributeNS(o, r) : t.setAttributeNS(null, r, e[r]);
        return pdDOM
    }, pdDOM.svgSetText = function(t, e, r) {
        if (t) {
            if (pd.isObject(r))
                for (var n in r) t.setAttributeNS(null, n, r[n]);
            t.firstChild && (t.firstChild.nodeValue = e)
        }
        return pdDOM
    }, pdDOM.svgSetTextMultiLine = function(t, e, r) {
        if (t && pd.isObject(r))
            for (var n in r) t.setAttributeNS(null, n, r[n]);
        return s(t, e, r), pdDOM
    }, pdDOM.svgHide = function(t) {
        return t.setAttributeNS(null, "display", "none"), pdDOM
    }, pdDOM.svgShow = function(t) {
        return t.setAttributeNS(null, "display", "inline"), pdDOM
    };
    var d = ["webkit", "moz", "MS", "o", ""];
    pdDOM.cssAnimation = function(r, n, i, a) {
        pdDOM.addClass(r, n),
            function(t, e, r) {
                for (var n = 0; n < d.length; ++n) d[n] || (e = e.toLowerCase()), t.addEventListener(d[n] + e, r, !1)
            }(r, "AnimationEnd", function t(e) {
                ! function(t, e, r) {
                    for (var n = 0; n < d.length; ++n) d[n] || (e = e.toLowerCase()), t.removeEventListener(d[n] + e, r)
                }(r, "AnimationEnd", t), pdDOM.removeClass(r, n), "function" == typeof i && i(e, a)
            })
    }, pdDOM.enableDragDrop = function(t, e) {
        function r(t) {
            (t = t || window.event).dataTransfer.dropEffect = "copy", t.stopPropagation(), t.preventDefault()
        }
        return !(!window.FileReader || !t || "function" != typeof e) && (t.addEventListener("dragenter", r), t.addEventListener("dragleave", r), t.addEventListener("dragover", r), t.addEventListener("drop", function(t) {
            return (t = t || window.event).stopPropagation(), t.preventDefault(), e(t.dataTransfer.files, t), !1
        }), !0)
    }, pdDOM.copyToClipboard = function(t) {
        var e = !1;
        if (t) {
            var r = document.createElement("textarea"),
                n = window.pageYOffset || document.documentElement.scrollTop;
            r.style.fontSize = "12pt", r.style.border = "0", r.style.padding = "0", r.style.margin = "0", r.style.position = "absolute", r.style.left = "-9999px", r.style.top = n + "px", r.setAttribute("readonly", ""), r.value = t.toString(), document.body.appendChild(r), r.focus(), r.select();
            try {
                e = document.execCommand("copy")
            } catch (t) {
                e = !1
            }
            setTimeout(function() {
                document.body.removeChild(r), r = null
            }, 500)
        }
        return e
    }, pdDOM.getKbdIncrement = function(t, e) {
        switch (t.which) {
            case 37:
                return e ? 1 : 0;
            case 38:
                return 1;
            case 39:
                return e ? -1 : 0;
            case 40:
                return -1;
            case 33:
                return 10;
            case 34:
                return -10
        }
        return 0
    }, pdDOM.getScrollIncrement = function(t) {
        t = t.originalEvent || t;
        if (t) {
            if (t.deltaY) return t.deltaY < 0 ? 1 : -1;
            if (t.deltaX) return t.deltaX < 0 ? 1 : -1;
            if (void 0 !== t.wheelDeltaY) return t.wheelDeltaY < 0 ? 1 : -1;
            if (void 0 !== t.wheelDeltaX) return t.wheelDeltaX < 0 ? 1 : -1;
            if (t.wheelDelta) return t.wheelDelta < 0 ? 1 : -1;
            if (t.detail) return t.detail < 0 ? 1 : -1
        }
        return 0
    }, pdDOM.Parameter = function(t) {
        t = t || {}, this.type = pd.toInteger(t.type, 0), this.units = pd.toInteger(t.units, 0), this.value = t.value || 0, this.min = pd.toNumber(t.min, 0), this.max = pd.toNumber(t.max, 1), this.step = pd.toNumber(t.step, .01), this.minor = pd.toNumber(t.minor, 5 * this.step), this.major = pd.toNumber(t.major, 20 * this.step), this.precision = pd.toInteger(t.precision, Math.max(0, -Math.ceil(Math.log(this.step))))
    }, pdDOM.Parameter.NUMBER = 0, pdDOM.Parameter.INTEGER = 1, pdDOM.Parameter.VECTOR = 2, pdDOM.Parameter.COLOR = 3, pdDOM.hiResTimeStamp = function() {
        if (window.performance) {
            var t = window.performance;
            if (t.now) return function() {
                return t.now()
            };
            if (t.webkitNow) return function() {
                return t.webkitNow()
            };
            if (t.mozNow) return function() {
                return t.mozNow()
            };
            if (t.oNow) return function() {
                return t.oNow()
            }
        }
        return function() {
            return Date.now()
        }
    }(), pdDOM.ThrottledUpdate = function(e, r, n) {
        var i = this,
            a = null;
        if ("function" != typeof e) throw new TypeError("ERROR: Callback must be a function.");

        function o() {
            i.cancel(), e(n)
        }
        return r = pd.isNumeric(r) ? parseFloat(r) : 50, this.trigger = function() {
            return a = a || setTimeout(o, r), i
        }, this.restart = function(t) {
            return a && clearTimeout(a), r = pd.toNumber(t, r), a = setTimeout(o, r), i
        }, this.timeout = function(t) {
            return i.cancel(), e(t = t || n), i
        }, this.cancel = function() {
            return a && clearTimeout(a), a = null, i
        }, this
    }, pdDOM.throttledCalculation = function(r) {
        if ("object" != typeof(r = r || {}).iterator || "function" != typeof r.iterator.next) throw new Error("ERROR: Calculation requires a valid iterator object.");
        if ("function" != typeof r.callbackCalculate) throw new Error("ERROR: Calculation callback must be a function.");
        var n = r.iterator;
        return r.iterations = r.iterations || 1e6, r.timeout = r.timeout || 100, pdDOM.getGlobalAnimationQueue().addOrReplace(function() {
            var t = 0,
                e = pdDOM.hiResTimeStamp() + r.timeout;
            if (n)
                for (; null != (n = n.next()) && (r.callbackCalculate(n), !(++t >= r.iterations || pdDOM.hiResTimeStamp() > e)););
            return !n || n.cancelled ? (r.callbackOnComplete && r.callbackOnComplete(r), !0) : (r.callbackOnTimeout && r.callbackOnTimeout(n, r), !1)
        }).start(), !0
    };
    var t = null;

    function h(t) {
        return .206893034 < t ? t * t * t : (t - 4 / 29) / 7.787037
    }

    function l(t) {
        return .008856 < t ? Math.pow(t, 1 / 3) : 7.787037 * t + 4 / 29
    }

    function c(t) {
        return Math.round(255 * (t <= .00304 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - .055))
    }

    function u(t) {
        return (t /= 255) <= .04045 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4)
    }

    function p(t) {
        var e = u(255 * t[0]),
            r = u(255 * t[1]),
            n = u(255 * t[2]),
            i = l((.4124564 * e + .3575761 * r + .1804375 * n) / .95047),
            t = l(.2126729 * e + .7151522 * r + .072175 * n);
        return [116 * t - 16, 500 * (i - t), 200 * (t - l((.0193339 * e + .119192 * r + .9503041 * n) / 1.08883))]
    }

    function f(t, e, r, n) {
        var i, a = 1 - r,
            o = p(t),
            s = p(e),
            i = (i = [a * o[0] + r * s[0], a * o[1] + r * s[1], a * o[2] + r * s[2]], o = (i[0] + 16) / 116, s = o + i[1] / 500, i = o - i[2] / 200, [c(3.2404542 * (s = .95047 * h(s)) - 1.5371385 * (o = h(o)) - .4985314 * (i = 1.08883 * h(i))) / 255, c(-.969266 * s + 1.8760108 * o + .041556 * i) / 255, c(.0556434 * s - .2040259 * o + 1.0572252 * i) / 255]);
        return (n = n || [])[0] = pd.constrainTo(i[0], 0, 1), n[1] = pd.constrainTo(i[1], 0, 1), n[2] = pd.constrainTo(i[2], 0, 1), n[3] = a * t[3] + r * e[3], n
    }

    function m(e, r) {
        var n = [];
        e = e || [], pd.isArray(e) && (e[0] = +e[0] || 0, e[1] = +e[1] || 0, e[2] = +e[2] || 0, e[3] = pd.toNumber(e[3], 1)), r = r || [], pd.isArray(e) && (r[0] = +r[0] || 0, r[1] = +r[1] || 0, r[2] = +r[2] || 0, r[3] = pd.toNumber(r[3], 1)), this.interpolate = function(t) {
            return 1 === t ? r : f(e, r, t, n)
        }
    }

    function g(a, o) {
        var s = [];
        a = a || [], pd.isArray(a) && (a[0] = +a[0] || 0, a[1] = +a[1] || 0, a[2] = +a[2] || 0), o = o || [], pd.isArray(a) && (o[0] = +o[0] || 0, o[1] = +o[1] || 0, o[2] = +o[2] || 0), this.interpolate = function(t) {
            return 1 === t ? o : (e = o, n = s, i = 1 - (r = t), t = [+(t = a)[0] || 0, +t[1] || 0, +t[2] || 0], e = [+e[0] || 0, +e[1] || 0, +e[2] || 0], (n = n || [])[0] = i * t[0] + r * e[0], n[1] = i * t[1] + r * e[1], n[2] = i * t[2] + r * e[2], n);
            var e, r, n, i
        }
    }

    function y(e, r) {
        r = pd.toNumber(r, 1), e = pd.toNumber(e, 0), this.interpolate = function(t) {
            return (1 - t) * e + t * r
        }
    }
    pdDOM.getGlobalAnimationQueue = function() {
        return t = t || new pdDOM.AnimationQueue
    }, pdDOM.AnimationQueue = function() {
        var e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(t) {
                setTimeout(t, 1e3 / 60)
            },
            r = [],
            n = [],
            i = [],
            a = !1,
            o = 0,
            s = 0,
            d = 0;

        function h(t) {
            r.indexOf(t) < 0 && r.push(t)
        }

        function l(t, e) {
            t((d - s) / 1e3, o, t._payload) && n.push(e)
        }

        function c() {
            if (a) {
                if (0 < i.length && (i.forEach(h), i.length = 0), d = (new Date).getTime(), r.forEach(l), 0 < n.length) {
                    n.sort(function(t, e) {
                        return e - t
                    });
                    for (var t = n.length - 1; 0 <= t; t--) r.splice(n[t], 1);
                    n.length = 0
                }
                o++, e(c), s = d
            }
        }
        return this.frameCount = function() {
            return o
        }, this.add = function(t, e) {
            return t && "function" == typeof t && (t._payload = e || null, a ? i.push(t) : h(t)), this
        }, this.addOrReplace = function(t, e) {
            return t && "function" == typeof t && (t._payload = e || null, 0 <= (e = r.indexOf(t)) ? r[e] = t : a ? i.push(t) : h(t)), this
        }, this.contains = function(t) {
            return 0 <= r.indexOf(t)
        }, this.remove = function(t) {
            return !t || "function" != typeof t || 0 <= (t = r.indexOf(t)) && (a ? n.push(t) : r.splice(t, 1)), this
        }, this.start = function() {
            return a || (a = !0, s = (new Date).getTime(), c()), this
        }, this.stop = function() {
            return a = !1, this
        }, t = t || this, this
    }, pdDOM.Animation = function(t, e) {
        var r = this;
        return this._queue = [], e && this._queue.push(e), e = e || {}, this.active = !1, this.delay = pd.constrainTo(pd.toNumber(e.delay, 0), 0, 3600), this.duration = pd.constrainTo(pd.toNumber(e.duration, 1), .001, 3600), this.easing = e.easing || pd.Easing.inOutSine, this.fromValue = pd.toNumber(e.fromValue, 0), this.toValue = pd.toNumber(e.toValue, 1), this.getter = e.getter || null, this.callback = t || null, this.onStart = e.onStart || null, this.onComplete = e.onComplete || null, this.progress = 0, this.speed = 1 / this.duration, this.update = function(t) {
            return r._handleUpdate(t)
        }, this._delayValue = 0, t = e = null, this
    }, pdDOM.Animation.prototype._handleUpdate = function(t) {
        if (.999 < this.progress) return this.active = !1, this.progress = 1, this.callback && this.callback(this.toValue, this), (!this.onComplete || !1 !== this.onComplete(this)) && (!(0 < this._queue.length) || (this.start(this._queue.shift()), !1));
        if (1e-6 < this._delayValue) {
            if (this._delayValue -= t, !(this._delayValue < 0)) return !1;
            this._delayValue = 0
        }
        var e;
        return this.callback && (e = this.easing ? this.easing(this.progress) : this.progress, this.callback((1 - e) * this.fromValue + e * this.toValue, this)), 1 <= (this.progress += this.speed * t) && (this.progress = 1), !1
    }, pdDOM.Animation.prototype._handleStart = function(t) {
        void 0 !== (t = t || (0 < this._queue.length ? this._queue.shift() : {})).delay && (this.delay = pd.toNumber(t.delay, 0)), void 0 !== t.duration && (this.duration = pd.toNumber(t.duration, 1)), void 0 !== t.easing && (this.easing = t.easing), void 0 !== t.getter && (this.getter = t.getter), void 0 !== t.onStart && (this.onStart = t.onStart), void 0 !== t.onComplete && (this.onComplete = t.onComplete), t.callback && "function" == typeof t.callback && (this.callback = t.callback);
        var e = pd.toNumber(t.toValue, this.toValue),
            t = pd.toNumber(t.fromValue, this.fromValue);
        return this.getter && (t = pd.toNumber(this.getter(), t)), this.duration = pd.constrainTo(pd.toNumber(this.duration, 1), .001, 3600), this.speed = 1 / this.duration, this.delay = pd.constrainTo(this.delay, 0, 3600), this._delayValue = this.delay, pd.closeTo(t, e) && pd.closeTo(e, this.toValue) || (this.active ? (this.progress = Math.min(.5, this.progress), this.fromValue = t - this.progress * (e - t), this.toValue = e) : (this.progress = 0, this.fromValue = t, this.toValue = e, pdDOM.getGlobalAnimationQueue().addOrReplace(this.update).start(), this.active = !0, this.onStart && this.onStart(this))), this
    }, pdDOM.Animation.prototype.then = function(t) {
        return t && this._queue.push(t), this
    }, pdDOM.Animation.prototype.start = function(t) {
        return this._handleStart(t), this
    }, pdDOM.Animation.prototype.cancel = function() {
        return this.active = !1, pdDOM.getGlobalAnimationQueue().remove(this.update), this.onComplete && this.onComplete(this), this
    }, pdDOM.Transition = function(t) {
        return t = t || {}, this.target = t.target, this.property = t.property || "", this.type = pd.toInteger(t.type, -1), this.easing = t.easing && "function" == typeof t.easing ? t.easing : null, this.mapping = pd.isArray(t.mapping) ? t.mapping : null, this.interpolator = t.interpolator || null, this.isMethod = this.target && "function" == typeof this.target[this.property], this._cachedTransform = [0, 0, 0, 0, 0, 0, 0, 0, 0], this._cachedTransform.active = !1, this.interpolator || this.determineType(this.type, t.from, t.to), t = null, this
    };
    var v = pdDOM.Transition;
    pdDOM.Transition.VALUE = 0, pdDOM.Transition.VECTOR = 1, pdDOM.Transition.COLOR = 2, pdDOM.Transition.prototype.determineType = function(t, e, r) {
        if (t < 0 && pd.isArray(r)) {
            if (!pd.isArray(e)) throw new Error("From and to values must be of the same type and length.");
            3 < r.length && 3 < e.length ? t = v.COLOR : 2 < r.length && 2 < e.length && (t = v.VECTOR)
        }
        switch (t) {
            default:
                case v.VALUE:
                this.interpolator = new y(e, r),
            this.type = v.VALUE;
            break;
            case v.VECTOR:
                    this.interpolator = new g(e, r),
                this.type = t;
                break;
            case v.COLOR:
                    this.interpolator = new m(e, r),
                this.type = t
        }
        return this
    }, pdDOM.Transition.prototype.update = function(t) {
        var e = this.interpolator;
        return !!e && (this.easing && (t = this.easing(t)), this.mapping && (t = pd.mapTo(t, 0, 1, this.mapping[0], this.mapping[1])), this.isMethod ? this.target[this.property](e.interpolate(t)) : this.target[this.property] = e.interpolate(t), !0)
    }, pdDOM.AnimationSequence = function(t) {
        (t = t || {}).easing = t.easing || pd.Easing.linear, pdDOM.Animation.call(this, null, t), this.host = t.host || null, this.processOnDraw = pd.toBoolean(t.processOnDraw, !1), this.transitionSequence = t.transitions || [], this.activeStep = null, this._onFullyComplete = this.onComplete, this.onComplete = null
    }, pdDOM.AnimationSequence.prototype = Object.create(pdDOM.Animation.prototype), pdDOM.AnimationSequence.prototype.constructor = pdDOM.AnimationSequence, pdDOM.AnimationSequence.prototype._nextStep = function() {
        var t = null;
        return 0 < this.transitionSequence.length && (t = this.transitionSequence.shift()).duration < 0 && (t.callback && t.callback(this, this.host), t = this._nextStep()), t
    }, pdDOM.AnimationSequence.prototype._processPropertyChanges = function(t, e) {
        var r = !1;
        if (t && t instanceof Object && e && e instanceof Object)
            for (var n in e) t.hasOwnProperty(n) && e.hasOwnProperty(n) && (t[n] = e[n], r = !0);
        return r
    }, pdDOM.AnimationSequence.prototype._handleProgress = function(t, e) {
        e.activeStep && !e.activeStep.paused && (e.processOnDraw || e.process(), gl.update())
    }, pdDOM.AnimationSequence.prototype._handleComplete = function(t) {
        if (t.checkNextStep = !0, !t.processOnDraw || t.activeStep && t.activeStep.paused) {
            if (t.activeStep = t._nextStep(), t.active = t.checkNextStep = !1, !t.activeStep) return t._onFullyComplete && t._onFullyComplete(t), !0;
            t._handleStart({
                duration: t.activeStep.duration,
                fromValue: 0,
                toValue: 1
            })
        } else t.active = 0 < t.transitionSequence.length;
        return !t.active
    }, pdDOM.AnimationSequence.prototype.addTransition = function(t, e) {
        var r = [];
        if (t = Math.max(.017, pd.toNumber(t, 1)), 1 < arguments.length)
            for (var n = 1; n < arguments.length; ++n)
                if (e = arguments[n], pd.isArray(e))
                    for (var i = 0; i < e.length; ++i) e[i].update && (e[i].target || (e[i].target = this.host), r.push(e[i]));
                else e.update && (e.target || (e.target = this.host), r.push(e));
        return this.transitionSequence.push({
            transitions: r,
            duration: t
        }), this
    }, pdDOM.AnimationSequence.prototype.addCallback = function(t) {
        return t && this.transitionSequence.push({
            callback: t,
            duration: -1
        }), this
    }, pdDOM.AnimationSequence.prototype.addPause = function(t) {
        return 0 < (t = pd.toNumber(t, 1)) && this.transitionSequence.push({
            transitions: [],
            duration: t,
            paused: !0
        }), this
    }, pdDOM.AnimationSequence.prototype.addChanges = function(t, e) {
        var r = this;
        return 1 == arguments.length && (e = t, t = this.host), t && t instanceof Object && e && e instanceof Object && this.addCallback(function() {
            r._processPropertyChanges(t, e) && gl.update()
        }), this
    }, pdDOM.AnimationSequence.prototype.process = function() {
        if (this.activeStep && !this.activeStep.paused && 0 < this.activeStep.duration) {
            var t = this.progress;
            this.easing && (t = this.easing(t));
            for (var e = this.activeStep.transitions, r = 0, n = e.length; r < n; ++r) e[r].update(t)
        }
        return this.checkNextStep && (this.activeStep = this._nextStep(), this.active = this.checkNextStep = !1, this.activeStep ? this._handleStart({
            duration: this.activeStep.duration,
            fromValue: 0,
            toValue: 1
        }) : this.cancel()), this
    }, pdDOM.AnimationSequence.prototype.start = function() {
        return 0 < this.transitionSequence.length && (!this.activeStep || .999 <= this.progress) && (this.activeStep = this._nextStep()), this.activeStep && 0 < this.activeStep.duration && (this.checkNextStep = !1, this._handleStart({
            callback: this._handleProgress,
            onComplete: this._handleComplete,
            duration: this.activeStep.duration,
            easing: pd.Easing.linear,
            fromValue: 0,
            toValue: 1
        })), this
    }, pdDOM.AnimateNode = function(t) {
        if (!(t instanceof pd3D.Node)) throw new TypeError("Can only animate a pd3D.Node object.");
        this.node = t, this.transform = t.transformMatrix = new pd3D.Transform, this.animation = new pdDOM.AnimationSequence({
            host: this
        });
        var r = [0, 0, 0],
            n = [0, 0, 0],
            i = [1, 1, 1];
        Object.defineProperty(this, "translation", {
            get: function() {
                return r
            },
            set: function(t) {
                var e;
                pd.isArray(t) && (e = gl.animationQueue.frameCount(), r.frameIndex != e && (r.frameIndex = e, r[0] = 0, r[1] = 0, r[2] = 0), r[0] += +t[0] || 0, r[1] += +t[1] || 0, r[2] += +t[2] || 0)
            }
        }), Object.defineProperty(this, "rotation", {
            get: function() {
                return n
            },
            set: function(t) {
                var e;
                pd.isArray(t) && (e = gl.animationQueue.frameCount(), n.frameIndex != e && (n.frameIndex = e, n[0] = 0, n[1] = 0, n[2] = 0), n[0] += +t[0] || 0, n[1] += +t[1] || 0, n[2] += +t[2] || 0)
            }
        }), Object.defineProperty(this, "scale", {
            get: function() {
                return i
            },
            set: function(t) {
                var e;
                pd.isArray(t) && (e = gl.animationQueue.frameCount(), i.frameIndex != e && (i.frameIndex = e, i[0] = 1, i[1] = 1, i[2] = 1), i[0] *= +t[0] || 0, i[1] *= +t[1] || 0, i[2] *= +t[2] || 0)
            }
        }), this.clearDynamicTransform = function() {
            return r[0] = r[1] = r[2] = 0, n[0] = n[1] = n[2] = 0, i[0] = i[1] = i[2] = 1, this
        }, t.callbackOnDraw = function() {
            this.animation && this.animation.active && this.animation.process(), this.transform.addTranslation(this.translation), this.transform.addRotation(this.rotation), this.transform.addScale(this.scale)
        }, this.remove = function() {
            this.node.transformMatrix = null, this.node.callbackOnDraw = null
        }
    }, pdDOM.localStorage = null;
    try {
        pdDOM.localStorage = window.localStorage
    } catch (t) {}
    pdDOM.localStorage || (pdDOM.localStorage = {
        getItem: function(t) {
            return t && this.hasOwnProperty(t) ? unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(t).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1")) : null
        },
        key: function(t) {
            return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[t])
        },
        setItem: function(t, e) {
            t && (document.cookie = escape(t) + "=" + escape(e) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/", this.length = document.cookie.match(/\=/g).length)
        },
        length: 0,
        removeItem: function(t) {
            t && this.hasOwnProperty(t) && (document.cookie = escape(t) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/", this.length--)
        },
        hasOwnProperty: function(t) {
            return new RegExp("(?:^|;\\s*)" + escape(t).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie)
        }
    }, pdDOM.localStorage.length = (document.cookie.match(/\=/g) || pdDOM.localStorage).length);
    var D = !0;
    pdDOM.setLocalStorageItem = function(t, e) {
        var r = pdDOM.localStorage;
        if (r && t && t.length) try {
            r.setItem(t, e)
        } catch (t) {
            D && (alert("ERROR - Unable to store value:\n" + t), D = !1)
        }
    }, pdDOM.getLocalStorageItem = function(t) {
        return t && t.length ? pdDOM.localStorage.getItem(t) : null
    }, pdDOM.removeLocalStorageItems = function(t) {
        if (pd.isArray(t)) {
            for (var e = pdDOM.localStorage, r = 0, n = t.length; r < n; ++r) e.removeItem(t[r]);
            return !0
        }
        return !1
    }, pdDOM.fromXML = function(t) {
        var e, r, n, i, a = {};
        if (1 == t.nodeType) {
            if (0 < t.attributes.length) {
                a["@attributes"] = {};
                for (var o = 0; o < t.attributes.length; ++o) {
                    var s = t.attributes.item(o);
                    a["@attributes"][s.nodeName] = s.nodeValue
                }
            }
        } else 3 == t.nodeType && (a = t.nodeValue.trim());
        if (t.hasChildNodes())
            if (1 === t.childNodes.length && 3 === t.childNodes[0].nodeType) a = t.childNodes[0].nodeValue.trim();
            else
                for (var d = 0; d < t.childNodes.length; ++d) void 0 === a[i = (n = t.childNodes.item(d)).nodeName] ? "" !== (e = pdDOM.fromXML(n)) && (a[i] = e) : (void 0 === a[i].push && (r = a[i], a[i] = [], a[i].push(r)), "" !== (e = pdDOM.fromXML(n)) && a[i].push(e));
        if (!pd.isArray(a) && "object" == typeof a) {
            var h = Object.keys(a);
            if (1 == h.length && "#text" == h[0]) return a["#text"];
            if (0 === h.length) return null
        }
        return a
    }, pdDOM.toXML = function(t, e) {
        var d = document.implementation.createDocument("", "", null);
        d || (d = (new DOMParser).parseFromString("<dummy />", "text/xml")).removeChild(d.documentElement), e = e || "jsonXML";
        e = d.createElement(e);
        return function t(e, r) {
            var n, i, a;
            if (r.constructor === String || r.constructor === Number || r.constructor === Boolean) {
                if (e.appendChild(d.createTextNode(r.toString())), r === r.valueOf()) return
            } else r.constructor === Date && e.appendChild(d.createTextNode(r.toGMTString()));
            for (a in r)
                if (!isFinite(a))
                    if (n = r[a], "keyValue" === a) null !== n && !0 !== n && e.appendChild(d.createTextNode(n.constructor === Date ? n.toGMTString() : String(n)));
                    else if ("@attributes" === a)
                for (var o in n) e.setAttribute(o, n[o]);
            else if ("@" === a.charAt(0)) e.setAttribute(a.slice(1), n);
            else if (n.constructor === Array)
                for (var s = 0; s < n.length; ++s) t(i = d.createElement(a), n[s]), e.appendChild(i);
            else i = d.createElement(a), n instanceof Object ? t(i, n) : null !== n && !0 !== n && i.appendChild(d.createTextNode(n.toString())), e.appendChild(i)
        }(e, t), d.appendChild(e), d
    }
}(),
function() {
    var h = {
        true: !0,
        false: !(pdDOM.jsonToURI = function t(e) {
            function r(t) {
                return /[^\w-.]/.test(t) ? t.replace(/[^\w-.]/g, function(t) {
                    return "$" === t ? "!" : (t = t.charCodeAt(0)) < 256 ? "*" + ("00" + t.toString(16)).slice(-2) : "**" + ("0000" + t.toString(16)).slice(-4)
                }) : t
            }
            var n, i;
            switch (typeof e) {
                case "number":
                    return isFinite(e) ? "~" + pd.toStringWithPrecisionRange(e, 0, 6) : "~null";
                case "boolean":
                    return "~" + e;
                case "string":
                    return "~'" + r(e);
                case "object":
                    if (!e) return "~null";
                    if (n = [], pd.isArray(e)) {
                        for (var a = 0; a < e.length; ++a) n[a] = t(e[a]) || "~null";
                        return "~(" + (n.join("") || "~") + ")"
                    }
                    for (var o in e) {
                        !e.hasOwnProperty(o) || (i = t(e[o])) && n.push(r(o) + i)
                    }
                    return "~(" + n.join("~") + ")";
                default:
                    return
            }
        }),
        null: null
    };
    pdDOM.uriToJSON = function(i) {
        if (!i) return i;
        i = i.replace(/%27/g, "'");
        var a = 0,
            o = i.length;

        function s(t) {
            if (i.charAt(a) !== t) throw new Error("bad JSURL syntax: expected " + t + ", got " + (i && i.charAt(a)));
            a++
        }

        function d() {
            for (var t, e = a, r = ""; a < o && "~" !== (t = i.charAt(a)) && ")" !== t;) switch (t) {
                case "*":
                    e < a && (r += i.substring(e, a)), e = "*" === i.charAt(a + 1) ? (r += String.fromCharCode(parseInt(i.substring(a + 2, a + 6), 16)), a += 6) : (r += String.fromCharCode(parseInt(i.substring(a + 1, a + 3), 16)), a += 3);
                    break;
                case "!":
                    e < a && (r += i.substring(e, a)), r += "$", e = ++a;
                    break;
                default:
                    a++
            }
            return r + i.substring(e, a)
        }
        return function t() {
            var e, r;
            switch (s("~"), r = i.charAt(a)) {
                case "(":
                    if (a++, "~" === i.charAt(a))
                        if (e = [], ")" === i.charAt(a + 1)) a++;
                        else
                            for (; e.push(t()), "~" === i.charAt(a););
                    else if (e = {}, ")" !== i.charAt(a))
                        do {} while (e[d()] = t(), "~" === i.charAt(a) && ++a);
                    s(")");
                    break;
                case "'":
                    a++, e = d();
                    break;
                default:
                    for (n = a++; a < o && /[^)~]/.test(i.charAt(a));) a++;
                    var n = i.substring(n, a);
                    if (/[\d\-]/.test(r)) e = parseFloat(n);
                    else if (void 0 === (e = h[n])) throw new Error("bad value keyword: " + n)
            }
            return e
        }()
    }
}(), pdDOM.Interaction = pdDOM.Interaction || {},
    function() {
        var k = !1,
            I = !1,
            P = null,
            E = null,
            _ = 0,
            L = 0,
            e = 3e3,
            x = {
                x: 0,
                y: 0
            },
            M = 0,
            T = 0,
            A = 0,
            R = {},
            B = -1,
            F = -1,
            w = {
                x: 0,
                y: 0
            },
            O = {
                x: 0,
                y: 0
            },
            V = {
                x: 0,
                y: 0
            },
            z = 1250;

        function o(t) {
            var e = null;
            return t.target ? e = t.target : t.srcElement && (e = t.srcElement), e && 3 == e.nodeType && (e = e.parentNode), e
        }

        function Y(t) {
            var e, r, n = pd.toNumber(t.pageX, 0),
                i = pd.toNumber(t.pageY, 0),
                a = o(t);
            return a && a.getBoundingClientRect && (e = 1 / pdDOM.pageScale, n -= (r = a.getBoundingClientRect()).left * e, i -= r.top * e), {
                target: a,
                button: pd.toInteger(t.button, 0),
                identifier: pd.toNumber(t.identifier, t.pointerId),
                pageX: t.pageX,
                pageY: t.pageY,
                x: n,
                y: i
            }
        }

        function U() {
            for (var t in L = _ = 0, E = null, F = B = -1, R) R.hasOwnProperty(t) && delete R[t]
        }

        function t(t) {
            "touch" == t.pointerType.toLowerCase() && (_ = Math.max(0, _ - 1), L = t.timeStamp, _ <= 0 && U())
        }

        function q(t) {
            return (t = pd.toNumber(t, 0)) < .001 ? t = 3 + 3 * pdDOM.devicePixelRatio : t <= .999 && (t *= 3 + 3 * pdDOM.devicePixelRatio), V.x > t || V.y > t
        }
        window.PointerEvent && (k = !0, document.addEventListener("pointerdown", function(t) {
            "touch" == t.pointerType.toLowerCase() && (t.isPrimary && t.timeStamp - L > e && U(), _ = Math.min(10, _ + 1), L = t.timeStamp)
        }), document.addEventListener("pointercancel", t), document.addEventListener("pointerup", t)), ("ontouchstart" in window || "ontouchstart" in document.documentElement || window.DocumentTouch && document instanceof DocumentTouch) && (I = !0), pdDOM.Interaction.hasMoved = q, pdDOM.Interaction.activeTouchList = R, Object.defineProperty(pdDOM.Interaction, "hasPointerEvents", {
            get: function() {
                return k
            }
        }), Object.defineProperty(pdDOM.Interaction, "hasTouchEvents", {
            get: function() {
                return I
            }
        }), Object.defineProperty(pdDOM.Interaction, "activeTouchCount", {
            get: function() {
                return _
            }
        }), Object.defineProperty(pdDOM.Interaction, "activeTouchTimeStamp", {
            get: function() {
                return L
            },
            set: function(t) {
                L = +t
            }
        }), Object.defineProperty(pdDOM.Interaction, "activeTouchTimeOutInMS", {
            get: function() {
                return e
            },
            set: function(t) {
                e = Math.max(500, +t)
            }
        }), Object.defineProperty(pdDOM.Interaction, "activeTouchElement", {
            get: function() {
                return E
            }
        }), pdDOM.InteractionEvent = function(t) {
            this.event = t, this.isTouchEvent = !1, this.touchCount = _, this.timeStamp = t.timeStamp, this.button = t.button, this.ctrlKey = t.ctrlKey, this.shiftKey = t.shiftKey, this.metaKey = t.metaKey, this.altKey = t.altKey, this.scale = 1, this.rotation = 0, this.dragX = 0, this.dragY = 0, this.x = pd.toNumber(t.pageX, 0), this.y = pd.toNumber(t.pageY, 0), this.primaryX = this.x, this.primaryY = this.y
        }, pdDOM.InteractionEvent.prototype.hasMoved = q, pdDOM.InteractionEvent.prototype.getDragStartPosX = function() {
            return w.x
        }, pdDOM.InteractionEvent.prototype.getDragStartPosY = function() {
            return w.x
        }, pdDOM.InteractionEvent.prototype.getDragDistanceX = function() {
            return O.x
        }, pdDOM.InteractionEvent.prototype.getDragDistanceY = function() {
            return O.y
        }, pdDOM.InteractionEvent.prototype.preventDefault = function() {
            this.event && this.event.preventDefault && this.event.preventDefault()
        }, pdDOM.InteractionEvent.prototype.stopPropagation = function() {
            this.event && this.event.stopPropagation && this.event.stopPropagation()
        }, pdDOM.InteractionEvent.prototype.stopImmediatePropagation = function() {
            this.event && this.event.stopImmediatePropagation && this.event.stopImmediatePropagation()
        }, pdDOM.Interaction.createEvent = function(t, e) {
            var r = !1,
                n = !1,
                i = !1,
                a = P,
                o = 0,
                s = 0,
                d = new pdDOM.InteractionEvent(t);
            if (t.type && 0 < t.type.length)
                if (k && "p" == t.type.charAt(0)) {
                    if (r = t.pointerType && "touch" == t.pointerType) {
                        var h, l = 0;
                        for (h in d.isTouchEvent = !0, R[t.pointerId] && (a = R[t.pointerId]), R) {
                            R.hasOwnProperty(h) && (u = R[h]) && (o += u.pageX, s += u.pageY, l++)
                        }
                        0 < l && (i = !0, o /= l, s /= l, 0 <= B && (p = R[B]) && (d.primaryX = p.pageX, d.primaryY = p.pageY, 1 < l && 0 < F && (f = R[F]) && (m = f.pageX - p.pageX, g = f.pageY - p.pageY, M = Math.sqrt(m * m + g * g), d.rotation = -Math.atan2(g, m) * pd.Const.RAD2DEG, n = !0)))
                    }
                } else if (I && "t" == t.type.charAt(0)) {
                r = d.isTouchEvent = !0;
                var c = t.touches || t.targetTouches;
                if ((!c || c.length < 1) && (c = t.changedTouches || t.originalEvent.changedTouches, _ < 1 && (_ = c.length)), _ = c ? c.length : 0, d.touchCount = _, d.button = _ - 1, c && 0 < c.length) {
                    for (var u, p, f, m, g, y = -1, v = -1, l = 0, D = 0, b = c.length; D < b; ++D) u = c[D], B === u.identifier && (y = D), F === u.identifier && (v = D), o += u.pageX, s += u.pageY, l++;
                    0 < l && (i = !0, o /= l, s /= l, d.button < 0 && (d.button = c.length - 1), 0 <= y && (p = c[y]) && (d.primaryX = p.pageX, d.primaryY = p.pageY, 0 <= v && (f = c[v]) && (m = f.pageX - p.pageX, g = f.pageY - p.pageY, M = Math.sqrt(m * m + g * g), d.rotation = -Math.atan2(g, m) * pd.Const.RAD2DEG, n = !0))), u = c[Math.max(0, y)], d.x = u.pageX, d.y = u.pageY
                }
            }
            switch (e && e.getBoundingClientRect && (m = 1 / pdDOM.pageScale, (e = e.getBoundingClientRect()).left && (o -= e.left * m, d.primaryX -= e.left * m, d.x -= e.left * m), e.top && (s -= e.top * m, d.primaryY -= e.top * m, d.y -= e.top * m)), t.type.toLowerCase()) {
                case "pointerdown":
                    if (!r) {
                        w.x = d.x, w.y = d.y, O.x = 0, O.y = 0, V.x = 0, V.y = 0;
                        break
                    }
                    d.button = _;
                case "mousedown":
                case "touchstart":
                    V.x = 0, V.y = 0, O.x = 0, O.y = 0, w.x = d.x, w.y = d.y, n && (T = M, A = d.rotation, d.rotation = 0);
                    break;
                case "pointermove":
                    r ? d.button = _ - 1 : d.button < 0 && t.button < 0 && (0 < t.buttons ? 1 & t.buttons ? d.button = 0 : 4 & t.buttons ? d.button = 1 : 2 & t.buttons ? d.button = 2 : 8 & t.buttons ? d.button = 3 : 16 & t.buttons ? d.button = 4 : 32 & t.buttons && (d.button = 5) : a && (d.button = a.button));
                case "touchmove":
                case "mousemove":
                    r ? (L = t.timeStamp, 0 <= d.button && i ? (d.dragX = o - x.x, d.dragY = s - x.y) : a && (d.dragX = d.x - a.x, d.dragY = d.y - a.y), 0 < d.button && n && (n = d.rotation, d.scale = 0 < T ? M / T : 1, T = M, d.rotation -= A, A = n), t.preventDefault()) : a && (d.dragX = d.x - a.x, d.dragY = d.y - a.y), (!r || Math.abs(d.dragX) < 50 && Math.abs(d.dragY) < 50) && (V.x += Math.abs(d.dragX), V.y += Math.abs(d.dragY), O.x += d.dragX, O.y += d.dragY);
                    break;
                case "touchend":
                case "touchcancel":
                case "pointerup":
                case "pointercancel":
                    r && d.button < 0 && (d.button = Math.max(0, _ - 1));
                    break;
                case "mouseup":
                    0 <= d.button && (_ = 0);
                    break;
                case "wheel":
                case "mousewheel":
                case "dommousescroll":
                    d.delta = pd.sign(pdDOM.getScrollIncrement(t));
                    break;
                case "keydown":
                    d.delta = pdDOM.getKbdIncrement(t), 0 != d.delta && (d.delta = pd.sign(d.delta))
            }
            return r && i && (x.x = o, x.y = s), a && (a.x = d.x, a.y = d.y), d
        }, pdDOM.Interaction.makeInteractive = function(h, l) {
            l = l || {}, h.style.touchAction = "none", h.classList.add("no-select", "no-touch");
            var o = 0,
                s = 0,
                d = 0,
                r = 0,
                c = 0,
                u = 0,
                p = pdDOM.isFirefox && pdDOM.isWindows10 ? 0 : 1,
                f = l.dragElement || document;
            l.simple = pd.toBoolean(l.simple, !1) && !pdDOM.isWindows10;
            var e = null,
                m = null;

            function n() {
                m = null, l.onlongpress && l.onlongpress(e)
            }

            function g(t) {
                m && (clearTimeout(m), m = null), m = setTimeout(n, z), e = t
            }

            function y() {
                m && (clearTimeout(m), m = null)
            }

            function v(t, e) {
                setTimeout(function() {
                    t(e)
                }, 25)
            }

            function i(t) {
                !P && l.onmove && (t.preventDefault(), t = pdDOM.Interaction.createEvent(t, h), l.onmove(t))
            }

            function t(t) {
                var e, r = !1;
                t.preventDefault(), t.timeStamp || (t.timeStamp = Date.now()), o = Date.now(), null == E && (E = h, L = t.timeStamp, l.onmove && h.removeEventListener("pointermove", i), h.addEventListener("pointermove", b), h.addEventListener("pointercancel", A), h.addEventListener("pointerup", A), r = !0), t.pointerType && "touch" == t.pointerType ? (R[t.pointerId] = Y(t), B < 0 && (B = +t.pointerId), B != t.pointerId && (F < 0 || F == B) && (F = +t.pointerId)) : P = Y(t), r && (l.onpress && (e = pdDOM.Interaction.createEvent(t, h), l.onpress(e)), l.onlongpress && g(e = e || pdDOM.Interaction.createEvent(t, h)), h.setPointerCapture && t.pointerId >= p && h.setPointerCapture(t.pointerId))
            }

            function a(t) {
                var e;
                t.preventDefault(), t.timeStamp || (t.timeStamp = Date.now()), d = Date.now(), l.onmove && h.removeEventListener("mousemove", i), f.addEventListener("mousemove", x), f.addEventListener("mouseup", w), P = Y(t), l.onpress && (e = pdDOM.Interaction.createEvent(t, h), l.onpress(e)), l.onlongpress && g(e = e || pdDOM.Interaction.createEvent(t, h))
            }

            function D(t) {
                var e = !1;
                l.allowDefaultOnTouch || "boolean" == typeof t.cancelable && !t.cancelable || t.preventDefault(), t.timeStamp || (t.timeStamp = Date.now()), c = Date.now(), null == E && (E = h, f.addEventListener("touchmove", M), f.addEventListener("touchcancel", O), f.addEventListener("touchend", O), e = !0);
                var r = t.touches || t.targetTouches;
                _ = r ? r.length : Math.min(10, _ + 1), L = t.timeStamp;
                var n, i, a, o = t.changedTouches;
                if (o && 0 < o.length)
                    for (var s = 0, d = o.length; s < d; ++s) R[o[s].identifier] = Y(o[s]);
                (B < 0 || F < 0) && (n = t, i = B, r = F, i = pd.toNumber(i, -1), r = pd.toNumber(r, -1), (n = n.touches || n.targetTouches) && 0 < n.length && (1 < n.length && i == (r = n[1].identifier) && (i = -1), i < 0 && (i = n[0].identifier)), B = (r = [i, r])[0], F = r[1]), e && (l.onpress && (a = pdDOM.Interaction.createEvent(t, h), l.onpress(a)), l.onlongpress && g(a = a || pdDOM.Interaction.createEvent(t, h)))
            }

            function b(t) {
                l.allowDefaultOnTouch && t.pointerType && "touch" == t.pointerType || t.preventDefault();
                var e = R[t.pointerId];
                e && (e.pageX = t.pageX, e.pageY = t.pageY), q() && (o = d = 0, m && y()), l.ondrag && (t = pdDOM.Interaction.createEvent(t, h), Math.abs(t.dragX) < 50 && Math.abs(t.dragY) < 50 && l.ondrag(t))
            }

            function x(t) {
                t.preventDefault(), l.ondrag && (t = pdDOM.Interaction.createEvent(t, h), l.ondrag(t)), q() && (d = 0, m && y())
            }

            function M(t) {
                l.allowDefaultOnTouch || "boolean" == typeof t.cancelable && !t.cancelable || t.preventDefault(), q() && (c = 0, m && y()), l.ondrag && (t = pdDOM.Interaction.createEvent(t, h), Math.abs(t.dragX) < 50 && Math.abs(t.dragY) < 50 && l.ondrag(t))
            }

            function T() {
                h.removeEventListener("pointermove", b), h.removeEventListener("pointercancel", A), h.removeEventListener("pointerup", A), l.onmove && h.addEventListener("pointermove", i)
            }

            function A(t) {
                var e, r = !1,
                    n = Date.now();
                if (l.allowDefaultOnTouch && t.pointerType && "touch" == t.pointerType || t.preventDefault(), t.timeStamp || (t.timeStamp = n), h.releasePointerCapture && t.pointerId >= p) try {
                    h.releasePointerCapture(t.pointerId)
                } catch (t) {}
                if (m && y(), e = pdDOM.Interaction.createEvent(t, h), 0 < o && z < n - o && (e.longPress = !0), t.pointerType && "touch" == t.pointerType) {
                    delete R[t.pointerId], B == t.pointerId ? B = F = -1 : F == t.pointerId && (F = -1);
                    var i, a = 0;
                    for (i in R) R.hasOwnProperty(i) && a++;
                    a <= 0 && (T(), r = !0)
                } else P = null, T(), U(), r = !0;
                r && (l.onlongclick && e.longPress && v(l.onlongclick, e), l.onrelease ? l.onrelease(e) : l.ondoubletap && 0 < o && o - s < 400 && (e.isTouchEvent || 0 < e.button) && v(l.ondoubletap, e), s = o, 0 < d && (d = 0), o = 0)
            }

            function w(t) {
                var e = Date.now();
                t.preventDefault(), t.timeStamp || (t.timeStamp = e), m && y(), t = pdDOM.Interaction.createEvent(t, h), 0 < d && z < e - d && (t.longPress = !0), f.removeEventListener("mousemove", x), f.removeEventListener("mouseup", w), l.onmove && h.addEventListener("mousemove", i), l.onrelease && l.onrelease(t), l.onlongclick && t.longPress ? v(l.onlongclick, t) : l.ondoubletap && 0 < d && d - r < 400 && 0 < t.button && v(l.ondoubletap, t), r = d, d = 0, P = null
            }

            function O(t) {
                var e, r = !1,
                    n = Date.now();
                l.allowDefaultOnTouch || "boolean" == typeof t.cancelable && !t.cancelable || t.preventDefault(), t.timeStamp || (t.timeStamp = n), m && y(), e = pdDOM.Interaction.createEvent(t, h), 0 < c && z < n - c && (e.longPress = !0);
                var i = t.touches || t.targetTouches;
                _ = i ? i.length : 0, L = t.timeStamp;
                var a = t.changedTouches;
                if (a && 0 < a.length)
                    for (var o = 0, s = a.length; o < s; ++o) {
                        var d = a[o].identifier;
                        delete R[d], B == d ? B = F = -1 : F == d && (F = -1)
                    }
                _ <= 0 && (f.removeEventListener("touchmove", M), f.removeEventListener("touchcancel", O), f.removeEventListener("touchend", O), r = !0, U()), r && (0 < c && z < n - c && (e.longPress = !0), l.onrelease && l.onrelease(e), e.longPress && l.onlongclick ? v(l.onlongclick, e) : l.ondoubletap && 0 < c && c - u < 400 && v(l.ondoubletap, e), u = c, c = 0)
            }

            function V(t) {
                l.ondoubletap && (t.preventDefault(), t = pdDOM.Interaction.createEvent(t, h), l.ondoubletap(t))
            }

            function C(t) {
                var e;
                !l.onscroll || (e = pdDOM.Interaction.createEvent(t, h)).delta && (l.onscroll(e), t.preventDefault())
            }

            function S(t) {
                l.onkeydown ? l.onkeydown(t) : C(t)
            }

            function N(t) {
                l.onkeyup && l.onkeyup(t)
            }
            return k && !l.simple ? (h.addEventListener("pointerdown", t), l.onmove && h.addEventListener("pointermove", i)) : (h.addEventListener("mousedown", a), l.onmove && h.addEventListener("mousemove", i), I && h.addEventListener("touchstart", D)), l.ondoubletap && h.addEventListener("dblclick", V), l.onscroll && (h.addEventListener("DOMMouseScroll", C), h.addEventListener("mousewheel", C), h.addEventListener("wheel", C)), (l.onkeydown || l.onscroll) && h.addEventListener("keydown", S), l.onkeyup && h.addEventListener("keyup", N), this.setCallback = function(t, e) {
                if (!l[t]) switch (t) {
                    case "onmove":
                        h.addEventListener("pointermove", i), h.addEventListener("mousemove", i);
                        break;
                    case "ondoubletap":
                        h.addEventListener("dblclick", V);
                        break;
                    case "onscroll":
                        h.addEventListener("DOMMouseScroll", C), h.addEventListener("mousewheel", C), h.addEventListener("wheel", C), l.onkeydown || h.addEventListener("keydown", S);
                        break;
                    case "keydown":
                        l.onscroll || h.addEventListener("keydown", S);
                        break;
                    case "keyup":
                        h.addEventListener("keyup", N)
                }
                l[t] = e
            }, this.dispose = function() {
                k && !l.simple ? (h.removeEventListener("pointerdown", t), l.onmove && h.removeEventListener("pointermove", i)) : (h.removeEventListener("mousedown", a), l.onmove && h.addEventListener("mousemove", i)), I && h.removeEventListener("touchstart", D), l.ondoubletap && h.addEventListener("dblclick", V), l.onscroll && (h.removeEventListener("DOMMouseScroll", C), h.removeEventListener("mousewheel", C), h.removeEventListener("wheel", C)), (l.onkeydown || l.onscroll) && h.removeEventListener("keydown", S), l.onkeyup && h.removeEventListener("keyup", N)
            }, this
        }
    }(),
    function() {
        function M(t) {
            return ko.isObservable(t) ? +t() : +t
        }

        function T(t, e) {
            t = ko.isObservable(t) ? t() : t;
            return pd.toNumber(t, e)
        }

        function A(t) {
            return ko.isObservable(t) ? t() : t
        }

        function w(t, e, r, n, i, a, o, s, d) {
            e && t && i < a && (t.shiftKey ? o = pd.toNumber(d, 50 * o) : t.ctrlKey || t.metaKey || (o = pd.toNumber(s, 5 * o)), a = pd.constrainTo(parseFloat(n()) + e * o, i, a), n(pd.snapTo(a, e * o)))
        }
        ko.loadExternalTemplates = function(e) {
            var r = 'script[src][type="text/html"]:not([loaded])',
                t = $(r);
            ko.utils.arrayForEach(t, function(t) {
                t = $(t);
                t.load(t.attr("src"), function() {
                    this.attr("loaded", !0), $(r).length || e()
                }.bind(t))
            })
        }, ko.observableArray.fn.refresh = function(t) {
            var e = this.indexOf(t);
            0 <= e && (this.splice(e, 1), this.splice(e, 0, t))
        }, ko.extenders.paged = function(o, t) {
            var s = ko.observable(1),
                d = ko.observable(pd.toInteger(t, 5)),
                h = ko.observable(!1),
                l = ko.observable(!1),
                c = ko.observable(1),
                t = ko.computed(function() {
                    var t = s(),
                        e = o().length,
                        r = Math.max(1, d()),
                        n = Math.max(1, Math.ceil(e / r)),
                        i = pd.constrainTo((t - 1) * r, 0, e - r),
                        a = pd.constrainTo(i + r, 0, e);
                    return c(n), h(i < e - r), l(0 < i), n < t && s(n), o().slice(i, a)
                });
            return t.totalPages = c, t.currentPage = s, t.itemsPerPage = d, t.nextEnabled = h, t.prevEnabled = l, t.next = function() {
                h() && (h(!1), s(s() + 1))
            }, t.prev = function() {
                l() && (l(!1), s(s() - 1))
            }, t
        }, ko.extenders.fixedPrecision = function(n, i) {
            var t = ko.pureComputed({
                read: n,
                write: function(t) {
                    var e = n(),
                        r = isNaN(t) ? 0 : parseFloat(t),
                        r = pd.toStringWithPrecision(r, i);
                    r !== e ? n(r) : t !== e && n.notifySubscribers(r)
                }
            }).extend({
                notify: "always"
            });
            return t(n()), t
        }, ko.bindingHandlers.href = {
            update: function(t, e) {
                ko.bindingHandlers.attr.update(t, function() {
                    return {
                        href: e()
                    }
                })
            }
        }, ko.bindingHandlers.src = {
            update: function(t, e) {
                ko.bindingHandlers.attr.update(t, function() {
                    return {
                        src: e()
                    }
                })
            }
        }, ko.bindingHandlers.hidden = {
            update: function(t, e) {
                var r = ko.utils.unwrapObservable(e());
                ko.bindingHandlers.visible.update(t, function() {
                    return !r
                })
            }
        }, ko.bindingHandlers.booleanValue = {
            init: function(t, e) {
                var r = e(),
                    e = ko.computed({
                        read: function() {
                            return r().toString()
                        },
                        write: function(t) {
                            r("true" === t)
                        }
                    });
                ko.applyBindingsToNode(t, {
                    value: e
                })
            }
        }, ko.bindingHandlers.numeric = {
            init: function(t, e, r, n, i) {
                var a = e();
                if (!ko.isWriteableObservable(a)) throw "You must pass a Knockout observable or writeable computed";
                var o = r.get("precisionMax") || 0,
                    s = r.get("precision") || 0,
                    r = ko.computed({
                        disposeWhenNodeIsRemoved: t,
                        read: function() {
                            var t = parseFloat(a()),
                                e = M(o),
                                r = M(s);
                            return r < e ? pd.toStringWithPrecisionRange(t, r, e) : r < 0 ? t.toString() : t.toFixed(r)
                        },
                        write: function(t) {
                            a(parseFloat(t))
                        }
                    });
                "SELECT" == t.nodeName || "INPUT" == t.nodeName ? ko.applyBindingsToNode(t, {
                    value: r
                }, i) : ko.applyBindingsToNode(t, {
                    text: r
                }, i)
            }
        }, ko.bindingHandlers.currencyValue = {
            init: function(t, e) {
                var e = e() || {},
                    n = ko.isObservable(e.value) ? e.value : ko.observable(0),
                    i = ko.unwrap(e.symbol) || "£",
                    e = ko.pureComputed({
                        read: function() {
                            return i + parseFloat(n()).toFixed(2)
                        },
                        write: function(t) {
                            var e = n(),
                                r = parseFloat(t.replace(i, ""));
                            r !== e ? n(r) : t !== e.toString() && n.valueHasMutated()
                        }
                    });
                ko.applyBindingsToNode(t, {
                    value: e
                })
            }
        }, ko.bindingHandlers.angleValue = {
            init: function(t, e) {
                var n = e(),
                    e = ko.pureComputed({
                        read: function() {
                            return pd.toStringWithPrecisionRange(n(), 2, 9) + "°"
                        },
                        write: function(t) {
                            var e = n(),
                                r = parseFloat(t);
                            r !== e ? n(r) : t !== e.toString() && n.valueHasMutated()
                        }
                    });
                ko.applyBindingsToNode(t, {
                    value: e
                })
            }
        }, ko.bindingHandlers.angleText = {
            init: function(t, e) {
                var r = e(),
                    e = ko.pureComputed(function() {
                        var t = r();
                        return isNaN(t) ? "-" : pd.toStringWithPrecisionRange(t, 2, 9) + "°"
                    });
                ko.applyBindingsToNode(t, {
                    text: e
                })
            }
        }, ko.bindingHandlers.timeText = {
            init: function(t, e) {
                var r = e(),
                    e = ko.pureComputed(function() {
                        return pd.DateTime.formatTime(r())
                    });
                ko.applyBindingsToNode(t, {
                    text: e
                })
            }
        }, ko.bindingHandlers.dateText = {
            init: function(t, e) {
                var r = e(),
                    e = ko.pureComputed(function() {
                        return pd.DateTime.formatDate(pd.wrapAt(r(), 0, 365))
                    });
                ko.applyBindingsToNode(t, {
                    text: e
                })
            }
        }, ko.bindingHandlers.toFixed = {
            init: function(t, e, r) {
                var n = e(),
                    i = r.get("precision"),
                    a = r.get("prefix"),
                    o = r.get("suffix");
                ko.isObservable(n) || (s = e() || {}, n = ko.isObservable(s.value) ? s.value : ko.observable(0), i = s.precision), null == i && (i = 2);
                var s = ko.pureComputed(function() {
                    var t = T(n, 0),
                        e = a ? A(a) : "",
                        r = Math.round(M(i));
                    return e += i < 0 ? t.toString() : t.toFixed(r), o && (e += A(o)), e
                });
                ko.applyBindingsToNode(t, {
                    text: s
                })
            }
        }, ko.bindingHandlers.fixedPrecision = {
            init: function(t, e, r) {
                var n = e(),
                    i = r.get("precision");
                ko.isObservable(n) || (a = e() || {}, n = ko.isObservable(a.value) ? a.value : ko.observable(0), i = a.precision), null == i && (i = 2);
                var a = ko.pureComputed(function() {
                    var t = Math.round(M(i));
                    return parseFloat(+n() || 0).toFixed(t)
                });
                ko.applyBindingsToNode(t, {
                    text: a
                })
            }
        }, ko.bindingHandlers.contentEditable = {
            init: function(t, e) {
                var r = e();
                ko.applyBindingsToNode(t, {
                    text: r
                }), t.addEventListener("blur", function() {
                    ko.isWriteableObservable(r) && r(this.textContent.trim())
                }), t.contentEditable = !0
            }
        }, ko.bindingHandlers.clickWithoutFocus = {
            init: function(t, e, r, n, i) {
                var a = $(t);
                ko.utils.registerEventHandler(a, window.PointerEvent ? "pointerdown" : "mousedown touchstart", function(t) {
                    (void 0 !== t.button && t.button <= 0 || 0 == t.which) && t.type && "touchstart" == t.type && a.click(), t.preventDefault()
                }), ko.bindingHandlers.click.init(t, e, r, n, i)
            }
        }, ko.bindingHandlers.repeatButton = {
            init: function(t, e, r, n, i) {
                var a = $(t),
                    o = r.get("interval") || 100,
                    s = r.get("delay") || 400,
                    d = null,
                    h = null;
                ko.utils.registerEventHandler(t, window.PointerEvent ? "pointerdown" : "mousedown touchstart", function(t) {
                    (void 0 !== t.button && t.button <= 0 || 0 == t.which) && (t.type && "touchstart" == t.type && a.click(), h = setTimeout(function() {
                        d = setInterval(function() {
                            a.click()
                        }, M(o))
                    }, M(s))), t.preventDefault()
                }), ko.utils.registerEventHandler(t, "mouseup mouseout touchend touchcancel touchleave pointerup pointerleave", function() {
                    d && (clearInterval(d), d = null), h && (clearTimeout(h), h = null)
                }), ko.bindingHandlers.click.init(t, e, r, n, i)
            }
        }, ko.bindingHandlers.radioButton = {
            init: function(t, e, r) {
                var n = e();
                if (!ko.isWriteableObservable(n)) throw "You must pass a Knockout observable or writeable computed";
                t = (t = $(t)).hasClass("btn") ? t : $(".btn", t), n.shiftKey = !1;
                var i = r();
                t.each(function() {
                    var e = $(this),
                        r = void 0 !== i.radioValue ? i.radioValue : void 0 !== e.attr("data-value") ? e.attr("data-value") : void 0 !== e.attr("value") ? e.attr("value") : e.text();
                    return e.on("click", function(t) {
                        n.shiftKey = t.shiftKey, n(ko.utils.unwrapObservable(r)), e.blur()
                    }), e.blur(), ko.computed({
                        disposeWhenNodeIsRemoved: this,
                        read: function() {
                            var t = n() === ko.utils.unwrapObservable(r);
                            e.toggleClass("btn-info", t).toggleClass("active", t)
                        }
                    })
                })
            }
        }, ko.bindingHandlers.checkButton = {
            init: function(t, e) {
                var r = e();
                if (!ko.isWriteableObservable(r)) throw "You must pass a Knockout observable or writeable computed";
                var n = $(t);

                function i() {
                    var t = !!r();
                    n.toggleClass("active", t), n.hasClass("btn") && n.toggleClass("btn-info", t)
                }
                i(), r.subscribe(i), n.on("click", function() {
                    r(!n.hasClass("active")), n.blur()
                })
            }
        }, ko.bindingHandlers.radioMenuItem = {
            init: function(t, e, r) {
                var n = e();
                if (!ko.isWriteableObservable(n)) throw "You must pass a Knockout observable or writeable computed";
                t = "menuitem" == (t = $(t)).attr("role") ? t : $("a[role=menuitem]", t);
                var i = r();
                t.each(function() {
                    var e = $(this),
                        r = void 0 !== i.radioValue ? i.radioValue : void 0 !== e.attr("data-value") ? e.attr("data-value") : void 0 !== e.attr("value") ? e.attr("value") : e.text();
                    return e.on("click", function() {
                        n(ko.utils.unwrapObservable(r)), e.blur()
                    }), e.blur(), ko.computed({
                        disposeWhenNodeIsRemoved: this,
                        read: function() {
                            var t = n() === ko.utils.unwrapObservable(r);
                            e.toggleClass("active", t), e.find(".icon").toggleClass("icon-radio-unchecked", !t).toggleClass("icon-radio-checked", t)
                        }
                    })
                })
            }
        }, ko.bindingHandlers.checkMenuItem = {
            init: function(t, e) {
                var r = e();
                if (!ko.isWriteableObservable(r)) throw "You must pass a Knockout observable or writeable computed";
                var n = $(t);

                function i() {
                    var t = !!r();
                    n.toggleClass("active", t), n.find(".icon").toggleClass("icon-unchecked", !t).toggleClass("icon-checked", t)
                }
                i(), r.subscribe(i), n.on("click", function() {
                    r(!n.hasClass("active")), n.blur()
                })
            }
        }, ko.bindingHandlers.table = {
            init: function() {
                return {
                    controlsDescendantBindings: !0
                }
            },
            update: function(t, e) {
                var e = ko.utils.unwrapObservable(e()) || [],
                    e = pd.isArray(e) ? {
                        data: e
                    } : e,
                    r = ko.utils.unwrapObservable(e.data),
                    n = ko.utils.unwrapObservable(e.dataClass),
                    i = ko.utils.unwrapObservable(e.header),
                    a = ko.utils.unwrapObservable(e.headerClass),
                    o = [],
                    s = 0,
                    d = 0,
                    h = "",
                    l = "<table>";
                if (i && i.length) {
                    l += "<thead>";
                    for (var c = 0; c < i.length; ++c) {
                        var u = i[c];
                        if (u && u.length) {
                            l += '<tr class="top' + c + '">';
                            for (var p = 0; p < u.length; ++p) {
                                var f = u[p];
                                l += "<th", o = [], d = s = 0, h = pd.isObject(f) ? (f.itemClass && o.push(f.itemClass.toString()), f.colspan && (s = pd.toNumber(f.colspan)), f.rowspan && (d = pd.toNumber(f.rowspan)), f.value ? f.value.toString() : "") : f ? f.toString() : "", a && o.push(a), o.length && (l += ' class="' + o.join(" ") + '"'), 0 < s && (l += ' colspan="' + Math.round(s) + '"'), 0 < d && (l += ' rowspan="' + Math.round(d) + '"'), l += ">" + h + "</th>"
                            }
                            l += "</tr>"
                        }
                    }
                    l += "</thead>"
                }
                if (r && r.length) {
                    l += "<tbody>", n = n && ' class="' + n.toString() + '"', o = [];
                    for (c = d = s = 0; c < r.length; ++c) {
                        var m = r[c];
                        if (m && m.length) {
                            l += "<tr>";
                            for (p = 0; p < m.length; ++p) {
                                l += "<td";
                                var g = m[p];
                                n && (l += n), l += ">" + (h = g ? g.toString() : "") + "</td>"
                            }
                            l += "</tr>"
                        }
                    }
                    l += "</tbody>"
                }
                for (l += "</table>"; t.firstChild;) ko.removeNode(t.firstChild);
                e = t.ownerDocument.createElement("div");
                e.innerHTML = l;
                for (var y = e.firstChild; y.firstChild;) t.appendChild(y.firstChild)
            }
        }, ko.bindingHandlers.editableDimension = {
            init: function(r, t, e, n, i) {
                var a = t(),
                    t = e().numericOptions || {},
                    o = e.get("step") || 0,
                    s = t.formatter || a.formatter;
                s && ko.isObservable(s) || (s = ko.pureComputed({
                    read: function() {
                        return pd.Dimension.formatDimension(+a(), pd.Dimension.type, -1, !0)
                    },
                    write: function(t) {
                        a(pd.Dimension.parseDimension(t))
                    },
                    owner: this
                }));
                var d = t.incrementor || a.incrementor;
                d && "function" == typeof d || (d = function(t, e) {
                    var r;
                    t && e && ((r = M(o)) < 1e-6 && (r = pd.Dimension.getDefaultStep()), r = pd.Dimension.incrementDimension(t, e, a(), r), a(r))
                }), ko.utils.registerEventHandler(r, "wheel mousewheel DOMMouseScroll", function(t) {
                    var e = pdDOM.getScrollIncrement(t);
                    e && (d(t, e, a), t.preventDefault())
                }), ko.utils.registerEventHandler(r, "keydown", function(t) {
                    return 13 == t.which ? (s($(r).val()), void $(r).focus().select()) : void(!d || (e = pdDOM.getKbdIncrement(t)) && d(t, e, a));
                    var e
                }), ko.utils.registerEventHandler(r, "blur", function() {
                    s($(r).val())
                });
                var h = e.get("dblclick") || null;
                h && ko.utils.registerEventHandler(r, "dblclick", function(t) {
                    h(t, $(r), a)
                }), "SELECT" == r.nodeName || "INPUT" == r.nodeName ? ko.applyBindingsToNode(r, {
                    value: s
                }, i) : ko.applyBindingsToNode(r, {
                    text: s
                }, i)
            }
        }, ko.setValueWithoutUndo = function(t, e) {
            t && (t.undoIgnore = !0, t(e), t.undoIgnore = !1)
        }, ko.UndoRedoQueue = function() {
            var o = ko.observableArray([]),
                s = ko.observableArray([]),
                d = !1,
                n = !1;

            function r(t) {
                return {
                    value: ko.utils.unwrapObservable(t()),
                    item: t
                }
            }
            this.isWorking = function() {
                return d
            }, this.canUndo = ko.pureComputed(function() {
                return 256 < o().length && o().shift(), 0 < o().length
            }), this.canRedo = ko.pureComputed(function() {
                return 0 < s().length
            }), this.undo = function() {
                if (0 < o().length) {
                    var t, e, r = [],
                        n = o.pop();
                    d = !0;
                    for (var i = 0, a = n.length; i < a; i++) e = n[i].item, t = "state" in n[i] ? n[i].state : ko.utils.unwrapObservable(e()), e(n[i].value), e.onUndo && "function" == typeof e.onUndo && e.onUndo(n[i].value), "state" in n[i] && (n[i].state = n[i].value), n[i].value = t, r.push(n[i]);
                    0 < r.length && s.push(r), d = !1
                }
                return this
            }, this.redo = function() {
                if (0 < s().length) {
                    var t, e, r = [],
                        n = s.pop();
                    d = !0;
                    for (var i = 0, a = n.length; i < a; i++) e = n[i].item, t = "state" in n[i] ? n[i].state : ko.utils.unwrapObservable(e()), e(n[i].value), e.onUndo && "function" == typeof e.onUndo && e.onUndo(n[i].value), "state" in n[i] && (n[i].state = n[i].value), n[i].value = t, r.push(n[i]);
                    0 < r.length && o.push(r), d = !1
                }
                return this
            }, this.reset = function() {
                return o([]), s([]), this
            };
            var i = [];
            this.storeValues = function() {
                for (var t = i.length = 0, e = arguments.length; t < e; t++) ko.isObservable(arguments[t]) && i.push(r(arguments[t]));
                return this
            }, this.checkForChanges = function() {
                if (0 < i.length) {
                    for (var t = [], e = i.length, r = 0; r < e; r++) i[r].value != ko.utils.unwrapObservable(i[r].item()) && t.push(i[r]);
                    0 < t.length && (o.push(t), s([])), i.length = 0
                }
                return this
            };
            var a = [],
                h = [],
                l = 20,
                c = 2500,
                u = -1,
                p = 0;

            function f() {
                var t, e;
                !d && !n && !this.undoIgnore && 0 <= this.undoIndex && (t = (new Date).getTime(), e = +this.undoIdleThreshold || c, this.undoIndex != u ? t - p < l && 0 < o().length ? o()[o().length - 1].push(r(this)) : (o.push([r(this)]), s([])) : (this.undoNoCollation || t - this.undoTime > e) && (o.push([r(this)]), s([])), u = this.undoIndex, this.undoTime = t, p = t)
            }
            this.addUndoEntry = function(t, e, r) {
                return d || n || !ko.isObservable(t) || t.undoIgnore || (e = {
                    state: r,
                    value: e,
                    item: t
                }, (t = (new Date).getTime()) - p < l && 0 < o().length ? o()[o().length - 1].push(e) : (o.push([e]), s([])), u = -1, this.undoTime = t, p = t), this
            }, this.add = function() {
                for (var t = 0, e = arguments.length; t < e; t++) ko.isObservable(arguments[t]) && (a.push({
                    item: arguments[t],
                    value: ko.utils.unwrapObservable(arguments[t]())
                }), h.push(arguments[t].subscribe(f, arguments[t], "beforeChange")), arguments[t].undoIndex = a.length - 1, arguments[t].undoIgnore = !1, arguments[t].undoTime = 0);
                return this
            }, this.addPostMonitor = function() {
                for (var t = 0, e = arguments.length; t < e; t++) ko.isObservable(arguments[t]) && (a.push({
                    item: arguments[t],
                    value: ko.utils.unwrapObservable(arguments[t]())
                }), h.push(arguments[t].subscribe(f, arguments[t])), arguments[t].undoIndex = a.length - 1, arguments[t].undoIgnore = !1, arguments[t].undoTime = 0);
                return this
            }, this.clear = function() {
                for (var t = 0, e = h.length; t < e; t++) h.dispose();
                return h.length = 0, a.length = 0, n = !1, this
            };
            var m = [];
            return this.pause = function() {
                if (!d && !n) {
                    m.length = 0, n = !0;
                    for (var t = 0, e = a.length; t < e; t++) m.push(r(a[t].item))
                }
                return this
            }, this.resume = function() {
                if (!d) {
                    if (n && 0 < m.length) {
                        for (var t = [], e = 0, r = m.length; e < r; e++) m[e].value != ko.utils.unwrapObservable(m[e].item()) && t.push(m[e]);
                        0 < t.length && (o.push(t), s([])), m.length = 0
                    }
                    n = !1
                }
                return this
            }, this.stop = function() {
                return d = !0, this
            }, this.start = function() {
                return d = !1, n && this.resume(), this
            }, this
        }, ko.undoableObservable = function(t) {
            var r = ko.observable(t),
                n = ko.observableArray([]),
                i = ko.observableArray([]),
                e = ko.computed({
                    read: function() {
                        return r()
                    },
                    write: function(t) {
                        var e = r();
                        void 0 !== e && n.push(e), r(t), i([])
                    }
                });
            return e.undoable = ko.pureComputed(function() {
                return 0 < n().length
            }), e.redoable = ko.pureComputed(function() {
                return 0 < i().length
            }), e.undo = function() {
                var t;
                0 < n().length && (t = n.pop(), i.push(r()), r(t), e.onUndo && "function" == typeof e.onUndo && e.onUndo(t))
            }, e.redo = function() {
                var t;
                0 < i().length && (t = i.pop(), n.push(r()), r(t), e.onUndo && "function" == typeof e.onUndo && e.onUndo(t))
            }, e.reset = function() {
                n([]), i([])
            }, e.getUndoStack = function() {
                return n()
            }, e.getRedoStack = function() {
                return i()
            }, e
        }, ko.bindingHandlers.valueSlider = {
            init: function(t, e, r) {
                var h = e();
                if (!ko.isWriteableObservable(h)) throw "You must pass a Knockout observable or writeable computed";
                var s = $(t),
                    l = r.get("min") || 0,
                    c = r.get("max") || 100,
                    u = r.get("step") || .1,
                    p = r.get("minor") || null,
                    f = r.get("major") || null,
                    e = r.get("enable") || !0,
                    n = r.get("dblclick") || null,
                    i = r.get("tapclick") || null,
                    a = r.get("height") || "4px",
                    m = r.get("wrap") || !1,
                    g = M(e);

                function o() {
                    var t = M(l),
                        e = M(c),
                        e = pd.safeDivide(parseFloat(h()) - t, e - t),
                        t = A(a).toString();
                    s.css("background-size", 1 + 99 * e + "% " + t)
                }
                var y = pd.toInteger(r.get("width"), 1);

                function d(t) {
                    s.css("opacity", t ? "1.0" : "0.35"), g = !!t
                }
                s.toggleClass("value-slider", !0), h.subscribe(o), o(), ko.isObservable(e) && (e.subscribe(d), g || d(!1));
                var v = 0,
                    D = r.get("incrementor") || h.incrementor;

                function b(t, e) {
                    var r, n, i, a, o;
                    g && e && (r = M(l), n = M(c), i = M(u), a = T(p, 5 * i), o = T(f, 50 * i), e(t, s, h, r, n, i, a, o), t.preventDefault())
                }

                function x(t) {
                    g && n && b(t, n)
                }
                D || "function" == typeof D || (D = w), pdDOM.Interaction.makeInteractive(t, {
                    onpress: function(t) {
                        g && 0 <= t.button && t.button < 2 && (y = Math.max(s.width(), 1), v = parseFloat(h()))
                    },
                    ondrag: function(t) {
                        var e, r, n, i, a, o, s, d;
                        g && 0 <= t.button && t.button < 2 && (e = t.dragX * pdDOM.pageScale, r = M(l), n = M(c), i = M(u), s = T(p, 5 * i), a = T(f, 50 * i), o = A(m), (d = 0) == t.button ? d = e / y * (n - r) : 1 == t.button && (d = .25 * pd.sign(e) * pd.interpolate(i, a, Math.min(1, (Math.abs(e) - 1) / 20)), t.metaKey = !0), v = o ? pd.wrapAt(v + d, r, n) : pd.constrainTo(v + d, r, n), s = t.shiftKey ? a : 1 == t.button || t.ctrlKey || t.metaKey ? i : s, h(pd.snapTo(v, s)))
                    },
                    onrelease: function(t) {
                        i && g && 0 <= t.button && t.button < 2 && !t.hasMoved() && b(t, i)
                    },
                    onscroll: function(t) {
                        var e, r, n, i, a;
                        g && t.delta && (e = M(l), r = M(c), n = M(u), i = T(p, 5 * n), a = T(f, 50 * n), D(t, t.delta, s, h, e, r, n, i, a), t.preventDefault())
                    },
                    ondoubletap: x,
                    onlongclick: x,
                    simple: !0
                })
            }
        }, ko.bindingHandlers.numericSlider = {
            init: function(t, e, r, n, i) {
                var a = $(t),
                    o = e(),
                    s = r().numericOptions || {};
                ko.isObservable(o) && ko.utils.registerEventHandler(t, "input change", function() {
                    o(parseFloat(a.val()))
                });
                var d = s.incrementor || o.incrementor;
                return d && "function" == typeof d ? (ko.utils.registerEventHandler(t, "wheel mousewheel DOMMouseScroll", function(t) {
                    var e = pdDOM.getScrollIncrement(t);
                    e && (d(t, e), t.preventDefault())
                }), ko.utils.registerEventHandler(t, "keydown", function(t) {
                    var e = pdDOM.getKbdIncrement(t);
                    e && d(t, e)
                })) : (ko.utils.registerEventHandler(t, "wheel mousewheel DOMMouseScroll", function(t) {
                    var e = pd.toNumber(a.attr("step"), .1);
                    w(t, pdDOM.getScrollIncrement(t), 0, o, pd.toNumber(a.attr("min"), 0), pd.toNumber(a.attr("max"), 100), e, pd.toNumber(a.attr("minor"), 5 * e), pd.toNumber(a.attr("major"), 50 * e)), t.preventDefault()
                }), ko.utils.registerEventHandler(t, "keydown", function(t) {
                    var e = pd.toNumber(a.attr("step"), .1);
                    w(t, pdDOM.getKbdIncrement(t), 0, o, pd.toNumber(a.attr("min"), 0), pd.toNumber(a.attr("max"), 100), e, pd.toNumber(a.attr("minor"), 5 * e), pd.toNumber(a.attr("major"), 50 * e))
                })), ko.bindingHandlers.value.init(t, e, r, n, i)
            },
            update: function(t, e, r, n, i) {
                ko.bindingHandlers.value.update(t, e, r, n, i)
            }
        }, ko.bindingHandlers.numericInput = {
            init: function(r, t, e, n, i) {
                var a = t(),
                    t = e().numericOptions || {},
                    o = t.formatter || a.formatter;
                o && ko.isObservable(o) || (o = a);
                var s = t.incrementor || a.incrementor;
                return s && "function" == typeof s && ko.utils.registerEventHandler(r, "wheel mousewheel DOMMouseScroll", function(t) {
                    var e = pdDOM.getScrollIncrement(t);
                    e && (s(t, e, a), t.preventDefault())
                }), ko.utils.registerEventHandler(r, "keydown", function(t) {
                    return 13 == t.which ? (o($(r).val()), void $(r).focus().select()) : void(!s || (e = pdDOM.getKbdIncrement(t)) && s(t, e, a));
                    var e
                }), ko.utils.registerEventHandler(r, "blur", function() {
                    o($(r).val())
                }), ko.bindingHandlers.value.init(r, o, e, n, i)
            }
        };
        ko.components.register("numeric-slider", {
            viewModel: function(t) {
                var a = this;
                this.min = t.min || 0, this.max = t.max || 100, this.step = t.step || 1, this.value = t.value || ko.observable(parseFloat(ko.unwrap(t.min))), this.title = t.title || "No Title", this.units = t.units || "", this.suffix = t.suffix || null, this.noLimits = t.noLimits || !1, t.formatter && ko.isObservable(t.formatter) ? this.formatter = t.formatter : this.value.formatter && ko.isObservable(this.value.formatter) ? this.formatter = this.value.formatter : (this.decimals = pd.isNumeric(t.decimals) ? parseInt(t.decimals, 10) : t.decimals || 2, this.formatter = ko.pureComputed({
                    read: function() {
                        var t = A(a.suffix),
                            e = pd.toInteger(M(a.decimals), 2),
                            e = e <= 0 ? parseInt(a.value(), 10).toString() : pd.toStringWithPrecisionRange(+a.value(), e, 9);
                        return t && (e += t), e
                    },
                    write: function(t) {
                        var e, r = pd.parseEqn(t);
                        pd.toInteger(M(a.decimals), 2) <= 0 && (r = Math.round(r)), M(a.noLimits) || (e = M(a.min), t = M(a.max), r = pd.constrainTo(r, e, t)), a.value(r)
                    },
                    owner: this
                })), t.incrementor && "function" == typeof t.incrementor ? this.incrementor = t.incrementor : this.value.incrementor && "function" == typeof this.value.incrementor ? this.incrementor = this.value.incrementor : (this.largeIncrement = t.largeIncrement || 100, this.smallIncrement = t.smallIncrement || 10, this.incrementor = function(t, e) {
                    var r, n, i;
                    (e = parseFloat(e)) && (r = M(a.largeIncrement), i = M(a.smallIncrement), n = M(a.step), e = t.shiftKey ? 5 < Math.abs(e) ? 10 * pd.sign(e) * r : pd.sign(e) * r : t.ctrlKey || t.metaKey ? 5 < Math.abs(e) ? pd.sign(e) * i : pd.sign(e) : 5 < Math.abs(e) ? r * pd.sign(e) : i * pd.sign(e), e *= n, i = pd.incrementBy(+a.value(), e), M(a.noLimits) || (n = M(a.min), e = M(a.max), i = pd.constrainTo(i, n, e)), a.formatter(i))
                }), this.incrementValue = function(t, e, r) {
                    this.incrementor(r, t)
                }
            },
            template: '        <table class="numeric-slider">            <tr>                <td colspan="3">                    <h4>                        <span data-bind="html: title"></span>                        <small class=\'pull-right\' data-bind="html: units"></small>                    </h4>                </td>            </tr>            <tr>                <td>                    <div class="btn-group" role="group">                        <button type="button" class="btn btn-default btn-increment no-touch" data-bind="repeatButton: $data.incrementValue.bind($data, -10)"><span class="glyphicon glyphicon-chevron-left"></span></button>                        <button type="button" class="btn btn-default btn-increment no-touch" data-bind="repeatButton: $data.incrementValue.bind($data, -1)"><small><span class="glyphicon glyphicon-chevron-left"></span></small></button>                    </div>                </td>                <td class="pad-sides-4px">                    <input type="text" data-bind="numericInput: $data.value, numericOptions: { formatter: $data.formatter, incrementor: $data.incrementor }" class="form-control text-center text-dark" />                </td>                <td>                    <div class="btn-group" role="group">                        <button type="button" class="btn btn-default btn-increment no-touch" data-bind="repeatButton: $data.incrementValue.bind($data, 1)"><small><span class="glyphicon glyphicon-chevron-right"></span></small></button>                        <button type="button" class="btn btn-default btn-increment no-touch" data-bind="repeatButton: $data.incrementValue.bind($data, 10)"><span class="glyphicon glyphicon-chevron-right"></span></button>                    </div>                </td>            </tr>            <tr>                <td colspan="3">                    <input type="range" class="numeric" data-bind="attr: { min: $data.min, max: $data.max, step: $data.step }, numericSlider: $data.value, numericOptions: { incrementor: $data.incrementor }"/>                </td>            </tr>        </table>'
        })
    }();
var pdKO = pdKO || {};
! function() {
    function u(t, e) {
        t && (t.undoIgnore = !0, t(e), t.undoIgnore = !1)
    }

    function n(t, e) {
        var o = this,
            r = !1,
            n = (e = e || {}).sliderid || "#slider-edit",
            i = e.id || "#popover-edit",
            s = !0,
            d = null;

        function h(t, e) {
            var r, n = o.getTextInput()[0];
            n && (t = pd.toInteger(t, 0), e = pd.toInteger(e, t), (r = d.val().length) < e && (e = r), e < t && (t = e), t < 0 && (t = 0), n.setSelectionRange ? n.setSelectionRange(t, e) : n.selectionStart && (n.selectionStart = t, n.selectionEnd = e))
        }
        this.title = ko.observable(e.title || "Edit Numeric Value"), this.min = ko.observable(pd.toNumber(e.min, 0)), this.max = ko.observable(pd.toNumber(e.max, 100)), this.step = ko.observable(pd.toNumber(e.step, .1)), this.major = ko.observable(pd.toNumber(e.major, 10)), this.minor = ko.observable(pd.toNumber(e.minor, 1)), this.decimals = ko.observable(pd.toInteger(e.decimals, 2)), this.value = ko.observable(pd.toNumber(e.value, 0)), this.value.subscribe(function() {
            s = !0
        }), this.units = pd.UnitType.NONE, this.constrainToMin = ko.observable(pd.toBoolean(e.constrainToMin, !0)), this.constrainToMax = ko.observable(pd.toBoolean(e.constrainToMax, !0)), this.action = ko.observable(e.action || null), this.payload = ko.observable(e.payload || null), this.getTextInput = function() {
            return d || (d = $(n).find("input[type=text]")) && d.on("click", function() {
                d.prop("readonly", !1)
            }), d
        }, this.selectAndFocus = function() {
            return this.getTextInput().focus().select(), o.emit("editor:focus", o.payload()), o
        }, this.openAt = function(t, e, r) {
            return pdKO.showPopoverAtPoint($(i), t, e, {
                placement: r
            }), o
        }, this.open = function(t, e) {
            return null == t ? $(i).popoverX("show") : pdKO.showPopoverOnElement($(i), t, {
                placement: e
            }), o
        }, this.close = function() {
            return $(i).popoverX("hide"), o
        }, this.isPopupVisible = function() {
            return r
        }, this.symbols = ko.observable(!1), this.calcButton = function(t) {
            var e, r, n = (d = d || o.getTextInput()).val(),
                i = d.prop("selectionStart"),
                a = d.prop("selectionEnd");
            switch (pd.isNumeric(t) && (t = String.fromCharCode(t)), t) {
                case "<":
                    i < a ? (r = n.substring(0, i) + n.substring(a, n.length), d.val(r), h(i)) : i == a && 0 < i && i < n.length - 1 ? (r = n.substring(0, i - 1) + n.substring(a, n.length), d.val(r), h(i - 1)) : s ? d.val("") : (d.val(n.substring(0, n.length - 1)), h(9999));
                    break;
                case "$":
                    return void o.symbols(!o.symbols());
                case "@":
                    switch ((pdDOM.isMobile || pdDOM.isWindows10) && d.prop("readonly", !0), o.units) {
                        case pd.UnitType.LENGTH:
                            e = pd.Dimension.parseDimension(d.val());
                            break;
                        case pd.UnitType.TIME_HRS:
                            e = pd.DateTime.parseTimeToDecimalHours(d.val());
                            break;
                        default:
                            e = pd.parseEqn(d.val())
                    }
                    isNaN(e) || (o.value(e), pdDOM.isMobile || pdDOM.isWindows10 ? h(9999) : (d.focus().select(), d.focus().select()), s = !0);
                    break;
                default:
                    i < a || i == a && 0 < i && i < n.length - 1 ? (r = n.substring(0, i) + t + n.substring(a, n.length), d.val(r), h(i + 1)) : (s ? d.val(t) : d.val(n + t), h(9999)), s = !1
            }
            o.symbols() && o.symbols(!1)
        }, this.handlePopoverShow = function() {
            s = r = !0;
            var t = o.getTextInput();
            o.emit("editor:show", o.payload()), pdDOM.isMobile || pdDOM.isWindows10 ? (t.prop("readonly", !0), h(9999)) : (setTimeout(function() {
                o.selectAndFocus()
            }, 250), t.prop("readonly", !1))
        }, this.handlePopoverHide = function() {
            r = !1, o.emit("editor:hide", o.payload()), o.action(null)
        }, pd.addSimpleEventHandling(o), this.set = function(t) {
            return pdKO.setWritableObservables(t, o), this
        }
    }
    pdKO.setWritableObservables = function(t, e) {
        var r = 0;
        if (t && e)
            for (var n in t) t.hasOwnProperty(n) && ko.isWritableObservable(e[n]) && (e[n](t[n]), ++r);
        return r
    }, pdKO.SaveAsViewModel = function(t, e) {
        var r = this,
            n = (e = e || {}).id || "#modal-save";
        this.title = ko.observable(e.title || "Save File"), this.filename = ko.observable(e.filename || "[No Name]"), this.extension = ko.observable(e.extension || ".json"), this.message = ko.observable(e.message || "Enter the filename to save your data as:"), this.action = ko.observable(e.action || null), this.selectAndFocus = function() {
            return $(n).find("input[type=text]").focus().select(), this
        }, this.open = function() {
            return $(n).modal("show"), this
        }, this.close = function() {
            return $(n).modal("hide"), this
        }, this.handlePopoverShow = function() {
            pdDOM.isMobile || pdDOM.isWindows10 || setTimeout(function() {
                r.selectAndFocus()
            }, 250)
        }, this.submitFile = function() {
            var t = r.filename().toString();
            if (t && 0 < t.length) {
                var e = r.extension();
                if (!pd.endsWith(t, e)) return r.filename(t + e), void r.selectAndFocus();
                e = r.action() || null;
                if (e && e(t)) return void r.close()
            }
            return r.selectAndFocus(), this
        }, this.set = function(t) {
            return pdKO.setWritableObservables(t, r), this
        }, e = null
    }, pdKO.confirmExecuteScript = function() {
        var t = localStorage.getItem("allowScripts"),
            e = new Date(t).getTime(),
            r = new Date,
            t = r.getTime();
        if (e < t || t + 864e5 < e) {
            if (!confirm("This will execute the JavaScript commands in this file.\n\nEverything is fully sandboxed so it can't go too wrong, worst case you may need to reload the page. However you should always check scripts for any malicious content before you run them.\n\nAllow drag/drop scripts for the rest of today?")) return !1;
            r.setHours(24, 0, 0, 0), localStorage.setItem("allowScripts", r.toString())
        }
        return !0
    }, pdKO.executeScript = function(t) {
        return !!(t && (t instanceof window.FileReader && (t = t.result), "string" == typeof t || t instanceof String || (t = t.toString()), t.length && pdKO.confirmExecuteScript())) && (window.eval("(function() {\n\n" + t + "\n})();\n"), !0)
    }, pdKO.importFiles = function(t, e) {
        if (e = e || {}, window.FileReader && null != t && 0 < t.length && (!e.model || ! function(e, r) {
                var t = !1,
                    n = -1,
                    i = [],
                    a = null,
                    o = {},
                    s = new FileReader,
                    d = 0,
                    h = 0,
                    l = {
                        materials: o,
                        node: null
                    };
                if (r) {
                    for (var c = 0, u = e.length; c < u; ++c) pd.endsWith(e[c].name, ".obj") ? (n < 0 && (n = c), t = !0) : pd.endsWith(e[c].name, ".mtl") ? (i.push({
                        index: c,
                        type: "mtl"
                    }), t = !0) : pd.endsWith(e[c].name, ".stl") ? (i.push({
                        index: c,
                        type: "stl"
                    }), t = !0) : pd.endsWith(e[c].name, ".ply") ? (i.push({
                        index: c,
                        type: "ply"
                    }), t = !0) : pd.endsWith(e[c].name, ".mod") && (i.push({
                        index: c,
                        type: "mod"
                    }), t = !0);
                    return t && (d = i.length, setTimeout(p, 50), 1)
                }

                function p() {
                    if (h == d) 0 <= n ? (s.onload = f, a = e[n], s.readAsText(a)) : r(l.node);
                    else if (h < d) {
                        var t = i[h];
                        switch (a = e[t.index], t.type) {
                            case "mtl":
                                s.onload = m, s.readAsText(a);
                                break;
                            case "stl":
                                s.onload = g, s.readAsText(a);
                                break;
                            case "ply":
                                s.onload = y, s.readAsText(a);
                                break;
                            case "mod":
                                s.onload = v, s.readAsText(a)
                        }
                    }
                    h++
                }

                function f() {
                    l.node = pd3D.parseOBJ(s, l), r(l.node)
                }

                function m() {
                    var t = a.name.split("/").pop();
                    o[t] = pd3D.parseMTL(s), p()
                }

                function g() {
                    l.node = pd3D.parseSTL(s, l), p()
                }

                function y() {
                    l.node = pd3D.parsePLY(s, l), p()
                }

                function v() {
                    l.node = pd3D.parseMOD(s, l), p()
                }
            }(t, e.model))) {
            var r = !1,
                n = new FileReader,
                i = t[0];
            if (pd.isArray(e.extra))
                for (var a = 0, o = e.extra.length; a < o; ++a) {
                    var s = e.extra[a];
                    "function" != typeof s.callback || s.match && !pd.endsWith(i.name.toLowerCase(), s.match.toLowerCase()) && i.type !== s.match || (n.onload = function(t, e, r) {
                        return function() {
                            t.callback(e, r)
                        }
                    }(s, n, i), n.readAsText(i), r = !0)
                }
            r || "function" != typeof e.json || i.type && !/text|json/i.test(i.type) || !pd.endsWith(i.name, ".json") || (n.onload = function() {
                e.json(n, i)
            }, n.readAsText(i), r = !0), r || i.type && !/text|javascript/i.test(i.type) || !pd.endsWith(i.name, ".js") || pdKO.confirmExecuteScript() && (n.onload = function() {
                pdKO.executeScript(n), "function" == typeof e.script && e.script()
            }, n.readAsText(i), r = !0), r || ("function" == typeof e.error ? e.error(i) : window.alert("ERROR: File does not contain a recognisable data format."))
        }
    }, pdKO.ModelViewModel = function(t, r, n) {
        var i = this;
        this.units = ko.observable(pd.toInteger(r.units, 0)), this.units.subscribe(function(t) {
            var e = pd.Dimension.type,
                t = parseInt(t, 10);
            (t == pd.DimensionType.IMPERIAL && e != pd.DimensionType.IMPERIAL || t != pd.DimensionType.IMPERIAL && e == pd.DimensionType.IMPERIAL) && (e = t == pd.DimensionType.IMPERIAL ? 6.35 : 5, i.snapGrid(pd.snapTo(i.snapGrid(), e)), i.snapStep(e)), pd.Dimension.type = r.units = t, n && (n.setModelSnap(n.preferredModelSnap), n.environment._groundMesh && n.environment.updateGroundPlane(n)), i.snapGrid.valueHasMutated()
        }), this.shadowsShow = ko.observable(r.shadowsShow || !1), this.shadowsShow.subscribe(function(t) {
            r.shadowsShow = !!t, n && window.gl && (r.shadowsShow ? (n.updateBoundingBox(!0), n.environment.hasOwnShadowMap || n.createShadowMap(2048, window.gl.RGB)) : n.environment.hasOwnShadowMap && n.clearShadowMap(), window.gl.update())
        }), this.onShowDimensionsChange = null, this.onDimensionSizeChange = null;
        var e = new pdDOM.ThrottledUpdate(function() {
            i.onDimensionSizeChange && i.onDimensionSizeChange(i), window.gl && window.gl.update()
        }, 50);
        this.dimensionsShow = ko.observable(r.dimensionsShow || !1), this.dimensionsShow.subscribe(function(t) {
            r.dimensionsShow = !!t, i.onShowDimensionsChange && i.onShowDimensionsChange(i), window.gl && window.gl.update()
        }), this.dimensionSize = ko.observable(pd.toNumber(r.dimensionSize, .65)), this.dimensionSize.subscribe(function(t) {
            r.dimensionSize = pd.constrainTo(parseFloat(t), .05, 2), r.dimensionsShow && e.trigger()
        }), this.modelSize = ko.observable(1e4), this.snapStep = ko.observable(pd.Dimension.type == pd.DimensionType.IMPERIAL ? 6.35 : 5), this.snapMax = ko.computed(function() {
            return pd.snapTo(.1 * i.modelSize(), 100 * i.snapStep())
        }, this), this.snapMin = ko.computed(function() {
            return -i.snapMax()
        }, this), this.snapActive = ko.observable(r.snapActive || !1), this.snapActive.subscribe(function(t) {
            r.snapActive = !!t, gl.orbitalView.snapGrid = r.snapActive ? r.snapGrid : 0
        }), this.snapAlignBounds = ko.observable(r.snapAlignBounds || !1), this.snapAlignBounds.subscribe(function(t) {
            r.snapAlignBounds = !!t
        }), this.snapAlignCenter = ko.observable(r.snapAlignCenter || !1), this.snapAlignCenter.subscribe(function(t) {
            r.snapAlignCenter = !!t
        }), this.snapAlignGrid = ko.observable(r.snapAlignGrid || !1), this.snapAlignGrid.subscribe(function(t) {
            r.snapAlignGrid = !!t, i.snapActive() && r.snapAlignGrid ? (n && n.setModelSnap(r.snapGrid), gl.orbitalView.snapGrid = r.snapGrid) : gl.orbitalView.snapGrid = 1
        }), this.snapToAdjacent = ko.observable(r.snapToAdjacent || !1), this.snapToAdjacent.subscribe(function(t) {
            r.snapToAdjacent = !!t
        }), this.snapToSelected = ko.observable(r.snapToSelected || !1), this.snapToSelected.subscribe(function(t) {
            r.snapToSelected = !!t
        }), this.snapToAll = ko.observable(r.snapToAll || !1), this.snapToAll.subscribe(function(t) {
            r.snapToAll = !!t
        }), this.snapGrid = ko.observable(pd.toNumber(r.snapGrid, 25)), this.snapGrid.subscribe(function(t) {
            r.snapGrid = parseFloat(t), i.snapActive() && i.snapAlignGrid() && (n && n.setModelSnap(r.snapGrid), gl.orbitalView.snapGrid = r.snapGrid)
        }), this.snapGrid.incrementor = function(t, e) {
            t && e && (e = pd.Dimension.incrementDimension(t, e, i.snapGrid(), i.snapStep()), i.snapGrid(Math.max(0, e)))
        }, this.snapGrid.formatter = ko.pureComputed({
            read: function() {
                return pd.Dimension.formatDimension(+i.snapGrid(), pd.Dimension.type, -1, !0)
            },
            write: function(t) {
                i.snapGrid(pd.Dimension.parseDimension(t))
            },
            owner: this
        }), this.extentsMax = ko.computed(function() {
            return pd.snapTo(i.modelSize(), i.snapGrid())
        }, this), this.extentsMin = ko.computed(function() {
            return -i.extentsMax()
        }, this), this.set = function(t) {
            return pdKO.setWritableObservables(t, i), this
        }
    }, pdKO.showPopoverOn = function(t) {
        var e = pd.isString(t) ? $(t) : t,
            r = e.attr("data-placement") || "top",
            t = $(e.attr("data-target"));
        t && (t.popoverX({
            $target: e,
            placement: r
        }), t.popoverX("show"))
    }, pdKO.showPopoverAtPoint = function(t, e, r, n) {
        var i = (n = n || {}).$target || $("#overlay-popover-pos");
        if (t && 0 < i.length) {
            var a = n.placement || "bottom",
                o = e - 4,
                s = r - 4,
                e = .5 * t.width() + 5,
                r = t.height() + 5;
            return o < e ? a = "right" : o > window.innerWidth - e ? a = "left" : s > window.innerHeight - r ? a = "top" : s < r && (a = "bottom"), o += pd.toNumber(n.offsetX, 0), s += pd.toNumber(n.offsetY, 0), o *= pdDOM.pageScale, s *= pdDOM.pageScale, i.show().css({
                left: o + "px",
                top: s + "px"
            }), t.popoverX({
                $target: i,
                placement: a
            }), t.popoverX("show"), i != n.$target && i.hide(), !0
        }
        return !1
    }, pdKO.showPopoverOnElement = function(t, e, r) {
        if (t && 0 < t.length && e && 0 < e.length) {
            var n = (r = r || {}).placement || "bottom",
                i = r.$target || $("#overlay-popover-pos");
            if (0 < i.length && i[0] != e[0]) {
                var a = e.offset(),
                    o = e.outerWidth(),
                    s = e.outerHeight(),
                    d = pd.toNumber(r.offsetX, 0),
                    h = pd.toNumber(r.offsetY, 0);
                0 <= n.indexOf("left") ? d += 0 : 0 <= n.indexOf("right") ? d += Math.round(o) - 8 : d += Math.round(.5 * o) - 4, 0 <= n.indexOf("top") ? h += 0 : 0 <= n.indexOf("bot") ? h += Math.round(s) - 8 : h += Math.round(.5 * s) - 4;
                var l = 5,
                    c = t.width() + l,
                    u = t.height() + l,
                    p = a.left + d,
                    f = a.top + h;
                switch (pdDOM.isFirefox && (p *= pdDOM.pageScale, f *= pdDOM.pageScale), n) {
                    case "left":
                        p <= c && (d = pd.toNumber(r.offsetX, 0), d += Math.round(o) - 8, p = a.left + d, n = "right");
                        break;
                    case "right":
                        p > window.innerWidth - c && (d = pd.toNumber(r.offsetX, 0), p = a.left + d, n = "left");
                        break;
                    case "top":
                        f <= u && (h = pd.toNumber(r.offsetY, 0), h += Math.round(s) - 8, f = a.top + h, n = "bottom");
                        break;
                    case "bottom":
                        f >= window.innerHeight - u && (h = pd.toNumber(r.offsetY, 0), f = a.top + h, n = "top")
                }
                switch (n) {
                    case "left":
                    case "right":
                        f < .5 * u ? (n += " " + n + "-top", f -= Math.round(.1 * u) - 4) : f > window.innerHeight - .5 * u && (n += " " + n + "-bottom", f += Math.round(.1 * u) - 4);
                        break;
                    case "top":
                    case "bottom":
                        p < .5 * c ? (n += " " + n + "-left", p -= Math.round(.1 * c) - 4) : p > window.innerWidth - .5 * c && (n += " " + n + "-right", p += Math.round(.1 * c) - 4)
                }
                i.show().css({
                    left: p + "px",
                    top: f + "px"
                }), t.popoverX({
                    $target: i,
                    placement: n
                }), t.popoverX("show"), i != r.$target && i.hide()
            } else {
                a = e.offset(), o = e.outerWidth(), s = e.outerHeight();
                a.right = a.left + o, a.bottom = a.top + o;
                l = 5, u = t.height() + l, c = t.width() + l;
                switch (n) {
                    case "left":
                        a.left <= c && (n = "right");
                        break;
                    case "right":
                        a.right > window.innerWidth - c && (n = "left");
                        break;
                    case "top":
                        a.top <= u && (n = "bottom");
                        break;
                    case "bottom":
                        a.bottom >= window.innerHeight - u && (n = "top")
                }
                switch (n) {
                    case "left":
                    case "right":
                        a.top < .5 * u ? n += " " + n + "-top" : a.bottom > window.innerHeight - .5 * u && (n += " " + n + "-bottom");
                        break;
                    case "top":
                    case "bottom":
                        a.left < .5 * c ? n += " " + n + "-left" : a.right > window.innerWidth - .5 * c && (n += " " + n + "-right")
                }
                t.popoverX({
                    $target: e,
                    placement: n
                }), t.popoverX("show")
            }
            return !0
        }
        return !1
    }, pdKO.NumericEditViewModel = function(t, e) {
        var a = this;
        (e = e || {}).id = e.id || "#popover-editnum", e.sliderid = e.sliderid || "#slider-editnum", e.title = e.title || "Edit Numeric Value", n.call(this, t, e), this.value.subscribe(function(t) {
            var e;
            (t = pd.toNumber(t, 0)) < a.min() ? a.value(a.min()) : t > a.max() ? a.value(a.max()) : a.value.undoIgnore || (e = a.action() || null) && e(t, a.payload())
        }), this.value.incrementor = function(t, e) {
            var r, n, i;
            t && e && (r = a.min(), i = a.max(), n = a.step(), r < i && (t.shiftKey ? n = a.major() : t.ctrlKey || t.metaKey || (n = a.minor()), i = pd.constrainTo(parseFloat(a.value()) + e * n, r, i), a.value(pd.snapTo(i, e * n))))
        }, this.value.formatter = ko.pureComputed({
            read: function() {
                var t = a.value();
                switch (a.units) {
                    case pd.UnitType.LENGTH:
                        return pd.Dimension.formatDimension(t, pd.Dimension.type, -1, !0);
                    case pd.UnitType.TIME_HRS:
                        return pd.DateTime.formatTime(parseFloat(t));
                    default:
                        var e = pd.toInteger(a.decimals(), 2);
                        return 0 < e ? pd.toStringWithPrecisionRange(t, e, 9) : parseInt(t, 10).toString()
                }
            },
            write: function(t) {
                var e = 0;
                switch (a.units) {
                    case pd.UnitType.LENGTH:
                        e = pd.Dimension.parseDimension(t);
                        break;
                    case pd.UnitType.TIME_HRS:
                        e = pd.DateTime.parseTimeToDecimalHours(t);
                        break;
                    default:
                        e = pd.parseEqn(t);
                        pd.toInteger(a.decimals(), 2) <= 0 && (e = Math.round(e))
                }
                var r = a.min(),
                    t = a.max();
                e = pd.constrainTo(e, r, t), a.value(e)
            },
            owner: this
        })
    }, pdKO.NumericEditViewModel.prototype = Object.create(n.prototype), pdKO.NumericEditViewModel.prototype.constructor = pdKO.NumericEditViewModel, pdKO.DimensionEditViewModel = function(t, e) {
        var r = this;
        (e = e || {}).id = e.id || "#popover-editdim", e.sliderid = e.sliderid || "#slider-editdim", e.title = e.title || "Edit Dimension", n.call(this, t, e), this.showAbout = ko.observable(pd.toBoolean(e.showAbout, !0)), this.about = ko.observable(pd.toInteger(e.about, 1)), this.units = pd.UnitType.LENGTH, this.value.subscribe(function(t) {
            return t = pd.toNumber(t, 0), r.constrainToMin() && t < r.min() ? (r.value(r.min()), void r.value.valueHasMutated()) : r.constrainToMax() && t > r.max() ? (r.value(r.max()), void r.value.valueHasMutated()) : void(r.value.undoIgnore || (e = r.action() || null) && e(t, r.payload()));
            var e
        }), this.value.incrementor = function(t, e) {
            t && e && (e = pd.Dimension.incrementDimension(t, e, r.value(), r.step()), r.constrainToMin() && (e = Math.max(r.min(), e)), r.constrainToMax() && (e = Math.min(r.max(), e)), r.value(e))
        }, this.value.formatter = ko.pureComputed({
            read: function() {
                return pd.Dimension.formatDimension(+r.value(), pd.Dimension.type, -1, !0)
            },
            write: function(t) {
                r.value(pd.Dimension.parseDimension(t))
            },
            owner: this
        })
    }, pdKO.DimensionEditViewModel.prototype = Object.create(n.prototype), pdKO.DimensionEditViewModel.prototype.constructor = pdKO.DimensionEditViewModel, pdKO.CameraViewModel = function(i, a) {
        var o = this,
            t = !1;
        this.viewAzimuth = ko.observable(60).extend({
            fixedPrecision: 2
        }), this.viewAzimuth.subscribe(function(t) {
            o.viewAzimuth.undoIgnore || (gl.orbitalView.cameraAzi = pd.wrapAt(parseFloat(t), -180, 180), o.updateViewTypeFromCamera(), gl.update())
        }), this.viewAltitude = ko.observable(30).extend({
            fixedPrecision: 2
        }), this.viewAltitude.subscribe(function(t) {
            o.viewAltitude.undoIgnore || (gl.orbitalView.cameraAlt = pd.wrapAt(parseFloat(t), -180, 180), o.updateViewTypeFromCamera(), gl.update())
        }), this.viewAngle = ko.observable(45).extend({
            fixedPrecision: 2
        }), this.viewAngle.subscribe(function(t) {
            o.viewAngle.undoIgnore || (gl.orbitalView.cameraFOV = pd.constrainTo(parseFloat(t), 0, 160), gl.orbitalView.hasChanged = gl.PROJECTION, o.updateViewTypeFromCamera(), gl.update())
        }), this.incrementZoom = function(t, e, r) {
            (t = parseFloat(t)) && (r && (r.ctrlKey || r.metaKey ? t /= 10 : r.shiftKey && (t *= 10)), gl.orbitalView.hasChanged = gl.PROJECTION, gl.orbitalView.zoom(.025 * t), u(o.viewZoom, gl.orbitalView.zoomFactor))
        }, this._setZoom = function(t) {
            t = pd.constrainTo(pd.toNumber(t, 0), -1, 1), 1e-4 < Math.abs(t) ? gl.orbitalView.zoom(t) : (gl.orbitalView.hasChanged = gl.PROJECTION, gl.orbitalView.center()), u(o.viewZoom, gl.orbitalView.zoomFactor)
        }, this.setZoom = this._setZoom, this.viewZoom = ko.observable(1).extend({
            fixedPrecision: 3
        }), this.viewZoom.subscribe(function(t) {
            o.viewZoom.undoIgnore || (t = pd.constrainTo(pd.toNumber(t, 0), gl.orbitalView._zoomFactorMin, 3), gl.orbitalView.setZoomFactor(t))
        }), this.handlePopoverShow = function() {
            t = !0, o.updateViewTypeFromCamera(), pd.closeTo(o.viewAzimuth(), gl.orbitalView.cameraAzi, .001) && pd.closeTo(o.viewAltitude(), gl.orbitalView.cameraAlt, .001) && pd.closeTo(o.viewAngle(), gl.orbitalView.cameraFOV, .001) || o.updateCameraOnViewChange(), i.UndoManager && i.UndoManager.storeValues(o.viewAzimuth, o.viewAltitude, o.viewAngle)
        }, this.handlePopoverHide = function() {
            i.UndoManager && i.UndoManager.checkForChanges(), t = !1
        }, this.isPopupVisible = function() {
            return t
        }, this.updateCameraOnViewChange = function(t, e) {
            u(o.viewAzimuth, gl.orbitalView.cameraAzi), u(o.viewAltitude, gl.orbitalView.cameraAlt), u(o.viewAngle, gl.orbitalView.cameraFOV), .99 < e && null != a && 5 == o.viewType() && i.Animation && i.Animation.pause(!1)
        }, this.updateViewTypeFromCamera = function() {
            var t;
            .5 < gl.orbitalView.cameraFOV ? 0 != o.viewType() && o.setViewType(0, !0) : (t = !1, null != a && (a.getSunAnglesArray(pdKO.sunPos), pd.closeTo(gl.orbitalView.cameraAlt, pdKO.sunPos[1], .1) && pd.closeTo(gl.orbitalView.cameraAzi, pd.wrapAt(90 - (pdKO.sunPos[0] + a.northOffset()), -180, 180), .1) && (t = !0)), t ? o.setViewType(5, !0) : pd.closeTo(gl.orbitalView.cameraAlt, 90, .5) ? o.setViewType(2, !0) : pd.closeTo(gl.orbitalView.cameraAlt, 0, .5) ? pd.closeTo(gl.orbitalView.cameraAzi, 90, .5) || pd.closeTo(gl.orbitalView.cameraAzi, -90, .5) ? o.setViewType(3, !0) : pd.closeTo(gl.orbitalView.cameraAzi, 0, .5) || pd.closeTo(gl.orbitalView.cameraAzi, 180, .5) ? o.setViewType(4, !0) : o.setViewType(1, !0) : o.setViewType(1, !0))
        }, this.setViewType = function(t, e) {
            e ? u(o.viewType, t) : o.viewType(t)
        }, this.viewType = ko.observable(0).extend({
            notify: "always"
        }), this.viewType.subscribe(function(t) {
            if (t = parseInt(t, 10), !o.viewType.undoIgnore) {
                var e = {},
                    r = o.viewType.shiftKey ? -90 : 130;
                switch (gl.orbitalView.orbitMode || (e.target = gl.orbitalView.defaultTarget, e.cameraDistance = gl.orbitalView.defaultDistance, e.zoomFactor = 1), gl.orbitalView.orthoMode = 0, t) {
                    case -1:
                        var n = 2.5 < gl.orbitalView.cameraAlt && gl.orbitalView.cameraAlt < 87.5;
                        e.cameraAzi = n ? gl.orbitalView.cameraAzi : -45, e.cameraAlt = n ? gl.orbitalView.cameraAlt : 45, e.cameraFOV = 0;
                        break;
                    default:
                    case 0:
                        e.cameraAzi = gl.orbitalView.cameraAzi, (pd.closeTo(gl.orbitalView.cameraAlt, 45, .1) || gl.orbitalView.cameraAlt < 2.5 || 87.5 < gl.orbitalView.cameraAlt) && (e.cameraAzi -= r), e.cameraAzi = pd.snapTo(e.cameraAzi + r, 90) - 45, e.cameraAlt = 30, e.cameraFOV = 45;
                        break;
                    case 1:
                        e.cameraAzi = gl.orbitalView.cameraAzi, (.5 < gl.orbitalView.cameraFOV || !pd.closeTo(gl.orbitalView.cameraAlt, 45, .1)) && (e.cameraAzi -= r), e.cameraAzi = pd.snapTo(e.cameraAzi + r, 90) - 45, e.cameraAlt = 45, e.cameraFOV = 0;
                        break;
                    case 2:
                        e.cameraAzi = gl.orbitalView.cameraAzi, (.5 < gl.orbitalView.cameraFOV || !pd.closeTo(gl.orbitalView.cameraAlt, 90, .1)) && (e.cameraAzi = -180), gl.orbitalView.orthoMode = 1, e.cameraAzi = pd.snapTo(e.cameraAzi + r, 90), e.cameraAlt = 90, e.cameraFOV = 0;
                        break;
                    case 3:
                        pd.closeTo(gl.orbitalView.cameraAlt, 0, .1) && pd.closeTo(gl.orbitalView.cameraAzi, -90, .1) ? e.cameraAzi = 90 : e.cameraAzi = -90, gl.orbitalView.orthoMode = 2, e.cameraAlt = 0, e.cameraFOV = 0;
                        break;
                    case 4:
                        pd.closeTo(gl.orbitalView.cameraAlt, 0, .1) && pd.closeTo(gl.orbitalView.cameraAzi, 0, .1) ? e.cameraAzi = 180 : e.cameraAzi = 0, gl.orbitalView.orthoMode = 2, e.cameraAlt = 0, e.cameraFOV = 0;
                        break;
                    case 5:
                        null != a && (a.getSunAnglesArray(pdKO.sunPos), e.cameraAzi = pd.wrapAt(90 - (pdKO.sunPos[0] + a.northOffset()), -180, 180), e.cameraAlt = pdKO.sunPos[1], e.cameraFOV = 0, i.Animation && i.Animation.pause(!0))
                }
                gl.orbitalView.animateTo(e, o.updateCameraOnViewChange), gl.orbitalView._viewAngleMin = 5 == t ? .75 : .01
            }
        }), this.set = function(t) {
            return pdKO.setWritableObservables(t, o), this
        }
    }, pdKO.DisplayViewModel = function(t, e, r) {
        var n = this;
        this.surfaceOpacity = ko.observable(pd.toNumber(e.surfaceOpacity, .8)), this.surfaceOpacity.subscribe(function(t) {
            e.surfaceOpacity = parseFloat(t), r && (r.environment.surfaceOpacity = e.surfaceOpacity), gl.update()
        }), this.outlineOpacity = ko.observable(pd.toNumber(e.outlineOpacity, .9)), this.outlineOpacity.subscribe(function(t) {
            e.outlineOpacity = parseFloat(t), r && (r.environment.outlineOpacity = e.outlineOpacity), gl.update()
        }), this.surfaceShininess = ko.observable(pd.toNumber(e.surfaceShininess, 75)), this.surfaceShininess.subscribe(function(t) {
            e.surfaceShininess = parseFloat(t), r && (r.environment.surfaceShininess = e.surfaceShininess), gl.update()
        }), this.ambientFactor = ko.observable(pd.toNumber(e.ambientFactor, .6)), this.ambientFactor.subscribe(function(t) {
            e.ambientFactor = parseFloat(t), r && (r.environment.ambientFactor = e.ambientFactor), gl.update()
        }), this.handlePopoverShow = function() {
            t.UndoManager && t.UndoManager.storeValues(n.surfaceOpacity, n.outlineOpacity, n.surfaceShininess, n.ambientFactor)
        }, this.handlePopoverHide = function() {
            t.UndoManager && t.UndoManager.checkForChanges()
        }, this.set = function(t) {
            return pdKO.setWritableObservables(t, n), this
        }
    }, pdKO.sunPos = [0, 0], pdKO.DateTimeViewModel = function(i, a, o) {
        var s = this;

        function e(t) {
            return t.toFixed(2) + "°"
        }
        o.getSunAnglesArray(pdKO.sunPos), this.onDateTimeChange = null;
        var d = !1,
            h = new pdDOM.ThrottledUpdate(function() {
                s.timeOfDay.azimuthAngle && (s.timeOfDay.azimuthAngle(e(o.azimuthAngle())), s.timeOfDay.altitudeAngle(e(o.altitudeAngle()))), s.onDateTimeChange && s.onDateTimeChange(s, d), d = !1
            }, 50);

        function n(t) {
            var e = pdKO.sunPos[0],
                r = pdKO.sunPos[1],
                n = o.getSunAnglesArray(pdKO.sunPos);
            t && (a && (a.dayOfMonth = o.dayOfMonth(), a.monthOfYear = o.monthOfYear(), a.year = o.year()), s.updateDawnDuskValues(), d = !0), n[0] == e && n[1] == r || h.trigger()
        }

        function r(e) {
            var r = 0,
                n = s.dayOfYear();
            e < n && (e += 365), pd.closeTo(n, e) || (pdDOM.getGlobalAnimationQueue().addOrReplace(function(t) {
                return 1 <= (r += 2 * t) ? (s.setDayOfYear(e), i && i.Animation && i.Animation.pause(!1), !0) : (t = pd.Easing.inOutSine(r), s.setDayOfYear((1 - t) * n + t * e), !1)
            }).start(), i && i.Animation && i.Animation.pause(!0))
        }

        function l(e) {
            var r = 0,
                n = s.timeOfDay();
            pd.closeTo(n, e) || (pdDOM.getGlobalAnimationQueue().addOrReplace(function(t) {
                return 1 <= (r += 2 * t) ? (s.setTimeOfDay(e), i && i.Animation && i.Animation.pause(!1), !0) : (t = pd.Easing.inOutSine(r), s.setTimeOfDay((1 - t) * n + t * e), !1)
            }).start(), i && i.Animation && i.Animation.pause(!0))
        }
        this.dayOfYear = ko.observable(o.dayOfYear()), this.dayOfYear.subscribe(function(t) {
            o.setDayOfYear(parseInt(t, 10)), n(!0)
        }), this.dayOfYear.formatter = ko.pureComputed({
            read: function() {
                return o.formatAsDate(s.dayOfYear(), o.year())
            },
            write: function(t) {
                var e, r = Date.parse(t.toString());
                pd.isNumeric(r) ? ((e = new Date).setTime(r), t = o.calcDayOfYearIndex(e.getDate(), e.getMonth(), e.getFullYear()), r = o.year() != e.getFullYear(), o.year(e.getFullYear()), s.dayOfYear(t), r && n(!0)) : s.dayOfYear.valueHasMutated()
            },
            owner: this
        }), this.dayOfYear.incrementor = function(t, e) {
            var r, n;
            (e = parseFloat(e)) && (r = parseInt(s.dayOfYear(), 10), 5 < Math.abs(e) || t && t.shiftKey ? (t = (n = o.getDateObject()).getMonth() + (0 < e ? 1 : -1), n.setMonth(pd.wrapAt(t, 0, 12, !0)), r = o.calcDayOfYearIndex(n.getDate(), n.getMonth(), n.getFullYear())) : r += 0 < e ? 1 : -1, s.dayOfYear(pd.wrapAt(r, 0, o.isLeapYear() ? 366 : 365, !0)))
        }, this.setDayOfYear = function(t) {
            this.dayOfYear(Math.round(pd.wrapAt(t, 0, 365)))
        }, this.createSolarPositionObservables = function() {
            s.timeOfDay.altitudeAngle = ko.observable(e(o.altitudeAngle())), s.timeOfDay.azimuthAngle = ko.observable(e(o.azimuthAngle()))
        }, this.createTwilightObservables = function() {
            var t = o.getDuskDawnData();
            return s.dayOfYear.civilTwilight = ko.observable(o.formatAsTime(t.civilDawn) + " / " + o.formatAsTime(t.civilDusk)), s.dayOfYear.nauticalTwilight = ko.observable(o.formatAsTime(t.nauticalDawn) + " / " + o.formatAsTime(t.nauticalDusk)), s.dayOfYear.astronomicalTwilight = ko.observable(o.formatAsTime(t.astronomicalDawn) + " / " + o.formatAsTime(t.astronomicalDusk)), s
        }, this.createSolarNoonAndDayLengthObservables = function() {
            return s.dayOfYear.dayLength = ko.observable(o.formatAsTime(o.sunsetTime() - o.sunriseTime())), s.dayOfYear.solarNoon = ko.observable(o.formatAsTime(o.solarNoon())), s
        }, this.dayOfYear.sunriseTime = ko.observable(o.formatAsTime(o.sunriseTime())), this.dayOfYear.sunsetTime = ko.observable(o.formatAsTime(o.sunsetTime())), this.updateDawnDuskValues = function() {
            var t = o.getDuskDawnData();
            return s.dayOfYear.sunriseTime(o.formatAsTime(t.sunrise)), s.dayOfYear.sunsetTime(o.formatAsTime(t.sunset)), s.timeOfDay.azimuthAngle && (s.timeOfDay.azimuthAngle(e(o.azimuthAngle())), s.timeOfDay.altitudeAngle(e(o.altitudeAngle()))), s.dayOfYear.solarNoon && (s.dayOfYear.solarNoon(o.formatAsTime(t.solarNoon)), s.dayOfYear.dayLength(o.formatAsTime(t.sunset - t.sunrise))), s.dayOfYear.civilTwilight && (s.dayOfYear.civilTwilight(o.formatAsTime(t.civilDawn) + " / " + o.formatAsTime(t.civilDusk)), s.dayOfYear.nauticalTwilight(o.formatAsTime(t.nauticalDawn) + " / " + o.formatAsTime(t.nauticalDusk)), s.dayOfYear.astronomicalTwilight(o.formatAsTime(t.astronomicalDawn) + " / " + o.formatAsTime(t.astronomicalDusk))), s
        }, this.setUsefulDate = function(t) {
            switch (t) {
                case 0:
                    r((o.latitude() < 0 ? o.getSolsticeDec() : o.getSolsticeJun()).dayOfYear);
                    break;
                case 1:
                    r((o.latitude() < 0 ? o.getEquinoxMar() : o.getEquinoxSep()).dayOfYear);
                    break;
                case 2:
                    r((o.latitude() < 0 ? o.getSolsticeJun() : o.getSolsticeDec()).dayOfYear);
                    break;
                case 3:
                    r((o.latitude() < 0 ? o.getEquinoxSep() : o.getEquinoxMar()).dayOfYear)
            }
        }, this.setNextUsefulDate = function() {
            var t = o.dayOfYear(),
                e = o.getEquinoxMar().dayOfYear,
                r = o.getSolsticeJun().dayOfYear,
                n = o.getEquinoxSep().dayOfYear,
                i = o.getSolsticeDec().dayOfYear;
            o.latitude() < 0 ? t < e ? s.setUsefulDate(1) : t < r ? s.setUsefulDate(2) : t < n ? s.setUsefulDate(3) : t < i ? s.setUsefulDate(0) : s.setUsefulDate(1) : t < e ? s.setUsefulDate(3) : t < r ? s.setUsefulDate(0) : t < n ? s.setUsefulDate(1) : t < i ? s.setUsefulDate(2) : s.setUsefulDate(3)
        }, this.timeOfDay = ko.observable(60 * o.clockTime()), this.timeOfDay.subscribe(function(t) {
            o.setTimeOfDay(parseFloat(t) / 60), a.clockTime = o.clockTime(), n(!1)
        }), this.timeOfDay.formatter = ko.pureComputed({
            read: function() {
                return o.formatAsTime(s.timeOfDay() / 60)
            },
            write: function(t) {
                t = pd.DateTime.parseTimeToDecimalHours(t), t = pd.constrainTo(pd.isNumeric(t) ? t : 0, 0, 24);
                s.timeOfDay(60 * t)
            },
            owner: this
        }), this.timeOfDay.incrementor = function(t, e) {
            (e = parseFloat(e)) && (e = t.shiftKey ? Math.abs(e) < 5 ? 30 * pd.sign(e) : Math.abs(e) < 10 ? 15 * pd.sign(e) : 180 * pd.sign(e) : t.ctrlKey || t.metaKey ? Math.abs(e) < 10 ? pd.sign(e) : 5 * pd.sign(e) : Math.abs(e) < 10 ? 5 * pd.sign(e) : 30 * pd.sign(e), e = pd.incrementBy(s.timeOfDay(), e), s.timeOfDay(pd.wrapAt(e, 0, 1440, !0)))
        }, this.clockTime = ko.computed({
            read: function() {
                return s.timeOfDay() / 60
            },
            write: function(t) {
                t = pd.toNumber(t, o.clockTime()), s.timeOfDay(60 * t)
            },
            owner: s
        }), this.setTimeOfDay = function(t) {
            this.timeOfDay(Math.round(pd.wrapAt(t, 0, 1440)))
        }, this.setUsefulTime = function(t) {
            switch (t) {
                case 0:
                    l(60 * o.getDawnTime(o.twilight.ASTRONOMICAL));
                    break;
                case 1:
                    l(60 * o.getDawnTime(o.twilight.NAUTICAL));
                    break;
                case 2:
                    l(60 * o.getDawnTime(o.twilight.CIVIL));
                    break;
                case 3:
                    l(60 * o.getDawnTime(o.twilight.SOLAR_DISK_TOP_WITH_ATM_REFRACTION));
                    break;
                case 4:
                    l(720);
                    break;
                case 5:
                    l(60 * o.solarNoon());
                    break;
                case 6:
                    l(60 * o.getDuskTime(o.twilight.SOLAR_DISK_TOP_WITH_ATM_REFRACTION));
                    break;
                case 7:
                    l(60 * o.getDuskTime(o.twilight.CIVIL));
                    break;
                case 8:
                    l(60 * o.getDuskTime(o.twilight.NAUTICAL));
                    break;
                case 9:
                    l(60 * o.getDuskTime(o.twilight.ASTRONOMICAL))
            }
        }, this.setNextUsefulTime = function() {
            var t = o.clockTime() + 1 / 120,
                e = o.getDuskDawnData(),
                r = 12,
                n = 4,
                i = e.solarNoon,
                a = 5;
            e.solarNoon < 12 && (r = e.solarNoon, n = 5, i = 12, a = 4), t < e.astronomicalDawn ? s.setUsefulTime(0) : t < e.nauticalDawn ? s.setUsefulTime(1) : t < e.civilDawn ? s.setUsefulTime(2) : t < e.sunrise ? s.setUsefulTime(3) : t < r ? s.setUsefulTime(n) : t < i ? s.setUsefulTime(a) : t < e.sunset ? s.setUsefulTime(6) : t < e.civilDusk ? s.setUsefulTime(7) : t < e.nauticalDusk ? s.setUsefulTime(8) : t < e.astronomicalDusk ? s.setUsefulTime(9) : s.setUsefulTime(0)
        }, this.datetime = ko.computed({
            read: function() {
                return [s.dayOfYear(), s.timeOfDay()]
            },
            write: function(t) {
                2 == t.length && (s.dayOfYear(parseInt(t[0], 10)), s.timeOfDay(parseFloat(t[1])))
            },
            owner: s
        }), this.handlePopoverShow = function() {
            i.UndoManager && (s.datetime.undoIgnore = !0, i.UndoManager.storeValues(s.dayOfYear, s.timeOfDay))
        }, this.handlePopoverHide = function() {
            i.UndoManager && (s.datetime.undoIgnore = !1, i.UndoManager.checkForChanges())
        }, this.set = function(t) {
            return pdKO.setWritableObservables(t, s), this
        }
    }, pdKO.LocationViewModel = function(t, e, r, n) {
        var o = this;
        n = pd.toNumber(n, 50), this.onLocationChange = null, this.onNorthOffsetChange = null;
        var i = new pdDOM.ThrottledUpdate(function() {
                r.getSunAnglesArray(pdKO.sunPos), e && (e.latitude = r.latitude(), e.longitude = r.longitude(), e.timezone = r.timezone()), o.onLocationChange && o.onLocationChange(o)
            }, 50),
            a = null;

        function s(t) {
            $ && $.snackbar && (null != a ? t && !a.hasClass("snackbar-opened") ? a.snackbar("show") : !t && a.hasClass("snackbar-opened") && a.snackbar("hide") : t && (a = $.snackbar({
                id: "snackbar-time-zone",
                content: "<p><strong>WARNING: Invalid Timezone</strong><br />The selected timezone must be within ±4hrs of the current longitude,<br />where each hour equates to 15 degrees <var>(ref = longitude / 15)</var>.</p>",
                htmlAllowed: !0,
                style: "warning",
                timeout: 8e3
            })))
        }
        this.latitude = ko.observable(r.latitude()), this.latitude.subscribe(function(t) {
            r.latitude(parseFloat(t)), i.trigger()
        }), this.longitude = ko.observable(r.longitude()), this.longitude.subscribe(function(t) {
            r.longitude(parseFloat(t)).calculate(), o.timezone(r.timezone()), i.trigger()
        }), this.timezone = ko.observable(r.timezone()), this.timezone.subscribe(function(t) {
            t = parseFloat(t);
            var e = Math.round(r.longitude() / 15);
            Math.abs(t - e) < 4.01 ? (r.timezone(t), i.trigger(), a && !o.timezone.ignore && s(!1)) : (o.timezone.ignore = !0, o.timezone(r.timezone()), s(!(o.timezone.ignore = !1)))
        }), this.timezone.formatter = ko.pureComputed(function() {
            return "GMT" + (0 <= o.timezone() ? "+" : "-") + r.formatAsTime(Math.abs(o.timezone()))
        }), this.timezone.incrementor = function(t, e) {
            if (e = parseFloat(e)) {
                e = pd.sign(e);
                for (var r, n = document.getElementById("input-timezone"), i = parseFloat(n.options[n.selectedIndex].value), a = n.selectedIndex + e; 0 <= a && a < n.length;) {
                    if (r = parseFloat(n.options[a].value), !pd.closeTo(i, r, .1)) {
                        i = r;
                        break
                    }
                    a += e
                }
                o.timezone(i)
            }
        }, this.northOffset = ko.observable(r.northOffset()), n < 1e-6 ? this.northOffset.extend({
            deferred: !0
        }) : this.northOffset.extend({
            rateLimit: n
        }), this.northOffset.subscribe(function(t) {
            r.northOffset(pd.constrainTo(parseFloat(t), -180, 180)), e && (e.northOffset = r.northOffset()), o.onNorthOffsetChange && o.onNorthOffsetChange(o)
        }), this.elevation = ko.observable(pd.toNumber(e ? e.elevation : null, 150)), this.elevation.subscribe(function(t) {
            e && (e.elevation = pd.constrainTo(parseFloat(t), -400, 1e4))
        }), this.elevation.formatter = ko.pureComputed({
            read: function() {
                var t = pd.Dimension.type != pd.DimensionType.METRIC_IMPERIAL ? pd.DimensionType.METRIC_SI : pd.DimensionType.METRIC_IMPERIAL;
                return pd.Dimension.formatDimension(1e3 * o.elevation(), t, 1, !0)
            },
            write: function(t) {
                var e = pd.Dimension.type != pd.DimensionType.METRIC_IMPERIAL ? pd.DimensionType.METRIC_SI : pd.DimensionType.METRIC_IMPERIAL;
                o.elevation(pd.Dimension.parseDimension(t, e) / 1e3)
            },
            owner: this
        }), this.location = ko.computed({
            read: function() {
                return [o.latitude(), o.longitude(), parseFloat(o.timezone())]
            },
            write: function(t) {
                3 == t.length && (o.latitude(parseFloat(t[0])), o.longitude(parseFloat(t[1])), o.timezone(parseFloat(t[2])))
            },
            owner: o
        }), this.handlePopoverShow = function() {
            t.UndoManager && (o.location.undoIgnore = !0, t.UndoManager.storeValues(o.latitude, o.longitude, o.timezone, o.northOffset, o.elevation))
        }, this.handlePopoverHide = function() {
            t.UndoManager && (o.location.undoIgnore = !1, t.UndoManager.checkForChanges())
        }, this.set = function(t) {
            return pdKO.setWritableObservables(t, o), this
        }
    }, pdKO.AnimationViewModel = function(a, t, o) {
        var s = this;
        this.pause = ko.observable(!1), this.playing = ko.observable(!1), this.animateTime = ko.observable(t.animateTime || !1), this.animateDate = ko.observable(t.animateDate || !1), this.animateLatitude = ko.observable(t.animateLatitude || !1), this.animateLongitude = ko.observable(t.animateLongitude || !1), this.daylightOnly = ko.observable(t.daylightOnly || !1), this.speed = ko.observable(pd.toNumber(t.speed, 10));
        var d = 1,
            h = 0,
            l = 0;

        function e() {
            if (s.pause()) return !1;
            var t, e, r = !1,
                n = Math.max(1, parseFloat(s.speed())),
                i = !1;
            return 10 < n && (n = pd.mapAndConstrainTo(n - 10, 0, 10, 10, 200)), s.animateTime() ? (t = +a.DateTime.timeOfDay(), 1.01 < Math.abs(t - l) && (l = t), t = l += .1 * n, s.daylightOnly() && (e = 60 * o.getDawnTime(o.twilight.CIVIL), 60 * o.getDuskTime(o.twilight.CIVIL) < t ? t = 1441 : t < e && (t = e)), 1440 <= t && s.animateDate() && (a.DateTime.setDayOfYear(+a.DateTime.dayOfYear() + 1), h = +a.DateTime.dayOfYear(), t = l = s.daylightOnly() ? 60 * o.getDawnTime(o.twilight.CIVIL) : 0, i = !0), a.DateTime.timeOfDay(pd.wrapAt(t, 0, 1440)), a.DateTime.onDateTimeChange(a.DateTime, i), r = !0) : s.animateDate() && (e = +a.DateTime.dayOfYear(), 1.01 < Math.abs(e - h) && (h = e), (i = Math.floor(h += .05 * n)) != e && (a.DateTime.setDayOfYear(i), a.DateTime.onDateTimeChange(a.DateTime, !0), r = !0)), s.animateLatitude() && ((t = pd.snapTo(o.latitude() + .01 * n * d, .01)) < -89.8 && (d = 1, t = -90), 89.8 < t && (d = -1, t = 90), a.Location.latitude(t), a.Location.onLocationChange(), r = !0), s.animateLongitude() && (a.Location.longitude(pd.snapTo(pd.wrapAt(o.longitude() + .01 * n, -180, 180), .01)), a.Location.onLocationChange(), r = !0), r && window.gl && window.gl.update(), !s.playing() && (c(), !0)
        }

        function r() {
            s.playing(!0), a.Location.location.undoIgnore = !0, a.DateTime.datetime.undoIgnore = !0, a.UndoManager.storeValues(a.Location.location, a.DateTime.datetime), $("#btn-play-icon").attr("class", "icon icon-stop"), $("#btn-play").toggleClass("btn-default", !1).toggleClass("btn-info", !0).toggleClass("active", !0), h = +a.DateTime.dayOfYear(), l = +a.DateTime.timeOfDay(), pdDOM.getGlobalAnimationQueue().addOrReplace(e).start(), s.pause(!1)
        }

        function c() {
            a.UndoManager.checkForChanges(), $("#btn-play-icon").attr("class", "icon icon-play"), $("#btn-play").toggleClass("btn-default", !0).toggleClass("btn-info", !1).toggleClass("active", !1), a.Location.location.undoIgnore = !1, a.DateTime.datetime.undoIgnore = !1, s.playing(!1), s.pause(!1)
        }
        this.canAnimate = ko.computed(function() {
            return s.animateTime() || s.animateDate() || s.animateLatitude() || s.animateLongitude()
        }, this), this.rewind = function() {
            s.animateDate() && (a.DateTime.dayOfYear(0), o.setDayOfYear(0)), s.animateTime() && a.DateTime.timeOfDay(s.daylightOnly() ? 60 * o.getDawnTime(o.twilight.CIVIL) : 0), s.animateLatitude() && a.Location.latitude(-90), s.animateLongitude() && a.Location.longitude(-180)
        }, this.play = function() {
            s.playing(!s.playing()), (s.playing() ? r : c)()
        }, this.faster = function() {
            s.speed(s.speed() + 2), s.canAnimate() && !s.playing() && r()
        }, this.stop = function() {
            s.playing(!1)
        }, this.handlePopoverShow = function() {
            a.UndoManager && a.UndoManager.storeValues(s.animateTime, s.animateDate, s.animateLatitude, s.animateLongitude, s.daylightOnly, s.speed)
        }, this.handlePopoverHide = function() {
            t.animateTime = s.animateTime(), t.animateDate = s.animateDate(), t.animateLatitude = s.animateLatitude(), t.animateLongitude = s.animateLongitude(), t.daylightOnly = s.daylightOnly(), t.speed = +s.speed(), a.UndoManager && a.UndoManager.checkForChanges()
        }, this.set = function(t) {
            return pdKO.setWritableObservables(t, s), this
        }
    }, pdKO.SliderViewModel = function(e, r, n, i) {
        var a = this;

        function o(t) {
            return (+t).toFixed(3)
        }

        function s(t) {
            return (+t).toFixed(1) + "°"
        }

        function d(t) {
            return n.formatAsTime(t / 60)
        }

        function h(t) {
            return n.formatAsDate(t)
        }

        function l() {
            u(e.Camera.viewZoom, gl.orbitalView.zoomFactor)
        }

        function c(t) {
            switch (t = pd.toInteger(t, 0), gl.orbitalView && (4 == t ? gl.orbitalView.on("change", l) : gl.orbitalView.off("change", l)), t) {
                case 0:
                    r.index = t, i.set({
                        type: i.TYPE_NUMERIC,
                        observable: e.Location.latitude,
                        format: s,
                        title: "Site\nLatitude",
                        tickMajor: 15,
                        tickMinor: 5,
                        stepMajor: 15,
                        stepMinor: 1,
                        wrap: !1,
                        min: -90,
                        max: 90,
                        step: .1
                    });
                    break;
                case 1:
                    r.index = t, i.set({
                        type: i.TYPE_NUMERIC,
                        observable: e.Location.longitude,
                        format: s,
                        title: "Site\nLongitude",
                        tickMajor: 15,
                        tickMinor: 5,
                        stepMajor: 15,
                        stepMinor: 1,
                        wrap: r.wrap,
                        min: -180,
                        max: 180,
                        step: .1
                    });
                    break;
                case 2:
                    r.index = t, i.set({
                        type: i.TYPE_DATE,
                        observable: e.DateTime.dayOfYear,
                        format: h,
                        title: "Day of\nthe Year",
                        year: n.year(),
                        tickMajor: 28,
                        tickMinor: 7,
                        stepMajor: 10,
                        stepMinor: 1,
                        wrap: r.wrap,
                        min: 0,
                        max: 364,
                        step: 1
                    });
                    break;
                case 3:
                    r.index = t, i.set({
                        type: i.TYPE_TIME,
                        observable: e.DateTime.timeOfDay,
                        format: d,
                        title: "Time of\nthe Day",
                        tickMajor: 60,
                        tickMinor: 15,
                        stepMajor: 60,
                        stepMinor: 5,
                        wrap: r.wrap,
                        min: 0,
                        max: 1440,
                        step: 1
                    }), i.updateDayNight(n);
                    break;
                case 4:
                    r.index = t, i.set({
                        type: i.TYPE_NUMERIC,
                        observable: e.Camera.viewZoom,
                        format: o,
                        title: "View\nZoom",
                        tickMajor: .25,
                        tickMinor: .05,
                        stepMajor: .05,
                        stepMinor: .01,
                        wrap: r.wrap,
                        min: 0,
                        max: 3,
                        step: .001
                    })
            }
        }
        this.show = ko.observable(pd.toBoolean(r.show, !1)), this.show.subscribe(function(t) {
            r.show = !!t, i.show(r.show)
        }), this.toggle = function() {
            a.show(!a.show()), $("#btn-slider-toggle").blur()
        }, this.wrap = ko.observable(r.wrap || !1), this.wrap.subscribe(function(t) {
            r.wrap = !!t, i.wrap(r.wrap)
        }), this.detail = ko.observable(r.detail || !1), this.detail.subscribe(function(t) {
            r.detail = !!t, i.detailMode(r.detail)
        }), this.index = ko.observable(r.index || 0), this.index.subscribe(function(t) {
            c(t)
        }), this.setIndex = function(t) {
            a.index(t)
        }, this.set = function(t) {
            return pdKO.setWritableObservables(t, a), this
        }, c(r.index)
    }
}(), Date.prototype.isLeapYear = function() {
        var t = this.getFullYear();
        return 0 == (3 & t) && (t % 100 != 0 || t % 400 == 0)
    }, Date.prototype.getDOY = function() {
        var t = this.getMonth(),
            e = this.getDate() - 1,
            e = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][t] + e;
        return 1 < t && this.isLeapYear() && e++, e
    }, Date.prototype.setDOY = function(t) {
        var e = this.isLeapYear(this.getFullYear());
        t = pd.constrainTo(t, 0, e ? 365 : 364);
        for (var r = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], n = pd.constrainTo(Math.ceil(t / 30) + 1, 0, 11); 0 <= n; n--)
            if (r[n] <= t) return this.setMonth(Math.floor(pd.constrainTo(n, 0, 11))), void this.setDate(Math.floor(pd.constrainTo(t - r[n] + 1, 1, 31)));
        this.setMonth(0), this.setDate(1)
    }, pd.DateTime = function(t) {
        this.clockTime = 11, this.dayOfMonth = 21, this.monthOfYear = 2, this.year = 2018, t && this.copyFrom(t)
    }, pd.DateTime.prototype.copyFrom = function(t) {
        return t && pd.isObject(t) && ("clockTime" in t && (this.clockTime = Math.round(pd.constrainTo(pd.toNumber(t.clockTime, this.clockTime), 0, 24))), "dayOfMonth" in t && (this.dayOfMonth = pd.constrainTo(pd.toInteger(t.dayOfMonth, this.dayOfMonth), 0, 31)), "monthOfYear" in t && (this.monthOfYear = pd.constrainTo(pd.toInteger(t.monthOfYear, this.monthOfYear), 0, 11)), "year" in t && (this.year = pd.constrainTo(pd.toInteger(t.year, this.year), -4712, 3500))), this
    }, pd.DateTime.prototype.JSONSchema = function() {
        return {
            type: "object",
            description: "Defines a specific date and time.",
            properties: {
                clockTime: {
                    description: "The local clock time, in decimal hours (0.0 to 24.0).",
                    type: "number",
                    minimum: 0,
                    maximum: 24
                },
                dayOfMonth: {
                    description: "The day of the month component of the date (1 to 31).",
                    type: "integer",
                    minimum: 0,
                    maximum: 31
                },
                monthOfYear: {
                    description: "The month of the year component of the date (0 to 11).",
                    type: "integer",
                    minimum: 0,
                    maximum: 11
                },
                year: {
                    description: "The 4 digit year component of the date.",
                    type: "integer",
                    minimum: -4712,
                    maximum: 3500
                }
            }
        }
    }, pd.DateTime.DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], pd.DateTime.DAY_COUNT_LEAP_YEAR = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], pd.DateTime.DAY_COUNT = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], pd.DateTime.MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], pd.DateTime.isLeapYear = function(t) {
        return 0 == (3 & t) && (t % 100 != 0 || t % 400 == 0)
    }, pd.DateTime.getDOY = function(t, e, r) {
        return e = pd.constrainTo(e, 0, 11), (pd.DateTime.isLeapYear(r) ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT)[e] + t - 1
    }, pd.DateTime.getDayAndMonth = function(t, e) {
        var r = pd.DateTime.isLeapYear(e);
        t = pd.constrainTo(t, 0, r ? 365 : 364);
        for (var e = pd.constrainTo(Math.ceil(t / 30) + 1, 0, 11), n = r ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT, i = e; 0 <= i; i--) {
            if (t >= n[i]) return {
                month: Math.floor(pd.constrainTo(i, 0, 11)),
                day: Math.floor(pd.constrainTo(t - n[i] + 1, 1, 31))
            }
        }
        return {
            month: 0,
            day: 1
        }
    }, pd.DateTime.getMonthName = function(t) {
        return 0 <= t && t <= 11 ? pd.DateTime.MONTH_NAMES[t] : ""
    }, pd.DateTime.generateDateSuffix = function(t) {
        return (t = t || new Date).getFullYear() + "-" + ("0" + (t.getMonth() + 1)).slice(-2) + "-" + ("0" + t.getDate()).slice(-2) + "-" + ("0" + t.getHours()).slice(-2) + ("0" + t.getMinutes()).slice(-2) + "-" + ("0" + t.getSeconds()).slice(-2)
    }, pd.DateTime.snapToNearestMonth = function(t, e) {
        var e = pd.DateTime.isLeapYear(e),
            r = e ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT,
            e = e ? 365 : 364;
        t = pd.constrainTo(t, 0, e);
        for (var n = 0; n <= 12; ++n)
            if (t < r[n] + 15) return r[n];
        return e
    }, pd.DateTime.getMonthStartDay = function(t, e) {
        return t = pd.constrainTo(t, 0, 11), (pd.DateTime.isLeapYear(e) ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT)[t]
    }, pd.DateTime.getMonthEndDay = function(t, e) {
        var r = (t = pd.constrainTo(t, 0, 11) + 1) < 11 ? 1 : 0;
        return pd.DateTime.isLeapYear(e) ? pd.DateTime.DAY_COUNT_LEAP_YEAR[t] - r : pd.DateTime.DAY_COUNT[t] - r
    }, pd.DateTime.getDayCountArray = function(t) {
        return pd.DateTime.isLeapYear(t) ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT
    }, pd.DateTime.formatDate = function(t, e, r) {
        var n = pd.DateTime.isLeapYear(e);
        t = pd.constrainTo(t, 0, n ? 365 : 364);
        for (var i = pd.constrainTo(Math.ceil(t / 30) + 1, 0, 11), a = n ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT, o = i; 0 <= o; o--)
            if (t >= a[o]) {
                var s = Math.floor(pd.constrainTo(o, 0, 11)),
                    d = Math.floor(pd.constrainTo(t - a[o] + 1, 1, 31));
                return d < 10 && (d = "0" + d), r && 0 < e ? d + " " + pd.DateTime.MONTH_NAMES[s] + " " + e : d + " " + pd.DateTime.MONTH_NAMES[s]
            }
        return ""
    }, pd.DateTime.formatAsMMMDD = function(t, e) {
        var r = pd.DateTime.isLeapYear(e);
        t = pd.wrapAt(t, 0, r ? 366 : 365, !0);
        for (var e = pd.constrainTo(Math.ceil(t / 30) + 1, 0, 11), n = r ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT, i = e; 0 <= i; i--)
            if (t >= n[i]) {
                var a = Math.floor(pd.constrainTo(i, 0, 11)),
                    o = Math.floor(pd.constrainTo(t - n[i] + 1, 1, 31));
                return o < 10 && (o = "0" + o), pd.DateTime.MONTH_NAMES[a] + o
            }
        return ""
    }, pd.DateTime.formatMonthName = function(t) {
        return t = Math.floor(pd.constrainTo(t, 0, 11)), pd.DateTime.MONTH_NAMES[t]
    }, pd.DateTime.formatTime = function(t, e) {
        var r = pd.sign(t);
        if (23.9999 < (t = pd.wrapAt(t, 0, 24)) && (t = 0), e) {
            var e = 3600 * Math.abs(t),
                n = pd.constrainTo(Math.floor(t), 0, 24),
                i = pd.constrainTo(Math.floor(60 * (t - n)), 0, 60),
                e = pd.constrainTo(Math.round(e - (3600 * n + 60 * i)), 0, 60);
            return 59.5 < e && (i = i < 59 ? i + 1 : 0, e = 0), 59.5 < i && (n = n < 23 ? n + 1 : 0, i = 0), n < 10 && (n = "0" + n), i < 10 && (i = "0" + i), e < 10 && (e = "0" + e), r < 0 ? "-" + n + ":" + i + ":" + e : n + ":" + i + ":" + e
        }
        n = Math.floor(t);
        return 59.5 < (i = pd.constrainTo(Math.round(60 * (t - n)), 0, 60)) && (n = n < 23 ? n + 1 : 0, i = 0), n < 10 && (n = "0" + n), i < 10 && (i = "0" + i), r < 0 ? "-" + n + ":" + i : n + ":" + i
    }, pd.DateTime.formatDuration = function(t, e) {
        var r = pd.sign(t);
        if (t = Math.abs(t), e) {
            var n = Math.floor(t),
                e = 3600 * Math.abs(t),
                i = pd.constrainTo(Math.floor(60 * (t - n)), 0, 60),
                e = pd.constrainTo(Math.round(e - (3600 * n + 60 * i)), 0, 60);
            return 59.5 < e && (i = i < 59 ? i + 1 : 0, e = 0), 59.5 < i && (n = n < 23 ? n + 1 : 0, i = 0), n < 10 && (n = "0" + n), i < 10 && (i = "0" + i), e < 10 && (e = "0" + e), r < 0 ? "-" + n + ":" + i + ":" + e : n + ":" + i + ":" + e
        }
        n = Math.floor(t);
        return 59.5 < (i = pd.constrainTo(Math.round(60 * (t - n)), 0, 60)) && (n = n < 23 ? n + 1 : 0, i = 0), n < 10 && (n = "0" + n), i < 10 && (i = "0" + i), r < 0 ? "-" + n + ":" + i : n + ":" + i
    }, pd.DateTime.formatTimezone = function(t) {
        return 0 <= t ? "+" + pd.DateTime.formatDuration(t, !1) : pd.DateTime.formatDuration(t, !1)
    }, pd.DateTime.parseTime = function(t) {
        if ("" == t) return null;
        var e = 0,
            r = 0;
        if (0 <= t.indexOf(".") && t.indexOf(":") < 0) {
            var n = parseFloat(t);
            r = 60 * (n - (e = Math.floor(n)))
        } else {
            var i = t.match(/(\d+)(:(\d\d))?\s*(p|a?)/i);
            if (null == i) return null;
            24 < (e = parseInt(i[1], 10)) && (r = e, 0 < (e = Math.floor(r / 100)) && (r -= 100 * e), i[3] = r.toString()), 0 < i[4].length && ("a" == i[4] ? 12 == e && (e = 0) : e < 12 && (e += 12)), r = parseInt(i[3], 10) || 0
        }
        e = pd._fastWrap(e, 0, 24);
        i = new Date;
        return i.setHours(e), i.setMinutes(r), i.setSeconds(0, 0), i
    }, pd.DateTime.parseTimeToDecimalHours = function(t) {
        t = pd.DateTime.parseTime(t);
        return t ? pd.constrainTo(t.getHours() + t.getMinutes() / 60, 0, 24) : 0
    }, pd.DateTimeRange = function(t, e) {
        this.fromDay = 0, this.toDay = 365, this.fromTime = 0, this.toTime = 24, this.timeStep = 1 / 6, this.daysInTheYear = 365, this.sunriseToSunset = !1, this.solar = null, (t || e) && this.set(t, e)
    }, pd.DateTimeRange.prototype.sanityCheck = function(t) {
        var e = (t = t || this.solar) && t.isLeapYear && t.isLeapYear() ? 366 : 365;
        return this.daysInTheYear = e, this.solar = t, this.fromDay = pd.wrapAt(pd.toInteger(this.fromDay, 0), 0, e - 1), this.toDay = pd.wrapAt(pd.toInteger(this.toDay, e), 0, e), this.toDay < this.fromDay && (this.toDay += e), this.toDay - this.fromDay >= e && (this.toDay = this.fromDay + e - 1), this.fromTime = pd.wrapAt(pd.toNumber(this.fromTime, 0), 0, 24), this.toTime = pd.wrapAt(pd.toNumber(this.toTime, 24), 0, 24), this.toTime <= this.fromTime && (this.toTime += 24), 24 < this.toTime - this.fromTime && (this.toTime = this.fromTime + 24), this.timeStep = pd.constrainTo(pd.toNumber(this.timeStep, 1 / 6), 1 / 60, 24), this
    }, pd.DateTimeRange.prototype.set = function(t, e) {
        return "fromDay" in (t = t || {}) && (this.fromDay = t.fromDay), "toDay" in t && (this.toDay = t.toDay), "fromTime" in t && (this.fromTime = t.fromTime), "toTime" in t && (this.toTime = t.toTime), "timeStep" in t && (this.timeStep = t.timeStep), e = e || t.solar || this.solar, this.sanityCheck(e), this
    }, pd.DateTimeIterator = function(t, e) {
        pd.DateTimeRange.call(this, t, e), this.dayStartsAt = 0, this.dayEndsAt = 24, this.currentTime = 0, this.currentDay = 0, this.progressMax = 1, this.progress = 0, this.cancelled = !1, this.working = !1, (this.iterator = this).callbackCalculate = null, this.callbackOnTimeout = null, this.callbackOnComplete = null, (t || e) && this.init(t, e)
    }, pd.DateTimeIterator.prototype = Object.create(pd.DateTimeRange.prototype), pd.DateTimeIterator.prototype.constructor = pd.DateTimeIterator, pd.DateTimeIterator.prototype.reset = function(t, e) {
        t = t || null, this.solar || (this.solar = new pd.SolarPosition), e ? this.solar.copyLocation(e) : t.solar && this.solar.copyLocation(t.solar), this.set(t, this.solar), this.progressMax = Math.max(1, Math.round(this.toDay - this.fromDay) + 1), this.progress = 0, this.currentDay = this.fromDay;
        t = this.currentDay >= this.daysInTheYear ? this.currentDay - this.daysInTheYear : this.currentDay;
        this.solar.dayOfYear(t), this.sunriseToSunset ? (this.dayStartsAt = pd.snapTo(this.solar.sunriseTime() - .5 * this.timeStep, this.timeStep), this.dayEndsAt = pd.snapTo(this.solar.sunsetTime() + .5 * this.timeStep, this.timeStep), 24.01 < this.toTime ? (this.dayStartsAt += 24, this.fromTime > this.dayEndsAt ? this.currentTime = this.dayStartsAt - this.timeStep : this.currentTime = this.fromTime - this.timeStep) : (this.dayStartsAt = Math.max(this.fromTime, this.dayStartsAt), this.dayEndsAt = Math.min(this.toTime, this.dayEndsAt), this.currentTime = this.dayStartsAt - this.timeStep)) : (this.currentTime = -this.timeStep, this.dayStartsAt = 24, this.dayEndsAt = 24);
        t = 24 <= this.currentTime ? this.currentTime - 24 : this.currentTime;
        return this.solar.clockTime(t), this.working = !0, !(this.cancelled = !1)
    }, pd.DateTimeIterator.prototype.next = function() {
        var t = 24.01 < this.toTime ? this.toTime : this.dayEndsAt;
        if (this.cancelled) return null;
        if ((this.currentTime += this.timeStep) > t - this.timeStep) {
            if (++this.progress, ++this.currentDay, this.currentDay > this.toDay) return this.working = !1, this.cancelled = !1, this.progress = 1, null;
            var e = this.currentDay >= this.daysInTheYear ? this.currentDay - this.daysInTheYear : this.currentDay;
            this.solar.dayOfYear(e), this.dayStartsAt = pd.snapTo(this.solar.sunriseTime() - .5 * this.timeStep, this.timeStep), this.dayEndsAt = pd.snapTo(this.solar.sunsetTime() + .5 * this.timeStep, this.timeStep), this.fromTime >= this.toTime ? (this.dayStartsAt += 23.99, this.fromTime > this.dayEndsAt ? this.currentTime = this.dayStartsAt - this.timeStep : this.currentTime = this.fromTime - this.timeStep) : (this.dayStartsAt = Math.max(this.fromTime, this.dayStartsAt), this.dayEndsAt = Math.min(this.toTime, this.dayEndsAt), this.currentTime = this.dayStartsAt - this.timeStep)
        }
        e = 24 <= this.currentTime ? this.currentTime - 24 : this.currentTime;
        return this.solar.clockTime(e), this
    }, pd.DateTimeIterator.prototype.getProgress = function() {
        return this.progress / this.progressMax
    },
    function() {
        var Z = 2 * Math.PI,
            Q = Math.PI / 180,
            J = 180 / Math.PI,
            tt = [0, -.014543897651582, -.104528463267654, -.207911690817759, -.309016994374947];

        function et(t, e, r) {
            return t < e ? t + (r - e) : r < t ? t - (r - e) : t
        }

        function e(t) {
            return "ERROR: '" + t + "' property is read-only."
        }

        function a(t) {
            return (357.52911 + t * (35999.05029 - 1537e-7 * t)) * Q
        }

        function o(t) {
            t = (280.46646 + t * (36000.76983 + 3032e-7 * t)) % 360;
            return (t < 0 ? 360 + t : t) * Q
        }

        function r(t) {
            return o(t) + (t = a(e = t), (Math.sin(t) * (1.914602 - e * (.004817 + 14e-6 * e)) + Math.sin(t + t) * (.019993 - 101e-6 * e) + 289e-6 * Math.sin(t + t + t)) * Q);
            var e
        }

        function s(t) {
            return (23 + (26 + (21.448 - (e = t) * (46.815 + e * (59e-5 - .001813 * e))) / 60) / 60) * Q + .00256 * Math.cos((125.04 - 1934.136 * t) * Q) * Q;
            var e
        }

        function rt(t, e, r) {
            ++e <= 2 && (e += 12, --r);
            var n = Math.floor(--r / 100),
                n = 2 - n + Math.floor(n / 4);
            return (Math.floor(365.25 * (r + 4716)) + Math.floor(30.6001 * (e + 1)) + t + n - 1524.5 - 2451545) / 36525
        }

        function nt(t) {
            return Math.asin(Math.sin(s(t)) * Math.sin(r(t = t) - (.00569 + .00478 * Math.sin((125.04 - 1934.136 * t) * Q)) * Q))
        }

        function it(t) {
            var e = .016708634 - (i = t) * (42037e-9 + 1.267e-7 * i),
                r = a(t),
                n = o(t),
                i = Math.tan(s(t) / 2);
            i *= i;
            t = Math.sin(r);
            return 4 * (i * Math.sin(2 * n) - 2 * e * t + 4 * e * i * t * Math.cos(2 * n) - .5 * i * i * Math.sin(4 * n) - 1.25 * e * e * Math.sin(2 * r))
        }

        function n(t) {
            var e = Math.floor(t + .5),
                r = t + .5 - e,
                n = e < 2299161 ? e : e + 1 + (o = Math.floor((e - 1867216.25) / 36524.25)) - Math.floor(o / 4),
                i = n + 1524,
                a = Math.floor((i - 122.1) / 365.25),
                t = Math.floor(365.25 * a),
                e = Math.floor((i - t) / 30.6001),
                o = i - t - Math.floor(30.6001 * e) + r,
                n = e - (e < 13.5 ? 1 : 13),
                i = a - (2.5 < n ? 4716 : 4715),
                t = Math.floor(o),
                r = 24 * (o - t),
                e = Math.floor(r),
                a = 60 * (r - e),
                o = Math.floor(a),
                r = Math.floor(60 * (a - o)),
                a = pd.DateTime.getDOY(t, n - 1, i),
                o = e + o / 60 + (r - (e = [121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46, 44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12, 11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12, 11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7, 1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6, -6.3, -6.5, -6.2, -4.7, -2.8, -.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16, 18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7, 24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2, 33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5, 52.5, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 63.8, 64.3], o = 0, i = ((r = i) - 2e3) / 100, 1620 <= r && r <= 2002 ? o = r % 2 ? (e[(r - 1620 - 1) / 2] + e[(r - 1620 + 1) / 2]) / 2 : e[(r - 1620) / 2] : r < 948 ? o = 2177 + 497 * i + 44.1 * Math.pow(i, 2) : 948 <= r && (o = 102 + 102 * i + 25.3 * Math.pow(i, 2), 2e3 <= r && r <= 2100 && (o += .37 * (r - 2100))), o)) / 3600;
            return 24 < o && (o -= 24, a++, t++), o < 0 && (o += 24, a--, t--), {
                dayOfYear: a,
                timeOfDay: o,
                month: n - 1,
                day: t
            }
        }

        function at(t, e) {
            var r = 0,
                e = (e - 2e3) / 1e3;
            switch (t) {
                case 0:
                    r = 2451623.80984 + 365242.37404 * e + .05169 * Math.pow(e, 2) - .00411 * Math.pow(e, 3) - 57e-5 * Math.pow(e, 4);
                    break;
                case 1:
                    r = 2451716.56767 + 365241.62603 * e + .00325 * Math.pow(e, 2) + .00888 * Math.pow(e, 3) - 3e-4 * Math.pow(e, 4);
                    break;
                case 2:
                    r = 2451810.21715 + 365242.01767 * e - .11575 * Math.pow(e, 2) + .00337 * Math.pow(e, 3) + 78e-5 * Math.pow(e, 4);
                    break;
                case 3:
                    r = 2451900.05952 + 365242.74049 * e - .06223 * Math.pow(e, 2) - .00823 * Math.pow(e, 3) + 32e-5 * Math.pow(e, 4)
            }
            t = (r - 2451545) / 36525, e = 35999.373 * t - 2.47, e = 1 + .0334 * pd.cosDegrees(e) + 7e-4 * pd.cosDegrees(2 * e);
            return n(r + 1e-5 * function(t) {
                for (var e = [485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8], r = [324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02, 247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45], n = [1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074], i = 0, a = 0; a < 24; ++a) i += e[a] * pd.cosDegrees(r[a] + n[a] * t);
                return i
            }(t) / e)
        }
        pd.Location = function(t) {
            this.latitude = 54.15197, this.longitude = -4.48524, this.timezone = 0, this.northOffset = 0, this.elevation = 75, t && this.copyFrom(t)
        }, pd.Location.prototype.copyFrom = function(t) {
            return t && pd.isObject(t) && ("latitude" in t && (this.latitude = pd.constrainTo(pd.toNumber(t.latitude, this.latitude), -90, 90)), "longitude" in t && (this.longitude = pd.constrainTo(pd.toNumber(t.longitude, this.longitude), -180, 180)), "timezone" in t && (this.timezone = pd.constrainTo(pd.toNumber(t.timezone, this.timezone), -13, 13)), "northOffset" in t && (this.northOffset = pd.constrainTo(pd.toNumber(t.northOffset, this.northOffset), -180, 180)), "elevation" in t && (this.elevation = pd.constrainTo(pd.toNumber(t.elevation, this.elevation), -400, 1e4))), this
        }, pd.Location.prototype.JSONSchema = function() {
            return {
                type: "object",
                description: "Defines a terrestrial location.",
                properties: {
                    latitude: {
                        description: "The terrestrial latitude of the current location, in decimal degrees.",
                        type: "number",
                        minimum: -90,
                        maximum: 90
                    },
                    longitude: {
                        description: "The terrestrial longitude of the current location, in decimal degrees.",
                        type: "number",
                        minimum: -180,
                        maximum: 180
                    },
                    timezone: {
                        description: "The local time zone at the current location, in decimal hours.",
                        type: "number",
                        minimum: -13,
                        maximum: 13
                    },
                    northOffset: {
                        description: "The angle between north and the +Y axis, in decimal degrees.",
                        type: "number",
                        minimum: -180,
                        maximum: 180
                    },
                    elevation: {
                        description: "The average height of the site above sea level, in metres.",
                        type: "number",
                        minimum: -400,
                        maximum: 1e4
                    }
                }
            }
        }, pd.SolarPosition = function(t) {
            t = t || {};
            var h = this,
                i = !0,
                a = !0,
                o = pd.toNumber(t.latitude, 54.15197),
                s = pd.toNumber(t.longitude, -4.48524),
                d = pd.toNumber(t.timezone, 0),
                l = pd.toNumber(t.northOffset, 0),
                n = 15 * d,
                c = n / 15,
                u = (s - n) / 15,
                p = s * Q,
                f = o * Q,
                m = Math.cos(f),
                g = Math.sin(f),
                y = 0,
                v = 1,
                D = 3,
                b = (new Date).getFullYear(),
                x = 10,
                M = 90,
                T = 0,
                A = 0,
                w = 0,
                O = 0,
                V = 0,
                C = 0,
                S = [0, 0, 0, 0, 0],
                N = [24, 24, 24, 24, 24],
                k = pd.toBoolean(t.interpolateDeclination, !1),
                I = 0,
                P = 0,
                E = 0,
                _ = 0,
                L = 0,
                R = 0,
                B = 0,
                F = 0,
                z = 0,
                Y = 0,
                U = 0,
                q = 0,
                r = null,
                H = null,
                j = null,
                G = null;

            function W() {
                k ? (I = rt(v, D, b), E = nt(I), z = it(I), L = Math.cos(E), R = Math.sin(E), P = rt(v + 1, D, b), _ = nt(P), Y = it(P), B = Math.cos(_), F = Math.sin(_), T = .5 * (I + P), A = .5 * (E + _), w = .5 * (L + B), O = .5 * (R + F), V = .5 * (z + Y)) : (T = rt(v, D, b), A = nt(T), V = it(T), w = Math.cos(A), O = Math.sin(A)), C = 12 - V - u + y;
                for (var t, e = g * O, r = m * w, n = 0; n < 5; ++n)(t = (t = (tt[n] - e) / r) <= -1 ? 12 : 1 <= t ? 0 : Math.acos(t) / .26179938779915) < 11.999 ? (S[n] = pd.constrainTo(C - t, 0, 24), N[n] = pd.constrainTo(C + t, 0, 24)) : (S[n] = 0, N[n] = 24);
                i = !1
            }

            function K() {
                r = x, k && (T = (r = 1 - (n = r / 24)) * I + n * P, A = r * E + n * _, w = r * L + n * B, O = r * R + n * F, V = r * z + n * Y);
                var t = ((x - c + V) / 24 * Z + p) % Z - Math.PI,
                    e = Math.acos(Math.max(-1, Math.min(1, g * O + m * w * Math.cos(t)))),
                    r = m * Math.sin(e);
                t < -Math.PI && (t += Z), 1e-6 < Math.abs(r) && (t = (0 < t ? -1 : 1) * (Math.PI - Math.acos(Math.max(-1, Math.min(1, (g * Math.cos(e) - O) / r))))), t < 0 && (t += Z);
                var n = 90 - e * J;
                n <= 85 && (r = Math.tan(n * Q), e -= (5 < n ? 58.1 / r - .07 / (r * r * r) + 86e-6 / (r * r * r * r * r) : -.575 < n ? 1735 + n * (n * (103.4 + n * (.711 * n - 12.79)) - 518.2) : -20.774 / r) / 3600 * Q), U = et(90 - e * J, -180, 180), q = et(t * J, -180, 180), a = !1
            }

            function X() {
                i ? (W(), K()) : a && K()
            }

            function $(t, e, r, n) {
                r *= Q, n *= Q;
                var i = e * Math.cos(n);
                return [t[0] + i * Math.sin(r), t[1] + i * Math.cos(r), t[2] + e * Math.sin(n)]
            }
            this.calculate = function() {
                return X(), this
            }, this.getSunAnglesArray = function(t) {
                return X(), t ? (t[0] = q, t[1] = U) : t = [q, U], t
            }, this.getSunAnglesObject = function() {
                return X(), {
                    azi: q,
                    alt: U
                }
            }, this.getSunDirection = function(t) {
                X();
                var e = q * Q,
                    r = U * Q,
                    n = Math.cos(r);
                return pd.isArray(t) || (t = []), t[0] = n * Math.sin(e), t[1] = n * Math.cos(e), t[2] = Math.sin(r), t
            }, this.getSunDirectionWithNorthOffset = function(t) {
                X();
                var e = (q + l) * Q,
                    r = U * Q,
                    n = Math.cos(r);
                return pd.isArray(t) || (t = []), t[0] = n * Math.sin(e), t[1] = n * Math.cos(e), t[2] = Math.sin(r), t
            }, this.getDateObject = function() {
                var t = b,
                    e = pd.constrainTo(D, 0, 11),
                    r = v,
                    n = x - d;
                n < 0 ? (n = et(n, 0, 24), --r < 0 && (--e < 0 && (e = 11, --t), r = (pd.DateTime.isLeapYear(t) ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT)[e] - 1)) : 24 <= n && (n = et(n, 0, 24), ++r >= (pd.DateTime.isLeapYear(t) ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT)[e] && (11 < ++e && (e = 0, ++t), r = 0));
                var i = pd.constrainTo(Math.floor(n), 0, 24),
                    n = pd.constrainTo(Math.round(60 * (n - i)), 0, 60);
                return 59.5 < n && (i = i < 23 ? i + 1 : 0, n = 0), new Date(Date.UTC(t, e, r, i, n, 0))
            }, this.copyLocation = function(t) {
                var e, r, n;
                return t && pd.isObject(t) && (t instanceof pd.SolarPosition ? (this.setLocation(t.latitude(), t.longitude(), t.timezone()), this.northOffset(t.northOffset()), this.setDayMonthYear(t.dayOfMonth(), t.monthOfYear(), t.year())) : (e = o, r = s, n = d, "latitude" in t && (e = pd.constrainTo(pd.toNumber(t.latitude, e), -90, 90)), "longitude" in t && (r = pd.constrainTo(pd.toNumber(t.longitude, r), -180, 180)), "timezone" in t && (n = pd.constrainTo(pd.toNumber(t.timezone, n), -13, 13)), "northOffset" in t && (t = pd.constrainTo(pd.toNumber(t.northOffset, this.northOffset()), -180, 180), this.northOffset(t)), this.setLocation(o, s, d))), this
            }, this.setLocation = function(t, e, r) {
                if (arguments.length < 2) throw new Error("This method requires at least latitude and longitude as arguments.");
                return t = pd.constrainTo(pd.toNumber(t, o), -89.9, 89.9), e = et(pd.toNumber(e, s), -180, 180), r = pd.toNumber(r, this.calcDefaultTimezone(e)), pd.closeTo(o, t, 1e-6) && pd.closeTo(s, e, 1e-6) && pd.closeTo(d, r, 1 / 3600) || (i = !0), c = (n = 15 * (d = r)) / 15, u = ((s = e) - n) / 15, p = s * Q, f = (o = t) * Q, m = Math.cos(f), g = Math.sin(f), y = 0, this
            }, this.setDateTime = function(t) {
                return t && !isNaN(t.getTime()) && (h.setDayMonthYear(t.getDate(), t.getMonth(), t.getFullYear()), h.setTime(t)), this
            }, this.setDate = function(t) {
                return t && !isNaN(t.getTime()) && h.setDayMonthYear(t.getDate(), t.getMonth(), t.getFullYear()), this
            }, this.setTime = function(t) {
                return t && !isNaN(t.getTime()) && h.setTimeOfDay(t.getHours() + t.getMinutes() / 60 + t.getSeconds() / 3600), this
            }, this.setDayOfYear = function(t, e) {
                e = pd.toNumber(e, b), t = pd.constrainTo(t, 0, pd.DateTime.isLeapYear(e) ? 365 : 364);
                for (var r = pd.constrainTo(Math.ceil(t / 30) + 1, 0, 11), n = pd.DateTime.isLeapYear(e) ? pd.DateTime.DAY_COUNT_LEAP_YEAR : pd.DateTime.DAY_COUNT, i = r; 0 <= i; i--)
                    if (t >= n[i]) {
                        h.setDayMonthYear(t - n[i] + 1, i, e);
                        break
                    }
                return this
            }, this.setDayMonthYear = function(t, e, r) {
                return r = Math.floor(pd.constrainTo(r, -4712, 3500)), e = Math.floor(e), t = Math.floor(t), v == t && D == e && b == r || (M = -1, i = !0), v = t, D = e, b = r, this
            }, this.setTimeOfDay = function(t) {
                return t = pd.constrainTo(t, 0, 24), pd.closeTo(x, t, 1 / 3600) || (a = !0), x = t, this
            }, this.setDateTimeAndGetArray = function(t) {
                return t && !isNaN(t.getTime()) && (h.setDayMonthYear(t.getDate(), t.getMonth(), t.getFullYear()), h.setTime(t)), this.getSunAnglesArray()
            }, this.setTimeAndGetArray = function(t) {
                return this.setTime(t).getSunAnglesArray()
            }, this.setTimeOfDayAndGetArray = function(t) {
                return this.setTimeOfDay(t).getSunAnglesArray()
            }, this.getSolarPosition = function(t, e) {
                return $(t, e, q + l, U)
            }, this.getDailySunPathSegmentsAsArray = function(t, e, r) {
                var n = [
                        []
                    ],
                    i = n[0];
                r = pd.constrainTo(pd.toNumber(r, .25), 1 / 60, 6), t = pd.constrainTo(pd.toNumber(t, 0), 0, 24), (e = pd.constrainTo(pd.toNumber(e, 24), 0, 24)) <= t && (e = 24), X();
                for (var a = t; a < e; a += r) h.setTimeOfDay(a), K(), i.push([q, U]);
                return h.setTimeOfDay(e), K(), i.push([q, U]), n
            }, this.getAnalemmaSunPathsAsArray = function(t, e, r, n) {
                var i = [];
                t = pd.constrainTo(pd.toInteger(t, 7), 1, 90), n = pd.constrainTo(pd.toNumber(n, 1), 1 / 60, 6), e = pd.constrainTo(pd.toNumber(e, 0), 0, 24), (r = pd.constrainTo(pd.toNumber(r, 24), 0, 24)) <= e && (r = 24);
                for (var a, o = e; o < r; o += n) i.push([]), 0;
                for (var s = pd.DateTime.isLeapYear(b) ? 365 : 364, d = 0; d <= s; d += t) {
                    this.setDayOfYear(d, b), X(), a = 0;
                    for (o = e; o < r; o += n) h.setTimeOfDay(et(o, 0, 24)), K(), i[a].push([q, U]), a++
                }
                this.setDayOfYear(0, b), X(), a = 0;
                for (o = e; o < r; o += n) h.setTimeOfDay(et(o, 0, 24)), K(), i[a].push([q, U]), a++;
                return i
            }, this.getHourlySunPathAsArray = function(t, e, r) {
                var n = [];
                r = pd.constrainTo(pd.toNumber(r, .25), 1 / 60, 6), t = pd.constrainTo(pd.toNumber(t, 0), 0, 24), (e = pd.constrainTo(pd.toNumber(e, 24), 0, 24)) <= t && (e = 24), this.setTimeOfDay(t), X(), n.push([q, U]);
                for (var i = t = pd.snapTo(t + r, r); i < e; i += r) this.setTimeOfDay(i), K(), n.push([q, U]);
                return this.setTimeOfDay(end), K(), n.push([q, U]), n
            }, this.getHourlySunPathAsPositions3D = function(t, e, r, n, i) {
                var a = (i = i || {
                    vertices: [],
                    lines: []
                }).vertices.length;
                t = pd.constrainTo(pd.toNumber(t, .25), 1 / 60, 6), this.setTimeOfDay(0), X(), i.vertices.push($(e, r, q, U));
                for (var o = t; o < 24; o += t) this.setTimeOfDay(o), K(), i.vertices.push($(e, r, q, U)), (n || a % 2) && i.lines.push([a, a + 1]), a++;
                return this.setTimeOfDay(24), K(), i.vertices.push($(e, r, q, U)), i.lines.push([a, ++a]), i
            }, this.reuseHourlySunPathAsPositions3D = function(t, e, r, n, i) {
                var a, o;
                if (!i || !i.vertices) return this.getHourlySunPathAsPositions3D(t, e, r, n, null);
                t = pd.constrainTo(pd.toNumber(t, .25), 1 / 60, 6), this.setTimeOfDay(0), X(), a = i.addVertex($(e, r, q, U));
                for (var s = t; s < 24; s += t) this.setTimeOfDay(s), K(), o = i.addVertex($(e, r, q, U)), (n || a % 2) && i.addLine(a, o), a = o;
                return (n || a % 2) && (this.setTimeOfDay(24), K(), o = i.addVertex($(e, r, q, U)), i.addLine(a, o)), i
            }, this.getAnalemmaSunPathAsArray = function(t) {
                var e = [];
                t = pd.constrainTo(pd.toInteger(t, 7), 1, 90), this.setDayOfYear(0, b), X(), e.push([q, U]);
                for (var r = t; r <= 364; r += t) this.setDayOfYear(r, b), W(), K(), e.push([q, U]);
                return this.setDayOfYear(0, b), W(), K(), e.push([q, U]), e
            }, this.getAnalemmaSunPathAsPositions3D = function(t, e, r, n, i) {
                t = pd.constrainTo(pd.toInteger(t, 7), 1, 90);
                var a = (i = i || {
                    vertices: [],
                    lines: []
                }).vertices.length;
                this.setDayOfYear(0, b), W(), K();
                var o = $(e, r, q, U);
                i.vertices.push(o);
                for (var s = 0; s <= 364; s += t) this.setDayOfYear(s, b), W(), K(), i.vertices.push($(e, r, q, U)), (n || a % 2) && i.lines.push([a, a + 1]), a++;
                return i.vertices.push(o), i.lines.push([a, ++a]), i
            }, this.getSunriseSunsetAsObjectArray = function(t, e) {
                t = pd.constrainTo(pd.toInteger(t, 7), 1, 90);
                var r = pd.DateTime.isLeapYear(b) ? 365 : 364;
                e = e || [];
                for (var n = 0; n < r; n += t) this.setDayOfYear(n, b), W(), e.push({
                    dayOfYear: n,
                    solarNoon: C,
                    sunrise: S[1],
                    sunset: N[1],
                    civilDawn: S[2],
                    civilDusk: N[2],
                    nauticalDawn: S[3],
                    nauticalDusk: N[3],
                    astronomicalDawn: S[4],
                    astronomicalDusk: N[4]
                });
                return this.setDayOfYear(r, b), W(), e.push({
                    dayOfYear: n,
                    solarNoon: C,
                    sunrise: S[1],
                    sunset: N[1],
                    civilDawn: S[2],
                    civilDusk: N[2],
                    nauticalDawn: S[3],
                    nauticalDusk: N[3],
                    astronomicalDawn: S[4],
                    astronomicalDusk: N[4]
                }), e
            }, this.twilight = {
                SOLAR_DISK_CENTER: 0,
                SOLAR_DISK_TOP_WITH_ATM_REFRACTION: 1,
                CIVIL: 2,
                NAUTICAL: 3,
                ASTRONOMICAL: 4
            }, this.getDuskDawnData = function() {
                return X(), {
                    solarNoon: C,
                    sunrise: S[1],
                    sunset: N[1],
                    civilDawn: S[2],
                    civilDusk: N[2],
                    nauticalDawn: S[3],
                    nauticalDusk: N[3],
                    astronomicalDawn: S[4],
                    astronomicalDusk: N[4]
                }
            }, this.getDawnTime = function(t) {
                if (t < this.twilight.SOLAR_DISK_CENTER || t > this.twilight.ASTRONOMICAL) throw "ERROR: 'stage' parameter must be between twilight.SOLAR_DISK_CENTER and twilight.ASTRONOMICAL, inclusive.";
                return X(), S[t]
            }, this.getDuskTime = function(t) {
                if (t < this.twilight.SOLAR_DISK_CENTER || t > this.twilight.ASTRONOMICAL) throw "ERROR: 'stage' parameter must be between twilight.SOLAR_DISK_CENTER and twilight.ASTRONOMICAL, inclusive.";
                return X(), N[t]
            }, this.latitude = function(t) {
                if (!arguments.length) return o;
                var e = pd.constrainTo(pd.toNumber(t, o), -89.9, 89.9);
                return pd.closeTo(o, e, 1e-6) || (i = !0), f = (o = e) * Q, m = Math.cos(f), g = Math.sin(f), this
            }, this.longitude = function(t) {
                if (!arguments.length) return s;
                var e = et(pd.toNumber(t, s), -180, 180);
                return pd.closeTo(s, e, 1e-6) || (i = !0), s = e, d = this.calcDefaultTimezone(s), c = (n = 15 * d) / 15, u = (s - n) / 15, p = s * Q, this
            }, this.timezone = function(t) {
                if (!arguments.length) return d;
                var e = pd.constrainTo(pd.toNumber(t, d), -14, 14);
                return pd.closeTo(d, e, 1 / 3600) || (i = !0), c = (n = 15 * (d = e)) / 15, u = (s - n) / 15, this
            }, this.northOffset = function(t) {
                return arguments.length ? (l = et(pd.toNumber(t, l), -180, 180), this) : l
            }, this.dayOfMonth = function(t) {
                if (!arguments.length) return v;
                var e = pd.constrainTo(pd.toInteger(t, v), 1, 31);
                return v != e && (M = -1, i = !0), v = e, this
            }, this.monthOfYear = function(t) {
                if (!arguments.length) return D;
                var e = pd.constrainTo(pd.toInteger(t, D), 0, 11);
                return D != e && (M = -1, i = !0), D = e, this
            }, this.year = function(t) {
                if (!arguments.length) return b;
                var e = pd.toInteger(t, b),
                    e = Math.floor(pd.constrainTo(e, -4712, 3500));
                return b != e && (j = j && at(0, e), H = H && at(1, e), G = G && at(2, e), r = r && at(3, e), M = -1, i = !0), b = e, this
            }, this.dayOfYear = function(t) {
                return arguments.length ? (h.setDayOfYear(pd.toInteger(t, M), b), this) : (M < 0 && (M = pd.DateTime.getDOY(v, D, b)), M)
            }, this.clockTime = function(t) {
                return arguments.length ? (h.setTimeOfDay(et(pd.toNumber(t, x), 0, 24)), this) : x
            }, this.clockTimeUTC = function(t) {
                return arguments.length ? (pd.isNumeric(t) && h.setTimeOfDay(pd.constrainTo(parseFloat(t) + d, 0, 24)), this) : x - d
            }, this.solarTime = function(t) {
                return X(), arguments.length ? (pd.isNumeric(t) && (e = parseFloat(t) - V - u + y, h.setTimeOfDay(et(e, 0, 24))), this) : x + V + u - y;
                var e
            }, this.solarTimeUTC = function(t) {
                return arguments.length ? (pd.isNumeric(t) && this.solarTime(parseFloat(t) + d), this) : this.solarTime() - d
            }, this.isLeapYear = function() {
                if (arguments.length) throw e("isLeapYear");
                return pd.DateTime.isLeapYear(b)
            }, this.dateAsString = function() {
                if (arguments.length) throw e("dateAsString");
                return this.formatAsDate(this.dayOfYear(), b)
            }, this.timeAsString = function() {
                if (arguments.length) throw e("timeAsString");
                return this.formatAsTime(this.clockTime())
            }, this.datetimeAsString = function() {
                if (arguments.length) throw e("datetimeAsString");
                return this.formatAsTime(this.clockTime()) + " " + this.formatAsDate(this.dayOfYear(), b)
            }, this.timezoneAsString = function() {
                if (arguments.length) throw e("timeAsString");
                var t = d;
                return 0 <= t ? "+" + this.formatAsDuration(t) : this.formatAsDuration(t)
            }, this.solarNoon = function() {
                if (arguments.length) throw e("solarNoon");
                return X(), C
            }, this.timezoneCorrection = function() {
                if (arguments.length) throw e("timezoneCorrection");
                return u - y
            }, this.sunriseTime = function() {
                if (arguments.length) throw e("sunriseTime");
                return X(), S[this.twilight.SOLAR_DISK_TOP_WITH_ATM_REFRACTION]
            }, this.sunsetTime = function() {
                if (arguments.length) throw e("sunsetTime");
                return X(), N[this.twilight.SOLAR_DISK_TOP_WITH_ATM_REFRACTION]
            }, this.azimuthAngle = function() {
                if (arguments.length) throw e("azimuthAngle");
                return X(), q
            }, this.altitudeAngle = function() {
                if (arguments.length) throw e("altitudeAngle");
                return X(), U
            }, this.declinationAngle = function() {
                if (arguments.length) throw e("declinationAngle");
                return X(), A * J
            }, this.hourAngle = function() {
                if (arguments.length) throw e("hourAngle");
                return (12 - h.solarTime()) / 24 * 360
            }, this.hourAngleSolarUTC = function() {
                if (arguments.length) throw e("hourAngleWithTimeZoneOffset");
                return (12 - (x + V - d)) / 24 * 360
            }, this.eqnOfTime = function() {
                if (arguments.length) throw e("eqnOfTime");
                return V
            }, this.calcDefaultTimezone = function(t) {
                return pd.snapTo(t, 15) / 15
            }, this.calcDayOfYearIndex = function(t, e, r) {
                return pd.DateTime.getDOY(t, e, r)
            }, this.formatAsTime = function(t, e) {
                return t = pd.toNumber(t, x), pd.DateTime.formatTime(t, e)
            }, this.formatAsDuration = function(t, e) {
                return t = pd.toNumber(t, x), pd.DateTime.formatDuration(t, e)
            }, this.formatAsTimezone = function(t) {
                t = pd.toNumber(t, d), pd.DateTime.formatTimezone(t)
            }, this.formatAsDate = function(t, e) {
                return pd.DateTime.formatDate(t, e || b, null != e)
            }, this.getEquinoxMar = function() {
                return null == j && (j = at(0, b)), j
            }, this.getSolsticeJun = function() {
                return null == H && (H = at(1, b)), H
            }, this.getEquinoxSep = function() {
                return null == G && (G = at(2, b)), G
            }, this.getSolsticeDec = function() {
                return null == r && (r = at(3, b)), r
            }
        }
    }();