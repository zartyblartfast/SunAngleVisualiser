(this.L = this.L || {}),
    (this.L.Control = this.L.Control || {}),
    (this.L.Control.Geocoder = (function (d) {
        "use strict";
        d = d && d.hasOwnProperty("default") ? d.default : d;
        var a = 0,
            n = /[&<>"'`]/g,
            i = /[&<>"'`]/,
            t = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" };
        function r(e) {
            return t[e];
        }
        function o(e, t, o, s, n) {
            var i = "_l_geocoder_" + a++;
            (t[n || "callback"] = i), (window[i] = d.Util.bind(o, s));
            var r = document.createElement("script");
            (r.type = "text/javascript"), (r.src = e + l(t)), (r.id = i), document.getElementsByTagName("head")[0].appendChild(r);
        }
        function u(e, t, o) {
            var s = new XMLHttpRequest();
            (s.onreadystatechange = function () {
                if (4 === s.readyState) {
                    var t;
                    if (200 !== s.status && 304 !== s.status) t = "";
                    else if ("string" == typeof s.response)
                        try {
                            t = JSON.parse(s.response);
                        } catch (e) {
                            t = s.response;
                        }
                    else t = s.response;
                    o(t);
                }
            }),
                s.open("GET", e + l(t), !0),
                (s.responseType = "json"),
                s.setRequestHeader("Accept", "application/json"),
                s.send(null);
        }
        function s(e, s) {
            return e.replace(/\{ *([\w_]+) *\}/g, function (e, t) {
                var o = s[t];
                return (
                    void 0 === o ? (o = "") : "function" == typeof o && (o = o(s)),
                    (function (e) {
                        return null == e ? "" : e ? ((e = "" + e), i.test(e) ? e.replace(n, r) : e) : e + "";
                    })(o)
                );
            });
        }
        function l(e, t, o) {
            var s = [];
            for (var n in e) {
                var i = encodeURIComponent(o ? n.toUpperCase() : n),
                    r = e[n];
                if (d.Util.isArray(r)) for (var a = 0; a < r.length; a++) s.push(i + "=" + encodeURIComponent(r[a]));
                else s.push(i + "=" + encodeURIComponent(r));
            }
            return (t && -1 !== t.indexOf("?") ? "&" : "?") + s.join("&");
        }
        var c = d.Class.extend({
            options: { service_url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" },
            initialize: function (e, t) {
                d.setOptions(this, t), (this._accessToken = e);
            },
            geocode: function (e, r, a) {
                var t = { SingleLine: e, outFields: "Addr_Type", forStorage: !1, maxLocations: 10, f: "json" };
                this._key && this._key.length && (t.token = this._key),
                    u(this.options.service_url + "/findAddressCandidates", d.extend(t, this.options.geocodingQueryParams), function (e) {
                        var t,
                            o,
                            s,
                            n = [];
                        if (e.candidates && e.candidates.length)
                            for (var i = 0; i <= e.candidates.length - 1; i++)
                                (t = e.candidates[i]),
                                    (o = d.latLng(t.location.y, t.location.x)),
                                    (s = d.latLngBounds(d.latLng(t.extent.ymax, t.extent.xmax), d.latLng(t.extent.ymin, t.extent.xmin))),
                                    (n[i] = { name: t.address, bbox: s, center: o });
                        r.call(a, n);
                    });
            },
            suggest: function (e, t, o) {
                return this.geocode(e, t, o);
            },
            reverse: function (e, t, s, n) {
                var o = { location: encodeURIComponent(e.lng) + "," + encodeURIComponent(e.lat), distance: 100, f: "json" };
                u(this.options.service_url + "/reverseGeocode", o, function (e) {
                    var t,
                        o = [];
                    e && !e.error && ((t = d.latLng(e.location.y, e.location.x)), o.push({ name: e.address.Match_addr, center: t, bounds: d.latLngBounds(t, t) })), s.call(n, o);
                });
            },
        });
        var p = d.Class.extend({
            initialize: function (e) {
                this.key = e;
            },
            geocode: function (e, i, r) {
                o(
                    "https://dev.virtualearth.net/REST/v1/Locations",
                    { query: e, key: this.key },
                    function (e) {
                        var t = [];
                        if (0 < e.resourceSets.length)
                            for (var o = e.resourceSets[0].resources.length - 1; 0 <= o; o--) {
                                var s = e.resourceSets[0].resources[o],
                                    n = s.bbox;
                                t[o] = { name: s.name, bbox: d.latLngBounds([n[0], n[1]], [n[2], n[3]]), center: d.latLng(s.point.coordinates) };
                            }
                        i.call(r, t);
                    },
                    this,
                    "jsonp"
                );
            },
            reverse: function (e, t, i, r) {
                o(
                    "//dev.virtualearth.net/REST/v1/Locations/" + e.lat + "," + e.lng,
                    { key: this.key },
                    function (e) {
                        for (var t = [], o = e.resourceSets[0].resources.length - 1; 0 <= o; o--) {
                            var s = e.resourceSets[0].resources[o],
                                n = s.bbox;
                            t[o] = { name: s.name, bbox: d.latLngBounds([n[0], n[1]], [n[2], n[3]]), center: d.latLng(s.point.coordinates) };
                        }
                        i.call(r, t);
                    },
                    this,
                    "jsonp"
                );
            },
        });
        var h = d.Class.extend({
            options: { serviceUrl: "https://maps.googleapis.com/maps/api/geocode/json", geocodingQueryParams: {}, reverseQueryParams: {} },
            initialize: function (e, t) {
                (this._key = e), d.setOptions(this, t), (this.options.serviceUrl = this.options.service_url || this.options.serviceUrl);
            },
            geocode: function (e, r, a) {
                var t = { address: e };
                this._key && this._key.length && (t.key = this._key),
                    (t = d.Util.extend(t, this.options.geocodingQueryParams)),
                    u(this.options.serviceUrl, t, function (e) {
                        var t,
                            o,
                            s,
                            n = [];
                        if (e.results && e.results.length)
                            for (var i = 0; i <= e.results.length - 1; i++)
                                (t = e.results[i]),
                                    (o = d.latLng(t.geometry.location)),
                                    (s = d.latLngBounds(d.latLng(t.geometry.viewport.northeast), d.latLng(t.geometry.viewport.southwest))),
                                    (n[i] = { name: t.formatted_address, bbox: s, center: o, properties: t.address_components });
                        r.call(a, n);
                    });
            },
            reverse: function (e, t, r, a) {
                var o = { latlng: encodeURIComponent(e.lat) + "," + encodeURIComponent(e.lng) };
                (o = d.Util.extend(o, this.options.reverseQueryParams)),
                    this._key && this._key.length && (o.key = this._key),
                    u(this.options.serviceUrl, o, function (e) {
                        var t,
                            o,
                            s,
                            n = [];
                        if (e.results && e.results.length)
                            for (var i = 0; i <= e.results.length - 1; i++)
                                (t = e.results[i]),
                                    (o = d.latLng(t.geometry.location)),
                                    (s = d.latLngBounds(d.latLng(t.geometry.viewport.northeast), d.latLng(t.geometry.viewport.southwest))),
                                    (n[i] = { name: t.formatted_address, bbox: s, center: o, properties: t.address_components });
                        r.call(a, n);
                    });
            },
        });
        var g = d.Class.extend({
            options: {
                geocodeUrl: "https://geocoder.api.here.com/6.2/geocode.json",
                reverseGeocodeUrl: "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json",
                app_id: "<insert your app_id here>",
                app_code: "<insert your app_code here>",
                geocodingQueryParams: {},
                reverseQueryParams: {},
            },
            initialize: function (e) {
                d.setOptions(this, e);
            },
            geocode: function (e, t, o) {
                var s = { searchtext: e, gen: 9, app_id: this.options.app_id, app_code: this.options.app_code, jsonattributes: 1 };
                (s = d.Util.extend(s, this.options.geocodingQueryParams)), this.getJSON(this.options.geocodeUrl, s, t, o);
            },
            reverse: function (e, t, o, s) {
                var n = { prox: encodeURIComponent(e.lat) + "," + encodeURIComponent(e.lng), mode: "retrieveAddresses", app_id: this.options.app_id, app_code: this.options.app_code, gen: 9, jsonattributes: 1 };
                (n = d.Util.extend(n, this.options.reverseQueryParams)), this.getJSON(this.options.reverseGeocodeUrl, n, o, s);
            },
            getJSON: function (e, t, r, a) {
                u(e, t, function (e) {
                    var t,
                        o,
                        s,
                        n = [];
                    if (e.response.view && e.response.view.length)
                        for (var i = 0; i <= e.response.view[0].result.length - 1; i++)
                            (t = e.response.view[0].result[i].location),
                                (o = d.latLng(t.displayPosition.latitude, t.displayPosition.longitude)),
                                (s = d.latLngBounds(d.latLng(t.mapView.topLeft.latitude, t.mapView.topLeft.longitude), d.latLng(t.mapView.bottomRight.latitude, t.mapView.bottomRight.longitude))),
                                (n[i] = { name: t.address.label, bbox: s, center: o });
                    r.call(a, n);
                });
            },
        });
        var m = d.Class.extend({
            options: { next: void 0, sizeInMeters: 1e4 },
            initialize: function (e) {
                d.Util.setOptions(this, e);
            },
            geocode: function (e, t, o) {
                var s, n;
                if (
                    ((s = e.match(/^([NS])\s*(\d{1,3}(?:\.\d*)?)\W*([EW])\s*(\d{1,3}(?:\.\d*)?)$/))
                        ? (n = d.latLng((/N/i.test(s[1]) ? 1 : -1) * parseFloat(s[2]), (/E/i.test(s[3]) ? 1 : -1) * parseFloat(s[4])))
                        : (s = e.match(/^(\d{1,3}(?:\.\d*)?)\s*([NS])\W*(\d{1,3}(?:\.\d*)?)\s*([EW])$/))
                        ? (n = d.latLng((/N/i.test(s[2]) ? 1 : -1) * parseFloat(s[1]), (/E/i.test(s[4]) ? 1 : -1) * parseFloat(s[3])))
                        : (s = e.match(/^([NS])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?$/))
                        ? (n = d.latLng((/N/i.test(s[1]) ? 1 : -1) * (parseFloat(s[2]) + parseFloat(s[3] / 60)), (/E/i.test(s[4]) ? 1 : -1) * (parseFloat(s[5]) + parseFloat(s[6] / 60))))
                        : (s = e.match(/^(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([NS])\W*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([EW])$/))
                        ? (n = d.latLng((/N/i.test(s[3]) ? 1 : -1) * (parseFloat(s[1]) + parseFloat(s[2] / 60)), (/E/i.test(s[6]) ? 1 : -1) * (parseFloat(s[4]) + parseFloat(s[5] / 60))))
                        : (s = e.match(/^([NS])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?$/))
                        ? (n = d.latLng((/N/i.test(s[1]) ? 1 : -1) * (parseFloat(s[2]) + parseFloat(s[3] / 60 + parseFloat(s[4] / 3600))), (/E/i.test(s[5]) ? 1 : -1) * (parseFloat(s[6]) + parseFloat(s[7] / 60) + parseFloat(s[8] / 3600))))
                        : (s = e.match(/^(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]\s*([NS])\W*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\s*([EW])$/))
                        ? (n = d.latLng((/N/i.test(s[4]) ? 1 : -1) * (parseFloat(s[1]) + parseFloat(s[2] / 60 + parseFloat(s[3] / 3600))), (/E/i.test(s[8]) ? 1 : -1) * (parseFloat(s[5]) + parseFloat(s[6] / 60) + parseFloat(s[7] / 3600))))
                        : (s = e.match(/^\s*([+-]?\d+(?:\.\d*)?)\s*[\s,]\s*([+-]?\d+(?:\.\d*)?)\s*$/)) && (n = d.latLng(parseFloat(s[1]), parseFloat(s[2]))),
                    n)
                ) {
                    var i = [{ name: e, center: n, bbox: n.toBounds(this.options.sizeInMeters) }];
                    t.call(o, i);
                } else this.options.next && this.options.next.geocode(e, t, o);
            },
        });
        var f = d.Class.extend({
            options: { serviceUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/", geocodingQueryParams: {}, reverseQueryParams: {} },
            initialize: function (e, t) {
                d.setOptions(this, t), (this.options.geocodingQueryParams.access_token = e), (this.options.reverseQueryParams.access_token = e);
            },
            geocode: function (e, l, c) {
                var t = this.options.geocodingQueryParams;
                void 0 !== t.proximity && void 0 !== t.proximity.lat && void 0 !== t.proximity.lng && (t.proximity = t.proximity.lng + "," + t.proximity.lat),
                    u(this.options.serviceUrl + encodeURIComponent(e) + ".json", t, function (e) {
                        var t,
                            o,
                            s,
                            n = [];
                        if (e.features && e.features.length)
                            for (var i = 0; i <= e.features.length - 1; i++) {
                                (t = e.features[i]), (o = d.latLng(t.center.reverse())), (s = t.bbox ? d.latLngBounds(d.latLng(t.bbox.slice(0, 2).reverse()), d.latLng(t.bbox.slice(2, 4).reverse())) : d.latLngBounds(o, o));
                                for (var r = { text: t.text, address: t.address }, a = 0; a < (t.context || []).length; a++) {
                                    r[t.context[a].id.split(".")[0]] = t.context[a].text;
                                }
                                n[i] = { name: t.place_name, bbox: s, center: o, properties: r };
                            }
                        l.call(c, n);
                    });
            },
            suggest: function (e, t, o) {
                return this.geocode(e, t, o);
            },
            reverse: function (e, t, r, a) {
                u(this.options.serviceUrl + encodeURIComponent(e.lng) + "," + encodeURIComponent(e.lat) + ".json", this.options.reverseQueryParams, function (e) {
                    var t,
                        o,
                        s,
                        n = [];
                    if (e.features && e.features.length)
                        for (var i = 0; i <= e.features.length - 1; i++)
                            (t = e.features[i]),
                                (o = d.latLng(t.center.reverse())),
                                (s = t.bbox ? d.latLngBounds(d.latLng(t.bbox.slice(0, 2).reverse()), d.latLng(t.bbox.slice(2, 4).reverse())) : d.latLngBounds(o, o)),
                                (n[i] = { name: t.place_name, bbox: s, center: o });
                    r.call(a, n);
                });
            },
        });
        var v = d.Class.extend({
            options: { serviceUrl: "https://www.mapquestapi.com/geocoding/v1" },
            initialize: function (e, t) {
                (this._key = decodeURIComponent(e)), d.Util.setOptions(this, t);
            },
            _formatName: function () {
                var e,
                    t = [];
                for (e = 0; e < arguments.length; e++) arguments[e] && t.push(arguments[e]);
                return t.join(", ");
            },
            geocode: function (e, i, r) {
                u(
                    this.options.serviceUrl + "/address",
                    { key: this._key, location: e, limit: 5, outFormat: "json" },
                    d.bind(function (e) {
                        var t,
                            o,
                            s = [];
                        if (e.results && e.results[0].locations)
                            for (var n = e.results[0].locations.length - 1; 0 <= n; n--)
                                (t = e.results[0].locations[n]), (o = d.latLng(t.latLng)), (s[n] = { name: this._formatName(t.street, t.adminArea4, t.adminArea3, t.adminArea1), bbox: d.latLngBounds(o, o), center: o });
                        i.call(r, s);
                    }, this)
                );
            },
            reverse: function (e, t, i, r) {
                u(
                    this.options.serviceUrl + "/reverse",
                    { key: this._key, location: e.lat + "," + e.lng, outputFormat: "json" },
                    d.bind(function (e) {
                        var t,
                            o,
                            s = [];
                        if (e.results && e.results[0].locations)
                            for (var n = e.results[0].locations.length - 1; 0 <= n; n--)
                                (t = e.results[0].locations[n]), (o = d.latLng(t.latLng)), (s[n] = { name: this._formatName(t.street, t.adminArea4, t.adminArea3, t.adminArea1), bbox: d.latLngBounds(o, o), center: o });
                        i.call(r, s);
                    }, this)
                );
            },
        });
        var _ = d.Class.extend({
            options: { userId: "<insert your userId here>", apiKey: "<insert your apiKey here>", serviceUrl: "https://neutrinoapi.com/" },
            initialize: function (e) {
                d.Util.setOptions(this, e);
            },
            geocode: function (e, n, i) {
                u(this.options.serviceUrl + "geocode-address", { apiKey: this.options.apiKey, userId: this.options.userId, address: e.split(/\s+/).join(".") }, function (e) {
                    var t,
                        o,
                        s = [];
                    e.locations && ((e.geometry = e.locations[0]), (t = d.latLng(e.geometry.latitude, e.geometry.longitude)), (o = d.latLngBounds(t, t)), (s[0] = { name: e.geometry.address, bbox: o, center: t })), n.call(i, s);
                });
            },
            suggest: function (e, t, o) {
                return this.geocode(e, t, o);
            },
            reverse: function (n, e, i, r) {
                u(this.options.serviceUrl + "geocode-reverse", { apiKey: this.options.apiKey, userId: this.options.userId, latitude: n.lat, longitude: n.lng }, function (e) {
                    var t,
                        o,
                        s = [];
                    200 == e.status.status && e.found && ((t = d.latLng(n.lat, n.lng)), (o = d.latLngBounds(t, t)), (s[0] = { name: e.address, bbox: o, center: t })), i.call(r, s);
                });
            },
        });
        var b = d.Class.extend({
            options: {
                serviceUrl: "https://nominatim.openstreetmap.org/",
                geocodingQueryParams: {},
                reverseQueryParams: {},
                htmlTemplate: function (e) {
                    var t = e.address,
                        o = [];
                    return (
                        (t.road || t.building) && o.push("{building} {road} {house_number}"),
                        (t.city || t.town || t.village || t.hamlet) && o.push('<span class="' + (0 < o.length ? "leaflet-control-geocoder-address-detail" : "") + '">{postcode} {city} {town} {village} {hamlet}</span>'),
                        (t.state || t.country) && o.push('<span class="' + (0 < o.length ? "leaflet-control-geocoder-address-context" : "") + '">{state} {country}</span>'),
                        s(o.join("<br/>"), t)
                    );
                },
            },
            initialize: function (e) {
                d.Util.setOptions(this, e);
            },
            geocode: function (e, i, r) {
                u(
                    this.options.serviceUrl + "search",
                    d.extend({ q: e, limit: 5, format: "json", addressdetails: 1 }, this.options.geocodingQueryParams),
                    d.bind(function (e) {
                        for (var t = [], o = e.length - 1; 0 <= o; o--) {
                            for (var s = e[o].boundingbox, n = 0; n < 4; n++) s[n] = parseFloat(s[n]);
                            t[o] = {
                                icon: e[o].icon,
                                name: e[o].display_name,
                                html: this.options.htmlTemplate ? this.options.htmlTemplate(e[o]) : void 0,
                                bbox: d.latLngBounds([s[0], s[2]], [s[1], s[3]]),
                                center: d.latLng(e[o].lat, e[o].lon),
                                properties: e[o],
                            };
                        }
                        i.call(r, t);
                    }, this)
                );
            },
            reverse: function (e, t, s, n) {
                u(
                    this.options.serviceUrl + "reverse",
                    d.extend({ lat: e.lat, lon: e.lng, zoom: Math.round(Math.log(t / 256) / Math.log(2)), addressdetails: 1, format: "json" }, this.options.reverseQueryParams),
                    d.bind(function (e) {
                        var t,
                            o = [];
                        e &&
                            e.lat &&
                            e.lon &&
                            ((t = d.latLng(e.lat, e.lon)), o.push({ name: e.display_name, html: this.options.htmlTemplate ? this.options.htmlTemplate(e) : void 0, center: t, bounds: d.latLngBounds(t, t), properties: e })),
                            s.call(n, o);
                    }, this)
                );
            },
        });
        var L = d.Class.extend({
            options: { OpenLocationCode: void 0, codeLength: void 0 },
            initialize: function (e) {
                d.setOptions(this, e);
            },
            geocode: function (e, t, o) {
                try {
                    var s = this.options.OpenLocationCode.decode(e),
                        n = { name: e, center: d.latLng(s.latitudeCenter, s.longitudeCenter), bbox: d.latLngBounds(d.latLng(s.latitudeLo, s.longitudeLo), d.latLng(s.latitudeHi, s.longitudeHi)) };
                    t.call(o, [n]);
                } catch (e) {
                    console.warn(e), t.call(o, []);
                }
            },
            reverse: function (e, t, o, s) {
                try {
                    var n = { name: this.options.OpenLocationCode.encode(e.lat, e.lng, this.options.codeLength), center: d.latLng(e.lat, e.lng), bbox: d.latLngBounds(d.latLng(e.lat, e.lng), d.latLng(e.lat, e.lng)) };
                    o.call(s, [n]);
                } catch (e) {
                    console.warn(e), o.call(s, []);
                }
            },
        });
        var y = d.Class.extend({
            options: { serviceUrl: "https://api.opencagedata.com/geocode/v1/json" },
            initialize: function (e) {
                this._accessToken = e;
            },
            geocode: function (e, r, a) {
                u(this.options.serviceUrl, { key: this._accessToken, q: e }, function (e) {
                    var t,
                        o,
                        s,
                        n = [];
                    if (e.results && e.results.length)
                        for (var i = 0; i < e.results.length; i++)
                            (s = e.results[i]),
                                (t = d.latLng(s.geometry)),
                                (o = s.annotations && s.annotations.bounds ? d.latLngBounds(d.latLng(s.annotations.bounds.northeast), d.latLng(s.annotations.bounds.southwest)) : d.latLngBounds(t, t)),
                                n.push({ name: s.formatted, bbox: o, center: t });
                    r.call(a, n);
                });
            },
            suggest: function (e, t, o) {
                return this.geocode(e, t, o);
            },
            reverse: function (e, t, r, a) {
                u(this.options.serviceUrl, { key: this._accessToken, q: [e.lat, e.lng].join(",") }, function (e) {
                    var t,
                        o,
                        s,
                        n = [];
                    if (e.results && e.results.length)
                        for (var i = 0; i < e.results.length; i++)
                            (s = e.results[i]),
                                (t = d.latLng(s.geometry)),
                                (o = s.annotations && s.annotations.bounds ? d.latLngBounds(d.latLng(s.annotations.bounds.northeast), d.latLng(s.annotations.bounds.southwest)) : d.latLngBounds(t, t)),
                                n.push({ name: s.formatted, bbox: o, center: t });
                    r.call(a, n);
                });
            },
        });
        var x = d.Class.extend({
            options: { serviceUrl: "https://api.geocode.earth/v1", geocodingQueryParams: {}, reverseQueryParams: {} },
            initialize: function (e, t) {
                d.Util.setOptions(this, t), (this._apiKey = e), (this._lastSuggest = 0);
            },
            geocode: function (e, t, o) {
                var s = this;
                u(this.options.serviceUrl + "/search", d.extend({ api_key: this._apiKey, text: e }, this.options.geocodingQueryParams), function (e) {
                    t.call(o, s._parseResults(e, "bbox"));
                });
            },
            suggest: function (e, t, o) {
                var s = this;
                u(
                    this.options.serviceUrl + "/autocomplete",
                    d.extend({ api_key: this._apiKey, text: e }, this.options.geocodingQueryParams),
                    d.bind(function (e) {
                        e.geocoding.timestamp > this._lastSuggest && ((this._lastSuggest = e.geocoding.timestamp), t.call(o, s._parseResults(e, "bbox")));
                    }, this)
                );
            },
            reverse: function (e, t, o, s) {
                var n = this;
                u(this.options.serviceUrl + "/reverse", d.extend({ api_key: this._apiKey, "point.lat": e.lat, "point.lon": e.lng }, this.options.reverseQueryParams), function (e) {
                    o.call(s, n._parseResults(e, "bounds"));
                });
            },
            _parseResults: function (e, i) {
                var r = [];
                return (
                    d.geoJson(e, {
                        pointToLayer: function (e, t) {
                            return d.circleMarker(t);
                        },
                        onEachFeature: function (e, t) {
                            var o,
                                s,
                                n = {};
                            t.getBounds
                                ? (s = (o = t.getBounds()).getCenter())
                                : (o = t.feature.bbox
                                      ? ((s = t.getLatLng()), d.latLngBounds(d.GeoJSON.coordsToLatLng(t.feature.bbox.slice(0, 2)), d.GeoJSON.coordsToLatLng(t.feature.bbox.slice(2, 4))))
                                      : ((s = t.getLatLng()), d.latLngBounds(s, s))),
                                (n.name = t.feature.properties.label),
                                (n.center = s),
                                (n[i] = o),
                                (n.properties = t.feature.properties),
                                r.push(n);
                        },
                    }),
                    r
                );
            },
        });
        function e(e, t) {
            return new x(e, t);
        }
        var U = x,
            C = e,
            k = x,
            w = e,
            D = k.extend({ options: { serviceUrl: "https://api.openrouteservice.org/geocode" } });
        var E = d.Class.extend({
            options: { serviceUrl: "https://photon.komoot.de/api/", reverseUrl: "https://photon.komoot.de/reverse/", nameProperties: ["name", "street", "suburb", "hamlet", "town", "city", "state", "country"] },
            initialize: function (e) {
                d.setOptions(this, e);
            },
            geocode: function (e, t, o) {
                var s = d.extend({ q: e }, this.options.geocodingQueryParams);
                u(
                    this.options.serviceUrl,
                    s,
                    d.bind(function (e) {
                        t.call(o, this._decodeFeatures(e));
                    }, this)
                );
            },
            suggest: function (e, t, o) {
                return this.geocode(e, t, o);
            },
            reverse: function (e, t, o, s) {
                var n = d.extend({ lat: e.lat, lon: e.lng }, this.options.reverseQueryParams);
                u(
                    this.options.reverseUrl,
                    n,
                    d.bind(function (e) {
                        o.call(s, this._decodeFeatures(e));
                    }, this)
                );
            },
            _decodeFeatures: function (e) {
                var t,
                    o,
                    s,
                    n,
                    i,
                    r,
                    a = [];
                if (e && e.features)
                    for (t = 0; t < e.features.length; t++)
                        (s = (o = e.features[t]).geometry.coordinates),
                            (n = d.latLng(s[1], s[0])),
                            (r = (i = o.properties.extent) ? d.latLngBounds([i[1], i[0]], [i[3], i[2]]) : d.latLngBounds(n, n)),
                            a.push({ name: this._decodeFeatureName(o), html: this.options.htmlTemplate ? this.options.htmlTemplate(o) : void 0, center: n, bbox: r, properties: o.properties });
                return a;
            },
            _decodeFeatureName: function (t) {
                return (this.options.nameProperties || [])
                    .map(function (e) {
                        return t.properties[e];
                    })
                    .filter(function (e) {
                        return !!e;
                    })
                    .join(", ");
            },
        });
        var T = d.Class.extend({
            options: { serviceUrl: "https://api.what3words.com/v2/" },
            initialize: function (e) {
                this._accessToken = e;
            },
            geocode: function (e, n, i) {
                u(this.options.serviceUrl + "forward", { key: this._accessToken, addr: e.split(/\s+/).join(".") }, function (e) {
                    var t,
                        o,
                        s = [];
                    e.geometry && ((t = d.latLng(e.geometry.lat, e.geometry.lng)), (o = d.latLngBounds(t, t)), (s[0] = { name: e.words, bbox: o, center: t })), n.call(i, s);
                });
            },
            suggest: function (e, t, o) {
                return this.geocode(e, t, o);
            },
            reverse: function (e, t, n, i) {
                u(this.options.serviceUrl + "reverse", { key: this._accessToken, coords: [e.lat, e.lng].join(",") }, function (e) {
                    var t,
                        o,
                        s = [];
                    200 == e.status.status && ((t = d.latLng(e.geometry.lat, e.geometry.lng)), (o = d.latLngBounds(t, t)), (s[0] = { name: e.words, bbox: o, center: t })), n.call(i, s);
                });
            },
        });
        var B = Object.freeze({
                ArcGis: c,
                arcgis: function (e, t) {
                    return new c(e, t);
                },
                Bing: p,
                bing: function (e) {
                    return new p(e);
                },
                Google: h,
                google: function (e, t) {
                    return new h(e, t);
                },
                HERE: g,
                here: function (e) {
                    return new g(e);
                },
                LatLng: m,
                latLng: function (e) {
                    return new m(e);
                },
                Mapbox: f,
                mapbox: function (e, t) {
                    return new f(e, t);
                },
                MapQuest: v,
                mapQuest: function (e, t) {
                    return new v(e, t);
                },
                Neutrino: _,
                neutrino: function (e) {
                    return new _(e);
                },
                Nominatim: b,
                nominatim: function (e) {
                    return new b(e);
                },
                OpenLocationCode: L,
                openLocationCode: function (e) {
                    return new L(e);
                },
                OpenCage: y,
                opencage: function (e) {
                    return new y(e);
                },
                Pelias: x,
                pelias: e,
                GeocodeEarth: U,
                geocodeEarth: C,
                Mapzen: k,
                mapzen: w,
                Openrouteservice: D,
                openrouteservice: function (e, t) {
                    return new D(e, t);
                },
                Photon: E,
                photon: function (e) {
                    return new E(e);
                },
                What3Words: T,
                what3words: function (e) {
                    return new T(e);
                },
            }),
            R = d.Control.extend({
                options: {
                    showUniqueResult: !0,
                    showResultIcons: !1,
                    collapsed: !0,
                    expand: "touch",
                    position: "topright",
                    placeholder: "Search...",
                    errorMessage: "Nothing found.",
                    queryMinLength: 1,
                    suggestMinLength: 3,
                    suggestTimeout: 250,
                    defaultMarkGeocode: !0,
                },
                includes: d.Evented.prototype || d.Mixin.Events,
                initialize: function (e) {
                    d.Util.setOptions(this, e), this.options.geocoder || (this.options.geocoder = new b()), (this._requestCount = 0);
                },
                addThrobberClass: function () {
                    d.DomUtil.addClass(this._container, "leaflet-control-geocoder-throbber");
                },
                removeThrobberClass: function () {
                    d.DomUtil.removeClass(this._container, "leaflet-control-geocoder-throbber");
                },
                onAdd: function (e) {
                    var t,
                        o = "leaflet-control-geocoder",
                        s = d.DomUtil.create("div", o + " leaflet-bar"),
                        n = d.DomUtil.create("button", o + "-icon", s),
                        i = (this._form = d.DomUtil.create("div", o + "-form", s));
                    return (
                        (this._map = e),
                        (this._container = s),
                        (n.innerHTML = "&nbsp;"),
                        (n.type = "button"),
                        ((t = this._input = d.DomUtil.create("input", "", i)).type = "text"),
                        (t.placeholder = this.options.placeholder),
                        d.DomEvent.disableClickPropagation(t),
                        (this._errorElement = d.DomUtil.create("div", o + "-form-no-error", s)),
                        (this._errorElement.innerHTML = this.options.errorMessage),
                        (this._alts = d.DomUtil.create("ul", o + "-alternatives leaflet-control-geocoder-alternatives-minimized", s)),
                        d.DomEvent.disableClickPropagation(this._alts),
                        d.DomEvent.addListener(t, "keydown", this._keydown, this),
                        this.options.geocoder.suggest && d.DomEvent.addListener(t, "input", this._change, this),
                        d.DomEvent.addListener(
                            t,
                            "blur",
                            function () {
                                this.options.collapsed && !this._preventBlurCollapse && this._collapse(), (this._preventBlurCollapse = !1);
                            },
                            this
                        ),
                        this.options.collapsed
                            ? "click" === this.options.expand
                                ? d.DomEvent.addListener(
                                      s,
                                      "click",
                                      function (e) {
                                          0 === e.button && 2 !== e.detail && this._toggle();
                                      },
                                      this
                                  )
                                : d.Browser.touch && "touch" === this.options.expand
                                ? d.DomEvent.addListener(
                                      s,
                                      "touchstart mousedown",
                                      function (e) {
                                          this._toggle(), e.preventDefault(), e.stopPropagation();
                                      },
                                      this
                                  )
                                : (d.DomEvent.addListener(s, "mouseover", this._expand, this), d.DomEvent.addListener(s, "mouseout", this._collapse, this), this._map.on("movestart", this._collapse, this))
                            : (this._expand(),
                              d.Browser.touch
                                  ? d.DomEvent.addListener(
                                        s,
                                        "touchstart",
                                        function () {
                                            this._geocode();
                                        },
                                        this
                                    )
                                  : d.DomEvent.addListener(
                                        s,
                                        "click",
                                        function () {
                                            this._geocode();
                                        },
                                        this
                                    )),
                        this.options.defaultMarkGeocode && this.on("markgeocode", this.markGeocode, this),
                        this.on("startgeocode", this.addThrobberClass, this),
                        this.on("finishgeocode", this.removeThrobberClass, this),
                        this.on("startsuggest", this.addThrobberClass, this),
                        this.on("finishsuggest", this.removeThrobberClass, this),
                        d.DomEvent.disableClickPropagation(s),
                        s
                    );
                },
                _geocodeResult: function (e, t) {
                    if (!t && this.options.showUniqueResult && 1 === e.length) this._geocodeResultSelected(e[0]);
                    else if (0 < e.length) {
                        (this._alts.innerHTML = ""), (this._results = e), d.DomUtil.removeClass(this._alts, "leaflet-control-geocoder-alternatives-minimized"), d.DomUtil.addClass(this._container, "leaflet-control-geocoder-options-open");
                        for (var o = 0; o < e.length; o++) this._alts.appendChild(this._createAlt(e[o], o));
                    } else d.DomUtil.addClass(this._container, "leaflet-control-geocoder-options-error"), d.DomUtil.addClass(this._errorElement, "leaflet-control-geocoder-error");
                },
                markGeocode: function (e) {
                    return (
                        (e = e.geocode || e),
                        this._map.fitBounds(e.bbox),
                        this._geocodeMarker && this._map.removeLayer(this._geocodeMarker),
                        (this._geocodeMarker = new d.Marker(e.center)
                            .bindPopup(e.html || e.name)
                            .addTo(this._map)
                            .openPopup()),
                        this
                    );
                },
                _geocode: function (t) {
                    var e = this._input.value;
                    if (t || !(e.length < this.options.queryMinLength)) {
                        var o = ++this._requestCount,
                            s = t ? "suggest" : "geocode",
                            n = { input: e };
                        (this._lastGeocode = e),
                            t || this._clearResults(),
                            this.fire("start" + s, n),
                            this.options.geocoder[s](
                                e,
                                function (e) {
                                    o === this._requestCount && ((n.results = e), this.fire("finish" + s, n), this._geocodeResult(e, t));
                                },
                                this
                            );
                    }
                },
                _geocodeResultSelected: function (e) {
                    this.fire("markgeocode", { geocode: e });
                },
                _toggle: function () {
                    d.DomUtil.hasClass(this._container, "leaflet-control-geocoder-expanded") ? this._collapse() : this._expand();
                },
                _expand: function () {
                    d.DomUtil.addClass(this._container, "leaflet-control-geocoder-expanded"), this._input.select(), this.fire("expand");
                },
                _collapse: function () {
                    d.DomUtil.removeClass(this._container, "leaflet-control-geocoder-expanded"),
                        d.DomUtil.addClass(this._alts, "leaflet-control-geocoder-alternatives-minimized"),
                        d.DomUtil.removeClass(this._errorElement, "leaflet-control-geocoder-error"),
                        d.DomUtil.removeClass(this._container, "leaflet-control-geocoder-options-open"),
                        d.DomUtil.removeClass(this._container, "leaflet-control-geocoder-options-error"),
                        this._input.blur(),
                        this.fire("collapse");
                },
                _clearResults: function () {
                    d.DomUtil.addClass(this._alts, "leaflet-control-geocoder-alternatives-minimized"),
                        (this._selection = null),
                        d.DomUtil.removeClass(this._errorElement, "leaflet-control-geocoder-error"),
                        d.DomUtil.removeClass(this._container, "leaflet-control-geocoder-options-open"),
                        d.DomUtil.removeClass(this._container, "leaflet-control-geocoder-options-error");
                },
                _createAlt: function (t, e) {
                    var o = d.DomUtil.create("li", ""),
                        s = d.DomUtil.create("a", "", o),
                        n = this.options.showResultIcons && t.icon ? d.DomUtil.create("img", "", s) : null,
                        i = t.html ? void 0 : document.createTextNode(t.name);
                    return (
                        n && (n.src = t.icon),
                        o.setAttribute("data-result-index", e),
                        t.html ? (s.innerHTML = s.innerHTML + t.html) : s.appendChild(i),
                        d.DomEvent.addListener(
                            o,
                            "mousedown touchstart",
                            function (e) {
                                (this._preventBlurCollapse = !0),
                                    d.DomEvent.stop(e),
                                    this._geocodeResultSelected(t),
                                    d.DomEvent.on(
                                        o,
                                        "click",
                                        function () {
                                            this.options.collapsed ? this._collapse() : this._clearResults();
                                        },
                                        this
                                    );
                            },
                            this
                        ),
                        o
                    );
                },
                _keydown: function (e) {
                    var t = this,
                        o = function (e) {
                            t._selection && (d.DomUtil.removeClass(t._selection, "leaflet-control-geocoder-selected"), (t._selection = t._selection[0 < e ? "nextSibling" : "previousSibling"])),
                                t._selection || (t._selection = t._alts[0 < e ? "firstChild" : "lastChild"]),
                                t._selection && d.DomUtil.addClass(t._selection, "leaflet-control-geocoder-selected");
                        };
                    switch (e.keyCode) {
                        case 27:
                            this.options.collapsed ? this._collapse() : this._clearResults();
                            break;
                        case 38:
                            o(-1);
                            break;
                        case 40:
                            o(1);
                            break;
                        case 13:
                            if (this._selection) {
                                var s = parseInt(this._selection.getAttribute("data-result-index"), 10);
                                this._geocodeResultSelected(this._results[s]), this._clearResults();
                            } else this._geocode();
                            break;
                        default:
                            return;
                    }
                    d.DomEvent.preventDefault(e);
                },
                _change: function () {
                    var e = this._input.value;
                    e !== this._lastGeocode &&
                        (clearTimeout(this._suggestTimeout),
                        e.length >= this.options.suggestMinLength
                            ? (this._suggestTimeout = setTimeout(
                                  d.bind(function () {
                                      this._geocode(!0);
                                  }, this),
                                  this.options.suggestTimeout
                              ))
                            : this._clearResults());
                },
            });
        return (
            d.Util.extend(R, B),
            d.Util.extend(d.Control, {
                Geocoder: R,
                geocoder: function (e) {
                    return new R(e);
                },
            }),
            R
        );
    })(L));
//# sourceMappingURL=Control.Geocoder.min.js.map
