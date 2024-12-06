!(function (t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports ? (module.exports = t(require("jquery"))) : t(jQuery);
})(function (t) {
    function a(t) {
        return void 0 !== t && null !== t;
    }
    t(document).ready(function () {
        t("body").append("<div id=snackbar-container/>");
    });
    var n = {
        events: {},
        on: function (t, a) {
            (this.events[t] = this.events[t] || []), this.events[t].push(a);
        },
        off: function (t) {
            this.events[t] && delete this.events[t];
        },
        emit: function (t, a) {
            this.events[t] &&
                this.events[t].forEach(function (t) {
                    t(a);
                });
        },
    };
    t(document)
        .on("click", "[data-toggle=snackbar]", function () {
            t(this).snackbar("toggle");
        })
        .on("click", "#snackbar-container .snackbar", function () {
            t(this).snackbar("hide");
        }),
        (t.snackbar = function (e) {
            if (a(e) && e === Object(e)) {
                var s,
                    i = !1;
                a((e = Object.assign({}, t.snackbar.defaults, e)).id)
                    ? t("#" + e.id).length
                        ? (s = t("#" + e.id))
                        : ((s = t("<div/>")
                              .attr("id", "" + e.id)
                              .attr("class", "snackbar")),
                          (i = !0))
                    : ((e.id = "snackbar" + Date.now()), (s = t("<div/>").attr("id", e.id).attr("class", "snackbar")), (i = !0));
                var o = s.hasClass("snackbar-opened");
                a(e.style)
                    ? (o ? s.attr("class", "snackbar snackbar-opened " + e.style) : s.attr("class", "snackbar " + e.style), s.attr("data-style", e.style))
                    : o
                    ? s.attr("class", "snackbar snackbar-opened")
                    : s.attr("class", "snackbar"),
                    (e.htmlAllowed = !!a(e.htmlAllowed) && e.htmlAllowed),
                    (e.timeout = a(e.timeout) ? e.timeout : 3e3),
                    s.attr("data-timeout", e.timeout),
                    (e.content = e.htmlAllowed ? e.content : t("<p>" + e.content + "</p>").text()),
                    a(e.onClose) && n.on(e.id, e.onClose),
                    a(e.htmlAllowed) && s.attr("data-html-allowed", e.htmlAllowed),
                    a(e.content) && (s.find(".snackbar-content").length ? s.find(".snackbar-content").html(e.content) : s.prepend("<span class=snackbar-content>" + e.content + "</span>"), s.attr("data-content", e.content)),
                    i ? s.appendTo("#snackbar-container") : s.insertAfter("#snackbar-container .snackbar:last-child"),
                    a(e.action) && "toggle" == e.action && (e.action = o ? "hide" : "show");
                var c = Date.now();
                s.data("animationId1", c),
                    setTimeout(function () {
                        s.data("animationId1") === c && (a(e.action) && "show" != e.action ? a(e.action) && "hide" == e.action && (s.removeClass("snackbar-opened"), n.emit(e.id), n.off(e.id)) : s.addClass("snackbar-opened"));
                    }, 50);
                var r = Date.now();
                return (
                    s.data("animationId2", r),
                    0 !== e.timeout &&
                        setTimeout(function () {
                            s.data("animationId2") === r && (s.removeClass("snackbar-opened"), n.emit(e.id), n.off(e.id));
                        }, e.timeout),
                    s
                );
            }
            return !1;
        }),
        (t.snackbar.defaults = {}),
        (t.fn.snackbar = function (n) {
            if (void 0 !== n) {
                var e = {};
                if (this.hasClass("snackbar"))
                    return (
                        (e = { id: this.attr("id"), content: t(this).attr("data-content"), style: t(this).attr("data-style"), timeout: parseInt(t(this).attr("data-timeout")), htmlAllowed: t(this).attr("data-html-allowed") }),
                        ("show" !== n && "hide" !== n && "toggle" != n) || (e.action = n),
                        t.snackbar(e)
                    );
                (a(n) && "show" !== n && "hide" !== n && "toggle" != n) ||
                    (e = { content: t(this).attr("data-content"), style: t(this).attr("data-style"), timeout: t(this).attr("data-timeout"), htmlAllowed: t(this).attr("data-html-allowed") }),
                    a(n) && ((e.id = this.attr("data-snackbar-id")), ("show" !== n && "hide" !== n && "toggle" != n) || (e.action = n));
                var s = t.snackbar(e);
                return this.attr("data-snackbar-id", s.attr("id")), s;
            }
        });
});
/**! @preserve
 * knockstrap 1.2.0 | (c) 2014 Artem Stepanyuk | http://www.opensource.org/licenses/mit-license
 */
