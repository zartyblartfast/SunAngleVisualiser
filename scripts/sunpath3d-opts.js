var libtess = {
    DEBUG: !0,
    assert: function (e, t) {
        if (libtess.DEBUG && !e) throw new Error("Assertion failed" + (t ? ": " + t : ""));
    },
    GLU_TESS_MAX_COORD: 1e150,
    TRUE_PROJECT: !1,
    TESS_MAX_CACHE: 100,
    GLU_TESS_DEFAULT_TOLERANCE: 0,
    windingRule: { GLU_TESS_WINDING_ODD: 100130, GLU_TESS_WINDING_NONZERO: 100131, GLU_TESS_WINDING_POSITIVE: 100132, GLU_TESS_WINDING_NEGATIVE: 100133, GLU_TESS_WINDING_ABS_GEQ_TWO: 100134 },
    primitiveType: { GL_LINE_LOOP: 2, GL_TRIANGLES: 4, GL_TRIANGLE_STRIP: 5, GL_TRIANGLE_FAN: 6 },
    errorType: {
        GLU_TESS_MISSING_BEGIN_POLYGON: 100151,
        GLU_TESS_MISSING_END_POLYGON: 100153,
        GLU_TESS_MISSING_BEGIN_CONTOUR: 100152,
        GLU_TESS_MISSING_END_CONTOUR: 100154,
        GLU_TESS_COORD_TOO_LARGE: 100155,
        GLU_TESS_NEED_COMBINE_CALLBACK: 100156,
    },
    gluEnum: {
        GLU_TESS_BEGIN: 100100,
        GLU_TESS_VERTEX: 100101,
        GLU_TESS_END: 100102,
        GLU_TESS_ERROR: 100103,
        GLU_TESS_EDGE_FLAG: 100104,
        GLU_TESS_COMBINE: 100105,
        GLU_TESS_BEGIN_DATA: 100106,
        GLU_TESS_VERTEX_DATA: 100107,
        GLU_TESS_END_DATA: 100108,
        GLU_TESS_ERROR_DATA: 100109,
        GLU_TESS_EDGE_FLAG_DATA: 100110,
        GLU_TESS_COMBINE_DATA: 100111,
        GLU_TESS_MESH: 100112,
        GLU_TESS_TOLERANCE: 100142,
        GLU_TESS_WINDING_RULE: 100140,
        GLU_TESS_BOUNDARY_ONLY: 100141,
        GLU_INVALID_ENUM: 100900,
        GLU_INVALID_VALUE: 100901,
    },
};
libtess.PQHandle,
    libtess.PQKey,
    (libtess.geom = {}),
    (libtess.geom.vertEq = function (e, t) {
        return e.s === t.s && e.t === t.t;
    }),
    (libtess.geom.vertLeq = function (e, t) {
        return e.s < t.s || (e.s === t.s && e.t <= t.t);
    }),
    (libtess.geom.edgeEval = function (e, t, i) {
        libtess.assert(libtess.geom.vertLeq(e, t) && libtess.geom.vertLeq(t, i));
        var n = t.s - e.s,
            s = i.s - t.s;
        return 0 < n + s ? (n < s ? t.t - e.t + (e.t - i.t) * (n / (n + s)) : t.t - i.t + (i.t - e.t) * (s / (n + s))) : 0;
    }),
    (libtess.geom.edgeSign = function (e, t, i) {
        libtess.assert(libtess.geom.vertLeq(e, t) && libtess.geom.vertLeq(t, i));
        var n = t.s - e.s,
            s = i.s - t.s;
        return 0 < n + s ? (t.t - i.t) * n + (t.t - e.t) * s : 0;
    }),
    (libtess.geom.transLeq = function (e, t) {
        return e.t < t.t || (e.t === t.t && e.s <= t.s);
    }),
    (libtess.geom.transEval = function (e, t, i) {
        libtess.assert(libtess.geom.transLeq(e, t) && libtess.geom.transLeq(t, i));
        var n = t.t - e.t,
            s = i.t - t.t;
        return 0 < n + s ? (n < s ? t.s - e.s + (e.s - i.s) * (n / (n + s)) : t.s - i.s + (i.s - e.s) * (s / (n + s))) : 0;
    }),
    (libtess.geom.transSign = function (e, t, i) {
        libtess.assert(libtess.geom.transLeq(e, t) && libtess.geom.transLeq(t, i));
        var n = t.t - e.t,
            s = i.t - t.t;
        return 0 < n + s ? (t.s - i.s) * n + (t.s - e.s) * s : 0;
    }),
    (libtess.geom.edgeGoesLeft = function (e) {
        return libtess.geom.vertLeq(e.dst(), e.org);
    }),
    (libtess.geom.edgeGoesRight = function (e) {
        return libtess.geom.vertLeq(e.org, e.dst());
    }),
    (libtess.geom.vertL1dist = function (e, t) {
        return Math.abs(e.s - t.s) + Math.abs(e.t - t.t);
    }),
    (libtess.geom.vertCCW = function (e, t, i) {
        return 0 <= e.s * (t.t - i.t) + t.s * (i.t - e.t) + i.s * (e.t - t.t);
    }),
    (libtess.geom.interpolate_ = function (e, t, i, n) {
        return (e = e < 0 ? 0 : e) <= (i = i < 0 ? 0 : i) ? (0 === i ? (t + n) / 2 : t + (e / (e + i)) * (n - t)) : n + (i / (e + i)) * (t - n);
    }),
    (libtess.geom.edgeIntersect = function (e, t, i, n, s) {
        var a, r, o;
        libtess.geom.vertLeq(e, t) || ((o = e), (e = t), (t = o)),
            libtess.geom.vertLeq(i, n) || ((o = i), (i = n), (n = o)),
            libtess.geom.vertLeq(e, i) || ((o = e), (e = i), (i = o), (o = t), (t = n), (n = o)),
            libtess.geom.vertLeq(i, t)
                ? libtess.geom.vertLeq(t, n)
                    ? ((a = libtess.geom.edgeEval(e, i, t)) + (r = libtess.geom.edgeEval(i, t, n)) < 0 && ((a = -a), (r = -r)), (s.s = libtess.geom.interpolate_(a, i.s, r, t.s)))
                    : ((a = libtess.geom.edgeSign(e, i, t)) + (r = -libtess.geom.edgeSign(e, n, t)) < 0 && ((a = -a), (r = -r)), (s.s = libtess.geom.interpolate_(a, i.s, r, n.s)))
                : (s.s = (i.s + t.s) / 2),
            libtess.geom.transLeq(e, t) || ((o = e), (e = t), (t = o)),
            libtess.geom.transLeq(i, n) || ((o = i), (i = n), (n = o)),
            libtess.geom.transLeq(e, i) || ((o = e), (e = i), (i = o), (o = t), (t = n), (n = o)),
            libtess.geom.transLeq(i, t)
                ? libtess.geom.transLeq(t, n)
                    ? ((a = libtess.geom.transEval(e, i, t)) + (r = libtess.geom.transEval(i, t, n)) < 0 && ((a = -a), (r = -r)), (s.t = libtess.geom.interpolate_(a, i.t, r, t.t)))
                    : ((a = libtess.geom.transSign(e, i, t)) + (r = -libtess.geom.transSign(e, n, t)) < 0 && ((a = -a), (r = -r)), (s.t = libtess.geom.interpolate_(a, i.t, r, n.t)))
                : (s.t = (i.t + t.t) / 2);
    }),
    (libtess.mesh = {}),
    (libtess.mesh.makeEdge = function (e) {
        var t = libtess.mesh.makeEdgePair_(e.eHead);
        return libtess.mesh.makeVertex_(t, e.vHead), libtess.mesh.makeVertex_(t.sym, e.vHead), libtess.mesh.makeFace_(t, e.fHead), t;
    }),
    (libtess.mesh.meshSplice = function (e, t) {
        var i = !1,
            n = !1;
        e !== t &&
            (t.org !== e.org && ((n = !0), libtess.mesh.killVertex_(t.org, e.org)),
            t.lFace !== e.lFace && ((i = !0), libtess.mesh.killFace_(t.lFace, e.lFace)),
            libtess.mesh.splice_(t, e),
            n || (libtess.mesh.makeVertex_(t, e.org), (e.org.anEdge = e)),
            i || (libtess.mesh.makeFace_(t, e.lFace), (e.lFace.anEdge = e)));
    }),
    (libtess.mesh.deleteEdge = function (e) {
        var t = e.sym,
            i = !1;
        e.lFace !== e.rFace() && ((i = !0), libtess.mesh.killFace_(e.lFace, e.rFace())),
            e.oNext === e ? libtess.mesh.killVertex_(e.org, null) : ((e.rFace().anEdge = e.oPrev()), (e.org.anEdge = e.oNext), libtess.mesh.splice_(e, e.oPrev()), i || libtess.mesh.makeFace_(e, e.lFace)),
            t.oNext === t ? (libtess.mesh.killVertex_(t.org, null), libtess.mesh.killFace_(t.lFace, null)) : ((e.lFace.anEdge = t.oPrev()), (t.org.anEdge = t.oNext), libtess.mesh.splice_(t, t.oPrev())),
            libtess.mesh.killEdge_(e);
    }),
    (libtess.mesh.addEdgeVertex = function (e) {
        var t = libtess.mesh.makeEdgePair_(e),
            i = t.sym;
        return libtess.mesh.splice_(t, e.lNext), (t.org = e.dst()), libtess.mesh.makeVertex_(i, t.org), (t.lFace = i.lFace = e.lFace), t;
    }),
    (libtess.mesh.splitEdge = function (e) {
        var t = libtess.mesh.addEdgeVertex(e).sym;
        return libtess.mesh.splice_(e.sym, e.sym.oPrev()), libtess.mesh.splice_(e.sym, t), (e.sym.org = t.org), (t.dst().anEdge = t.sym), (t.sym.lFace = e.rFace()), (t.winding = e.winding), (t.sym.winding = e.sym.winding), t;
    }),
    (libtess.mesh.connect = function (e, t) {
        var i = !1,
            n = libtess.mesh.makeEdgePair_(e),
            s = n.sym;
        return (
            t.lFace !== e.lFace && ((i = !0), libtess.mesh.killFace_(t.lFace, e.lFace)),
            libtess.mesh.splice_(n, e.lNext),
            libtess.mesh.splice_(s, t),
            (n.org = e.dst()),
            (s.org = t.org),
            (n.lFace = s.lFace = e.lFace),
            (e.lFace.anEdge = s),
            i || libtess.mesh.makeFace_(n, e.lFace),
            n
        );
    }),
    (libtess.mesh.zapFace = function (e) {
        var t = e.anEdge,
            i = t.lNext;
        do {
            var n,
                s,
                i = (s = i).lNext;
        } while (
            ((s.lFace = null) === s.rFace() &&
                (s.oNext === s ? libtess.mesh.killVertex_(s.org, null) : ((s.org.anEdge = s.oNext), libtess.mesh.splice_(s, s.oPrev())),
                (n = s.sym).oNext === n ? libtess.mesh.killVertex_(n.org, null) : ((n.org.anEdge = n.oNext), libtess.mesh.splice_(n, n.oPrev())),
                libtess.mesh.killEdge_(s)),
            s !== t)
        );
        var a = e.prev,
            e = e.next;
        (e.prev = a).next = e;
    }),
    (libtess.mesh.meshUnion = function (e, t) {
        var i = e.fHead,
            n = e.vHead,
            s = e.eHead,
            a = t.fHead,
            r = t.vHead,
            t = t.eHead;
        return (
            a.next !== a && ((i.prev.next = a.next), (a.next.prev = i.prev), ((a.prev.next = i).prev = a.prev)),
            r.next !== r && ((n.prev.next = r.next), (r.next.prev = n.prev), ((r.prev.next = n).prev = r.prev)),
            t.next !== t && ((s.sym.next.sym.next = t.next), (t.next.sym.next = s.sym.next), ((t.sym.next.sym.next = s).sym.next = t.sym.next)),
            e
        );
    }),
    (libtess.mesh.deleteMesh = function (e) {}),
    (libtess.mesh.makeEdgePair_ = function (e) {
        var t = new libtess.GluHalfEdge(),
            i = new libtess.GluHalfEdge(),
            n = e.sym.next;
        return ((((i.next = n).sym.next = t).next = e).sym.next = i), (t.sym = i), (((t.oNext = t).lNext = i).sym = t), ((i.oNext = i).lNext = t);
    }),
    (libtess.mesh.splice_ = function (e, t) {
        var i = e.oNext,
            n = t.oNext;
        (i.sym.lNext = t), ((n.sym.lNext = e).oNext = n), (t.oNext = i);
    }),
    (libtess.mesh.makeVertex_ = function (e, t) {
        var i = t.prev,
            n = new libtess.GluVertex(t, i);
        i.next = n;
        for (var s = ((t.prev = n).anEdge = e); (s.org = n), (s = s.oNext) !== e; );
    }),
    (libtess.mesh.makeFace_ = function (e, t) {
        var i = t.prev,
            n = new libtess.GluFace(t, i);
        (i.next = n), ((t.prev = n).anEdge = e), (n.inside = t.inside);
        for (var s = e; (s.lFace = n), (s = s.lNext) !== e; );
    }),
    (libtess.mesh.killEdge_ = function (e) {
        var t = e.next,
            e = e.sym.next;
        (t.sym.next = e).sym.next = t;
    }),
    (libtess.mesh.killVertex_ = function (e, t) {
        for (var i = e.anEdge, n = i; (n.org = t), (n = n.oNext) !== i; );
        var s = e.prev,
            e = e.next;
        (e.prev = s).next = e;
    }),
    (libtess.mesh.killFace_ = function (e, t) {
        for (var i = e.anEdge, n = i; (n.lFace = t), (n = n.lNext) !== i; );
        var s = e.prev,
            e = e.next;
        (e.prev = s).next = e;
    }),
    (libtess.normal = {}),
    (libtess.normal.S_UNIT_X_ = 1),
    (libtess.normal.S_UNIT_Y_ = 0),
    (libtess.normal.projectPolygon = function (e) {
        var t = !1,
            i = [e.normal[0], e.normal[1], e.normal[2]];
        0 === i[0] && 0 === i[1] && 0 === i[2] && (libtess.normal.computeNormal_(e, i), (t = !0));
        var n,
            s = e.sUnit,
            a = e.tUnit,
            r = libtess.normal.longAxis_(i);
        libtess.TRUE_PROJECT
            ? (libtess.normal.normalize_(i),
              (s[r] = 0),
              (s[(r + 1) % 3] = libtess.normal.S_UNIT_X_),
              (s[(r + 2) % 3] = libtess.normal.S_UNIT_Y_),
              (n = libtess.normal.dot_(s, i)),
              (s[0] -= n * i[0]),
              (s[1] -= n * i[1]),
              (s[2] -= n * i[2]),
              libtess.normal.normalize_(s),
              (a[0] = i[1] * s[2] - i[2] * s[1]),
              (a[1] = i[2] * s[0] - i[0] * s[2]),
              (a[2] = i[0] * s[1] - i[1] * s[0]),
              libtess.normal.normalize_(a))
            : ((s[r] = 0),
              (s[(r + 1) % 3] = libtess.normal.S_UNIT_X_),
              (s[(r + 2) % 3] = libtess.normal.S_UNIT_Y_),
              (a[r] = 0),
              (a[(r + 1) % 3] = 0 < i[r] ? -libtess.normal.S_UNIT_Y_ : libtess.normal.S_UNIT_Y_),
              (a[(r + 2) % 3] = 0 < i[r] ? libtess.normal.S_UNIT_X_ : -libtess.normal.S_UNIT_X_));
        for (var o = e.mesh.vHead, l = o.next; l !== o; l = l.next) (l.s = libtess.normal.dot_(l.coords, s)), (l.t = libtess.normal.dot_(l.coords, a));
        t && libtess.normal.checkOrientation_(e);
    }),
    (libtess.normal.dot_ = function (e, t) {
        return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
    }),
    (libtess.normal.normalize_ = function (e) {
        var t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
        libtess.assert(0 < t), (t = Math.sqrt(t)), (e[0] /= t), (e[1] /= t), (e[2] /= t);
    }),
    (libtess.normal.longAxis_ = function (e) {
        var t = 0;
        return Math.abs(e[1]) > Math.abs(e[0]) && (t = 1), Math.abs(e[2]) > Math.abs(e[t]) && (t = 2), t;
    }),
    (libtess.normal.computeNormal_ = function (e, t) {
        for (
            var i = [-2 * libtess.GLU_TESS_MAX_COORD, -2 * libtess.GLU_TESS_MAX_COORD, -2 * libtess.GLU_TESS_MAX_COORD],
                n = [2 * libtess.GLU_TESS_MAX_COORD, 2 * libtess.GLU_TESS_MAX_COORD, 2 * libtess.GLU_TESS_MAX_COORD],
                s = [],
                a = [],
                r = e.mesh.vHead,
                o = r.next;
            o !== r;
            o = o.next
        )
            for (var l = 0; l < 3; ++l) {
                var d = o.coords[l];
                d < n[l] && ((n[l] = d), (a[l] = o)), d > i[l] && ((i[l] = d), (s[l] = o));
            }
        var h = 0;
        if ((i[1] - n[1] > i[0] - n[0] && (h = 1), i[2] - n[2] > i[h] - n[h] && (h = 2), n[h] >= i[h])) return (t[0] = 0), (t[1] = 0), void (t[2] = 1);
        var c = 0,
            e = a[h],
            p = s[h],
            u = [0, 0, 0],
            g = [e.coords[0] - p.coords[0], e.coords[1] - p.coords[1], e.coords[2] - p.coords[2]],
            m = [0, 0, 0];
        for (o = r.next; o !== r; o = o.next) {
            (m[0] = o.coords[0] - p.coords[0]), (m[1] = o.coords[1] - p.coords[1]), (m[2] = o.coords[2] - p.coords[2]), (u[0] = g[1] * m[2] - g[2] * m[1]), (u[1] = g[2] * m[0] - g[0] * m[2]), (u[2] = g[0] * m[1] - g[1] * m[0]);
            var f = u[0] * u[0] + u[1] * u[1] + u[2] * u[2];
            c < f && ((c = f), (t[0] = u[0]), (t[1] = u[1]), (t[2] = u[2]));
        }
        c <= 0 && ((t[0] = t[1] = t[2] = 0), (t[libtess.normal.longAxis_(g)] = 1));
    }),
    (libtess.normal.checkOrientation_ = function (e) {
        for (var t = 0, i = e.mesh.fHead, n = i.next; n !== i; n = n.next) {
            var s = n.anEdge;
            if (!(s.winding <= 0)) for (; (t += (s.org.s - s.dst().s) * (s.org.t + s.dst().t)), (s = s.lNext) !== n.anEdge; );
        }
        if (t < 0) {
            for (var a = e.mesh.vHead, r = a.next; r !== a; r = r.next) r.t = -r.t;
            (e.tUnit[0] = -e.tUnit[0]), (e.tUnit[1] = -e.tUnit[1]), (e.tUnit[2] = -e.tUnit[2]);
        }
    }),
    (libtess.render = {}),
    (libtess.render.renderMesh = function (e, t, i) {
        for (var n = !1, s = -1, a = t.fHead.prev; a !== t.fHead; a = a.prev)
            if (a.inside) {
                n || (e.callBeginOrBeginData(libtess.primitiveType.GL_TRIANGLES), (n = !0));
                var r,
                    o = a.anEdge;
                libtess.assert(o.lNext.lNext.lNext === o, "renderMesh called with non-triangulated mesh");
                do {} while ((!i || (s !== (r = o.rFace().inside ? 0 : 1) && ((s = r), e.callEdgeFlagOrEdgeFlagData(!!s))), e.callVertexOrVertexData(o.org.data), (o = o.lNext) !== a.anEdge));
            }
        n && e.callEndOrEndData();
    }),
    (libtess.render.renderBoundary = function (e, t) {
        for (var i = t.fHead.next; i !== t.fHead; i = i.next)
            if (i.inside) {
                e.callBeginOrBeginData(libtess.primitiveType.GL_LINE_LOOP);
                for (var n = i.anEdge; e.callVertexOrVertexData(n.org.data), (n = n.lNext) !== i.anEdge; );
                e.callEndOrEndData();
            }
    }),
    (libtess.sweep = {}),
    (libtess.sweep.SENTINEL_COORD_ = 4 * libtess.GLU_TESS_MAX_COORD),
    (libtess.sweep.TOLERANCE_NONZERO_ = !1),
    (libtess.sweep.computeInterior = function (e) {
        var t;
        for (e.fatalError = !1, libtess.sweep.removeDegenerateEdges_(e), libtess.sweep.initPriorityQ_(e), libtess.sweep.initEdgeDict_(e); null !== (t = e.pq.extractMin()); ) {
            for (;;) {
                var i = e.pq.minimum();
                if (null === i || !libtess.geom.vertEq(i, t)) break;
                (i = e.pq.extractMin()), libtess.sweep.spliceMergeVertices_(e, t.anEdge, i.anEdge);
            }
            libtess.sweep.sweepEvent_(e, t);
        }
        var n = e.dict.getMin().getKey();
        (e.event = n.eUp.org), libtess.sweep.doneEdgeDict_(e), libtess.sweep.donePriorityQ_(e), libtess.sweep.removeDegenerateFaces_(e.mesh), e.mesh.checkMesh();
    }),
    (libtess.sweep.addWinding_ = function (e, t) {
        (e.winding += t.winding), (e.sym.winding += t.sym.winding);
    }),
    (libtess.sweep.edgeLeq_ = function (e, t, i) {
        (e = e.event), (t = t.eUp), (i = i.eUp);
        if (t.dst() === e) return i.dst() === e ? (libtess.geom.vertLeq(t.org, i.org) ? libtess.geom.edgeSign(i.dst(), t.org, i.org) <= 0 : 0 <= libtess.geom.edgeSign(t.dst(), i.org, t.org)) : libtess.geom.edgeSign(i.dst(), e, i.org) <= 0;
        if (i.dst() === e) return 0 <= libtess.geom.edgeSign(t.dst(), e, t.org);
        t = libtess.geom.edgeEval(t.dst(), e, t.org);
        return libtess.geom.edgeEval(i.dst(), e, i.org) <= t;
    }),
    (libtess.sweep.deleteRegion_ = function (e, t) {
        t.fixUpperEdge && libtess.assert(0 === t.eUp.winding), (t.eUp.activeRegion = null), e.dict.deleteNode(t.nodeUp), (t.nodeUp = null);
    }),
    (libtess.sweep.fixUpperEdge_ = function (e, t) {
        libtess.assert(e.fixUpperEdge), libtess.mesh.deleteEdge(e.eUp), (e.fixUpperEdge = !1), ((e.eUp = t).activeRegion = e);
    }),
    (libtess.sweep.topLeftRegion_ = function (e) {
        for (var t, i = e.eUp.org; (e = e.regionAbove()).eUp.org === i; );
        return e.fixUpperEdge && ((t = libtess.mesh.connect(e.regionBelow().eUp.sym, e.eUp.lNext)), libtess.sweep.fixUpperEdge_(e, t), (e = e.regionAbove())), e;
    }),
    (libtess.sweep.topRightRegion_ = function (e) {
        for (var t = e.eUp.dst(); (e = e.regionAbove()).eUp.dst() === t; );
        return e;
    }),
    (libtess.sweep.addRegionBelow_ = function (e, t, i) {
        var n = new libtess.ActiveRegion();
        return (n.eUp = i), (n.nodeUp = e.dict.insertBefore(t.nodeUp, n)), (i.activeRegion = n);
    }),
    (libtess.sweep.isWindingInside_ = function (e, t) {
        switch (e.windingRule) {
            case libtess.windingRule.GLU_TESS_WINDING_ODD:
                return 0 != (1 & t);
            case libtess.windingRule.GLU_TESS_WINDING_NONZERO:
                return 0 !== t;
            case libtess.windingRule.GLU_TESS_WINDING_POSITIVE:
                return 0 < t;
            case libtess.windingRule.GLU_TESS_WINDING_NEGATIVE:
                return t < 0;
            case libtess.windingRule.GLU_TESS_WINDING_ABS_GEQ_TWO:
                return 2 <= t || t <= -2;
        }
        return libtess.assert(!1), !1;
    }),
    (libtess.sweep.computeWinding_ = function (e, t) {
        (t.windingNumber = t.regionAbove().windingNumber + t.eUp.winding), (t.inside = libtess.sweep.isWindingInside_(e, t.windingNumber));
    }),
    (libtess.sweep.finishRegion_ = function (e, t) {
        var i = t.eUp,
            n = i.lFace;
        (n.inside = t.inside), (n.anEdge = i), libtess.sweep.deleteRegion_(e, t);
    }),
    (libtess.sweep.finishLeftRegions_ = function (e, t, i) {
        for (var n = t, s = t.eUp; n !== i; ) {
            n.fixUpperEdge = !1;
            var a = n.regionBelow(),
                r = a.eUp;
            if (r.org !== s.org) {
                if (!a.fixUpperEdge) {
                    libtess.sweep.finishRegion_(e, n);
                    break;
                }
                (r = libtess.mesh.connect(s.lPrev(), r.sym)), libtess.sweep.fixUpperEdge_(a, r);
            }
            s.oNext !== r && (libtess.mesh.meshSplice(r.oPrev(), r), libtess.mesh.meshSplice(s, r)), libtess.sweep.finishRegion_(e, n), (s = a.eUp), (n = a);
        }
        return s;
    }),
    (libtess.sweep.addRightEdges_ = function (e, t, i, n, s, a) {
        for (var r = !0, o = i; libtess.assert(libtess.geom.vertLeq(o.org, o.dst())), libtess.sweep.addRegionBelow_(e, t, o.sym), (o = o.oNext) !== n; );
        null === s && (s = t.regionBelow().eUp.rPrev());
        for (var l, d = t, h = s; (o = (l = d.regionBelow()).eUp.sym).org === h.org; )
            o.oNext !== h && (libtess.mesh.meshSplice(o.oPrev(), o), libtess.mesh.meshSplice(h.oPrev(), o)),
                (l.windingNumber = d.windingNumber - o.winding),
                (l.inside = libtess.sweep.isWindingInside_(e, l.windingNumber)),
                (d.dirty = !0),
                !r && libtess.sweep.checkForRightSplice_(e, d) && (libtess.sweep.addWinding_(o, h), libtess.sweep.deleteRegion_(e, d), libtess.mesh.deleteEdge(h)),
                (r = !1),
                (d = l),
                (h = o);
        (d.dirty = !0), libtess.assert(d.windingNumber - o.winding === l.windingNumber), a && libtess.sweep.walkDirtyRegions_(e, d);
    }),
    (libtess.sweep.callCombine_ = function (e, t, i, n, s) {
        var a = [t.coords[0], t.coords[1], t.coords[2]];
        (t.data = null), (t.data = e.callCombineOrCombineData(a, i, n)), null === t.data && (s ? e.fatalError || (e.callErrorOrErrorData(libtess.errorType.GLU_TESS_NEED_COMBINE_CALLBACK), (e.fatalError = !0)) : (t.data = i[0]));
    }),
    (libtess.sweep.spliceMergeVertices_ = function (e, t, i) {
        var n = [null, null, null, null];
        (n[0] = t.org.data), (n[1] = i.org.data), libtess.sweep.callCombine_(e, t.org, n, [0.5, 0.5, 0, 0], !1), libtess.mesh.meshSplice(t, i);
    }),
    (libtess.sweep.vertexWeights_ = function (e, t, i, n, s) {
        var a = libtess.geom.vertL1dist(t, e),
            r = libtess.geom.vertL1dist(i, e),
            o = s,
            s = s + 1;
        (n[o] = (0.5 * r) / (a + r)),
            (n[s] = (0.5 * a) / (a + r)),
            (e.coords[0] += n[o] * t.coords[0] + n[s] * i.coords[0]),
            (e.coords[1] += n[o] * t.coords[1] + n[s] * i.coords[1]),
            (e.coords[2] += n[o] * t.coords[2] + n[s] * i.coords[2]);
    }),
    (libtess.sweep.getIntersectData_ = function (e, t, i, n, s, a) {
        var r = [0, 0, 0, 0],
            o = [i.data, n.data, s.data, a.data];
        (t.coords[0] = t.coords[1] = t.coords[2] = 0), libtess.sweep.vertexWeights_(t, i, n, r, 0), libtess.sweep.vertexWeights_(t, s, a, r, 2), libtess.sweep.callCombine_(e, t, o, r, !0);
    }),
    (libtess.sweep.checkForRightSplice_ = function (e, t) {
        var i = t.regionBelow(),
            n = t.eUp,
            s = i.eUp;
        if (libtess.geom.vertLeq(n.org, s.org)) {
            if (0 < libtess.geom.edgeSign(s.dst(), n.org, s.org)) return !1;
            libtess.geom.vertEq(n.org, s.org)
                ? n.org !== s.org && (e.pq.remove(n.org.pqHandle), libtess.sweep.spliceMergeVertices_(e, s.oPrev(), n))
                : (libtess.mesh.splitEdge(s.sym), libtess.mesh.meshSplice(n, s.oPrev()), (t.dirty = i.dirty = !0));
        } else {
            if (libtess.geom.edgeSign(n.dst(), s.org, n.org) < 0) return !1;
            (t.regionAbove().dirty = t.dirty = !0), libtess.mesh.splitEdge(n.sym), libtess.mesh.meshSplice(s.oPrev(), n);
        }
        return !0;
    }),
    (libtess.sweep.checkForLeftSplice_ = function (e, t) {
        var i,
            n = t.regionBelow(),
            s = t.eUp,
            a = n.eUp;
        if ((libtess.assert(!libtess.geom.vertEq(s.dst(), a.dst())), libtess.geom.vertLeq(s.dst(), a.dst()))) {
            if (libtess.geom.edgeSign(s.dst(), a.dst(), s.org) < 0) return !1;
            (t.regionAbove().dirty = t.dirty = !0), (i = libtess.mesh.splitEdge(s)), libtess.mesh.meshSplice(a.sym, i), (i.lFace.inside = t.inside);
        } else {
            if (0 < libtess.geom.edgeSign(a.dst(), s.dst(), a.org)) return !1;
            (t.dirty = n.dirty = !0), (i = libtess.mesh.splitEdge(a)), libtess.mesh.meshSplice(s.lNext, a.sym), (i.rFace().inside = t.inside);
        }
        return !0;
    }),
    (libtess.sweep.checkForIntersect_ = function (e, t) {
        var i = t.regionBelow(),
            n = t.eUp,
            s = i.eUp,
            a = n.org,
            r = s.org,
            o = n.dst(),
            l = s.dst(),
            d = new libtess.GluVertex();
        if (
            (libtess.assert(!libtess.geom.vertEq(l, o)),
            libtess.assert(libtess.geom.edgeSign(o, e.event, a) <= 0),
            libtess.assert(0 <= libtess.geom.edgeSign(l, e.event, r)),
            libtess.assert(a !== e.event && r !== e.event),
            libtess.assert(!t.fixUpperEdge && !i.fixUpperEdge),
            a === r)
        )
            return !1;
        var h = Math.min(a.t, o.t);
        if (Math.max(r.t, l.t) < h) return !1;
        if (libtess.geom.vertLeq(a, r)) {
            if (0 < libtess.geom.edgeSign(l, a, r)) return !1;
        } else if (libtess.geom.edgeSign(o, r, a) < 0) return !1;
        libtess.geom.edgeIntersect(o, a, l, r, d),
            libtess.assert(Math.min(a.t, o.t) <= d.t),
            libtess.assert(d.t <= Math.max(r.t, l.t)),
            libtess.assert(Math.min(l.s, o.s) <= d.s),
            libtess.assert(d.s <= Math.max(r.s, a.s)),
            libtess.geom.vertLeq(d, e.event) && ((d.s = e.event.s), (d.t = e.event.t));
        h = libtess.geom.vertLeq(a, r) ? a : r;
        if ((libtess.geom.vertLeq(h, d) && ((d.s = h.s), (d.t = h.t)), libtess.geom.vertEq(d, a) || libtess.geom.vertEq(d, r))) return libtess.sweep.checkForRightSplice_(e, t), !1;
        if ((!libtess.geom.vertEq(o, e.event) && 0 <= libtess.geom.edgeSign(o, e.event, d)) || (!libtess.geom.vertEq(l, e.event) && libtess.geom.edgeSign(l, e.event, d) <= 0)) {
            if (l === e.event)
                return (
                    libtess.mesh.splitEdge(n.sym),
                    libtess.mesh.meshSplice(s.sym, n),
                    (n = (t = libtess.sweep.topLeftRegion_(t)).regionBelow().eUp),
                    libtess.sweep.finishLeftRegions_(e, t.regionBelow(), i),
                    libtess.sweep.addRightEdges_(e, t, n.oPrev(), n, n, !0),
                    !0
                );
            if (o !== e.event)
                return (
                    0 <= libtess.geom.edgeSign(o, e.event, d) && ((t.regionAbove().dirty = t.dirty = !0), libtess.mesh.splitEdge(n.sym), (n.org.s = e.event.s), (n.org.t = e.event.t)),
                    libtess.geom.edgeSign(l, e.event, d) <= 0 && ((t.dirty = i.dirty = !0), libtess.mesh.splitEdge(s.sym), (s.org.s = e.event.s), (s.org.t = e.event.t)),
                    !1
                );
            libtess.mesh.splitEdge(s.sym), libtess.mesh.meshSplice(n.lNext, s.oPrev()), (i = t);
            h = (t = libtess.sweep.topRightRegion_(t)).regionBelow().eUp.rPrev();
            return (i.eUp = s.oPrev()), (s = libtess.sweep.finishLeftRegions_(e, i, null)), libtess.sweep.addRightEdges_(e, t, s.oNext, n.rPrev(), h, !0), !0;
        }
        return (
            libtess.mesh.splitEdge(n.sym),
            libtess.mesh.splitEdge(s.sym),
            libtess.mesh.meshSplice(s.oPrev(), n),
            (n.org.s = d.s),
            (n.org.t = d.t),
            (n.org.pqHandle = e.pq.insert(n.org)),
            libtess.sweep.getIntersectData_(e, n.org, a, o, r, l),
            !(t.regionAbove().dirty = t.dirty = i.dirty = !0)
        );
    }),
    (libtess.sweep.walkDirtyRegions_ = function (e, t) {
        for (var i = t.regionBelow(); ; ) {
            for (; i.dirty; ) i = (t = i).regionBelow();
            if (!(t.dirty || (null !== (t = (i = t).regionAbove()) && t.dirty))) return;
            t.dirty = !1;
            var n = t.eUp,
                s = i.eUp;
            if (
                (n.dst() !== s.dst() &&
                    libtess.sweep.checkForLeftSplice_(e, t) &&
                    (i.fixUpperEdge
                        ? (libtess.sweep.deleteRegion_(e, i), libtess.mesh.deleteEdge(s), (s = (i = t.regionBelow()).eUp))
                        : t.fixUpperEdge && (libtess.sweep.deleteRegion_(e, t), libtess.mesh.deleteEdge(n), (n = (t = i.regionAbove()).eUp))),
                n.org !== s.org)
            )
                if (n.dst() === s.dst() || t.fixUpperEdge || i.fixUpperEdge || (n.dst() !== e.event && s.dst() !== e.event)) libtess.sweep.checkForRightSplice_(e, t);
                else if (libtess.sweep.checkForIntersect_(e, t)) return;
            n.org === s.org && n.dst() === s.dst() && (libtess.sweep.addWinding_(s, n), libtess.sweep.deleteRegion_(e, t), libtess.mesh.deleteEdge(n), (t = i.regionAbove()));
        }
    }),
    (libtess.sweep.connectRightVertex_ = function (e, t, i) {
        var n = i.oNext,
            s = t.regionBelow(),
            a = t.eUp,
            r = s.eUp,
            o = !1;
        a.dst() !== r.dst() && libtess.sweep.checkForIntersect_(e, t),
            libtess.geom.vertEq(a.org, e.event) && (libtess.mesh.meshSplice(n.oPrev(), a), (n = (t = libtess.sweep.topLeftRegion_(t)).regionBelow().eUp), libtess.sweep.finishLeftRegions_(e, t.regionBelow(), s), (o = !0)),
            libtess.geom.vertEq(r.org, e.event) && (libtess.mesh.meshSplice(i, r.oPrev()), (i = libtess.sweep.finishLeftRegions_(e, s, null)), (o = !0)),
            o
                ? libtess.sweep.addRightEdges_(e, t, i.oNext, n, n, !0)
                : ((a = libtess.geom.vertLeq(r.org, a.org) ? r.oPrev() : a),
                  (a = libtess.mesh.connect(i.lPrev(), a)),
                  libtess.sweep.addRightEdges_(e, t, a, a.oNext, a.oNext, !1),
                  (a.sym.activeRegion.fixUpperEdge = !0),
                  libtess.sweep.walkDirtyRegions_(e, t));
    }),
    (libtess.sweep.connectLeftDegenerate_ = function (e, t, i) {
        var n,
            s,
            a,
            r,
            o = t.eUp;
        return libtess.geom.vertEq(o.org, i)
            ? (libtess.assert(libtess.sweep.TOLERANCE_NONZERO_), void (libtess.sweep.TOLERANCE_NONZERO_ && libtess.sweep.spliceMergeVertices_(e, o, i.anEdge)))
            : libtess.geom.vertEq(o.dst(), i)
            ? (libtess.assert(libtess.sweep.TOLERANCE_NONZERO_),
              void (
                  libtess.sweep.TOLERANCE_NONZERO_ &&
                  ((r = a = (s = (n = (t = libtess.sweep.topRightRegion_(t)).regionBelow()).eUp.sym).oNext),
                  n.fixUpperEdge && (libtess.assert(a !== s), libtess.sweep.deleteRegion_(e, n), libtess.mesh.deleteEdge(s), (s = a.oPrev())),
                  libtess.mesh.meshSplice(i.anEdge, s),
                  libtess.geom.edgeGoesLeft(a) || (a = null),
                  libtess.sweep.addRightEdges_(e, t, s.oNext, r, a, !0))
              ))
            : (libtess.mesh.splitEdge(o.sym), t.fixUpperEdge && (libtess.mesh.deleteEdge(o.oNext), (t.fixUpperEdge = !1)), libtess.mesh.meshSplice(i.anEdge, o), void libtess.sweep.sweepEvent_(e, i));
    }),
    (libtess.sweep.connectLeftVertex_ = function (e, t) {
        var i = new libtess.ActiveRegion();
        i.eUp = t.anEdge.sym;
        var n = e.dict.search(i).getKey(),
            s = n.regionBelow(),
            a = n.eUp,
            i = s.eUp;
        0 !== libtess.geom.edgeSign(a.dst(), t, a.org)
            ? ((s = libtess.geom.vertLeq(i.dst(), a.dst()) ? n : s),
              n.inside || s.fixUpperEdge
                  ? ((i = s === n ? libtess.mesh.connect(t.anEdge.sym, a.lNext) : libtess.mesh.connect(i.dNext(), t.anEdge).sym),
                    s.fixUpperEdge ? libtess.sweep.fixUpperEdge_(s, i) : libtess.sweep.computeWinding_(e, libtess.sweep.addRegionBelow_(e, n, i)),
                    libtess.sweep.sweepEvent_(e, t))
                  : libtess.sweep.addRightEdges_(e, n, t.anEdge, t.anEdge, null, !0))
            : libtess.sweep.connectLeftDegenerate_(e, n, t);
    }),
    (libtess.sweep.sweepEvent_ = function (e, t) {
        for (var i = (e.event = t).anEdge; null === i.activeRegion; ) if ((i = i.oNext) === t.anEdge) return void libtess.sweep.connectLeftVertex_(e, t);
        var n = libtess.sweep.topLeftRegion_(i.activeRegion),
            s = n.regionBelow(),
            a = s.eUp,
            s = libtess.sweep.finishLeftRegions_(e, s, null);
        s.oNext === a ? libtess.sweep.connectRightVertex_(e, n, s) : libtess.sweep.addRightEdges_(e, n, s.oNext, a, a, !0);
    }),
    (libtess.sweep.addSentinel_ = function (e, t) {
        var i = new libtess.ActiveRegion(),
            n = libtess.mesh.makeEdge(e.mesh);
        (n.org.s = libtess.sweep.SENTINEL_COORD_),
            (n.org.t = t),
            (n.dst().s = -libtess.sweep.SENTINEL_COORD_),
            (n.dst().t = t),
            (e.event = n.dst()),
            (i.eUp = n),
            (i.windingNumber = 0),
            (i.inside = !1),
            (i.fixUpperEdge = !1),
            (i.sentinel = !0),
            (i.dirty = !1),
            (i.nodeUp = e.dict.insert(i));
    }),
    (libtess.sweep.initEdgeDict_ = function (e) {
        (e.dict = new libtess.Dict(e, libtess.sweep.edgeLeq_)), libtess.sweep.addSentinel_(e, -libtess.sweep.SENTINEL_COORD_), libtess.sweep.addSentinel_(e, libtess.sweep.SENTINEL_COORD_);
    }),
    (libtess.sweep.doneEdgeDict_ = function (e) {
        for (var t, i = 0; null !== (t = e.dict.getMin().getKey()); ) t.sentinel || (libtess.assert(t.fixUpperEdge), libtess.assert(1 == ++i)), libtess.assert(0 === t.windingNumber), libtess.sweep.deleteRegion_(e, t);
        e.dict = null;
    }),
    (libtess.sweep.removeDegenerateEdges_ = function (e) {
        for (var t, i = e.mesh.eHead, n = i.next; n !== i; n = t) {
            t = n.next;
            var s = n.lNext;
            libtess.geom.vertEq(n.org, n.dst()) && n.lNext.lNext !== n && (libtess.sweep.spliceMergeVertices_(e, s, n), libtess.mesh.deleteEdge(n), (s = (n = s).lNext)),
                s.lNext === n && (s !== n && ((s !== t && s !== t.sym) || (t = t.next), libtess.mesh.deleteEdge(s)), (n !== t && n !== t.sym) || (t = t.next), libtess.mesh.deleteEdge(n));
        }
    }),
    (libtess.sweep.initPriorityQ_ = function (e) {
        var t = new libtess.PriorityQ(libtess.geom.vertLeq);
        e.pq = t;
        for (var i = e.mesh.vHead, n = i.next; n !== i; n = n.next) n.pqHandle = t.insert(n);
        t.init();
    }),
    (libtess.sweep.donePriorityQ_ = function (e) {
        e.pq.deleteQ(), (e.pq = null);
    }),
    (libtess.sweep.removeDegenerateFaces_ = function (e) {
        for (var t, i = e.fHead.next; i !== e.fHead; i = t) {
            t = i.next;
            var n = i.anEdge;
            libtess.assert(n.lNext !== n), n.lNext.lNext === n && (libtess.sweep.addWinding_(n.oNext, n), libtess.mesh.deleteEdge(n));
        }
    }),
    (libtess.tessmono = {}),
    (libtess.tessmono.tessellateMonoRegion_ = function (e) {
        var t = e.anEdge;
        for (libtess.assert(t.lNext !== t && t.lNext.lNext !== t); libtess.geom.vertLeq(t.dst(), t.org); t = t.lPrev());
        for (; libtess.geom.vertLeq(t.org, t.dst()); t = t.lNext);
        for (var i = t.lPrev(); t.lNext !== i; )
            if (libtess.geom.vertLeq(t.dst(), i.org)) {
                for (; i.lNext !== t && (libtess.geom.edgeGoesLeft(i.lNext) || libtess.geom.edgeSign(i.org, i.dst(), i.lNext.dst()) <= 0); ) i = libtess.mesh.connect(i.lNext, i).sym;
                i = i.lPrev();
            } else {
                for (; i.lNext !== t && (libtess.geom.edgeGoesRight(t.lPrev()) || 0 <= libtess.geom.edgeSign(t.dst(), t.org, t.lPrev().org)); ) t = libtess.mesh.connect(t, t.lPrev()).sym;
                t = t.lNext;
            }
        for (libtess.assert(i.lNext !== t); i.lNext.lNext !== t; ) i = libtess.mesh.connect(i.lNext, i).sym;
    }),
    (libtess.tessmono.tessellateInterior = function (e) {
        for (var t, i = e.fHead.next; i !== e.fHead; i = t) (t = i.next), i.inside && libtess.tessmono.tessellateMonoRegion_(i);
    }),
    (libtess.tessmono.discardExterior = function (e) {
        for (var t, i = e.fHead.next; i !== e.fHead; i = t) (t = i.next), i.inside || libtess.mesh.zapFace(i);
    }),
    (libtess.tessmono.setWindingNumber = function (e, t, i) {
        for (var n, s = e.eHead.next; s !== e.eHead; s = n) (n = s.next), s.rFace().inside !== s.lFace.inside ? (s.winding = s.lFace.inside ? t : -t) : i ? libtess.mesh.deleteEdge(s) : (s.winding = 0);
    }),
    (libtess.Dict = function (e, t) {
        (this.head_ = new libtess.DictNode()), (this.frame_ = e), (this.leq_ = t);
    }),
    (libtess.Dict.prototype.deleteDict_ = function () {}),
    (libtess.Dict.prototype.insertBefore = function (e, t) {
        for (; null !== (e = e.prev).key && !this.leq_(this.frame_, e.key, t); );
        var i = new libtess.DictNode(t, e.next, e);
        return (e.next.prev = i), (e.next = i);
    }),
    (libtess.Dict.prototype.insert = function (e) {
        return this.insertBefore(this.head_, e);
    }),
    (libtess.Dict.prototype.deleteNode = function (e) {
        (e.next.prev = e.prev), (e.prev.next = e.next);
    }),
    (libtess.Dict.prototype.search = function (e) {
        for (var t = this.head_; null !== (t = t.next).key && !this.leq_(this.frame_, e, t.key); );
        return t;
    }),
    (libtess.Dict.prototype.getMin = function () {
        return this.head_.next;
    }),
    (libtess.Dict.prototype.getMax = function () {
        return this.head_.prev;
    }),
    (libtess.DictNode = function (e, t, i) {
        (this.key = e || null), (this.next = t || this), (this.prev = i || this);
    }),
    (libtess.DictNode.prototype.getKey = function () {
        return this.key;
    }),
    (libtess.DictNode.prototype.getSuccessor = function () {
        return this.next;
    }),
    (libtess.DictNode.prototype.getPredecessor = function () {
        return this.prev;
    }),
    (libtess.CachedVertex = function () {
        (this.coords = [0, 0, 0]), (this.data = null);
    }),
    (libtess.GluTesselator = function () {
        (this.state = libtess.GluTesselator.tessState_.T_DORMANT),
            (this.lastEdge_ = null),
            (this.mesh = null),
            (this.callError_ = null),
            (this.normal = [0, 0, 0]),
            (this.sUnit = [0, 0, 0]),
            (this.tUnit = [0, 0, 0]),
            (this.relTolerance = libtess.GLU_TESS_DEFAULT_TOLERANCE),
            (this.windingRule = libtess.windingRule.GLU_TESS_WINDING_ODD),
            (this.fatalError = !1),
            (this.dict = null),
            (this.pq = null),
            (this.event = null),
            (this.callCombine_ = null),
            (this.boundaryOnly = !1),
            (this.callBegin_ = null),
            (this.callEdgeFlag_ = null),
            (this.callVertex_ = null),
            (this.callEnd_ = null),
            (this.callMesh_ = null),
            (this.callBeginData_ = null),
            (this.callEdgeFlagData_ = null),
            (this.callVertexData_ = null),
            (this.callEndData_ = null),
            (this.callErrorData_ = null),
            (this.callCombineData_ = null),
            (this.polygonData_ = null),
            (this.emptyCache = !1),
            (this.cacheCount = 0),
            (this.cache = new Array(libtess.TESS_MAX_CACHE));
        for (var e = 0; e < libtess.TESS_MAX_CACHE; e++) this.cache[e] = new libtess.CachedVertex();
    }),
    (libtess.GluTesselator.tessState_ = { T_DORMANT: 0, T_IN_POLYGON: 1, T_IN_CONTOUR: 2 }),
    (libtess.GluTesselator.prototype.gluDeleteTess = function () {
        this.requireState_(libtess.GluTesselator.tessState_.T_DORMANT);
    }),
    (libtess.GluTesselator.prototype.gluTessProperty = function (e, t) {
        switch (e) {
            case libtess.gluEnum.GLU_TESS_TOLERANCE:
                if (t < 0 || 1 < t) break;
                return void (this.relTolerance = t);
            case libtess.gluEnum.GLU_TESS_WINDING_RULE:
                e = t;
                switch (e) {
                    case libtess.windingRule.GLU_TESS_WINDING_ODD:
                    case libtess.windingRule.GLU_TESS_WINDING_NONZERO:
                    case libtess.windingRule.GLU_TESS_WINDING_POSITIVE:
                    case libtess.windingRule.GLU_TESS_WINDING_NEGATIVE:
                    case libtess.windingRule.GLU_TESS_WINDING_ABS_GEQ_TWO:
                        return void (this.windingRule = e);
                }
                break;
            case libtess.gluEnum.GLU_TESS_BOUNDARY_ONLY:
                return void (this.boundaryOnly = !!t);
            default:
                return void this.callErrorOrErrorData(libtess.gluEnum.GLU_INVALID_ENUM);
        }
        this.callErrorOrErrorData(libtess.gluEnum.GLU_INVALID_VALUE);
    }),
    (libtess.GluTesselator.prototype.gluGetTessProperty = function (e) {
        switch (e) {
            case libtess.gluEnum.GLU_TESS_TOLERANCE:
                return libtess.assert(0 <= this.relTolerance && this.relTolerance <= 1), this.relTolerance;
            case libtess.gluEnum.GLU_TESS_WINDING_RULE:
                e = this.windingRule;
                return (
                    libtess.assert(
                        e === libtess.windingRule.GLU_TESS_WINDING_ODD ||
                            e === libtess.windingRule.GLU_TESS_WINDING_NONZERO ||
                            e === libtess.windingRule.GLU_TESS_WINDING_POSITIVE ||
                            e === libtess.windingRule.GLU_TESS_WINDING_NEGATIVE ||
                            e === libtess.windingRule.GLU_TESS_WINDING_ABS_GEQ_TWO
                    ),
                    e
                );
            case libtess.gluEnum.GLU_TESS_BOUNDARY_ONLY:
                return libtess.assert(!0 === this.boundaryOnly || !1 === this.boundaryOnly), this.boundaryOnly;
            default:
                this.callErrorOrErrorData(libtess.gluEnum.GLU_INVALID_ENUM);
        }
        return !1;
    }),
    (libtess.GluTesselator.prototype.gluTessNormal = function (e, t, i) {
        (this.normal[0] = e), (this.normal[1] = t), (this.normal[2] = i);
    }),
    (libtess.GluTesselator.prototype.gluTessCallback = function (e, t) {
        t = t || null;
        switch (e) {
            case libtess.gluEnum.GLU_TESS_BEGIN:
                return void (this.callBegin_ = t);
            case libtess.gluEnum.GLU_TESS_BEGIN_DATA:
                return void (this.callBeginData_ = t);
            case libtess.gluEnum.GLU_TESS_EDGE_FLAG:
                return void (this.callEdgeFlag_ = t);
            case libtess.gluEnum.GLU_TESS_EDGE_FLAG_DATA:
                return void (this.callEdgeFlagData_ = t);
            case libtess.gluEnum.GLU_TESS_VERTEX:
                return void (this.callVertex_ = t);
            case libtess.gluEnum.GLU_TESS_VERTEX_DATA:
                return void (this.callVertexData_ = t);
            case libtess.gluEnum.GLU_TESS_END:
                return void (this.callEnd_ = t);
            case libtess.gluEnum.GLU_TESS_END_DATA:
                return void (this.callEndData_ = t);
            case libtess.gluEnum.GLU_TESS_ERROR:
                return void (this.callError_ = t);
            case libtess.gluEnum.GLU_TESS_ERROR_DATA:
                return void (this.callErrorData_ = t);
            case libtess.gluEnum.GLU_TESS_COMBINE:
                return void (this.callCombine_ = t);
            case libtess.gluEnum.GLU_TESS_COMBINE_DATA:
                return void (this.callCombineData_ = t);
            case libtess.gluEnum.GLU_TESS_MESH:
                return void (this.callMesh_ = t);
            default:
                return void this.callErrorOrErrorData(libtess.gluEnum.GLU_INVALID_ENUM);
        }
    }),
    (libtess.GluTesselator.prototype.gluTessVertex = function (e, t) {
        var i = !1,
            n = [0, 0, 0];
        this.requireState_(libtess.GluTesselator.tessState_.T_IN_CONTOUR), this.emptyCache && (this.emptyCache_(), (this.lastEdge_ = null));
        for (var s = 0; s < 3; ++s) {
            var a = e[s];
            a < -libtess.GLU_TESS_MAX_COORD && ((a = -libtess.GLU_TESS_MAX_COORD), (i = !0)), a > libtess.GLU_TESS_MAX_COORD && ((a = libtess.GLU_TESS_MAX_COORD), (i = !0)), (n[s] = a);
        }
        if ((i && this.callErrorOrErrorData(libtess.errorType.GLU_TESS_COORD_TOO_LARGE), null === this.mesh)) {
            if (this.cacheCount < libtess.TESS_MAX_CACHE) return void this.cacheVertex_(n, t);
            this.emptyCache_();
        }
        this.addVertex_(n, t);
    }),
    (libtess.GluTesselator.prototype.gluTessBeginPolygon = function (e) {
        this.requireState_(libtess.GluTesselator.tessState_.T_DORMANT), (this.state = libtess.GluTesselator.tessState_.T_IN_POLYGON), (this.cacheCount = 0), (this.emptyCache = !1), (this.mesh = null), (this.polygonData_ = e);
    }),
    (libtess.GluTesselator.prototype.gluTessBeginContour = function () {
        this.requireState_(libtess.GluTesselator.tessState_.T_IN_POLYGON), (this.state = libtess.GluTesselator.tessState_.T_IN_CONTOUR), (this.lastEdge_ = null), 0 < this.cacheCount && (this.emptyCache = !0);
    }),
    (libtess.GluTesselator.prototype.gluTessEndContour = function () {
        this.requireState_(libtess.GluTesselator.tessState_.T_IN_CONTOUR), (this.state = libtess.GluTesselator.tessState_.T_IN_POLYGON);
    }),
    (libtess.GluTesselator.prototype.gluTessEndPolygon = function () {
        if (
            (this.requireState_(libtess.GluTesselator.tessState_.T_IN_POLYGON),
            (this.state = libtess.GluTesselator.tessState_.T_DORMANT),
            null === this.mesh && this.emptyCache_(),
            libtess.normal.projectPolygon(this),
            libtess.sweep.computeInterior(this),
            !this.fatalError)
        ) {
            var e = this.mesh;
            if (
                (this.boundaryOnly ? libtess.tessmono.setWindingNumber(e, 1, !0) : libtess.tessmono.tessellateInterior(e),
                this.mesh.checkMesh(),
                (this.callBegin_ || this.callEnd_ || this.callVertex_ || this.callEdgeFlag_ || this.callBeginData_ || this.callEndData_ || this.callVertexData_ || this.callEdgeFlagData_) &&
                    (this.boundaryOnly ? libtess.render.renderBoundary(this, this.mesh) : ((e = !(!this.callEdgeFlag_ && !this.callEdgeFlagData_)), libtess.render.renderMesh(this, this.mesh, e))),
                this.callMesh_)
            )
                return libtess.tessmono.discardExterior(this.mesh), this.callMesh_(this.mesh), (this.mesh = null), void (this.polygonData_ = null);
        }
        libtess.mesh.deleteMesh(this.mesh), (this.polygonData_ = null), (this.mesh = null);
    }),
    (libtess.GluTesselator.prototype.makeDormant_ = function () {
        this.mesh && libtess.mesh.deleteMesh(this.mesh), (this.state = libtess.GluTesselator.tessState_.T_DORMANT), (this.lastEdge_ = null), (this.mesh = null);
    }),
    (libtess.GluTesselator.prototype.requireState_ = function (e) {
        this.state !== e && this.gotoState_(e);
    }),
    (libtess.GluTesselator.prototype.gotoState_ = function (e) {
        for (; this.state !== e; )
            if (this.state < e)
                switch (this.state) {
                    case libtess.GluTesselator.tessState_.T_DORMANT:
                        this.callErrorOrErrorData(libtess.errorType.GLU_TESS_MISSING_BEGIN_POLYGON), this.gluTessBeginPolygon(null);
                        break;
                    case libtess.GluTesselator.tessState_.T_IN_POLYGON:
                        this.callErrorOrErrorData(libtess.errorType.GLU_TESS_MISSING_BEGIN_CONTOUR), this.gluTessBeginContour();
                }
            else
                switch (this.state) {
                    case libtess.GluTesselator.tessState_.T_IN_CONTOUR:
                        this.callErrorOrErrorData(libtess.errorType.GLU_TESS_MISSING_END_CONTOUR), this.gluTessEndContour();
                        break;
                    case libtess.GluTesselator.tessState_.T_IN_POLYGON:
                        this.callErrorOrErrorData(libtess.errorType.GLU_TESS_MISSING_END_POLYGON), this.makeDormant_();
                }
    }),
    (libtess.GluTesselator.prototype.addVertex_ = function (e, t) {
        var i = this.lastEdge_;
        null === i ? ((i = libtess.mesh.makeEdge(this.mesh)), libtess.mesh.meshSplice(i, i.sym)) : (libtess.mesh.splitEdge(i), (i = i.lNext)),
            (i.org.data = t),
            (i.org.coords[0] = e[0]),
            (i.org.coords[1] = e[1]),
            (i.org.coords[2] = e[2]),
            (i.winding = 1),
            (i.sym.winding = -1),
            (this.lastEdge_ = i);
    }),
    (libtess.GluTesselator.prototype.cacheVertex_ = function (e, t) {
        var i = this.cache[this.cacheCount];
        (i.data = t), (i.coords[0] = e[0]), (i.coords[1] = e[1]), (i.coords[2] = e[2]), ++this.cacheCount;
    }),
    (libtess.GluTesselator.prototype.emptyCache_ = function () {
        this.mesh = new libtess.GluMesh();
        for (var e = 0; e < this.cacheCount; e++) {
            var t = this.cache[e];
            this.addVertex_(t.coords, t.data);
        }
        (this.cacheCount = 0), (this.emptyCache = !1);
    }),
    (libtess.GluTesselator.prototype.callBeginOrBeginData = function (e) {
        this.callBeginData_ ? this.callBeginData_(e, this.polygonData_) : this.callBegin_ && this.callBegin_(e);
    }),
    (libtess.GluTesselator.prototype.callVertexOrVertexData = function (e) {
        this.callVertexData_ ? this.callVertexData_(e, this.polygonData_) : this.callVertex_ && this.callVertex_(e);
    }),
    (libtess.GluTesselator.prototype.callEdgeFlagOrEdgeFlagData = function (e) {
        this.callEdgeFlagData_ ? this.callEdgeFlagData_(e, this.polygonData_) : this.callEdgeFlag_ && this.callEdgeFlag_(e);
    }),
    (libtess.GluTesselator.prototype.callEndOrEndData = function () {
        this.callEndData_ ? this.callEndData_(this.polygonData_) : this.callEnd_ && this.callEnd_();
    }),
    (libtess.GluTesselator.prototype.callCombineOrCombineData = function (e, t, i) {
        var n;
        return this.callCombineData_ ? (n = this.callCombineData_(e, t, i, this.polygonData_)) : this.callCombine_ && (n = this.callCombine_(e, t, i)), void 0 === n && (n = null), n;
    }),
    (libtess.GluTesselator.prototype.callErrorOrErrorData = function (e) {
        this.callErrorData_ ? this.callErrorData_(e, this.polygonData_) : this.callError_ && this.callError_(e);
    }),
    (libtess.GluFace = function (e, t) {
        (this.next = e || this), (this.prev = t || this), (this.anEdge = null), (this.data = null), (this.inside = !1);
    }),
    (libtess.GluHalfEdge = function (e) {
        (this.next = e || this), (this.sym = null), (this.oNext = null), (this.lNext = null), (this.org = null), (this.lFace = null), (this.activeRegion = null), (this.winding = 0);
    }),
    (libtess.GluHalfEdge.prototype.rFace = function () {
        return this.sym.lFace;
    }),
    (libtess.GluHalfEdge.prototype.dst = function () {
        return this.sym.org;
    }),
    (libtess.GluHalfEdge.prototype.oPrev = function () {
        return this.sym.lNext;
    }),
    (libtess.GluHalfEdge.prototype.lPrev = function () {
        return this.oNext.sym;
    }),
    (libtess.GluHalfEdge.prototype.dPrev = function () {
        return this.lNext.sym;
    }),
    (libtess.GluHalfEdge.prototype.rPrev = function () {
        return this.sym.oNext;
    }),
    (libtess.GluHalfEdge.prototype.dNext = function () {
        return this.rPrev().sym;
    }),
    (libtess.GluHalfEdge.prototype.rNext = function () {
        return this.oPrev().sym;
    }),
    (libtess.GluMesh = function () {
        (this.vHead = new libtess.GluVertex()), (this.fHead = new libtess.GluFace()), (this.eHead = new libtess.GluHalfEdge()), (this.eHeadSym = new libtess.GluHalfEdge()), (this.eHead.sym = this.eHeadSym), (this.eHeadSym.sym = this.eHead);
    }),
    (libtess.GluMesh.prototype.checkMesh = function () {
        if (libtess.DEBUG) {
            for (var e, t, i, n = this.fHead, s = this.vHead, a = this.eHead, r = n, r = n; (t = r.next) !== n; r = t)
                for (
                    libtess.assert(t.prev === r), e = t.anEdge;
                    libtess.assert(e.sym !== e), libtess.assert(e.sym.sym === e), libtess.assert(e.lNext.oNext.sym === e), libtess.assert(e.oNext.sym.lNext === e), libtess.assert(e.lFace === t), (e = e.lNext) !== t.anEdge;

                );
            libtess.assert(t.prev === r && null === t.anEdge && null === t.data);
            for (var o = s, o = s; (i = o.next) !== s; o = i)
                for (
                    libtess.assert(i.prev === o), e = i.anEdge;
                    libtess.assert(e.sym !== e), libtess.assert(e.sym.sym === e), libtess.assert(e.lNext.oNext.sym === e), libtess.assert(e.oNext.sym.lNext === e), libtess.assert(e.org === i), (e = e.oNext) !== i.anEdge;

                );
            libtess.assert(i.prev === o && null === i.anEdge && null === i.data);
            for (var l = a, l = a; (e = l.next) !== a; l = e)
                libtess.assert(e.sym.next === l.sym),
                    libtess.assert(e.sym !== e),
                    libtess.assert(e.sym.sym === e),
                    libtess.assert(null !== e.org),
                    libtess.assert(null !== e.dst()),
                    libtess.assert(e.lNext.oNext.sym === e),
                    libtess.assert(e.oNext.sym.lNext === e);
            libtess.assert(e.sym.next === l.sym && e.sym === this.eHeadSym && e.sym.sym === e && null === e.org && null === e.dst() && null === e.lFace && null === e.rFace());
        }
    }),
    (libtess.GluVertex = function (e, t) {
        (this.next = e || this), (this.prev = t || this), (this.anEdge = null), (this.data = null), (this.coords = [0, 0, 0]), (this.s = 0), (this.t = 0), (this.pqHandle = null);
    }),
    (libtess.PQHandleElem = function () {
        (this.key = null), (this.node = 0);
    }),
    (libtess.PQHandleElem.realloc = function (e, t) {
        var i = new Array(t),
            n = 0;
        if (null !== e) for (; n < e.length; n++) i[n] = e[n];
        for (; n < t; n++) i[n] = new libtess.PQHandleElem();
        return i;
    }),
    (libtess.PQNode = function () {
        this.handle = 0;
    }),
    (libtess.PQNode.realloc = function (e, t) {
        var i = new Array(t),
            n = 0;
        if (null !== e) for (; n < e.length; n++) i[n] = e[n];
        for (; n < t; n++) i[n] = new libtess.PQNode();
        return i;
    }),
    (libtess.PriorityQ = function (e) {
        (this.keys_ = libtess.PriorityQ.prototype.PQKeyRealloc_(null, libtess.PriorityQ.INIT_SIZE_)),
            (this.order_ = null),
            (this.size_ = 0),
            (this.max_ = libtess.PriorityQ.INIT_SIZE_),
            (this.initialized_ = !1),
            (this.leq_ = e),
            (this.heap_ = new libtess.PriorityQHeap(this.leq_));
    }),
    (libtess.PriorityQ.INIT_SIZE_ = 32),
    (libtess.PriorityQ.prototype.deleteQ = function () {
        this.heap_.deleteHeap(), (this.heap_ = null), (this.order_ = null), (this.keys_ = null);
    }),
    (libtess.PriorityQ.prototype.init = function () {
        this.order_ = [];
        for (var e = 0; e < this.size_; e++) this.order_[e] = e;
        var i,
            n,
            t =
                ((i = this.keys_),
                (n = this.leq_),
                function (e, t) {
                    return n(i[e], i[t]) ? 1 : -1;
                });
        if ((this.order_.sort(t), (this.max_ = this.size_), (this.initialized_ = !0), this.heap_.init(), libtess.DEBUG))
            for (var s = 0 + this.size_ - 1, e = 0; e < s; ++e) libtess.assert(this.leq_(this.keys_[this.order_[e + 1]], this.keys_[this.order_[e]]));
    }),
    (libtess.PriorityQ.prototype.insert = function (e) {
        if (this.initialized_) return this.heap_.insert(e);
        var t = this.size_;
        return ++this.size_ >= this.max_ && ((this.max_ *= 2), (this.keys_ = libtess.PriorityQ.prototype.PQKeyRealloc_(this.keys_, this.max_))), (this.keys_[t] = e), -(t + 1);
    }),
    (libtess.PriorityQ.prototype.PQKeyRealloc_ = function (e, t) {
        var i = new Array(t),
            n = 0;
        if (null !== e) for (; n < e.length; n++) i[n] = e[n];
        for (; n < t; n++) i[n] = null;
        return i;
    }),
    (libtess.PriorityQ.prototype.keyLessThan_ = function (e, t) {
        (e = this.keys_[e]), (t = this.keys_[t]);
        return !this.leq_(t, e);
    }),
    (libtess.PriorityQ.prototype.keyGreaterThan_ = function (e, t) {
        (e = this.keys_[e]), (t = this.keys_[t]);
        return !this.leq_(e, t);
    }),
    (libtess.PriorityQ.prototype.extractMin = function () {
        if (0 === this.size_) return this.heap_.extractMin();
        var e = this.keys_[this.order_[this.size_ - 1]];
        if (!this.heap_.isEmpty()) {
            var t = this.heap_.minimum();
            if (this.leq_(t, e)) return this.heap_.extractMin();
        }
        for (; --this.size_, 0 < this.size_ && null === this.keys_[this.order_[this.size_ - 1]]; );
        return e;
    }),
    (libtess.PriorityQ.prototype.minimum = function () {
        if (0 === this.size_) return this.heap_.minimum();
        var e = this.keys_[this.order_[this.size_ - 1]];
        if (!this.heap_.isEmpty()) {
            var t = this.heap_.minimum();
            if (this.leq_(t, e)) return t;
        }
        return e;
    }),
    (libtess.PriorityQ.prototype.isEmpty_ = function () {
        return 0 === this.size_ && this.heap_.isEmpty();
    }),
    (libtess.PriorityQ.prototype.remove = function (e) {
        if (0 <= e) this.heap_.remove(e);
        else for (e = -(e + 1), libtess.assert(e < this.max_ && null !== this.keys_[e]), this.keys_[e] = null; 0 < this.size_ && null === this.keys_[this.order_[this.size_ - 1]]; ) --this.size_;
    }),
    (libtess.PriorityQHeap = function (e) {
        (this.nodes_ = libtess.PQNode.realloc(null, libtess.PriorityQHeap.INIT_SIZE_ + 1)),
            (this.handles_ = libtess.PQHandleElem.realloc(null, libtess.PriorityQHeap.INIT_SIZE_ + 1)),
            (this.size_ = 0),
            (this.max_ = libtess.PriorityQHeap.INIT_SIZE_),
            (this.freeList_ = 0),
            (this.initialized_ = !1),
            (this.leq_ = e),
            (this.nodes_[1].handle = 1);
    }),
    (libtess.PriorityQHeap.INIT_SIZE_ = 32),
    (libtess.PriorityQHeap.prototype.deleteHeap = function () {
        (this.handles_ = null), (this.nodes_ = null);
    }),
    (libtess.PriorityQHeap.prototype.init = function () {
        for (var e = this.size_; 1 <= e; --e) this.floatDown_(e);
        this.initialized_ = !0;
    }),
    (libtess.PriorityQHeap.prototype.insert = function (e) {
        var t,
            i = ++this.size_;
        return (
            2 * i > this.max_ && ((this.max_ *= 2), (this.nodes_ = libtess.PQNode.realloc(this.nodes_, this.max_ + 1)), (this.handles_ = libtess.PQHandleElem.realloc(this.handles_, this.max_ + 1))),
            0 === this.freeList_ ? (t = i) : ((t = this.freeList_), (this.freeList_ = this.handles_[t].node)),
            (this.nodes_[i].handle = t),
            (this.handles_[t].node = i),
            (this.handles_[t].key = e),
            this.initialized_ && this.floatUp_(i),
            t
        );
    }),
    (libtess.PriorityQHeap.prototype.isEmpty = function () {
        return 0 === this.size_;
    }),
    (libtess.PriorityQHeap.prototype.minimum = function () {
        return this.handles_[this.nodes_[1].handle].key;
    }),
    (libtess.PriorityQHeap.prototype.extractMin = function () {
        var e = this.nodes_,
            t = this.handles_,
            i = e[1].handle,
            n = t[i].key;
        return 0 < this.size_ && ((e[1].handle = e[this.size_].handle), (t[e[1].handle].node = 1), (t[i].key = null), (t[i].node = this.freeList_), (this.freeList_ = i), 0 < --this.size_ && this.floatDown_(1)), n;
    }),
    (libtess.PriorityQHeap.prototype.remove = function (e) {
        var t = this.nodes_,
            i = this.handles_;
        libtess.assert(1 <= e && e <= this.max_ && null !== i[e].key);
        var n = i[e].node;
        (t[n].handle = t[this.size_].handle),
            (i[t[n].handle].node = n) <= --this.size_ && (n <= 1 || this.leq_(i[t[n >> 1].handle].key, i[t[n].handle].key) ? this.floatDown_(n) : this.floatUp_(n)),
            (i[e].key = null),
            (i[e].node = this.freeList_),
            (this.freeList_ = e);
    }),
    (libtess.PriorityQHeap.prototype.floatDown_ = function (e) {
        for (var t = this.nodes_, i = this.handles_, n = t[e].handle; ; ) {
            var s = e << 1;
            s < this.size_ && this.leq_(i[t[s + 1].handle].key, i[t[s].handle].key) && ++s, libtess.assert(s <= this.max_);
            var a = t[s].handle;
            if (s > this.size_ || this.leq_(i[n].key, i[a].key)) {
                i[(t[e].handle = n)].node = e;
                break;
            }
            (i[(t[e].handle = a)].node = e), (e = s);
        }
    }),
    (libtess.PriorityQHeap.prototype.floatUp_ = function (e) {
        for (var t = this.nodes_, i = this.handles_, n = t[e].handle; ; ) {
            var s = e >> 1,
                a = t[s].handle;
            if (0 == s || this.leq_(i[a].key, i[n].key)) {
                i[(t[e].handle = n)].node = e;
                break;
            }
            (i[(t[e].handle = a)].node = e), (e = s);
        }
    }),
    (libtess.ActiveRegion = function () {
        (this.eUp = null), (this.nodeUp = null), (this.windingNumber = 0), (this.inside = !1), (this.sentinel = !1), (this.dirty = !1), (this.fixUpperEdge = !1);
    }),
    (libtess.ActiveRegion.prototype.regionBelow = function () {
        return this.nodeUp.getPredecessor().getKey();
    }),
    (libtess.ActiveRegion.prototype.regionAbove = function () {
        return this.nodeUp.getSuccessor().getKey();
    }),
    "undefined" != typeof module && (module.exports = libtess),
    (function () {
        function J(e) {
            if (pdGL && pdGL.Scene3D && pdGL.Scene3D.getActiveEnvironment()) {
                var t = pdGL.Scene3D.getActiveEnvironment().surfaceMaterial;
                if (t) return t;
            } else if (pdGL) return pdGL.Material.VariableColorUniformPointSize(e.materialOptions);
            return new pd3D.Material();
        }
        (pd3D.parseOBJ = function (e, i) {
            if (!e || !e.result || !e.result.length) throw new TypeError("ERROR: File is empty or invalid.");
            ((i = i || {}).meshOptions = i.meshOptions || { normals: !0, colors: !0, defaultColor: [0.55, 0.55, 0.55, 1], twoSided: !0 }),
                (i.progressIncrement = pd.toNumber(i.progressIncrement, 0.1)),
                (i.callbackComplete = i.callbackComplete || null),
                (i.callbackProgress = i.callbackProgress || null),
                (i.materialOptions = i.materialOptions || {}),
                (i.materials = i.materials || {}),
                (i.groups = i.groups || {});
            var t,
                n,
                s,
                a,
                r,
                o,
                l,
                d,
                h,
                c = null,
                p = [],
                u = [],
                g = [],
                m = [],
                f = 0,
                _ = 0,
                x = 0,
                v = [],
                b = [0.65, 0.65, 0.65, 1],
                y = [0, 0, 0],
                S = [0, 0, 1],
                M = [0, 0],
                w = 0,
                L = null,
                D = 0,
                T = new pd3D.Mesh(i.meshOptions),
                E = i.node || new pd3D.Node("OBJ_File"),
                A = i.defaultMaterial || null,
                P = !!T.normals,
                C = !!T.coords,
                O = !!T.colors,
                N = E,
                G = i.flipY ? 1 : -1;
            function R(e) {
                e = parseInt(e, 10);
                return isNaN(e) ? NaN : 0 <= e ? e - 1 : e + p.length;
            }
            function I(e) {
                e = parseInt(e, 10);
                return isNaN(e) ? NaN : 0 <= e ? e - 1 : e + g.length;
            }
            function k(e) {
                var t = T.color();
                (T = new pd3D.Mesh(i.meshOptions)), N.addMesh(T, A), (P = !!T.normals), (C = !!T.coords), (O = !!T.colors), T.color(t), (T.name = e);
            }
            (A = A || J(i)), E.addMesh(T, A);
            var V,
                B = e.result.split("\n"),
                U = B.length,
                F = 0;
            i.debug && console.time("parseOBJ");
            for (var H, z = 0; z < U; z++) {
                var W,
                    j,
                    Y = B[z].trim();
                if (1 < Y.length)
                    switch (Y.charAt(0)) {
                        case "#":
                            break;
                        case "v":
                        case "V":
                            switch (Y.charAt(1)) {
                                case " ":
                                case "\t":
                                    3 < (W = Y.match(/\S+/g)).length &&
                                        (p.push([parseFloat(W[1]), parseFloat(W[3]) * G, parseFloat(W[2])]), O && 6 < W.length && m.push([parseFloat(W[4]), parseFloat(W[5]), parseFloat(W[6]), pd.toNumber(W[7], 1)]));
                                    break;
                                case "n":
                                    3 < (W = Y.match(/\S+/g)).length && u.push([parseFloat(W[1]), parseFloat(W[3]) * G, parseFloat(W[2])]);
                                    break;
                                case "t":
                                    2 < (W = Y.match(/\S+/g)).length && g.push([parseFloat(W[1]), parseFloat(W[2])]);
                            }
                            break;
                        case "f":
                        case "F":
                            if (((x = 0), (v.length = 0), 65500 < T.vertices.length && k("ext" + pd.toStringWithLeadingZeros(++D, 4)), 2 < (w = (X = Y.match(/\S+/g)).length))) {
                                for (h = 1; h < w; h++)
                                    0 < (l = X[h].split("/")).length &&
                                        ((t = R(l[0])), isNaN(t) || ((s = I(l[1])), (H = l[2]), (H = parseInt(H, 10)), (n = isNaN(H) ? NaN : 0 <= H ? H - 1 : H + u.length), isNaN(n) || x++, v.push({ vtx: t, tex: s, nrm: n })));
                                if (2 < v.length) {
                                    if (((_ = m.length), (L = null), x < (f = v.length)))
                                        for (h = 2; h < f; h++)
                                            if (pd3D.VectorArray.calcNormalFromTriangle(y, p[v[+h].vtx], p[v[h - 1].vtx], p[v[h - 2].vtx])) {
                                                (L = y.slice()), (T.defaultNormal = L);
                                                break;
                                            }
                                    if (4 < f) {
                                        for (r = [], h = 0; h < f; h++) r.push(p[v[h].vtx]);
                                        var q = new this.Polygon();
                                        q.setBoundary(r), q.tesselate3D(), q.copyTrianglesToMeshIndexed(T);
                                    } else {
                                        for (o = T.vertices.length, h = 0; h < f; h++)
                                            (a = v[h].vtx),
                                                T.vertices.push(p[a]),
                                                O && (a < _ ? T.colors.push(m[a]) : T.colors.push(T.defaultColor)),
                                                C && (isNaN(v[h].tex) ? T.coords.push(M) : T.coords.push(g[v[h].tex])),
                                                P && (isNaN(v[h].nrm) ? (L ? T.normals.push(L) : T.normals.push(T.defaultNormal)) : T.normals.push(u[v[h].nrm]));
                                        4 == f ? (T.triangles.push([o, o + 1, o + 2]), T.triangles.push([o, o + 2, o + 3])) : 3 == f && T.triangles.push([o, o + 1, o + 2]);
                                    }
                                }
                            }
                            break;
                        case "l":
                        case "L":
                            if (((f = 0), 65500 < T.vertices.length && k("ext" + pd.toStringWithLeadingZeros(++D, 4)), T.lines || T.addIndexBuffer("lines"), 1 < (w = (X = Y.match(/\S+/g)).length)))
                                for (o = T.vertices.length, h = 1; h < w; h++)
                                    0 < (l = X[h].split("/")).length &&
                                        ((t = R(l[0])),
                                        isNaN(t) ||
                                            (T.vertices.push(p[t]),
                                            O && (t < _ ? T.colors.push(m[t]) : T.colors.push(T.defaultLineColor)),
                                            C && ((s = I(l[1])), isNaN(s) ? T.coords.push(M) : T.coords.push(g[s])),
                                            P && T.normals.push(S),
                                            1 < h && T.lines.push([o + (h - 2), o + (h - 1)]),
                                            f++));
                            break;
                        case "p":
                        case "P":
                            if ((65500 < T.vertices.length && k("ext" + pd.toStringWithLeadingZeros(++D, 4)), T.points || T.addIndexBuffer("points"), 1 < (w = (X = Y.match(/\S+/g)).length)))
                                for (o = T.vertices.length, h = 1; h < w; h++)
                                    0 < (l = X[h].split("/")).length &&
                                        ((t = R(l[0])), isNaN(t) || (T.vertices.push(p[t]), O && (t < _ ? T.colors.push(m[t]) : T.colors.push(T.defaultColor)), C && T.coords.push(M), P && T.normals.push(S), T.points.push(o + h)));
                            break;
                        case "o":
                        case "O":
                            var X,
                                q = 1 < (X = Y.match(/\S+/g)).length && 0 < X[1].length ? X[1] : "obj" + pd.toStringWithLeadingZeros(++D, 4);
                            k(q);
                            break;
                        case "g":
                        case "G":
                            (d = 1 < (X = Y.match(/\S+/g)).length && 0 < X[1].length ? X[1] : "grp" + pd.toStringWithLeadingZeros(++D, 4)), i.groups[d] ? (N = i.groups[d]) : ((N = new pd3D.Node(d)), E.addChild(N), k(d), (i.groups[d] = N));
                            break;
                        case "m":
                        case "M":
                            !pd.startsWith(Y, "mtllib") || ((j = Y.substring(6).trim().split("/").pop()) && 0 < j.length && (i.materials[j] || (i.materials[j] = {}), (c = i.materials[j])));
                            break;
                        case "u":
                        case "U":
                            1 < (X = Y.match(/\S+/g)).length &&
                                "usemtl" == X[0] &&
                                0 < X[1].length &&
                                (c
                                    ? (c[(j = X[1])] || (c[j] = { diffuseColor: b, specularColor: [0.85, 0.85, 0.85, 1], ambientColor: [0.45, 0.45, 0.45, 1], shininess: 25, opacity: 1 }),
                                      i.meshOptions.colors || k(d),
                                      (Y = c[j].diffuseColor),
                                      T.color([Y[0], Y[1], Y[2], c[j].opacity]))
                                    : T.color(b));
                    }
                F <= (V = z / U) && (i.callbackProgress && i.callbackProgress(V), (F += i.progressIncrement));
            }
            return i.debug && console.timeEnd("parseOBJ"), i.callbackProgress && i.callbackProgress(1), i.callbackComplete && i.callbackComplete(), E.compile(), c && (E.materials = c), E;
        }),
            (pd3D.parseMTL = function (e, t) {
                if (e && e.result && e.result.length) {
                    t = t || {};
                    for (var i, n = e.result.split("\n"), s = n.length, a = null, r = 0; r < s; r++) {
                        var o = n[r].trim();
                        if (1 < o.length)
                            switch (o.charAt(0)) {
                                case "#":
                                    break;
                                case "n":
                                case "N":
                                    "e" == o.charAt(1)
                                        ? 1 < (i = o.match(/\S+/g)).length &&
                                          "newmtl" == i[0] &&
                                          0 < i[1].length &&
                                          (a = t[i[1]] = { diffuseColor: [Math.random(), Math.random(), Math.random(), 1], specularColor: [0.85, 0.85, 0.85, 1], ambientColor: [0.45, 0.45, 0.45, 1], shininess: 25, opacity: 1 })
                                        : "s" == o.charAt(1) && a && 1 < (i = o.match(/\S+/g)).length && (a.shininess = pd.constrainTo(parseFloat(i[1]), 0, 1e9));
                                    break;
                                case "k":
                                case "K":
                                    if (a && 3 < (i = o.match(/\S+/g)).length) {
                                        var l = 1,
                                            d = 1,
                                            h = 1,
                                            c = 1;
                                        switch (o.charAt(1)) {
                                            case "a":
                                                (l = parseFloat(i[1])), (d = parseFloat(i[2])), (h = parseFloat(i[3])), (c = 4 < i.length ? parseFloat(i[4]) : 1), (a.ambientColor = [l, d, h, c]);
                                                break;
                                            case "d":
                                                (l = parseFloat(i[1])), (d = parseFloat(i[2])), (h = parseFloat(i[3])), (c = 4 < i.length ? parseFloat(i[4]) : 1), (a.diffuseColor = [l, d, h, c]);
                                                break;
                                            case "s":
                                                (l = parseFloat(i[1])), (d = parseFloat(i[2])), (h = parseFloat(i[3])), (c = 4 < i.length ? parseFloat(i[4]) : 1), (a.specularColor = [l, d, h, c]);
                                        }
                                    }
                                    break;
                                case "t":
                                case "T":
                                    a && "r" == o.charAt(1) && 1 < (i = o.match(/\S+/g)).length && (a.opacity = 1 - pd.constrainTo(parseFloat(i[1]), 0, 1));
                                    break;
                                case "d":
                                case "D":
                                    a && 1 < (i = o.match(/\S+/g)).length && (a.opacity = pd.constrainTo(parseFloat(i[1]), 0, 1));
                            }
                    }
                    return t;
                }
            }),
            (pd3D.formatAsOBJ = function (e, t) {
                if (((t = t || {}), !(e && e instanceof pd3D.Mesh))) throw new TypeError("The given mesh must be a valid instance of 'pd3D.Mesh'.");
                var i,
                    n,
                    s = pd.toBoolean(t.triangles, !1) && pd.isArray(e.triangles) && 0 < e.triangles.length,
                    a = pd.toBoolean(t.outlines, !1) && e.hasLines && pd.isArray(e.lines) && 0 < e.lines.length,
                    r = pd.toBoolean(t.normals, !1) && e.hasVertexNormals && pd.isArray(e.normals) && 0 < e.normals.length,
                    o = pd.toBoolean(t.coords, !1) && e.hasVertexCoords && pd.isArray(e.coords) && 0 < e.coords.length,
                    l = pd.toBoolean(t.colors, !1) && e.hasVertexColors && pd.isArray(e.colors) && 0 < e.colors.length,
                    d = pd.toBoolean(t.alpha, l),
                    h = o || r,
                    c = "# PerformativeDesign.com - OBJ Export.\n";
                if ((l && ((c += "# Vertex format:  v x y z r g b"), d && (c += " a"), (c += "\n")), (c += "o " + (t.name || "pd3D.Mesh") + "\n"), e.vertices))
                    for (var p = 0, u = e.vertices.length; p < u; ++p)
                        (i = e.vertices[p]),
                            (c += "v " + pd.toStringWithPrecisionRange(i[0], 1, 9) + " " + pd.toStringWithPrecisionRange(i[2], 1, 9) + " " + pd.toStringWithPrecisionRange(i[1], 1, 9)),
                            l && ((c += " " + (i = e.colors[p])[0].toFixed(5) + " " + i[1].toFixed(5) + " " + i[2].toFixed(5)), d && (c += " " + i[3].toFixed(5))),
                            (c += "\n");
                if (r) for (p = 0, u = e.normals.length; p < u; ++p) c += "vn " + (i = e.normals[p])[0].toFixed(5) + " " + i[2].toFixed(5) + " " + i[1].toFixed(5) + "\n";
                if (o) for (p = 0, u = e.coords.length; p < u; ++p) c += "vt " + (i = e.coords[p])[0].toFixed(5) + " " + i[1].toFixed(5) + "\n";
                if (s)
                    for (p = 0, u = e.triangles.length; p < u; ++p)
                        if (((i = e.triangles[p]), h)) {
                            c += "f";
                            for (var g = 0; g < 3; ++g) c += " " + (n = (i[g] + 1).toFixed(0)) + "/" + (o ? n : "") + "/" + (r ? n : "");
                            c += "\n";
                        } else c += "f " + (i[0] + 1).toFixed(0) + " " + (i[1] + 1).toFixed(0) + " " + (i[2] + 1).toFixed(0) + "\n";
                if (a) for (p = 0, u = e.lines.length; p < u; ++p) c += "l " + ((i = e.lines[p])[0] + 1).toFixed(0) + " " + (i[1] + 1).toFixed(0) + "\n";
                return c;
            }),
            (pd3D.parseSTL = function (e, t) {
                if (!e || !e.result || !e.result.length) throw new TypeError("ERROR: File is empty or invalid.");
                ((t = t || {}).meshOptions = t.meshOptions || { normals: !0, defaultColor: [0.55, 0.55, 0.55, 1], twoSided: !0 }),
                    (t.progressIncrement = pd.toNumber(t.progressIncrement, 0.1)),
                    (t.callbackComplete = t.callbackComplete || null),
                    (t.callbackProgress = t.callbackProgress || null),
                    (t.materialOptions = t.materialOptions || {});
                var i,
                    n,
                    s = 0,
                    a = e.result.split("\n"),
                    r = a.length,
                    o = 0,
                    l = !1,
                    d = new pd3D.Mesh(t.meshOptions),
                    h = t.node || new pd3D.Node("STL_File"),
                    c = t.defaultMaterial || null,
                    p = [0, 0, 1],
                    u = [0, 0, 1],
                    g = 0,
                    m = [];
                (c = c || J(t)), h.addMesh(d, c), t.debug && console.time("parseSTL");
                for (var f, _, x = 0; x < r; x++) {
                    var v = a[x].trim();
                    if (1 < v.length)
                        switch (v.charAt(0)) {
                            case "#":
                                break;
                            case "e":
                                pd.startsWith(v, "endloop") &&
                                    (l &&
                                        2 < g &&
                                        (65500 < d.vertices.length && ((f = "ext" + pd.toStringWithLeadingZeros(++s, 4)), (_ = void 0), (_ = d.color()), (d = new pd3D.Mesh(t.meshOptions)), h.addMesh(d, c), d.color(_), (d.name = f)),
                                        pd3D.VectorArray.calcNormalFromTriangle(u, m[0], m[1], m[2]) ? d.normal(u[0], u[1], u[2]) : d.normal(p),
                                        d.addTriangle(d.addVertex(m[0]), d.addVertex(m[1]), d.addVertex(m[2]))),
                                    (g = 0),
                                    (l = !1));
                                break;
                            case "v":
                            case "V":
                                l && pd.startsWith(v, "vertex") && 3 < (n = v.match(/\S+/g)).length && g < 3 && (m[g++] = [pd.toNumber(n[1], 0), pd.toNumber(n[2], 0), pd.toNumber(n[3], 0)]);
                                break;
                            case "o":
                            case "O":
                                pd.startsWith(v, "outer") && (l = !(g = 0));
                                break;
                            case "f":
                            case "F":
                                pd.startsWith(v, "facet") && (3 < (n = v.match(/\S+/g)).length && "normal" == n[1] ? (u = [pd.toNumber(n[1], 0), pd.toNumber(n[2], 0), pd.toNumber(n[3], 0)]) : 0);
                        }
                    o <= (i = x / r) && (t.callbackProgress && t.callbackProgress(i), (o += t.progressIncrement));
                }
                return t.debug && console.timeEnd("parseSTL"), t.callbackProgress && t.callbackProgress(1), t.callbackComplete && t.callbackComplete(), h.compile(), h;
            }),
            (pd3D.formatAsSTL = function (e, t) {
                if (((t = t || {}), !(e && e instanceof pd3D.Mesh))) throw new TypeError("The given mesh must be a 'pd3D.Mesh' or variant");
                var i,
                    n,
                    s,
                    a,
                    r,
                    o,
                    l,
                    d = pd.toBoolean(t.flip, !0),
                    h = pd.toBoolean(t.normals, !0),
                    c = "solid " + (t.name || "pd3D.Mesh") + "\n",
                    p = [0, 0, 0],
                    u = [0, 0, 0],
                    g = [],
                    t = e.getAABB();
                if ((t.min.x < 0 && (u[0] = -t.min.x), t.min.y < 0 && (u[1] = -t.min.y), t.min.z < 0 && (u[2] = -t.min.z), pd.isArray(e.triangles)))
                    for (var m = 0, f = e.triangles.length; m < f; ++m) {
                        d ? ((g[0] = e.triangles[m][2]), (g[1] = e.triangles[m][1]), (g[2] = e.triangles[m][0])) : ((g[0] = e.triangles[m][0]), (g[0] = e.triangles[m][1]), (g[0] = e.triangles[m][2])),
                            (n = e.vertices[g[0]]),
                            (s = e.vertices[g[1]]),
                            (a = e.vertices[g[2]]),
                            h && pd3D.VectorArray.calcNormalFromTriangle(p, n, s, a) ? ((r = p[0]), (o = p[1]), (l = p[2])) : (r = o = l = 0),
                            (c += "\tfacet normal " + r.toExponential() + " " + o.toExponential() + " " + l.toExponential() + "\n"),
                            (c += "\t\touter loop\n");
                        for (var _ = 0; _ < 3; ++_) (r = (i = e.vertices[g[_]])[0] + u[0]), (o = i[1] + u[1]), (l = i[2] + u[2]), (c += "\t\t\tvertex " + r.toExponential() + " " + o.toExponential() + " " + l.toExponential() + "\n");
                        (c += "\t\tendloop\n"), (c += "\tendfacet\n");
                    }
                return (c += "endsolid\n");
            }),
            (pd3D.parsePLY = function (e, t) {
                if (!e || !e.result || !e.result.length) throw new TypeError("ERROR: File is empty or invalid.");
                ((t = t || {}).meshOptions = t.meshOptions || { normals: !0, colors: !0, defaultColor: [0.55, 0.55, 0.55, 1], twoSided: !0 }),
                    (t.progressIncrement = pd.toNumber(t.progressIncrement, 0.1)),
                    (t.callbackComplete = t.callbackComplete || null),
                    (t.callbackProgress = t.callbackProgress || null),
                    (t.materialOptions = t.materialOptions || {});
                var i,
                    n,
                    s,
                    a,
                    r = e.result.split("\n"),
                    o = r.length,
                    l = 0,
                    d = 0,
                    h = new pd3D.Mesh(t.meshOptions),
                    c = t.node || new pd3D.Node("PLY_File"),
                    p = 0,
                    u = 0,
                    g = 0,
                    m = 0,
                    f = 0,
                    _ = 0,
                    x = -1,
                    v = -1,
                    b = -1,
                    y = -1,
                    S = -1,
                    M = -1,
                    w = -1,
                    L = -1,
                    D = -1,
                    T = -1,
                    E = 1,
                    A = -1,
                    P = -1,
                    e = (e = t.defaultMaterial || null) || J(t);
                t.debug && console.time("parsePLY");
                for (var C = 0; C < o; C++) {
                    if (1 < (G = r[C].trim()).length)
                        switch (G.charAt(0)) {
                            case "c":
                            case "#":
                                break;
                            case "e":
                                if (pd.startsWith(G, "element"))
                                    2 < (O = G.match(/\S+/g)).length &&
                                        (pd.startsWith(O[1], "vert")
                                            ? ((m = pd.toInteger(O[2], 0)), (g = 1), (p = 0))
                                            : pd.startsWith(O[1], "face") || pd.startsWith(O[1], "poly") || pd.startsWith(O[1], "tri")
                                            ? ((f = pd.toInteger(O[2], 0)), (g = 2), (p = 0))
                                            : (pd.startsWith(O[1], "edg") || pd.startsWith(O[1], "lin")) && ((_ = pd.toInteger(O[2], 0)), (g = 3), (p = 0)));
                                else if (pd.startsWith(G, "end_header")) {
                                    u = C;
                                    break;
                                }
                                break;
                            case "f":
                                if (pd.startsWith(G, "format") && 2 < (O = G.match(/\S+/g)).length && !pd.startsWith(O[1], "asci")) throw new Error("Sorry, binary PLY files are not currently supported.");
                                break;
                            case "p":
                                if (pd.startsWith(G, "property")) {
                                    if (2 < (O = G.match(/\S+/g)).length && 1 === g)
                                        switch (O[2].charAt(0)) {
                                            case "x":
                                            case "X":
                                                x = p;
                                                break;
                                            case "y":
                                            case "Y":
                                                v = p;
                                                break;
                                            case "z":
                                            case "Z":
                                                b = p;
                                                break;
                                            case "n":
                                            case "N":
                                                "x" == (i = O[2].charAt(1)) || "X" == i ? (y = p) : "y" == i || "Y" == i ? (S = p) : ("z" != i && "Z" != i) || (M = p);
                                                break;
                                            case "r":
                                            case "R":
                                                (w = p), ("u" != (i = O[1].charAt(0)) && "U" != i && "c" != i && "C" != i) || (E = 1 / 255);
                                                break;
                                            case "g":
                                            case "G":
                                                L = p;
                                                break;
                                            case "b":
                                            case "B":
                                                D = p;
                                                break;
                                            case "a":
                                            case "A":
                                                T = p;
                                                break;
                                            case "u":
                                            case "U":
                                            case "s":
                                            case "S":
                                                A = p;
                                                break;
                                            case "v":
                                            case "V":
                                            case "t":
                                            case "T":
                                                P = p;
                                        }
                                    p++;
                                }
                        }
                }
                if (((n = 0 <= y && 0 <= S && 0 <= M), (s = 0 <= w && 0 <= L && 0 <= D), (a = 0 <= A && 0 <= P), u < 1 || !(0 <= x && 0 <= v && 0 <= b))) throw new Error("ERROR: File does not match PLY format.");
                c.addMesh(h, e);
                for (var O, N = 0; N < m; ++N) {
                    0 < (O = (G = r[++u].trim()).match(/\S+/g)).length &&
                        (n && h.normal([pd.toNumber(O[y], 0), pd.toNumber(O[S], 0), pd.toNumber(O[M], 0)]),
                        s && h.color([pd.toNumber(O[w], 0) * E, pd.toNumber(O[L], 0) * E, pd.toNumber(O[D], 0) * E, pd.toNumber(O[T], 1 / E)]),
                        a && h.texCoord([pd.toNumber(O[A], 0), pd.toNumber(O[P], 0)]),
                        h.vertex([pd.toNumber(O[x], 0), pd.toNumber(O[v], 0), pd.toNumber(O[b], 0)])),
                        l <= (d = u / o) && (t.callbackProgress && t.callbackProgress(d), (l += t.progressIncrement));
                }
                0 < f && !h.triangles && h.addIndexBuffer("triangles");
                for (N = 0; N < f; ++N) {
                    if (1 < (G = r[++u].trim()).length && ((O = G.match(/\S+/g)), (m = pd.toInteger(O[0], 0)), O.length > m))
                        switch (m) {
                            case 3:
                                h.addTriangle(pd.toInteger(O[1], 0), pd.toInteger(O[2], 0), pd.toInteger(O[3], 0));
                                break;
                            case 4:
                                h.addQuad(pd.toInteger(O[1], 0), pd.toInteger(O[2], 0), pd.toInteger(O[3], 0), pd.toInteger(O[4], 0));
                        }
                    l <= (d = u / o) && (t.callbackProgress && t.callbackProgress(d), (l += t.progressIncrement));
                }
                0 < _ && !h.lines && h.addIndexBuffer("lines");
                for (var G, N = 0; N < _; ++N) {
                    1 < (G = r[++u].trim()).length && 1 < (O = G.match(/\S+/g)).length && h.addLine(pd.toInteger(O[0], 0), pd.toInteger(O[1], 0)),
                        l <= (d = u / o) && (t.callbackProgress && t.callbackProgress(d), (l += t.progressIncrement));
                }
                return t.debug && console.timeEnd("parsePLY"), t.callbackProgress && t.callbackProgress(1), t.callbackComplete && t.callbackComplete(), c.compile(), c;
            }),
            (pd3D.formatAsPLY = function (e, t) {
                if (((t = t || {}), !(e && e instanceof pd3D.Mesh))) throw new TypeError("The given mesh must be a 'pd3D.Mesh' or variant");
                var i,
                    n = pd.toBoolean(t.triangles, !1) && pd.isArray(e.triangles) && 0 < e.triangles.length,
                    s = pd.toBoolean(t.outlines, !1) && e.hasLines && pd.isArray(e.lines) && 0 < e.lines.length,
                    a = pd.toBoolean(t.normals, !1) && e.hasVertexNormals && pd.isArray(e.normals) && 0 < e.normals.length,
                    r = pd.toBoolean(t.coords, !1) && e.hasVertexCoords && pd.isArray(e.coords) && 0 < e.coords.length,
                    o = pd.toBoolean(t.colors, !1) && e.hasVertexColors && pd.isArray(e.colors) && 0 < e.colors.length,
                    l = pd.toBoolean(t.alpha, o),
                    d = "ply\nformat ascii 1.0\ncomment PerformativeDesign.com - PLY Export.\nelement vertex " + e.vertices.length + "\nproperty float x\nproperty float y\nproperty float z\n";
                if (
                    (a && (d += "property float nx\nproperty float ny\nproperty float nz\n"),
                    o && (d += "property float r\nproperty float g\nproperty float b\nproperty float a\n"),
                    r && (d += "property float u\nproperty float v\n"),
                    n && (d += "element face " + e.triangles.length + "\nproperty list uchar uint vertex_indices\n"),
                    s && (d += "element edge " + e.lines.length + "\nproperty int vertex1\nproperty int vertex2\n"),
                    (d += "end_header\n"),
                    e.vertices)
                )
                    for (var h = 0, c = e.vertices.length; h < c; ++h)
                        (i = e.vertices[h]),
                            (d += pd.toStringWithPrecisionRange(i[0], 1, 9) + " " + pd.toStringWithPrecisionRange(i[1], 1, 9) + " " + pd.toStringWithPrecisionRange(i[2], 1, 9)),
                            a && (d += " " + (i = e.normals[h])[0].toFixed(5) + " " + i[1].toFixed(5) + " " + i[2].toFixed(5)),
                            o && ((d += " " + (i = e.colors[h])[0].toFixed(5) + " " + i[1].toFixed(5) + " " + i[2].toFixed(5)), l && (d += " " + i[3].toFixed(5))),
                            r && (d += " " + (i = e.coords[h])[0].toFixed(5) + " " + i[1].toFixed(5)),
                            (d += "\n");
                if (n) for (h = 0, c = e.triangles.length; h < c; ++h) d += "3 " + (i = e.triangles[h])[2].toFixed(0) + " " + i[1].toFixed(0) + " " + i[0].toFixed(0) + "\n";
                if (s) for (h = 0, c = e.lines.length; h < c; ++h) d += +(i = e.lines[h])[0].toFixed(0) + " " + i[1].toFixed(0) + "\n";
                return d;
            }),
            (pd3D.parseMOD = function (e, t) {
                if (!e || !e.result || !e.result.length) throw new TypeError("ERROR: File is empty or invalid.");
                ((t = t || {}).meshOptions = t.meshOptions || { lines: !0, normals: !0, defaultColor: [0.55, 0.55, 0.55, 1], twoSided: !0 }),
                    (t.progressIncrement = pd.toNumber(t.progressIncrement, 0.1)),
                    (t.callbackComplete = t.callbackComplete || null),
                    (t.callbackProgress = t.callbackProgress || null),
                    (t.materialOptions = t.materialOptions || {});
                var i,
                    n,
                    s,
                    a,
                    r,
                    o = e.result.split("\n"),
                    l = o.length,
                    d = 0,
                    h = 0,
                    c = t.node || new pd3D.Node("MOD_File"),
                    p = [0, 0, 1],
                    u = {},
                    g = 0,
                    m = { name: "", flags: 0, color: null, node: null, mesh: null },
                    f = { zone: "", node: null, vertices: [], normal: [], flags: 0 },
                    _ = (_ = t.defaultMaterial || null) || J(t);
                t.debug && console.time("parseMOD");
                for (var x = 0; x < l; x++) {
                    var v = o[x].trim();
                    if (0 < v.length && "/" != (s = v.charAt(0)))
                        if (1 == h) {
                            if ("}" == s)
                                (16 & m.flags && !t.includeAllZones) ||
                                    ((m.node = new pd3D.Node(m.name)),
                                    (m.mesh = new pd3D.Mesh(t.meshOptions)),
                                    m.node.addMesh(m.mesh, _),
                                    m.mesh.color(m.color),
                                    c.addChild(m.node),
                                    (16 & m.flags || 128 & m.flags) && (m.node.visible = !1),
                                    (m.mesh.name = m.name),
                                    (u[m.name] = { name: m.name, flags: m.flags, color: m.color, node: m.node, mesh: m.mesh }),
                                    g++),
                                    (h = 0);
                            else if (1 < (n = v.match(/\S+/g)).length)
                                switch (n[0]) {
                                    case "name:":
                                        n.shift(), (m.name = n.join(" ").trim() || "Zone_" + pd.toStringWithLeadingZeros(g, 3));
                                        break;
                                    case "flags:":
                                        m.flags = pd.toInteger(n[1]);
                                        break;
                                    case "colors:":
                                        (r = pd.toInteger(n[1])), (m.color = [(255 & r) / 255, ((65280 & r) >> 8) / 255, ((16711680 & r) >> 16) / 255, 1]);
                                }
                        } else if (2 == h) {
                            if ("}" == s) {
                                if (((f.node = u[f.zone]), f.node && f.node.mesh))
                                    if ((16384 & f.flags && f.vertices.reverse(), 2 < f.vertices.length && 4 & f.flags && 8 & f.flags)) new pd3D.Polygon({ contours: [f.vertices] }).copyToMeshIndexed(f.node.mesh, !1);
                                    else if (1 & f.flags) {
                                        (a = f.node.mesh).begin(gl.POINTS), a.normal(p);
                                        for (var b = 0, y = f.vertices.length; b < y; ++b) a.vertex(f.vertices[b]);
                                        a.end();
                                    } else if (!(2 & f.flags)) {
                                        (a = f.node.mesh), (r = 8 & f.flags ? gl.LINE_LOOP : gl.LINE_STRIP), a.begin(r), a.normal(p);
                                        for (b = 0, y = f.vertices.length; b < y; ++b) a.vertex(f.vertices[b]);
                                        a.end();
                                    }
                                h = 0;
                            } else if (1 < (n = v.match(/\S+/g)).length)
                                switch (n[0]) {
                                    case "zone:":
                                        n.shift(), (f.zone = n.join(" ").trim());
                                        break;
                                    case "flags:":
                                        f.flags = pd.toInteger(n[1]);
                                        break;
                                    case "vertex:":
                                        3 < n.length && f.vertices.push([parseFloat(n[1]), parseFloat(n[2]), parseFloat(n[3])]);
                                        break;
                                    case "normal:":
                                        3 < n.length && ((f.normal[0] = parseFloat(n[1])), (f.normal[1] = parseFloat(n[2])), (f.normal[2] = parseFloat(n[3])));
                                }
                        } else
                            "Z" == s && pd.startsWith(v, "ZONE")
                                ? ((m.name = "Zone_" + pd.toStringWithLeadingZeros(g, 3)), (h = 1))
                                : "E" == s && pd.startsWith(v, "ENTITY") && ((f.normal[0] = p[0]), (f.normal[1] = p[1]), (f.normal[2] = p[2]), (f.vertices.length = 0), (h = 2));
                    d <= (i = x / l) && (t.callbackProgress && t.callbackProgress(i), (d += t.progressIncrement));
                }
                return t.debug && console.timeEnd("parseMOD"), t.callbackProgress && t.callbackProgress(1), t.callbackComplete && t.callbackComplete(), c.compile(), c;
            });
    })();
var pdGL = pdGL || {};
!(function () {
    var h,
        c = 305397760,
        a = Math.PI / 180,
        r = 180 / Math.PI;
    function o(e) {
        e = Object.prototype.toString.call(e);
        return "[object Array]" == e || "[object Float32Array]" == e;
    }
    (pdGL.version = "1.0.8"), (pdGL.keys = {}), (pdGL.keyCount = 0);
    var p = [],
        u = !0,
        g = null;
    function m(e, t, i) {
        e.addEventListener(t, i);
    }
    function f(e) {
        (pdGL.keys.SHIFT = e.shiftKey), (pdGL.keys.CONTROL = e.ctrlKey), (pdGL.keys.META = e.metaKey), (pdGL.keys.ALT = e.altKey);
    }
    pdGL.create = function (e) {
        var s,
            t,
            d,
            r,
            i,
            n,
            a,
            o,
            l = (e = e || {}).canvas;
        l || (((l = document.createElement("canvas")).height = e.height || 600), (l.width = e.width || 800)), (e.antialias = pd.toBoolean(e.antialias, !1)), (e.alpha = pd.toBoolean(e.alpha, !1));
        try {
            h = l.getContext("webgl", e);
        } catch (e) {}
        try {
            h = h || l.getContext("experimental-webgl", e);
        } catch (e) {}
        if (!h) throw new Error("WebGL is either not supported or is disabled.");
        return (
            (p[0] = h.TRIANGLES),
            (p[1] = h.LINES),
            (p[2] = h.POINTS),
            (d = new pd3D.Matrix()),
            (r = new pd3D.Matrix()),
            (i = new pd3D.Matrix()),
            (n = []),
            (o = !(a = [])),
            (h.MODELVIEW = 1 | c),
            (h.PROJECTION = 2 | c),
            (h.modelviewMatrix = new pd3D.Matrix()),
            (h.projectionMatrix = new pd3D.Matrix()),
            (h.getModelviewProjectionMatrix = function () {
                return o && ((i = pd3D.Matrix.multiply(h.projectionMatrix, h.modelviewMatrix, i)), (o = !1)), i;
            }),
            (h.matrixMode = function (e) {
                switch (e) {
                    case h.MODELVIEW:
                        (s = h.modelviewMatrix), (t = a);
                        break;
                    case h.PROJECTION:
                        (s = h.projectionMatrix), (t = n);
                        break;
                    default:
                        throw new TypeError("invalid matrix mode " + e);
                }
            }),
            (h.loadIdentity = function () {
                pd3D.Matrix.identity(s), (o = !0);
            }),
            (h.loadMatrix = function (e) {
                for (var t = e.m, i = s.m, n = 0; n < 16; ++n) i[n] = t[n];
                o = !0;
            }),
            (h.multMatrix = function (e) {
                h.loadMatrix(pd3D.Matrix.multiply(s, e, r));
            }),
            (h.perspective = function (e, t, i, n) {
                h.multMatrix(pd3D.Matrix.perspective(e, t, i, n, d));
            }),
            (h.frustum = function (e, t, i, n, s, a) {
                h.multMatrix(pd3D.Matrix.frustum(e, t, i, n, s, a, d));
            }),
            (h.ortho = function (e, t, i, n, s, a) {
                h.multMatrix(pd3D.Matrix.ortho(e, t, i, n, s, a, d));
            }),
            (h.scale = function (e, t, i) {
                1 == arguments.length
                    ? pd.isNumeric(e)
                        ? h.multMatrix(pd3D.Matrix.scale(e, e, e, d))
                        : pd.isArray(e) && h.multMatrix(pd3D.Matrix.scale(+e[0] || 0, +e[1] || 0, +e[2] || 0, d))
                    : 3 == arguments.length && h.multMatrix(pd3D.Matrix.scale(+e || 0, +t || 0, +i || 0, d));
            }),
            (h.translate = function (e, t, i) {
                h.multMatrix(pd3D.Matrix.translate(e, t, i, d));
            }),
            (h.rotate = function (e, t, i, n) {
                h.multMatrix(pd3D.Matrix.rotate(e, t, i, n, d));
            }),
            (h.lookAt = function (e, t, i, n, s, a, r, o, l) {
                h.multMatrix(pd3D.Matrix.lookAt(e, t, i, n, s, a, r, o, l, d));
            }),
            (h.pushMatrix = function () {
                t.push(Array.prototype.slice.call(s.m));
            }),
            (h.popMatrix = function () {
                var e = t.pop();
                (s = pd3D.Matrix.fromArray(e, s)), (o = !0);
            }),
            (h.project = function (e, t, i, n, s, a) {
                (n = n || h.modelviewMatrix), (s = s || h.projectionMatrix), (a = a || h.getParameter(h.VIEWPORT));
                i = s.transformPoint(n.transformPoint(new pd3D.Vector(e, t, i)));
                return new pd3D.Vector(a[0] + a[2] * (0.5 * i.x + 0.5), a[1] + a[3] * (0.5 * i.y + 0.5), 0.5 * i.z + 0.5);
            }),
            (h.unproject = function (e, t, i, n, s, a) {
                (n = n || h.modelviewMatrix), (s = s || h.projectionMatrix), (a = a || h.getParameter(h.VIEWPORT));
                i = new pd3D.Vector(((e - a[0]) / a[2]) * 2 - 1, ((t - a[1]) / a[3]) * 2 - 1, 2 * i - 1);
                return pd3D.Matrix.inverse(pd3D.Matrix.multiply(s, n, d), r).transformPoint(i);
            }),
            (h.cleanup = function () {
                g && g.endRender();
            }),
            h.matrixMode(h.MODELVIEW),
            (function () {
                var t = h;
                function i(e) {
                    (h = t).onlongpress && h.onlongpress(e);
                }
                (t.frameIndex = 0),
                    m(document, "keydown", function (e) {
                        f(e), 27 != (e.keyCode || event.which) || e.altKey || e.ctrlKey || e.metaKey || h.canvas.focus();
                    }),
                    m(document, "keyup", function (e) {
                        f(e);
                    });
                var n = pdDOM.Interaction.makeInteractive(h.canvas, {
                    onmove: function (e) {
                        h.onmousemove && h.onmousemove(e);
                    },
                    onpress: function (e) {
                        (h = t).canvas.focus(), h.onmousedown && h.onmousedown(e);
                    },
                    ondrag: function (e) {
                        (h = t).onmousedrag && h.onmousedrag(e);
                    },
                    onrelease: function (e) {
                        (h = t).onmouseup && h.onmouseup(e);
                    },
                    ondoubletap: function (e) {
                        (h = t).ondoubletap && h.ondoubletap(e);
                    },
                    onlongclick: function (e) {
                        (h = t).onlongclick && h.onlongclick(e);
                    },
                    onscroll: function (e) {
                        (h = t).onmousewheel && h.onmousewheel(e);
                    },
                    onkeydown: function (e) {
                        var t;
                        f(e), h.onkeydown && h.onkeydown(e), e.altKey || e.ctrlKey || e.metaKey || ((t = _(e.keyCode)) && (pdGL.keys[t] = !0), pdGL.keys[e.keyCode] || pdGL.keyCount++, (pdGL.keys[e.keyCode] = !0), x(e));
                    },
                    onkeyup: function (e) {
                        if ((f(e), h.onkeyup && h.onkeyup(e), 27 == e.keyCode && 1 < pdGL.keyCount)) for (var t in ((pdGL.keyCount = 0), pdGL.keys)) 0 < +t && pdGL.keys[t] && pdGL.keyCount++;
                        var i;
                        e.altKey || e.ctrlKey || e.metaKey || ((i = _(e.keyCode)) && (pdGL.keys[i] = !1), pdGL.keys[e.keyCode] && pdGL.keyCount--, (pdGL.keys[e.keyCode] = !1), x(e));
                    },
                });
                h.addLongPress = function (e) {
                    n.setCallback("onlongpress", i), (h.onlongpress = e);
                };
            })(),
            (function () {
                !(function (e) {
                    h.makeCurrent = function () {
                        h = e;
                    };
                })(h);
                var t = !0,
                    i = !0;
                (h.setCullFace = function (e) {
                    null == e && (e = t), i != e && (e ? h.enable(h.CULL_FACE) : h.disable(h.CULL_FACE), (i = e));
                }),
                    (h.setCullFaceDefault = function (e) {
                        0 < arguments.length && ((t = !!e), h.setCullFace());
                    });
                var n = [],
                    e = h.getParameter(h.ALIASED_LINE_WIDTH_RANGE);
                function s(e) {
                    return e.preventDefault(), e.stopPropagation(), !1;
                }
                (h.minLineWidth = e[0]),
                    (h.maxLineWidth = e[1]),
                    (h.activeLineWidth = 1),
                    (h.readActiveLineWidth = function () {
                        return (h.activeLineWidth = h.getParameter(h.LINE_WIDTH)), h.activeLineWidth;
                    }),
                    (h.pushLineWidth = function (e) {
                        n.push(h.activeLineWidth),
                            1024 <= n.length && (1024 == n.length && console.warn("WARNING: pdGL line width stack getting excessively large."), 2048 < n.length && n.shift()),
                            e && 0 < e && ((h.activeLineWidth = e), h.lineWidth(e));
                    }),
                    (h.popLineWidth = function () {
                        var e = 0 < n.length ? n.pop() : 1;
                        e && 0.1 < e && ((h.activeLineWidth = e), h.lineWidth(e));
                    }),
                    (h.getCanvasLineWidthThin = function () {
                        return pdDOM.devicePixelRatio < 1.25 ? 0.75 : pdDOM.devicePixelRatio < 2.25 ? 1.5 : 2;
                    }),
                    (h.getCanvasLineWidth = function () {
                        return pdDOM.devicePixelRatio;
                    }),
                    (h.getCanvasLineWidthThick = function () {
                        return pdDOM.devicePixelRatio < 1.25 ? 1.55 : pdDOM.devicePixelRatio < 2.25 ? 2.5 : 4;
                    }),
                    (h.getCanvasLineWidthThicker = function () {
                        return pdDOM.devicePixelRatio < 1.25 ? 3 : pdDOM.devicePixelRatio < 2.25 ? 5 : 6;
                    }),
                    (h.frameIndex = 0),
                    (h.animationQueue = pdDOM.getGlobalAnimationQueue()),
                    (h.animate = function () {
                        var i = h;
                        return (
                            h.canvas.focus(),
                            h.animationQueue.add(function (e, t) {
                                return (h = i).onupdate && (h.onupdate(e, t) || u) && ((u = !1), (h.frameIndex = t), h.ondraw && h.ondraw()), !1;
                            }),
                            h.animationQueue.start(),
                            h.animationQueue
                        );
                    }),
                    (h.fullscreen = function (e) {
                        var t = (e = e || {}).paddingTop || 0,
                            i = e.paddingLeft || 0,
                            n = e.paddingRight || 0,
                            s = e.paddingBottom || 0;
                        if (!document.body) throw new Error("document.body doesn't exist yet (call gl.fullscreen() from window.onload() or from inside the <body> tag)");
                        function a() {
                            (h.canvas.width = window.innerWidth - i - n),
                                (h.canvas.height = window.innerHeight - t - s),
                                h.viewport(0, 0, h.canvas.width, h.canvas.height),
                                h.orbitalView
                                    ? h.orbitalView.applyProjection()
                                    : (!e.camera && "camera" in e) || (h.matrixMode(h.PROJECTION), h.loadIdentity(), h.perspective(e.fov || 90, h.canvas.width / h.canvas.height, e.near || 0.1, e.far || 1e3), h.matrixMode(h.MODELVIEW)),
                                h.onresize && h.onresize(),
                                h.ondraw && h.ondraw();
                        }
                        document.body.appendChild(h.canvas),
                            (document.body.style.overflow = "hidden"),
                            (h.canvas.style.position = "absolute"),
                            (h.canvas.style.left = i + "px"),
                            (h.canvas.style.top = t + "px"),
                            (h.canvas.style.msTouchAction = "none"),
                            (h.canvas.style.touchAction = "none"),
                            m(window, "resize", a),
                            a();
                    }),
                    (h.QUADS = 7),
                    (h.QUAD_STRIP = 8),
                    (h.HALF_FLOAT = h.HALF_FLOAT || 36193),
                    (h.update = function () {
                        u = !0;
                    }),
                    (h.useOrbitalView = function (e) {
                        h.orbitalView = new pdGL.OrbitalView(e);
                    }),
                    (h.disableContextMenu = function (e) {
                        var t, i;
                        h.canvas && (e ? m(h.canvas, "contextmenu", s) : ((t = h.canvas), (i = "contextmenu"), (e = s), t.removeEventListener(i, e)));
                    });
            })(),
            h.enable(h.DEPTH_TEST),
            h.frontFace(h.CCW),
            h.enable(h.CULL_FACE),
            h.cullFace(h.BACK),
            h.enable(h.POLYGON_OFFSET_FILL),
            h.polygonOffset(1, 1),
            h.enable(h.BLEND),
            h.blendFuncSeparate(h.SRC_ALPHA, h.ONE_MINUS_SRC_ALPHA, h.ONE, h.ONE_MINUS_SRC_ALPHA),
            h.canvas.setAttribute("tabindex", "0"),
            (pd3D.canUse32BitBuffers = null != h.getExtension("OES_element_index_uint")),
            h
        );
    };
    var t = { 8: "BACKSPACE", 9: "TAB", 13: "ENTER", 16: "SHIFT", 27: "ESCAPE", 32: "SPACE", 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN" };
    function _(e) {
        return t[e] || (65 <= e && e <= 90 ? String.fromCharCode(e) : null);
    }
    function x(e, t) {
        e.getModifierState && ((t = t || "CapsLock"), (pdGL.keys[t] = e.getModifierState(t)));
    }
    var e = null;
    pdGL.getDefaultMaterialFixedColor = function () {
        return (e = e || pdGL.Material.FixedColorUniformPointSize({ name: "pdGL.DefaultMaterialFixedColor", uniforms: { color: [1, 0, 0, 1], opacity: 1 } }));
    };
    var i = null;
    (pdGL.getDefaultMaterialMeshColor = function () {
        return (i = i || pdGL.Material.VariableColorUniformPointSize({ name: "pdGL.DefaultMaterialMeshColor", uniforms: { color: [1, 0, 0, 1], opacity: 1 } }));
    }),
        (pdGL.OrbitalView = function (e) {
            return (
                (e = e || {}),
                (this.defaultTarget = e.defaultTarget || new pd3D.Vector(0, 0, 0)),
                (this.defaultDistance = pd.toNumber(e.defaultDistance, 8)),
                (this.defaultAzi = pd.toNumber(e.defaultAzi, 60)),
                (this.defaultAlt = pd.toNumber(e.defaultAlt, 30)),
                (this.defaultFOV = pd.toNumber(e.defaultFOV, 45)),
                (this.zoomByDollying = pd.toBoolean(e.zoomByDollying, !1)),
                (this.animationSpeed = pd.toNumber(e.animationSpeed, 2)),
                (this.farFieldFactor = pd.toNumber(e.farFieldFactor, 2.5)),
                (this.farFieldMin = pd.toNumber(e.farFieldMin, 0)),
                (this.kbdNav = { active: !1, moveInOut: 0, moveLeftRight: 0, moveUpDown: 0, lookLeftRight: 0, lookUpDown: 0, slowDown: 0.9, speedUp: 0.03, maxSpeed: 0.5 }),
                (this.orbitMode = !0),
                (this.handlePointerMove = e.handlePointerMove || null),
                (this.handlePointerDown = e.handlePointerDown || null),
                (this.handlePointerDrag = e.handlePointerDrag || null),
                (this.handlePointerUp = e.handlePointerUp || null),
                (this.target = new pd3D.Vector(this.defaultTarget.x, this.defaultTarget.y, this.defaultTarget.z)),
                (this.cameraDistance = this.defaultDistance),
                (this.cameraAzi = this.defaultAzi),
                (this.cameraAlt = this.defaultAlt),
                (this.cameraFOV = this.defaultFOV),
                (this.camera = new pd3D.Vector(0, this.defaultDistance, 0)),
                (this.eyePos = new pd3D.Vector(0, this.defaultDistance, 0)),
                (this.eyePosAsArray = [0, 0, 0]),
                (this.zoomFactor = 1),
                (this.mouseWheelIncrement = 1),
                (this.aspectRatio = 0 < h.canvas.height ? h.canvas.width / h.canvas.height : 1),
                (this.snapGrid = pd.toNumber(e.snapGrid, 0)),
                (this.hasChanged = h.PROJECTION),
                (this.orthoMode = 0),
                (this._unprojectMatrix = new pd3D.Matrix()),
                (this._unprojectViewport = [0, 0, 640, 480]),
                (this._unprojectValid = !1),
                (this._localProjectionMatrix = null),
                (this._localModelViewMatrix = null),
                (this._localHUD = !1),
                (this._zoomFactorMin = pd.toNumber(e.zoomFactorMin, 0.01)),
                (this._viewAngleMin = pd.toNumber(e._viewAngleMin, 0.01)),
                (this._nearField = 0.1),
                (this._farField = 1),
                (this._inertiaAction = 0),
                (this._inertiaThresholdTime = 50),
                (this._inertiaThresholdDelta = 2),
                (this._inertiaDampingFactor = 0.9),
                (this._inertiaMinimumValue = 0.05),
                (this._inertiaTimeStamp = 0),
                (this._inertiaDeltaX = 0),
                (this._inertiaDeltaY = 0),
                (this._inertiaZoom = 0),
                (this._rotationLock = !0),
                (this._rotationThreshold = 5),
                (this._rotationAccum = 0),
                (this._animateSourceView = null),
                (this._animateTargetView = null),
                (this._animating = !1),
                pd.addSimpleEventHandling(this),
                e.callbackOnChange && this.on("change", e.callbackOnChange),
                this.initialise(),
                this
            );
        }),
        (pdGL.OrbitalView.prototype = {
            getOrthoModeFieldOfView: function () {
                var e;
                switch (this.orthoMode) {
                    default:
                        e = this.cameraFOV;
                        break;
                    case 1:
                        e = this.defaultFOV * Math.abs(pd.cosDegrees(this.cameraAlt));
                        break;
                    case 2:
                        e = this.defaultFOV * Math.abs(pd.sinDegrees(this.cameraAlt));
                }
                return pd.constrainTo(e, 0.1, 160);
            },
            getFieldOfViewFactor: function () {
                var e = pd.constrainTo(this.cameraFOV, this._viewAngleMin, 160),
                    e = 0.25 / (this.zoomFactor * Math.tan(0.25 * e * a));
                return pd.constrainTo(e, 0.01, 1e5);
            },
            apply: function (e) {
                var t = this.getFieldOfViewFactor();
                (e || this.hasChanged > h.MODELVIEW) && this.applyProjection(t), (this._localHUD = !1), h.matrixMode(h.MODELVIEW), h.loadIdentity();
                var i = this.cameraAzi * a,
                    n = pd.constrainTo(this.cameraAlt, -89.99, 89.99) * a,
                    s = this.cameraDistance * Math.cos(n),
                    e = s * Math.cos(i),
                    i = s * Math.sin(i),
                    n = this.cameraDistance * Math.sin(n);
                return (
                    this.camera.init(this.target.x + e * t, this.target.y + i * t, this.target.z + n * t),
                    this.eyePos.init((this.eyePosAsArray[0] = this.target.x + e), (this.eyePosAsArray[1] = this.target.y + i), (this.eyePosAsArray[2] = this.target.z + n)),
                    h.lookAt(this.camera.x, this.camera.y, this.camera.z, this.target.x, this.target.y, this.target.z, 0, 0, 1),
                    this.hasChanged && (this.emit("change"), this.callbackOnChange && this.callbackOnChange(this), (this.hasChanged = 0)),
                    this
                );
            },
            applyProjection: function (e) {
                var t = h.canvas.width,
                    i = h.canvas.height;
                h.matrixMode(h.PROJECTION), h.loadIdentity(), (this.aspectRatio = 0 < i ? t / i : 1), (this._unprojectViewport[2] = t), (this._unprojectViewport[3] = i), (e = pd.toNumber(e, this.getFieldOfViewFactor()));
                (i = (this.farFieldFactor / pd.constrainTo(this.zoomFactor, 0.001, 1)) * this.defaultDistance), (e *= this.cameraDistance);
                return (
                    (this._nearField = Math.max(e - i, 0.0025 * this.defaultDistance)),
                    (this._farField = e + Math.max(i, this.farFieldMin)),
                    h.perspective(pd.constrainTo(this.cameraFOV, this._viewAngleMin, 160), this.aspectRatio, this._nearField, this._farField),
                    (this._unprojectValid = !1),
                    h.setCullFace(),
                    this
                );
            },
            startOverlay2D: function (e, t) {
                (e = e || h.canvas.width), (t = t || h.canvas.height);
                return (
                    (this._localProjectionMatrix = pd3D.Matrix.clone(h.projectionMatrix, this._localProjectionMatrix)),
                    (this._localModelViewMatrix = pd3D.Matrix.clone(h.modelviewMatrix, this._localModelViewMatrix)),
                    (this._localHUD = !0),
                    h.matrixMode(h.PROJECTION),
                    h.loadIdentity(),
                    h.ortho(0.5, e + 0.5, 0.5, t + 0.5, -100, 100),
                    h.matrixMode(h.MODELVIEW),
                    h.loadIdentity(),
                    this
                );
            },
            endOverlay2D: function () {
                return pd3D.Matrix.clone(this._localProjectionMatrix, h.projectionMatrix), pd3D.Matrix.clone(this._localModelViewMatrix, h.modelviewMatrix), (this._localHUD = !1), this;
            },
            copyViewDataTo: function (e, t) {
                return (
                    (e = e || {}),
                    null != (t = t || this).defaultAzi && (e.defaultAzi = t.defaultAzi),
                    null != t.defaultAlt && (e.defaultAlt = t.defaultAlt),
                    null != t.defaultFOV && (e.defaultFOV = t.defaultFOV),
                    null != t.defaultDistance && (e.defaultDistance = t.defaultDistance),
                    null != t.cameraAzi && (e.cameraAzi = t.cameraAzi),
                    null != t.cameraAlt && (e.cameraAlt = t.cameraAlt),
                    null != t.cameraFOV && (e.cameraFOV = t.cameraFOV),
                    null != t.cameraDistance && (e.cameraDistance = t.cameraDistance),
                    pd.isNumeric(t.zoom) && (e.zoomFactor = t.zoom),
                    null != t.zoomFactor && (e.zoomFactor = t.zoomFactor),
                    null != t.farFieldFactor && (e.farFieldFactor = t.farFieldFactor),
                    null != t.farFieldMin && (e.farFieldMin = t.farFieldMin),
                    null != t.snapGrid && (e.snapGrid = t.snapGrid),
                    null != t.defaultTarget &&
                        (pd.isArray(t.defaultTarget)
                            ? (e.defaultTarget = pd3D.Vector.fromArray(t.defaultTarget))
                            : t.defaultTarget instanceof pd3D.Vector && (e.defaultTarget ? e.defaultTarget.init(t.defaultTarget) : (e.defaultTarget = new pd3D.Vector(t.defaultTarget)))),
                    null != t.target && (pd.isArray(t.target) ? (e.target = pd3D.Vector.fromArray(t.target)) : t.target instanceof pd3D.Vector && (e.target ? e.target.init(t.target) : (e.target = new pd3D.Vector(t.target)))),
                    null != t.camera && (pd.isArray(t.camera) ? (e.camera = pd3D.Vector.fromArray(t.camera)) : t.camera instanceof pd3D.Vector && (e.camera ? e.camera.init(t.camera) : (e.camera = new pd3D.Vector(t.camera)))),
                    e
                );
            },
            interpolateBetween: function (e, t, i) {
                var n, s;
                return (
                    t &&
                        e &&
                        ((n = 1 - (i = pd.constrainTo(i, 0, 1))),
                        (this.orbitMode = !0),
                        null != t.defaultDistance
                            ? ((this.defaultDistance = n * e.defaultDistance + i * t.defaultDistance), (this.cameraDistance = n * e.cameraDistance + i * t.defaultDistance))
                            : null != t.cameraDistance && (this.cameraDistance = n * e.cameraDistance + i * t.cameraDistance),
                        null != t.defaultAzi
                            ? ((this.defaultAzi = pd.wrapAt(n * e.defaultAzi + i * t.defaultAzi, -180, 180)), (this.cameraAzi = pd.wrapAt(n * e.cameraAzi + i * t.defaultAzi, -180, 180)))
                            : null != t.cameraAzi && (this.cameraAzi = pd.wrapAt(n * e.cameraAzi + i * t.cameraAzi, -180, 180)),
                        null != t.defaultAlt
                            ? ((this.defaultAlt = pd.constrainTo(n * e.defaultAlt + i * t.defaultAlt, -90, 90)), (this.cameraAlt = pd.constrainTo(n * e.cameraAlt + i * t.defaultAlt, -90, 90)))
                            : null != t.cameraAlt && (this.cameraAlt = pd.constrainTo(n * e.cameraAlt + i * t.cameraAlt, -90, 90)),
                        null != t.defaultFOV ? ((this.defaultFOV = n * e.defaultFOV + i * t.defaultFOV), (this.cameraFOV = n * e.cameraFOV + i * t.defaultFOV)) : null != t.cameraFOV && (this.cameraFOV = n * e.cameraFOV + i * t.cameraFOV),
                        null != t.zoomFactor && (this.zoomFactor = Math.max(this._zoomFactorMin, n * e.zoomFactor + i * t.zoomFactor)),
                        null != t.farFieldFactor && (this.farFieldFactor = n * e.farFieldFactor + i * t.farFieldFactor),
                        null != t.farFieldMin && (this.farFieldMin = n * e.farFieldMin + i * t.farFieldMin),
                        null != t.snapGrid && (this.snapGrid = n * e.snapGrid + i * t.snapGrid),
                        null != t.defaultTarget
                            ? ((this.defaultTarget.x = n * e.target.x + i * t.defaultTarget.x),
                              (this.defaultTarget.y = n * e.target.y + i * t.defaultTarget.y),
                              (this.defaultTarget.z = n * e.target.z + i * t.defaultTarget.z),
                              this.target.init(this.defaultTarget))
                            : null != t.target && ((this.target.x = n * e.target.x + i * t.target.x), (this.target.y = n * e.target.y + i * t.target.y), (this.target.z = n * e.target.z + i * t.target.z)),
                        null != t.camera &&
                            ((s = this.getFieldOfViewFactor()),
                            (this.camera.x = n * e.camera.x + i * t.camera.x),
                            (this.camera.y = n * e.camera.y + i * t.camera.y),
                            (this.camera.z = n * e.camera.z + i * t.camera.z),
                            (this.cameraDistance = this.camera.distanceTo(this.target) / s),
                            (this.cameraAlt =
                                ((i = this.target),
                                (t = this.camera),
                                (s = t.z - i.z),
                                Math.abs(s) < 1e-6 ? 0 : ((i = Math.sqrt((t.x - i.x) * (t.x - i.x) + (t.y - i.y) * (t.y - i.y))), Math.abs(i) < 1e-6 ? (s < 0 ? -90 : 90) : Math.atan2(s, i) * r))),
                            (this.cameraAzi = ((t = this.target), (s = this.camera), (i = s.x - t.x), (t = s.y - t.y), Math.abs(i) < 1e-6 ? (Math.abs(t) < 1e-6 ? 0 : t < 0 ? -90 : 90) : Math.atan2(t, i) * r)),
                            (this.orbitMode = !1)),
                        (this.hasChanged = h.PROJECTION),
                        (this._unprojectValid = !1)),
                    this
                );
            },
            animateTo: function (e, t) {
                var i = this,
                    n = 0;
                if (this._animating) return this;
                (this._animateSourceView = this.copyViewDataTo(this._animateSourceView)), (this._animateTargetView = this.copyViewDataTo(null, e)), (this._animating = !0);
                e = pd.toNumber(e.cameraFOV, this.cameraFOV);
                return (
                    pd.closeTo(e, 0, 1e-4) ? (this._rotationThreshold = 15) : (this._rotationThreshold = 5),
                    (this._rotationLock = !0),
                    h.animationQueue
                        .addOrReplace(function (e) {
                            return (
                                1 < (n += i.animationSpeed * pd.constrainTo(e, 0.001, 0.2)) && (n = 1),
                                i.interpolateBetween(i._animateSourceView, i._animateTargetView, pd.Easing.inOutSine(n)),
                                t && t(i, n),
                                h.update(),
                                0.999 < n && ((i._animating = !1), !(i._animateTargetView = null))
                            );
                        })
                        .start(),
                    this
                );
            },
            setView: function (e) {
                e = e || {};
                var t = { target: this.defaultTarget, cameraDistance: this.defaultDistance, zoomFactor: 1 };
                return this.copyViewDataTo(t, e), this.interpolateBetween(this, t, 1), (this._unprojectValid = !1), h.update(), this;
            },
            setCamera: function (e, t, i, n) {
                return (
                    pd.isNumeric(e) && ((e = pd.wrapAt(e, -180, 180)), pd.closeTo(this.cameraAzi, e, 0.01) || ((this.hasChanged = h.MODELVIEW), (this.cameraAzi = e))),
                    pd.isNumeric(t) && ((t = pd.constrainTo(t, -90, 90)), pd.closeTo(this.cameraAlt, t, 0.01) || ((this.hasChanged = h.MODELVIEW), (this.cameraAlt = t))),
                    pd.isNumeric(i) && ((i = pd.constrainTo(i, 0, 160)), pd.closeTo(this.cameraFOV, i, 0.01) || ((this.hasChanged = h.PROJECTION), (this.cameraFOV = i))),
                    pd.isNumeric(n) && ((n = pd.constrainTo(n, 0.001, 1e3)), pd.closeTo(this.zoomFactor, n, 1e-4) || ((this.zoomFactor = Math.max(this._zoomFactorMin, n)), (this.hasChanged = h.PROJECTION))),
                    pd.closeTo(this.cameraFOV, 0, 1e-4) ? (this._rotationThreshold = 15) : (this._rotationThreshold = 5),
                    (this._rotationLock = !0),
                    this.hasChanged && ((this._unprojectValid = !1), (this._animating = !1), h.update()),
                    0 != this.hasChanged
                );
            },
            setZoomFactor: function (e) {
                return (
                    (e = pd.constrainTo(pd.toNumber(e, 0), 0.01, 3)),
                    (this.zoomFactor = Math.max(this._zoomFactorMin, e)),
                    this.zoomByDollying && (this.cameraDistance = this.defaultDistance / this.zoomFactor),
                    (this.hasChanged = h.PROJECTION),
                    (this._unprojectValid = !1),
                    h.update(),
                    this
                );
            },
            reset: function (e, t) {
                return (
                    (this._unprojectValid = !1),
                    (this._animating = !1),
                    e
                        ? ((this.cameraAzi = this.defaultAzi), (this.cameraAlt = this.defaultAlt), (this.cameraFOV = this.defaultFOV), (this.hasChanged = h.PROJECTION), h.update())
                        : this.animateTo({ cameraAzi: this.defaultAzi, cameraAlt: this.defaultAlt, cameraFOV: this.defaultFOV, cameraDistance: this.defaultDistance, target: this.defaultTarget, zoomFactor: 1 }, t),
                    this
                );
            },
            center: function (e, t) {
                e = e || {};
                var i = { target: this.defaultTarget, cameraDistance: this.defaultDistance, zoomFactor: 1 };
                return this.copyViewDataTo(i, e), (this._unprojectValid = !1), (this._animating = !1), (this.orbitMode = !0), e.noAnimation ? (this.interpolateBetween(this, i, 1), h.update()) : this.animateTo(i, t), this;
            },
            isCenter: function () {
                return (!this.zoomByDollying || this.cameraDistance == this.defaultDistance) && this.target.equals(this.defaultTarget) && 1 == this.zoomFactor;
            },
            redraw: function () {
                return h.update(), this;
            },
            getPointSize: function () {
                return 0.01 * this.defaultDistance;
            },
            getVectorToCamera: function (e, t, i) {
                arguments.length < 1 && ((e = this.target.x), (t = this.target.y), (i = this.target.z));
                var n = this.camera.x - e,
                    s = this.camera.y - t,
                    a = this.camera.z - i,
                    r = n * n + s * s + a * a;
                return 0 < r && ((n *= r = 1 / Math.sqrt(r)), (s *= r), (a *= r)), [n, s, a];
            },
            checkUnprojectMatrix: function (e) {
                return (
                    (this._unprojectValid && !e) ||
                        (this._localHUD
                            ? pd3D.Matrix.inverse(pd3D.Matrix.multiply(this._localProjectionMatrix, this._localModelViewMatrix), this._unprojectMatrix)
                            : pd3D.Matrix.inverse(pd3D.Matrix.multiply(h.projectionMatrix, h.modelviewMatrix), this._unprojectMatrix),
                        (this._unprojectValid = !0)),
                    this
                );
            },
            modelToCanvas: function (e, t) {
                var i,
                    n = this._unprojectViewport;
                return (
                    this.checkUnprojectMatrix(),
                    this._localHUD
                        ? ((i = this._localProjectionMatrix.transformPoint(this._localModelViewMatrix.transformPoint(new pd3D.Vector(t[0], t[1], t[2])))), (e[0] = n[0] + n[2] * (0.5 * i.x + 0.5)), (e[1] = n[1] + n[3] * (0.5 * i.y + 0.5)))
                        : ((i = h.projectionMatrix.transformPoint(h.modelviewMatrix.transformPoint(new pd3D.Vector(t[0], t[1], t[2])))),
                          (e[0] = (n[0] + n[2] * (0.5 * i.x + 0.5)) / pdDOM.devicePixelRatio),
                          (e[1] = (n[3] - (n[1] + n[3] * (0.5 * i.y + 0.5))) / pdDOM.devicePixelRatio)),
                    (e[2] = 0.5 * i.z + 0.5),
                    e
                );
            },
            canvasToModel: function (e, t, i) {
                this.checkUnprojectMatrix();
                var n = this._unprojectViewport;
                return (e *= pdDOM.devicePixelRatio), (t = n[3] - t * pdDOM.devicePixelRatio), this._unprojectMatrix.transformPoint(new pd3D.Vector(((e - n[0]) / n[2]) * 2 - 1, ((t - n[1]) / n[3]) * 2 - 1, 2 * i - 1));
            },
            zoom: function (e) {
                return (
                    (e *= 0.5),
                    (this.zoomFactor = Math.max(this._zoomFactorMin, this.zoomFactor + e)),
                    this.zoomByDollying && (this.cameraDistance = this.defaultDistance / this.zoomFactor),
                    (this.hasChanged = h.PROJECTION),
                    (this._unprojectValid = !1),
                    h.update(),
                    this
                );
            },
            walk: function (e) {
                e = this.target
                    .subtract(this.camera)
                    .normalize()
                    .multiply(0.25 * e * this.cameraDistance * this.getFieldOfViewFactor());
                return (
                    this.camera.init(this.camera.x + e.x, this.camera.y + e.y, this.camera.z + e.z),
                    this.target.init(this.target.x + e.x, this.target.y + e.y, this.target.z + e.z),
                    (this.hasChanged = h.PROJECTION),
                    (this._unprojectValid = !1),
                    (this.orbitMode = !1),
                    h.update(),
                    this
                );
            },
            rotate: function (e, t) {
                return (
                    (this.cameraAzi = pd.wrapAt(this.cameraAzi - e, -180, 180)),
                    (this.cameraAlt = Math.max(-90, Math.min(90, this.cameraAlt + t))),
                    this.orbitMode ||
                        ((e = this.camera.distanceTo(this.target)),
                        (t = pd.wrapAt(this.cameraAzi + 180, -180, 180)),
                        pd3D.Vector.sphericalToCartesian3D(t * a, -this.cameraAlt * a, e, this.target),
                        pd3D.Vector.add(this.target, this.camera, this.target)),
                    (this.hasChanged = h.MODELVIEW),
                    (this._unprojectValid = !1),
                    h.update(),
                    this
                );
            },
            pan: function (e, t, i) {
                var n,
                    s = !1,
                    a = (0.25 * this.defaultDistance) / this.zoomFactor,
                    r = this.target.subtract(this.camera).normalize();
                return (
                    1e-4 < Math.abs(t) &&
                        ((t *= a),
                        (t = (n = pd3D.Vector.UnitZ.cross(r).normalize()).cross(r).normalize().multiply(t)),
                        this.target.init(this.target.x - t.x, this.target.y - t.y, this.target.z - t.z),
                        this.camera.init(this.camera.x - t.x, this.camera.y - t.y, this.camera.z - t.z),
                        (s = !0)),
                    1e-4 < Math.abs(e) &&
                        ((e *= a),
                        (n = pd3D.Vector.UnitZ.cross(r).normalize().multiply(e)),
                        this.target.init(this.target.x + n.x, this.target.y + n.y, this.target.z + n.z),
                        this.camera.init(this.camera.x + n.x, this.camera.y + n.y, this.camera.z + n.z),
                        (s = !0)),
                    s && i && ((this.hasChanged = h.MODELVIEW), (this._unprojectValid = !1), h.update()),
                    this
                );
            },
            clearInertia: function () {
                return (this._inertiaAction = 0), (this._inertiaTimeStamp = 0), (this._inertiaDeltaX = 0), (this._inertiaDeltaY = 0), (this._inertiaZoom = 0), this;
            },
            updateView: function (e) {
                return (
                    1 == this._inertiaAction
                        ? this.rotate(0.25 * this._inertiaDeltaX, 0.25 * this._inertiaDeltaY)
                        : 2 == this._inertiaAction
                        ? this.pan(0.0075 * this._inertiaDeltaX, 0.0075 * this._inertiaDeltaY, !0)
                        : 3 == this._inertiaAction
                        ? this.zoom(this._inertiaZoom)
                        : 4 == this._inertiaAction
                        ? (this.pan(0.0075 * this._inertiaDeltaX, 0.0075 * this._inertiaDeltaY, !1), e && this.rotate(e, 0), this.zoom(this._inertiaZoom))
                        : 5 != this._inertiaAction || ((e = pd.constrainTo(this.cameraFOV - 150 * this._inertiaZoom, this._viewAngleMin, 160)) != this.cameraFOV && ((this.cameraFOV = e), this.zoom(this.zoomFactor * this._inertiaZoom))),
                    this
                );
            },
            updateInertia: function () {
                return 0 < this._inertiaAction && (Math.abs(this._inertiaDeltaX) > this._inertiaMinimumValue || Math.abs(this._inertiaDeltaY) > this._inertiaMinimumValue || 1e-4 < Math.abs(this._inertiaZoom))
                    ? ((this._inertiaDeltaX = this._inertiaDeltaX * this._inertiaDampingFactor),
                      (this._inertiaDeltaY = this._inertiaDeltaY * this._inertiaDampingFactor),
                      (this._inertiaZoom = this._inertiaZoom * this._inertiaDampingFactor),
                      this.updateView(),
                      !1)
                    : (this.clearInertia(), !0);
            },
            handleKbdNavigation: function (e) {
                var t,
                    i,
                    n,
                    s,
                    a = !1;
                return (
                    (pdGL.keyCount || this.kbdNav.active) &&
                        (this.orbitMode
                            ? ((pdGL.keys.CapsLock || pdGL.keys.SHIFT) && (e *= 5),
                              (pdGL.keys.A || pdGL.keys.D || pdGL.keys.Q || pdGL.keys.Z) && (this.pan(e * ((pdGL.keys.A || 0) - (pdGL.keys.D || 0)), e * ((pdGL.keys.Q || 0) - (pdGL.keys.Z || 0)), !0), (a = !0)),
                              (pdGL.keys.LEFT || pdGL.keys.RIGHT || pdGL.keys.UP || pdGL.keys.DOWN) &&
                                  (this.rotate(25 * e * ((pdGL.keys.LEFT || 0) - (pdGL.keys.RIGHT || 0)), 25 * e * ((pdGL.keys.UP || 0) - (pdGL.keys.DOWN || 0))), (a = !0)),
                              (pdGL.keys.W || pdGL.keys.S) && (this.walk(e * this.kbdNav.speedUp * ((pdGL.keys.W || 0) - (pdGL.keys.S || 0))), (a = !0)))
                            : ((s = (t = this.kbdNav).slowDown),
                              (i = t.speedUp),
                              (n = this.kbdNav.maxSpeed),
                              (pdGL.keys.CapsLock || pdGL.keys.SHIFT) && (n *= 10),
                              pdGL.keys.W || pdGL.keys.S ? ((t.moveInOut += i * ((pdGL.keys.W || 0) - (pdGL.keys.S || 0))), (t.moveInOut = pd.constrainTo(t.moveInOut, -n, n))) : (t.moveInOut *= s),
                              pdGL.keys.A || pdGL.keys.D ? ((t.moveLeftRight += i * ((pdGL.keys.A || 0) - (pdGL.keys.D || 0))), (t.moveLeftRight = pd.constrainTo(t.moveLeftRight, -n, n))) : (t.moveLeftRight *= s),
                              pdGL.keys.Q || pdGL.keys.Z ? ((t.moveUpDown += i * ((pdGL.keys.Q || 0) - (pdGL.keys.Z || 0))), (t.moveUpDown = pd.constrainTo(t.moveUpDown, -n, n))) : (t.moveUpDown *= s),
                              pdGL.keys.LEFT || pdGL.keys.RIGHT
                                  ? ((t.lookLeftRight += 25 * i * ((pdGL.keys.RIGHT || 0) - (pdGL.keys.LEFT || 0))), (t.lookLeftRight = pd.constrainTo(t.lookLeftRight, -100 * n, 100 * n)))
                                  : (t.lookLeftRight *= s),
                              pdGL.keys.UP && pdGL.keys.DOWN
                                  ? (t.lookUpDown = (this.cameraAlt / e) * -0.1)
                                  : pdGL.keys.UP || pdGL.keys.DOWN
                                  ? ((t.lookUpDown += 15 * i * ((pdGL.keys.DOWN || 0) - (pdGL.keys.UP || 0))), (t.lookUpDown = pd.constrainTo(t.lookUpDown, -100 * n, 100 * n)))
                                  : (t.lookUpDown *= s),
                              (t.active = !1),
                              (1e-4 < Math.abs(t.moveLeftRight) || 1e-4 < Math.abs(t.moveUpDown)) && (this.pan(0.5 * e * t.moveLeftRight, 0.5 * e * t.moveUpDown, !0), (a = t.active = !0)),
                              (1e-4 < Math.abs(t.lookLeftRight) || 1e-4 < Math.abs(t.lookUpDown)) &&
                                  (this.cameraFOV < 1 ? ((s = Math.max(0.05, this.cameraFOV)), this.pan(e * s * -t.lookLeftRight, e * s * -t.lookUpDown, !0)) : this.rotate(e * t.lookLeftRight, e * t.lookUpDown), (a = t.active = !0)),
                              1e-4 < Math.abs(t.moveInOut) && (this.cameraFOV < 1 ? this.zoom(e * t.moveInOut) : this.walk(e * t.moveInOut), (a = t.active = !0)))),
                    a
                );
            },
            initialise: function () {
                var n = this,
                    s = -1,
                    a = !1,
                    r = 0;
                function t() {
                    return n.updateInertia();
                }
                return (
                    (h.onmousemove = function (e) {
                        n.handlePointerMove && n.handlePointerMove(e);
                    }),
                    (h.onmousedown = function (e) {
                        n.clearInertia(), (r = e.touchCount), n.handlePointerDown && (a = n.handlePointerDown(e)), (n._rotationAccum = 0), (s = e.button);
                    }),
                    (h.onmousedrag = function (e) {
                        var t,
                            i = e.button;
                        e.button < 0 && (i = e.button = s),
                            r < e.touchCount && (r = e.touchCount),
                            (a && n.handlePointerDrag && n.handlePointerDrag(e)) ||
                                ((n._inertiaAction = 0) == i || (2 == i && !e.touchCount)
                                    ? e.ctrlKey || e.metaKey
                                        ? (e.shiftKey
                                              ? ((n._inertiaAction = 5), (n._inertiaTimeStamp = e.timeStamp), (n._inertiaDeltaX = e.dragX), (n._inertiaDeltaY = e.dragY), (n._inertiaZoom = 0.0015 * -(n._inertiaDeltaX - n._inertiaDeltaY)))
                                              : ((n._inertiaAction = 3), (n._inertiaTimeStamp = e.timeStamp), (n._inertiaDeltaX = e.dragX), (n._inertiaDeltaY = e.dragY), (n._inertiaZoom = 0.005 * (n._inertiaDeltaX - n._inertiaDeltaY))),
                                          n.updateView())
                                        : e.shiftKey
                                        ? ((t = 1), (n._inertiaAction = 2), (n._inertiaTimeStamp = e.timeStamp), (n._inertiaDeltaX = t * e.dragX), (n._inertiaDeltaY = t * e.dragY), (n._inertiaZoom = 0), n.updateView())
                                        : e.hasMoved(e.isTouchEvent ? 10 : 4) &&
                                          ((t = n.orbitMode ? 1 : pd.mapAndConstrainTo(n.cameraFOV, 0, 90, 0.001, 1)),
                                          (n._inertiaAction = 1),
                                          (n._inertiaTimeStamp = e.timeStamp),
                                          (n._inertiaDeltaX = t * e.dragX),
                                          (n._inertiaDeltaY = t * e.dragY),
                                          (n._inertiaZoom = 0),
                                          n.updateView())
                                    : 1 == i
                                    ? ((n._inertiaTimeStamp = e.timeStamp),
                                      (n._inertiaDeltaX = e.dragX),
                                      (n._inertiaDeltaY = e.dragY),
                                      (n._inertiaAction = 4),
                                      (n._inertiaZoom = 1.5 * (e.scale - 1)),
                                      0.25 < Math.abs(n._inertiaZoom) && ((n._inertiaZoom = 0), (e.rotation = 0)),
                                      n._rotationLock && n.orbitMode && !pd.closeTo(e.rotation, 0, 1e-4) && ((n._rotationAccum += e.rotation), Math.abs(n._rotationAccum) > n._rotationThreshold ? (n._rotationLock = !1) : (e.rotation = 0)),
                                      n.updateView(e.rotation))
                                    : 2 == i &&
                                      (2 < e.touchCount ? (n._inertiaAction = 2) : (n._inertiaAction = 1),
                                      (n._inertiaTimeStamp = e.timeStamp),
                                      (n._inertiaDeltaX = e.dragX),
                                      (n._inertiaDeltaY = e.dragY),
                                      (n._inertiaZoom = 0),
                                      n.updateView()));
                    }),
                    (h.onmouseup = function (e) {
                        (a && n.handlePointerUp && n.handlePointerUp(e)) ||
                            ((a = !1),
                            pdDOM.Interaction.hasMoved(5 * pdDOM.devicePixelRatio) &&
                                e.timeStamp - n._inertiaTimeStamp < n._inertiaThresholdTime &&
                                (Math.abs(n._inertiaDeltaX) > n._inertiaThresholdDelta || Math.abs(n._inertiaDeltaY) > n._inertiaThresholdDelta || 0.01 < Math.abs(n._inertiaZoom)) &&
                                h.animationQueue.addOrReplace(t).start(),
                            h.oncontextmenu && 2 == event.button && !pdDOM.Interaction.hasMoved() && h.oncontextmenu(e),
                            (s = -1),
                            n._rotationLock || (n._rotationThreshold = 5));
                    }),
                    (h.onmousewheel = function (e) {
                        var t;
                        e.delta &&
                            ((t = e.delta < 0 ? -1 : 1),
                            e.shiftKey ? (t *= 10) : (e.ctrlKey || e.metaKey) && (t *= 0.1),
                            e.timeStamp - n._inertiaTimeStamp < n._inertiaThresholdTime ? ((n.mouseWheelIncrement += 0.1), 0 <= t ? (t += n.mouseWheelIncrement) : (t -= n.mouseWheelIncrement)) : (n.mouseWheelIncrement = 0),
                            (n._inertiaTimeStamp = e.timeStamp),
                            n.zoom(0.05 * t));
                    }),
                    this
                );
            },
        });
    var n = 0,
        s = {};
    function l(e) {
        return e in s || (s[e] = h.getExtension(e)), s[e];
    }
    pdGL.Texture = function (e, t, i) {
        (i = i || {}),
            (n = n || h.getParameter(h.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),
            (this.width = pd.toInteger(e, 64)),
            (this.height = pd.toInteger(t, 64)),
            (this.unit = pd.toInteger(i.unit, 0)),
            (this.type = pd.toInteger(i.type, h.UNSIGNED_BYTE)),
            (this.format = pd.toInteger(i.format, h.RGBA)),
            this.type == h.FLOAT
                ? (l("OES_texture_float") || console.warn("ERROR: Device or browser does not support 'OES_texture_float'."), l("OES_texture_float_linear") || (i.filter = h.NEAREST))
                : this.type == h.HALF_FLOAT && (l("OES_texture_half_float") || console.warn("ERROR: Device or browser does not support 'OES_texture_half_float'."), l("OES_texture_half_float_linear") || (i.filter = h.NEAREST)),
            i.imageData || (i.imageData = null),
            (this.textureId = h.createTexture()),
            h.activeTexture(h.TEXTURE0 + this.unit),
            h.bindTexture(h.TEXTURE_2D, this.textureId),
            h.pixelStorei(h.UNPACK_FLIP_Y_WEBGL, !0),
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, i.filter || i.magFilter || h.LINEAR),
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, i.filter || i.minFilter || h.LINEAR),
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, i.wrap || i.wrapS || h.CLAMP_TO_EDGE),
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, i.wrap || i.wrapT || h.CLAMP_TO_EDGE),
            h.texImage2D(h.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, i.imageData),
            (this.bound = !1);
    };
    var d,
        v = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    pdGL.Texture.prototype = {
        _frameBuffer: null,
        _depthBuffer: null,
        _setUpFramebuffer: function (e) {
            var t = !1;
            return (
                h.viewport(0, 0, this.width, this.height),
                this._frameBuffer || ((this._frameBuffer = h.createFramebuffer()), (t = !0)),
                h.bindFramebuffer(h.FRAMEBUFFER, this._frameBuffer),
                h.framebufferTexture2D(h.FRAMEBUFFER, h.COLOR_ATTACHMENT0, h.TEXTURE_2D, this.textureId, 0),
                !1 !== e &&
                    (this._depthBuffer || (this._depthBuffer = h.createRenderbuffer()),
                    (e = this._depthBuffer),
                    h.bindRenderbuffer(h.RENDERBUFFER, e),
                    (this.width == e.width && this.height == e.height) || ((e.width = this.width), (e.height = this.height), h.renderbufferStorage(h.RENDERBUFFER, h.DEPTH_COMPONENT16, this.width, this.height)),
                    h.framebufferRenderbuffer(h.FRAMEBUFFER, h.DEPTH_ATTACHMENT, h.RENDERBUFFER, e)),
                t
            );
        },
        bind: function (e) {
            return (
                0 <= (e = e || this.unit || 0) && e < 16
                    ? v[e] != this.textureId && (h.activeTexture(h.TEXTURE0 + e), h.bindTexture(h.TEXTURE_2D, this.textureId), (v[e] = this.textureId))
                    : (h.activeTexture(h.TEXTURE0 + e), h.bindTexture(h.TEXTURE_2D, this.textureId)),
                (this.bound = !0),
                this
            );
        },
        unbind: function (e) {
            return (
                0 <= (e = e || this.unit || 0) && e < 16 ? v[e] == this.textureId && (h.activeTexture(h.TEXTURE0 + e), h.bindTexture(h.TEXTURE_2D, null), (v[e] = -1)) : (h.activeTexture(h.TEXTURE0 + e), h.bindTexture(h.TEXTURE_2D, null)),
                (this.bound = !1),
                this
            );
        },
        drawTo: function (e, t) {
            t = t || {};
            var i = h.getParameter(h.VIEWPORT);
            return this._setUpFramebuffer(t.depth), e && e(), h.bindFramebuffer(h.FRAMEBUFFER, null), h.bindRenderbuffer(h.RENDERBUFFER, null), h.viewport(i[0], i[1], i[2], i[3]), this;
        },
        drawToCanvas: function (e, t, i) {
            i = i || {};
            var n = h.getParameter(h.VIEWPORT);
            return (
                this._setUpFramebuffer(i.depth),
                t && t(),
                e &&
                    e.getContext &&
                    this._frameBuffer &&
                    ((i = new Uint8Array(this.width * this.height * 4)),
                    h.readPixels(0, 0, this.width, this.height, h.RGBA, h.UNSIGNED_BYTE, i),
                    (e = (t = e.getContext("2d")).createImageData(this.width, this.height)).data.set(i),
                    t.putImageData(e, 0, 0)),
                h.bindFramebuffer(h.FRAMEBUFFER, null),
                h.bindRenderbuffer(h.RENDERBUFFER, null),
                h.viewport(n[0], n[1], n[2], n[3]),
                this
            );
        },
        swapWith: function (e) {
            var t = e.textureId;
            return (e.textureId = this.textureId), (this.textureId = t), (t = e.width), (e.width = this.width), (this.width = t), (t = e.height), (e.height = this.height), (this.height = t), this;
        },
        destroy: function () {
            return (
                this._frameBuffer && (h.deleteFramebuffer(this._frameBuffer), (this._frameBuffer = null)),
                this._depthBuffer && (h.deleteRenderbuffer(this._depthBuffer), (this._depthBuffer = null)),
                this.unbind(),
                h.deleteTexture(this.textureId),
                this
            );
        },
    };
    var b = null;
    (pdGL.Texture.placeholder = function () {
        return (b = b || new pdGL.Texture(1, 1, { imageData: new Uint8Array([0, 0, 0, 0]) }));
    }),
        (pdGL.Texture.fromImage = function (e, t) {
            t = t || {};
            var i = new pdGL.Texture(e.width, e.height, t);
            try {
                h.texImage2D(h.TEXTURE_2D, 0, i.format, i.format, i.type, e);
            } catch (e) {
                throw "file:" == window.location.protocol
                    ? new Error('Image not loaded for security reasons (serve this page over "http://" instead)')
                    : new Error("Image not loaded for security reasons (image must originate from the same domain as this page or use Cross-Origin Resource Sharing)");
            }
            return t.minFilter && t.minFilter != h.NEAREST && t.minFilter != h.LINEAR && h.generateMipmap(h.TEXTURE_2D), i;
        }),
        (pdGL.Texture.fromCanvas = function (e, t) {
            e = e.getContext("2d");
            return pdGL.Texture.fromImage(e.canvas, t);
        }),
        (pdGL.Texture.fromURL = function (e, t) {
            d =
                d ||
                (function () {
                    var e = document.createElement("canvas").getContext("2d");
                    e.canvas.width = e.canvas.height = 128;
                    for (var t = 0; t < e.canvas.height; t += 16) for (var i = 0; i < e.canvas.width; i += 16) (e.fillStyle = 16 & (i ^ t) ? "#FFF" : "#DDD"), e.fillRect(i, t, 16, 16);
                    return e.canvas;
                })();
            var i = pdGL.Texture.fromImage(d, t),
                n = new Image(),
                s = h;
            return (
                (n.onload = function () {
                    s.makeCurrent(), pdGL.Texture.fromImage(n, t).swapWith(i);
                }),
                (n.src = e),
                i
            );
        }),
        (pdGL.Material = function (e) {
            (e = e || {}),
                pd3D.Material.call(this, e),
                (this._mode = pd.toInteger(e.mode, h.TRIANGLES)),
                (this._shader = e.shader || pdGL.Material.DefaultShader()),
                (this._shadowMap = e.shadowMap || null),
                (this._textureUnit = pd.toInteger(e.textureUnit, -1)),
                (this._texture = e.texture || null),
                (this._uniforms = e.uniforms || {}),
                (this._callbackOnDrawMesh = null),
                (this._cachedUniforms = null),
                (this._rendering = !1),
                this._shadowMap && (this._uniforms.shadowMap = 0),
                this._texture && (this._uniforms.texture = this._textureUnit);
        }),
        (pdGL.Material.prototype = Object.create(pd3D.Material.prototype)),
        (pdGL.Material.prototype.constructor = pdGL.Material),
        (pdGL.Material.prototype.shader = function (e) {
            return 0 == arguments.length ? this._shader : ((this._shader = e), this);
        }),
        (pdGL.Material.prototype.uniform = function (e, t) {
            if (1 == arguments.length) return this._uniforms[e];
            if (2 <= arguments.length && ((this._uniforms[e] = t), this._cachedUniforms)) {
                if (!this._shader) throw 'Attempted to set uniform "' + e + '" before assigning a valid shader.';
                var i = this._cachedUniforms[e];
                (this._cachedUniforms[e] = this._shader.createCachedUniform(e, t, i)), this._rendering && this._shader.setCachedUniformValue(this._cachedUniforms[e]);
            }
            return this;
        }),
        (pdGL.Material.prototype.uniforms = function (e) {
            return 0 == arguments.length ? this._uniforms : ((this._uniforms = e || {}), (this._cachedUniforms = null), this);
        }),
        (pdGL.Material.prototype.createUniformCache = function () {
            var e,
                t = {},
                i = this._uniforms,
                n = this._shader;
            for (e in i) i.hasOwnProperty(e) && (t[e] = n.createCachedUniform(e, i[e], t[e]));
            return (this._cachedUniforms = t), this;
        }),
        (pdGL.Material.prototype.getCachedUniform = function (e) {
            return this._cachedUniforms || this.createUniformCache(), this._cachedUniforms[e];
        }),
        (pdGL.Material.prototype.setCachedUniform = function (e, t) {
            return t && (this._cachedUniforms || this.createUniformCache(), (this._cachedUniforms[e] = t)), this;
        }),
        (pdGL.Material.prototype.setCachedUniforms = function (e) {
            var t,
                i = {},
                n = this._uniforms,
                s = this._shader;
            for (t in n) n.hasOwnProperty(t) && (t in e ? (i[t] = e[t]) : (i[t] = s.createCachedUniform(t, n[t])));
            return (this._cachedUniforms = i), this;
        }),
        (pdGL.Material.prototype.pushUniform = function (e, t) {
            return pdGL.Material.pushUniform(this, e, t), this;
        }),
        (pdGL.Material.prototype.popUniform = function () {
            return pdGL.Material.popUniform(), this;
        }),
        (pdGL.Material.prototype.texture = function (e, t) {
            return 0 == arguments.length ? this._texture : ((this._texture = e), (this._textureUnit = 0 < t ? t : 1), this._texture ? (this._uniforms.texture = this._textureUnit) : delete this._uniforms.texture, this);
        }),
        (pdGL.Material.prototype.shadowMap = function (e) {
            return 0 == arguments.length ? this._shadowMap : ((this._shadowMap = e), this._shadowMap ? (this._uniforms.shadowMap = 0) : delete this._uniforms.shadowMap, this);
        }),
        (pdGL.Material.prototype.mode = function (e) {
            return 0 == arguments.length ? this._mode : ((this._mode = e), this);
        });
    var y = -1;
    function S(e, t) {
        return (e = pd.toNumber(e, t)) < 0 ? t : e;
    }
    (pdGL.Material.prototype.isRendering = function () {
        return this._rendering;
    }),
        (pdGL.Material.prototype.startRender = function () {
            return (
                (g && g.id == this.id) ||
                    (g && g.endRender(),
                    this._shadowMap && this._shadowMap.bind(0),
                    0 < this._textureUnit && (this._texture || pdGL.Texture.placeholder()).bind(this._textureUnit),
                    this._cachedUniforms || this.createUniformCache(),
                    this._shader.setCachedUniformValues(this._cachedUniforms),
                    this._shader.prepareMatrices(),
                    (this._rendering = !0),
                    (g = this)),
                this
            );
        }),
        (pdGL.Material.prototype.endRender = function () {
            return (g = null), (this._rendering = !1), this;
        }),
        (pdGL.Material.prototype.unbindTextures = function () {
            return this._texture && this._texture.unbind(this._textureUnit), this._shadowMap && this._shadowMap.unbind(0), this;
        }),
        (pdGL.Material.prototype._renderMesh = function (e, t, i) {
            return (
                (i = i || pdGL.Shader.getIndexBufferName(t)),
                e.checkToCompile(),
                this._callbackOnDrawMesh && this._callbackOnDrawMesh(e, t),
                t >= h.TRIANGLES && null != e.twoSided && h.setCullFace(!e.twoSided),
                e.callbackOnDraw && e.callbackOnDraw(e, t, this),
                this._shader.renderPrimitive(e.vertexBuffers, e.indexBuffers[i], t),
                0 < y && ((y = -1), h.popLineWidth()),
                this
            );
        }),
        (pdGL.Material.prototype.renderMeshes = function (e, t) {
            if (this._shader && e) {
                var i,
                    n,
                    s,
                    a = pd.isArray(e) ? e : [e];
                if ((this._rendering || this.startRender(), this._cachedUniforms || (this.createUniformCache(), this._shader.setCachedUniformValues(this._cachedUniforms)), t === pd3D.RENDER_ALL && (t = p), pd.isArray(t))) {
                    for (var r = t, o = 0, l = a.length; o < l; ++o)
                        if ((i = a[o]) && i.visible) for (var d = 0; d < r.length; ++d) (t = S(r[d], this._mode)), (n = i[(s = pdGL.Shader.getIndexBufferName(t))]), (!t || (n && n.length)) && this._renderMesh(i, t, s);
                } else {
                    (t = S(t, this._mode)), (s = pdGL.Shader.getIndexBufferName(t));
                    for (o = 0, l = a.length; o < l; ++o) (n = (i = a[o])[s]), i && i.visible && (!t || (n && n.length)) && this._renderMesh(i, t, s);
                }
                h.setCullFace();
            }
            return this;
        }),
        (pdGL.Material.prototype.renderSurfaces = function (e) {
            return this.renderMeshes(e, h.TRIANGLES);
        }),
        (pdGL.Material.prototype.renderOutlines = function (e) {
            return this.renderMeshes(e, h.LINES);
        }),
        (pdGL.Material.prototype.renderPoints = function (e) {
            return this.renderMeshes(e, h.POINTS);
        }),
        (pdGL.Material.prototype.renderNode3D = function (e, t) {
            if ((this.startRender(), pd.isArray(e))) for (var i = 0, n = e.length; i < n; ++i) e[i].drawWithMaterial(this, t);
            else e.drawWithMaterial(this, t);
            return this.endRender(), this;
        }),
        (pdGL.Material.prototype.draw = function (e, t) {
            return this._shader && e && (this.startRender(), this.renderMeshes(e, t), this.endRender()), this;
        }),
        (pdGL.Material.prototype.drawSurface = function (e) {
            return this.draw(e, h.TRIANGLES);
        }),
        (pdGL.Material.prototype.drawOutline = function (e) {
            return this.draw(e, h.LINES);
        }),
        (pdGL.Material.prototype.drawPoints = function (e) {
            return this.draw(e, h.POINTS);
        }),
        (pdGL.Material.prototype.drawAll = function (e) {
            return this.draw(e, pd3D.RENDER_ALL);
        });
    var M = [];
    function w(e, t) {
        for (var i = e.length, n = "", s = 0; s < i; ++s) e[s].vertHead && (n += e[s].vertHead);
        for (n += pdGL.ShaderComponent.mainFunc + pdGL.ShaderComponent.position.vertMain, s = 0; s < i; ++s) e[s].vertMain && (n += e[s].vertMain);
        n += pdGL.ShaderComponent.endFunc;
        var a = "";
        for (s = 0; s < i; ++s) e[s].fragHead && (a += e[s].fragHead);
        for (a += pdGL.ShaderComponent.mainFunc, s = 0; s < i; ++s) e[s].fragMain && (a += e[s].fragMain);
        if (t && t.length) for (s = 0, i = t.length; s < i; ++s) t[s].fragColor && (a += t[s].fragColor);
        else for (s = 0; s < i; ++s) e[s].fragColor && (a += e[s].fragColor);
        return (a += pdGL.ShaderComponent.endFunc), new pdGL.Shader(n, a);
    }
    function L(e, t) {
        this._shader.uniforms({ color: t < h.TRIANGLES ? e.defaultLineColor : e.defaultColor, useVertexColors: !(!e || !e.hasVertexColors) });
    }
    function D(e, t) {
        this._shader.uniforms({ useTexture: !(!this._texture || !e.coords), color: t < h.TRIANGLES ? e.defaultLineColor : e.defaultColor, useVertexColors: !(!e || !e.hasVertexColors) });
    }
    function T(e) {
        e && ((e.uniforms = e.uniforms || {}), (e.uniforms.opacityThreshold = pd.constrainTo(pd.toNumber(e.uniforms.opacityThreshold, 1e-4), 0, 1)));
    }
    (pdGL.Material.pushUniform = function (e, t, i) {
        var n = {},
            s = e._uniforms;
        s.hasOwnProperty(t) &&
            s[t] != i &&
            ((n.material = e),
            (n.old_value = s[t]),
            (n.old_cache = null),
            (n.name = t),
            e._cachedUniforms &&
                (e._cachedUniforms.hasOwnProperty(t)
                    ? ((s = e._cachedUniforms[t]), (n.old_cache = { name: s.name, value: s.value, method: s.method, isMatrix: s.isMatrix, stale: s.stale }))
                    : (n.old_cache = e._shader.createCachedUniform(t, n.old_value))),
            e.uniform(t, i)),
            M.push(n);
    }),
        (pdGL.Material.popUniform = function () {
            var e, t;
            0 < M.length &&
                (t = (e = M.pop()).material) &&
                t._uniforms.hasOwnProperty(e.name) &&
                ((t._uniforms[e.name] = e.old_value), t._cachedUniforms && e.old_cache && ((t._cachedUniforms[e.name] = e.old_cache), t._rendering && t._shader.setCachedUniformValue(e.old_cache)));
        }),
        (pdGL.ShaderComponent = {
            mainFunc: "\nvoid main() {\n",
            endFunc: "\n}\n",
            position: { vertHead: "", vertMain: "\n    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\n", fragHead: "", fragMain: "" },
            POINT_SIZE_UNIFORM: {
                vertHead: "\nuniform float pointSize;\n",
                vertMain: "\n    gl_PointSize = pointSize;\n",
                fragHead: "",
                fragMain: "",
                checkUniforms: function (e) {
                    (e.uniforms = e.uniforms || {}), (e.uniforms.pointSize = pd.toNumber(e.uniforms.pointSize, 1));
                },
            },
            POINT_SIZE_ATTRIBUTE: { vertHead: "\nattribute float pointSize;\n", vertMain: "\n    gl_PointSize = pointSize;\n", fragHead: "", fragMain: "" },
            COLOR_UNIFORM: {
                vertHead: "",
                vertMain: "",
                fragHead: "\nuniform vec4 color;\nuniform float opacity;\n",
                fragMain: "\n    float alpha = clamp(opacity * color.a, 0.0, 1.0);\n    gl_FragColor = vec4(color.rgb, alpha);\n    if (alpha < 0.001)\n        discard;\n",
                checkUniforms: function (e) {
                    (e.uniforms = e.uniforms || {}), (e.uniforms.color = e.uniforms.color || [1, 1, 1, 1]), (e.uniforms.opacity = pd.toNumber(e.uniforms.opacity, 1));
                },
            },
            COLOR_ATTRIBUTE: {
                vertHead: "\nuniform vec4 color;\nuniform bool useVertexColors;\nvarying vec4 vColor;\n",
                vertMain: "\n    vColor = (useVertexColors == true) ? gl_Color : color;\n",
                fragHead: "\nuniform float opacity;\nvarying vec4 vColor;\n",
                fragMain: "\n    float alpha = clamp(opacity * vColor.a, 0.0, 1.0);\n    gl_FragColor = vec4(vColor.rgb, alpha);\n    if (alpha < 0.001)\n        discard;\n",
                checkUniforms: function (e) {
                    (e.uniforms = e.uniforms || {}), (e.uniforms.color = e.uniforms.color || [1, 1, 1, 1]), (e.uniforms.opacity = pd.toNumber(e.uniforms.opacity, 1)), (e.useMeshColors = !0);
                },
            },
            COLOR_BLINNPHONG: {
                vertHead: "\nuniform vec4 color;\nuniform bool useVertexColors;\nuniform vec3 sunPosition;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\nvarying vec3 vLight;\nvarying vec4 vColor;\n",
                vertMain:
                    "\n    vColor = (useVertexColors == true) ? gl_Color : color;\n    vec4 vtx = gl_ModelViewMatrix * gl_Vertex;\n    vVertex = vec3(vtx) / vtx.w;\n    vNormal = gl_NormalMatrix * gl_Normal;\n    vLight = sunPosition - vVertex;\n",
                fragHead:
                    "\nuniform float opacity;\nuniform float shininess;\nuniform float sunIntensity;\nuniform vec3 specularColor;\nuniform vec3 ambientColor;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\nvarying vec3 vLight;\nvarying vec4 vColor;\n",
                fragMain:
                    "\n    float intensity = sunIntensity;\n    float specularCoefficient = 0.0;\n    vec3 normal = normalize(vNormal);\n    vec3 lightDir = normalize(vLight);\n    float alpha = clamp(opacity * vColor.a, 0.0, 1.0);\n    float diffuseCoefficient = max(0.0, dot(lightDir, normal));\n    if (diffuseCoefficient > 0.0) {\n        vec3 viewDir = normalize(-vVertex);\n        vec3 halfDir = normalize(lightDir + viewDir);\n        float specAngle = max(dot(normal, halfDir), 0.0);\n        specularCoefficient = pow(specAngle, shininess);\n    }\n\n    vec3 diffuse = (diffuseCoefficient * vColor.rgb);\n    vec3 specular = (specularCoefficient * specularColor);\n    vec3 ambient = (ambientColor * vColor.rgb);\n",
                fragColor: "\n    vec3 color = clamp(ambient + (intensity * (diffuse + specular)), 0.0, 1.0);\n\n    gl_FragColor = vec4(color, alpha);\n    if (alpha < 0.001) {\n        discard;\n    }\n",
                checkUniforms: function (e) {
                    (e.uniforms = e.uniforms || {}),
                        (e.uniforms.sunPosition = e.uniforms.sunPosition || [1, 1, 1]),
                        (e.uniforms.ambientColor = e.uniforms.ambientColor || [0.75, 0.75, 0.75]),
                        (e.uniforms.specularColor = e.uniforms.specularColor || [0.85, 0.85, 0.85]),
                        (e.uniforms.sunIntensity = pd.toNumber(e.uniforms.sunIntensity, 1)),
                        (e.uniforms.shininess = pd.toNumber(e.uniforms.shininess, 75)),
                        (e.uniforms.opacity = pd.toNumber(e.uniforms.opacity, 1)),
                        (e.useMeshColors = !0);
                },
            },
            SHADOW_MAP: {
                vertHead: "\nuniform mat4 shadowMatrix;\nvarying vec4 vCoords;\n",
                vertMain: "\n    vCoords = shadowMatrix * gl_Position;\n",
                fragHead: "\nuniform vec3 shadowColor;\nuniform sampler2D shadowMap;\nuniform float shadowOpacity;\nvarying vec4 vCoords;\n",
                fragMain:
                    "\n    if (diffuseCoefficient > 0.0) {\n        if (vCoords.w > 0.0) {\n            float depth = 0.0;\n            vec2 sample = ((vCoords.xy / vCoords.w) * 0.5) + 0.5;\n            if (clamp(sample, 0.0, 1.0) == sample) {\n                float sampleDepth = texture2D(shadowMap, sample).r;\n                depth = (sampleDepth == 1.0) ? 1.0e12 : sampleDepth;\n            }\n            if (depth > 0.0) {\n                float shading = clamp(300.0 * (-0.002 + ((vCoords.z / vCoords.w) * 0.5) + 0.5 - depth), 0.0, 1.0);\n                if (length(shadowColor) > 0.01) {\n                    float mix_factor = intensity * shading * ((shadowOpacity > 0.0) ? shadowOpacity : 0.5);\n                    specular = mix(specular, shadowColor, mix_factor);\n                    diffuse = mix(diffuse, shadowColor, mix_factor);\n                    ambient = mix(ambient, shadowColor, mix_factor);\n                }\n                intensity *= (1.0 - shading);\n                if (shadowOpacity > 0.0) {\n                    alpha = max(alpha, min(shadowOpacity * shading, sunIntensity));\n                }\n            }\n        }\n    } else {\n        intensity = 0.0;\n    }\n",
                checkUniforms: function (e) {
                    (e.uniforms = e.uniforms || {}),
                        (e.uniforms.shadowColor = e.uniforms.shadowColor || [0, 0, 0]),
                        (e.uniforms.shadowOpacity = pd.toNumber(e.uniforms.shadowOpacity, -1)),
                        (e.uniforms.shadowMatrix = e.uniforms.shadowMatrix || null);
                },
            },
            TEXTURE: {
                vertHead: "\nvarying vec4 vTexCoords;\n",
                vertMain: "\n    vTexCoords = gl_TexCoord;\n",
                fragHead: "\nuniform sampler2D texture;\nuniform float opacityThreshold;\nvarying vec4 vTexCoords;\n",
                fragMain: "",
                fragColor: "\n    gl_FragColor *= (alpha * texture2D(texture, vTexCoords.xy));\n    if (gl_FragColor.a < opacityThreshold) discard;\n",
                checkUniforms: function (e) {
                    e.useTexture = !0;
                },
            },
        }),
        (pdGL.Material.compose = function (e, t, i) {
            (e = e || {}).shader || (e.shader = w(t, i));
            for (var n = 0, s = t.length; n < s; ++n) t[n].checkUniforms && t[n].checkUniforms(e);
            i = new pdGL.Material(e);
            return e.callback ? (i._callbackOnDrawMesh = e.callback) : e.useMeshColors && (e.useTexture ? (i._callbackOnDrawMesh = D) : (i._callbackOnDrawMesh = L)), i;
        });
    var E = null;
    pdGL.Material.FixedColorVariablePointSize = function (e) {
        ((e = e || {}).uniforms = e.uniforms || {}), (e.uniforms.color = e.uniforms.color || [0.5, 0.5, 0.5, 1]), (e.name = e.name || "FixedColorVariablePointSize"), (e.mode = pd.toInteger(e.mode, h.POINTS)), (e.shader = E);
        e = pdGL.Material.compose(e, [pdGL.ShaderComponent.POINT_SIZE_ATTRIBUTE, pdGL.ShaderComponent.COLOR_UNIFORM]);
        return (E = E || e._shader), e;
    };
    var A = null;
    pdGL.Material.FixedColorUniformPointSize = function (e) {
        ((e = e || {}).uniforms = e.uniforms || {}), (e.uniforms.color = e.uniforms.color || [0.2, 0.2, 0.2, 1]), (e.name = e.name || "FixedColorUniformPointSize"), (e.shader = A);
        e = pdGL.Material.compose(e, [pdGL.ShaderComponent.POINT_SIZE_UNIFORM, pdGL.ShaderComponent.COLOR_UNIFORM]);
        return (A = A || e._shader), e;
    };
    var P = null;
    pdGL.Material.TexturedFixedColorUniformPointSize = function (e) {
        T((e = e || {})), (e.uniforms.color = e.uniforms.color || [0.2, 0.2, 0.2, 1]), (e.name = e.name || "TexturedFixedColorUniformPointSize"), (e.shader = P), (e.uniforms.useTexture = !0);
        e = pdGL.Material.compose(e, [pdGL.ShaderComponent.COLOR_UNIFORM, pdGL.ShaderComponent.TEXTURE]);
        return (P = P || e._shader), e;
    };
    var C = null;
    pdGL.Material.VariableColorUniformPointSize = function (e) {
        ((e = e || {}).uniforms = e.uniforms || {}), (e.uniforms.color = e.uniforms.color || [0, 0, 0, 1]), (e.name = e.name || "VariableColorUniformPointSize"), (e.shader = C);
        e = pdGL.Material.compose(e, [pdGL.ShaderComponent.POINT_SIZE_UNIFORM, pdGL.ShaderComponent.COLOR_ATTRIBUTE]);
        return (C = C || e._shader), e;
    };
    var O = null;
    pdGL.Material.TexturedVariableColorUniformPointSize = function (e) {
        T((e = e || {})), (e.uniforms.color = e.uniforms.color || [0, 0, 0, 1]), (e.name = e.name || "TexturedVariableColorUniformPointSize"), (e.shader = O);
        e = pdGL.Material.compose(e, [pdGL.ShaderComponent.COLOR_ATTRIBUTE, pdGL.ShaderComponent.TEXTURE]);
        return (O = O || e._shader), e;
    };
    var N = null;
    (pdGL.Material.DefaultShader = function () {
        return null == N && (N = w([pdGL.ShaderComponent.COLOR_BLINNPHONG])), N;
    }),
        (pdGL.Material.BlinnPhongColor = function (e) {
            ((e = e || {}).name = e.name || "BlinnPhongColor"), (e.shader = N);
            e = pdGL.Material.compose(e, [pdGL.ShaderComponent.COLOR_BLINNPHONG]);
            return (N = N || e._shader), e;
        });
    var G = null;
    pdGL.Material.TexturedBlinnPhongColor = function (e) {
        T((e = e || {})), (e.name = e.name || "TexturedBlinnPhongColor"), (e.shader = G);
        e = pdGL.Material.compose(e, [pdGL.ShaderComponent.COLOR_BLINNPHONG, pdGL.ShaderComponent.TEXTURE]);
        return (G = G || e._shader), e;
    };
    var R = null;
    pdGL.Material.BlinnPhongColorShadow = function (e) {
        ((e = e || {}).name = e.name || "BlinnPhongColorShadow"), (e.shader = R);
        e = pdGL.Material.compose(e, [pdGL.ShaderComponent.COLOR_BLINNPHONG, pdGL.ShaderComponent.SHADOW_MAP]);
        return (R = R || e._shader), e;
    };
    var I = null;
    pdGL.Material.TexturedBlinnPhongColorShadow = function (e) {
        T((e = e || {})), (e.name = e.name || "TexturedBlinnPhongColorShadow"), (e.shader = I);
        e = pdGL.Material.compose(e, [pdGL.ShaderComponent.COLOR_BLINNPHONG, pdGL.ShaderComponent.SHADOW_MAP, pdGL.ShaderComponent.TEXTURE]);
        return (I = I || e._shader), e;
    };
    var k = null;
    function V(e, t, i) {
        for (var n; null !== (n = e.exec(t)); ) i(n);
    }
    (pdGL.Material.DepthMapShader = function (e) {
        return (
            ((e = e || {}).name = e.name || "DepthMapShader"),
            (e.shader =
                (null == k &&
                    (k = new pdGL.Shader(
                        "varying vec4 vWorldPosition;\nvoid main() {\n    gl_Position = vWorldPosition = gl_ModelViewProjectionMatrix * gl_Vertex;\n}\n",
                        "varying vec4 vWorldPosition;\nvoid main() {\n    float depth = vWorldPosition.z / vWorldPosition.w;\n    gl_FragColor = vec4(depth * 0.5 + 0.5);\n}\n"
                    )),
                k)),
            new pdGL.Material(e)
        );
    }),
        (pdGL.Material.BlinnPhongWithGrid = function (e) {
            (e = e || {}).name = e.name || "BlinnPhongWithGrid" + (e.useShadowMap ? "WithShadows" : "");
            var t = {
                    vertHead: "\nvarying vec3 vNrm;\nvarying float vDist;\nvarying vec3 vPos;\n",
                    vertMain: "\n    vNrm = gl_Normal.xyz;\n    vDist = gl_Position.w;\n    vPos = gl_Vertex.xyz;\n",
                    fragHead:
                        "\nuniform float modelSize;\nuniform float gridMinor;\nuniform float gridMajor;\nuniform vec4 gridColor;\n\nvarying vec3 vNrm;\nvarying float vDist;\nvarying vec3 vPos;\n\nfloat lineWidth = 0.0;\n\nfloat map(float value, float from1, float to1, float from2, float to2) {\n    float v = ((value - from1) / (to1 - from1) * (to2 - from2)) + from2;\n    return clamp(v, from2, to2);\n}\n\nfloat gridEffect(float nrm_1, float pos_1, float nrm_2, float pos_2) {\n    float grid1 = 2.5 * (1.0 - abs(nrm_1)) * (mod(pos_1, gridMinor) / lineWidth);\n    float grid2 = 2.5 * (1.0 - abs(nrm_2)) * (mod(pos_2, gridMinor) / lineWidth);\n    float grid3 = (1.0 - abs(nrm_1)) * (mod(pos_1, gridMajor) / lineWidth);\n    float grid4 = (1.0 - abs(nrm_2)) * (mod(pos_2, gridMajor) / lineWidth);\n    float g_max = min(max(grid1, grid2), max(grid3, grid4));\n    return (g_max > 0.99) ? 0.0 : clamp(1.0 - (g_max * g_max), 0.0, 1.0);\n}\n\nfloat gridFactor(in vec3 nrm, in vec3 pos) {\n    float _xy = gridEffect(nrm.x, pos.x, nrm.y, pos.y);\n    float _yz = gridEffect(nrm.y, pos.y, nrm.z, pos.z);\n    float _xz = gridEffect(nrm.x, pos.x, nrm.z, pos.z);\n    _xy = (abs(nrm.z) > 0.5) ? 0.0 : _xy;\n    _yz = (abs(nrm.x) > 0.5) ? 0.0 : _yz;\n    _xz = (abs(nrm.y) > 0.5) ? 0.0 : _xz;\n    return max(_xy, max(_yz, _xz));\n}\n",
                    fragMain: "",
                    fragColor:
                        "\n    lineWidth = 0.00175 * vDist;\n    float grid_factor = gridColor.a * gridFactor(vNrm, vPos);\n    grid_factor = map(lineWidth, modelSize, 0.0, 0.0, grid_factor);\n    color = mix(color, gridColor.xyz, grid_factor);\n    gl_FragColor = vec4(color, alpha);\n",
                    checkUniforms: function (e) {
                        (e.uniforms = e.uniforms || {}),
                            (e.uniforms.modelSize = e.uniforms.modelSize || 1),
                            (e.uniforms.gridMajor = e.uniforms.gridMajor || 1e3),
                            (e.uniforms.gridMinor = e.uniforms.gridMinor || 200),
                            pd.isArray(e.uniforms.gridColor) ? e.uniforms.gridColor.length < 4 && (e.uniforms.gridColor[3] = 1) : (e.uniforms.gridColor = [0, 0, 0, 1]);
                    },
                },
                i = [pdGL.ShaderComponent.COLOR_BLINNPHONG];
            return e.useShadowMap && i.push(pdGL.ShaderComponent.SHADOW_MAP), i.push(t), pdGL.Material.compose(e, i);
        }),
        (pdGL.Material.RectangularBlockWithGrid = function (e) {
            e = e || {};
            var t = [pdGL.ShaderComponent.COLOR_BLINNPHONG];
            return (
                e.useShadowMap && t.push(pdGL.ShaderComponent.SHADOW_MAP),
                t.push({
                    vertHead: "\nvarying vec3 vNrm;\nvarying vec3 vPos;\n",
                    vertMain: "\n    vNrm = gl_Normal.xyz;\n    vPos = gl_Vertex.xyz;\n",
                    fragHead:
                        "\nuniform float lineWidth;\nuniform float edgeEffect;\nuniform float gridMinor;\nuniform float gridMajor;\nuniform vec3 gridColor;\n\nvarying vec3 vNrm;\nvarying vec3 vPos;\n\nconst vec3 darkColor = vec3(0.0, 0.0, 0.0);\n\nfloat gridEffect(float nrm_1, float pos_1, float nrm_2, float pos_2) {\n    float grid1 = 2.5 * (1.0 - abs(nrm_1)) * (mod(pos_1, gridMinor) / lineWidth);\n    float grid2 = 2.5 * (1.0 - abs(nrm_2)) * (mod(pos_2, gridMinor) / lineWidth);\n    float grid3 = (1.0 - abs(nrm_1)) * (mod(pos_1, gridMajor) / lineWidth);\n    float grid4 = (1.0 - abs(nrm_2)) * (mod(pos_2, gridMajor) / lineWidth);\n    float g_max = min(max(grid1, grid2), max(grid3, grid4));\n    return (g_max > 0.95) ? 0.0 : clamp(1.0 - g_max, 0.0, 1.0);\n}\n\nfloat gridFactor(in vec3 nrm, in vec3 pos) {\n    float _xy = gridEffect(nrm.x, pos.x, nrm.y, pos.y);\n    float _yz = gridEffect(nrm.y, pos.y, nrm.z, pos.z);\n    float _xz = gridEffect(nrm.x, pos.x, nrm.z, pos.z);\n    _xy = (abs(nrm.z) > 0.5) ? 0.0 : _xy;\n    _yz = (abs(nrm.x) > 0.5) ? 0.0 : _yz;\n    _xz = (abs(nrm.y) > 0.5) ? 0.0 : _xz;\n    return max(_xy, max(_yz, _xz));\n}\n",
                    fragMain: "\n    float darken = 0.0;\n    if ((abs(vNrm.z) < 0.5) || (abs(vPos.z) > edgeEffect)) {\n        darken = 1.0 - clamp(vPos.z / edgeEffect, 0.0, 1.0);\n    }\n",
                    fragColor:
                        "\n    color = mix(color, darkColor, 0.35 * (1.0 - (0.5 * ambientColor)) * darken * darken);\n    float grid_factor = (lineWidth > 1e-3) ? 0.35 * gridFactor(vNrm, vPos) : 0.0;\n    color = mix(color, gridColor, grid_factor);\n    gl_FragColor = vec4(color, alpha);\n",
                    checkUniforms: function (e) {
                        (e.uniforms = e.uniforms || {}),
                            (e.uniforms.lineWidth = e.uniforms.lineWidth || 1),
                            (e.uniforms.edgeEffect = e.uniforms.edgeEffect || 1e3),
                            (e.uniforms.gridColor = e.uniforms.gridColor || [0, 0, 0]),
                            (e.uniforms.gridMajor = e.uniforms.gridMajor || 1e3),
                            (e.uniforms.gridMinor = e.uniforms.gridMinor || 200);
                    },
                }),
                pdGL.Material.compose(e, t)
            );
        }),
        (pd3D.Node.prototype.drawWithMaterial = function (e, t) {
            if (this.visible && e) {
                for (var i in (this.callbackOnDraw && this.callbackOnDraw(this, t, e), this.transformMatrix && (h.pushMatrix(), h.multMatrix(this.transformMatrix), e._rendering && e._shader.prepareMatrices()), this.geometry))
                    this.geometry.hasOwnProperty(i) && e.renderMeshes(this.geometry[i].meshes, t);
                for (var n, s = 0, a = this.children.length; s < a; ++s) (n = this.children[s]) && n.drawWithMaterial && n.drawWithMaterial(e, t);
                this.transformMatrix && h.popMatrix();
            }
            return this;
        }),
        (pd3D.Node.prototype._render = function (e) {
            for (var t in (this.callbackOnDraw && this.callbackOnDraw(this, e), this.transformMatrix && (h.pushMatrix(), h.multMatrix(this.transformMatrix)), this.geometry)) {
                var i;
                this.geometry.hasOwnProperty(t) && (i = this.geometry[t]).material.draw(i.meshes, e);
            }
            for (var n, s = 0, a = this.children.length; s < a; ++s) (n = this.children[s]) && n.draw && n.draw(e);
            return this.callbackOnAfterDraw && this.callbackOnAfterDraw(this, e), this.transformMatrix && h.popMatrix(), this;
        }),
        (pd3D.Node.prototype.drawOutlines = function (e) {
            return e ? this.drawWithMaterial(e, h.LINES) : this.visible && this._render(h.LINES), this;
        }),
        (pd3D.Node.prototype.drawSurfaces = function (e) {
            return e ? this.drawWithMaterial(e, h.TRIANGLES) : this.visible && this._render(h.TRIANGLES), this;
        }),
        (pd3D.Node.prototype.draw = function (e) {
            return this.visible && this._render(e), this;
        }),
        (pdGL.CachedUniform = function (e) {
            (e = e || {}), (this.name = e.name || ""), (this.value = e.value || null), (this.method = e.method || null), (this.isMatrix = pd.toBoolean(e.isMatrix, !1)), (this.stale = pd.toBoolean(e.stale, !0));
        }),
        (pdGL.CachedUniform.createOrUpdate = function (e, t, i) {
            if ((((i = i || new pdGL.CachedUniform()).stale = !0), (i.name = e), t instanceof pd3D.Vector ? (t = [t.x, t.y, t.z]) : t instanceof pd3D.Matrix && (t = t.m), o(t)))
                switch (t.length) {
                    case 1:
                        (i.method = h.uniform1fv), (i.value = new Float32Array(t));
                        break;
                    case 2:
                        (i.method = h.uniform2fv), (i.value = new Float32Array(t));
                        break;
                    case 3:
                        (i.method = h.uniform3fv), (i.value = new Float32Array(t));
                        break;
                    case 4:
                        (i.method = h.uniform4fv), (i.value = new Float32Array(t));
                        break;
                    case 9:
                        (i.isMatrix = !0), (i.method = h.uniformMatrix3fv), (i.value = new Float32Array([t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]]));
                        break;
                    case 16:
                        (i.isMatrix = !0), (i.method = h.uniformMatrix4fv), (i.value = new Float32Array([t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]]));
                        break;
                    default:
                        throw 'Cannot pre-process uniform "' + e + '" of length ' + t.length;
                }
            else if ("boolean" == typeof t) (i.method = h.uniform1i), (i.value = !0 === t ? 1 : 0);
            else {
                if (!pd.isNumeric(t)) throw 'Attempted to set uniform "' + e + '" to invalid value ' + t;
                (i.method = h.uniform1f), (i.value = t);
            }
            return i;
        }),
        (pdGL.CachedUniform.createOrUpdateTexture = function (e, t, i) {
            return ((i = i || new pdGL.CachedUniform()).name = e), (i.value = pd.toInteger(t, 1)), (i.method = h.uniform1i), (i.isMatrix = !1), (i.stale = !0), i;
        });
    var B = "pd_web",
        U = -1;
    (pdGL.Shader = function (e, t) {
        var i = this;
        function n(e) {
            if (/\s/.test(e)) return e;
            var t = document.getElementById(e);
            return t ? t.text : e;
        }
        (e = n(e)), (t = n(t));
        var s =
            "uniform mat3 gl_NormalMatrix;\nuniform mat4 gl_ModelViewMatrix;\nuniform mat4 gl_ProjectionMatrix;\nuniform mat4 gl_ModelViewProjectionMatrix;\nuniform mat4 gl_ModelViewMatrixInverse;\nuniform mat4 gl_ProjectionMatrixInverse;\nuniform mat4 gl_ModelViewProjectionMatrixInverse;\n";
        this.usedMatrices = {};
        var a = e + t;
        function r(e, t) {
            var i = {},
                n = /^((\s*\/\/.*\n|\s*#extension.*\n)+)\^*$/.exec(t);
            return (
                (t = n ? n[1] + e + t.substr(n[1].length) : e + t),
                V(/\bgl_\w+\b/g, e, function (e) {
                    e in i || ((t = t.replace(new RegExp("\\b" + e + "\\b", "g"), B + e)), (i[e] = !0));
                }),
                t
            );
        }
        function o(e, t) {
            e = h.createShader(e);
            if ((h.shaderSource(e, t), h.compileShader(e), !h.getShaderParameter(e, h.COMPILE_STATUS))) throw new Error("compile error: " + h.getShaderInfoLog(e));
            return e;
        }
        if (
            (V(/\b(gl_[^;]*)\b;/g, s, function (e) {
                var t = e[1];
                -1 != a.indexOf(t) && ((e = t.replace(/[a-z_]/g, "")), (i.usedMatrices[e] = B + t));
            }),
            (e = r(
                "uniform mat3 gl_NormalMatrix;\nuniform mat4 gl_ModelViewMatrix;\nuniform mat4 gl_ProjectionMatrix;\nuniform mat4 gl_ModelViewProjectionMatrix;\nuniform mat4 gl_ModelViewMatrixInverse;\nuniform mat4 gl_ProjectionMatrixInverse;\nuniform mat4 gl_ModelViewProjectionMatrixInverse;\nattribute vec4 gl_Vertex;\nattribute vec4 gl_TexCoord;\nattribute vec3 gl_Normal;\nattribute vec4 gl_Color;\n",
                e
            )),
            (t = r(
                "precision highp float;\nuniform mat3 gl_NormalMatrix;\nuniform mat4 gl_ModelViewMatrix;\nuniform mat4 gl_ProjectionMatrix;\nuniform mat4 gl_ModelViewProjectionMatrix;\nuniform mat4 gl_ModelViewMatrixInverse;\nuniform mat4 gl_ProjectionMatrixInverse;\nuniform mat4 gl_ModelViewProjectionMatrixInverse;\n",
                t
            )),
            (this.attributes = {}),
            (this.uniformLocations = {}),
            (this.program = h.createProgram()),
            h.attachShader(this.program, o(h.VERTEX_SHADER, e)),
            h.attachShader(this.program, o(h.FRAGMENT_SHADER, t)),
            h.bindAttribLocation(this.program, 0, B + "gl_Vertex"),
            (this.attributes.gl_Vertex = 0),
            h.linkProgram(this.program),
            !h.getProgramParameter(this.program, h.LINK_STATUS))
        )
            throw "link error: " + h.getProgramInfoLog(this.program);
        (this.isSampler = {}),
            V(/uniform\s+sampler(1D|2D|3D|Cube)\s+(\w+)\s*;/g, e + t, function (e) {
                i.isSampler[e[2]] = 1;
            });
    }),
        (pdGL.Shader.prototype = {
            makeCurrent: function () {
                return U != this.program && ((U = this.program), h.useProgram(this.program)), this;
            },
            createCachedUniform: function (e, t, i) {
                return pd.isInteger(t) && this.isSampler[e] ? pdGL.CachedUniform.createOrUpdateTexture(e, t, i) : pdGL.CachedUniform.createOrUpdate(e, t, i);
            },
            setCachedUniformValue: function (e) {
                var t = e.name,
                    i = this.uniformLocations[t];
                return i || ((i = h.getUniformLocation(this.program, t)), (this.uniformLocations[t] = i)), i && (e.isMatrix ? e.method.call(h, i, !1, e.value) : e.method.call(h, i, e.value)), (e.stale = !1), this;
            },
            setCachedUniformValues: function (e) {
                for (var t in (this.makeCurrent(), e)) this.setCachedUniformValue(e[t]);
                return this;
            },
            uniforms: function (e) {
                for (var t in (this.makeCurrent(), e)) {
                    var i = this.uniformLocations[t];
                    if ((i || ((i = h.getUniformLocation(this.program, t)), (this.uniformLocations[t] = i)), i)) {
                        var n = e[t];
                        if (("function" == typeof n && (n = n()), n instanceof pd3D.Vector ? (n = [n.x, n.y, n.z]) : n instanceof pd3D.Matrix && (n = n.m), o(n)))
                            switch (n.length) {
                                case 1:
                                    h.uniform1fv(i, new Float32Array(n));
                                    break;
                                case 2:
                                    h.uniform2fv(i, new Float32Array(n));
                                    break;
                                case 3:
                                    h.uniform3fv(i, new Float32Array(n));
                                    break;
                                case 4:
                                    h.uniform4fv(i, new Float32Array(n));
                                    break;
                                case 9:
                                    h.uniformMatrix3fv(i, !1, new Float32Array([n[0], n[3], n[6], n[1], n[4], n[7], n[2], n[5], n[8]]));
                                    break;
                                case 16:
                                    h.uniformMatrix4fv(i, !1, new Float32Array([n[0], n[4], n[8], n[12], n[1], n[5], n[9], n[13], n[2], n[6], n[10], n[14], n[3], n[7], n[11], n[15]]));
                                    break;
                                default:
                                    throw "don't know how to load array uniform \"" + t + '" of length ' + n.length;
                            }
                        else if ("boolean" == typeof n) h.uniform1i(i, !0 === n ? 1 : 0);
                        else {
                            if (((s = n), "[object Number]" != (s = Object.prototype.toString.call(s)) && "[object Boolean]" != s)) throw 'attempted to set uniform "' + t + '" to invalid value ' + n;
                            (this.isSampler[t] ? h.uniform1i : h.uniform1f).call(h, i, n);
                        }
                    }
                }
                var s;
                return this;
            },
            prepareMatrices: function () {
                this.makeCurrent();
                var e,
                    t,
                    i = {},
                    n = this.usedMatrices;
                for (t in (n.MVM && (i[n.MVM] = h.modelviewMatrix),
                (n.MVMI || n.NM) && (i[n.MVMI] = h.modelviewMatrix.inverse()),
                n.PM && (i[n.PM] = h.projectionMatrix),
                n.PMI && (i[n.PMI] = h.projectionMatrix.inverse()),
                n.MVPM && (i[n.MVPM] = h.getModelviewProjectionMatrix()),
                n.MVPMI && (i[n.MVPMI] = h.getModelviewProjectionMatrix().inverse()),
                n.NM && ((e = i[n.MVMI].m), (i[n.NM] = [e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]])),
                (this.lastFrameIndex = h.frameIndex),
                i)) {
                    var s,
                        a = this.uniformLocations[t];
                    a || ((a = h.getUniformLocation(this.program, t)), (this.uniformLocations[t] = a)),
                        a &&
                            ((s = i[t]) instanceof pd3D.Matrix && (s = s.m),
                            s &&
                                (9 == s.length
                                    ? h.uniformMatrix3fv(a, !1, new Float32Array([s[0], s[3], s[6], s[1], s[4], s[7], s[2], s[5], s[8]]))
                                    : 16 == s.length && h.uniformMatrix4fv(a, !1, new Float32Array([s[0], s[4], s[8], s[12], s[1], s[5], s[9], s[13], s[2], s[6], s[10], s[14], s[3], s[7], s[11], s[15]]))));
                }
                return this;
            },
            prepareAttributes: function (e) {
                var t,
                    i = 0;
                for (t in e) {
                    var n = e[t],
                        s = this.attributes[t];
                    (null == s || s < 0) && (s = h.getAttribLocation(this.program, t.replace(/^(gl_.*)$/, B + "$1"))),
                        0 <= s &&
                            n.buffer &&
                            ((this.attributes[t] = s), h.bindBuffer(h.ARRAY_BUFFER, n.buffer), h.enableVertexAttribArray(s), h.vertexAttribPointer(s, n.spacing, h.FLOAT, !1, 0, 0), i < (n = n.length / n.spacing) && (i = n));
                }
                for (t in this.attributes) t in e || 0 == this.attributes[t] || h.disableVertexAttribArray(this.attributes[t]);
                return i;
            },
            renderPrimitive: function (e, t, i) {
                var n;
                return (
                    (null != t && !t.buffer) ||
                        (0 < (n = this.prepareAttributes(e)) &&
                            (t ? ((e = pd3D.canUse32BitBuffers && 65535 < n ? h.UNSIGNED_INT : h.UNSIGNED_SHORT), h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, t.buffer), h.drawElements(i, t.length, e, 0)) : h.drawArrays(i, 0, n))),
                    this
                );
            },
            renderIndexBuffer: function (e, t, i) {
                return 0 < t && e && e.buffer && ((t = pd3D.canUse32BitBuffers && 65535 < items ? h.UNSIGNED_INT : h.UNSIGNED_SHORT), h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, e.buffer), h.drawElements(i, e.length, t, 0)), this;
            },
            draw: function (e, t) {
                return e && e.visible && (e.checkToCompile(), this.prepareMatrices(), (t = pd.toInteger(t, h.TRIANGLES)), this.renderPrimitive(e.vertexBuffers, e.indexBuffers[pdGL.Shader.getIndexBufferName(t)], t)), this;
            },
            drawModes: function (e, t) {
                var i, n;
                if (e && e.visible)
                    if ((e.checkToCompile(), this.prepareMatrices(), t === pd3D.RENDER_ALL && (t = p), pd.isArray(t)))
                        for (var s = this.prepareAttributes(e.vertexBuffers), a = 0; a < t.length; ++a) (i = S(t[a], h.TRIANGLES)), (n = pdGL.Shader.getIndexBufferName(i)), this.renderIndexBuffer(e.indexBuffers[n], s, i);
                    else (i = S(t, h.TRIANGLES)), (n = pdGL.Shader.getIndexBufferName(i)), this.renderPrimitive(e.vertexBuffers, e.indexBuffers[n], i);
                return this;
            },
            destroy: function () {
                if (this.program) {
                    for (var e = h.getAttachedShaders(this.program), t = 0, i = e.length; t < i; ++t) h.detachShader(this.program, e[t]), h.deleteShader(e[t]);
                    h.deleteProgram(this.program);
                }
                return this;
            },
        }),
        (pdGL.Shader.getIndexBufferName = function (e) {
            switch ((e = pd.toInteger(e, h.TRIANGLES))) {
                case h.POINTS:
                    return "points";
                case h.LINES:
                case h.LINE_LOOP:
                case h.LINE_STRIP:
                    return "lines";
                case h.TRIANGLES:
                case h.TRIANGLE_STRIP:
                case h.TRIANGLE_FAN:
                    return "triangles";
                default:
                    return "index";
            }
        }),
        (pdGL.Shader.fromURL = function (e, t) {
            function i(e) {
                var t = new XMLHttpRequest();
                if ((t.open("GET", e, !1), t.send(null), 200 !== t.status)) throw "could not load " + e;
                return t.responseText;
            }
            (e = i(e)), (t = i(t));
            return new pdGL.Shader(e, t);
        }),
        (pdGL.Shader.from = function (t, i) {
            try {
                return new pdGL.Shader(t, i);
            } catch (e) {
                return pdGL.Shader.fromURL(t, i);
            }
        });
})(),
    (function () {
        var l = pd3D.VectorArray;
        pdGL.PHASE = { SHADOWS: 0, BACKGROUND: 1, OUTLINES: 2, OUTLINES_MESH: 3, RENDER_FIRST: 4, GROUND_GRID: 5, SURFACES: 6, TRANSPARENT_SURFACES: 7, RENDER_LAST: 8, RENDER_OVERLAY: 9, HUD: 10 };
        var n = null;
        function s(e, t) {
            gl.setCullFaceDefault(!1),
                gl.clearColor(1, 1, 1, 1),
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
                (function e(t, i, n) {
                    if (t && t.visible && n && !1 !== t.castShadows) {
                        for (var s in (t.callbackOnDraw && t.callbackOnDraw(t, i, n), t.transformMatrix && (gl.pushMatrix(), gl.multMatrix(t.transformMatrix), n._rendering && n._shader.prepareMatrices()), t.geometry))
                            t.geometry.hasOwnProperty(s) && n.renderMeshes(t.geometry[s].meshes, i);
                        for (var a, r = 0, o = t.children.length; r < o; ++r) null != (a = t.children[r]) && e(a, i, n);
                        t.transformMatrix && gl.popMatrix();
                    }
                })(e, gl.TRIANGLES, t),
                gl.setCullFaceDefault(!0);
        }
        (pdGL.Environment = function (e) {
            (e = e || {}),
                (this.outlineOpacity = pd.toNumber(e.outlineOpacity, 0.5)),
                (this.outlineWidth = pd.toNumber(e.outlineWidth, gl.getCanvasLineWidthThin())),
                (this.outlineColor = e.outlineColor || [0, 0, 0, 1]),
                (this.outlineMaterial = e.outlineMaterial || pdGL.Material.FixedColorUniformPointSize({ name: "Scene3D.outlineMaterial" }).uniform("color", this.outlineColor)),
                (this.meshColorMaterial = e.meshColorMaterial || pdGL.Material.VariableColorUniformPointSize({ name: "Scene3D.meshColorMaterial" })),
                (this.specularFactor = pd.toNumber(e.specularFactor, 0.75)),
                (this.ambientFactor = pd.toNumber(e.ambientFactor, 0.75)),
                (this.surfaceOpacity = pd.toNumber(e.surfaceOpacity, 1)),
                (this.surfaceShininess = pd.toNumber(e.surfaceShininess, 75)),
                (this.surfaceMaterial = e.surfaceMaterial || (e.shadowMap || e.shadows ? pdGL.Material.BlinnPhongColorShadow({ name: "Scene3D.surfaceMaterialShadow" }) : pdGL.Material.BlinnPhongColor({ name: "Scene3D.surfaceMaterial" }))),
                (this.backgroundColor = e.backgroundColor || [0.702, 0.82, 1, 1]),
                this.backgroundColor.length < 4 && (this.backgroundColor[3] = 1),
                (this.sunDirection = e.sunDirection || new pd3D.Vector(1, 1, 1).normalize()),
                (this.sunPosition = e.sunPosition || new pd3D.Vector()),
                (this.projectedSunPosition = e.projectedSunPosition || new pd3D.Vector()),
                (this.skyModel = e.skyModel || null),
                (this.shadowMap = e.shadowMap || null),
                (this.shadowMatrix = e.shadowMatrix || null),
                (this.shadowMatrixProjected = null),
                (this.depthMapMaterial = e.depthMapMaterial || null),
                (this.updateShadows = null != this.shadowMap),
                (this.showGroundPlane = pd.toBoolean(e.showGroundPlane, !0)),
                (this.groundPlaneOpacity = pd.toNumber(e.groundPlaneOpacity, 0.25)),
                (this.groundPlaneColor = e.groundPlaneColor || null),
                this.groundPlaneColor || ((this.groundPlaneColor = this.backgroundColor.slice()), (this.groundPlaneColor[3] = 0.25)),
                pd.isNumeric(e.groundPlaneOpacity) && (this.groundPlaneColor[3] = pd.constrainTo(this.groundPlaneOpacity, 0, 1)),
                (this.showGroundGrid = pd.toBoolean(e.showGroundGrid, !0)),
                (this.groundGridMajorColor = e.groundGridMajorColor || [0, 0.3, 0.6, 1]),
                (this.groundGridMinorColor = e.groundGridMinorColor || [0.2, 0.4, 0.8, 0.55]),
                (this.groundGridCenter = e.groundGridCenter || l.create()),
                (this.groundGridLevel = pd.toNumber(e.groundGridLevel, null)),
                (this._groundGridSizeMajor = 1e3),
                (this._groundGridSizeMinor = 200),
                (this._groundMesh = null),
                (this.showSkyBox = pd.toBoolean(e.showSkyBox, !1)),
                (this._skyBrightness = 1),
                (this._skyboxMesh = null),
                (this._shareDynamicUniformsList = []),
                (this._cachedUniforms = {}),
                this.shareDynamicUniforms(this.surfaceMaterial),
                (e = null);
        }),
            (pdGL.Environment.prototype.updateDynamicShading = function (e) {
                var t,
                    i,
                    n = !1;
                return (
                    !this.hasOwnShadowMap ||
                        !this.shadowMap ||
                        (!this.updateShadows && this.shadowMatrix) ||
                        ((t = e.nodes[pdGL.PHASE.SHADOWS] || e) &&
                            0 <= this.sunDirection.z &&
                            ((i = this),
                            (!t.hasChanged && t.boundingBox) || ((t.boundingBox = t.getAABB(t.boundingBox)), (t.hasChanged = !1)),
                            pdGL.Environment.fitViewToBoundingBox(this.sunDirection, t.boundingBox, 100 * e.modelSize),
                            (this.shadowMatrix = pd3D.Matrix.multiply(gl.projectionMatrix, gl.modelviewMatrix, this.shadowMatrix)),
                            this.shadowMap.drawTo(function () {
                                s(t, i.depthMapMaterial);
                            }),
                            (n = !0))),
                    this.updateShadows && ((this.sunPosition = pd3D.Vector.multiply(this.sunDirection, 100 * e.modelSize, this.sunPosition)), (this.updateShadows = !1)),
                    n
                );
            }),
            (pdGL.Environment.prototype.updateDynamicSky = function () {
                var e,
                    t,
                    i,
                    n = this.surfaceMaterial._shader,
                    s = this._cachedUniforms,
                    a = this.ambientFactor,
                    r = this.sunDirection.z,
                    o = 0.10452846 < r ? 1 : 0 < r ? pd.mapAndConstrainTo(r, 0, 0.10452846, 0.5, 1) : pd.mapAndConstrainTo(r, -0.30901699, 0, 0, 0.5);
                return (
                    this.skyModel
                        ? ((a = (e = this.skyModel.directBeamIlluminance + 1) < 1e3 ? pd.mapAndConstrainTo(e, 0, 1e3, 1, 0.85) : pd.mapAndConstrainTo(e, 1e3, 65e3, 0.85, 0.25)), (o *= pd.mapAndConstrainTo(e, 0, 65e3, 0.85, 1.1)))
                        : this.showSkyBox && ((a = (e = 1 - this.ambientFactor) < 0.25 ? pd.mapAndConstrainTo(e, 0, 0.25, 1, 0.85) : pd.mapAndConstrainTo(e, 0.25, 1, 0.85, 0.25)), (o *= pd.mapAndConstrainTo(e, 0, 1, 0.85, 1.1))),
                    gl.clearColor(o * this.backgroundColor[0], o * this.backgroundColor[1], o * this.backgroundColor[2], this.backgroundColor[3]),
                    (t = this.specularFactor * o),
                    s[(i = "specularColor")] ? (((e = s[i].value)[0] = t), (e[1] = t), (e[2] = t)) : ((e = s[i] = n.createCachedUniform(i, [t, t, t])).shared = !0),
                    (t = a * o),
                    s[(i = "ambientColor")] ? (((e = s[i].value)[0] = t), (e[1] = t), (e[2] = t)) : ((e = s[i] = n.createCachedUniform(i, [t, t, t])).shared = !0),
                    (t = this.surfaceShininess),
                    s[(i = "shininess")] ? (s[i].value = t) : ((e = s[i] = n.createCachedUniform(i, t)).shared = !0),
                    (t = pd.constrainTo(o * (1 - a * a) * pd.mapAndConstrainTo(r, 0, 0.10471975512, 0, 2), 0, 1)),
                    s[(i = "sunIntensity")] ? (s[i].value = t) : ((e = s[i] = n.createCachedUniform(i, t)).shared = !0),
                    (this._skyBrightness = o),
                    this
                );
            }),
            (pdGL.Environment.prototype.updateDynamicUniforms = function () {
                var e,
                    t,
                    i,
                    n = this.surfaceMaterial._shader,
                    s = this._cachedUniforms;
                (this.projectedSunPosition = gl.modelviewMatrix.transformPoint(this.sunPosition, this.projectedSunPosition)),
                    s[(t = "sunPosition")]
                        ? (((e = s[t].value)[0] = this.projectedSunPosition.x), (e[1] = this.projectedSunPosition.y), (e[2] = this.projectedSunPosition.z))
                        : ((e = s[t] = n.createCachedUniform(t, this.projectedSunPosition)).shared = !0),
                    this.shadowMap &&
                        this.shadowMatrix &&
                        ((i = gl.getModelviewProjectionMatrix().inverse()),
                        (this.shadowMatrixProjected = pd3D.Matrix.multiply(this.shadowMatrix, i, this.shadowMatrixProjected)),
                        s[(t = "shadowMatrix")] ? this.shadowMatrixProjected.copyToColumnMajorArray(s[t].value) : ((e = s[t] = n.createCachedUniform(t, this.shadowMatrixProjected)).shared = !0)),
                    s[(t = "opacity")] ? (s[t].value = this.surfaceOpacity) : ((e = s[t] = n.createCachedUniform(t, this.surfaceOpacity)).shared = !0),
                    this.meshColorMaterial.uniform("opacity", this.outlineOpacity),
                    this.outlineMaterial.uniform("opacity", this.outlineOpacity);
            }),
            (pdGL.Environment.prototype.shareDynamicUniforms = function (e) {
                if (1 == arguments.length) {
                    if (!(e instanceof pdGL.Material)) throw new Error("Only pdGL.Material objects can share an environment's dynamic uniforms.");
                    this._shareDynamicUniformsList.indexOf(e) < 0 && this._shareDynamicUniformsList.push(e);
                } else if (this._shareDynamicUniformsList.length) {
                    for (var t = 0, i = this._shareDynamicUniformsList.length; t < i; ++t) this._shareDynamicUniformsList[t].setCachedUniforms(this._cachedUniforms);
                    this._shareDynamicUniformsList.length = 0;
                }
                return this;
            }),
            (pdGL.Environment.prototype.updateViewChange = function () {}),
            (pdGL.Environment.prototype.calculateGridSizeAndCenter = function (e) {
                var t, i, n, s, a, r, o;
                e &&
                    (this.showGroundGrid || this.showGroundPlane) &&
                    ((t = pd.Dimension.type == pd.DimensionType.IMPERIAL),
                    (i = 1),
                    (o = 0.2),
                    (o =
                        (n = e.preferredGroundGridSize) < 0.001 * e.modelSize || n > 0.499 * e.modelSize
                            ? ((r = (s = Math.log10(e.modelSize)) < 0 ? Math.ceil(s) : Math.floor(s)),
                              (a = Math.pow(10, r)),
                              (r = s - r),
                              t
                                  ? ((a *= 0.3048), r < 0.397940008672038 ? (i = 0.5 * a) / 5 : r < 0.698970004336019 ? (i = +a) / 6 : (i = 3 * a) / 6)
                                  : r < 0.397940008672038
                                  ? ((i = 0.25 * a), 0.05 * a)
                                  : r < 0.698970004336019
                                  ? ((i = 0.5 * a), 0.1 * a)
                                  : ((i = +a), 0.2 * a))
                            : (i = n) / (t ? 3 : 5)),
                    gl.orbitalView && 0 < gl.orbitalView.snapGrid
                        ? ((this._groundGridSizeMinor = pd.snapTo(o, gl.orbitalView.snapGrid)), (this._groundGridSizeMajor = pd.snapTo(i, this._groundGridSizeMinor)))
                        : ((this._groundGridSizeMajor = i), (this._groundGridSizeMinor = o)),
                    l.set(this.groundGridCenter, pd.snapTo(e.modelCenter.x, i), pd.snapTo(e.modelCenter.y, i), pd.toNumber(this.groundGridLevel, e.boundingBox.min.z)));
            }),
            (pdGL.Environment.prototype.updateGroundPlane = function (e) {
                if (e && (this.showGroundGrid || this.showGroundPlane)) {
                    this.calculateGridSizeAndCenter(e);
                    var t = this._groundGridSizeMajor,
                        i = this._groundGridSizeMinor,
                        t = Math.max(1, e.modelSize / t),
                        n = (Math.ceil(1.4 * t) + 0.001) / t;
                    this._groundMesh || (this._groundMesh = new pd3D.Mesh({ triangles: !0, normals: !0, colors: !0, lines: !0, twoSided: !1 }));
                    var s = this._groundMesh;
                    if (
                        (s.reuseStart(),
                        s.normal([0, 0, 1]),
                        s.color(this.groundPlaneColor, this.groundPlaneOpacity),
                        s.addVertex([-n, -n, 0]),
                        s.addVertex([n, -n, 0]),
                        s.addVertex([n, n, 0]),
                        s.addVertex([-n, n, 0]),
                        s.addTriangle(0, 1, 2),
                        s.addTriangle(0, 2, 3),
                        s.normal([0, 0, -1]),
                        s.color([0.5 * this.groundPlaneColor[0], 0.5 * this.groundPlaneColor[1], 0.5 * this.groundPlaneColor[2], 0.5]),
                        s.addVertex([-n, -n, 0]),
                        s.addVertex([n, -n, 0]),
                        s.addVertex([n, n, 0]),
                        s.addVertex([-n, n, 0]),
                        s.addTriangle(4, 6, 5),
                        s.addTriangle(4, 7, 6),
                        this.showGroundGrid)
                    ) {
                        var a = 1 / t;
                        s.color(this.groundGridMajorColor), s.normal([0, 0, 1]);
                        for (var r = 0; r <= n; r += a)
                            s.addLine(s.addVertex([r, -n, 0]), s.addVertex([r, n, 0])),
                                s.addLine(s.addVertex([-n, r, 0]), s.addVertex([n, r, 0])),
                                0 < r && (s.addLine(s.addVertex([-r, -n, 0]), s.addVertex([-r, n, 0])), s.addLine(s.addVertex([-n, -r, 0]), s.addVertex([n, -r, 0])));
                        (a = i / e.modelSize) < 0.01 && (a = 0.2 / t), s.color(this.groundGridMinorColor);
                        for (r = 0; r <= n; r += a)
                            s.addLine(s.addVertex([r, -n, 0]), s.addVertex([r, n, 0])),
                                s.addLine(s.addVertex([-r, -n, 0]), s.addVertex([-r, n, 0])),
                                s.addLine(s.addVertex([-n, r, 0]), s.addVertex([n, r, 0])),
                                s.addLine(s.addVertex([-n, -r, 0]), s.addVertex([n, -r, 0]));
                    }
                    s.reuseEnd(), s.compile();
                }
                return this.updateSkyBox(e), this;
            }),
            (pdGL.Environment.prototype.renderGroundPlane = function (e, t) {
                var i, n, s;
                return (
                    e &&
                        (this.showGroundGrid || this.showGroundPlane) &&
                        (this._groundMesh || this.updateGroundPlane(e),
                        (i = e.modelSize),
                        (n = this.groundGridCenter),
                        (s = this._groundMesh),
                        (t = gl.orbitalView.camera.z < n[2]),
                        gl.pushMatrix(),
                        gl.depthMask(!1),
                        gl.translate(n[0], n[1], n[2] - (t ? 0.001 * i : 0)),
                        gl.scale(i, i, 1),
                        this.showGroundPlane &&
                            1e-6 < this.groundPlaneOpacity &&
                            e.environment.surfaceMaterial.pushUniform("shadowOpacity", pd.mapAndConstrainTo(this.surfaceOpacity, 0, 1, 0.5, 0.75)).renderSurfaces(s).endRender().popUniform(),
                        this.showGroundGrid &&
                            e.environment.meshColorMaterial
                                .pushUniform("opacity", pd.mapAndConstrainTo(this.groundPlaneOpacity * this.surfaceOpacity, 0, 1, 0.2, 0.6))
                                .renderOutlines(s)
                                .endRender()
                                .popUniform(),
                        gl.depthMask(!0),
                        gl.popMatrix()),
                    this
                );
            }),
            (pdGL.Environment.prototype.updateSkyBox = function (e) {
                return (
                    e &&
                        this.showSkyBox &&
                        ((n =
                            n ||
                            n ||
                            new pdGL.Shader(
                                "\nvarying vec3 vRayDir;\n\nvoid main() {\n    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\n    vRayDir = gl_Vertex.xyz;\n}\n",
                                "\nconst float PI = 3.141592653589793238463;\n#define iSteps 16\n#define jSteps 8\n\nuniform vec3 uSunDir;\nuniform float uSkyBrightness;\nvarying vec3 vRayDir;\n\nfloat atan2(in float y, in float x) {\n    return x == 0.0 ? sign(y) * (PI / 2.0) : atan(y, x);\n}\nfloat map(float value, float vstart, float vstop, float ostart, float ostop) {\n    float diff = vstop - vstart;\n    return diff == 0.0 ? (ostart + ostop) * 0.5 : ostart + ((ostop - ostart) * ((value - vstart) / diff));\n}\n\nvec2 rsi(vec3 r0, vec3 rd, float sr) {\n    float a = dot(rd, rd);\n    float b = 2.0 * dot(rd, r0);\n    float c = dot(r0, r0) - (sr * sr);\n    float d = (b*b) - 4.0*a*c;\n    if (d < 0.0) return vec2(1e5,-1e5);\n    return vec2(\n        (-b - sqrt(d))/(2.0*a),\n        (-b + sqrt(d))/(2.0*a)\n    );\n}\n\nvec3 atmosphere(vec3 r, vec3 r0, vec3 pSun, float iSun, float rPlanet, float rAtmos, vec3 kRlh, float kMie, float shRlh, float shMie, float g) {\n\n    pSun = normalize(pSun);\n    r = normalize(r);\n\n    vec2 p = rsi(r0, r, rAtmos);\n    if (p.x > p.y) return vec3(0,0,0);\n    p.y = min(p.y, rsi(r0, r, rPlanet).x);\n    float iStepSize = (p.y - p.x) / float(iSteps);\n\n    float iTime = 0.0;\n\n    vec3 totalRlh = vec3(0,0,0);\n    vec3 totalMie = vec3(0,0,0);\n\n    float iOdRlh = 0.0;\n    float iOdMie = 0.0;\n\n    float mu = dot(r, pSun);\n    if (mu > 0.99996) return vec3(iSun, iSun, iSun * 0.5);\n\n    float mumu = mu * mu;\n    float gg = g * g;\n    float pRlh = 3.0 / (16.0 * PI) * (1.0 + mumu);\n    float pMie = 3.0 / (8.0 * PI) * ((1.0 - gg) * (mumu + 1.0)) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg));\n\n    for (int i = 0; i < iSteps; i++) {\n\n        vec3 iPos = r0 + r * (iTime + iStepSize * 0.5);\n\n        float iHeight = length(iPos) - rPlanet;\n\n        float odStepRlh = exp(-iHeight / shRlh) * iStepSize;\n        float odStepMie = exp(-iHeight / shMie) * iStepSize;\n\n        iOdRlh += odStepRlh;\n        iOdMie += odStepMie;\n\n        float jStepSize = rsi(iPos, pSun, rAtmos).y / float(jSteps);\n\n        float jTime = 0.0;\n\n        float jOdRlh = 0.0;\n        float jOdMie = 0.0;\n\n        for (int j = 0; j < jSteps; j++) {\n\n            vec3 jPos = iPos + pSun * (jTime + jStepSize * 0.5);\n\n            float jHeight = length(jPos) - rPlanet;\n\n            jOdRlh += exp(-jHeight / shRlh) * jStepSize;\n            jOdMie += exp(-jHeight / shMie) * jStepSize;\n\n            jTime += jStepSize;\n\n        }\n\n        vec3 attn = exp(-(kMie * (iOdMie + jOdMie) + kRlh * (iOdRlh + jOdRlh)));\n\n        totalRlh += odStepRlh * attn;\n        totalMie += odStepMie * attn;\n\n        iTime += iStepSize;\n\n    }\n\n    return iSun * ((pRlh * kRlh * totalRlh) + (pMie * kMie * totalMie));\n\n}\n\nvoid main() {\n\n    vec3 color = atmosphere(\n        vRayDir.xzy,                    // Ray direction.\n        vec3(0,6372e3,0),               // Ray origin.\n        uSunDir.xzy,                    // Direction of the sun.\n        22.0,                           // Intensity of the sun.\n        6371e3,                         // Radius of the planet in meters.\n        6471e3,                         // Radius of the atmosphere in meters.\n        vec3(5.5e-6, 13.0e-6, 22.4e-6), // Rayleigh scattering coefficient.\n        21e-6,                          // Mie scattering coefficient.\n        8e3,                            // Rayleigh scale height.\n        1.2e3,                          // Mie scale height.\n        0.758                           // Mie preferred scattering direction.\n    );\n\n    color = 1.0 - exp(-color);\n\n    float a = atan2(vRayDir.z, length(vRayDir.xy));\n\n    color = (sin(a) * 0.5 * uSkyBrightness) + color;\n\n    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);\n\n}\n"
                            )),
                        this._skyboxMesh ||
                            ((this._skyboxMesh = new pd3D.Mesh({ twoSided: !1, defaultColor: [1, 1, 1, 1], triangles: !0, normals: !1, colors: !1, lines: !1 })),
                            (e = this._skyboxMesh).reuseStart(),
                            e.addVertex([-1, -1, 0]),
                            e.addVertex([1, -1, 0]),
                            e.addVertex([1, 1, 0]),
                            e.addVertex([-1, 1, 0]),
                            e.addVertex([-1, -1, 1]),
                            e.addVertex([1, -1, 1]),
                            e.addVertex([1, 1, 1]),
                            e.addVertex([-1, 1, 1]),
                            e.addTriangle(0, 4, 5),
                            e.addTriangle(0, 5, 1),
                            e.addTriangle(1, 5, 6),
                            e.addTriangle(1, 6, 2),
                            e.addTriangle(2, 6, 7),
                            e.addTriangle(2, 7, 3),
                            e.addTriangle(3, 7, 4),
                            e.addTriangle(3, 4, 0),
                            e.addTriangle(4, 7, 6),
                            e.addTriangle(4, 6, 5),
                            e.reuseEnd(),
                            e.compile())),
                    this
                );
            }),
            (pdGL.Environment.prototype.renderSkyBox = function (e) {
                var t, i;
                return (
                    e &&
                        this.showSkyBox &&
                        this._skyboxMesh &&
                        ((t = gl.orbitalView.camera),
                        (i = 0.45 * gl.orbitalView._farField),
                        this._skyboxMesh || this.updateSkyBox(e),
                        gl.pushMatrix(),
                        gl.translate(t.x, t.y, t.z),
                        gl.scale(i, i, i),
                        n.uniforms({ uSkyBrightness: this._skyBrightness, uSunDir: this.sunDirection }).draw(this._skyboxMesh, gl.TRIANGLES),
                        gl.popMatrix()),
                    this
                );
            }),
            (pdGL.Environment.fitViewToBoundingBox = function (e, t, i) {
                for (
                    var n = e.multiply(i),
                        i = t.min.add(t.max).divide(2),
                        s = i.subtract(n).unit(),
                        a = s.cross(new pd3D.Vector(0, 1, 0)).unit(),
                        r = a.cross(s),
                        o = Number.MAX_VALUE,
                        l = -Number.MAX_VALUE,
                        d = 0,
                        h = 0,
                        c = 0,
                        p = 0,
                        u = 0;
                    u < 8;
                    ++u
                )
                    var g = pd3D.Vector.lerp(t.min, t.max, new pd3D.Vector(!!(1 & u), !!(2 & u), !!(4 & u))).subtract(n),
                        m = g.dot(s),
                        f = g.dot(a) / m,
                        g = g.dot(r) / m,
                        d = Math.min(d, f),
                        c = Math.min(c, g),
                        h = Math.max(h, f),
                        p = Math.max(p, g),
                        o = Math.min(o, m),
                        l = Math.max(l, m);
                (o *= 0.999), (l *= 1.001), gl.matrixMode(gl.PROJECTION), gl.loadIdentity(), gl.frustum(d * o, h * o, c * o, p * o, o, l), gl.matrixMode(gl.MODELVIEW), gl.loadIdentity(), gl.lookAt(n.x, n.y, n.z, i.x, i.y, i.z, 0, 1, 0);
            });
        var i = null;
        (pdGL.Scene3D = function (e, t) {
            (t = t || {}),
                pd3D.Node.call(this, e, "Scene"),
                (this.active = !1),
                (this.nodes = []),
                (this.nodes[pdGL.PHASE.SHADOWS] = null),
                (this.nodes[pdGL.PHASE.BACKGROUND] = null),
                (this.nodes[pdGL.PHASE.OUTLINES] = null),
                (this.nodes[pdGL.PHASE.OUTLINES_MESH] = null),
                (this.nodes[pdGL.PHASE.RENDER_FIRST] = null),
                (this.nodes[pdGL.PHASE.GROUND_GRID] = null),
                ((this.nodes[pdGL.PHASE.SURFACES] = this).nodes[pdGL.PHASE.TRANSPARENT_SURFACES] = null),
                (this.nodes[pdGL.PHASE.RENDER_LAST] = null),
                (this.nodes[pdGL.PHASE.RENDER_OVERLAY] = null),
                (this.nodes[pdGL.PHASE.HUD] = null),
                (this.environment = t.environment || new pdGL.Environment(t)),
                t.useOwnView && ((this._previousOrbitalView = gl.orbitalView), (this.orbitalView = new pdGL.OrbitalView(t)), (this.useOwnView = !0)),
                (this.boundingBox = t.boundingBox || null),
                (this._aabbList = []),
                (this.selectRadius = pd.toNumber(t.selectRadius, 20)),
                (this.modelSize = 1),
                (this.defaultZoom = pd.toNumber(t.defaultZoom, 1)),
                (this.modelUnit = 0.01),
                (this.modelCenter = t.modelCenter || new pd3D.Vector(0, 0, 0)),
                (this.modelCenterHeight = pd.toNumber(t.modelCenterHeight, 0.25)),
                (this.preferredModelSnap = pd.toNumber(t.preferredModelSnap, 0)),
                (this.preferredGroundGridSize = pd.toNumber(t.preferredGroundGridSize, 0)),
                (this.hotspots = []),
                (this.hoveredHotspotIndex = -1),
                (this.activeHotspotIndex = -1),
                (this.activeHotspot = null),
                (this._preSelectedHotspot = null),
                (this.dimensionManager = t.dimensionManager || null),
                (this.handleRenderGroundPlane = t.handleRenderGroundPlane || null),
                (this.handleUpdateDynamicShading = t.handleUpdateDynamicShading || null),
                (this.handleUpdateDynamicUniforms = t.handleUpdateDynamicUniforms || null),
                (this.handleUpdateDynamicSky = t.handleUpdateDynamicSky || null),
                (this.callbackOnSelectHotspot = t.callbackOnSelectHotspot || null),
                (this.callbackOnDraw = t.callbackOnDraw || null),
                (this.ignoreSelection = pd.toBoolean(t.ignoreSelection, !1)),
                (this.enhanceHiddenLines = pd.toBoolean(t.enhanceHiddenLines, !1)),
                (this._activeSelectionType = 0),
                pd.addSimpleEventHandling(this),
                (t = null);
        }),
            (pdGL.Scene3D.prototype = Object.create(pd3D.Node.prototype)),
            (pdGL.Scene3D.prototype.constructor = pdGL.Scene3D);
        var a = [0.85, 0.85, 0.85, 1];
        (pdGL.Scene3D.prototype.createShadowMap = function (e, t) {
            var i = this.environment;
            return (
                (t = t || gl.RGB),
                (e = pd.constrainTo(pd.toInteger(e, 1024), 8, 4096)),
                (i.shadowMap = new pdGL.Texture(e, e, { format: t })),
                "shadowMatrix" in i.surfaceMaterial._uniforms ||
                    ((t = pdGL.Material.BlinnPhongColorShadow({ name: "Scene3D.surfaceMaterialShadow" })).uniform("color", a),
                    this.swapMaterials(i.surfaceMaterial, t),
                    this.emit("shadow:mtl:changed", i.surfaceMaterial, t),
                    i.shareDynamicUniforms(t),
                    (i.surfaceMaterial = t)),
                i.depthMapMaterial || (i.depthMapMaterial = pdGL.Material.DepthMapShader({ name: "Scene3D.depthMapMaterial" })),
                i.shadowMap && i.shadowMap.bind(),
                (i.hasOwnShadowMap = !0),
                (i.updateShadows = !0),
                this
            );
        }),
            (pdGL.Scene3D.prototype.clearShadowMap = function () {
                var e,
                    t = this.environment;
                return (
                    t.hasOwnShadowMap &&
                        t.shadowMap &&
                        "shadowMatrix" in t.surfaceMaterial._uniforms &&
                        ((e = pdGL.Material.BlinnPhongColor({ name: "Scene3D.surfaceMaterial" })).uniform("color", a),
                        this.swapMaterials(t.surfaceMaterial, e),
                        this.emit("shadow:mtl:changed", t.surfaceMaterial, e),
                        t.shareDynamicUniforms(e),
                        (t.surfaceMaterial = e)),
                    t.shadowMap && t.shadowMap.unbind(),
                    (t.shadowMap = null),
                    (t.hasOwnShadowMap = !1),
                    (t.updateShadows = !1),
                    this
                );
            }),
            (pdGL.Scene3D.prototype.getSurfaceMaterial = function () {
                return this.environment.surfaceMaterial;
            }),
            (pdGL.Scene3D.prototype.getOutlineMaterial = function () {
                return this.environment.outlineMaterial;
            }),
            (pdGL.Scene3D.prototype.getMeshColorMaterial = function () {
                return this.environment.meshColorMaterial;
            }),
            (pdGL.Scene3D.prototype.getModelSnap = function (e) {
                return (e = e || 0) < 0.01 * this.modelUnit || e > 10 * this.modelUnit
                    ? pd.Dimension.type == pd.DimensionType.IMPERIAL
                        ? this.modelSize < 1e3
                            ? 1.5875
                            : this.modelSize < 2500
                            ? 6.35
                            : this.modelSize < 1e5
                            ? 25.4
                            : this.modelSize < 25e4
                            ? 304.8
                            : 914.4
                        : this.modelSize < 100
                        ? 0.1
                        : this.modelSize < 1e3
                        ? 1
                        : this.modelSize < 2500
                        ? 5
                        : this.modelSize < 5e3
                        ? 10
                        : this.modelSize < 5e4
                        ? 50
                        : this.modelSize < 15e4
                        ? 100
                        : this.modelSize < 25e4
                        ? 500
                        : 1e3
                    : e;
            }),
            (pdGL.Scene3D.prototype.setModelSnap = function (e) {
                return gl.orbitalView && (gl.orbitalView.snapGrid = this.getModelSnap(e)), (this.preferredModelSnap = e), this;
            }),
            (pdGL.Scene3D.prototype.cancelPreSelection = function () {
                var e;
                return (
                    null != this._preSelectedHotspot &&
                        ((e = this._preSelectedHotspot),
                        (this._activeSelectionType = 0),
                        (this._preSelectedHotspot = null),
                        e && e._preSelected && (e.cancelPreSelection(), pd.isNumeric(e._preSelectedBoxIndex) && (e._preSelectedBoxIndex = -1)),
                        gl.update()),
                    this.activeHotspot && this.activeHotspot.isPreSelected() && ((this.activeHotspot._preSelectedBoxIndex = this.activeHotspot.selectedBoxIndex), gl.update()),
                    this
                );
            });
        var d = 0;
        (pdGL.Scene3D.prototype.handlePointerMove = function (e) {
            var t = e.x,
                i = e.y,
                n = 0;
            if ((this.dimensionManager && this.dimensionManager.visible && this.dimensionManager.active && this.dimensionManager.isOver(t, i, this.selectRadius) && (n = 1), !n && 0 < this.hotspots.length)) {
                for (var s = null, a = -1, r = 0, o = this.hotspots.length; r < o; ++r)
                    if ((s = this.hotspots[r]).active && s.isOver(t, i, this.selectRadius)) {
                        (a = r), (n = 1);
                        break;
                    }
                this.setHoveredHotspotByIndex(a);
            }
            return d != n && ((gl.canvas.style.cursor = 0 < n ? "pointer" : "inherit"), (d = n)), !1;
        }),
            (pdGL.Scene3D.prototype.handlePointerDown = function (e) {
                if (0 == e.button) {
                    if (
                        (e.isTouchEvent ? (pdGL.Hotspot3D.selectRadiusModifier = 1) : (pdGL.Hotspot3D.selectRadiusModifier = 0.6),
                        (this._activeSelectionType = 0),
                        this.activeHotspot && this.activeHotspot.visible && this.activeHotspot.active && this.activeHotspot.handleSelectEvent(e, !0, this.ignoreSelection))
                    )
                        return (this._activeSelectionType = 1), !0;
                    if (this.dimensionManager) {
                        var t = e.x,
                            i = e.y;
                        if (this.dimensionManager.visible && this.dimensionManager.active && this.dimensionManager.isOver(t, i, this.selectRadius)) return (this._activeSelectionType = 2), !0;
                    }
                    if (!this.ignoreSelection) {
                        for (var n = 0, s = this.hotspots.length; n < s; ++n)
                            if (n != this.activeHotspotIndex && this.hotspots[n].handleSelectEvent(e, !1)) {
                                var a = this.hotspots[n];
                                return (this._preSelectedHotspot = a), (this._activeSelectionType = 3), (a._preSelected = !0), (a._selected = !1), gl.update(), !0;
                            }
                        return !(this._preSelectedHotspot = null);
                    }
                }
                return !1;
            }),
            (pdGL.Scene3D.prototype.handlePointerDrag = function (e) {
                if (!this.ignoreSelection) {
                    if (null != this._preSelectedHotspot || (this.activeHotspot && this.activeHotspot.isPreSelected()))
                        return pdDOM.Interaction.hasMoved() && (this.cancelPreSelection(), null != pdGL.Hotspot3D && pdGL.Hotspot3D.captureEvent(!1)), !0;
                    if (2 == this._activeSelectionType) {
                        if (!pdDOM.Interaction.hasMoved()) return !0;
                        this._activeSelectionType = 0;
                    }
                    if (0 == e.button && this.activeHotspot) return !pdDOM.Interaction.hasMoved() || this.activeHotspot.handleDragEvent(e);
                }
                return !1;
            }),
            (pdGL.Scene3D.prototype.handlePointerUp = function (e) {
                if (e.longPress) 1 == this._activeSelectionType && this.activeHotspot && this.activeHotspot.handleReleaseEvent(e), 0 == e.button && this.cancelPreSelection();
                else if (!this.ignoreSelection && (0 == e.button || e.isTouchEvent)) {
                    var t = e.x,
                        i = e.y;
                    if (
                        (1 == this._activeSelectionType &&
                            this.dimensionManager &&
                            !pdDOM.Interaction.hasMoved() &&
                            this.dimensionManager.visible &&
                            this.dimensionManager.active &&
                            this.dimensionManager.isOver(t, i, this.selectRadius) &&
                            (this._activeSelectionType = 2),
                        2 == this._activeSelectionType && !e.shiftKey && this.dimensionManager && this.dimensionManager.visible && this.dimensionManager.active)
                    ) {
                        this.activeHotspot && this.activeHotspot.cancelPreSelection();
                        var n = this.dimensionManager.findClickPoint(t, i, this.selectRadius);
                        return n && this.dimensionManager.handleClickEvent(e, n), (gl.canvas.style.cursor = "pointer"), (d = 0), !1;
                    }
                    null != this._preSelectedHotspot && 3 == this._activeSelectionType
                        ? ((n = this._preSelectedHotspot)._preSelected && this.selectHotspot(n), (n._preSelected = !1))
                        : this.activeHotspot && (this.activeHotspot.handleReleaseEvent(e), this.activeHotspot && !this.activeHotspot.getSelected() && this.selectHotspotByIndex(-1));
                }
                return this._preSelectedHotspot && ((this._preSelectedHotspot = null), gl.update()), this.emit("pointer:up", e), !1;
            }),
            (pdGL.Scene3D.prototype.includeInBoundingBoxList = function (e) {
                return e && "function" == typeof e.getAABB && this._aabbList.indexOf(e) < 0 && this._aabbList.push(e), this;
            }),
            (pdGL.Scene3D.prototype.removeFromBoundingBoxList = function (e) {
                e = this._aabbList.indexOf(e);
                return -1 < e && this._aabbList.splice(e, 1), this;
            }),
            (pdGL.Scene3D.prototype.clearBoundingBoxList = function () {
                return (this._aabbList.length = 0), this;
            });
        var r = { min: new pd3D.Vector(), max: new pd3D.Vector() };
        (pdGL.Scene3D.prototype.updateBoundingBox = function (e, t) {
            var i = !1;
            if (e || this.hasChanged || !this.boundingBox) {
                if (((t = t || this), r.min.init(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE), r.max.init(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE), (r = this.getAABB(r)), 0 < t._aabbList.length))
                    for (var n = 0, s = t._aabbList.length; n < s; ++n) t._aabbList[n].getAABB && t._aabbList[n].getAABB(r);
                r.max.x < r.min.x && ((r.max.x = r.max.y = 6e3), (r.min.x = r.min.y = -6e3), (r.max.z = 5e3), (r.min.z = 0)),
                    t.emit("bbox:changing", r),
                    t.boundingBox
                        ? (r.min.closeTo(t.boundingBox.min) && r.max.closeTo(t.boundingBox.max)) || (t.boundingBox.min.init(r.min), t.boundingBox.max.init(r.max), (i = !0))
                        : ((t.boundingBox = { min: new pd3D.Vector(r.min), max: new pd3D.Vector(r.max) }), (i = !0)),
                    i && t.emit("bbox:changed", t.boundingBox);
            }
            return i;
        }),
            (pdGL.Scene3D.prototype.checkBoundingBox = function (e, t) {
                if (e || this.hasChanged || !this.boundingBox) {
                    e = (t = t || this).updateBoundingBox(e, t);
                    return (
                        (t.modelSize = t.boundingBox.max.distanceTo(t.boundingBox.min)),
                        (t.modelUnit = 0.01 * t.modelSize),
                        (t.hasChanged = !1),
                        t.modelCenter || (t.modelCenter = new pd3D.Vector()),
                        t.modelCenter.init(
                            0.5 * (t.boundingBox.max.x + t.boundingBox.min.x),
                            0.5 * (t.boundingBox.max.y + t.boundingBox.min.y),
                            Math.max(0, t.boundingBox.min.z + this.modelCenterHeight * (t.boundingBox.max.z - t.boundingBox.min.z))
                        ),
                        e
                    );
                }
                return !1;
            }),
            (pdGL.Scene3D.prototype.fitGroundPlane = function (e) {
                return this.checkBoundingBox(e), this.environment._groundMesh && this.environment.updateGroundPlane(this), this;
            }),
            (pdGL.Scene3D.prototype.fitViewAnimated = function (e, n) {
                var s = this,
                    a = this.environment.showGroundGrid,
                    r = {},
                    o = { modelCenter: this.modelCenter.clone(), modelSize: this.modelSize, modelUnit: this.modelUnit, boundingBox: { min: this.boundingBox.min.clone(), max: this.boundingBox.max.clone() } };
                return (
                    this.checkBoundingBox(e, r),
                    pd.closeTo(o.modelSize, r.modelSize, s.modelUnit) || (this.environment.showGroundGrid = !1),
                    (gl.orbitalView.hasChanged = gl.PROJECTION),
                    gl.orbitalView.center({ defaultTarget: r.modelCenter, defaultDistance: s.defaultZoom * r.modelSize, farFieldFactor: 2.5 / s.defaultZoom, noAnimation: !1 }, function (e, t) {
                        var i = 1 - t;
                        return (
                            pd3D.Vector.lerp(o.modelCenter, r.modelCenter, t, s.modelCenter),
                            pd3D.Vector.lerp(o.boundingBox.min, r.boundingBox.min, t, s.boundingBox.min),
                            pd3D.Vector.lerp(o.boundingBox.max, r.boundingBox.max, t, s.boundingBox.max),
                            (s.modelSize = i * o.modelSize + t * r.modelSize),
                            (s.modelUnit = 0.01 * s.modelSize),
                            0.999 < t && ((s.environment.showGroundGrid = a), s.environment._groundMesh && s.environment.updateGroundPlane(s), n && !pd.closeTo(o.modelSize, r.modelSize, s.modelUnit) && n(s), !0)
                        );
                    }),
                    this
                );
            }),
            (pdGL.Scene3D.prototype.fitView = function (e, t) {
                return (
                    this.checkBoundingBox(e),
                    this.environment._groundMesh && this.environment.updateGroundPlane(this),
                    this.setModelSnap(this.preferredModelSnap),
                    (gl.orbitalView.hasChanged = gl.PROJECTION),
                    gl.orbitalView.center({ defaultTarget: this.modelCenter, defaultDistance: this.defaultZoom * this.modelSize, farFieldFactor: 2.5 / this.defaultZoom, noAnimation: !!t }),
                    this
                );
            }),
            (pdGL.Scene3D.prototype.attachToOrbitalView = function (e) {
                var t = this;
                return (
                    (!this.useOwnView && gl.orbitalView) ||
                        ((this._previousOrbitalView = gl.orbitalView),
                        this.orbitalView ||
                            (this.checkBoundingBox(),
                            ((e = e || {}).defaultTarget = this.modelCenter),
                            (e.defaultDistance = this.defaultZoom * this.modelSize),
                            (e.farFieldFactor = 2.5 / this.defaultZoom),
                            (this.orbitalView = new pdGL.OrbitalView(e))),
                        (gl.orbitalView = this.orbitalView)),
                    (gl.orbitalView.handlePointerMove = function (e) {
                        return !!t.hotspots.length && t.handlePointerMove(e);
                    }),
                    (gl.orbitalView.handlePointerDown = function (e) {
                        return t.handlePointerDown(e);
                    }),
                    (gl.orbitalView.handlePointerDrag = function (e) {
                        return t.handlePointerDrag(e);
                    }),
                    (gl.orbitalView.handlePointerUp = function (e) {
                        return t.handlePointerUp(e);
                    }),
                    this.setModelSnap(this.preferredModelSnap),
                    this.modelUnit < gl.orbitalView.snapGrid && (gl.orbitalView.snapGrid = this.modelUnit),
                    (gl.orbitalView.scene = this)
                );
            }),
            (pdGL.Scene3D.prototype.detachFromOrbitalView = function () {
                return (
                    gl.orbitalView &&
                        (this.hasOwnView && this._previousOrbitalView && gl.orbitalView.scene && gl.orbitalView.scene.id == this.id && (gl.orbitalView = this._previousOrbitalView),
                        (gl.orbitalView.callbackOnChange = null),
                        (gl.orbitalView.handlePointerMove = null),
                        (gl.orbitalView.handlePointerDown = null),
                        (gl.orbitalView.handlePointerDrag = null),
                        (gl.orbitalView.handlePointerUp = null),
                        (gl.orbitalView.scene = null)),
                    this
                );
            }),
            (pdGL.Scene3D.prototype.activate = function (e) {
                var t = this.environment;
                if (i) {
                    if (i.id == this.id && this.active) return this;
                    i.detachFromOrbitalView(), (i.active = !1);
                }
                return (
                    (t.updateShadows = !0),
                    this.attachToOrbitalView(e),
                    this.fitView(!0, !0),
                    this.nodes[pdGL.PHASE.GROUND_GRID] || this.handleRenderGroundPlane || (!t.showGroundGrid && !t.showGroundPlane) || t._groundMesh || t.calculateGridSizeAndCenter(this),
                    (this.active = !0),
                    (i = this)
                );
            }),
            (pdGL.Scene3D.prototype.isValidHotspotIndex = function (e) {
                return 0 <= e && e < this.hotspots.length;
            }),
            (pdGL.Scene3D.prototype.setHoveredHotspotByIndex = function (e) {
                return this.isValidHotspotIndex(this.hoveredHotspotIndex) && (this.hotspots[this.hoveredHotspotIndex].isHovered = !1), (this.hoveredHotspotIndex = e), this.isValidHotspotIndex(e) && (this.hotspots[e].isHovered = !0), this;
            }),
            (pdGL.Scene3D.prototype.selectHotspotByIndex = function (e) {
                var t = null;
                return (
                    this.isValidHotspotIndex(e) && (t = this.hotspots[e]),
                    this.activeHotspot != t &&
                        (this.activeHotspot && this.activeHotspot.getSelected() && this.activeHotspot.setSelected(!1),
                        t ? ((this.activeHotspotIndex = e), (this.activeHotspot = t).setSelected(!0)) : ((this.activeHotspotIndex = -1), (this.activeHotspot = null)),
                        this.callbackOnSelectHotspot && this.callbackOnSelectHotspot(this, this.activeHotspot),
                        gl.update()),
                    this
                );
            }),
            (pdGL.Scene3D.prototype.selectHotspot = function (e) {
                return this.selectHotspotByIndex(this.hotspots.indexOf(e));
            }),
            (pdGL.Scene3D.prototype.addHotspot = function (e, t) {
                if (!e || !e.isHotspot) throw new Error("ERROR: Only valid pdGL.Hotspot3D objects can be added to a scene.");
                return this.hotspots.push(e), t && this.selectHotspotByIndex(this.hotspots.length - 1), this;
            }),
            (pdGL.Scene3D.prototype.removeHotspot = function (e) {
                return (
                    !e ||
                        (-1 < (e = this.hotspots.indexOf(e)) &&
                            (this.hotspots.splice(e, 1), this.hoveredHotspotIndex == e && (this.hoveredHotspotIndex = -1), this.activeHotspotIndex == e && ((this.activeHotspotIndex = -1), (this.activeHotspot = null)))),
                    this
                );
            }),
            (pdGL.Scene3D.prototype.findHotspotById = function (e, t) {
                for (var i = t || [], n = 0, s = this.hotspots.length; n < s; ++n) this.hotspots[n].id == e && i.push(this.hotspots[n]);
                return i;
            }),
            (pdGL.Scene3D.prototype.findHotspotByName = function (e, t) {
                for (var i = t || [], n = 0, s = this.hotspots.length; n < s; ++n) this.hotspots[n].name == e && i.push(this.hotspots[n]);
                return i;
            }),
            (pdGL.Scene3D.prototype.clearHotspots = function () {
                for (var e = 0, t = this.hotspots.length; e < t; ++e) this.hotspots[e].clear();
                return (this.hotspots.length = 0), (this.hoveredHotspotIndex = -1), (this.activeHotspotIndex = -1), (this.activeHotspot = null), this;
            }),
            (pdGL.Scene3D.prototype.setDimensionManager = function (e) {
                if (e && !(e instanceof pdGL.DimensionManager3D)) throw new Error("ERROR: Only valid pdGL.DimensionManager3D objects can be added to a scene.");
                return (this.dimensionManager = e), this;
            }),
            (pdGL.Scene3D.prototype.clearModel = function () {
                return this.clearChildren(), this.clearGeometry(), (this.hasChanged = !0), this;
            }),
            (pdGL.Scene3D.prototype.clear = function () {
                return this.clearHotspots(), this.clearChildren(), this.clearGeometry(), (this.transformMatrix = null), (this.inverseMatrix = null), (this.hasChanged = !0), this;
            }),
            (pdGL.Scene3D.prototype.addNode = function (e, t) {
                if (e)
                    if (2 != arguments.length) for (var i = 0, n = arguments.length; i < n; ++i) this.addNode(e, arguments[i]);
                    else if (pd.isArray(t)) for (i = 0, n = t.length; i < n; ++i) this.addNode(e, t[i]);
                    else {
                        ((t = pd.toInteger(t, pdGL.PHASE.SURFACES)) < pdGL.PHASE.SHADOWS || t > pdGL.PHASE.HUD) && (t = pdGL.PHASE.SURFACES), this.nodes[t] || (this.nodes[t] = new pd3D.Node(null, "RenderPhase"));
                        var s = this.nodes[t];
                        e instanceof pd3D.Mesh ? s.addMesh(e, this.environment.surfaceMaterial) : s.findChildrenById(e.id).length || s.addChild(e);
                    }
                return this;
            });
        var o = !(pdGL.Scene3D.prototype.removeNode = function (e, t) {
            if (e)
                if (pd.isArray(t)) for (var i = 0, n = t.length; i < n; ++i) this.removeNode(e, t[i]);
                else if ((t = pd.toNumber(t, -1)) >= pdGL.PHASE.SHADOWS && t <= pdGL.PHASE.HUD) this.nodes[t] && this.nodes[t].removeChild(e);
                else for (i = pdGL.PHASE.SHADOWS; i <= pdGL.PHASE.HUD; ++i) this.nodes[i] && this.nodes[i].removeChild(e);
            return this;
        });
        (pdGL.Scene3D.prototype.draw = function () {
            var e = this.environment,
                t = 0.001 < e.surfaceOpacity,
                i = 0.001 < e.outlineOpacity && 0.001 < e.outlineWidth,
                n = !1;
            if (!o && gl.orbitalView) {
                if (
                    ((o = !0),
                    this.checkBoundingBox(),
                    pdGL.Hotspot3D.setRelativeSize(this.modelUnit),
                    (this.handleUpdateDynamicShading && this.handleUpdateDynamicShading(this)) || ((this.renderPhase = pdGL.PHASE.SHADOWS), (n = e.updateDynamicShading(this))),
                    (this.handleUpdateDynamicSky && this.handleUpdateDynamicSky(this)) || e.updateDynamicSky(this),
                    gl.orbitalView.apply(n),
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
                    gl.enable(gl.BLEND),
                    (this.handleUpdateDynamicUniforms && this.handleUpdateDynamicUniforms(this)) || e.updateDynamicUniforms(this),
                    e.shareDynamicUniforms(),
                    this.callbackOnDraw && this.callbackOnDraw(this),
                    gl.depthMask(!1),
                    e.showSkyBox && e.renderSkyBox(this),
                    null != (n = this.nodes[pdGL.PHASE.BACKGROUND]) && ((this.renderPhase = pdGL.PHASE.BACKGROUND), n.draw(pd3D.RENDER_ALL)),
                    this.enhanceHiddenLines && gl.depthMask(!0),
                    i && (gl.lineWidth(e.outlineWidth), (this.renderPhase = pdGL.PHASE.OUTLINES), this.drawOutlines(e.outlineMaterial), null != (n = this.nodes[pdGL.PHASE.OUTLINES]) && n.drawOutlines(e.outlineMaterial)),
                    this.enhanceHiddenLines || gl.depthMask(!0),
                    null != (n = this.nodes[pdGL.PHASE.RENDER_FIRST]) && ((this.renderPhase = pdGL.PHASE.RENDER_FIRST), n.draw(pd3D.RENDER_FIRST)),
                    null != (n = this.nodes[pdGL.PHASE.GROUND_GRID]) ? ((this.renderPhase = pdGL.PHASE.GROUND_GRID), n.draw(pd3D.RENDER_ALL)) : gl.orbitalView.camera.z > e.groundGridCenter[2] && e.renderGroundPlane(this, !1),
                    t &&
                        (e.meshColorMaterial.uniform("opacity", e.surfaceOpacity),
                        (this.renderPhase = pdGL.PHASE.SURFACES),
                        this.drawSurfaces(),
                        null != (n = this.nodes[pdGL.PHASE.TRANSPARENT_SURFACES]) && ((this.renderPhase = pdGL.PHASE.TRANSPARENT_SURFACES), n.drawSurfaces())),
                    !this.nodes[pdGL.PHASE.GROUND_GRID] &&
                        gl.orbitalView.camera.z < e.groundGridCenter[2] &&
                        ((this.renderPhase = pdGL.PHASE.GROUND_GRID), this.handleRenderGroundPlane ? this.handleRenderGroundPlane(this, !0) : e.renderGroundPlane(this, !0)),
                    i &&
                        (gl.lineWidth(e.outlineWidth),
                        (this.renderPhase = pdGL.PHASE.OUTLINES),
                        this.drawOutlines(e.outlineMaterial),
                        null != (n = this.nodes[pdGL.PHASE.OUTLINES]) && n.drawOutlines(e.outlineMaterial),
                        null != (n = this.nodes[pdGL.PHASE.OUTLINES_MESH]) && (e.meshColorMaterial.uniform("opacity", e.outlineOpacity), (this.renderPhase = pdGL.PHASE.OUTLINES_MESH), n.drawOutlines(e.meshColorMaterial))),
                    null != (n = this.nodes[pdGL.PHASE.RENDER_LAST]) && ((this.renderPhase = pdGL.PHASE.RENDER_LAST), n.draw(pd3D.RENDER_LAST)),
                    null != (n = this.nodes[pdGL.PHASE.RENDER_OVERLAY]) && ((this.renderPhase = pdGL.PHASE.RENDER_OVERLAY), gl.disable(gl.DEPTH_TEST), n.draw(pd3D.RENDER_ALL), gl.enable(gl.DEPTH_TEST)),
                    0 < this.hotspots.length)
                ) {
                    gl.polygonOffset(-1, 1);
                    for (var s = 0, a = this.hotspots.length; s < a; ++s) {
                        var r = this.hotspots[s];
                        r.visible && r.draw();
                    }
                    this.activeHotspot &&
                        this.activeHotspot.visible &&
                        (gl.disable(gl.DEPTH_TEST),
                        (i = this.activeHotspot._opacity),
                        (this.activeHotspot._opacity = pd.mapAndConstrainTo(e.surfaceOpacity, 0.2, 1, 0.5, 0.9)),
                        this.activeHotspot.draw(),
                        (this.activeHotspot._opacity = i),
                        gl.enable(gl.DEPTH_TEST)),
                        gl.polygonOffset(1, 1);
                }
                return (
                    null != (n = this.nodes[pdGL.PHASE.HUD]) && (gl.orbitalView.startOverlay2D(), (this.renderPhase = pdGL.PHASE.HUD), n.draw(pd3D.RENDER_ALL), gl.orbitalView.endOverlay2D()),
                    gl.disable(gl.BLEND),
                    gl.cleanup(),
                    (o = !1),
                    this
                );
            }
            console.warn("REQUEST TO DRAW SCENE WHILST DRAWING...");
        }),
            (pdGL.Scene3D.getActiveEnvironment = function () {
                return i ? i.environment : null;
            }),
            (pdGL.Scene3D.getActiveScene = function () {
                return i;
            });
    })(),
    (function () {
        var m = pd3D.VectorArray,
            r = pd3D.PlaneArray,
            f = pd3D.BBoxArray,
            n = Math.PI / 1.5,
            s = Math.PI / 3,
            u = [4, 1],
            o = 15,
            e = null;
        function g() {
            return (e = e || pdGL.Material.FixedColorUniformPointSize({ name: "DefaultMaterialHotspot", uniforms: { color: [1, 0, 0, 1], opacity: 1 } }));
        }
        var t = null;
        function l() {
            return (t = t || pd3D.Shapes.sphere({ radius: 0.075, detail: 3 }));
        }
        function p(e, t) {
            var i = t ? t.metaKey : pdGL.keys.META,
                n = t ? t.ctrlKey : pdGL.keys.CONTROL,
                s = t ? t.shiftKey : pdGL.keys.SHIFT,
                a = 10 * e,
                r = 0.2 * e,
                t = pdGL.Scene3D.getActiveScene();
            return (
                null != t
                    ? (a = t.environment._groundGridSizeMinor)
                    : pd.Dimension.type == pd.DimensionType.IMPERIAL && ((r = 1.5875), 900 < e ? ((a = 4572), (e = 25.4)) : 300 < e ? ((a = 914.4), (e = 25.4)) : 15 < e ? ((a = 304.8), (e = 25.4)) : ((e = 1.5875), (a = 25.4))),
                s ? a : n || i ? r : e
            );
        }
        function c(e, t) {
            pd3D.Node.call(this, t, "Manipulator3D"),
                (this.type = pdGL.MANIPULATOR_TYPE.UNKNOWN),
                (this.parent = e),
                (this.modelPos = [0, 0, 0]),
                (this.canvasPos = [0, 0, 0]),
                (this.flipAngle = 0),
                (this.allowSnap = !0),
                (this.axis = 0),
                (this.transform = this.transformMatrix = new pd3D.Transform()),
                (this.relativeOffset = 0),
                (this.fixedPlane = pd3D.AXIS.NONE),
                (this.axialXYOnly = !1),
                (this.getSelectionPlane = this._getSelectionPlaneByView),
                (this.updateRotation = this._updateRotationByView);
        }
        (pdGL.MANIPULATOR_TYPE = { UNKNOWN: 0, PUSH_PULL: 1, SQUARE: 2, CIRCLE: 3, SECTION: 4, TOUCH: 5, ARROW: 6 }),
            (((c.prototype = Object.create(pd3D.Node.prototype)).constructor = c).prototype.getSnapWithKeyModifier = function (e, t) {
                var i = t ? t.metaKey : pdGL.keys.META,
                    n = t ? t.ctrlKey : pdGL.keys.CONTROL,
                    s = t ? t.shiftKey : pdGL.keys.SHIFT,
                    a = 10 * e,
                    r = 0.2 * e,
                    t = pdGL.Scene3D.getActiveScene();
                return (
                    null != t
                        ? (a = t.environment._groundGridSizeMinor)
                        : pd.Dimension.type == pd.DimensionType.IMPERIAL && ((r = 1.5875), 900 < e ? ((a = 4572), (e = 25.4)) : 300 < e ? ((a = 914.4), (e = 25.4)) : 15 < e ? ((a = 304.8), (e = 25.4)) : ((e = 1.5875), (a = 25.4))),
                    s ? a : n || i ? r : e
                );
            }),
            (c.prototype.updatePos = function () {
                var e, t;
                return (
                    this.parent &&
                        ((e = this.parent.modelPos),
                        pd.isArray(this.vector)
                            ? ((t = this.relativeOffset * this.parent.relativeSize), (this.modelPos[0] = e[0] + this.vector[0] * t), (this.modelPos[1] = e[1] + this.vector[1] * t), (this.modelPos[2] = e[2] + this.vector[2] * t))
                            : pd.isArray(this.offsetVector)
                            ? ((t = this.parent.relativeSize),
                              this.type == pdGL.MANIPULATOR_TYPE.TOUCH
                                  ? 15 < this.flipAngle
                                      ? ((this.modelPos[0] = e[0] + this.offsetVector[2] * t), (this.modelPos[1] = e[1] + this.offsetVector[0] * t), (this.modelPos[2] = e[2] + this.offsetVector[1] * t))
                                      : 5 < this.flipAngle
                                      ? ((this.modelPos[0] = e[0] + this.offsetVector[0] * t), (this.modelPos[1] = e[1] + this.offsetVector[2] * t), (this.modelPos[2] = e[2] + this.offsetVector[1] * t))
                                      : ((this.modelPos[0] = e[0] + this.offsetVector[0] * t), (this.modelPos[1] = e[1] + this.offsetVector[1] * t), (this.modelPos[2] = e[2] + this.offsetVector[2] * t))
                                  : ((this.modelPos[0] = e[0] + this.offsetVector[0] * t), (this.modelPos[1] = e[1] + this.offsetVector[1] * t), (this.modelPos[2] = e[2] + this.offsetVector[2] * t)))
                            : ((this.modelPos[0] = e[0]), (this.modelPos[1] = e[1]), (this.modelPos[2] = e[2]))),
                    this
                );
            }),
            (c.prototype._getSelectionPlaneByView = function () {
                if (this.fixedPlane)
                    switch (Math.abs(this.fixedPlane)) {
                        case 1:
                            return r.createFromNormalAndPoint(m.unitX, this.modelPos);
                        case 2:
                            return r.createFromNormalAndPoint(m.unitY, this.modelPos);
                        case 3:
                            return r.createFromNormalAndPoint(m.unitZ, this.modelPos);
                    }
                return (function (e, t) {
                    if (t) {
                        t = Math.abs(gl.orbitalView.cameraAzi);
                        return t < 45 || 135 < t ? r.createFromNormalAndPoint(m.unitX, e) : r.createFromNormalAndPoint(m.unitY, e);
                    }
                    return r.createFromNormalAndPoint(m.unitZ, e);
                })(this.modelPos, this.parent.isViewedHorizontal);
            }),
            (c.prototype._getSelectionPlaneByVector = function () {
                if (3 == this.axis || -3 == this.axis) {
                    var e = Math.abs(gl.orbitalView.cameraAzi);
                    if (45 <= e && e <= 135) return r.createFromNormalAndPoint(m.unitY, this.modelPos);
                }
                return r.createFromNormalAndPoint(this.flipAngle ? this.uVector : this.vVector, this.modelPos);
            }),
            (c.prototype._getSelectionPlaneByPlaneEqn = function () {
                if (this.parent.planeEqn)
                    switch (this.axis) {
                        default:
                            return r.createFromNormalAndPoint(this.parent.planeEqn, this.modelPos);
                        case 1:
                            return r.createFromNormalAndPoint(this.uVector, this.modelPos);
                        case 2:
                            return r.createFromNormalAndPoint(this.vVector, this.modelPos);
                    }
                return this._getSelectionPlaneByView();
            }),
            (c.prototype.setTransform = function () {
                throw new Error("Please use 'setTranslation()', 'setAxialRotation()' or 'setScale()' methods instead as only these can be accumulated.");
            }),
            (c.prototype.setTranslation = function (e, t, i) {
                return 1 == arguments.length ? this.transform.setTranslation(e) : this.transform.setTranslation(e, t, i), this;
            }),
            (c.prototype.setVectorRotation = function (e, t, i, n) {
                return 2 == arguments.length ? this.transform.setVectorRotation(e, t) : this.transform.setVectorRotation(e, t, i, n), this;
            }),
            (c.prototype.setAxialRotation = function (e, t, i) {
                return 1 == arguments.length ? this.transform.setAxialRotation(e) : this.transform.setAxialRotation(e, t, i), this;
            }),
            (c.prototype.setScale = function (e) {
                return this.transform.setScale(e, e, e), this;
            }),
            (c.prototype._updateRotationByView = function () {
                var e,
                    t = 0;
                if ((this.updatePos(), this.fixedPlane))
                    switch (Math.abs(this.fixedPlane)) {
                        case 1:
                            t = 10;
                            break;
                        case 2:
                            t = 20;
                            break;
                        case 3:
                            t = 0;
                    }
                else this.parent.isViewedHorizontal && (t = (e = Math.abs(gl.orbitalView.cameraAzi)) < 45 || 135 < e ? 20 : 10);
                return (
                    this.flipAngle != t &&
                        (5 < t
                            ? this.axialXYOnly
                                ? 15 < t
                                    ? this.transform.setAxialRotation(90, 0, 0)
                                    : this.transform.setAxialRotation(0, 90, 0)
                                : 15 < t
                                ? this.transform.setAxialRotation(0, -90, 0)
                                : this.transform.setAxialRotation(90, 0, 0)
                            : this.transform.setAxialRotation(0, 0, 0),
                        (this.flipAngle = t)),
                    this
                );
            }),
            (c.prototype._updateRotationByVector = function (e, t) {
                var i;
                return (
                    this.updatePos(),
                    e ||
                        ((i = this.flipAngle),
                        1 == this.axis || -1 == this.axis || 2 == this.axis || -2 == this.axis
                            ? (i = this.parent.isViewedHorizontal ? 90 : 0)
                            : 3 == this.axis || -3 == this.axis
                            ? (i = (e = Math.abs(gl.orbitalView.cameraAzi)) < 44.99 ? -90 : 134.99 < e ? 90 : gl.orbitalView.cameraAzi < -44.99 ? 180 : 0)
                            : this.vVector && (i = (t = m.angleBetweenVectors(t, this.vVector)) < s || n < t ? 0 : 90),
                        this.flipAngle != i && (this.transform.setVectorRotation(i, this.vector), (this.flipAngle = i))),
                    this
                );
            }),
            (c.prototype._updateRotationByPlaneEqn = function (e, t) {
                return (
                    this.updatePos(),
                    e
                        ? this
                        : this.parent.planeEqn
                        ? (this.type == pdGL.MANIPULATOR_TYPE.ARROW
                              ? ((a = (r = m.angleBetweenVectors(t, this.vVector) * pd.Const.RAD2DEG) < o || 180 - o < r ? 0 : 90),
                                (this.axis = a < 45 ? 2 : 1),
                                this.flipAngle != a && (this.transform.setVectorRotation(a, this.vector), (this.flipAngle = a)))
                              : ((i = 0),
                                (n = -90),
                                (s = this.parent.planeEqn),
                                (a = pd3D.VectorArray.length(s)),
                                (this.axis = 0),
                                1e-12 < a && ((i = s[0] * s[0] < 1e-12 ? 0 : 90 + Math.atan2(s[1], s[0]) * pd.Const.RAD2DEG), (n = 90 - Math.asin(s[2] / a) * pd.Const.RAD2DEG)),
                                ((r = m.angleBetweenVectors(t, this.uVector) * pd.Const.RAD2DEG) < o || 180 - o < r) && ((this.axis = 1), (i += 90)),
                                ((r = m.angleBetweenVectors(t, this.vVector) * pd.Const.RAD2DEG) < o || 180 - o < r) && ((this.axis = 2), (n -= 90)),
                                this.transform.setAxialRotation(n, 0, i)),
                          this)
                        : this._updateRotationByView(e, t)
                );
                var i, n, s, a, r;
            }),
            (c.prototype.isOver = function (e, t, i) {
                return gl.orbitalView.modelToCanvas(this.canvasPos, this.modelPos), Math.abs(e - this.canvasPos[0]) < i && Math.abs(t - this.canvasPos[1]) < i;
            }),
            (c.prototype.distanceFromRay = function (e, t, i) {
                return (i = i || m.create()), r.intersect(i, e, t, this.getSelectionPlane()) ? m.distancePointToPoint(this.modelPos, i) : Number.MAX_VALUE;
            }),
            (c.prototype.distanceFromPoint = function (e) {
                return m.distancePointToPoint(this.modelPos, e);
            }),
            (c.prototype.drag = function (e, t) {
                var i = this.parent;
                if (i._dragReferencePos && i._dragIntersection) {
                    var n = m.create();
                    if (r.intersect(n, e, t, this.getSelectionPlane())) {
                        (e = i._dragReferencePos), (t = i._dragIntersection), (n = [e[0] + (n[0] - t[0]), e[1] + (n[1] - t[1]), e[2] + (n[2] - t[2])]);
                        return (
                            this.allowSnap && 0 < gl.orbitalView.snapGrid && ((t = p(gl.orbitalView.snapGrid)), (n[0] = pd.snapTo(n[0], t)), (n[1] = pd.snapTo(n[1], t)), this.parent.isViewedHorizontal && (n[2] = pd.snapTo(n[2], t))),
                            i._checkToMoveModelPos(n, this)
                        );
                    }
                }
                return !1;
            }),
            (c.prototype._dragByVector = function (e, t) {
                var i = this.parent;
                if (i && i._dragReferencePos) {
                    var n = m.create();
                    if (r.intersect(n, e, t, this.getSelectionPlane())) {
                        var s = this.vector,
                            a = i._dragReferencePos,
                            e = m.distanceInVectorDirection(a, s, n) - i._dragDistance,
                            t = p(gl.orbitalView.snapGrid),
                            n = Math.abs(this.axis || 0);
                        0 == n && 0 < t && (e = pd.snapTo(e, t));
                        s = [a[0] + e * s[0], a[1] + e * s[1], a[2] + e * s[2]];
                        if (this.allowSnap && 0 < n && 0 < t)
                            switch (n) {
                                case 1:
                                    s[0] = pd.snapTo(s[0], t);
                                    break;
                                case 2:
                                    s[1] = pd.snapTo(s[1], t);
                                    break;
                                case 3:
                                    s[2] = pd.snapTo(s[2], t);
                            }
                        return i._checkToMoveModelPos(s, this);
                    }
                }
                return !1;
            }),
            (c.prototype._dragToPointer = function (e, t) {
                var i = this.parent;
                if (i._dragReferencePos && i._dragIntersection) {
                    var n = m.create();
                    if (r.intersect(n, e, t, this.getSelectionPlane()))
                        return (
                            this.allowSnap && 0 < gl.orbitalView.snapGrid && ((t = p(gl.orbitalView.snapGrid)), (n[0] = pd.snapTo(n[0], t)), (n[1] = pd.snapTo(n[1], t)), this.parent.isViewedHorizontal && (n[2] = pd.snapTo(n[2], t))),
                            i._checkToMoveModelPos(n, this)
                        );
                }
                return !1;
            });
        var _ = [1, 1, 1, 1],
            x = [1, 0, 0, 1],
            a = [1, 0, 0, 0.15];
        function d(e, t, i, n) {
            if (e && t && 0 < n) {
                var s,
                    a,
                    r,
                    o,
                    l,
                    d,
                    h,
                    c = [0, 0, 0, 0],
                    p = [0, 0, 0, 0],
                    u = e.vertexCount(),
                    g = 0.5 * n,
                    m = pd.degreesToRadians(10),
                    f = !1,
                    _ = 18,
                    x = 9;
                switch (((e.twoSided = !0), i)) {
                    default:
                        h = pd.degreesToRadians(0);
                        break;
                    case 1:
                        (f = !0), (h = pd.degreesToRadians(30)), (_ = 12), (x = 6);
                        break;
                    case 2:
                        (f = !0), (h = pd.degreesToRadians(120)), (_ = 12), (x = 6);
                }
                (l = Math.sin(h)),
                    (d = Math.cos(h)),
                    (s = g * l + t[0]),
                    (a = g * d + t[1]),
                    (r = n * l + t[0]),
                    (o = n * d + t[1]),
                    pd.closeTo(h, 0) && ((r = 1.35 * n * l + t[0]), (o = 1.35 * n * d + t[1])),
                    (c[0] = e.addVertex([s, a, t[2]])),
                    (c[1] = e.addVertex([r, o, t[2]])),
                    (p[0] = e.addVertex([-s, -a, t[2]])),
                    (p[1] = e.addVertex([-r, -o, t[2]])),
                    f && (e.addLine(c[0], c[1]), e.addLine(p[0], p[1]));
                for (var v = 1; v <= _; ++v)
                    (h += m),
                        (l = Math.sin(h)),
                        (d = Math.cos(h)),
                        (s = g * l + t[0]),
                        (a = g * d + t[1]),
                        (r = n * l + t[0]),
                        (o = n * d + t[1]),
                        v % x == 0 && (!f || v < _) && ((r = 1.35 * n * l + t[0]), (o = 1.35 * n * d + t[1])),
                        (c[2] = e.addVertex([s, a, t[2]])),
                        (c[3] = e.addVertex([r, o, t[2]])),
                        e.addTriangle(c[1], c[0], c[2]),
                        e.addTriangle(c[1], c[2], c[3]),
                        e.addLine(c[0], c[2]),
                        e.addLine(c[1], c[3]),
                        (c[0] = c[2]),
                        (c[1] = c[3]),
                        (p[2] = e.addVertex([-s, -a, t[2]])),
                        (p[3] = e.addVertex([-r, -o, t[2]])),
                        e.addTriangle(p[1], p[0], p[2]),
                        e.addTriangle(p[1], p[2], p[3]),
                        e.addLine(p[0], p[2]),
                        e.addLine(p[1], p[3]),
                        (p[0] = p[2]),
                        (p[1] = p[3]);
                if (
                    (0 < f && (e.addLine(c[0], c[1]), e.addLine(p[0], p[1])),
                    (g = 0.2 * n),
                    e.addLine(e.addVertex([t[0] - g, t[1], t[2]]), e.addVertex([t[0] + g, t[1], t[2]])),
                    e.addLine(e.addVertex([t[0], t[1] - g, t[2]]), e.addVertex([t[0], t[1] + g, t[2]])),
                    3 <= i)
                )
                    for (var b, y = e.vertexCount(), v = u; v < y; ++v) (a = (b = e.vertices[v])[1]), (b[1] = b[2]), (b[2] = a);
                return 1;
            }
        }
        function h(e, t, i, n) {
            if (e && t && 0 < n) {
                var s,
                    a,
                    r,
                    o,
                    l = Math.PI / 16,
                    d = Math.PI / 8,
                    h = Math.PI + 0.5 * l,
                    c = e.vertexCount(),
                    p = c,
                    u = 1.8 * n,
                    g = 0.9 * n,
                    m = 1;
                (e.twoSided = !0),
                    e.addVertex([t[0], t[1] - n, t[2]]),
                    e.addVertex([t[0], t[1] - u, t[2]]),
                    e.addVertex([t[0] + g, t[1] - g, t[2]]),
                    e.addVertex([t[0] + u, t[1], t[2]]),
                    e.addVertex([t[0] + g, t[1] + g, t[2]]),
                    e.addVertex([t[0], t[1] + u, t[2]]),
                    e.addVertex([t[0], t[1] + n, t[2]]),
                    e.addLine(p + 0, p + 1),
                    e.addLine(p + 1, p + 2),
                    e.addLine(p + 2, p + 3),
                    e.addLine(p + 3, p + 4),
                    e.addLine(p + 4, p + 5),
                    e.addLine(p + 5, p + 6),
                    e.addLine(p + 6, p + 1),
                    (p += 7);
                for (var f = 0; f <= h; f += l)
                    (r = Math.sin(f)),
                        (o = Math.cos(f)),
                        (s = t[0] + n * r),
                        (a = t[1] - n * o),
                        (p = e.addVertex([s, a, t[2]])),
                        0 < f && (d < f && (e.addTriangle(m, p - 1, ++m), (d += Math.PI / 4)), e.addTriangle(m, p - 1, p), e.addLine(p - 1, p));
                for (f = 0; f <= h; f += l) (r = Math.sin(f)), (o = Math.cos(f)), (s = t[0] - n * r), (a = t[1] + n * o), (p = e.addVertex([s, a, t[2]])), 0 < f && e.addLine(p - 1, p);
                if (2 <= i) for (var _, p = e.vertexCount(), x = c; x < p; ++x) (a = (_ = e.vertices[x])[1]), (_[1] = _[0]), (_[0] = a);
                if (3 == i) {
                    p = e.vertexCount();
                    for (x = c; x < p; ++x) (a = (_ = e.vertices[x])[1]), (_[1] = _[2]), (_[2] = a);
                }
                return 1;
            }
        }
        function v(e, t, i, n, s, a) {
            if (e && t) {
                var r,
                    o,
                    l = e.vertexCount();
                (i = i || [1, 0, 0]), (n = n || [0, 1, 0]), (s = pd.toNumber(s, 1));
                for (
                    var d,
                        h = [
                            [-0.5, -0.25],
                            [-0.25, -0.25],
                            [-0.25, -0.5],
                            [0.5, 0],
                            [-0.25, 0.5],
                            [-0.25, 0.25],
                            [-0.5, 0.25],
                        ],
                        c = 0,
                        p = h.length;
                    c < p;
                    ++c
                )
                    (r = s * (d = h[c])[0]), (o = s * d[1]), e.addVertex([t[0] + r * i[0] + o * n[0], t[1] + r * i[1] + o * n[1], t[2] + r * i[2] + o * n[2]]);
                if (
                    (e.addTriangle(l + 0, l + 1, l + 5),
                    e.addTriangle(l + 0, l + 5, l + 6),
                    e.addTriangle(l + 2, l + 3, l + 4),
                    e.addTriangle(l + 0, l + 5, l + 1),
                    e.addTriangle(l + 0, l + 6, l + 5),
                    e.addTriangle(l + 2, l + 4, l + 3),
                    e.addLine(l + 0, l + 1),
                    e.addLine(l + 1, l + 2),
                    e.addLine(l + 2, l + 3),
                    e.addLine(l + 3, l + 4),
                    e.addLine(l + 4, l + 5),
                    e.addLine(l + 5, l + 6),
                    e.addLine(l + 6, l + 0),
                    (l = e.vertexCount()),
                    -0.5 < (a = pd.toInteger(a, 0)))
                ) {
                    if (0.5 < a) {
                        for (
                            h = [
                                [-0.15, -0.125],
                                [0.1, -0.125],
                                [-0.15, 0.125],
                                [0.1, 0.125],
                            ],
                                c = 0;
                            c < 4;
                            ++c
                        )
                            (r = s * (d = h[c])[0]), (o = s * d[1]), e.addVertex([t[0] + r * i[0] + o * n[0], t[1] + r * i[1] + o * n[1], t[2] + r * i[2] + o * n[2]]);
                        return e.addLine(l + 0, l + 1), e.addLine(l + 1, l + 2), e.addLine(l + 2, l + 3), 1;
                    }
                    if (0.999 < i[0]) {
                        for (
                            h = [
                                [-0.25, -0.125],
                                [0, 0.125],
                                [-0.25, 0.125],
                                [0, -0.125],
                            ],
                                c = 0;
                            c < 4;
                            ++c
                        )
                            (r = s * (d = h[c])[0]), (o = s * d[1]), e.addVertex([t[0] + r * i[0] + o * n[0], t[1] + r * i[1] + o * n[1], t[2] + r * i[2] + o * n[2]]);
                        return e.addLine(l + 0, l + 1), e.addLine(l + 2, l + 3), 1;
                    }
                    if (0.999 < i[1]) {
                        for (
                            h = [
                                [-0.125, 0],
                                [0, 0.125],
                                [0, -0.125],
                                [-0.25, 0],
                            ],
                                c = 0;
                            c < 4;
                            ++c
                        )
                            (r = s * (d = h[c])[0]), (o = s * d[1]), e.addVertex([t[0] + r * i[0] + o * n[0], t[1] + r * i[1] + o * n[1], t[2] + r * i[2] + o * n[2]]);
                        return e.addLine(l, l + 1), e.addLine(l, l + 2), e.addLine(l, l + 3), 1;
                    }
                    if (0.999 < i[2]) {
                        for (
                            h = [
                                [0, -0.125],
                                [0, 0.125],
                                [-0.25, -0.125],
                                [-0.25, 0.125],
                            ],
                                c = 0;
                            c < 4;
                            ++c
                        )
                            (r = s * (d = h[c])[0]), (o = s * d[1]), e.addVertex([t[0] + r * i[0] + o * n[0], t[1] + r * i[1] + o * n[1], t[2] + r * i[2] + o * n[2]]);
                        return e.addLine(l + 0, l + 1), e.addLine(l + 1, l + 2), e.addLine(l + 2, l + 3), 1;
                    }
                }
                for (
                    h = [
                        [0, 0],
                        [-0.125, -0.125],
                        [-0.125, 0.125],
                    ],
                        c = 0;
                    c < 3;
                    ++c
                )
                    (r = s * (d = h[c])[0]), (o = s * d[1]), e.addVertex([t[0] + r * i[0] + o * n[0], t[1] + r * i[1] + o * n[1], t[2] + r * i[2] + o * n[2]]);
                return e.addLine(l, l + 1), e.addLine(l, l + 2), 1;
            }
        }
        function b(e, t) {
            if (e && t) {
                var i,
                    n,
                    s,
                    a,
                    r = t.min,
                    o = t.max,
                    l = [0.5 * (r[0] + o[0]), 0.5 * (r[1] + o[1]), 0.5 * (r[2] + o[2])],
                    d = ((p = Math.abs(o[0] - r[0])) + (u = Math.abs(o[1] - r[1])) + (g = Math.abs(o[2] - r[2]))) / 3,
                    h = 0.1 * pdGL.Hotspot3D.getRelativeSize(0.02 * d),
                    t = 0.05 * h,
                    c = 6 * h,
                    p = d < p ? 0.75 * d : 0.75 * p,
                    u = d < u ? 0.75 * d : 0.75 * u,
                    g = d < g ? 0.75 * d : 0.75 * g;
                e.color([1, 0, 0, 1]),
                    (s = e.addVertex([r[0] - t, r[1] - t, r[2] - t])),
                    e.addVertex([o[0] + t, r[1] - t, r[2] - t]),
                    e.addVertex([o[0] + t, o[1] + t, r[2] - t]),
                    e.addVertex([r[0] - t, o[1] + t, r[2] - t]),
                    e.addVertex([r[0] - t, r[1] - t, o[2] + t]),
                    e.addVertex([o[0] + t, r[1] - t, o[2] + t]),
                    e.addVertex([o[0] + t, o[1] + t, o[2] + t]),
                    e.addVertex([r[0] - t, o[1] + t, o[2] + t]),
                    e.color([1, 0, 0, 0]);
                for (var m = 0; m < 8; ++m)
                    (n = s + m),
                        (i = e.vertices[n]),
                        (a = e.addVertex([i[0] + (i[0] < l[0] ? p : -p), i[1], i[2]])),
                        e.addVertex([i[0], i[1] + (i[1] < l[1] ? u : -u), i[2]]),
                        e.addVertex([i[0], i[1], i[2] + (i[2] < l[2] ? g : -g)]),
                        e.addVertex([i[0] - (i[0] < l[0] ? c : -c), i[1], i[2]]),
                        e.addVertex([i[0], i[1] - (i[1] < l[1] ? c : -c), i[2]]),
                        e.addVertex([i[0], i[1], i[2] - (i[2] < l[2] ? c : -c)]),
                        e.addVertex([i[0] + (i[0] < l[0] ? h : -h), i[1] + (i[1] < l[1] ? h : -h), i[2]]),
                        e.addTriangle(n, a + 6, a + 0),
                        e.addTriangle(n, a + 0, a + 6),
                        e.addTriangle(n, a + 6, a + 1),
                        e.addTriangle(n, a + 1, a + 6),
                        e.addTriangle(n, a + 6, a + 3),
                        e.addTriangle(n, a + 3, a + 6),
                        e.addTriangle(n, a + 6, a + 4),
                        e.addTriangle(n, a + 4, a + 6),
                        e.addVertex([i[0], i[1] + (i[1] < l[1] ? h : -h), i[2] + (i[2] < l[2] ? h : -h)]),
                        e.addTriangle(n, a + 7, a + 1),
                        e.addTriangle(n, a + 1, a + 7),
                        e.addTriangle(n, a + 7, a + 2),
                        e.addTriangle(n, a + 2, a + 7),
                        e.addTriangle(n, a + 7, a + 4),
                        e.addTriangle(n, a + 4, a + 7),
                        e.addTriangle(n, a + 7, a + 5),
                        e.addTriangle(n, a + 5, a + 7),
                        e.addVertex([i[0] + (i[0] < l[0] ? h : -h), i[1], i[2] + (i[2] < l[2] ? h : -h)]),
                        e.addTriangle(n, a + 8, a + 0),
                        e.addTriangle(n, a + 0, a + 8),
                        e.addTriangle(n, a + 8, a + 2),
                        e.addTriangle(n, a + 2, a + 8),
                        e.addTriangle(n, a + 8, a + 3),
                        e.addTriangle(n, a + 3, a + 8),
                        e.addTriangle(n, a + 8, a + 5),
                        e.addTriangle(n, a + 5, a + 8);
                return !0;
            }
            return !1;
        }
        function y(e, t) {
            var i = !1;
            return e && (e.reuseStart(), (i = b(e, t)), e.reuseEnd(), e.compile()), i;
        }
        function S(e, t, i, n) {
            if (!e || !e.isHotspot) throw new Error("Must pass a valid pdGL.Hotspot3D object as the 'hotspot' parameter.");
            var s = new pd3D.Mesh({ normals: !1, lines: !0 }),
                e = new c(e);
            return (
                (s.defaultNormal = [0, 0, 1]),
                (e.vVector = s.defaultNormal),
                (e.type = pdGL.MANIPULATOR_TYPE.SQUARE),
                (i = 0.5 * pd.toNumber(i, 0.6)),
                (n = pd.toNumber(n, 0.9)),
                (t = pd.toInteger(t, 0)),
                s.addVertex([-i, -i, 0]),
                s.addVertex([i, -i, 0]),
                s.addVertex([i, i, 0]),
                s.addVertex([-i, i, 0]),
                s.addTriangle(0, 1, 2),
                s.addTriangle(0, 2, 1),
                s.addTriangle(0, 2, 3),
                s.addTriangle(0, 3, 2),
                s.addLine(0, 1),
                s.addLine(1, 2),
                s.addLine(2, 3),
                s.addLine(3, 0),
                (i *= 0.5),
                s.addLine(s.addVertex([-i, 0, 0]), s.addVertex([i, 0, 0])),
                s.addLine(s.addVertex([0, -i, 0]), s.addVertex([0, i, 0])),
                (t && 1 != t) || s.addLine(s.addVertex([0, i, 0]), s.addVertex([0, n, 0])),
                (t && 2 != t) || s.addLine(s.addVertex([i, 0, 0]), s.addVertex([n, 0, 0])),
                s.compile(),
                e.addMesh(s, g()),
                e
            );
        }
        function M(e, t, i) {
            if (!e || !e.isHotspot) throw new Error("Must pass a valid pdGL.Hotspot3D object as the 'hotspot' parameter.");
            var n = [0, 0, 0];
            (i = 0.5 * pd.toNumber(i, 0.8)), pd.isArray(t) && (m.set(n, t), (e.planeEqn = m.normalize(n.slice())), (t = 0)), (t = Math.abs(pd.toInteger(t, 0)));
            var s = new pd3D.Mesh({ normals: !1, lines: !0 });
            d(s, m.origin, Math.min(t, 3), i), (s.defaultNormal = [0, 0, 1]), s.compile();
            var a,
                i = new c(e);
            return (
                (i.type = pdGL.MANIPULATOR_TYPE.CIRCLE),
                1 <= t && t <= 3 && ((n[Math.abs(t) - 1] = pd.sign(t)), (i.axis = t)),
                0 < t &&
                    ((i.vector = m.normalize(n.slice())),
                    (i.relativeOffset = 0),
                    (a = 0.95 < Math.abs(n[2]) ? [0, 1, 0] : [0, 0, 1]),
                    (i.uVector = m.cross(m.create(), n, a)),
                    (i.vVector = m.cross(s.defaultNormal, n, i.uVector)),
                    (i.getSelectionPlane = i._getSelectionPlaneByVector),
                    (i.updateRotation = i._updateRotationByVector),
                    (i.drag = i._dragByVector)),
                e.planeEqn &&
                    ((a = 0.95 < Math.abs(e.planeEqn[2]) ? [0, 1, 0] : [0, 0, 1]),
                    (i.uVector = m.cross([], e.planeEqn, a)),
                    (i.vVector = m.cross([], e.planeEqn, i.uVector)),
                    (i.getSelectionPlane = i._getSelectionPlaneByPlaneEqn),
                    (i.updateRotation = i._updateRotationByPlaneEqn)),
                i.addMesh(s, g()),
                i
            );
        }
        function w(e, t, i) {
            if (!e || !e.isHotspot) throw new Error("Must pass a valid pdGL.Hotspot3D object as the 'hotspot' parameter.");
            (i = pd.toNumber(i, 0.4)), (t = pd.toInteger(t, 0));
            var n = new pd3D.Mesh({ normals: !1, lines: !0 });
            h(n, m.origin, t, i), (n.defaultNormal = [0, 0, 1]), n.compile();
            var s = new c(e);
            return (
                (s.type = pdGL.MANIPULATOR_TYPE.SECTION),
                1 <= t &&
                    t <= 3 &&
                    ((i = [0, 0, 0]),
                    (t = Math.round(pd.constrainTo(t, -3, 3))),
                    (i[Math.abs(t) - 1] = pd.sign(t)),
                    (s.vector = m.normalize(i.slice())),
                    (s.relativeOffset = 0),
                    (e = 0.95 < Math.abs(i[2]) ? [0, 1, 0] : [0, 0, 1]),
                    (s.uVector = m.cross(m.create(), i, e)),
                    (s.vVector = m.cross(n.defaultNormal, i, s.uVector)),
                    (s.getSelectionPlane = s._getSelectionPlaneByVector),
                    (s.updateRotation = s._updateRotationByVector),
                    (s.drag = s._dragByVector),
                    (s.axis = t)),
                s.addMesh(n, g()),
                s
            );
        }
        function L(e, t, i) {
            if (!e || !e.isHotspot) throw new Error("Must pass a valid pdGL.Hotspot3D object as the 'hotspot' parameter.");
            var n = new pd3D.Mesh({ normals: !1, lines: !0 }),
                s = new c(e);
            (t = t || [-1, -1, 0]),
                (i = pd.toNumber(i, 0.4)),
                (n.defaultNormal = [0, 0, 1]),
                (s.vVector = n.defaultNormal),
                (s.type = pdGL.MANIPULATOR_TYPE.TOUCH),
                (s.modelPos[0] = t[0]),
                (s.modelPos[1] = t[1]),
                (function (e, t, i) {
                    if (e && t && 0 < i) {
                        var n,
                            s,
                            a = pd.Const.TWO_PI / 24,
                            r = e.vertexCount(),
                            o = r + 2;
                        e.addVertex([t[0], t[1], t[2]]), e.addVertex([t[0], t[1] + i, t[2]]);
                        for (var l = a; l < pd.Const.TWO_PI; l += a) (n = i * Math.sin(l) + t[0]), (s = i * Math.cos(l) + t[1]), e.addVertex([n, s, t[2]]), e.addTriangle(r, o - 1, o), e.addTriangle(r, o, o - 1), e.addLine(o - 1, o), o++;
                    }
                })(n, (s.offsetVector = t), i);
            var a = n.vertexCount(),
                r = pd.sign(t[0]),
                o = pd.sign(t[1]),
                l = Math.abs(t[0]),
                d = Math.abs(t[1]),
                h = Math.min(l, d),
                e = Math.max(l, d);
            return (
                i + 0.1 < e && d + i < l
                    ? (n.addVertex([0.1 * r, 0.1 * o, 0]), n.addVertex([r * h, o * h, 0]), n.addVertex([r * (l - i), o * h, 0]), n.addLine(a + 2, a + 1), n.addLine(a + 1, a))
                    : i + 0.1 < e && l + i < d
                    ? (n.addVertex([0.1 * r, 0.1 * o, 0]), n.addVertex([r * h, o * h, 0]), n.addVertex([r * h, o * (d - i), 0]), n.addLine(a + 2, a + 1), n.addLine(a + 1, a))
                    : i < l && ((t = [t[0], t[1], 0]), (i = m.length(t) - i), (t = m.normalize(t)), n.addVertex([0.15 * t[0], 0.15 * t[1], 0]), n.addVertex([t[0] * i, t[1] * i, 0]), n.addLine(a + 1, a)),
                n.compile(),
                s.addMesh(n, g()),
                s
            );
        }
        function D(e, t, i) {
            if (!e || !e.isHotspot) throw new Error("Must pass a valid pdGL.Hotspot3D object as the 'hotspot' parameter.");
            i = i || {};
            var n = pd.toBoolean(i.noLines, !1),
                s = pd.toNumber(i.offset, 1.5);
            t = t || [1, 0, 0];
            var a = new pd3D.Mesh({ normals: !1, lines: !0 }),
                r = new c(e);
            (a.defaultNormal = [0, 0, 1]),
                (r.vector = m.normalize(t.slice())),
                (r.type = pdGL.MANIPULATOR_TYPE.ARROW),
                (r.relativeOffset = s),
                (t = r.vector),
                (r.modelPos[0] = s * t[0]),
                (r.modelPos[1] = s * t[1]),
                (r.modelPos[2] = s * t[2]);
            e = 0.95 < Math.abs(r.vector[2]) ? [0, 1, 0] : [0, 0, 1];
            return (
                (r.uVector = m.cross(m.create(), r.vector, e)),
                (r.vVector = m.cross(a.defaultNormal, r.vector, r.uVector)),
                pd.closeTo(s, 0)
                    ? (function (e, t, i, n, s) {
                          if (e && t) {
                              var a,
                                  r = e.vertexCount();
                              (i = i || [1, 0, 0]), (n = n || [0, 1, 0]), (s = pd.toNumber(s, 1));
                              for (
                                  var o,
                                      l = [
                                          [-0.5, -0.5],
                                          [0.5, -0.5],
                                          [0.5, 0.5],
                                          [-0.5, 0.5],
                                      ],
                                      d = 0,
                                      h = l.length;
                                  d < h;
                                  ++d
                              )
                                  (a = s * (o = l[d])[0]), (o = s * o[1]), e.addVertex([t[0] + a * i[0] + o * n[0], t[1] + a * i[1] + o * n[1], t[2] + a * i[2] + o * n[2]]);
                              e.addTriangle(r + 0, r + 1, r + 2),
                                  e.addTriangle(r + 0, r + 2, r + 3),
                                  e.addTriangle(r + 2, r + 1, r + 0),
                                  e.addTriangle(r + 3, r + 2, r + 0),
                                  e.addLine(r + 0, r + 1),
                                  e.addLine(r + 1, r + 2),
                                  e.addLine(r + 2, r + 3),
                                  e.addLine(r + 3, r + 0);
                          }
                      })(a, r.modelPos, r.vector, r.uVector, 0.5)
                    : v(a, r.modelPos, r.vector, r.uVector, 1, i.arrow ? -1 : 0),
                n || ((n = s - 0.5), (s = a.vertexCount()), a.addVertex([0.25 * t[0], 0.25 * t[1], 0.25 * t[2]]), a.addVertex([n * t[0], n * t[1], n * t[2]]), a.addLine(s, s + 1)),
                a.compile(),
                0.999 < t[0] ? (r.axis = 1) : t[0] < -0.999 ? (r.axis = -1) : 0.999 < t[1] ? (r.axis = 2) : t[1] < -0.999 ? (r.axis = -2) : 0.999 < t[2] ? (r.axis = 3) : t[2] < -0.999 ? (r.axis = -3) : (r.axis = 0),
                (r.getSelectionPlane = r._getSelectionPlaneByVector),
                (r.updateRotation = r._updateRotationByVector),
                (r.drag = r._dragByVector),
                r.addMesh(a, g()),
                r
            );
        }
        function T(e, t, i, n, s) {
            (t = t || [1, 0, 0]),
                (i = pd.toNumber(i, 1.5)),
                (e.vector = m.normalize(t.slice())),
                (e.relativeOffset = i),
                (t = e.vector),
                (e.modelPos[0] = i * t[0]),
                (e.modelPos[1] = i * t[1]),
                (e.modelPos[2] = i * t[2]),
                n || ((i = 0.95 < Math.abs(t[2]) ? [0, 1, 0] : [0, 0, 1]), (n = m.cross(e.uVector || [], t, i))),
                (s = s || m.cross(e.vVector || [], t, n)),
                (e.uVector = m.set(e.uVector || [], n)),
                (e.vVector = m.set(e.vVector || [], s));
            s = e.getMeshesByMaterial(g());
            return (
                0 < s.length && ((s = s[0]).reuseStart(), v(s, e.modelPos, e.vector, e.uVector, 1, -1), s.reuseEnd(), s.compile(), gl.update()),
                0.999 < t[0] ? (e.axis = 1) : t[0] < -0.999 ? (e.axis = -1) : 0.999 < t[1] ? (e.axis = 2) : t[1] < -0.999 ? (e.axis = -2) : 0.999 < t[2] ? (e.axis = 3) : t[2] < -0.999 ? (e.axis = -3) : (e.axis = 0),
                (e.getSelectionPlane = e._getSelectionPlaneByVector),
                (e.updateRotation = e._updateRotationByVector),
                (e.drag = e._dragByVector),
                e
            );
        }
        (c.prototype._render = function (e, t) {
            var i,
                n,
                s,
                a = pd3D.RENDER_ALL,
                r = g(),
                o = 0 < t,
                l = 1;
            if (this.type == pdGL.MANIPULATOR_TYPE.ARROW && pd.isArray(this.vector)) {
                var d = m.angleBetweenVectors(e, this.vector);
                if ((d < 0.1745329252 ? (l = pd.mapAndConstrainTo(d, 0, 0.1745329252, 0, 0.25)) : 2.9670597284 < d && (l = pd.mapAndConstrainTo(d, Math.PI, 2.9670597284, 0, 0.25)), (l *= l) < 0.1)) return this;
            }
            for (i in (this.updateRotation(o, e), l < 1 && ((x[3] *= l), (_[3] *= l)), this.callbackOnDraw && this.callbackOnDraw(this, a), this.transformMatrix && (gl.pushMatrix(), gl.multMatrix(this.transformMatrix)), this.geometry)) {
                this.geometry.hasOwnProperty(i) &&
                    ((n = this.geometry[i]),
                    0 <= t && (n.material.id == r.id && n.material.uniform("color", _), n.material.renderSurfaces(n.meshes)),
                    n.material.id == r.id && n.material.uniform("color", x),
                    n.material.renderOutlines(n.meshes).endRender());
            }
            for (var h = 0, c = this.children.length; h < c; ++h) (s = this.children[h]) && s.draw && s.draw(a);
            return this.transformMatrix && gl.popMatrix(), l < 1 && ((x[3] /= l), (_[3] /= l)), this;
        }),
            (pdGL.Hotspot3D = function (e) {
                (e = e || {}),
                    pd3D.Node.call(this, e.name, "Hotspot"),
                    (this.isHotspot = !0),
                    (this.modelPos = pd.isArray(e.modelPos) ? e.modelPos : [0, 0, 0]),
                    (this.canvasPos = [0, 0, 0]),
                    (this.planeEqn = null),
                    e.planeEqn && this.setOrientation(e.planeEqn),
                    1e-6 < m.length(this.modelPos) && this.setTransform(pd3D.Matrix.translate(this.modelPos[0], this.modelPos[1], this.modelPos[2])),
                    (this.callbackOnSelect = e.callbackOnSelect || null),
                    (this.callbackOnDeselect = e.callbackOnDeselect || null),
                    (this.callbackOnChanging = e.callbackOnChanging || null),
                    (this.callbackOnChange = e.callbackOnChange || null),
                    (this.callbackOnChanged = e.callbackOnChanged || null),
                    (this.callbackOnDragStart = e.callbackOnDragStart || null),
                    (this.callbackOnDragEnd = e.callbackOnDragEnd || null),
                    (this.alwaysCheckSelector = !1),
                    (this.relativeSize = pd.toNumber(e.relativeSize, 100)),
                    (this.selectedChildIndex = -1),
                    (this.isViewedHorizontal = !1),
                    (this.isHovered = !1),
                    (this._hasMoved = !1),
                    (this._selected = !1),
                    (this._dragReferencePos = null),
                    (this._dragIntersection = null),
                    (this._dragDistance = 0),
                    (this._opacity = 0.25),
                    (this._ray = { start: null, direction: null, end: null }),
                    pd.addSimpleEventHandling(this);
            }),
            (pdGL.Hotspot3D.prototype = Object.create(pd3D.Node.prototype)),
            (pdGL.Hotspot3D.prototype.constructor = pdGL.Hotspot3D),
            (pdGL.Hotspot3D.getFlipThresholdAngle = function () {
                return o;
            }),
            (pdGL.Hotspot3D.setFlipThresholdAngle = function (e) {
                return (o = pd.constrainTo(pd.toNumber(e, 20), 0, 90));
            }),
            (pdGL.Hotspot3D.altBelowFlipThresholdAngle = function (e) {
                e = pd.Const.RAD2DEG * m.angleBetweenVectors(e, m.unitZ);
                return pd.closeTo(e, 90, o);
            }),
            (pdGL.Hotspot3D.arrowSizeFactor = 3.5),
            (pdGL.Hotspot3D.selectRadiusModifier = 0.6);
        var E = -1;
        (pdGL.Hotspot3D.setRelativeSize = function (e) {
            E = pd.toNumber(e, 100) * pdGL.Hotspot3D.arrowSizeFactor;
        }),
            (pdGL.Hotspot3D.getRelativeSize = function (e) {
                var t;
                return (
                    E < 1e-9 && ((t = e), (e = pdGL.Scene3D.getActiveScene()), (E = e ? e.modelUnit * pdGL.Hotspot3D.arrowSizeFactor : gl.orbitalView ? gl.orbitalView.getPointSize() * pdGL.Hotspot3D.arrowSizeFactor : pd.toNumber(t, 100))),
                    E
                );
            }),
            (pdGL.Hotspot3D.getManipulatorSize = function () {
                return pdGL.Hotspot3D.getRelativeSize() / Math.max(0.1, gl.orbitalView.zoomFactor);
            });
        var A = !(pdGL.Hotspot3D.useDetachedCursor = function (e) {
            _[2] = e ? 0.4 : 1;
        });
        function P(e, t) {
            var i = gl.orbitalView ? 1e-6 * gl.orbitalView.getPointSize() : 1e-9;
            return !m.closeTo(e, t, i);
        }
        (pdGL.Hotspot3D.captureEvent = function (e) {
            return 0 < arguments.length && (A = pd.toBoolean(e, A)), A;
        }),
            (pdGL.Hotspot3D.prototype.getModelSelectionRadius = function () {
                return pdGL.Hotspot3D.selectRadiusModifier * this.relativeSize;
            }),
            (pdGL.Hotspot3D.prototype._isOverManipulator = function (e, t) {
                for (var i = m.create(), n = this.getModelSelectionRadius(), s = gl.orbitalView.canvasToModel(e, t, 0).toArray(), a = gl.orbitalView.canvasToModel(e, t, 1).toArray(), r = 0, o = this.children.length; r < o; ++r) {
                    var l = this.children[r];
                    if (l && l.visible && l.distanceFromRay && l.distanceFromRay(s, a, i) < n) return !0;
                }
                return !1;
            }),
            (pdGL.Hotspot3D.prototype._isOverSelector = function (e, t, i) {
                return gl.orbitalView.modelToCanvas(this.canvasPos, this.modelPos), Math.abs(e - this.canvasPos[0]) < i && Math.abs(t - this.canvasPos[1]) < i;
            }),
            (pdGL.Hotspot3D.prototype.isOver = function (e, t, i) {
                if (this.visible && this.active) {
                    if (this._selected && this._isOverManipulator(e, t)) return !0;
                    if (!this._selected || this.alwaysCheckSelector) return this._isOverSelector(e, t, i);
                }
                return !1;
            }),
            (pdGL.Hotspot3D.prototype._updatePosition = function () {
                for (var e, t = this.modelPos, i = 0, n = this.children.length; i < n; ++i) {
                    var s = this.children[i];
                    s && s.visible && s.updatePos && s.updatePos();
                }
                1e-6 < m.length(t)
                    ? this.transformMatrix
                        ? (((e = this.transformMatrix.m)[3] = t[0]), (e[7] = t[1]), (e[11] = t[2]))
                        : this.setTransform(pd3D.Matrix.translate(t[0], t[1], t[2]))
                    : this.transformMatrix && delete this.transformMatrix,
                    (this._hasMoved = !0),
                    gl.update();
            }),
            (pdGL.Hotspot3D.prototype.useNewModelPos = function (e) {
                return !!(pd.isArray(e) && 2 < e.length) && ((this.modelPos = e), this._updatePosition(), !0);
            }),
            (pdGL.Hotspot3D.prototype.moveModelPos = function (e, t) {
                return !!P(e, this.modelPos) && (this.planeEqn && pd3D.PlaneArray.closestAxialPoint(e, e, this.planeEqn), m.set(this.modelPos, e), this.callbackOnChange && this.callbackOnChange(this, t), this._updatePosition(), !0);
            }),
            (pdGL.Hotspot3D.prototype._checkToMoveModelPos = function (e, t) {
                return !!P(e, this.modelPos) && !(this.callbackOnChanging && !this.callbackOnChanging(this, t, e)) && this.moveModelPos(e, t);
            }),
            (pdGL.Hotspot3D.prototype.hasMoved = function () {
                return this._hasMoved;
            }),
            (pdGL.Hotspot3D.prototype.isPreSelected = function () {
                return this._preSelected;
            }),
            (pdGL.Hotspot3D.prototype.getSelected = function () {
                return this._selected;
            }),
            (pdGL.Hotspot3D.prototype.setSelected = function (e) {
                return this._selected != e && ((this._selected = e), (this._preSelected = !1), (this.selectedChildIndex = -1), this.emit("selected", e), gl.update()), this;
            }),
            (pdGL.Hotspot3D.prototype.cancelPreSelection = function () {
                return this._preSelected && this.emit("preselect", !1), (this._preSelected = !1), this;
            }),
            (pdGL.Hotspot3D.prototype.getSelectedChildIndex = function () {
                return this.selectedChildIndex;
            }),
            (pdGL.Hotspot3D.prototype.setSelectedChildIndex = function (e) {
                var t;
                this.selectedChildIndex != e && (((t = this.children[e]) && !t.visible) || ((t = this.selectedChildIndex), (this.selectedChildIndex = e), this.emit("select:child", 0 <= e, e, t), gl.update())),
                    this.selectedChildIndex < 0 && ((this._dragIntersection = null), (this._dragReferencePos = null), (this._dragDistance = 0));
            }),
            (pdGL.Hotspot3D.prototype.getSelectedManipulator = function () {
                var e = this.selectedChildIndex;
                if (0 <= e && e < this.children.length) {
                    e = this.children[e];
                    if (e && e.drag) return e;
                }
                return null;
            }),
            (pdGL.Hotspot3D.prototype._checkProximityToSelector = function (e, t) {
                return m.distancePointToLineSegment(this.modelPos, e.start, e.end) < t;
            }),
            (pdGL.Hotspot3D.prototype._selectManipulator = function (e, t, i) {
                for (var n, s = -1, a = Number.MAX_VALUE, r = m.create(), o = 1.25 * i, l = !1, d = 0, h = this.children.length; d < h; ++d) {
                    var c = this.children[d];
                    c &&
                        c.visible &&
                        c.distanceFromRay &&
                        ((n = c.distanceFromRay(e, t, r)) < o && (l = !0),
                        n < i &&
                            n < a &&
                            ((s = d),
                            (this._dragIntersection = r.slice()),
                            c.vector ? (this._dragDistance = m.distanceInVectorDirection(this.modelPos, c.vector, r)) : (this._dragDistance = m.distancePointToPoint(this.modelPos, r)),
                            (a = n)));
                }
                return (
                    this.setSelectedChildIndex(s),
                    0 <= this.selectedChildIndex && ((this._dragReferencePos = this.modelPos.slice()), this.boundingBox && f.set(this._dragBoxOriginalPos, this.boundingBox.min, this.boundingBox.max, this.boundingBox.axis)),
                    l
                );
            }),
            (pdGL.Hotspot3D.prototype.handleSelectEvent = function (e, t, i) {
                if (this.visible && this.active) {
                    var n = this.getModelSelectionRadius();
                    if (
                        ((this._ray.start = gl.orbitalView.canvasToModel(e.x, e.y, 0).toArray()),
                        (this._ray.end = gl.orbitalView.canvasToModel(e.x, e.y, 1).toArray()),
                        (this._hasMoved = !1),
                        this._selected && (A = this._selectManipulator(this._ray.start, this._ray.end, n)) && this.callbackOnDragStart && this.callbackOnDragStart(this, e),
                        !this._selected || !A)
                    ) {
                        if ((!this._selected || this.alwaysCheckSelector) && this._checkProximityToSelector(this._ray, n, !1)) return i || (A = !0), !0;
                        this.callbackOnSelect && (A = this.callbackOnSelect(this, e));
                    }
                    return A;
                }
                return !1;
            }),
            (pdGL.Hotspot3D.prototype.handleDragEvent = function (e) {
                var t;
                return (
                    !this._selected ||
                        (0 <= (t = this.selectedChildIndex) &&
                            t < this.children.length &&
                            (t = this.children[t]) &&
                            t.drag &&
                            ((this._ray.start = gl.orbitalView.canvasToModel(e.x, e.y, 0).toArray()), (this._ray.end = gl.orbitalView.canvasToModel(e.x, e.y, 1).toArray()), t.drag(this._ray.start, this._ray.end))),
                    A
                );
            }),
            (pdGL.Hotspot3D.prototype.handleReleaseEvent = function (e) {
                var t = A;
                return (
                    (A = !1),
                    t
                        ? (this._hasMoved && this.callbackOnChanged && this.callbackOnChanged(this, e), this.callbackOnDragEnd && this.callbackOnDragEnd(this, e), this.setSelectedChildIndex(-1))
                        : pdDOM.Interaction.hasMoved() || (this.callbackOnDeselect && this.callbackOnDeselect(this, e)) || this.setSelected(!1),
                    (this._hasMoved = !1),
                    t
                );
            }),
            (pdGL.Hotspot3D.prototype._render = function () {
                var e,
                    t,
                    i = x[3],
                    n = _[3],
                    s = this._opacity,
                    a = gl.orbitalView.getVectorToCamera(this.modelPos[0], this.modelPos[1], this.modelPos[2]),
                    r = pdGL.Hotspot3D.getManipulatorSize();
                for (e in (this.selectedChildIndex < 0 && (this.isViewedHorizontal = pdGL.Hotspot3D.altBelowFlipThresholdAngle(a)),
                (this.relativeSize = r),
                this.callbackOnDraw && this.callbackOnDraw(this),
                gl.pushMatrix(),
                gl.pushLineWidth(gl.getCanvasLineWidth()),
                this.transformMatrix && gl.multMatrix(this.transformMatrix),
                gl.scale(r),
                this._preSelected && !this._selected && (s *= 0.6),
                (x[3] = s),
                g().uniform("color", x),
                this.geometry)) {
                    this.geometry.hasOwnProperty(e) && (t = this.geometry[e]).material.renderMeshes(t.meshes, u).endRender();
                }
                if (this._selected || this._preSelected) {
                    var o,
                        l = this._preSelected ? -1 : 0,
                        d = this.selectedChildIndex;
                    this._preSelected && gl.disable(gl.DEPTH_TEST);
                    for (var h = 0, c = this.children.length; h < c; ++h) {
                        var p = this.children[h];
                        p && p.visible && p._render && ((o = l || (d == h ? 1 : 0)), (_[3] = o ? Math.max(s, 0.25) : 0.6 * s), p._render(a, o));
                    }
                    this._preSelected && gl.enable(gl.DEPTH_TEST);
                }
                (x[3] = i), (_[3] = n), gl.popLineWidth(), gl.popMatrix();
            }),
            (pdGL.Hotspot3D.prototype.addCenterSphere = function () {
                return this.addMesh(l(), g()), this;
            }),
            (pdGL.Hotspot3D.prototype.addCenterCircle = function (e, t) {
                return this.addChild(M(this, e, t)), this;
            }),
            (pdGL.Hotspot3D.prototype.addCenterPushPull = function (e) {
                return (
                    this.addChild(
                        (function (e, t) {
                            if (!e || !e.isHotspot) throw new Error("Must pass a valid pdGL.Hotspot3D object as the 'hotspot' parameter.");
                            var i = new pd3D.Mesh({ normals: !1, lines: !0 }),
                                n = new c(e);
                            return (
                                (i.defaultNormal = [0, 0, 1]),
                                (n.vVector = i.defaultNormal),
                                (n.type = pdGL.MANIPULATOR_TYPE.PUSH_PULL),
                                (n.fixedPlane = 3),
                                (t = 0.5 * pd.toNumber(t, 1)),
                                (e = i.addVertex([0.5 * t, -t, 0])),
                                i.addVertex([1.5 * t, 0, 0]),
                                i.addVertex([0.5 * t, t, 0]),
                                i.addVertex([-0.5 * t, t, 0]),
                                i.addVertex([-1.5 * t, 0, 0]),
                                i.addVertex([-0.5 * t, -t, 0]),
                                i.addTriangle(e + 0, e + 1, e + 2),
                                i.addTriangle(e + 3, e + 4, e + 5),
                                i.addLine(e + 0, e + 1),
                                i.addLine(e + 1, e + 2),
                                i.addLine(e + 2, e + 0),
                                i.addLine(e + 3, e + 4),
                                i.addLine(e + 4, e + 5),
                                i.addLine(e + 5, e + 3),
                                (e = i.addVertex([0.75 * t, 0.25 * t, 0])),
                                i.addVertex([+t, 0, 0]),
                                i.addVertex([0.75 * t, -0.25 * t, 0]),
                                i.addLine(e + 0, e + 1),
                                i.addLine(e + 1, e + 2),
                                (e = i.addVertex([-0.75 * t, 0.25 * t, 0])),
                                i.addVertex([-1 * t, 0, 0]),
                                i.addVertex([-0.75 * t, -0.25 * t, 0]),
                                i.addLine(e + 0, e + 1),
                                i.addLine(e + 1, e + 2),
                                i.compile(),
                                n.addMesh(i, g()),
                                n
                            );
                        })(this, e)
                    ),
                    this.addCenterSphere(),
                    this
                );
            }),
            (pdGL.Hotspot3D.prototype.addArrowVector = function (e, t) {
                t = { offset: t, arrow: !0 };
                return this.addChild(D(this, e, t)), this.children[this.children.length - 1].updatePos(), this;
            }),
            (pdGL.Hotspot3D.prototype.addAxialArrows = function (e, t) {
                var i = this.children.length;
                i < 1 && this.addMesh(l(), g());
                var n = { noLines: !0, offset: 1.5 };
                switch ((e = pd.toInteger(e, 0))) {
                    default:
                    case 0:
                        switch ((t = Math.abs(pd.toNumber(t, 0)))) {
                            default:
                                this.addChild(D(this, [1, 0, 0], n)), this.addChild(D(this, [0, 1, 0], n)), this.addChild(D(this, [0, 0, 1], n)), (t = 0);
                                break;
                            case 1:
                                this.addChild(D(this, [0, 1, 0], n)), this.addChild(D(this, [0, -1, 0], n)), this.addChild(D(this, [0, 0, 1], n)), this.addChild(D(this, [0, 0, -1], n));
                                break;
                            case 2:
                                this.addChild(D(this, [1, 0, 0], n)), this.addChild(D(this, [-1, 0, 0], n)), this.addChild(D(this, [0, 0, 1], n)), this.addChild(D(this, [0, 0, -1], n));
                                break;
                            case 3:
                                this.addChild(D(this, [1, 0, 0], n)), this.addChild(D(this, [-1, 0, 0], n)), this.addChild(D(this, [0, 1, 0], n)), this.addChild(D(this, [0, -1, 0], n));
                                break;
                            case 4:
                                this.addChild(D(this, [1, 0, 0], n)),
                                    this.addChild(D(this, [-1, 0, 0], n)),
                                    this.addChild(D(this, [0, 1, 0], n)),
                                    this.addChild(D(this, [0, -1, 0], n)),
                                    this.addChild(D(this, [0, 0, 1], n)),
                                    this.addChild(D(this, [0, 0, -1], n)),
                                    (t = 0);
                        }
                        if ((this.addChild(S(this, t, 0.9)), (this.touchChild = L(this).hide()), this.addChild(this.touchChild), 0 != t)) for (var s = i, a = this.children.length; s < a; ++s) this.children[s].fixedPlane = t;
                        break;
                    case 1:
                        (n.offset = 0.85), this.addChild(D(this, [-1, 0, 0], n)), this.addChild(D(this, [1, 0, 0], n)), (n.offset = 0), this.addChild(D(this, [1, 0, 0], n));
                        break;
                    case -1:
                        this.addChild(w(this, 1));
                        break;
                    case 2:
                        (n.offset = 0.85), this.addChild(D(this, [0, -1, 0], n)), this.addChild(D(this, [0, 1, 0], n)), (n.offset = 0), this.addChild(D(this, [0, 1, 0], n));
                        break;
                    case -2:
                        this.addChild(w(this, 2));
                        break;
                    case 3:
                        (n.offset = 0.85), this.addChild(D(this, [0, 0, -1], n)), this.addChild(D(this, [0, 0, 1], n)), (n.offset = 0), this.addChild(D(this, [0, 0, 1], n));
                        break;
                    case -3:
                        this.addChild(w(this, 3));
                        break;
                    case 4:
                        (n.offset = 1.2), this.addChild(D(this, [-1, 0, 0], n)), this.addChild(D(this, [1, 0, 0], n)), this.addChild(D(this, [0, -1, 0], n)), this.addChild(D(this, [0, 1, 0], n)), this.addChild(S(this, 3, 0.9));
                }
                for (s = 0, a = this.children.length; s < a; ++s) this.children[s].updatePos();
                return this;
            }),
            (pdGL.Hotspot3D.prototype.setArrowVector = function (e, t, i) {
                return 0 <= e && e < this.children.length && (e = this.children[e]) && e.vector && T(e, (t = m.normalize(t.slice())), (i = pd.toNumber(i, e.relativeOffset))), this;
            }),
            (pdGL.Hotspot3D.prototype.setArrowDistance = function (e, t, i) {
                var n;
                return 0 <= e && e < this.children.length && (n = this.children[e]) && ((e = pdGL.Hotspot3D.getManipulatorSize()), (i = pd.toNumber(i, n.relativeOffset)), (n.relativeOffset = t / e + i), T(n, vector, i)), this;
            }),
            (pdGL.Hotspot3D.prototype.setOrientation = function (e, t, i) {
                var n,
                    s,
                    a = 0,
                    r = this.modelPos,
                    o = m.set(this.planeEqn || [], e.slice()),
                    l = gl.orbitalView.getVectorToCamera(r[0], r[1], r[2]);
                m.normalize(o),
                    ((this.planeEqn = o)[3] = -(o[0] * r[0] + o[1] * r[1] + o[2] * r[2])),
                    pd.isArray(t) || ((r = 0.95 < Math.abs(o[2]) ? [0, 1, 0] : [0, 0, 1]), (t = m.cross([], o, r))),
                    pd.isArray(i) || (i = m.cross([], o, t)),
                    3 < this.children.length && ((n = m.negate([], t)), (s = m.negate([], i)));
                for (var d = 0, h = this.children.length; d < h; ++d) {
                    var c = this.children[d];
                    c &&
                        (c.type == pdGL.MANIPULATOR_TYPE.ARROW
                            ? (0 == a ? T(c, t, c.relativeOffset, e, i) : 1 == a ? T(c, i, c.relativeOffset, e, t) : 2 == a ? T(c, n, c.relativeOffset, e, s) : 3 == a && T(c, s, c.relativeOffset, e, n), (c.flipAngle = -999), ++a)
                            : ((c.uVector = m.set(c.uVector || [], t)), (c.vVector = m.set(c.vVector || [], i))),
                        (c.updateRotation = c._updateRotationByPlaneEqn),
                        (c.getSelectionPlane = c._getSelectionPlaneByPlaneEqn),
                        c.updateRotation(!1, l));
                }
                return this;
            }),
            (pdGL.HotspotRect = function (e) {
                (e = e || {}),
                    pdGL.Hotspot3D.call(this, e),
                    (this.isHotspotRect = !0),
                    (this.width = pd.toNumber(e.width, 0)),
                    (this.height = pd.toNumber(e.width, 0)),
                    (this.align = pd.toInteger(e.align, pd.Align.CENTER)),
                    (this.uVector = e.uVector || [1, 0, 0]),
                    (this.vVector = e.vVector || [0, 1, 0]),
                    this.addArrowVector([1, 0, 0], 0.75),
                    this.addArrowVector([0, 1, 0], 0.75),
                    this.addArrowVector([-1, 0, 0], 1.25),
                    this.addArrowVector([0, -1, 0], 1.25),
                    this.addCenterCircle([1, 0, 0]),
                    this.setSizeAndPosition(this.width, this.height, this.modelPos);
            }),
            (pdGL.HotspotRect.prototype = Object.create(pdGL.Hotspot3D.prototype)),
            (pdGL.HotspotRect.prototype.constructor = pdGL.HotspotRect),
            (pdGL.HotspotRect.prototype.computePosFromUV = function (e, t, i) {
                i = i || [];
                return (
                    m.set(i, this.modelPos),
                    this.uVector &&
                        (pd.Align.isLeft(this.align)
                            ? m.translateInVectorDirection(i, this.modelPos, this.uVector, this.width * e)
                            : pd.Align.isRight(this.align) || e < 0.5
                            ? m.translateInVectorDirection(i, this.modelPos, this.uVector, -this.width * e)
                            : m.translateInVectorDirection(i, this.modelPos, this.uVector, this.width * (e - 0.5))),
                    this.vVector &&
                        (pd.Align.isBottom(this.align)
                            ? m.translateInVectorDirection(i, i, this.vVector, this.height * t)
                            : pd.Align.isTop(this.align) || t < 0.5
                            ? m.translateInVectorDirection(i, i, this.vVector, -this.height * t)
                            : m.translateInVectorDirection(i, i, this.vVector, this.height * (t - 0.5))),
                    i
                );
            }),
            (pdGL.HotspotRect.prototype.setSizeAndPosition = function (e, t, i) {
                if (4 < this.children.length) {
                    var n;
                    (e = pd.toNumber(e, this.width)), (t = pd.toNumber(t, this.height)), pd.isArray(i) || (i = this.modelPos.slice());
                    var s,
                        a = pdGL.Hotspot3D.getManipulatorSize(),
                        r = [1.25, 1.25, 1.25, 1.25],
                        o = [0, 0, 0, 0],
                        l = [0, 0];
                    pd.Align.isLeft(this.align)
                        ? ((o[0] = e), (r[0] = 0.75), (o[2] = 0), (r[2] = 1.25), (l[0] = 0))
                        : pd.Align.isRight(this.align)
                        ? ((r[(o[0] = 0)] = 1.25), (o[2] = e), (r[2] = 0.75), (l[0] = e))
                        : ((s = 0.5 * e), (o[0] = s), (r[0] = 0.75), (o[2] = s), (r[2] = 0.75), (l[0] = s)),
                        pd.Align.isBottom(this.align)
                            ? ((o[1] = t), (r[1] = 0.75), (o[3] = 0), (r[3] = 1.25), (l[1] = 0))
                            : pd.Align.isTop(this.align)
                            ? ((o[1] = 0), (r[1] = 1.25), (o[3] = t), (r[3] = 0.75), (l[1] = t))
                            : ((s = 0.5 * t), (o[1] = s), (r[1] = 0.75), (o[3] = s), (r[3] = 0.75), (l[1] = s)),
                        (this.width = e),
                        (this.height = t),
                        m.set(this.modelPos, i);
                    for (var d = 0; d < 4; ++d) null != (n = this.children[d]) && (n.relativeOffset = o[d] / a + r[d]);
                }
                return this;
            });
        var C = -101;
        function O() {
            if (this.parent) {
                var e = this.parent.modelPos;
                if (this.parent.boundingBox) {
                    var t = this.parent.boundingBox,
                        i = t.min,
                        n = t.max,
                        s = this.parent.useBotLeft ? i.slice() : [0.5 * (i[0] + n[0]), 0.5 * (i[1] + n[1]), 0.5 * (i[2] + n[2])];
                    if (this.axis) {
                        var a = E,
                            r = (1.25 + this.relativeOffset) * this.parent.relativeSize;
                        switch ((t.callbackDynamicOffset && (r += t.callbackDynamicOffset(this)), this.axis)) {
                            case 1:
                                s[0] = Math.max(n[0] + r, s[0] + a);
                                break;
                            case -1:
                                s[0] = Math.min(i[0] - r, s[0] - a);
                                break;
                            case 2:
                                s[1] = Math.max(n[1] + r, s[1] + a);
                                break;
                            case -2:
                                s[1] = Math.min(i[1] - r, s[1] - a);
                                break;
                            case 3:
                                s[2] = Math.max(n[2] + r, s[2] + a);
                                break;
                            case -3:
                                s[2] = Math.min(i[2] - r, s[2] - a);
                        }
                    }
                    m.closeTo(s, this.modelPos) || (m.set(this.modelPos, s), this.transform.setTranslation(s));
                } else (this.modelPos[0] = e[0]), (this.modelPos[1] = e[1]), (this.modelPos[2] = e[2]);
            }
            return this;
        }
        function N() {
            var e, t, i, n, s;
            this.parent &&
                ((e = (n = this.parent).modelPos),
                (t = n.relativeSize),
                (s = n._dragRadius),
                (i = this.offsetVector[0] * s),
                (n = this.offsetVector[1] * s),
                (s = this.offsetVector[2] * s),
                this.setTranslation(i, n, s),
                this.transform.setAxialRotation(0, 0, -this.parent._angle),
                m.set(this.modelPos, e[0] + i * t, e[1] + n * t, e[2] + s * t));
        }
        (pdGL.HotspotBoundingBox = function (e) {
            (e = e || {}),
                pdGL.Hotspot3D.call(this, e),
                (this.isHotspotBoundingBox = !0),
                (this.selectedBoxIndex = -1),
                (this.defaultBoundingBox = null),
                (this.useBotLeft = pd.toBoolean(e.useBotLeft, !1)),
                (this.allowMultiSelection = pd.toBoolean(e.allowMultiSelection, !1)),
                (this.subBoundingBoxes = null),
                (this._preSelectedBoxIndex = -1),
                (this._dragBoxOriginalPos = f.create()),
                (this._dragAxisLock = 0),
                (this._preSelectedBoxMesh = null),
                (this._selectedBoxMesh = null),
                e.boundingBox && ((this.selectedBoxIndex = this._preSelectedBoxIndex = C), this.setBoundingBox(e.boundingBox, e.callbackOnChanging, e.axis), (this.defaultBoundingBox = e.boundingBox)),
                e.subBoundingBoxes && this.setSubBoundingBoxes(e.subBoundingBoxes),
                (this.callbackOnSelectionChanging = e.callbackOnSelectionChanging || null),
                (this.callbackOnSelectionChanged = e.callbackOnSelectionChanged || null);
        }),
            (pdGL.HotspotBoundingBox.prototype = Object.create(pdGL.Hotspot3D.prototype)),
            (pdGL.HotspotBoundingBox.prototype.constructor = pdGL.HotspotBoundingBox),
            (pdGL.HotspotBoundingBox.MAIN_BBOX = C),
            (pdGL.HotspotBoundingBox.prototype.setBoundingBox = function (e, t, i) {
                var n = this.boundingBox;
                if (this.callbackOnSelectionChanging && this.boundingBox != e && !this.callbackOnSelectionChanging(this, e)) return !1;
                if (e) {
                    (this.boundingBox = e), (this.callbackOnChanging = t || e.handleChanging), (this.callbackOnChange = e.handleChange || null);
                    var s = this.boundingBox.min,
                        t = this.boundingBox.max;
                    if (
                        (this.useBotLeft
                            ? ((this.modelPos[0] = s[0]), (this.modelPos[1] = s[1]), (this.modelPos[2] = s[2]))
                            : ((this.modelPos[0] = 0.5 * (s[0] + t[0])), (this.modelPos[1] = 0.5 * (s[1] + t[1])), (this.modelPos[2] = 0.5 * (s[2] + t[2]))),
                        f.set(this._dragBoxOriginalPos, e.min, e.max, e.axis),
                        this._selectedBoxMesh && this.highlightSelection(),
                        7 != this.children.length)
                    ) {
                        t = { noLines: !0, offset: 0.01 };
                        this.clearChildren(),
                            this.addChild(D(this, [1, 0, 0], t)),
                            this.addChild(D(this, [-1, 0, 0], t)),
                            this.addChild(D(this, [0, 1, 0], t)),
                            this.addChild(D(this, [0, -1, 0], t)),
                            this.addChild(D(this, [0, 0, 1], t)),
                            this.addChild(D(this, [0, 0, -1], t)),
                            this.addChild(M(this));
                        for (var a = 0; a < 7; ++a) this.children[a].updatePos = O;
                    }
                    e.fixedAxis && 0 < e.fixedAxis && e.fixedAxis <= 3
                        ? ((this.children[0].visible = this.children[1].visible = 1 == e.fixedAxis),
                          (this.children[2].visible = this.children[3].visible = 2 == e.fixedAxis),
                          (this.children[4].visible = this.children[5].visible = 3 == e.fixedAxis),
                          (this.children[6].visible = !1))
                        : (pd.isNumeric(i) || (i = Math.abs(pd.toNumber(e.axis, 0))),
                          (this.children[0].visible = this.children[1].visible = 1 != i),
                          (this.children[2].visible = this.children[3].visible = 2 != i),
                          (this.children[4].visible = this.children[5].visible = 3 != i),
                          e.showCenter
                              ? ((this.children[6].visible = !0), (this.children[6].axialXYOnly = !1), (this.children[6].fixedPlane = 0))
                              : ((this.children[6].visible = 1 <= i && i <= 3), (this.children[6].fixedPlane = Math.abs(i)), (this.children[6].axialXYOnly = !0)));
                    for (a = 0; a < 7; ++a) this.children[a].updatePos();
                    this.setTransform(null), (this._selected = !0);
                } else this.boundingBox = null;
                return this.callbackOnSelectionChanged && this.boundingBox != n && this.callbackOnSelectionChanged(this, this.boundingBox, n), !0;
            }),
            (pdGL.HotspotBoundingBox.prototype.updateBoundingBox = function () {
                return this.boundingBox && this._selectedBoxMesh && this.highlightSelection(), this;
            }),
            (pdGL.HotspotBoundingBox.prototype.highlightSelection = function () {
                var e = !1,
                    t = this._selectedBoxMesh;
                if (this.boundingBox && t) {
                    if ((t.reuseStart(), (e = b(t, this.boundingBox)), this.allowMultiSelection)) {
                        var i = this.subBoundingBoxes;
                        if (i && 0 < i.length)
                            for (var n = 0, s = i.length; n < s; ++n)
                                i[n].selected &&
                                    (function (e, t) {
                                        if (e && t) {
                                            var i = t.min,
                                                n = t.max,
                                                t = e.vertexCount();
                                            e.color(a);
                                            t = e.addVertex([i[0], i[1], i[2]]);
                                            e.addVertex([n[0], i[1], i[2]]),
                                                e.addVertex([n[0], n[1], i[2]]),
                                                e.addVertex([i[0], n[1], i[2]]),
                                                e.addVertex([i[0], i[1], n[2]]),
                                                e.addVertex([n[0], i[1], n[2]]),
                                                e.addVertex([n[0], n[1], n[2]]),
                                                e.addVertex([i[0], n[1], n[2]]),
                                                e.addTriangle(t + 0, t + 4, t + 7),
                                                e.addTriangle(t + 0, t + 7, t + 3),
                                                e.addTriangle(t + 1, t + 2, t + 6),
                                                e.addTriangle(t + 1, t + 6, t + 5),
                                                e.addTriangle(t + 0, t + 1, t + 5),
                                                e.addTriangle(t + 0, t + 5, t + 4),
                                                e.addTriangle(t + 2, t + 3, t + 7),
                                                e.addTriangle(t + 2, t + 7, t + 6),
                                                e.addTriangle(t + 0, t + 3, t + 2),
                                                e.addTriangle(t + 0, t + 2, t + 1),
                                                e.addTriangle(t + 4, t + 5, t + 6),
                                                e.addTriangle(t + 4, t + 6, t + 7);
                                        }
                                    })(t, i[n]);
                    }
                    t.reuseEnd(), t.compile();
                }
                return e;
            }),
            (pdGL.HotspotBoundingBox.prototype.setSubBoundingBoxes = function (e) {
                return (
                    pd.isArray(e) && 0 < e.length ? ((this.subBoundingBoxes = e.slice()), this._preSelectedBoxMesh || (this._preSelectedBoxMesh = new pd3D.Mesh({ colors: !0, lines: !0 }))) : delete this.subBoundingBoxes,
                    0 <= this.selectedBoxIndex && (this.selectedBoxIndex = this._preSelectedBoxIndex = -1),
                    this
                );
            }),
            (pdGL.HotspotBoundingBox.prototype.addSubBoundingBox = function (e) {
                if ((pd.isArray(this.subBoundingBoxes) || (this.subBoundingBoxes = []), this._preSelectedBoxMesh || (this._preSelectedBoxMesh = new pd3D.Mesh({ colors: !0, lines: !0 })), pd.isArray(e) && 0 < e.length))
                    for (var t = 0, i = e.length; t < i; ++t) this.subBoundingBoxes.push(e[t]);
                else pd.isObject(e) && null != e.min && this.subBoundingBoxes.push(e);
                return this;
            }),
            (pdGL.HotspotBoundingBox.prototype.selectBoundingBox = function (e, t) {
                var i = null;
                return (
                    e == C ? (i = this.defaultBoundingBox || this.boundingBox) : 0 <= e && this.subBoundingBoxes && e < this.subBoundingBoxes.length && (i = this.subBoundingBoxes[e]),
                    null != i
                        ? ((this.selectedBoxIndex = e), (this._preSelectedBoxIndex = e), this.setBoundingBox(i) || ((this._preSelectedBoxIndex = -1), (this.selectedBoxIndex = -1)), this.touchChild && this.touchChild.show(!!t))
                        : pdGL.keys.SHIFT || (this.setBoundingBox(null) && ((this.selectedBoxIndex = this._preSelectedBoxIndex = -1), (this.selectedChildIndex = -1), (this._selected = !1))),
                    this.setDragAxisLock(0),
                    gl.update(),
                    this
                );
            }),
            (pdGL.HotspotBoundingBox.prototype.setSelected = function (e) {
                return (
                    this._selected != e && ((this._selected = e), (this.selectedChildIndex = -1), this.setDragAxisLock(0), gl.update()),
                    e
                        ? (this._preSelectedBoxIndex < 0 && (this.defaultBoundingBox ? (this._preSelectedBoxIndex = C) : (this._preSelectedBoxIndex = this.selectedBoxIndex)),
                          this.selectedBoxIndex < 0 && (this.selectedBoxIndex = this._preSelectedBoxIndex),
                          this.selectBoundingBox(this._preSelectedBoxIndex))
                        : ((this.selectedBoxIndex = this._preSelectedBoxIndex = -1), this.setBoundingBox(null)),
                    this
                );
            }),
            (pdGL.HotspotBoundingBox.prototype.isDefaultBoxSelected = function () {
                return this.selectedBoxIndex == C;
            }),
            (pdGL.HotspotBoundingBox.prototype.isSubBoxSelected = function () {
                return 0 <= this.selectedBoxIndex;
            }),
            (pdGL.HotspotBoundingBox.prototype.isPreSelected = function () {
                return this._selected && 0 <= this._preSelectedBoxIndex ? this._preSelectedBoxIndex != this.selectedBoxIndex : this._preSelected;
            }),
            (pdGL.HotspotBoundingBox.prototype.cancelPreSelection = function () {
                return this.isPreSelected() && ((this._preSelectedBoxIndex = -1), this.emit("preselect", !1), gl.update()), (this._preSelected = !1), this;
            }),
            (pdGL.HotspotBoundingBox.prototype.isOver = function (e, t) {
                return !!(this.visible && this.active && this._selected) && this._isOverManipulator(e, t);
            }),
            (pdGL.HotspotBoundingBox.prototype.setDragAxisLock = function (e, t) {
                if (((e = pd.toInteger(e, 0)), !t && 7 <= this.children.length && (t = this.children[6]), t && this._dragAxisLock != e)) {
                    switch (e) {
                        default:
                            (this._dragAxisLock = e), (e = 0);
                            break;
                        case 1:
                            (this._dragAxisLock = e), (e = 1);
                            break;
                        case 2:
                            (this._dragAxisLock = e), (e = 2);
                            break;
                        case 3:
                            (this._dragAxisLock = e), (e = 2 == t.fixedPlane ? 2 : 1);
                    }
                    t = t.getMeshesByMaterial(g());
                    0 < t.length && ((t = t[0]).reuseStart(), d(t, m.origin, e, 0.4), t.reuseEnd(), t.compile(), gl.update());
                }
            }),
            (pdGL.HotspotBoundingBox.prototype.moveModelPos = function (e, t) {
                if (P(e, this.modelPos)) {
                    var i = this.modelPos,
                        n = this.boundingBox.min,
                        s = this.boundingBox.max,
                        a = e[0] - i[0],
                        r = e[1] - i[1],
                        o = e[2] - i[2];
                    (i[0] = e[0]), (i[1] = e[1]), (i[2] = e[2]), m.set(n, n[0] + a, n[1] + r, n[2] + o), m.set(s, s[0] + a, s[1] + r, s[2] + o);
                    for (var l = 0, d = this.children.length; l < d; ++l) {
                        var h = this.children[l];
                        h && h.visible && h.updatePos && h.updatePos();
                    }
                    return (
                        this.transformMatrix && (((o = this.transformMatrix.m)[3] = i[0]), (o[7] = i[1]), (o[11] = i[2])),
                        this._selectedBoxMesh && this.highlightSelection(),
                        this.callbackOnChange && this.callbackOnChange(this, t),
                        gl.update(),
                        (this._hasMoved = !0)
                    );
                }
                return !1;
            }),
            (pdGL.HotspotBoundingBox.prototype._checkToUpdateExtents = function (e, t, i) {
                var n = this.modelPos,
                    s = [0.5 * (e[0] + t[0]), 0.5 * (e[1] + t[1]), 0.5 * (e[2] + t[2])];
                if (!P(e, this.boundingBox.min) && !P(t, this.boundingBox.max)) return !1;
                if (this.callbackOnChanging && !this.callbackOnChanging(this, i, s, e, t)) return !1;
                if ((m.set(this.boundingBox.min, e[0], e[1], e[2]), m.set(this.boundingBox.max, t[0], t[1], t[2]), (n[0] = s[0]), (n[1] = s[1]), (n[2] = s[2]), !i.axis)) {
                    for (var a = 0, r = this.children.length; a < r; ++a) {
                        var o = this.children[a];
                        o && o.visible && o.updatePos && o.updatePos();
                    }
                    this.transformMatrix && (((s = this.transformMatrix.m)[3] = n[0]), (s[7] = n[1]), (s[11] = n[2]));
                }
                return this._selectedBoxMesh && this.highlightSelection(), this.callbackOnChange && this.callbackOnChange(this, i), gl.update(), (this._hasMoved = !0);
            }),
            (pdGL.HotspotBoundingBox.prototype._checkToMoveModelPos = function (e, t) {
                var i = this._dragReferencePos,
                    n = p(gl.orbitalView.snapGrid),
                    s = this.boundingBox.min.slice(),
                    a = this.boundingBox.max.slice();
                if (t.axis)
                    switch (t.axis) {
                        case 1:
                            a[0] = pd.snapTo(this._dragBoxOriginalPos.max[0] + (e[0] - i[0]), n);
                            break;
                        case -1:
                            s[0] = pd.snapTo(this._dragBoxOriginalPos.min[0] + (e[0] - i[0]), n);
                            break;
                        case 2:
                            a[1] = pd.snapTo(this._dragBoxOriginalPos.max[1] + (e[1] - i[1]), n);
                            break;
                        case -2:
                            s[1] = pd.snapTo(this._dragBoxOriginalPos.min[1] + (e[1] - i[1]), n);
                            break;
                        case 3:
                            a[2] = pd.snapTo(this._dragBoxOriginalPos.max[2] + (e[2] - i[2]), n);
                            break;
                        case -3:
                            s[2] = pd.snapTo(this._dragBoxOriginalPos.min[2] + (e[2] - i[2]), n);
                    }
                else {
                    var r = this.modelPos,
                        o = gl.orbitalView ? 1e-6 * gl.orbitalView.getPointSize() : 1e-9,
                        l = +this._dragAxisLock,
                        d = 0 | this.boundingBox.axis;
                    if (0 == d && this.boundingBox.showCenter) this.isViewedHorizontal && (d = (c = Math.abs(gl.orbitalView.cameraAzi)) < 45 || 135 < c ? ((l = 1 == l ? 3 : 1 < l ? 2 : 0), 1) : ((l = 1 == l ? 1 : 1 < l ? 3 : 0), 2));
                    else
                        switch (l) {
                            case 1:
                                (e[1] = i[1]), (e[2] = i[2]);
                                break;
                            case 2:
                                (e[0] = i[0]), (e[2] = i[2]);
                                break;
                            case 3:
                                (e[0] = i[0]), (e[1] = i[1]);
                        }
                    if (!m.closeTo(e, r, o)) {
                        var h = e[0] - this._dragReferencePos[0],
                            c = e[1] - this._dragReferencePos[1],
                            i = e[2] - this._dragReferencePos[2],
                            r = a[0] - s[0],
                            o = a[1] - s[1],
                            e = a[2] - s[2];
                        switch (d) {
                            case 1:
                            case -1:
                                (l && 2 != l) || (s[1] = pd.snapTo(this._dragBoxOriginalPos.min[1] + c, n)), (l && 3 != l) || (s[2] = pd.snapTo(this._dragBoxOriginalPos.min[2] + i, n));
                                break;
                            case 2:
                            case -2:
                                (l && 1 != l) || (s[0] = pd.snapTo(this._dragBoxOriginalPos.min[0] + h, n)), (l && 3 != l) || (s[2] = pd.snapTo(this._dragBoxOriginalPos.min[2] + i, n));
                                break;
                            default:
                                (l && 1 != l) || (s[0] = pd.snapTo(this._dragBoxOriginalPos.min[0] + h, n)), (l && 2 != l) || (s[1] = pd.snapTo(this._dragBoxOriginalPos.min[1] + c, n));
                        }
                        (a[0] = s[0] + r), (a[1] = s[1] + o), (a[2] = s[2] + e);
                    }
                }
                return this._checkToUpdateExtents(s, a, t);
            }),
            (pdGL.HotspotBoundingBox.prototype.handleSelectEvent = function (e, t, i) {
                if (this.visible && this.active) {
                    var n = this.getModelSelectionRadius(),
                        s = (this._ray.start = gl.orbitalView.canvasToModel(e.x, e.y, 0).toArray()),
                        a = (this._ray.end = gl.orbitalView.canvasToModel(e.x, e.y, 1).toArray()),
                        r = (this._ray.direction = m.normalizedDirectionVector([], s, a));
                    if (((this._hasMoved = !1), this._selected && (A = this._selectManipulator(s, a, n)) && this.callbackOnDragStart && this.callbackOnDragStart(this, e), i || (this._selected && A)))
                        return (
                            A &&
                                (0 <= this._preSelectedBoxIndex
                                    ? ((g = this.subBoundingBoxes[this._preSelectedBoxIndex]), f.set(this._dragBoxOriginalPos, g.min, g.max, g.axis))
                                    : this._preSelectedBoxIndex == C && ((g = this.defaultBoundingBox || this.boundingBox), f.set(this._dragBoxOriginalPos, g.min, g.max, g.axis))),
                            A
                        );
                    var o,
                        l,
                        d = [],
                        h = Number.MAX_VALUE;
                    if (((this._preSelectedBoxIndex = -1), this.subBoundingBoxes && 0 < this.subBoundingBoxes.length)) {
                        for (var c = this.subBoundingBoxes, p = 0, u = c.length; p < u; ++p)
                            p != this.selectedBoxIndex && null != (o = (c[p].intersectRay || f.intersectRay)(c[p], s, r, d)) && (l = m.distancePointToPoint(s, o)) < h && ((this._preSelectedBoxIndex = p), (h = l));
                        0 <= this.selectedBoxIndex &&
                            this._preSelectedBoxIndex < 0 &&
                            null != (o = (c[this.selectedBoxIndex].intersectRay || f.intersectRay)(c[this.selectedBoxIndex], s, r, d)) &&
                            (l = m.distancePointToPoint(s, o)) < h &&
                            ((this._preSelectedBoxIndex = this.selectedBoxIndex), (h = l));
                    }
                    if (
                        (this.defaultBoundingBox &&
                            null != (o = (this.defaultBoundingBox.intersectRay || f.intersectRay)(this.defaultBoundingBox, s, r, d)) &&
                            (l = m.distancePointToPoint(s, o)) < h &&
                            (this._preSelectedBoxIndex < 0 || !this.defaultBoundingBox.inactiveFace || o.axis != this.defaultBoundingBox.inactiveFace) &&
                            ((this._preSelectedBoxIndex = C), (h = l)),
                        this._preSelectedBoxIndex == this.selectedBoxIndex)
                    )
                        return !1;
                    var g,
                        t = !t;
                    return (
                        0 <= this._preSelectedBoxIndex
                            ? ((g = this.subBoundingBoxes[this._preSelectedBoxIndex]), f.set(this._dragBoxOriginalPos, g.min, g.max, g.axis), y(this._preSelectedBoxMesh, g), (t = !0), gl.update())
                            : this._preSelectedBoxIndex == C && ((g = this.defaultBoundingBox || this.boundingBox), f.set(this._dragBoxOriginalPos, g.min, g.max, g.axis), y(this._preSelectedBoxMesh, g), (t = !0), gl.update()),
                        t
                    );
                }
                return !1;
            }),
            (pdGL.HotspotBoundingBox.prototype.handleDragEvent = function (e) {
                var t;
                return (
                    !this._selected ||
                        (0 <= (t = this.selectedChildIndex) &&
                            t < this.children.length &&
                            (t = this.children[t]) &&
                            t.drag &&
                            ((this._ray.start = gl.orbitalView.canvasToModel(e.x, e.y, 0).toArray()), (this._ray.end = gl.orbitalView.canvasToModel(e.x, e.y, 1).toArray()), t.drag(this._ray.start, this._ray.end))),
                    this._preSelectedBoxIndex != this.selectedBoxIndex && (this._preSelectedBoxIndex = this.selectedBoxIndex),
                    A
                );
            }),
            (pdGL.HotspotBoundingBox.prototype.handleReleaseEvent = function (e) {
                var t = A;
                return (
                    (A = !1),
                    t
                        ? (this._hasMoved && this.callbackOnChanged && this.callbackOnChanged(this, e), this.callbackOnDragEnd && this.callbackOnDragEnd(this, e), this.setSelectedChildIndex(-1))
                        : pdDOM.Interaction.hasMoved() ||
                          (this._preSelectedBoxIndex != this.selectedBoxIndex
                              ? this.selectBoundingBox(this._preSelectedBoxIndex, e.isTouchEvent)
                              : this.allowMultiSelection &&
                                this.callbackOnSelectionChanging &&
                                ((e = this.selectedBoxIndex), this.callbackOnSelectionChanging(this, this.boundingBox) || ((this.selectedBoxIndex = e), (this._preSelectedBoxIndex = -1)))),
                    (this._hasMoved = !1),
                    t
                );
            }),
            (pdGL.HotspotBoundingBox.prototype.handleDoubleTap = function (e) {
                if (this.active && this.visible && this.boundingBox && this._selected && 7 <= this.children.length) {
                    var t = this.children[6];
                    if (t && t.visible)
                        if (
                            (this._ray.start ||
                                ((this._ray.start = gl.orbitalView.canvasToModel(e.x, e.y, 0).toArray()),
                                (this._ray.end = gl.orbitalView.canvasToModel(e.x, e.y, 1).toArray()),
                                (this._ray.direction = m.normalizedDirectionVector([], ray_start, ray_end))),
                            null != (this.boundingBox || f.intersectRay)(this.boundingBox, this._ray.start, this._ray.direction))
                        ) {
                            switch (t.fixedPlane) {
                                case 1:
                                    0 == this._dragAxisLock ? this.setDragAxisLock(2, t) : 2 == this._dragAxisLock ? this.setDragAxisLock(3, t) : this.setDragAxisLock(0, t);
                                    break;
                                case 2:
                                    0 == this._dragAxisLock ? this.setDragAxisLock(1, t) : 1 == this._dragAxisLock ? this.setDragAxisLock(3, t) : this.setDragAxisLock(0, t);
                                    break;
                                case 3:
                                    0 == this._dragAxisLock ? this.setDragAxisLock(1, t) : 1 == this._dragAxisLock ? this.setDragAxisLock(2, t) : this.setDragAxisLock(0, t);
                            }
                            return !0;
                        }
                }
                return !1;
            }),
            (pdGL.HotspotBoundingBox.prototype.handleDoubleTapCenterManipulator = function () {
                if (this.active && this.visible && this.boundingBox && this._selected && 7 <= this.children.length) {
                    var e = this.children[6];
                    if (e && e.visible) {
                        var t = m.create(),
                            i = this.getModelSelectionRadius();
                        if (e.distanceFromRay(this._ray.start, this._ray.end, t) < i) {
                            switch (e.fixedPlane) {
                                case 1:
                                    0 == this._dragAxisLock ? this.setDragAxisLock(2, e) : 2 == this._dragAxisLock ? this.setDragAxisLock(3, e) : this.setDragAxisLock(0, e);
                                    break;
                                case 2:
                                    0 == this._dragAxisLock ? this.setDragAxisLock(1, e) : 1 == this._dragAxisLock ? this.setDragAxisLock(3, e) : this.setDragAxisLock(0, e);
                                    break;
                                case 3:
                                    0 == this._dragAxisLock ? this.setDragAxisLock(1, e) : 1 == this._dragAxisLock ? this.setDragAxisLock(2, e) : this.setDragAxisLock(0, e);
                                    break;
                                default:
                                    this.boundingBox.showCenter && (0 == this._dragAxisLock ? this.setDragAxisLock(1, e) : 1 == this._dragAxisLock ? this.setDragAxisLock(2, e) : this.setDragAxisLock(0, e));
                            }
                            return !0;
                        }
                    }
                }
                return !1;
            }),
            (pdGL.HotspotBoundingBox.prototype._render = function () {
                if (this._selected) {
                    var e,
                        t = x[3],
                        i = _[3],
                        n = this._opacity,
                        s = gl.orbitalView.getVectorToCamera(this.modelPos[0], this.modelPos[1], this.modelPos[2]);
                    this.selectedChildIndex < 0 && (this.isViewedHorizontal = pdGL.Hotspot3D.altBelowFlipThresholdAngle(s));
                    var a = pdGL.Hotspot3D.getManipulatorSize();
                    (this.relativeSize = a), this.callbackOnDraw && this.callbackOnDraw(this);
                    var r,
                        o = pdGL.getDefaultMaterialMeshColor();
                    gl.pushLineWidth(gl.getCanvasLineWidthThicker()),
                        this.boundingBox &&
                            (this._selectedBoxMesh || ((this._selectedBoxMesh = new pd3D.Mesh({ colors: !0, lines: !1 })), this.addMesh(this._selectedBoxMesh, o), this.highlightSelection()),
                            0 < (r = this.getMeshesByMaterial(o)).length && o.uniform("opacity", this._opacity).renderMeshes(r, u)),
                        this._preSelectedBoxIndex != this.selectedBoxIndex && -1 != this._preSelectedBoxIndex && this._preSelectedBoxMesh && o.uniform("opacity", 0.5 * this._opacity).renderMeshes(this._preSelectedBoxMesh, u),
                        o.isRendering() && o.endRender(),
                        (x[3] = n),
                        g().uniform("color", x),
                        gl.lineWidth(gl.getCanvasLineWidth());
                    for (var l = 0, d = this.children.length; l < d; ++l) {
                        var h = this.children[l];
                        h && h.visible && (h.setScale(a), (e = this.selectedChildIndex == l ? 1 : 0), (_[3] = e ? Math.max(n, 0.25) : 0.6 * n), h._render(s, e));
                    }
                    (x[3] = t), (_[3] = i), gl.popLineWidth();
                } else
                    this._preSelected &&
                        this._preSelectedBoxIndex != this.selectedBoxIndex &&
                        -1 != this._preSelectedBoxIndex &&
                        this._preSelectedBoxMesh &&
                        pdGL
                            .getDefaultMaterialMeshColor()
                            .uniform("opacity", 0.5 * this._opacity)
                            .renderMeshes(this._preSelectedBoxMesh, u)
                            .endRender();
            }),
            (pdGL.HotspotNorthArrow = function (e) {
                var n = this;
                (e = e || {}),
                    pdGL.Hotspot3D.call(this, e),
                    (this.isHotspotNorthArrow = !0),
                    (this._angle = 0),
                    (this._ringRadius = 3.5),
                    (this._dragRadius = this._ringRadius),
                    (this.manipulatorPosition = null),
                    (this.manipulatorAngle = null),
                    (this.meshAxis = null),
                    (this.meshLines = null),
                    (this.callbackOnAngleChanging = e.callbackOnAngleChanging || null),
                    (this.transform = this.transformMatrix = new pd3D.Transform()),
                    this._createGeometry();
                var s = new pdDOM.Animation(
                    function (e) {
                        (n._dragRadius = e), gl.update();
                    },
                    { duration: 0.75, delay: 3 }
                );
                (this.cancelShrinkAnimation = function () {
                    s.active && s.cancel();
                }),
                    this.on("select:child", function (e, t, i) {
                        e || 1 != i || t == i || (n._dragRadius > n._ringRadius + 0.001 && s.start({ fromValue: n._dragRadius, toValue: n._ringRadius }));
                    }),
                    this.on("selected", function () {
                        (n._dragRadius = n._ringRadius), (n.meshAxis.visible = !1), n.cancelShrinkAnimation();
                    });
            }),
            (pdGL.HotspotNorthArrow.prototype = Object.create(pdGL.Hotspot3D.prototype)),
            (pdGL.HotspotNorthArrow.prototype.constructor = pdGL.HotspotNorthArrow),
            (pdGL.HotspotNorthArrow.prototype._setAngle = function (e, t) {
                if (((e = pd.wrapAt(pd.toNumber(e, this._angle), -180, 180)), (!t && pd.closeTo(this._angle, e)) || (this.callbackOnAngleChanging && !this.callbackOnAngleChanging(this, e)))) return !1;
                this._angle = e;
                (t = this.manipulatorAngle), (e = pd.degreesToRadians(this._angle));
                return (t.offsetVector[0] = Math.sin(e)), (t.offsetVector[1] = Math.cos(e)), t.updatePos(), !0;
            }),
            (pdGL.HotspotNorthArrow.prototype.angle = function (e, t) {
                return arguments.length ? (this._setAngle(e), gl.update(), this) : this._angle;
            }),
            (pdGL.HotspotNorthArrow.prototype._createGeometry = function () {
                this.addCenterSphere();
                var e = new pd3D.Mesh({ lines: !0, defaultColor: [0.4, 0.4, 0.4, 1] });
                h(e, m.origin, 2, 0.4),
                    e.addLine(e.addVertex([0, 0.9, 0]), e.addVertex([0, -0.9, 0])),
                    e.addLine(e.addVertex([-0.9, 0, 0]), e.addVertex([0.9, 0, 0])),
                    pd3D.Shapes.circle({ radius: 0.725, background: !1, border: !0 }, e),
                    e.compile(),
                    this.addMesh(e, pdGL.getDefaultMaterialMeshColor()),
                    (this.manipulatorPosition = M(this)),
                    (this.manipulatorPosition.axialXYOnly = !1),
                    (this.manipulatorPosition.fixedPlane = 3),
                    this.addChild(this.manipulatorPosition),
                    this.manipulatorPosition.updatePos(),
                    d((e = new pd3D.Mesh({ normals: !1, lines: !0 })), m.origin, 1, 0.4),
                    e.compile();
                var t = new c(this);
                (t.updatePos = N),
                    t.addMesh(e, g()),
                    (t.vVector = e.defaultNormal),
                    (t.offsetVector = [0, 1, 0]),
                    (t.drag = t._dragToPointer),
                    (t.axialXYOnly = !1),
                    (t.allowSnap = !1),
                    (t.fixedPlane = 3),
                    (t.axis = 3),
                    (this.manipulatorAngle = t),
                    this.addChild(t),
                    (e = new pd3D.Mesh({ lines: !0, defaultColor: x }));
                t = 0.765;
                pd3D.Shapes.circle({ radius: t, radiusInner: t - 0.0025, segments: 72 }, e),
                    pd3D.Shapes.polygon({ type: pd3D.Shapes.Type.SPOKES, size: t, thickness: 0.0025 * t, tickSize: 0.025 * t, segments: 72 }, e),
                    pd3D.Shapes.polygon({ type: pd3D.Shapes.Type.SPOKES, size: 0.745875, thickness: 0.0025 * t, tickSize: 0.015 * t, segments: 24 }, e);
                var i = 0.65;
                pd3D.Shapes.circle({ radius: i, radiusInner: i - 0.0025, segments: 72 }, e),
                    pd3D.Shapes.polygon({ type: pd3D.Shapes.Type.SPOKES, size: 0.66625, thickness: 0.0025 * i, tickSize: 0.01625, segments: 72 }, e),
                    pd3D.Shapes.polygon({ type: pd3D.Shapes.Type.SPOKES, size: 0.676, thickness: 0.0025 * i, tickSize: 0.00975, segments: 24 }, e),
                    e.addQuad(e.addVertex([-0.0015, 0, 0]), e.addVertex([0.0015, 0, 0]), e.addVertex([0.0015, 0.676, 0]), e.addVertex([-0.0015, 0.676, 0])),
                    e.addQuad(e.addVertex([-0.0015, 0.96 * t, 0]), e.addVertex([0.0015, 0.96 * t, 0]), e.addVertex([0.0015, 1.1, 0]), e.addVertex([-0.0015, 1.1, 0]));
                var n = [0, 0, 0],
                    t = 0.035 * i;
                pd3D.Font.setSize(t), pd3D.Font.aspectRatio(1), pd3D.Font.weight(300);
                for (var s = -180; s < 180; s += 15)
                    s % 45 && ((n[0] = 0.68575 * pd.sinDegrees(s)), (n[1] = 0.68575 * pd.cosDegrees(s)), pd3D.Font.setRotation(-s, 0, 0, 1), pd3D.Font.drawText(s.toFixed(0), n, e, pd.Align.CENTER, pd.Align.BOTTOM));
                pd3D.Font.setSize(1.25 * t), pd3D.Font.weight(500);
                for (s = -135; s <= 180; s += 45) (n[0] = 1.05 * i * pd.sinDegrees(s)), (n[1] = 1.05 * i * pd.cosDegrees(s)), pd3D.Font.setRotation(-s, 0, 0, 1), pd3D.Font.drawText(s.toFixed(0), n, e, pd.Align.CENTER, pd.Align.BOTTOM);
                return (
                    pd3D.Font.clearRotations(),
                    pd3D.Font.aspectRatio(1.25),
                    pd3D.Font.weight(400),
                    (this.meshAxis = e).compile(),
                    (e = new pd3D.Mesh()).addQuad(e.addVertex([-0.0015, 0, 0]), e.addVertex([0.0015, 0, 0]), e.addVertex([0.0015, 1.1, 0]), e.addVertex([-0.0015, 1.1, 0])),
                    (this.meshLines = e).compile(),
                    this._setAngle(this._angle, !0),
                    this
                );
            }),
            (pdGL.HotspotNorthArrow.prototype._checkToMoveModelPos = function (e, t) {
                if (t == this.manipulatorAngle) {
                    var i = this.modelPos,
                        n = m.normalize([e[0] - i[0], e[1] - i[1], 0]),
                        n = -m.azimuthBetweenVectors(m.unitY, n),
                        n = pd.radiansToDegrees(n),
                        n = pdGL.keys.SHIFT ? pd.snapTo(n, 15) : pdGL.keys.CONTROL || pdGL.keys.META ? pd.snapTo(n, 0.01) : pd.snapTo(n, 1),
                        i = m.distancePointToPoint(e, i) / this.relativeSize;
                    if (((this._dragRadius = Math.max(this._ringRadius, i)), gl.update(), this._setAngle(n))) return this.emit("angle", this._angle), (this._hasMoved = !0);
                } else if (P(e, this.modelPos)) {
                    if (this.callbackOnChanging && !this.callbackOnChanging(this, t, e)) return !1;
                    m.set(this.modelPos, e);
                    for (var s = 0, a = this.children.length; s < a; ++s) {
                        var r = this.children[s];
                        r && r.visible && r.updatePos && r.updatePos();
                    }
                    return this.callbackOnChange && this.callbackOnChange(this, t), gl.update(), (this._hasMoved = !0);
                }
                return !1;
            }),
            (pdGL.HotspotNorthArrow.prototype._render = function () {
                var e = x[3],
                    t = _[3],
                    i = this._opacity;
                gl.pushMatrix(), gl.pushLineWidth(gl.getCanvasLineWidth());
                var n,
                    s,
                    a = pdGL.Hotspot3D.getRelativeSize();
                for (n in ((this.relativeSize = a),
                this.callbackOnDraw && this.callbackOnDraw(this),
                this.transform.setTranslation(this.modelPos),
                this.transform.setScale(a, a, a),
                gl.multMatrix(this.transform),
                gl.pushMatrix(),
                gl.rotate(-this._angle, 0, 0, 1),
                this._preSelected && !this._selected && (i *= 0.6),
                (x[3] = i),
                g().uniform("color", x),
                pdGL.getDefaultMaterialMeshColor().uniform("opacity", 0.75),
                this.geometry)) {
                    this.geometry.hasOwnProperty(n) && (s = this.geometry[n]).material.renderMeshes(s.meshes, u).endRender();
                }
                if ((gl.popMatrix(), this.manipulatorAngle.updatePos(), this._selected || this._preSelected)) {
                    var r,
                        o = this._preSelected ? -1 : 0,
                        l = this.selectedChildIndex;
                    this._preSelected && gl.disable(gl.DEPTH_TEST);
                    for (var d = 0, h = this.children.length; d < h; ++d) {
                        var c = this.children[d];
                        c && c.visible && c._render && ((r = o || (l == d ? 1 : 0)), (_[3] = r ? Math.max(i, 0.25) : 0.6 * i), c._render(null, r, i));
                    }
                    this._preSelected && gl.enable(gl.DEPTH_TEST);
                }
                (x[3] = e),
                    (_[3] = t),
                    gl.popLineWidth(),
                    gl.popMatrix(),
                    this._selected &&
                        ((t = this.modelPos),
                        (a = this._dragRadius * this.relativeSize),
                        gl.pushMatrix(),
                        gl.translate(t[0], t[1], t[2]),
                        gl.scale(a, a, a),
                        (this.meshAxis.visible = !0),
                        pdGL.getDefaultMaterialMeshColor().renderMeshes(this.meshAxis, gl.TRIANGLES).endRender(),
                        gl.rotate(-this._angle, 0, 0, 1),
                        g().renderMeshes(this.meshLines, gl.TRIANGLES).endRender(),
                        gl.popMatrix(),
                        1 == this.selectedChildIndex && this.cancelShrinkAnimation());
            });
    })();
var pdSVG = pdSVG || {};
(pdSVG.Analemma = function (e) {
    var t = this;
    if (null == (e = e || {}).elementId) throw new Error("A valid 'elementId' is required and must be an existing SVG element in the DOM.");
    var i = e.elementId,
        n = e.throttledRescale || 0,
        d = e.solarPosition || new pd.SolarPosition(),
        h = 0,
        s = $(i),
        i = d3.select(i),
        a = s[0],
        r = 360,
        o = 365,
        l = 183,
        c = 180,
        p = 3,
        u = 180 / Math.PI,
        g = -25,
        m = 25,
        f = -30,
        _ = 30,
        x = 1,
        v = 1;
    s.empty();
    var b,
        y,
        S,
        M,
        w,
        L = i.append("g").attr("class", "background"),
        D = i.append("g").attr("class", "grid"),
        T = i.append("g").attr("class", "analemma"),
        E = i.append("g").attr("class", "datetime"),
        A = i.append("g").attr("class", "markers"),
        P = !0,
        C = d3.format(".0f"),
        O = function (e) {
            return C(e) + "°";
        };
    function N(e) {
        return l + e * v;
    }
    function G(e) {
        return c - e * x;
    }
    var R = d3.svg
        .line()
        .x(function (e) {
            return N(e[0]);
        })
        .y(function (e) {
            return G(e[1]);
        })
        .interpolate("linear");
    function I() {
        (o = +s.width()), (r = +s.height()), (l = 0.5 * o), (c = 0.5 * r), a.setAttributeNS(null, "viewBox", "0 0 " + o + " " + r), (p = pd.mapAndConstrainTo(r, 200, 1024, 2.5, 4)), (v = o / (m - g)), (x = r / (_ - f)), (P = !1);
    }
    function k() {
        var e, t;
        P && I(), L.text(""), L.append("rect").attr("class", "background-daylight stroke-none").attr("x", 0).attr("y", 0).attr("width", o).attr("height", r), D.text("");
        for (var i = f + 5; i < 30; i += 5)
            (t = G(i)),
                D.append("line").attr("class", "line-grid").attr("x1", N(g)).attr("y1", t).attr("x2", N(m)).attr("y2", t),
                D.append("line")
                    .attr("class", "line-axis")
                    .attr("x1", l - 3)
                    .attr("y1", t)
                    .attr("x2", l + 3)
                    .attr("y2", t),
                D.append("text")
                    .text(O(i))
                    .attr("text-anchor", "start")
                    .attr("class", "text-grid")
                    .attr("dy", "0.4em")
                    .attr("x", l + 5)
                    .attr("y", t);
        for (var n = o < 300 ? 5 : 1, s = n; s < m; s += n)
            (e = N(s)),
                D.append("line").attr("class", "line-grid").attr("x1", e).attr("y1", G(f)).attr("x2", e).attr("y2", G(_)),
                s % 5 ||
                    (D.append("line")
                        .attr("class", "line-axis")
                        .attr("x1", e)
                        .attr("y1", c - 3)
                        .attr("x2", e)
                        .attr("y2", c + 3),
                    D.append("text").text(C(s)).attr("text-anchor", "middle").attr("class", "text-grid").attr("dy", "1.5em").attr("x", e).attr("y", c)),
                (e = N(-s)),
                D.append("line").attr("class", "line-grid").attr("x1", e).attr("y1", G(f)).attr("x2", e).attr("y2", G(_)),
                s % 5 ||
                    (D.append("line")
                        .attr("class", "line-axis")
                        .attr("x1", e)
                        .attr("y1", c - 3)
                        .attr("x2", e)
                        .attr("y2", c + 3),
                    D.append("text").text(C(-s)).attr("text-anchor", "middle").attr("class", "text-grid").attr("dy", "1.5em").attr("x", e).attr("y", c));
        D.append("text").text("Equation of Time (mins)").attr("text-anchor", "start").attr("class", "text-axis").attr("dy", "-0.6em").attr("x", 5).attr("y", c),
            (t = G(f) - 10),
            D.append("text")
                .text("Declination Angle (degrees)")
                .attr("transform", "rotate(-90 " + l + "," + t + ")")
                .attr("text-anchor", "start")
                .attr("class", "text-axis")
                .attr("dy", "-0.6em")
                .attr("x", l)
                .attr("y", t),
            D.append("line").attr("class", "line-axis").attr("x1", N(g)).attr("y1", c).attr("x2", N(m)).attr("y2", c),
            D.append("line").attr("class", "line-axis").attr("x1", l).attr("y1", G(f)).attr("x2", l).attr("y2", G(_)),
            E.text(""),
            (b = E.append("line").attr("class", "hilite-axis")),
            (y = E.append("circle")
                .attr("class", "hilite-circle")
                .attr("r", 0.5 * p)),
            (S = E.append("line").attr("class", "hilite-axis")),
            (M = E.append("circle")
                .attr("class", "hilite-circle")
                .attr("r", 0.5 * p)),
            (w = E.append("circle")
                .attr("class", "hilite-circle")
                .attr("r", 1.5 * p)),
            V();
    }
    function V() {
        T.text(""), A.text("");
        var e,
            t = [];
        h = d.year();
        for (var i, n, s, a, r = 0; r <= 364; r += 2) (e = d.calcJulianCenturies(r, h)), t.push([60 * d.calcEquationOfTime(e), d.calcSolarDeclination(e) * u]);
        (e = d.calcJulianCenturies(0, h)), t.push([60 * d.calcEquationOfTime(e), d.calcSolarDeclination(e) * u]), T.append("path").attr("d", R(t)).attr("class", "line-marker").attr("fill", "none");
        for (var o = ["1 Jan", "1 Feb", "1 Mar", "1 Apr", "1 May", "1 Jun", "1 Jul", "1 Aug", "1 Sep", "1 Oct", "1 Nov", "1 Dec"], l = 0; l < 12; ++l) {
            switch (
                ((e = d.calcJulianCenturiesByMonth(1, l, h)), (i = N(60 * d.calcEquationOfTime(e))), (n = G(d.calcSolarDeclination(e) * u)), A.append("circle").attr("class", "marker-shape").attr("r", p).attr("cx", i).attr("cy", n), l)
            ) {
                case 5:
                    (a = "start"), (s = "-0.75em");
                    break;
                case 11:
                    (a = "start"), (s = "1.25em");
                    break;
                case 10:
                case 9:
                case 8:
                case 4:
                    (a = "start"), (s = "0.35em"), (i += 8);
                    break;
                case 6:
                    (a = "end"), (s = "-0.75em");
                    break;
                case 7:
                case 3:
                case 2:
                case 1:
                    (a = "end"), (s = "0.35em"), (i -= 8);
                    break;
                case 0:
                    (a = "end"), (s = "1.25em");
            }
            T.append("text").text(o[l]).attr("class", "text-marker").attr("text-anchor", a).attr("dy", s).attr("x", i).attr("y", n);
        }
        B();
    }
    function B() {
        var e = d.dayOfMonth(),
            t = d.monthOfYear(),
            e = d.calcJulianCenturiesByMonth(e, t, h),
            t = N(60 * d.calcEquationOfTime(e)),
            e = G(d.calcSolarDeclination(e) * u);
        b.attr("x1", t).attr("y1", e).attr("x2", t).attr("y2", c), y.attr("cx", t).attr("cy", c), S.attr("x1", t).attr("y1", e).attr("x2", l).attr("y2", e), M.attr("cx", l).attr("cy", e), w.attr("cx", t).attr("cy", e);
    }
    (this.undoManager = function (e) {
        return arguments.length ? ((undoManager = e), t) : undoManager;
    }),
        (this.observableDayOfYear = function (e) {
            return arguments.length ? ((observableDayOfYear = e), t) : observableDayOfYear;
        }),
        (this.observableMinuteOfDay = function (e) {
            return arguments.length ? ((observableMinuteOfDay = e), t) : observableMinuteOfDay;
        }),
        (this.solarPosition = function (e) {
            return arguments.length ? ((d = e), t.refresh(), t) : d;
        }),
        (this.width = function (e) {
            return arguments.length ? ((o = parseInt(e, 10)), s.width(o), t.refresh(), t) : o;
        }),
        (this.height = function (e) {
            return arguments.length ? ((r = parseInt(e, 10)), s.height(r), t.refresh(), t) : r;
        }),
        (this.throttledRescale = function (e) {
            return arguments.length ? ((n = pd.constrainTo(parseInt(e, 10), 0, 5e3)), t) : n;
        });
    var U = null;
    function F() {
        (U = null), I(), k();
    }
    return (
        (this.rescale = function () {
            4 < n ? null == U && (U = setTimeout(F, n)) : F();
        }),
        (this.refresh = function () {
            k();
        }),
        (this.handleLocationChange = function () {}),
        (this.handleDateTimeChange = function () {
            (h != d.year() ? V : B)();
        }),
        (this.handleDateChange = function () {
            (h != d.year() ? V : B)();
        }),
        (this.handleTimeChange = function () {}),
        (this.activateTooltip = function () {}),
        s.attr("class", "svg-chart no-select no-touch"),
        (a.style.cursor = "default"),
        this
    );
}),
    ((pdSVG = pdSVG || {}).DayLength = function (e) {
        var i = this;
        if (null == (e = e || {}).elementId) throw new Error("A valid 'elementId' is required and must be an existing SVG element in the DOM.");
        var t = e.elementId,
            n = e.throttledRescale || 0,
            s = e.solarPosition || new pd.SolarPosition(),
            a = !1 !== e.userInteraction,
            r = e.observableMinuteOfDay || null,
            o = e.observableDayOfYear || null,
            l = e.undoManager || null,
            d = e.isTouch || !1,
            h = $(t),
            t = d3.select(t),
            c = h[0],
            p = 360,
            u = 365,
            g = 80,
            m = 20,
            f = 3,
            _ = 15,
            x = 1;
        h.empty();
        var v,
            b,
            y,
            S,
            M,
            w,
            L,
            D = t.append("g").attr("class", "bkgnd"),
            T = t.append("g").attr("class", "daytime"),
            E = t.append("g").attr("class", "grid"),
            A = t.append("g").attr("class", "datetime"),
            P = t.append("g").attr("class", "tooltip"),
            C = !0,
            O = d3.svg
                .area()
                .x(function (e) {
                    return e.dayOfYear * x;
                })
                .y0(function (e) {
                    return e.sunrise * _;
                })
                .y1(function (e) {
                    return e.sunset * _;
                })
                .interpolate("linear"),
            N = d3.svg
                .area()
                .x(function (e) {
                    return e.dayOfYear * x;
                })
                .y0(function (e) {
                    return e.civilDawn * _;
                })
                .y1(function (e) {
                    return e.civilDusk * _;
                })
                .interpolate("linear"),
            G = d3.svg
                .area()
                .x(function (e) {
                    return e.dayOfYear * x;
                })
                .y0(function (e) {
                    return e.nauticalDawn * _;
                })
                .y1(function (e) {
                    return e.nauticalDusk * _;
                })
                .interpolate("linear"),
            R = d3.svg
                .area()
                .x(function (e) {
                    return e.dayOfYear * x;
                })
                .y0(function (e) {
                    return e.astronomicalDawn * _;
                })
                .y1(function (e) {
                    return e.astronomicalDusk * _;
                })
                .interpolate("linear");
        function I() {
            (u = +h.width()), (p = +h.height()), c.setAttributeNS(null, "viewBox", "0 0 " + u + " " + p), (f = pd.mapAndConstrainTo(p, 200, 1024, 2, 4)), (_ = p / 24), (x = u / 364), (C = !1);
        }
        function k() {
            C && I(),
                D.text(""),
                D.append("svg:rect").attr("class", "fill-night stroke-none").attr("x", 0).attr("y", 0).attr("width", u).attr("height", p),
                E.text(""),
                E.append("svg:line")
                    .attr("class", "line-axis stroke-dotted")
                    .attr("x1", 0)
                    .attr("y1", 12 * _)
                    .attr("x2", u)
                    .attr("y2", 12 * _);
            for (var e = 0; e < 24; ++e)
                E.append("svg:line")
                    .attr("class", "line-grid")
                    .attr("x1", 0)
                    .attr("y1", e * _)
                    .attr("x2", u)
                    .attr("y2", e * _),
                    E.append("svg:text")
                        .text(e < 10 ? "0" + e : e)
                        .attr("class", "text-grid")
                        .attr("dy", "0.3em")
                        .attr("x", 5)
                        .attr("y", (e + 0.5) * _);
            for (var t = 1, i = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], n = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 364], s = 1; s < 12; ++s)
                E.append("svg:line")
                    .attr("class", "line-grid")
                    .attr("x1", n[s] * x)
                    .attr("y1", 0)
                    .attr("x2", n[s] * x)
                    .attr("y2", p),
                    E.append("svg:text")
                        .text(i[t++])
                        .attr("text-anchor", "middle")
                        .attr("class", "text-grid")
                        .attr("x", Math.round(0.5 * (n[s] + n[s + 1])) * x)
                        .attr("y", p - 7);
            P.text("").style("display", "none"),
                P.append("svg:rect").attr("class", "tooltip").attr("x", 0).attr("y", 0).attr("width", g).attr("height", m),
                P.append("text")
                    .attr("class", "tooltip tooltip-datetime")
                    .attr("text-anchor", "middle")
                    .attr("x", 0.5 * g)
                    .attr("y", 0.7 * m),
                A.text(""),
                (v = A.append("svg:line").attr("class", "hilite-axis")),
                (b = A.append("svg:line").attr("class", "hilite-axis")),
                (y = A.append("svg:circle")
                    .attr("class", "hilite-circle")
                    .attr("r", 1.5 * f)),
                (S = A.append("svg:circle").attr("class", "hilite-shape").attr("r", f)),
                (M = A.append("svg:text").attr("class", "text-hilite")),
                (w = A.append("svg:circle").attr("class", "hilite-shape").attr("r", f)),
                (L = A.append("svg:text").attr("class", "text-hilite")),
                V();
        }
        function V() {
            var e = s.clockTime(),
                t = s.dayOfYear();
            T.text("");
            var i = s.getSunriseSunsetAsObjectArray(1);
            T.selectAll("fill-astronomical")
                .data([i])
                .enter()
                .append("path")
                .attr("class", "fill-astronomical")
                .attr("d", function (e) {
                    return R(e);
                }),
                T.selectAll("fill-nautical")
                    .data([i])
                    .enter()
                    .append("path")
                    .attr("class", "fill-nautical")
                    .attr("d", function (e) {
                        return G(e);
                    }),
                T.selectAll("fill-civil")
                    .data([i])
                    .enter()
                    .append("path")
                    .attr("class", "fill-civil")
                    .attr("d", function (e) {
                        return N(e);
                    }),
                T.selectAll("background-daylight")
                    .data([i])
                    .enter()
                    .append("path")
                    .attr("class", "background-daylight")
                    .attr("d", function (e) {
                        return O(e);
                    }),
                s.dayOfYear(t),
                s.clockTime(e),
                B();
        }
        function B() {
            var e = s.dayOfYear(),
                t = s.clockTime() * _,
                i = e * x;
            v.attr("x1", 0).attr("y1", t).attr("x2", u).attr("y2", t), b.attr("x1", i).attr("y1", 0).attr("x2", i).attr("y2", p), y.attr("cx", i).attr("cy", t);
            var n = e < 183 ? "start" : "end",
                t = e < 183 ? 4 : -4;
            s.latitude() < -10 && 31 < e && e < 334 && ((n = e < 183 ? "end" : "start"), (t = -t));
            e = s.sunriseTime();
            S.attr("cx", i).attr("cy", e * _),
                M.text(s.formatAsTime(e))
                    .attr("text-anchor", n)
                    .attr("x", i + t)
                    .attr("y", e * _ + 10);
            e = s.sunsetTime();
            w.attr("cx", i).attr("cy", e * _),
                L.text(s.formatAsTime(e))
                    .attr("text-anchor", n)
                    .attr("x", i + t)
                    .attr("y", e * _ - 4),
                "none" != P.style("display") && Q();
        }
        (this.undoManager = function (e) {
            return arguments.length ? ((l = e), i) : l;
        }),
            (this.observableDayOfYear = function (e) {
                return arguments.length ? ((o = e), i) : o;
            }),
            (this.observableMinuteOfDay = function (e) {
                return arguments.length ? ((r = e), i) : r;
            }),
            (this.solarPosition = function (e) {
                return arguments.length ? ((s = e), i.refresh(), i) : s;
            }),
            (this.width = function (e) {
                return arguments.length ? ((u = parseInt(e, 10)), h.width(u), i.refresh(), i) : u;
            }),
            (this.height = function (e) {
                return arguments.length ? ((p = parseInt(e, 10)), h.height(p), i.refresh(), i) : p;
            }),
            (this.throttledRescale = function (e) {
                return arguments.length ? ((n = pd.constrainTo(parseInt(e, 10), 0, 5e3)), i) : n;
            }),
            (this.userInteraction = function (e) {
                if (!arguments.length) return a;
                var t = !1 !== e;
                return (
                    t && !a
                        ? h.on("mousedown touchstart", i.handlePointerDown).on("mousemove touchmove", i.handlePointerMove)
                        : !t && a && ((c.style.cursor = "default"), h.off("mousedown touchstart", i.handlePointerDown).off("mousemove touchmove", i.handlePointerMove)),
                    (a = t),
                    i
                );
            });
        var U = null;
        function F() {
            (U = null), I(), k();
        }
        (this.rescale = function () {
            4 < n ? null == U && (U = setTimeout(F, n)) : F();
        }),
            (this.refresh = function () {
                k();
            }),
            (this.handleLocationChange = function () {
                V();
            }),
            (this.handleDateTimeChange = function () {
                B();
            }),
            (this.handleDateChange = function () {
                B();
            }),
            (this.handleTimeChange = function () {
                B();
            }),
            (this.activateTooltip = function () {
                "none" == P.style("display") && (P.style("display", "inline"), Q()),
                    null != j && clearTimeout(j),
                    (j = setTimeout(function () {
                        P.style("display", "none"), (j = null);
                    }, 1500));
            });
        var H = 0,
            z = 1,
            W = 2,
            j = null,
            Y = { minute: -1, day: -1 },
            q = { minute: -1, day: -1 },
            X = H,
            J = !1;
        function Q() {
            var e = s.dayOfYear(),
                t = s.clockTime(),
                i = e * x - 10 - g,
                n = t * _ - 10 - m;
            i < 5 && (i = e * x + 10),
                n < 5 && (n = t * _ + 10),
                P.select(".tooltip-datetime").text(s.formatAsTime(t) + ", " + s.formatAsDate(e)),
                P.attr("transform", function () {
                    return "translate(" + i + ", " + n + ")";
                });
        }
        function Z(e, t) {
            t = t || { minute: -1, day: -1 };
            var i = c.getBoundingClientRect();
            return (t.minute = Math.round(((e.pageY - i.top) / (i.bottom - i.top)) * 24 * 60)), (t.day = Math.round(((e.pageX - i.left) / (i.right - i.left)) * 365)), t;
        }
        function K(e) {
            var t = Z(e);
            X != z && (o ? o(t.day) : s.setDayOfYear(t.day)), X != W && (r ? r(t.minute) : s.setTimeOfDay(t.minute / 60)), e.preventDefault();
        }
        function ee(e) {
            var t = Z(e);
            X = H;
            e = r ? r() : 60 * s.clockTime();
            pd.closeTo(t.minute, e, 30) && (X += z);
            e = o ? o() : s.dayOfYear();
            return pd.closeTo(t.day, e, 5) && (X += W), X;
        }
        function te(e) {
            var t;
            J &&
                (e.preventDefault(),
                (e = pd.preprocessMouseOrTouchEvent(e, c)),
                d && X == H ? (((t = Z(e)).minute = Y.minute + (t.minute - q.minute)), (t.day = Y.day + (t.day - q.day)), X != z && (o ? o(t.day) : s.setDayOfYear(t.day)), X != W && (r ? r(t.minute) : s.setTimeOfDay(t.minute / 60))) : K(e),
                e.preventDefault());
        }
        this.handlePointerDown = function (e) {
            e.preventDefault(),
                (e = pd.preprocessMouseOrTouchEvent(e, c)),
                (J =
                    1 == e.which &&
                    (Z(e, q),
                    (Y.minute = r ? r() : 60 * s.clockTime()),
                    (Y.day = o ? o() : s.dayOfYear()),
                    window.addEventListener("mousemove", te, !0),
                    window.addEventListener("touchmove", te, !0),
                    window.addEventListener("touchcancel", ne, !0),
                    window.addEventListener("touchend", ne, !0),
                    window.addEventListener("mouseup", ne, !0),
                    l && l.storeValues(o, r),
                    ee(e) == H && (d || K(e)),
                    null != j && clearTimeout(j),
                    P.style("display", "inline"),
                    !0));
        };
        var ie;
        function ne(e) {
            window.removeEventListener("mousemove", te, !0),
                window.removeEventListener("touchmove", te, !0),
                window.removeEventListener("touchcancel", ne, !0),
                window.removeEventListener("touchend", ne, !0),
                window.removeEventListener("mouseup", ne, !0),
                (J = !1),
                l && l.checkForChanges(),
                null != j && clearTimeout(j),
                (j = setTimeout(function () {
                    P.style("display", "none"), (j = null);
                }, 1500)),
                (X = -1),
                i.handlePointerMove(e);
        }
        return (
            (this.handlePointerMove = function (e) {
                J
                    ? d || X != H
                        ? X == H && (c.style.cursor = "cell")
                        : ((c.style.cursor = "pointer"), (X = 3))
                    : ((ie = X), ee((e = pd.preprocessMouseOrTouchEvent(e, c))) != ie && (c.style.cursor = X == z ? "ns-resize" : X == W ? "ew-resize" : 3 == X ? "pointer" : "default"));
            }),
            h.attr("class", "svg-chart no-select no-touch"),
            a &&
                $(document).ready(function () {
                    h.on("mousedown touchstart", i.handlePointerDown).on("mousemove touchmove", i.handlePointerMove);
                }),
            this
        );
    }),
    (function () {
        var c = !1,
            p = 0,
            u = 0,
            g = 0,
            m = 0,
            f = 0;
        pd.preprocessMouseOrTouchEvent = function (t, e, i) {
            var n,
                s = {};
            for (n in t)
                "function" == typeof t[n]
                    ? (s[n] = (function (e) {
                          return function () {
                              e.apply(t, arguments);
                          };
                      })(t[n]))
                    : (s[n] = t[n]);
            var a = 0 < (s.original = t).type.length && "p" == t.type.charAt(0) && t.pointerType && "touch" == t.pointerType;
            if (0 < s.type.length && "t" == s.type.charAt(0)) {
                var r = s.targetTouches || s.originalEvent.targetTouches;
                if (r && 0 < r.length) {
                    (c = "touchmove" == s.type), (p = r.length), (s.button = p), (s.which = p), (a = !0);
                    var o = 0;
                    if (!isNaN(i) && 0 <= i)
                        for (var l = 0, d = r.length; l < d; ++l)
                            if (i == r[l].identifier) {
                                o = l;
                                break;
                            }
                    var h = r[o];
                    (s.pageX = h.pageX), (s.pageY = h.pageY);
                }
            } else
                switch (s.type) {
                    case "pointerdown":
                        if (a) {
                            s.which = p + 1;
                            break;
                        }
                    case "mousedown":
                        0 < s.which && (p = s.which);
                        break;
                    case "pointermove":
                        s.which = p;
                    case "mousemove":
                        c = 0 < p;
                        break;
                    case "pointerup":
                        if (a) {
                            t.isPrimary && (c = !1), (s.which = p);
                            break;
                        }
                    case "mouseup":
                        0 < s.which && ((p = 0), (c = !1));
                        break;
                    case "mousewheel":
                    case "DOMMouseScroll":
                        s.delta = pd.sign(pdDOM.getScrollIncrement(t));
                        break;
                    case "keydown":
                        s.delta = pd.sign(pdDOM.getKbdIncrement(t));
                }
            return (
                (s.x = s.pageX),
                (s.y = s.pageY),
                e && e.getBoundingClientRect && ((h = 1 / pdDOM.pageScale), (e = e.getBoundingClientRect()).left && (s.x -= Math.round(e.left * h)), e.top && (s.y -= Math.round(e.top * h))),
                a ? (c ? ((s.dragX = s.x - u), (s.dragY = s.y - g)) : ((s.dragX = 0), (s.dragY = 0)), (u = s.x), (g = s.y)) : (c ? ((s.dragX = s.x - m), (s.dragY = s.y - f)) : ((s.dragX = 0), (s.dragY = 0)), (m = s.x), (f = s.y)),
                (s.dragging = c),
                (s.preventDefault = function () {
                    s.original.preventDefault();
                }),
                (s.stopPropagation = function () {
                    s.original.stopPropagation();
                }),
                s
            );
        };
    })(),
    (pdGL.SunPath3D = function (n, t) {
        var s = this,
            i = (t = t || {}).radius || 1e3,
            _ = t.arrowSize || 1,
            a = t.arrowStyle || 0,
            x = t.labelAngle || 15,
            v = t.tickOffset || 0.0075,
            b = t.textSize || 0.02,
            y = t.tickSize || 0.01,
            u = t.solarPosition || new pd.SolarPosition(),
            r = !1 !== t.horizonClipping,
            o = t.center || [0, 0, 0],
            l = t.lineWidthThin || n.getCanvasLineWidthThin(),
            d = t.lineWidthThick || n.getCanvasLineWidthThick(),
            h = t.colorDiagramLines || [0.4, 0.4, 0.4, 1],
            c = t.colorDiagramText || [0.1, 0.1, 0.1, 1],
            p = t.colorCurrentDateTime || [1, 0, 0, 1],
            g = t.colorSunPathLines || [0.8, 0.5, 0.1, 1],
            m = t.colorSunPathMesh || [1, 1, 0, 1],
            f = t.colorSolarArrow || [0, 0, 0.75, 1],
            S = t.colorAngleLines || [1, 0, 0, 1],
            M = t.colorAngleMesh || [1, 1, 1, 0.75],
            w = t.showNorth || !1,
            L = pd.constrainTo(t.dayIncrement || 2, 1, 30),
            D = pd.constrainTo(t.timeIncrement || 0.03125, 0.01, 3),
            T = t.dayForMonthLine || 21,
            E = !1,
            A = t.shadingMask || null,
            P = !1,
            C = pd.toNumber(t.skyOpacity, 0.5),
            O = 1,
            N = 1,
            G = 0.1,
            R = new pd.SolarPosition().setLocation(0, 0, 0),
            I = new pd3D.MatrixAccumulator(),
            k = new pd3D.MatrixAccumulator(),
            V = new pd3D.Vector(),
            B = [0, 0, 0],
            U = new pd3D.Matrix(),
            F = new pd3D.Matrix(),
            H = new pd3D.Matrix(),
            z = new pd3D.Matrix(),
            W = {
                baseAxis: new pd3D.Mesh({ triangles: !1, lines: !0, twoSided: !0 }),
                baseAxisText: new pd3D.Mesh({ triangles: !0, twoSided: !0 }),
                annualShell: new pd3D.Mesh({ normals: !0, lines: !0, twoSided: !0 }),
                annualSunPath: new pd3D.Mesh({ triangles: !1, lines: !0 }),
                solarArrow: new pd3D.Mesh({ triangles: !1, colors: !0, lines: !0 }),
                angleLines: new pd3D.Mesh({ triangles: !0, lines: !0, colors: !0, twoSided: !0, visible: !1 }),
                dailySunPath: new pd3D.Mesh({ triangles: !0, lines: !0, twoSided: !0 }),
                solarSphere: new pd3D.Shapes.sphere({ normals: !0, radius: 0.0125 }),
                shading: new pd3D.Mesh({ triangles: !0, colors: !0, lines: !0, coords: !0, twoSided: !0 }),
            };
        (this.PROJ_SPHERICAL = 0), (this.PROJ_EQUIDISTANT = 1), (this.PROJ_STEREOGRAPHIC = 2), (this.PROJ_CARTESIAN = 3);
        var e,
            j,
            Y = pd.constrainTo(pd.toInteger(t.projectionType, this.PROJ_SPHERICAL), this.PROJ_SPHERICAL, this.PROJ_CARTESIAN),
            q = [Y == this.PROJ_SPHERICAL ? 1 : 0, Y == this.PROJ_EQUIDISTANT ? 1 : 0, Y == this.PROJ_STEREOGRAPHIC ? 1 : 0],
            X = new pdGL.Shader(
                "\nuniform mat4 objMatrix;\nvarying vec4 worldPosition;\n\nvoid main() {\n    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\n    worldPosition = objMatrix * gl_Vertex;\n}\n",
                "\nuniform vec4 color;\nuniform float opacity;\nvarying vec4 worldPosition;\n\nvoid main() {\n    float alpha = clamp(opacity * color.a, 0.0, 1.0);\n    gl_FragColor = vec4(color.rgb, alpha);\n    if (worldPosition.z < 0.0)\n        discard;\n}\n"
            ),
            J = new pdGL.Shader(
                "\nvarying vec3 vNormal;\nvarying vec3 vVertexDir;\n\nvoid main() {\n    vNormal = gl_NormalMatrix * gl_Normal;\n    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\n    vec4 vtx = gl_ModelViewMatrix * gl_Vertex;\n    vVertexDir = vtx.xyz / vtx.w;\n}\n",
                "\nuniform float sunIntensity;\nvarying vec3 vVertexDir;\nvarying vec3 vNormal;\n\nvoid main() {\n    if (sunIntensity > 0.0) {\n        float viewIncidence = abs(dot(normalize(vVertexDir), normalize(vNormal)));\n        float incidence = (viewIncidence > 0.95) ? 1.0 - (20.0 * (viewIncidence - 0.9499)) : viewIncidence;\n        float opacity = sunIntensity * 0.75 * clamp(pow(incidence, 2.5), 0.0, 1.0);\n        gl_FragColor = vec4(1.0, 1.0, 0.0, opacity);\n    } else {\n        discard;\n    }\n}\n"
            ),
            Q = new pdGL.Shader(
                "\nuniform vec4 color;\nuniform vec3 projection;\nuniform bool useVertexColors;\nvarying vec4 vColor;\n\nconst float DEG2RAD = 0.017453292519943;\nconst float PIon2 = 1.570796326794897;\nconst float PIon4 = 0.785398163397448;\n\nvoid main() {\n    float azi = gl_TexCoord.x * DEG2RAD;\n    float alt = gl_TexCoord.y * DEG2RAD;\n    float radius = projection.x * cos(alt);\n    radius += projection.y * abs(1.0 - (alt / PIon2));\n    radius += projection.z * (1.0 - (atan(clamp(alt / PIon2, 0.0, 1.0)) / PIon4));\n    vColor = (useVertexColors == true) ? gl_Color : color;\n    vec4 pos = vec4(radius * sin(azi), radius * cos(azi), 0.0, 1.0);\n    gl_Position = gl_ModelViewProjectionMatrix * pos;\n}\n",
                "\nuniform float opacity;\nvarying vec4 vColor;\nvarying float zPos;\n\nvoid main() {\n    float alpha = clamp(opacity * vColor.a, 0.0, 1.0);\n    gl_FragColor = vec4(vColor.rgb, alpha);\n    if (alpha < 0.001) {\n        discard;\n    }\n}\n"
            ),
            Z = pdGL.Material.VariableColorUniformPointSize(),
            K = pdGL.Material.FixedColorUniformPointSize(),
            $ = r ? X : K.shader();
        function ee(e) {
            return 1e-9 < e[0] || e[0] < -1e-9 || 1e-9 < e[1] || e[1] < -1e-9 || 1e-9 < e[2] || e[2] < -1e-9;
        }
        function te() {
            if (W.annualShell.visible) {
                var e = W.annualShell;
                e.triangles.length = 0;
                for (var t, i, n = (e.vertices.length = 0), s = 0, a = u.year(), r = 0, o = 0, l = 0, d = [171, 211, 231, 252, 272, 292, 313, 354], h = d.length - 1; 0 <= h; h--) {
                    if (((i = d[h]), R.setDayOfYear(Math.round(i), a).calculate(), R.getHourlySunPathAsPositions3D(0.25, B, 1, !1, e), 0 == r && (r = e.vertices.length), 0 < n)) {
                        (l = n), (o = s);
                        for (var c = 1; c < r - 1; ++c) e.triangles.push([o, l, l + 1]), e.triangles.push([l + 1, o + 1, o]), o++, l++;
                        e.triangles.push([o, l, n]), e.triangles.push([n, s, o]), (s = n);
                    }
                    for (var c = n, p = e.vertices.length; c < p; ++c) (t = e.vertices[c]), e.normals.push([t[0], t[1], t[2]]);
                    n = e.vertices.length;
                }
                e.compile();
            }
        }
        function ie() {
            if (W.annualSunPath.visible) {
                var e = W.annualSunPath,
                    t = u.year();
                (e.vertices.length = 0), (e.lines.length = 0), R.setDayMonthYear(21, 5, t).calculate(), R.getHourlySunPathAsPositions3D(0.25, B, 1, !0, e);
                R.dayOfYear();
                for (var i in [6, 7, 8, 9, 10]) R.setDayMonthYear(T, i, t).calculate(), R.getHourlySunPathAsPositions3D(D, B, 1, !1, e);
                R.setDayMonthYear(21, 11, t).calculate(), R.getHourlySunPathAsPositions3D(0.25, B, 1, !0, e), R.dayOfYear();
                for (var n = 0; n < 24; ++n) R.setTimeOfDay(n), R.getAnalemmaSunPathAsPositions3D(12 == n ? 4 : L, B, 1, 12 == n, e);
                e.compile();
            }
        }
        function ne() {
            var e, t, i;
            W.solarArrow.visible &&
                (((e = W.solarArrow).vertices.length = 0),
                (e.colors.length = 0),
                (e.lines.length = 0),
                0.1 < a
                    ? ((t = 1.5 * _),
                      (i = 0.02 * _),
                      e.color(f),
                      e.addVertex([0, 0, 0]),
                      e.addVertex([t, 0, 0]),
                      (t -= a * i),
                      e.addVertex([t, 0, -i]),
                      e.addVertex([t, 0, i]),
                      e.lines.push([0, 1]),
                      e.lines.push([1, 2]),
                      e.lines.push([1, 3]))
                    : (e.color(f), e.addVertex([0, 0, 0]), e.addVertex([1, 0, 0]), e.color([f[0], f[1], f[2], 0]), e.addVertex([10, 0, 0]), e.lines.push([0, 1]), e.lines.push([1, 2])),
                e.compile());
        }
        function se() {
            var e = W.dailySunPath;
            e.reuseStart(), e.visible ? R.setDayOfYear(u.dayOfYear(), u.year()) : u.latitude() < 0 ? R.setDayOfYear(354, u.year()) : R.setDayOfYear(171, u.year()), R.reuseHourlySunPathAsPositions3D(0.25, B, 1, !0, e);
            var t,
                i = u.latitude() < 0 ? -1.5 * b : 1.5 * b,
                n = 0.2 * i,
                s = 0,
                a = e._vtx_index;
            u.latitude() < 0 ? pd3D.Matrix.scale(-b, -b, -b, F) : pd3D.Matrix.scale(b, b, b, F);
            for (var r = 0; r < a; r += 4) s++ < 24 && ((t = e.vertices[r]), e.addLine(e.addVertex([t[0], t[1] + n, t[2]]), e.addVertex([t[0], t[1] - n, t[2]])));
            pd3D.Font.weight(400);
            for (r = s = 0; r < a; r += 4)
                s < 24 &&
                    ((t = e.vertices[r]),
                    pd3D.Matrix.translate(t[0], t[1] + i, t[2], H),
                    H.multiplyBy(pd3D.Matrix.rotate(180 + (s / 24) * 360, 0, -1, 0)),
                    H.multiplyBy(F),
                    pd3D.Font.addText(s < 10 ? "0" + s : s.toString(), pd.Align.CENTER, pd.Align.CENTER, H, e)),
                    s++;
            e.reuseEnd(), e.compile();
        }
        function ae(e, t, i) {
            for (var n, s = 0, a = i.vertexCount(), r = 0; r <= 1; r += 0.01) (n = 1 - r), i.addVertex([n * e[0] + r * t[0], n * e[1] + r * t[1], n * e[2] + r * t[2]]), a++, ++s % 2 && i.addLine(a - 1, a);
        }
        function re() {
            var e, t, i, n, s, a, r, o, l, d;
            V.normalize(),
                pd3D.Matrix.translate(V.x, V.y, V.z, U),
                k
                    .reset()
                    .rotate(90 - u.azimuthAngle(), 0, 0, 1)
                    .rotate(u.altitudeAngle(), 0, -1, 0),
                W.angleLines.visible &&
                    ((e = W.angleLines),
                    (l = 1.25 * b),
                    (t = u.azimuthAngle()),
                    (i = u.altitudeAngle()),
                    (n = 1.05 + 4 * y + b),
                    e.reuseStart(),
                    e.color(M),
                    pd3D.Matrix.rotate(-t, 0, 0, 1, z),
                    z.multiplyBy(pd3D.Matrix.rotate(-90, 0, 1, 0)),
                    (o = { width: 0.025, radius: n, center: B, defaultNormal: [0, 0, 1], defaultColor: [1, 0, 0, 0.5], fromAngle: 0, toAngle: t, triangles: !0, colors: !0, lines: !0 }),
                    pd3D.Shapes.circularArrow(o, e),
                    (o.center = [0, 0, 0]),
                    (o.toAngle = i),
                    (o.transform = z),
                    pd3D.Shapes.circularArrow(o, e),
                    e.color(p),
                    (d = n + 0.025 + 0.1),
                    (s = t * pd.Const.DEG2RAD),
                    (o = [d * (a = Math.sin(s)), d * (r = Math.cos(s)), 0]),
                    W.solarArrow.visible || ae(B, pd3D.Vector.multiply(V, d).toArray(), e),
                    ae(B, [0, d, 0], e),
                    ae(B, o, e),
                    (n += 0.025 + 0.6 * l),
                    (o[0] = n * Math.sin(0.5 * s)),
                    (o[1] = n * Math.cos(0.5 * s)),
                    pd3D.Font.weight(400),
                    pd3D.Matrix.scale(l, l, l, F),
                    pd3D.Matrix.translate(o[0], o[1], o[2], H),
                    H.multiplyBy(pd3D.Matrix.rotate(-0.5 * t, 0, 0, 1)),
                    H.multiplyBy(F),
                    pd3D.Font.addText(t.toFixed(2) + "`", pd.Align.CENTER, pd.Align.CENTER, H, e),
                    (l = 0.5 * (i * pd.Const.DEG2RAD)),
                    (d = n * Math.cos(l)),
                    (o[0] = d * a),
                    (o[1] = d * r),
                    (o[2] = n * Math.sin(l)),
                    pd3D.Matrix.translate(o[0], o[1], o[2], H),
                    H.multiplyBy(pd3D.Matrix.rotate(-t, 0, 0, 1)),
                    H.multiplyBy(pd3D.Matrix.rotate(0.5 * i, 1, 0, 0)),
                    H.multiplyBy(pd3D.Matrix.rotate(-90, 0, 1, 0)),
                    H.multiplyBy(F),
                    pd3D.Font.addText(i.toFixed(2) + "`", pd.Align.CENTER, pd.Align.CENTER, H, e),
                    e.reuseEnd(),
                    e.compile());
        }
        function oe() {
            W.shading.visible && pd.Shading && (A = A || new pd.Shading(t.shadingOptions)).copyToMesh(W.shading, O);
        }
        function le() {
            I.reset()
                .rotate(u.latitude(), 1, 0, 0)
                .rotate((u.timezoneCorrection() / 24) * 360, 0, -1, 0),
                se(),
                (E = !0);
        }
        function de(e, t) {
            var i = !1;
            switch (((t = !!t), e)) {
                case s.Component.AXIS:
                    (W.baseAxisText.visible = t), (W.baseAxis.visible = t);
                    break;
                case s.Component.ANNUAL_AREA:
                    (W.annualShell.visible = t) && W.annualShell.vertices.length < 1 && (te(), E || le());
                    break;
                case s.Component.ANNUAL_LINES:
                    (W.annualSunPath.visible = t) && W.annualSunPath.vertices.length < 1 && (ie(), E || le());
                    break;
                case s.Component.SUN_DIRECTION:
                    (W.solarArrow.visible = t) && W.solarArrow.vertices.length < 1 && ne(), W.angleLines.visible && re();
                    break;
                case s.Component.SUN_ANGLES:
                    (i = t && !W.angleLines.visible), (W.angleLines.visible = t), (i || (t && W.angleLines.vertices.length < 1)) && re();
                    break;
                case s.Component.DIURNAL_SUN_PATH:
                    (i = t && !W.dailySunPath.visible), (W.dailySunPath.visible = t), i && (se(), E || le());
                    break;
                case s.Component.SUN_POSITION:
                    W.solarSphere.visible = t;
                    break;
                case s.Component.SHADING:
                    W.shading.visible != t && ((W.shading.visible = t), W.shading.visible && (W.shading.vertices.length < 1 ? oe() : P && s.updateShading()));
                    break;
                case s.Component.ALL:
                    for (var n = s.Component.ALL - 1; 0 <= n; n--) de(n, t);
            }
        }
        function he() {
            return "Color values must be given as [r,g,b,a] arrays.";
        }
        return (
            (this.Component = { AXIS: 0, ANNUAL_AREA: 1, ANNUAL_LINES: 2, SUN_DIRECTION: 3, SUN_ANGLES: 4, DIURNAL_SUN_PATH: 5, SUN_POSITION: 6, SHADING: 7, ALL: 8 }),
            (W.baseAxis.visible = void 0 === t.showAxis || !!t.showAxis),
            (W.baseAxisText.visible = void 0 === t.showAxis || !!t.showAxis),
            (W.annualShell.visible = void 0 === t.showAnnualArea || !!t.showAnnualArea),
            (W.annualSunPath.visible = void 0 === t.showAnnualLines || !!t.showAnnualLines),
            (W.solarArrow.visible = void 0 === t.showSunDirection || !!t.showSunDirection),
            (W.angleLines.visible = void 0 !== t.showSunAngles && !!t.showSunAngles),
            (W.dailySunPath.visible = void 0 === t.showSunPath || !!t.showSunPath),
            (W.solarSphere.visible = void 0 === t.showSunPos || !!t.showSunPos),
            (W.shading.visible = void 0 !== t.showShading && !!t.showShading),
            (this.visible = !0),
            (this.show = function (e) {
                for (var t = void 0 !== e && pd.isArray(e) ? e : arguments, i = 0, n = t.length; i < n; ++i) de(+t[i], !0);
                return s;
            }),
            (this.hide = function (e) {
                for (var t = void 0 !== e && pd.isArray(e) ? e : arguments, i = 0, n = t.length; i < n; ++i) de(+t[i], !1);
                return s;
            }),
            (this.isVisible = function (e) {
                switch (e) {
                    case s.Component.AXIS:
                        return W.baseAxis.visible;
                    case s.Component.ANNUAL_AREA:
                        return W.annualShell.visible;
                    case s.Component.ANNUAL_LINES:
                        return W.annualSunPath.visible;
                    case s.Component.SUN_DIRECTION:
                        return W.solarArrow.visible;
                    case s.Component.SUN_ANGLES:
                        return W.angleLines.visible;
                    case s.Component.DIURNAL_SUN_PATH:
                        return W.dailySunPath.visible;
                    case s.Component.SUN_POSITION:
                        return W.solarSphere.visible;
                    case s.Component.ALL:
                        return W.baseAxis.visible && W.baseAxisText.visible && W.annualShell.visible && W.annualSunPath.visible && W.solarArrow.visible && W.angleLines.visible && W.dailySunPath.visible && W.solarSphere.visible;
                }
                return !1;
            }),
            (this.showAll = function () {
                return W.baseAxis.show(!0), W.baseAxisText.show(!0), W.annualShell.show(!0), W.annualSunPath.show(!0), W.solarArrow.show(!0), W.angleLines.show(!0), W.dailySunPath.show(!0), W.solarSphere.show(!0), s;
            }),
            (this.components = function () {
                return W;
            }),
            (this.setCenterAndRadius = function (e, t) {
                return this.center(e), this.radius(t), s;
            }),
            (this.moveTo = function (e, t, i) {
                return (o[0] = pd.toNumber(e, o[0])), (o[1] = pd.toNumber(t, o[1])), (o[2] = pd.toNumber(i, o[2])), s;
            }),
            (this.radius = function (e) {
                return arguments.length ? ((i = pd.toNumber(e, i)), s) : i;
            }),
            (this.center = function (e) {
                return arguments.length ? (pd.isArray(e) && 3 <= e.length && (o = e), s) : o;
            }),
            (this.solarPosition = function (e) {
                return arguments.length ? ((u = e), le(), s) : u;
            }),
            (this.lineWidthThin = function (e) {
                return arguments.length ? ((l = pd.toNumber(e, l)), s) : l;
            }),
            (this.lineWidthThick = function (e) {
                return arguments.length ? ((d = pd.toNumber(e, d)), s) : d;
            }),
            (this.dayForMonthLine = function (e) {
                return arguments.length ? ((e = pd.constrainTo(parseInt(e, 10), 1, 31)) != T && ((T = e), ie()), s) : T;
            }),
            (this.horizonClipping = function (e) {
                return arguments.length ? ((r = pd.toBoolean(e, r)), ($ = r ? X : K.shader()), s) : r;
            }),
            (this.projectionType = function (e) {
                return arguments.length
                    ? ((e = pd.constrainTo(pd.toInteger(e, s.PROJ_EQUIDISTANT), s.PROJ_SPHERICAL, s.PROJ_CARTESIAN)),
                      (q[0] = e == this.PROJ_SPHERICAL ? 1 : 0),
                      (q[1] = e == this.PROJ_EQUIDISTANT ? 1 : 0),
                      (q[2] = e == this.PROJ_STEREOGRAPHIC ? 1 : 0),
                      (Y = e),
                      s)
                    : Y;
            }),
            (this.projectionTransitions = function () {
                return q;
            }),
            (this.colorCurrentDateTime = function (e) {
                if (!arguments.length) return p;
                if (!pd.isArray(e) || 4 != e.length) throw new Error(he());
                return (p = e), s;
            }),
            (this.colorDiagramLines = function (e) {
                if (!arguments.length) return h;
                if (!pd.isArray(e) || 4 != e.length) throw new Error(he());
                return (h = e), s;
            }),
            (this.colorDiagramText = function (e) {
                if (!arguments.length) return c;
                if (!pd.isArray(e) || 4 != e.length) throw new Error(he());
                return (c = e), s;
            }),
            (this.colorSolarArrow = function (e) {
                if (!arguments.length) return f;
                if (!pd.isArray(e) || 4 != e.length) throw new Error(he());
                return (f = e), s;
            }),
            (this.colorAngleLines = function (e) {
                if (!arguments.length) return S;
                if (!pd.isArray(e) || 4 != e.length) throw new Error(he());
                return (S = e), s;
            }),
            (this.colorAngleMesh = function (e) {
                if (!arguments.length) return M;
                if (!pd.isArray(e) || 4 != e.length) throw new Error(he());
                return (M = e), s;
            }),
            (this.colorSunPathLines = function (e) {
                if (!arguments.length) return g;
                if (!pd.isArray(e) || 4 != e.length) throw new Error(he());
                return (g = e), s;
            }),
            (this.colorSunPathMesh = function (e) {
                if (!arguments.length) return m;
                if (!pd.isArray(e) || 4 != e.length) throw new Error(he());
                return (m = e), s;
            }),
            (this.skyFactorLuminance = 0),
            (this.skyFactorUniform = 0),
            (this.shadingMask = function (e) {
                return arguments.length ? ((A = e) || W.shading.clear(), s) : (A = A || new pd.Shading(t.shadingOptions));
            }),
            (this.newShadingIterator = function () {
                return A ? A.newShadingIterator() : null;
            }),
            (this.showSkySegments = function (e) {
                return arguments.length ? ((G = e ? 0.6 : 0.1), s) : 0.2 < G;
            }),
            (this.getShading = function () {
                return A ? A.getShadingData() : null;
            }),
            (this.setShadingSegmentValue = function (e, t) {
                return A && A.setSkyPatchShading(e, t), s;
            }),
            (this.setShadingSegmentColor = function (e, t) {
                return A && A.setSkyPatchColor(e, t), s;
            }),
            (this.updateShading = function (e) {
                return A && (P = !W.shading.visible || (e && A.copyToMesh(W.shading, O), (e = A.updateMesh(W.shading)), (this.skyFactorLuminance = e.skyFactorLuminance), (this.skyFactorUniform = e.skyFactorUniform), !1)), s;
            }),
            (this.setShading = function (e, t) {
                return A && A.setShadingData(e), t || s.updateShading(), s;
            }),
            (this.clearShading = function (e) {
                return A && A.clearShadingData(), e || s.updateShading(), s;
            }),
            (this.projectOnDome = function (t) {
                if (A) {
                    var i = !1;
                    if ((t && O < 1) || (!t && 0 < O))
                        return (
                            n.animationQueue.add(function (e) {
                                return !t && 0 < O ? (O -= 2 * e) < 0 && (i = !(O = 0)) : t && O < 1 && 1 < (O += 2 * e) && ((O = 1), (i = !0)), A.transitionShape(O, W.shading), n.update(), i;
                            }),
                            !0
                        );
                }
                return !1;
            }),
            (this.animateShading = function (e) {
                if (A && e) {
                    return (
                        A.setShadingData(e),
                        n.animationQueue.add(function (e) {
                            return 1 < N && (N = 1), A.transitionData(N, W.shading), n.update(), !1;
                        }),
                        !(N = 0)
                    );
                }
                return !1;
            }),
            (this.handleLocationChange = function () {
                return le(), s;
            }),
            (this.handleDateChange = function () {
                return se(), s;
            }),
            (this.handleTimeChange = function (e) {
                return e ? V.init(e) : V.fromArray(u.getSunDirection()), re(), s;
            }),
            (this.handleDateTimeChange = function () {
                s.handleDateChange(), s.handleTimeChange();
            }),
            (this.handleNorthChange = function () {
                return s;
            }),
            (this.getAABB = function (e) {
                return (
                    this.visible &&
                        ((e && e.min) || ((e = { min: new pd3D.Vector(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE) }).max = e.min.negative()),
                        e.min.x > o[0] - i && (e.min.x = o[0] - i),
                        e.min.y > o[1] - i && (e.min.y = o[1] - i),
                        e.min.z > o[2] && (e.min.z = o[2]),
                        e.max.x < o[0] + i && (e.max.x = o[0] + i),
                        e.max.y < o[1] + i && (e.max.y = o[1] + i),
                        e.max.z < o[2] + i && (e.max.z = o[2] + i)),
                    e
                );
            }),
            (this.drawOutlines = function () {
                var e, t;
                return (
                    this.visible &&
                        (n.pushMatrix(),
                        n.pushLineWidth(),
                        n.depthMask(!1),
                        ee(o) && n.translate(o[0], o[1], o[2]),
                        n.scale(i, i, i),
                        (e = u.northOffset()),
                        pd.closeTo(e, 0, 0.001) || n.rotate(-e, 0, 0, 1),
                        W.baseAxis.visible && (n.lineWidth(l), K.uniform("color", h).drawOutline(W.baseAxis)),
                        W.baseAxisText.visible && (pd3D.Font.isTriangulated ? K.uniform("color", c).drawSurface(W.baseAxisText) : (n.lineWidth(d), K.uniform("color", c).drawOutline(W.baseAxisText))),
                        W.solarArrow.visible && (n.pushMatrix(), n.multMatrix(k.toMatrix()), n.lineWidth(0.5 * (d + l)), (0.1 < a ? K.uniform("color", f) : Z).drawOutline(W.solarArrow), n.popMatrix()),
                        W.angleLines.visible && (n.lineWidth(l), K.uniform("color", S).drawOutline(W.angleLines)),
                        (W.annualSunPath.visible || W.dailySunPath.visible) &&
                            (n.pushMatrix(),
                            (t = I.toMatrix()),
                            $.uniforms({ opacity: 1, objMatrix: t }),
                            n.multMatrix(t),
                            W.annualSunPath.visible && (n.lineWidth(l), $.uniforms({ color: g }).draw(W.annualSunPath, n.LINES)),
                            W.dailySunPath.visible && (n.lineWidth(W.annualSunPath.visible ? d : l), $.uniforms({ color: p }).draw(W.dailySunPath, n.LINES)),
                            n.popMatrix()),
                        W.shading.visible &&
                            (pd.closeTo(e, 0, 0.001) || n.rotate(e, 0, 0, 1),
                            n.depthMask(!1),
                            n.lineWidth(l),
                            K.uniform("color", h).pushUniform("opacity", G).drawOutline(W.shading).popUniform(),
                            Z.pushUniform("opacity", C).drawSurface(W.shading).popUniform(),
                            n.depthMask(!0)),
                        n.popLineWidth(),
                        n.popMatrix()),
                    s
                );
            }),
            (this.drawSurfaces = function () {
                var e, t;
                return (
                    this.visible &&
                        (n.pushMatrix(),
                        ee(o) && n.translate(o[0], o[1], o[2]),
                        n.scale(i, i, i),
                        (e = u.northOffset()),
                        pd.closeTo(e, 0, 0.001) || n.rotate(-e, 0, 0, 1),
                        W.solarSphere.visible &&
                            (n.pushMatrix(),
                            n.multMatrix(U),
                            K.uniform("color", p).drawSurface(W.solarSphere),
                            n.scale(4, 4, 4),
                            n.depthMask(!1),
                            J.uniforms({ sunIntensity: pd.mapAndConstrainTo(V.z, 0.0523359, 0.1564345, 0, 1) }).draw(W.solarSphere, n.TRIANGLES),
                            n.depthMask(!0),
                            n.popMatrix()),
                        W.angleLines.visible && Z.uniform("opacity", 1).drawSurface(W.angleLines),
                        (W.annualShell.visible || W.dailySunPath.visible) &&
                            (n.pushMatrix(),
                            (t = I.toMatrix()),
                            $.uniforms({ objMatrix: t }),
                            n.multMatrix(t),
                            n.depthMask(!1),
                            n.setCullFace(!1),
                            W.dailySunPath.visible && $.uniforms({ opacity: 1, color: p }).draw(W.dailySunPath, n.TRIANGLES),
                            W.annualShell.visible && $.uniforms({ opacity: 0.15, color: m }).draw(W.annualShell, n.TRIANGLES),
                            n.depthMask(!0),
                            n.setCullFace(),
                            n.popMatrix()),
                        W.shading.visible && (pd.closeTo(e, 0, 0.001) || n.rotate(e, 0, 0, 1), n.depthMask(!1), Z.pushUniform("opacity", C).drawSurface(W.shading).popUniform(), n.depthMask(!0)),
                        n.popMatrix()),
                    s
                );
            }),
            (this.draw2D = function (e, t) {
                return (
                    n.clearColor(1, 1, 1, 1),
                    n.clear(n.COLOR_BUFFER_BIT | n.DEPTH_BUFFER_BIT),
                    W.shading.visible &&
                        (n.orbitalView.startOverlay2D(1e3, 1e3),
                        n.pushMatrix(),
                        n.pushLineWidth(),
                        (t = pd.toNumberInRange(t, 256, 1, Number.POSITIVE_INFINITY)),
                        n.translate(+e, +e, 0),
                        n.scale(t, -t, 1),
                        (t = u.northOffset()),
                        pd.closeTo(t, 0, 0.001) || n.rotate(t, 0, 0, 1),
                        Q.uniforms({ projection: q }),
                        Q.uniforms({ opacity: 1, useVertexColors: !0 }).draw(W.shading, n.TRIANGLES),
                        n.lineWidth(l),
                        (0.2 < G ? Q.uniforms({ opacity: G, color: c, useVertexColors: !1 }) : Q.uniforms({ opacity: 1, useVertexColors: !0 })).draw(W.shading, n.LINES),
                        n.setCullFace(),
                        n.popLineWidth(),
                        n.popMatrix(),
                        n.orbitalView.endOverlay2D()),
                    s
                );
            }),
            (this.drawWithMaterial = function (e, t) {
                return this.visible && (t == n.TRIANGLES ? s.drawSurfaces() : t == n.LINES && s.drawOutlines()), s;
            }),
            (this.draw = function (e) {
                return this.visible && (e == n.LINES || e == pd3D.RENDER_FIRST ? s.drawOutlines() : s.drawSurfaces()), s;
            }),
            (function () {
                var e,
                    t = W.baseAxis;
                t.reuseStart();
                for (var i, n, s, a, r, o = 1 + v, l = o + y, d = o + 2.5 * y, h = o + 1.5 * y, c = o + 3 * y + 0.6 * b, p = 0; p <= 360; ++p)
                    (e = pd.sinDegrees(p)),
                        (a = pd.cosDegrees(p)),
                        (i = p % 5 ? l : p % 15 == 0 ? d : h),
                        (n = t.addVertex([e, a, 0])),
                        (s = t.addVertex([o * e, o * a, 0])),
                        (a = t.addVertex([i * e, i * a, 0])),
                        t.addLine(s, a),
                        0 < p && t.addLine(r, n),
                        (r = n);
                t.addLine(t.addVertex([0, -d, 0]), t.addVertex([0, d, 0])), t.addLine(t.addVertex([-d, 0, 0]), t.addVertex([d, 0, 0])), t.reuseEnd(), t.compile();
                var u = W.baseAxisText;
                u.reuseStart();
                var g = "",
                    m = b;
                pd3D.Font.weight(400), pd3D.Matrix.scale(m, m, m, F);
                for (var f, p = 0; p < 360; p += x)
                    p % 45 &&
                        (pd3D.Matrix.translate(c * pd.sinDegrees(p), c * pd.cosDegrees(p), 0, H), H.multiplyBy(pd3D.Matrix.rotate(-p, 0, 0, 1)), H.multiplyBy(F), pd3D.Font.addText(p.toString(), pd.Align.CENTER, pd.Align.CENTER, H, u));
                for (
                    pd3D.Font.weight(600),
                        m *= 1.25,
                        w &&
                            ((f = b * _),
                            pd3D.Matrix.scale(1.5 * m, 1.5 * m, 1.5 * m, F),
                            pd3D.Matrix.translate(0, d + 1.41421 * f + m, 0, H),
                            H.multiplyBy(F),
                            pd3D.Font.addText("N", pd.Align.CENTER, pd.Align.CENTER, H, u),
                            u.addTriangle(u.addVertex([0, d + 1.41421 * f, 0]), u.addVertex([-f, d, 0]), u.addVertex([f, d, 0]))),
                        pd3D.Matrix.scale(m, m, m, F),
                        p = w ? 45 : 0;
                    p < 360;
                    p += 45
                ) {
                    switch (p) {
                        case 0:
                            g = "N";
                            break;
                        case 45:
                            g = "NE";
                            break;
                        case 90:
                            g = "E";
                            break;
                        case 135:
                            g = "SE";
                            break;
                        case 180:
                            g = "S";
                            break;
                        case 225:
                            g = "SW";
                            break;
                        case 270:
                            g = "W";
                            break;
                        case 315:
                            g = "NW";
                    }
                    pd3D.Matrix.translate(c * pd.sinDegrees(p), c * pd.cosDegrees(p), 0, H), H.multiplyBy(pd3D.Matrix.rotate(-p, 0, 0, 1)), H.multiplyBy(F), pd3D.Font.addText(g, pd.Align.CENTER, pd.Align.CENTER, H, u);
                }
                u.reuseEnd(), u.compile();
            })(),
            te(),
            ie(),
            W.solarSphere.visible &&
                ((e = W.solarSphere),
                (j = 0.01 * _),
                (e.vertices = e.vertices.map(function (e) {
                    return pd3D.Vector.fromArray(e).normalize().scale(j).toArray();
                })),
                e.compile()),
            ne(),
            re(),
            oe(),
            (W.annualShell.visible || W.annualSunPath.visible) && le(),
            (this.visible = pd.toBoolean(t.visible, !0)),
            this
        );
    }),
    ((pdSVG = pdSVG || {}).SunPath2D = function (e) {
        var m = this;
        if (null == (e = e || {}).elementId) throw new Error("A valid 'elementId' is required and must be an existing SVG element in the DOM.");
        var t = e.elementId || "svg",
            r = e.solarPosition || new pd.SolarPosition(),
            f = pd.toBoolean(e.showBackground, !0),
            _ = pd.toBoolean(e.fullScreenRect, !1),
            i = pd.toBoolean(e.userInteraction, !0),
            o = pd.toInteger(e.dayForMonthlyLines, 21),
            n = pd.toInteger(e.throttledRescale, 0),
            s = pd.toInteger(e.minChartWidth, 0),
            a = pd.toInteger(e.minChartHeight, 0),
            l = pd.toBoolean(e.showSkySegments, !1),
            d = e.undoManager || null,
            h = e.observableLatitude || null,
            c = e.observableLongitude || null,
            p = e.observableDate || null,
            u = e.observableTime || null,
            x = pd.toNumber(e.tooltipHeight, 20),
            v = pd.toNumber(e.tooltipWidth, 80),
            g = e.defaultCursor || "default",
            b = e.shadingMask || null,
            y = 0,
            S = 0,
            M = null,
            w = $(t),
            L = d3.select(t),
            D = w[0],
            T = 720,
            E = 720,
            A = 0.44,
            P = T * A,
            C = 3;
        w.empty(), L.append("style");
        var O = L.append("g").attr({ id: "background", class: "background no-pointer" }),
            N = L.append("g").attr({ id: "world-map", class: "world-map" }),
            G = L.append("g").attr({ id: "shading", class: "shading" }),
            R = L.append("g").attr({ id: "shading-offset", class: "shading offset" }).style("visibility", "hidden"),
            I = L.append("g").attr({ id: "diagram", class: "diagram no-pointer" }),
            k = L.append("g").attr({ id: "diagram-text", class: "diagram-text no-pointer" }),
            V = L.append("g").attr({ id: "sun-angles", class: "sun-angles no-pointer" }),
            B = L.append("g").attr({ id: "sun-arc", class: "sun-arc no-pointer" }),
            U = L.append("g").attr({ id: "sun-path", class: "sun-path no-pointer" }),
            F = L.append("g").attr({ id: "sun-pos", class: "sun-pos no-pointer" }),
            H = L.append("g").attr({ id: "sun-line", class: "sun-line no-pointer" }),
            z = L.append("g").attr({ id: "overlay", class: "overlay no-pointer" }),
            W = L.append("g").attr({ id: "tooltip", class: "chart-tooltip no-pointer" }),
            j = null,
            Y = null,
            q = pd.toBoolean(e.showDataOverlay, !1),
            X = pd.toBoolean(e.showLegend, !1),
            J = e.callbackDblClickLegend || null,
            Q = 0,
            Z = null,
            K = null,
            ee = null,
            te = null,
            ie = null,
            ne = null,
            se = null,
            ae = null,
            re = null,
            oe = null,
            le = null,
            de = null,
            he = null,
            ce = null,
            pe = null,
            ue = null,
            ge = null,
            me = null,
            fe = null,
            _e = !0,
            xe = !1,
            ve = new pd.SolarPosition(),
            be = null;
        this.Component = { AXIS: 0, ANNUAL_AREA: 1, ANNUAL_LINES: 2, WORLD_MAP: 3, SUN_ANGLES: 4, DIURNAL_SUN_PATH: 5, SUN_POSITION: 6, SHADING: 7, ALL: 8 };
        var ye = [
            void 0 === e.showAxis || !!e.showAxis,
            void 0 === e.showAnnualArea || !!e.showAnnualArea,
            void 0 === e.showAnnualLines || !!e.showAnnualLines,
            void 0 !== e.showWorldMap && !!e.showWorldMap,
            void 0 === e.showSunAngles || !!e.showSunAngles,
            void 0 === e.showSunPath || !!e.showSunPath,
            void 0 === e.showSunPos || !!e.showSunPos,
            void 0 !== e.showShading && !!e.showShading,
            !1,
        ];
        I.style("visibility", ye[m.Component.AXIS] ? "visible" : "hidden"),
            k.style("visibility", ye[m.Component.AXIS] ? "visible" : "hidden"),
            N.style("visibility", ye[m.Component.WORLD_MAP] ? "visible" : "hidden"),
            B.style("visibility", ye[m.Component.ANNUAL_AREA] ? "visible" : "hidden"),
            U.style("visibility", ye[m.Component.ANNUAL_LINES] ? "visible" : "hidden"),
            V.style("visibility", ye[m.Component.SUN_ANGLES] ? "visible" : "hidden"),
            H.style("visibility", ye[m.Component.DIURNAL_SUN_PATH] ? "visible" : "hidden"),
            F.style("visibility", ye[m.Component.SUN_POSITION] ? "visible" : "hidden"),
            G.style("visibility", ye[m.Component.SHADING] ? "visible" : "hidden"),
            W.style("visibility", "display", "none"),
            (this.PROJ_SPHERICAL = 0),
            (this.PROJ_EQUIDISTANT = 1),
            (this.PROJ_STEREOGRAPHIC = 2),
            (this.PROJ_CARTESIAN = 3);
        var Se = pd.constrainTo(pd.toInteger(e.projectionType, this.PROJ_SPHERICAL), this.PROJ_SPHERICAL, this.PROJ_CARTESIAN),
            Me = Se,
            we = 1,
            Le = 1;
        function De(e, t, i) {
            switch (e) {
                default:
                case m.PROJ_SPHERICAL:
                    return [Math.cos(i) * Math.sin(t), -Math.sin(i)];
                case m.PROJ_STEREOGRAPHIC:
                    return [(n = 1 / (1 + (s = Math.cos(t)) * (a = Math.cos(i)))) * a * Math.sin(t), -n * Math.sin(i)];
                case m.PROJ_EQUIDISTANT:
                    var n,
                        s = Math.cos(t),
                        a = Math.cos(i),
                        s = Math.acos(s * a);
                    return [(n = 0.638 * (s && s / Math.sin(s))) * a * Math.sin(t), -n * Math.sin(i)];
                case m.PROJ_CARTESIAN:
                    return [(t / Math.PI) * 1.134 * Le, (i / Math.PI) * 4.54];
            }
        }
        function Te(e, t, i) {
            switch (e) {
                default:
                case m.PROJ_SPHERICAL:
                    return [Math.cos(i) * Math.sin(t), Math.sin(i)];
                case m.PROJ_STEREOGRAPHIC:
                    return [(n = 1 / (1 + (s = Math.cos(t)) * (a = Math.cos(i)))) * a * Math.sin(t), n * Math.sin(i)];
                case m.PROJ_EQUIDISTANT:
                    var n,
                        s = Math.cos(t),
                        a = Math.cos(i),
                        s = Math.acos(s * a);
                    return [(n = 0.638 * (s && s / Math.sin(s))) * a * Math.sin(t), n * Math.sin(i)];
                case m.PROJ_CARTESIAN:
                    return [t * Le, i];
            }
        }
        var Ee = d3.geo
                .equirectangular()
                .precision(0.1)
                .translate([T / 2, E])
                .scale(P),
            Ae = d3.geo
                .projection(function (e, t) {
                    if (we < 0.999) {
                        var i = 1 - we,
                            n = De(Me, e, t),
                            s = De(Se, e, t);
                        return [i * n[0] + we * s[0], i * n[1] + we * s[1]];
                    }
                    return De(Se, e, t);
                })
                .translate([T / 2, E / 2])
                .scale(P)
                .rotate([0, -90])
                .clipAngle(90.1)
                .precision(0.1),
            Pe = d3.geo.path().projection(Ae),
            Ce = d3.geo
                .projection(function (e, t) {
                    if (Se === m.PROJ_CARTESIAN) return [(e / Math.PI) * 1.134 * Le, (t / Math.PI) * 4.54];
                    var i = Math.cos(e),
                        n = Math.cos(t);
                    return [(i = 1 / (1 + i * n)) * n * Math.sin(e), -i * Math.sin(t)];
                })
                .translate([T / 2, E / 2])
                .scale(P)
                .rotate([0, -90])
                .clipAngle(91.5)
                .precision(0.1),
            Oe = d3.geo.path().projection(Ce),
            Ne = d3.geo
                .projection(function (e, t) {
                    if (we < 0.999) {
                        var i = 1 - we,
                            n = Te(Me, e, t),
                            s = Te(Se, e, t);
                        return [i * n[0] + we * s[0], i * n[1] + we * s[1]];
                    }
                    return Te(Se, e, t);
                })
                .translate([T / 2, E / 2])
                .rotate([0, -51.5])
                .scale(P)
                .clipAngle(90.1)
                .precision(0.1),
            Ge = d3.geo.path().projection(Ne),
            Re = null,
            Ie = null;
        function ke() {
            (Re = _ || Se != m.PROJ_CARTESIAN ? ((Ie = Ce), Ae) : (Ie = Ee)), Pe.projection(Re), Oe.projection(Ie);
        }
        function Ve() {
            (T = Math.max(s, +w.width())),
                (E = Math.max(a, +w.height())),
                D.setAttributeNS(null, "viewBox", "0 0 " + (T + 1) + " " + (E + 1)),
                Se == m.PROJ_CARTESIAN ? (_ ? (P = 0.775 * E * A) : 0.305 * E < (P = 0.35 * T * A) && (P = 0.305 * E)) : (P = Math.min(T, E) * A),
                (C = pd.mapAndConstrainTo(P, 135, 250, 2, 3));
            var e = T / 2,
                t = E / 2;
            (Le = T / E / 0.775),
                Se == m.PROJ_CARTESIAN && _ && (t = 0.775 * E),
                Ee.translate([e, t]).scale(P),
                Ae.translate([e, t])
                    .rotate([0, Se == m.PROJ_CARTESIAN ? 0 : -90])
                    .clipAngle(Se == m.PROJ_CARTESIAN ? null : 90.1)
                    .scale(P),
                Ce.translate([e, t])
                    .rotate([0, Se == m.PROJ_CARTESIAN ? 0 : -90])
                    .clipAngle(Se == m.PROJ_CARTESIAN ? null : 91.5)
                    .scale(P),
                Ne.translate([e, E / 2]).scale(P),
                L.selectAll(".land").attr("d", Ge),
                L.selectAll(".countries path").attr("d", Ge),
                (_e = !1);
        }
        function Be(e, t) {
            _e && Ve(),
                N.text(""),
                N.append("path").datum(topojson.object(t, t.objects.land)).attr("class", "land").attr("d", Ge),
                N.append("g").attr("class", "countries").selectAll("path").data(topojson.object(t, t.objects.countries).geometries).enter().append("path").attr("d", Ge);
        }
        function Ue() {
            _e && Ve(), I.text(""), k.text(""), O.text(""), (Z = I.append("path").datum(d3.geo.graticule()).attr("class", "tweenable line-grid").attr("d", Pe));
            var e = [],
                t = [],
                i = P < 400 ? -1.2 : -0.75,
                n = 5,
                s = 1;
            Se == m.PROJ_CARTESIAN && ((i = -0.3), T < 1100 && ((n = 15), (s = 5)));
            for (var a, r, o, l = 0; l < 360; l += s)
                l % n
                    ? e.push([
                          [l, 0],
                          [l, i],
                      ])
                    : t.push([
                          [l, 0],
                          [l, 2 * i],
                      ]);
            I.append("path").datum({ type: "MultiLineString", coordinates: e }).attr("class", "tickable line-axis").attr("d", Oe),
                I.append("path").datum({ type: "MultiLineString", coordinates: t }).attr("class", "tickable line-black").attr("d", Oe),
                I.append("path")
                    .datum({
                        type: "MultiLineString",
                        coordinates: [
                            [
                                [0, 0],
                                [179.99, 0],
                            ],
                            [
                                [0, 0],
                                [-179.99, 0],
                            ],
                            [
                                [0, 90],
                                [0, 0],
                            ],
                        ],
                    })
                    .attr("class", "tweenable line-axis")
                    .attr("opacity", 0.4)
                    .attr("d", Pe),
                Se == m.PROJ_CARTESIAN
                    ? ((r = Ie([-180, 90])),
                      (g = (d = Ie([180, 0]))[0] - r[0] + 1),
                      (a = d[1] - r[1]),
                      (g = " M " + r[0] + " " + r[1] + " l " + g + " 0 l 0 " + a + " l -" + g + " 0 l 0 -" + a + " Z"),
                      (f ? O.append("path").attr("class", "stroke-none background-" + (ye[m.Component.WORLD_MAP] ? "map" : "daylight")) : O.append("path").attr("class", "tweenable fade-out line-grid")).attr("d", g),
                      _ ||
                          ((d = Ie([180, -90])),
                          I.append("rect")
                              .attr("class", "line-axis")
                              .attr("x", r[0])
                              .attr("y", r[1])
                              .attr("width", d[0] - r[0])
                              .attr("height", d[1] - r[1])),
                      (r = Ie([-180, 0])),
                      (d = Ie([180, -0.83333])),
                      O.append("rect")
                          .attr("class", "background-map")
                          .attr("x", r[0] - 1)
                          .attr("y", r[1])
                          .attr("width", d[0] - r[0] + 2)
                          .attr("height", d[1] - r[1]),
                      (a = f ? 1 : 0.75),
                      (r = Ie([-180, -0.83333])),
                      (d = Ie([180, -6])),
                      O.append("line").attr("class", "line-axis stroke-dashed").attr("opacity", "0.8").attr("x1", r[0]).attr("y1", r[1]).attr("x2", d[0]).attr("y2", r[1]),
                      O.append("rect")
                          .attr("class", "fill-civil")
                          .attr("fill-opacity", a)
                          .attr("x", r[0] - 1)
                          .attr("y", r[1])
                          .attr("width", d[0] - r[0] + 2)
                          .attr("height", d[1] - r[1]),
                      O.append("text")
                          .text("Civil Twilight")
                          .attr("text-anchor", "middle")
                          .attr("class", "text-twilight-dark")
                          .attr("x", (r[0] + d[0]) / 2)
                          .attr("y", (r[1] + d[1]) / 2)
                          .attr("dy", 4),
                      (r = Ie([-180, -6])),
                      (d = Ie([180, -12])),
                      O.append("rect")
                          .attr("class", "fill-nautical")
                          .attr("fill-opacity", a)
                          .attr("x", r[0] - 1)
                          .attr("y", r[1])
                          .attr("width", d[0] - r[0] + 2)
                          .attr("height", d[1] - r[1]),
                      O.append("text")
                          .text("Nautical Twilight")
                          .attr("text-anchor", "middle")
                          .attr("class", "text-twilight-dark")
                          .attr("x", (r[0] + d[0]) / 2)
                          .attr("y", (r[1] + d[1]) / 2)
                          .attr("dy", 4),
                      (r = Ie([-180, -12])),
                      (d = Ie([180, -18])),
                      O.append("rect")
                          .attr("class", "fill-astronomical")
                          .attr("fill-opacity", a)
                          .attr("x", r[0] - 1)
                          .attr("y", r[1])
                          .attr("width", d[0] - r[0] + 2)
                          .attr("height", d[1] - r[1]),
                      O.append("text")
                          .text("Astronomical Twilight")
                          .attr("text-anchor", "middle")
                          .attr("class", "text-twilight")
                          .attr("x", (r[0] + d[0]) / 2)
                          .attr("y", (r[1] + d[1]) / 2)
                          .attr("dy", 4),
                      (r = Ie([-180, -18])),
                      (d = Ie([180, -90])),
                      _ && (d[1] = E),
                      O.append("rect")
                          .attr("class", "fill-night")
                          .attr("fill-opacity", a)
                          .attr("x", r[0] - 1)
                          .attr("y", r[1])
                          .attr("width", d[0] - r[0] + 2)
                          .attr("height", d[1] - r[1]),
                      O.append("text")
                          .text("Night-time")
                          .attr("text-anchor", "middle")
                          .attr("class", "text-twilight")
                          .attr("x", (r[0] + d[0]) / 2)
                          .attr("y", (r[1] + d[1]) / 2)
                          .attr("dy", 4),
                      k
                          .append("g")
                          .selectAll("text")
                          .data(d3.range(-180, 181, 30))
                          .enter()
                          .append("text")
                          .each(function (e) {
                              e = Ie([e, 0]);
                              d3.select(this)
                                  .attr("class", "text-axis bold3")
                                  .attr("text-anchor", "middle")
                                  .attr("x", e[0])
                                  .attr("y", e[1] - 10);
                          })
                          .attr("dy", ".35em")
                          .text(function (e) {
                              return 0 === e ? "N" : 90 === e ? "E" : -180 === e || 180 === e ? "S" : -90 === e || 270 === e ? "W" : e + "°";
                          }),
                      k
                          .append("g")
                          .selectAll(".altitude-markers")
                          .data(d3.range(10, 81, 10))
                          .enter()
                          .append("text")
                          .each(function (e) {
                              e = Re([0, e]);
                              d3.select(this)
                                  .attr("class", "text-grid")
                                  .attr("text-anchor", "start")
                                  .attr("x", e[0] + 4)
                                  .attr("y", e[1]);
                          })
                          .attr("dy", "0.4em")
                          .text(function (e) {
                              return e + "°";
                          }),
                      k
                          .append("g")
                          .selectAll(".twilight-markers")
                          .data(d3.range(-18, 0, 6))
                          .enter()
                          .append("text")
                          .each(function (e) {
                              e = Re([0, e]);
                              d3.select(this)
                                  .attr("class", "text-grid")
                                  .attr("text-anchor", "start")
                                  .attr("x", e[0] + 4)
                                  .attr("y", e[1]);
                          })
                          .attr("dy", "0.4em")
                          .text(function (e) {
                              return e + "°";
                          }))
                    : ((h = d3.geo.circle().origin([0, 90]).angle(90)),
                      f &&
                          O.append("path")
                              .datum(h)
                              .attr("class", "tweenable stroke-none background-" + (ye[m.Component.WORLD_MAP] ? "map" : "daylight"))
                              .attr("d", Pe),
                      I.append("path").datum(h).attr("class", "tweenable fade-out line-black").attr("d", Pe),
                      (o = pd.mapAndConstrainTo(P, 100, 1024, 1, 0.1)),
                      I.append("path")
                          .datum({
                              type: "MultiLineString",
                              coordinates: [
                                  [
                                      [0, 90],
                                      [90, 0],
                                  ],
                                  [
                                      [0, 90],
                                      [-90, 0],
                                  ],
                                  [
                                      [0, 90],
                                      [180, 0],
                                  ],
                              ],
                          })
                          .attr("class", "tweenable line-axis")
                          .attr("opacity", 0.4)
                          .attr("d", Pe),
                      k
                          .append("g")
                          .selectAll("text")
                          .data(d3.range(-180, 180, 15))
                          .enter()
                          .append("text")
                          .each(function (e) {
                              var t = Ie([e, -5 * o]);
                              d3.select(this)
                                  .attr("class", "text-axis bold6")
                                  .attr("transform", "rotate(" + e + " " + t[0] + " " + t[1] + ")")
                                  .attr("text-anchor", "middle")
                                  .attr("x", t[0])
                                  .attr("y", t[1]);
                          })
                          .attr("dy", ".5em")
                          .text(function (e) {
                              return 0 === e ? "N" : 90 === e ? "E" : -180 === e || 180 === e ? "S" : -90 === e || 270 === e ? "W" : e + "°";
                          }),
                      k
                          .append("g")
                          .selectAll("text")
                          .data(d3.range(10, 81, 10))
                          .enter()
                          .append("text")
                          .each(function (e) {
                              e = Re([0, e]);
                              d3.select(this)
                                  .attr("class", "text-grid")
                                  .attr("text-anchor", "start")
                                  .attr("x", e[0] + 2)
                                  .attr("y", e[1]);
                          })
                          .attr("dy", ".35em")
                          .text(function (e) {
                              return e + "°";
                          })),
                (Y = I.append("g")).style("visibility", ye[m.Component.WORLD_MAP] ? "visible" : "hidden");
            var d = 0,
                h = 0;
            if (Se == m.PROJ_CARTESIAN) {
                var c = Re([-10, (u = _ ? 32 : 0)]),
                    p = Re([10, u]);
                Y.append("line").attr("class", "line-blue").attr("x1", c[0]).attr("y1", c[1]).attr("x2", p[0]).attr("y2", p[1]),
                    (d = Math.round(0.5 * (c[0] + p[0]))),
                    (h = Math.round(0.5 * (c[1] + p[1]))),
                    (c = Re([0, _ ? 28 : 41])),
                    (p = Re([0, _ ? 36 : 49])),
                    Y.append("line").attr("class", "line-blue").attr("x1", c[0]).attr("y1", c[1]).attr("x2", p[0]).attr("y2", p[1]);
            } else {
                var u = 85;
                switch (Se) {
                    case m.PROJ_EQUIDISTANT:
                        u = 82.5;
                        break;
                    case m.PROJ_STEREOGRAPHIC:
                        u = 80;
                }
                (c = Re([-90, u])), (p = Re([90, u]));
                Y.append("line").attr("class", "line-blue").attr("x1", c[0]).attr("y1", c[1]).attr("x2", p[0]).attr("y2", p[1]),
                    (d = Math.round(0.5 * (c[0] + p[0]))),
                    (h = Math.round(0.5 * (c[1] + p[1]))),
                    (c = Re([0, u])),
                    (p = Re([-180, u])),
                    Y.append("line").attr("class", "line-blue").attr("x1", c[0]).attr("y1", c[1]).attr("x2", p[0]).attr("y2", p[1]);
            }
            (j = I.append("g")).style("visibility", "hidden");
            var g = " M " + (d + 12) + " " + (h - 18) + " l -4 10 l 10 -4 M " + (d + 8) + " " + (h - 8) + " l 20 -20 l 25 0";
            j.append("path").attr("class", "line-blue").attr("d", g),
                j
                    .append("text")
                    .text("Map Location")
                    .attr("text-anchor", "start")
                    .attr("class", "text-blue")
                    .attr("x", d + 58)
                    .attr("y", h - 28)
                    .attr("dy", "0.4em"),
                F.text("");
            h = 0.5 * C + "px";
            F.append("circle")
                .attr("fill", "none")
                .attr("stroke", "yellow")
                .attr("stroke-width", h)
                .attr("r", 2.25 * C),
                F.append("circle")
                    .attr("fill", "none")
                    .attr("opacity", "0.5")
                    .attr("stroke", "yellow")
                    .attr("stroke-width", h)
                    .attr("r", 2.75 * C),
                F.append("circle")
                    .attr("fill", "none")
                    .attr("opacity", "0.15")
                    .attr("stroke", "yellow")
                    .attr("stroke-width", h)
                    .attr("r", 3.25 * C),
                F.append("circle")
                    .attr("class", "hilite-circle")
                    .attr("r", 1.5 * C),
                V.text(""),
                (ie = V.append("line").attr("class", "hilite-axis")),
                (te = V.append("circle")
                    .attr("class", "hilite-circle")
                    .attr("r", 0.5 * C)),
                (ee = V.append("line").attr("class", "hilite-axis")),
                (K = V.append("circle")
                    .attr("class", "hilite-circle")
                    .attr("r", 0.5 * C)),
                (ne = V.append("circle").attr("class", "hilite-axis").attr("r", 0)),
                q &&
                    (oe ||
                        ((oe = z.append("text").attr({ class: "text-overlay", "text-anchor": "start", x: 5, y: 5, dy: "0.9em" })),
                        (le = z.append("text").attr({ class: "text-overlay", "text-anchor": "start", x: 5, y: 20, dy: "0.9em" })),
                        (de = z.append("text").attr({ class: "text-overlay", "text-anchor": "start", x: 5, y: 35, dy: "0.9em" })))),
                X &&
                    (function () {
                        if (!he && b) {
                            var e;
                            (Q = 115.5),
                                (he = z.append("g").attr({ id: "sp2d-legend", class: "legend" })),
                                (ge = he.append("text").attr({ class: "text-overlay", "text-anchor": "end", x: 0, y: 5, dy: "0.9em" })),
                                (ce = he.append("text").attr({ class: "text-axis", "text-anchor": "end", x: -18, y: 22, dy: "0.9em" })),
                                (pe = he.append("text").attr({ class: "text-axis", "text-anchor": "end", x: -18, y: 68.75, dy: "0.5em" })),
                                (ue = he.append("text").attr({ class: "text-axis", "text-anchor": "end", x: -18, y: 115.5, dy: "0.0em" }));
                            for (var t = 0; t <= 30; ++t) (e = b.luminanceColorScaleAsHex(1 - t / 30)), he.append("rect").attr({ fill: e, stroke: "none", x: -15, y: 22 + 3 * t, width: 15, height: 3.5 });
                            he.append("rect").attr({ class: "line-axis", x: -15, y: 22, width: 15, height: 93.5 }),
                                (me = he
                                    .append("path")
                                    .attr("d", "m3,9v11h14V9M4,9V6c0-3.3 2.7-6 6-6c3.3,0 6,2.7 6,6v3H14V6c0-2.2-1.8-4-4-4-2.2,0-4,1.8-4,4v3")
                                    .attr("transform", "translate(-13.5, 26), scale(0.6)")
                                    .attr("class", "hidden")
                                    .attr("fill", "white"));
                        }
                        he.attr("transform", "translate(" + (T - 5) + ", 0)");
                    })(),
                (function () {
                    var e = Math.round(v - 8),
                        t = Math.round(x - 8),
                        i = Math.round(0.5 * e),
                        n = "";
                    re ||
                        (W.attr("opacity", "0"),
                        (re = W.append("path").attr("class", "tooltip")),
                        (se = W.append("text")
                            .text("0.00")
                            .attr({ class: "tooltip", x: 0, y: -Math.round(0.5 * x) - 20, "text-anchor": "middle", dy: "0.4em" })),
                        (ae = W.append("path")
                            .attr("d", "m3,9v11h14V9M4,9V6c0-3.3 2.7-6 6-6c3.3,0 6,2.7 6,6v3H14V6c0-2.2-1.8-4-4-4-2.2,0-4,1.8-4,4v3")
                            .attr("transform", "translate(" + (i + 6) + ", " + (-Math.round(0.5 * x) - 6 - 20) + "), scale(0.6)")
                            .attr("class", "tooltip hidden")),
                        W.append("line").attr({ class: "line-black", x1: -5, y1: 0, x2: 5, y2: 0 }),
                        W.append("line").attr({ class: "line-black", x1: 0, y1: -5, x2: 0, y2: 5 }));
                    (n += "M" + -i + "," + (-x - 20)),
                        (n += " h" + e),
                        (n += " a4,4 0 0 1 4,4"),
                        (n += " v" + t),
                        (n += " a4,4 0 0 1 -4,4"),
                        (n += " h" + (5 - i)),
                        (n += " l-5,12"),
                        (n += " l-5,-12"),
                        (n += " h" + (5 - i)),
                        (n += " a4,4 0 0 1 -4,-4"),
                        (n += " v" + -t),
                        (n += " a4,4 0 0 1 4,-4"),
                        (n += " z"),
                        re.attr("d", n);
                })(),
                He(),
                Fe();
        }
        function Fe() {
            if ((G.text(""), R.text(""), b && ye[m.Component.SHADING])) {
                var e = b.getSkyPatchPolygons(),
                    t = e.length;
                if (((y = b.getShadingData().length), 0 < b.skyType()))
                    for (var i = 0; i < t; ++i)
                        G.append("path")
                            .datum({ type: "Polygon", coordinates: e[i].polygon })
                            .attr({ id: "@" + i, class: "tweenable", stroke: l ? "inherit" : e[i].color, fill: e[i].color, "fill-opacity": 1, d: Pe });
                else {
                    var i = 0,
                        n = 1,
                        s = "inherit",
                        a = "#000000";
                    for (
                        S = b.skyType(),
                            e[0].color
                                ? ((a = function () {
                                      return e[i].color;
                                  }),
                                  0 < S
                                      ? l ||
                                        (s = function () {
                                            return e[i].color;
                                        })
                                      : (n = function () {
                                            return e[i].shading;
                                        }))
                                : (n = function () {
                                      return e[i].shading;
                                  }),
                            i = 0;
                        i < t;
                        ++i
                    )
                        G.append("path").datum({ type: "Polygon", coordinates: e[i].polygon }).attr({ class: "tweenable", stroke: s, "fill-opacity": n, fill: a, d: Pe });
                }
                Se == m.PROJ_CARTESIAN &&
                    R.append("use")
                        .style("visibility", pd.closeTo(r.northOffset(), 0, 0.001) ? "hidden" : "visible")
                        .attr("xlink:href", "#shading");
            }
            m.updateSkySegmentOutlines(!0), m.handleNorthChange(), (fe = null);
        }
        function He() {
            if (r) {
                var e = r.year();
                ve.setLocation(r.latitude(), r.longitude(), r.timezone()),
                    Ne.rotate([-r.longitude(), -r.latitude()]),
                    L.selectAll(".countries path").attr("d", Ge),
                    L.selectAll(".land").attr("d", Ge),
                    B.text(""),
                    U.text(""),
                    ze(U, new Date(e, 11, 21), "sun-path-thick solid", !1);
                for (var t = 21 == o ? 12 : 11, i = 21 == o ? 6 : 5; i < t; ++i) ze(U, new Date(e, i, o), "sun-path stroke-dashed", !1);
                ze(U, new Date(e, 5, 21), "sun-path-thick solid", !1);
                for (var n = ve.getAnalemmaSunPathsAsArray(7, 0, 24, 1), s = 0, a = n.length; s < a; ++s) U.append("path").datum({ type: "LineString", coordinates: n[s] }).attr("class", "tweenable sun-path stroke-dashed").attr("d", Pe);
                We();
            }
        }
        function ze(e, t, i, n) {
            ve.setDate(t);
            for (var s = ve.sunriseTime(), t = ve.sunsetTime(), a = ve.getDailySunPathSegmentsAsArray(0, 24, 0.25), r = 0, o = a.length; r < o; ++r)
                e.append("path")
                    .datum({ type: "LineString", coordinates: a[r] })
                    .attr("class", "tweenable " + i)
                    .attr("d", Pe);
            n &&
                ((t = e
                    .selectAll("g")
                    .data(d3.range(Math.ceil(s), Math.ceil(t)), function (e) {
                        return +e;
                    })
                    .enter()
                    .append("g")
                    .attr("transform", function (e) {
                        return "translate(" + Re(ve.setTimeOfDayAndGetArray(e)) + ")";
                    }))
                    .append("circle")
                    .attr("class", "hilite-shape")
                    .attr("r", C),
                t
                    .append("text")
                    .text(function (e) {
                        return e < 10 ? "0" + e : e;
                    })
                    .attr("class", "text-hilite")
                    .attr("text-anchor", "middle")
                    .attr("dy", "-0.65em"));
        }
        function We() {
            H.text("");
            var e = r.clockTime(),
                t = Math.floor(e),
                e = Math.floor(60 * (e - t)),
                e = new Date(r.year(), r.monthOfYear(), r.dayOfMonth(), t, e);
            ze(H, e, "line-hilite", !0),
                F.datum(ve.setDateTimeAndGetArray(e)).attr("transform", function (e) {
                    return "translate(" + Re(e) + ")";
                }),
                q && oe && oe.text("Lat: " + r.latitude().toFixed(2) + "°, Lng: " + r.longitude().toFixed(2) + "°, TZ: " + r.timezoneAsString()),
                je();
        }
        function je() {
            var e = r.azimuthAngle(),
                t = r.altitudeAngle();
            Se != m.PROJ_CARTESIAN && ye[m.Component.SUN_POSITION] && (F.attr("opacity", pd.mapAndConstrainTo(t, -6, 0, 0, 1)), F.style("visibility", -1 < t ? "visible" : "hidden"));
            var i = Re([e, 0]),
                n = Re([e, Se == m.PROJ_CARTESIAN ? t : 90]);
            ie &&
                (ie.attr("x1", i[0]).attr("y1", i[1]).attr("x2", n[0]).attr("y2", n[1]),
                te.attr("cx", i[0]).attr("cy", i[1]),
                (i = Re([0, t])),
                (n = Re([e, t])),
                K.attr("cx", i[0]).attr("cy", i[1]),
                Se == m.PROJ_CARTESIAN
                    ? (ne.attr("r", 0), ee.attr("x1", i[0]).attr("y1", i[1]).attr("x2", n[0]).attr("y2", n[1]))
                    : ((n = Re([0, 90])),
                      ne
                          .attr("r", t < 0 ? 0 : Math.abs(i[1] - n[1]))
                          .attr("cx", n[0])
                          .attr("cy", n[1]),
                      ee.attr("x1", n[0]).attr("y1", n[1]).attr("x2", n[0]).attr("y2", n[1]))),
                q && (le && le.text("Date: " + r.dateAsString()), de && de.text("Time: " + r.timeAsString()));
        }
        function Ye(e, t) {
            switch (((t = !!t), e)) {
                case m.Component.AXIS:
                    I.style("visibility", t ? "visible" : "hidden"), k.style("visibility", t ? "visible" : "hidden"), (ye[e] = t), m.updateSkySegmentOutlines(!0);
                    break;
                case m.Component.WORLD_MAP:
                    N.style("visibility", t ? "visible" : "hidden"),
                        Y.style("visibility", t ? "visible" : "hidden"),
                        O.selectAll("path").attr("class", t ? "background-map" : "background-daylight"),
                        t && !xe && d3.json("data/world-110m.json", Be),
                        (D.style.cursor = t ? "move" : g),
                        ft((ye[e] = t));
                    break;
                case m.Component.ANNUAL_AREA:
                    B.style("visibility", t ? "visible" : "hidden"), (ye[e] = t), m.refresh();
                    break;
                case m.Component.ANNUAL_LINES:
                    U.style("visibility", t ? "visible" : "hidden"), (ye[e] = t);
                    break;
                case m.Component.SUN_ANGLES:
                    V.style("visibility", t ? "visible" : "hidden"), (ye[e] = t);
                    break;
                case m.Component.DIURNAL_SUN_PATH:
                    H.style("visibility", t ? "visible" : "hidden"), (ye[e] = t);
                    break;
                case m.Component.SUN_POSITION:
                    F.style("visibility", t ? "visible" : "hidden"), (ye[e] = t), je();
                    break;
                case m.Component.SHADING:
                    M.isValid
                        ? ((M.show = Se != m.PROJ_CARTESIAN), (M.canvas.style.display = M.show ? "block" : "none"), (ye[e] = !M.show), t ? G.style("visibility", M.show ? "hidden" : "visible") : G.style("visibility", "hidden"))
                        : (G.style("visibility", t ? "visible" : "hidden"), (ye[e] = t)),
                        t && m.updateShading(!0);
                    break;
                case m.Component.ALL:
                    for (var i = m.Component.ALL - 1; 0 <= i; i--) Ye(i, t);
            }
        }
        ke(),
            (this.show = function (e) {
                var t = void 0 !== e && e.length ? e : arguments;
                M.isValid && M.isMaster && M.sunpath3D.show(t);
                for (var i = 0, n = t.length; i < n; ++i) Ye(+t[i], !0);
                return m;
            }),
            (this.hide = function (e) {
                var t = void 0 !== e && e.length ? e : arguments;
                M.isValid && M.isMaster && M.sunpath3D.hide(t);
                for (var i = 0, n = t.length; i < n; ++i) Ye(+t[i], !1);
                return m;
            }),
            (this.focus = function () {
                return w && w.focus(), m;
            }),
            (this.isVisible = function (e) {
                return 0 <= e && e < m.Component.ALL && ye[e];
            }),
            (this.width = function (e) {
                return arguments.length ? ((T = parseInt(e, 10)), w.width(T), m.refresh(), m) : T;
            }),
            (this.height = function (e) {
                return arguments.length ? ((E = parseInt(e, 10)), w.height(E), m.refresh(), m) : E;
            }),
            (this.solarPosition = function (e) {
                return arguments.length ? ((r = e), m.refresh(), m) : r;
            }),
            (this.updateLockScale = function () {
                return b && me && me.classed("hidden", !b.lockScale()), m;
            }),
            (this.throttledRescale = function (e) {
                return arguments.length ? ((n = pd.constrainTo(parseInt(e, 10), 0, 5e3)), m) : n;
            }),
            (this.dayForMonthlyLines = function (e) {
                return arguments.length ? ((o = pd.constrainTo(parseInt(e, 10), 1, 31)), m) : o;
            }),
            (this.projectionType = function (e) {
                return arguments.length ? ((e = pd.constrainTo(parseInt(e, 10), m.PROJ_SPHERICAL, m.PROJ_CARTESIAN)) != Se && ((Se = e), (we = 1), ke(), Qe()), m) : Se;
            }),
            (this.updateSkySegmentOutlines = function (e) {
                var t;
                return (
                    Z && Z.style("visibility", !l && m.isVisible(m.Component.AXIS) ? "visible" : "hidden"),
                    G && (l ? ((t = b && 0 < b.skyType()), G.classed("line-grid", !t), G.classed("line-dark", t)) : (G.classed("line-grid", !1), G.classed("line-dark", !1)), e || (fe = fe || G.selectAll("path")).attr("stroke", "inherit")),
                    M.isValid && M.show && M.update(),
                    m
                );
            }),
            (this.showSkySegments = function (e) {
                if (!arguments.length) return l;
                var t = !!e,
                    i = l != t;
                return (l = t), M.isValid && M.isMaster && M.sunpath3D.showSkySegments(e), m.updateSkySegmentOutlines(), i && !l && 0 < b.skyType() && m.updateShading(), m;
            });
        var qe = !(this.setDateTimeObservables = function (e, t) {
            return (p = t), (i = (u = e) || p || h || c), pdDOM.toggleClass(D, "interactive", i), ft(i), m;
        });
        function Xe() {
            M.sunpath3D.draw2D(500, 500 * M.size);
        }
        (this.wasDragged = function (e) {
            return arguments.length ? ((qe = !!e), m) : qe;
        }),
            (M = {
                show: !1,
                isValid: !1,
                isMaster: !1,
                sunpath3D: null,
                texture: null,
                canvas: null,
                size: 0.85,
                update: function () {
                    this.texture.drawToCanvas(this.canvas, Xe);
                },
                showSVGShading: function (e) {
                    G.style("visibility", e ? "visible" : "hidden"), (ye[m.Component.SHADING] = e);
                },
            }),
            (this.linkToSunPath3D = function (e) {
                (e = e || {}).sunpath3D && e.canvas && e.texture
                    ? ((M.isValid = !0),
                      (M.isMaster = pd.toBoolean(e.isMaster, !1)),
                      (M.sunpath3D = e.sunpath3D),
                      (M.texture = e.texture),
                      (M.canvas = e.canvas),
                      (M.size = pd.toNumber(e.size, 0.85)),
                      (e = pd.toBoolean(e.show, !0) && Se != m.PROJ_CARTESIAN),
                      G.style("visibility", e ? "hidden" : "visible"),
                      (M.canvas.style.display = e ? "block" : "none"),
                      (ye[m.Component.SHADING] = !e),
                      (M.show = e))
                    : ((M.show = !1), (M.isValid = !1), (M.isMaster = !1), (M.sunpath3D = null), (M.texture = null), (M.canvas = null), (M.size = 0.85), Ye(m.Component.SHADING, G && b));
            }),
            (this.animateProjection = function (e) {
                if (((Me = Se), (Se = pd.constrainTo(parseInt(e, 10), m.PROJ_SPHERICAL, m.PROJ_CARTESIAN)), Me == Se)) return !1;
                (Me != m.PROJ_CARTESIAN && Se != m.PROJ_CARTESIAN) || B.style("visibility", "hidden"), H.style("visibility", "hidden"), F.style("visibility", "hidden"), V.style("visibility", "hidden");
                e = d3.geo.circle().origin([0, 90]).angle(90);
                return (
                    Me == m.PROJ_CARTESIAN && I.append("path").datum(e).attr("class", "tweenable fade-in line-black").attr("d", Pe),
                    Me == m.PROJ_CARTESIAN || Se == m.PROJ_CARTESIAN
                        ? (M.isValid && ((M.canvas.style.display = "none"), M.showSVGShading(!1), (M.show = !1)),
                          k.style("visibility", "hidden"),
                          ye[m.Component.WORLD_MAP] ? (O.text(""), O.append("path").datum(e).attr("class", "tweenable stroke-none background-map").attr("d", Pe)) : O.style("visibility", "hidden"))
                        : M.isValid && (M.showSVGShading(!1), (M.show = !0)),
                    !(we = 0)
                );
            }),
            (this.updateAnimation = function (e) {
                var t;
                return (
                    (we = e) < 0.999
                        ? (Se == m.PROJ_CARTESIAN
                              ? (L.selectAll("path.fade-out").attr("stroke-opacity", 1 - e),
                                (P = (e * E * 0.775 + (1 - e) * Math.min(T, E)) * A),
                                Re.translate([T / 2, (E / 2) * (1 - e) + e * E * 0.775])
                                    .clipAngle(0.9 <= we ? null : pd.mapAndConstrainTo(we, 0.5, 0.9, 90.1, 180))
                                    .rotate([0, -90 * (1 - e)])
                                    .scale(P),
                                Ne.scale(P))
                              : Me == m.PROJ_CARTESIAN &&
                                (L.selectAll("path.fade-in").attr("stroke-opacity", e),
                                (P = ((1 - e) * E * 0.775 + e * Math.min(T, E)) * A),
                                Re.translate([T / 2, e * (E / 2) + (1 - e) * E * 0.775])
                                    .clipAngle(0.1 <= we ? pd.mapAndConstrainTo(we, 0.1, 0.5, 180, 90.1) : null)
                                    .rotate([0, -90 * e])
                                    .scale(P),
                                Ne.scale(P)),
                          (Se != m.PROJ_CARTESIAN && Me != m.PROJ_CARTESIAN) || L.selectAll("path.tickable[d]").attr("d", Pe),
                          M.isValid && M.show && (((t = M.sunpath3D.projectionTransitions())[Me] = 1 - e), (t[Se] = e), M.update()),
                          L.selectAll("path.tweenable[d]").attr("d", Pe),
                          L.selectAll(".countries path").attr("d", Ge),
                          L.selectAll(".land").attr("d", Ge))
                        : (Qe(),
                          (we = 1),
                          V.style("visibility", m.isVisible(m.Component.SUN_ANGLES) ? "visible" : "hidden"),
                          B.style("visibility", m.isVisible(m.Component.ANNUAL_AREA) ? "visible" : "hidden"),
                          k.style("visibility", m.isVisible(m.Component.AXIS) ? "visible" : "hidden"),
                          H.style("visibility", m.isVisible(m.Component.DIURNAL_SUN_PATH) ? "visible" : "hidden"),
                          F.style("visibility", m.isVisible(m.Component.SUN_POSITION) ? "visible" : "hidden"),
                          G.style("visibility", m.isVisible(m.Component.SHADING) ? "visible" : "hidden"),
                          O.style("visibility", "visible"),
                          m.handleNorthChange(),
                          M.isValid &&
                              (M.sunpath3D.projectionType(Se), (M.show = Se != m.PROJ_CARTESIAN), M.show ? ((M.canvas.style.display = "block"), M.showSVGShading(!1), M.update()) : ((M.canvas.style.display = "none"), M.showSVGShading(!0)))),
                    m
                );
            }),
            (this.shadingMask = function (e) {
                return arguments.length ? ((b = e) ? m.updateShading(!0) : G.text(""), m) : (b = b || new pd.Shading());
            }),
            (this.newShadingIterator = function () {
                return b ? b.newShadingIterator() : null;
            }),
            (this.getShading = function () {
                return b ? b.getShadingData() : null;
            }),
            (this.setShadingSegmentValue = function (e, t) {
                return b && b.setSkyPatchShading(e, t), m;
            }),
            (this.updateShading = function (e) {
                var i, t, n;
                return (
                    G &&
                        b &&
                        (M.isValid && M.show
                            ? (M.isMaster && M.sunpath3D.updateShading(e), M.update())
                            : ye[m.Component.SHADING] &&
                              ((i = b.getShadingData()),
                              e || y != i.length
                                  ? ((y = i.length), Fe())
                                  : ((t = {}),
                                    (n = b.getSkyLuminanceCSSColors()),
                                    X &&
                                        he &&
                                        b &&
                                        ((e = b.skyDistributionScale()),
                                        b.isCumulative() ? ge.text(b.useIlluminance() ? "cd.h/m2" : "Wh/m2") : ge.text(b.useIlluminance() ? "cd/m2" : "W/m2"),
                                        pe.text((0.5 * e).toFixed(2)),
                                        ce.text(e.toFixed(2)),
                                        ue.text("0.00"),
                                        m.updateLockScale()),
                                    S <= 0 && 0 < b.skyType() && (t.stroke = "inherit"),
                                    (S = b.skyType()),
                                    n && n.length
                                        ? ((t.fill = function (e, t) {
                                              return n[t];
                                          }),
                                          0 < S
                                              ? (l ||
                                                    (t.stroke = function (e, t) {
                                                        return n[t];
                                                    }),
                                                (t["fill-opacity"] = 1))
                                              : (t["fill-opacity"] = function (e, t) {
                                                    return i[t];
                                                }))
                                        : ((t["fill-opacity"] = function (e, t) {
                                              return i[t];
                                          }),
                                          (t.fill = "#000000")),
                                    (fe = fe || G.selectAll("path")).attr(t)))),
                    (function () {
                        {
                            var e;
                            0 <= et && (999 < (e = b.getSkyPatchContribution(et)) ? se.text(e.toFixed(1)) : 9.99 < e ? se.text(e.toFixed(2)) : se.text(e.toFixed(3)));
                        }
                    })(),
                    m
                );
            }),
            (this.setShading = function (e, t) {
                return b && b.setShadingData(e), t ? 0 : m.updateShading(), m;
            }),
            (this.clearShading = function (e) {
                return b && b.clearShadingData(), e ? 0 : m.updateShading(), m;
            });
        var Je = null;
        function Qe() {
            (Je = null), Ve(), Ue();
        }
        (this.rescale = function () {
            4 < n ? null == Je && (Je = setTimeout(Qe, n)) : Qe();
        }),
            (this.refresh = function () {
                return Ue(), m;
            }),
            (this.getExportableText = function (e) {
                var t = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';
                M.isValid && M.show && (M.showSVGShading(!0), Fe());
                var i = D.cloneNode(!0);
                i.setAttributeNS(null, "preserveAspectRatio", "xMidYMid"),
                    i.setAttributeNS(null, "style", ""),
                    e && i.setAttribute("xmlns:inkscape", "http://www.inkscape.org/namespaces/inkscape"),
                    (t += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n');
                var n =
                    " .svg-chart { font-family: sans-serif; font-size: 14px; } .svg-chart .line-grid { stroke-width: 0.5px; stroke-opacity: 0.5; stroke: #888; fill: none; } .svg-chart .line-dark { stroke-width: 0.5px; stroke-opacity: 1.0; stroke: #444; fill: none; } .svg-chart .line-axis { stroke-width: 1px; stroke: #666; fill: none; } .svg-chart .line-hilite { stroke-width: 1.5px; stroke: #F00; fill: none; } .svg-chart .line-blue { stroke-width: 1px; stroke: #00F; fill: none; } .svg-chart .line-black { stroke-width: 1px; stroke: #000; fill: none; } .svg-chart .text-grid { font-size: 0.6em; stroke: none; fill: #888; } .svg-chart .text-axis { font-size: 0.7em; stroke: none; fill: #000; } .svg-chart .text-hilite { font-size: 0.75em; font-weight: 500; stroke: none; fill: #F00; } .svg-chart .text-blue { font-size: 1.0em; stroke: none; fill: #00F; } .svg-chart text.bold6:nth-of-type(6n + 1) { font-weight: bold; font-size: 1.1em; } .svg-chart .hilite-circle { stroke: #F00; stroke-width: 1px; fill: #F00; } .svg-chart .hilite-shape { stroke: #F00; stroke-width: 1.25px; fill: #FFF; } .svg-chart .hilite-axis { stroke-width: 0.75px; stroke-dasharray: 4, 3; stroke: #F00; fill: none; } .svg-chart .sun-path { stroke-width: 1.25px; stroke: #f90; fill: none; } .svg-chart .sun-path-thick { stroke-width: 1.5px; stroke: #f90; fill: none; } .svg-chart .stroke-dashed { stroke-dasharray: 2, 3; } .svg-chart .background-daylight { fill: none; } .svg-chart .background-map { fill: #b3d1ff; }";
                return (
                    Se == m.PROJ_CARTESIAN &&
                        (n +=
                            " .svg-chart .text-twilight-dark { font-size: 0.76em; fill: #036; } .svg-chart .text-twilight { font-size: 0.76em; fill: #7AE; } .svg-chart .fill-astronomical { fill: #036; } .svg-chart .fill-nautical { fill: #369; } .svg-chart .fill-civil { fill: #69C; } .svg-chart .fill-night { fill: #012; }"),
                    ye[m.Component.WORLD_MAP] && (n += " .svg-chart .countries path { stroke: #ccddff; stroke-linejoin: round; stroke-width: 0.75px; fill: none; } .svg-chart .land { stroke-opacity: 1; fill: #fff; }"),
                    (t += i.outerHTML.replace("<style></style>", '<style type="text/css">/* <![CDATA[ */' + n + " /* ]]> */</style>")),
                    e && (t = t.replace(/<g id=/g, '<g inkscape:groupmode="layer" inkscape:label=')),
                    M.isValid && M.show && (M.showSVGShading(!1), Fe()),
                    t
                );
            }),
            (this.handleLocationChange = function () {
                return He(), m;
            }),
            (this.handleDateChange = function () {
                return We(), m;
            }),
            (this.handleTimeChange = function () {
                return (
                    ve.setDayMonthYear(r.dayOfMonth(), r.monthOfYear(), r.year()),
                    F.datum(ve.setTimeOfDayAndGetArray(r.clockTime())).attr("transform", function (e) {
                        return "translate(" + Re(e) + ")";
                    }),
                    je(),
                    m
                );
            }),
            (this.handleDateTimeChange = function () {
                return We(), m;
            });
        var Ze = !(this.handleNorthChange = function () {
                var e, t, i;
                return (
                    b &&
                        ((e = Re([0, 90])),
                        Se == m.PROJ_CARTESIAN
                            ? ((t = Re([-r.northOffset(), 90])),
                              G.attr("transform", function () {
                                  return "translate(" + (t[0] - e[0]) + ", 0.0)";
                              }),
                              Se == m.PROJ_CARTESIAN &&
                                  ((i = pd.sign(r.northOffset()) * T),
                                  R.style("visibility", pd.closeTo(r.northOffset(), 0, 0.001) ? "hidden" : "visible").attr("transform", function () {
                                      return "translate(" + i + ", 0.0)";
                                  })))
                            : (G.attr("transform", function () {
                                  return "rotate(" + -r.northOffset() + ", " + e[0] + ", " + e[1] + ")";
                              }),
                              M.isValid && M.show && M.update())),
                    m
                );
            }),
            Ke = !1,
            $e = { x: NaN, y: NaN },
            et = -1,
            tt = null;
        function it() {
            W.attr("opacity", "0.0"), (Ze = !1), null != tt && (clearTimeout(tt), (tt = null));
        }
        function nt(e) {
            Ke || (W.attr("display", "inline"), (Ke = !0)), Ze || (W.attr("opacity", "1.0"), (Ze = !0)), null != tt && (clearTimeout(tt), (tt = null)), e && (tt = setTimeout(it, 2500));
        }
        function st(e, t) {
            var i;
            if (b && e.event && e.event.pageX) {
                var n,
                    s = $e.x,
                    a = $e.y,
                    r = e.event.pageX,
                    o = e.event.pageY,
                    l = e.x - r,
                    d = e.y - o;
                e.isTouchEvent ? ((n = 0 < e.button ? 0.2 : 1), isNaN(s) ? (s = r) : (s += e.dragX * n), isNaN(a) ? (a = o) : (a += e.dragY * n)) : ((s = r), (a = o));
                o = document.elementFromPoint(Math.round(s), Math.round(a));
                if (o && o.id) {
                    o = o.id;
                    if ("@" == o.charAt(0) && 0 <= (i = pd.toNumber(o.substr(1), -1))) {
                        W.attr("transform", "translate(" + (s + l) * pdDOM.pageScale + ", " + (a + d) * pdDOM.pageScale + ")");
                        d = b.getSkyPatchContribution(i);
                        return 999 < d ? se.text(d.toFixed(1)) : 9.99 < d ? se.text(d.toFixed(2)) : se.text(d.toFixed(3)), (Ze && !t) || nt(!1), (et = i), ($e.x = s), ($e.y = a), 1;
                    }
                }
            }
            Ze && it(), (et = -1);
        }
        this.activateTooltip = function () {
            return m;
        };
        var at = [0, 0],
            rt = null,
            ot = 0,
            lt = 0,
            dt = !1,
            ht = -1;
        function ct(e) {
            w && w.focus(),
                (qe = !1),
                0 <= e.button &&
                    e.button < 2 &&
                    (ye[m.Component.WORLD_MAP]
                        ? (d && d.storeValues(h, c), (rt = Ne.rotate()), (at = [e.x, e.y]), j.style("visibility", "visible"), (dt = !0))
                        : (ae.classed("hidden", !0), st(e, !0), u && ((ot = u()), (ht = 0)), p && ((lt = p()), (ht = 0)), 0 == ht && (D.style.cursor = "move")));
        }
        function pt(e) {
            if (0 <= e.button && e.button < 2)
                if (dt) {
                    var t = rt[0] + 0.15 * (e.x - at[0]),
                        i = rt[1] + 0.15 * (at[1] - e.y),
                        i = pd.constrainTo(i, -90, 90);
                    h && !pd.closeTo(h(), -i, 0.001) && (h(-i), (qe = !0)), (t = pd.wrapAt(t, -180, 180)), c && !pd.closeTo(c(), -t, 0.001) && (c(-t), (qe = !0));
                } else
                    switch ((st(e, !1), ht)) {
                        case 0:
                            e.hasMoved(5) && ((ht = Math.abs(e.getDragDistanceX()) > Math.abs(e.getDragDistanceY()) ? 1 : 2), u && (ot = u()), p && (lt = p()), (D.style.cursor = 2 == ht ? "ns-resize" : "ew-resize"));
                            break;
                        case 1:
                            u && ((n = pd.wrapAt(ot - 0.025 * e.getDragDistanceX() * P, 0, 1440)), u(pd.snapTo(n, 5)), (qe = !0));
                            break;
                        case 2:
                            var n;
                            p && ((n = 172 < lt && lt < 356 ? 1 : -1), (e = pd.wrapAt(lt + n * e.getDragDistanceY() * 0.01 * P, 0, 366)), p(Math.round(e)), (qe = !0));
                    }
        }
        function ut(e) {
            0 <= e.button && e.button < 2 && (dt ? (j.style("visibility", "hidden"), d && d.checkForChanges(), (dt = !1)) : 0 <= et && nt(!0)), 0 <= ht && ((D.style.cursor = g), (ht = -1));
        }
        function gt(e) {
            X && J && e.x > T - 45 && e.y <= Q ? J(e) : 0 <= et && (ae.classed("hidden", !1), nt(!1));
        }
        function mt(e) {
            var t;
            e.delta && (p && e.shiftKey ? ((t = pd.wrapAt(p() + e.delta, 0, 366)), p(Math.round(t))) : u && ((e = pd.wrapAt(u() - 5 * e.delta, 0, 1440)), u(pd.snapTo(e, 1))));
        }
        function ft(e) {
            be && (be.dispose(), (be = null)), e && i && (be = pdDOM.Interaction.makeInteractive(D, { onpress: ct, ondrag: pt, onrelease: ut, ondoubletap: gt, onlongpress: gt, onscroll: mt }));
        }
        return (
            w.attr("xmlns", "http://www.w3.org/2000/svg"),
            pdDOM.addClass(D, "svg-chart", !0),
            pdDOM.toggleClass(D, "interactive", i),
            (D.style.cursor = g),
            $(document).ready(function () {
                ye[m.Component.WORLD_MAP] && d3.json("data/world-110m.json", Be), i && ft(!0);
            }),
            this
        );
    }),
    (L.EdgeScaleBar = L.Layer.extend({
        options: {
            opacity: 1,
            weight: 0.8,
            color: "#000",
            font: "11px Arial",
            zoomInterval: [
                { start: 1, end: 2, interval: 5e6 },
                { start: 3, end: 3, interval: 2e6 },
                { start: 4, end: 4, interval: 1e6 },
                { start: 5, end: 5, interval: 5e5 },
                { start: 6, end: 7, interval: 2e5 },
                { start: 8, end: 8, interval: 1e5 },
                { start: 9, end: 9, interval: 5e4 },
                { start: 10, end: 10, interval: 2e4 },
                { start: 11, end: 11, interval: 1e4 },
                { start: 12, end: 12, interval: 5e3 },
                { start: 13, end: 13, interval: 2e3 },
                { start: 14, end: 14, interval: 1e3 },
                { start: 15, end: 15, interval: 500 },
                { start: 16, end: 16, interval: 200 },
                { start: 17, end: 17, interval: 100 },
                { start: 18, end: 18, interval: 50 },
                { start: 19, end: 19, interval: 20 },
                { start: 20, end: 20, interval: 10 },
            ],
        },
        initialize: function (e) {
            L.setOptions(this, e),
                (this._a = 6378137),
                (this._b = 6356752.3142),
                (this._e2 = (this._a * this._a - this._b * this._b) / (this._a * this._a)),
                (this._n = (this._a - this._b) / (this._a + this._b)),
                (this._n2 = this._n * this._n),
                (this._A = this._a * (1 - this._n) * (1 - this._n2) * (1 + (9 / 4) * this._n2 + (225 / 64) * this._n2 * this._n2)),
                (this._ic1 = 1.5 * this._n - (29 / 12) * this._n2 * this._n + 6.9125 * this._n2 * this._n2 * this._n),
                (this._ic2 = (21 / 8) * this._n2 - (1537 / 128) * this._n2 * this._n2),
                (this._ic3 = (151 / 24) * this._n2 * this._n - (32373 / 640) * this._n2 * this._n2 * this._n),
                (this._ic4 = (1097 / 64) * this._n2 * this._n2),
                (this._ic5 = (8011 / 150) * this._n2 * this._n2 * this._n),
                (this._c1 = -1.5 * this._n + (31 / 24) * this._n2 * this._n - (669 / 640) * this._n2 * this._n2 * this._n),
                (this._c2 = (15 / 18) * this._n2 - (435 / 128) * this._n2 * this._n2),
                (this._c3 = (-35 / 12) * this._n2 * this._n + 8.1375 * this._n2 * this._n2 * this._n),
                (this._c4 = (315 / 64) * this._n2 * this._n2),
                (this._c5 = -8.6625 * this._n2 * this._n2 * this._n),
                (this._LIMIT_PHI = 1.484419982);
        },
        onAdd: function (e) {
            (this._map = e), this._container || this._initCanvas(), e._panes.overlayPane.appendChild(this._container), e.on("viewreset", this._reset, this), e.on("move", this._reset, this), e.on("moveend", this._reset, this), this._reset();
        },
        onRemove: function (e) {
            e.getPanes().overlayPane.removeChild(this._container), e.off("viewreset", this._reset, this), e.off("move", this._reset, this), e.off("moveend", this._reset, this);
        },
        addTo: function (e) {
            return e.addLayer(this), this;
        },
        setOpacity: function (e) {
            return (this.options.opacity = e), this._updateOpacity(), this;
        },
        bringToFront: function () {
            return this._canvas && this._map._panes.overlayPane.appendChild(this._canvas), this;
        },
        bringToBack: function () {
            var e = this._map._panes.overlayPane;
            return this._canvas && e.insertBefore(this._canvas, e.firstChild), this;
        },
        getAttribution: function () {
            return this.options.attribution;
        },
        _initCanvas: function () {
            (this._container = L.DomUtil.create("div", "leaflet-image-layer")),
                (this._canvas = L.DomUtil.create("canvas", "")),
                (this._ctx = this._canvas.getContext("2d")),
                (this._vert_gradientFill = this._ctx.createLinearGradient(0, 0, 0, 10)),
                this._vert_gradientFill.addColorStop(0, "rgba(255, 255, 255, 1)"),
                this._vert_gradientFill.addColorStop(1, "rgba(255, 255, 255, 0)"),
                (this._hor_gradientFill = this._ctx.createLinearGradient(this._map.getSize().x - 10, 0, this._map.getSize().x, 0)),
                this._hor_gradientFill.addColorStop(0, "rgba(255, 255, 255, 0)"),
                this._hor_gradientFill.addColorStop(1, "rgba(255, 255, 255, 1)"),
                this._updateOpacity(),
                this._container.appendChild(this._canvas),
                L.extend(this._canvas, { onselectstart: L.Util.falseFn, onmousemove: L.Util.falseFn, onload: L.bind(this._onCanvasLoad, this) });
        },
        _reset: function () {
            var e = this._container,
                t = this._canvas,
                i = this._map.getSize(),
                n = this._map.containerPointToLayerPoint([0, 0]);
            L.DomUtil.setPosition(e, n),
                (e.style.width = i.x + "px"),
                (e.style.height = i.y + "px"),
                (t.width = i.x),
                (t.height = i.y),
                (t.style.width = i.x + "px"),
                (t.style.height = i.y + "px"),
                this._ctx.beginPath(),
                this._ctx.moveTo(0, 0),
                this._ctx.lineTo(i.x, 0),
                this._ctx.lineTo(i.x, i.y),
                this._ctx.stroke(),
                this._calcInterval(),
                this._draw();
        },
        _onCanvasLoad: function () {
            this.fire("load");
        },
        _updateOpacity: function () {
            L.DomUtil.setOpacity(this._canvas, this.options.opacity);
        },
        _calcInterval: function () {
            var e,
                t = this._map.getZoom();
            for (e in this.options.zoomInterval) {
                var i = this.options.zoomInterval[e];
                if (i.start <= t && i.end && i.end >= t) {
                    this._dd = i.interval;
                    break;
                }
            }
            this._currZoom = t;
        },
        _draw: function () {
            (this._ctx.strokeStyle = this.options.color), this._create_lat_ticks(), this._create_lon_ticks(), (this._ctx.fillStyle = this.options.color), (this._ctx.font = this.options.font);
            var e = " m",
                t = this._dd;
            1e3 <= this._dd && ((e = " km"), (t = this._dd / 1e3)),
                (this._ctx.textAlign = "right"),
                (this._ctx.textBaseline = "middle"),
                this._ctx.fillText(t + e, this._map.getSize().x - 12, this._map.getSize().y / 2),
                (this._ctx.textAlign = "center"),
                (this._ctx.textBaseline = "top"),
                this._ctx.fillText(t + e, this._map.getSize().x / 2, 12);
        },
        _create_lat_ticks: function () {
            var e,
                t = this._map.containerPointToLatLng(L.point(0, this._map.getSize().y / 2)).lat,
                n = this._map.containerPointToLatLng(L.point(0, this._map.getSize().y)).lat,
                s = this._map.containerPointToLatLng(L.point(0, 0)).lat,
                t = this._merLength((t * Math.PI) / 180),
                a = this._merLength((s * Math.PI) / 180),
                r = this._merLength((n * Math.PI) / 180);
            for (i = t + this._dd / 2; i < a; i += this._dd) {
                (e = this._invmerLength(i)) < this._LIMIT_PHI && e > -this._LIMIT_PHI && this._draw_lat_tick(e, 10, 1.5 * this.options.weight);
            }
            for (i = t - this._dd / 2; i > r; i -= this._dd) {
                (e = this._invmerLength(i)) > -this._LIMIT_PHI && e < this._LIMIT_PHI && this._draw_lat_tick(e, 10, 1.5 * this.options.weight);
            }
            for (i = t; i < a; i += this._dd / 10) {
                (e = this._invmerLength(i)) < this._LIMIT_PHI && e > -this._LIMIT_PHI && this._draw_lat_tick(e, 4, this.options.weight);
            }
            for (i = t - this._dd / 10; i > r; i -= this._dd / 10) {
                (e = this._invmerLength(i)) > -this._LIMIT_PHI && e < this._LIMIT_PHI && this._draw_lat_tick(e, 4, this.options.weight);
            }
        },
        _create_lon_ticks: function () {
            var e = this._map.containerPointToLatLng(L.point(this._map.getSize().x / 2, 0)),
                t = this._map.containerPointToLatLng(L.point(0, 0)),
                n = this._map.containerPointToLatLng(L.point(this._map.getSize().x, 0)),
                s = Math.sin((e.lat * Math.PI) / 180),
                s = this._a / Math.sqrt(1 - this._e2 * s * s),
                a = ((this._dd / (s * Math.cos((e.lat * Math.PI) / 180))) * 180) / Math.PI;
            for (i = e.lng + a / 2; i < n.lng; i += a) this._draw_lon_tick(i, 10, 1.5 * this.options.weight);
            for (i = e.lng - a / 2; i > t.lng; i -= a) this._draw_lon_tick(i, 10, 1.5 * this.options.weight);
            for (i = e.lng; i < n.lng; i += a / 10) this._draw_lon_tick(i, 4, this.options.weight);
            for (i = e.lng - a / 10; i > t.lng; i -= a / 10) this._draw_lon_tick(i, 4, this.options.weight);
        },
        _latLngToCanvasPoint: function (e) {
            e = this._map.project(L.latLng(e));
            return e._subtract(this._map.getPixelOrigin()), L.point(e).add(this._map._getMapPanePos());
        },
        _draw_lat_tick: function (e, t, i) {
            e = this._latLngToCanvasPoint(L.latLng((180 * e) / Math.PI, 0)).y;
            (this._ctx.lineWidth = i), this._ctx.beginPath(), this._ctx.moveTo(this._map.getSize().x, e), this._ctx.lineTo(this._map.getSize().x - t, e), this._ctx.stroke();
        },
        _draw_lon_tick: function (e, t, i) {
            e = this._latLngToCanvasPoint(L.latLng(0, e)).x;
            (this._ctx.lineWidth = i), this._ctx.beginPath(), this._ctx.moveTo(e, 0), this._ctx.lineTo(e, t), this._ctx.stroke();
        },
        _merLength: function (e) {
            var t = Math.cos(2 * e);
            return this._A * (e + Math.sin(2 * e) * (this._c1 + (this._c2 + (this._c3 + (this._c4 + this._c5 * t) * t) * t) * t));
        },
        _invmerLength: function (e) {
            var t = e / this._A,
                e = Math.cos(2 * t);
            return t + Math.sin(2 * t) * (this._ic1 + (this._ic2 + (this._ic3 + (this._ic4 + this._ic5 * e) * e) * e) * e);
        },
    })),
    (L.edgeScaleBar = function (e) {
        return new L.EdgeScaleBar(e);
    });