!(function (e, t) {
    "use strict";
    "function" == typeof require && "object" == typeof exports && "object" == typeof module
        ? t(require("knockout"), require("jquery"))
        : "function" == typeof define && define.amd
        ? define("knockstrap", ["knockout", "jquery"], t)
        : t(ko, $);
})(0, function (e, t) {
    "use strict";
    var a, n;
    (e.utils.uniqueId =
        ((a = { "ks-unique-": 0 }),
        function (e) {
            return a[(e = e || "ks-unique-")] || (a[e] = 0), e + a[e]++;
        })),
        (e.utils.unwrapProperties = function (t) {
            if (null === t || "object" != typeof t) return t;
            var a = {};
            return (
                e.utils.objectForEach(t, function (t, n) {
                    a[t] = e.unwrap(n);
                }),
                a
            );
        }),
        (n = {
            alert: '<div class="alert fade in" data-bind="css: type, template: innerTemplate"> </div>',
            alertInner: '<button class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <p data-bind="text: message"></p>',
            carousel:
                '\x3c!-- ko template: indicatorsTemplate --\x3e \x3c!-- /ko --\x3e <div class="carousel-inner"> \x3c!-- ko foreach: items --\x3e <div class="item" data-bind="with: $parent.converter($data), css: { active: $index() == 0 }"> <img data-bind="attr: { src: src, alt: alt }"> <div class="container"> <div class="carousel-caption"> \x3c!-- ko template: { name: $parents[1].itemTemplateName, data: $data, templateEngine: $parents[1].templateEngine, afterRender: $parents[1].afterRender, afterAdd: $parents[1].afterAdd, beforeRemove: $parents[1].beforeRemove } --\x3e \x3c!-- /ko --\x3e </div> </div> </div> \x3c!-- /ko --\x3e </div> \x3c!-- ko template: controlsTemplate --\x3e \x3c!-- /ko --\x3e ',
            carouselContent: '<div data-bind="text: content"></div>',
            carouselControls:
                '<a class="left carousel-control" data-bind="attr: { href: id }" data-slide="prev"> <span class="icon-prev"></span> </a> <a class="right carousel-control" data-bind="attr: { href: id }" data-slide="next"> <span class="icon-next"></span> </a>',
            carouselIndicators: '<ol class="carousel-indicators" data-bind="foreach: items"> <li data-bind="attr: { \'data-target\': $parent.id, \'data-slide-to\': $index }"></li> </ol> ',
            modal:
                '<div class="modal-dialog" data-bind="css: dialogCss"> <div class="modal-content"> <div class="modal-header" data-bind="template: headerTemplate"> </div> <div class="modal-body" data-bind="template: bodyTemplate"> </div> \x3c!-- ko if: footerTemplate --\x3e <div class="modal-footer" data-bind="template: footerTemplate"> </div> \x3c!-- /ko --\x3e </div> </div>',
            popoverX:
                '<div class="popover" data-bind="css: dialogCss"><div class="arrow"></div> <div class="popover-title" data-bind="template: headerTemplate"></div> <div class="popover-content" data-bind="template: bodyTemplate"></div> \x3c!-- ko if: footerTemplate --\x3e<div class="popover-footer" data-bind="template: footerTemplate"></div>\x3c!-- /ko --\x3e </div>',
            modalBody: '<div data-bind="html: content"> </div>',
            modalFooter:
                '\x3c!-- ko if: $data.action --\x3e <a href="#" class="btn btn-primary" data-bind="click: action, html: primaryLabel"></a> \x3c!-- /ko --\x3e <a href="#" class="btn btn-default" data-bind="html: closeLabel" data-dismiss="modal"></a>',
            modalHeader: '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h3 data-bind="text: label"></h3> ',
            progress:
                '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-bind="style: { width: barWidth }, attr: { \'aria-valuenow\': value }, css: innerCss"> <span data-bind="css: { \'sr-only\': textHidden }"> <span data-bind="text: value"></span>% <span data-bind="text: text"></span> </span> </div> ',
        }),
        (e.templateSources.stringTemplate = function (e) {
            (this.templateName = e),
                (this.data = function (e, t) {
                    if (((n.data = n.data || {}), (n.data[this.templateName] = n.data[this.templateName] || {}), 1 === arguments.length)) return n.data[this.templateName][e];
                    n.data[this.templateName][e] = t;
                }),
                (this.text = function (e) {
                    if (0 === arguments.length) return n[this.templateName];
                    n[this.templateName] = e;
                });
        }),
        (e.stringTemplateEngine = function () {
            this.allowTemplateRewriting = !1;
        }),
        (e.stringTemplateEngine.prototype = new e.nativeTemplateEngine()),
        (e.stringTemplateEngine.prototype.constructor = e.stringTemplateEngine),
        (e.stringTemplateEngine.prototype.makeTemplateSource = function (t) {
            return new e.templateSources.stringTemplate(t);
        }),
        (e.stringTemplateEngine.prototype.getTemplate = function (e) {
            return n[e];
        }),
        (e.stringTemplateEngine.prototype.addTemplate = function (e, t) {
            if (arguments.length < 2) throw new Error("template is not provided");
            n[e] = t;
        }),
        (e.stringTemplateEngine.prototype.removeTemplate = function (e) {
            if (!e) throw new Error("template name is not provided");
            delete n[e];
        }),
        (e.stringTemplateEngine.prototype.isTemplateExist = function (e) {
            return !!n[e];
        }),
        (e.stringTemplateEngine.instance = new e.stringTemplateEngine()),
        (e.bindingHandlers.alert = {
            init: function () {
                return { controlsDescendantBindings: !0 };
            },
            update: function (a, n, i, r, o) {
                var s,
                    d,
                    l = t(a),
                    p = n(),
                    c = p.template ? null : e.stringTemplateEngine.instance,
                    u = e.unwrap(p.template) || "alertInner";
                if (a.nodeType === (Node.ELEMENT_NODE || 1)) (s = u), (d = p.data || { message: p.message }), l.addClass("alert fade in").addClass("alert-" + (e.unwrap(p.type) || "info"));
                else {
                    if (a.nodeType !== (Node.COMMENT_NODE || 8)) throw new Error("alert binding should be used with dom elements or ko virtual elements");
                    (s = "alert"), (d = { innerTemplate: { name: u, data: p.data || { message: p.message }, templateEngine: c }, type: "alert-" + (e.unwrap(p.type) || "info") });
                }
                e.renderTemplate(s, o.createChildContext(d), e.utils.extend({ templateEngine: c }, p.templateOptions), a);
            },
        }),
        (e.virtualElements.allowedBindings.alert = !0),
        (e.bindingHandlers.carousel = {
            defaults: {
                css: "carousel slide",
                controlsTemplate: {
                    name: "carouselControls",
                    templateEngine: e.stringTemplateEngine.instance,
                    dataConverter: function (t) {
                        return {
                            id: e.computed(function () {
                                return "#" + e.unwrap(t.id);
                            }),
                        };
                    },
                },
                indicatorsTemplate: {
                    name: "carouselIndicators",
                    templateEngine: e.stringTemplateEngine.instance,
                    dataConverter: function (t) {
                        return {
                            id: e.computed(function () {
                                return "#" + e.unwrap(t.id);
                            }),
                            items: t.content.data,
                        };
                    },
                },
                itemTemplate: {
                    name: "carouselContent",
                    templateEngine: e.stringTemplateEngine.instance,
                    converter: function (e) {
                        return e;
                    },
                },
            },
            init: function (a, n, i, r, o) {
                var s = t(a),
                    d = n(),
                    l = e.bindingHandlers.carousel.defaults,
                    p = function (e, a) {
                        var n = { name: e.name, data: (d[a] && (d[a].data || (d[a].dataConverter && d[a].dataConverter(d)))) || e.dataConverter(d) };
                        return (n = t.extend(!0, {}, n, d[a])), (d[a] && d[a].name) || (n.templateEngine = e.templateEngine), n;
                    };
                if (!d.content) throw new Error("content option is required for carousel binding");
                a.id ? (d.id = a.id) : d.id ? (a.id = e.unwrap(d.id)) : (a.id = d.id = e.utils.uniqueId("ks-carousel-"));
                var c = {
                    id: d.id,
                    controlsTemplate: p(l.controlsTemplate, "controls"),
                    indicatorsTemplate: p(l.indicatorsTemplate, "indicators"),
                    items: d.content.data,
                    converter: d.content.converter || l.itemTemplate.converter,
                    itemTemplateName: d.content.name || l.itemTemplate.name,
                    templateEngine: d.content.name ? null : l.itemTemplate.templateEngine,
                    afterRender: d.content.afterRender,
                    afterAdd: d.content.afterAdd,
                    beforeRemove: d.content.beforeRemove,
                };
                return e.renderTemplate("carousel", o.createChildContext(c), { templateEngine: e.stringTemplateEngine.instance }, a), s.addClass(l.css), { controlsDescendantBindings: !0 };
            },
            update: function (a, n) {
                var i = n(),
                    r = e.unwrap(i.options);
                t(a).carousel(r);
            },
        }),
        (e.bindingHandlers.checkbox = {
            init: function (a, n) {
                var i = t(a),
                    r = function (a) {
                        setTimeout(function () {
                            var i = t(a.target),
                                r = n(),
                                o = i.val(),
                                s = i.parent().hasClass("active");
                            if (e.unwrap(r) instanceof Array) {
                                var d = e.unwrap(r).indexOf(o);
                                s && -1 === d ? r.push(o) : s || -1 === d || r.splice(d, 1);
                            } else r(s);
                        }, 0);
                    };
                if ("buttons" === i.attr("data-toggle") && i.find("input:checkbox").length) {
                    if (!(e.unwrap(n()) instanceof Array)) throw new Error("checkbox binding should be used only with array or observableArray values in this case");
                    i.on("change", "input:checkbox", r);
                } else {
                    if ("checkbox" !== i.attr("type")) throw new Error("checkbox binding should be used only with bootstrap checkboxes");
                    if (!e.isObservable(n())) throw new Error("checkbox binding should be used only with observable values in this case");
                    i.on("change", r);
                }
            },
            update: function (a, n) {
                var i,
                    r = t(a),
                    o = e.unwrap(n());
                o instanceof Array
                    ? "buttons" === r.attr("data-toggle")
                        ? r.find("input:checkbox").each(function (e, a) {
                              (i = -1 !== o.indexOf(a.value)), t(a).parent().toggleClass("active", i), (a.checked = i);
                          })
                        : ((i = -1 !== o.indexOf(r.val())), r.toggleClass("active", i), r.find("input").prop("checked", i))
                    : ((i = !!o), r.prop("checked", i), r.parent().toggleClass("active", i));
            },
        }),
        (e.bindingHandlers.modal = {
            defaults: {
                css: "modal fade",
                dialogCss: "",
                attributes: { role: "dialog" },
                headerTemplate: { name: "modalHeader", templateEngine: e.stringTemplateEngine.instance },
                bodyTemplate: { name: "modalBody", templateEngine: e.stringTemplateEngine.instance },
                footerTemplate: { name: "modalFooter", templateEngine: e.stringTemplateEngine.instance, data: { closeLabel: "Close", primaryLabel: "Ok" } },
            },
            init: function (a, n, i, r, o) {
                var s = t(a),
                    d = n(),
                    l = e.bindingHandlers.modal.defaults,
                    p = e.utils.extend({ show: s.data().show || !1 }, e.utils.unwrapProperties(d.options)),
                    c = function (e, a) {
                        var n = { name: e.name, data: e.data };
                        return (n = t.extend(!0, {}, n, a)), (a && a.name) || (n.templateEngine = e.templateEngine), n;
                    };
                if (!d.header || !d.body) throw new Error("header and body options are required for modal binding.");
                (p.keyboard || void 0 === p.keyboard) && s.attr("tabindex", -1);
                var u = {
                    dialogCss: d.dialogCss || l.dialogCss,
                    headerTemplate: c(l.headerTemplate, e.unwrap(d.header)),
                    bodyTemplate: c(l.bodyTemplate, e.unwrap(d.body)),
                    footerTemplate: d.footer ? c(l.footerTemplate, e.unwrap(d.footer)) : null,
                };
                return (
                    e.renderTemplate("modal", o.createChildContext(u), { templateEngine: e.stringTemplateEngine.instance }, a),
                    s.addClass(l.css).attr(l.attributes),
                    s.modal(p),
                    s.on("shown.bs.modal", function () {
                        void 0 !== d.visible && d.visible(!0), t(this).find("[autofocus]:first").focus();
                    }),
                    void 0 !== d.visible &&
                        (s.on("hidden.bs.modal", function () {
                            d.visible(!1);
                        }),
                        p.show && d.visible(!0)),
                    { controlsDescendantBindings: !0 }
                );
            },
            update: function (a, n) {
                var i = n();
                void 0 !== i.visible && t(a).modal(e.unwrap(i.visible) ? "show" : "hide");
            },
        });
    var i = "__popoverTemplateKey__";
    (e.bindingHandlers.popover = {
        init: function (a) {
            var n = t(a);
            e.utils.domNodeDisposal.addDisposeCallback(a, function () {
                n.data("bs.popover") && n.popover("destroy");
            });
        },
        update: function (a, n, r, o, s) {
            var d = t(a),
                l = e.unwrap(n()),
                p = (l.options || l.template ? e.utils.unwrapProperties(l.options) : e.utils.unwrapProperties(l)) || {};
            if (l.template) {
                e.unwrap(l.template);
                var c = e.utils.domData.get(a, i),
                    u = e.unwrap(l.data),
                    m = function () {
                        e.renderTemplate(e.unwrap(l.template), s.createChildContext(u), l.templateOptions, document.getElementById(c));
                        var a = t("#" + c).parents(".popover"),
                            n = d.data("bs.popover"),
                            i = n.getCalculatedOffset(p.placement || "right", n.getPosition(), a.outerWidth(), a.outerHeight());
                        n.applyPlacement(i, p.placement || "right");
                    };
                c || ((c = e.utils.uniqueId("ks-popover-")), e.utils.domData.set(a, i, c), d.on("shown.bs.popover", m)), (p.content = '<div id="' + c + '" ></div>'), (p.html = !0), t("#" + c).is(":visible") && m();
            }
            var v = d.data("bs.popover");
            v
                ? e.utils.extend(v.options, p)
                : (d.popover(p),
                  d.on("shown.bs.popover", function () {
                      (p.container ? t(p.container) : d.parent()).one("click", '[data-dismiss="popover"]', function () {
                          d.popover("hide");
                      });
                  }));
        },
    }),
        (e.bindingHandlers.progress = {
            defaults: { css: "progress", text: "", textHidden: !0, striped: !1, type: "", animated: !1 },
            init: function (a, n) {
                var i = t(a),
                    r = n(),
                    o = e.unwrap(r),
                    s = e.bindingHandlers.progress.defaults,
                    d = t.extend({}, s, o);
                if ("number" == typeof o)
                    (d.value = r),
                        (d.barWidth = e.computed(function () {
                            return e.unwrap(r) + "%";
                        }));
                else {
                    if ("number" != typeof e.unwrap(o.value)) throw new Error('progress binding can accept only numbers or objects with "value" number propertie');
                    d.barWidth = e.computed(function () {
                        return e.unwrap(o.value) + "%";
                    });
                }
                return (
                    (d.innerCss = e.computed(function () {
                        var t = e.utils.unwrapProperties(o),
                            a = "";
                        return t.animated && (a += "active "), t.striped && (a += "progress-bar-striped "), t.type && (a += "progress-bar-" + t.type), a;
                    })),
                    e.renderTemplate("progress", d, { templateEngine: e.stringTemplateEngine.instance }, a),
                    i.addClass(s.css),
                    { controlsDescendantBindings: !0 }
                );
            },
        }),
        (e.bindingHandlers.radio = {
            init: function (a, n) {
                if (!e.isObservable(n())) throw new Error("radio binding should be used only with observable values");
                t(a).on("change", "input:radio", function (e) {
                    setTimeout(function () {
                        var a = t(e.target);
                        n()(a.val());
                    }, 0);
                });
            },
            update: function (a, n) {
                var i,
                    r = t(a).find('input[value="' + e.unwrap(n()) + '"]');
                r.length ? ((i = r.parent()).siblings().removeClass("active"), i.addClass("active"), r.prop("checked", !0)) : ((i = t(a).find(".active")).removeClass("active"), i.find("input").prop("checked", !1));
            },
        }),
        (e.bindingHandlers.toggle = {
            init: function (a, n) {
                var i = n();
                if (!e.isObservable(i)) throw new Error("toggle binding should be used only with observable values");
                t(a).on("click", function () {
                    var t = e.unwrap(i);
                    i(!t);
                });
            },
            update: function (t, a) {
                e.utils.toggleDomNodeCssClass(t, "active", e.unwrap(a()));
            },
        }),
        (e.bindingHandlers.tooltip = {
            init: function (a) {
                var n = t(a);
                e.utils.domNodeDisposal.addDisposeCallback(a, function () {
                    n.data("bs.tooltip") && n.tooltip("destroy");
                });
            },
            update: function (a, n) {
                var i = t(a),
                    r = e.unwrap(n()),
                    o = e.utils.unwrapProperties(r),
                    s = i.data("bs.tooltip");
                s ? e.utils.extend(s.options, o) : i.tooltip(o);
            },
        });
});
/**! @preserve
 * @copyright &copy; Kartik Visweswaran, Krajee.com, 2014
 * @version 1.4.0
 *
 * Bootstrap Popover Extended - Popover with modal behavior, styling enhancements and more.
 *
 * For more JQuery/Bootstrap plugins and demos visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
!(function (t) {
    var e = function (e, o) {
        var r = this;
        (r.options = o), (r.$element = t(e).on("click.dismiss.popoverX", '[data-dismiss="popover-x"]', t.proxy(r.hide, r))), r.init();
    };
    (e.prototype = t.extend({}, t.fn.modal.Constructor.prototype, {
        constructor: e,
        init: function () {
            var e = this;
            (e.$body = t(document.body)),
                (e.$target = e.options.$target),
                (e.useOffsetForPos = void 0 == e.options.useOffsetForPos || e.options.useOffsetForPos),
                e.$element.find(".popover-footer").length && e.$element.removeClass("has-footer").addClass("has-footer"),
                e.options.remote &&
                    e.$element.find(".popover-content").load(e.options.remote, function () {
                        e.$element.trigger("load.complete.popoverX");
                    });
        },
        getPosition: function () {
            var e = this.$target,
                o = this.useOffsetForPos ? e.offset() : e.position();
            return t.extend({}, o, { width: e[0].offsetWidth, height: e[0].offsetHeight });
        },
        refreshPosition: function () {
            var t,
                e = this,
                o = e.$element,
                r = e.options.placement,
                a = o[0].offsetWidth,
                i = o[0].offsetHeight,
                p = e.getPosition();
            switch (r) {
                case "bottom":
                    t = { top: p.top + p.height, left: p.left + p.width / 2 - a / 2 };
                    break;
                case "bottom bottom-left":
                    t = { top: p.top + p.height, left: p.left };
                    break;
                case "bottom bottom-right":
                    t = { top: p.top + p.height, left: p.left + p.width - a };
                    break;
                case "top":
                    t = { top: p.top - i, left: p.left + p.width / 2 - a / 2 };
                    break;
                case "top top-left":
                    t = { top: p.top - i, left: p.left };
                    break;
                case "top top-right":
                    t = { top: p.top - i, left: p.left + p.width - a };
                    break;
                case "left":
                    t = { top: p.top + p.height / 2 - i / 2, left: p.left - a };
                    break;
                case "left left-top":
                    t = { top: p.top, left: p.left - a };
                    break;
                case "left left-bottom":
                    t = { top: p.top + p.height - i, left: p.left - a };
                    break;
                case "right":
                    t = { top: p.top + p.height / 2 - i / 2, left: p.left + p.width };
                    break;
                case "right right-top":
                    t = { top: p.top, left: p.left + p.width };
                    break;
                case "right right-bottom":
                    t = { top: p.top + p.height - i, left: p.left + p.width };
            }
            o.css(t).addClass(r).addClass("in");
        },
        show: function () {
            var e = this,
                o = e.$element;
            o.css({ top: 0, left: 0, display: "block", "z-index": 1050 }), e.refreshPosition(), t.fn.modal.Constructor.prototype.show.call(e, arguments), o.css({ padding: 0 });
        },
    })),
        (t.fn.popoverX = function (o) {
            return this.each(function () {
                var r = t(this),
                    a = r.data("popover-x"),
                    i = t.extend({}, t.fn.popoverX.defaults, r.data(), "object" == typeof o && o);
                if ((i.$target || (a && a.$target ? (i.$target = a.$target) : (i.$target = o.$target || t(o.target))), a)) {
                    if ("object" == typeof o && o) for (var p in ("placement" in o && r.removeClass(a.options.placement), o)) o.hasOwnProperty(p) && (a.options[p] = o[p]);
                } else r.data("popover-x", (a = new e(this, i)));
                "string" == typeof o && a[o]();
            });
        }),
        (t.fn.popoverX.defaults = t.extend({}, t.fn.modal.defaults, { placement: "right", keyboard: !0 })),
        t(document).on("ready", function () {
            t("[data-toggle='popover-x']").on("click", function (e) {
                var o = t(this),
                    r = o.attr("href"),
                    a = t(o.attr("data-target") || (r && r.replace(/.*(?=#[^\s]+$)/, ""))),
                    i = a.data("popover-x") ? "toggle" : t.extend({ remote: !/#/.test(r) && r }, a.data(), o.data());
                e.preventDefault(),
                    a.trigger("click.target.popoverX"),
                    "toggle" !== i
                        ? ((i.$target = o),
                          a
                              .popoverX(i)
                              .popoverX("show")
                              .on("hide", function () {
                                  o.focus();
                              }))
                        : a.popoverX(i).on("hide", function () {
                              o.focus();
                          });
            }),
                t('[data-toggle="popover-x"]').on("keyup", function (e) {
                    var o = t(this),
                        r = t(o.attr("data-target") || (href && href.replace(/.*(?=#[^\s]+$)/, "")));
                    r && 27 == e.which && r.trigger("keyup.target.popoverX") && r.popoverX("hide");
                });
        });
})(window.jQuery);
