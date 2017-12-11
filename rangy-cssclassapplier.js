rangy.createModule("CssClassApplier", function(e, t) {
    function n(e) {
        return e.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    }

    function i(e, t) {
        return e.className && new RegExp("(?:^|\\s)" + t + "(?:\\s|$)").test(e.className)
    }

    function s(e, t) {
        e.className ? i(e, t) || (e.className += " " + t) : e.className = t
    }

    function o(e) {
        return e.split(/\s+/).sort().join(" ")
    }

    function r(e) {
        return o(e.className)
    }

    function a(e, t) {
        return r(e) == r(t)
    }

    function l(e, t) {
        return e.compareBoundaryPoints(t.START_TO_START, t)
    }

    function d(e, t, n, i, s) {
        var o = e.node,
            r = e.offset,
            a = o,
            l = r;
        o == i && r > s && l++, o == t && (r == n || r == n + 1) && (a = i, l += s - n), o == t && r > n + 1 && l--, e.node = a, e.offset = l
    }

    function u(e, t, n, i) {
        -1 == n && (n = t.childNodes.length);
        for (var s, o = e.parentNode, r = M.getNodeIndex(e), a = 0; s = i[a++];) d(s, o, r, t, n);
        t.childNodes.length == n ? t.appendChild(e) : t.insertBefore(e, t.childNodes[n])
    }

    function f(e, t, n, i, s) {
        for (var o, r = []; o = e.firstChild;) u(o, t, n++, s), r.push(o);
        return i && e.parentNode.removeChild(e), r
    }

    function p(e, t) {
        return f(e, e.parentNode, M.getNodeIndex(e), !0, t)
    }

    function h(e, t) {
        var n = e.cloneRange();
        n.selectNodeContents(t);
        var i = n.intersection(e),
            s = i ? i.toString() : "";
        return n.detach(), "" != s
    }

    function c(e) {
        return e.getNodes([3], function(t) {
            return h(e, t)
        })
    }

    function g(e, t) {
        if (e.attributes.length != t.attributes.length) return !1;
        for (var n, i, s, o = 0, r = e.attributes.length; r > o; ++o)
            if (n = e.attributes[o], s = n.name, "class" != s) {
                if (i = t.attributes.getNamedItem(s), n.specified != i.specified) return !1;
                if (n.specified && n.nodeValue !== i.nodeValue) return !1
            }
        return !0
    }

    function m(e, t) {
        for (var n, i = 0, s = e.attributes.length; s > i; ++i)
            if (n = e.attributes[i].name, (!t || !M.arrayContains(t, n)) && e.attributes[i].specified && "class" != n) return !0;
        return !1
    }

    function N(e, t) {
        var n;
        for (var i in t)
            if (t.hasOwnProperty(i))
                if (n = t[i], "object" == typeof n) {
                    if (!N(e[i], n)) return !1
                } else if (e[i] !== n) return !1;
        return !0
    }

    function y(e) {
        var t;
        return e && 1 == e.nodeType && ((t = e.parentNode) && 9 == t.nodeType && "on" == t.designMode || j(e) && !j(e.parentNode))
    }

    function v(e) {
        return (j(e) || 1 != e.nodeType && j(e.parentNode)) && !y(e)
    }

    function T(e) {
        return e && 1 == e.nodeType && !z.test(W(e, "display"))
    }

    function C(e) {
        if (0 == e.data.length) return !0;
        if (D.test(e.data)) return !1;
        var t = W(e.parentNode, "whiteSpace");
        switch (t) {
            case "pre":
            case "pre-wrap":
            case "-moz-pre-wrap":
                return !1;
            case "pre-line":
                if (/[\r\n]/.test(e.data)) return !1
        }
        return T(e.previousSibling) || T(e.nextSibling)
    }

    function E(e) {
        var t, n, i = [];
        for (t = 0; n = e[t++];) i.push(new I(n.startContainer, n.startOffset), new I(n.endContainer, n.endOffset));
        return i
    }

    function S(e, t) {
        for (var n, i, s, o = 0, r = e.length; r > o; ++o) n = e[o], i = t[2 * o], s = t[2 * o + 1], n.setStartAndEnd(i.node, i.offset, s.node, s.offset)
    }

    function b(e, t) {
        return M.isCharacterDataNode(e) ? 0 == t ? !!e.previousSibling : t == e.length ? !!e.nextSibling : !0 : t > 0 && t < e.childNodes.length
    }

    function R(e, n, i, s) {
        var o, r, a = 0 == i;
        if (M.isAncestorOf(n, e)) return e;
        if (M.isCharacterDataNode(n)) {
            var l = M.getNodeIndex(n);
            if (0 == i) i = l;
            else {
                if (i != n.length) throw t.createError("splitNodeAt() should not be called with offset in the middle of a data node (" + i + " in " + n.data);
                i = l + 1
            }
            n = n.parentNode
        }
        if (b(n, i)) {
            o = n.cloneNode(!1), r = n.parentNode, o.id && o.removeAttribute("id");
            for (var d, f = 0; d = n.childNodes[i];) u(d, o, f++, s);
            return u(o, r, M.getNodeIndex(n) + 1, s), n == e ? o : R(e, r, M.getNodeIndex(o), s)
        }
        if (e != n) {
            o = n.parentNode;
            var p = M.getNodeIndex(n);
            return a || p++, R(e, o, p, s)
        }
        return e
    }

    function x(e, t) {
        return e.tagName == t.tagName && a(e, t) && g(e, t) && "inline" == W(e, "display") && "inline" == W(t, "display")
    }

    function A(e) {
        var t = e ? "nextSibling" : "previousSibling";
        return function(n, i) {
            var s = n.parentNode,
                o = n[t];
            if (o) {
                if (o && 3 == o.nodeType) return o
            } else if (i && (o = s[t], o && 1 == o.nodeType && x(s, o))) return o[e ? "firstChild" : "lastChild"];
            return null
        }
    }

    function w(e) {
        this.isElementMerge = 1 == e.nodeType, this.firstTextNode = this.isElementMerge ? e.lastChild : e, this.textNodes = [this.firstTextNode]
    }

    function P(e, t, i) {
        this.cssClass = e;
        var s, o, r, a, l = null;
        if ("object" == typeof t && null !== t) {
            for (i = t.tagNames, l = t.elementProperties, o = 0; a = V[o++];) t.hasOwnProperty(a) && (this[a] = t[a]);
            s = t.normalize
        } else s = t;
        this.normalize = "undefined" == typeof s ? !0 : s, this.attrExceptions = [];
        var d = document.createElement(this.elementTagName);
        this.elementProperties = this.copyPropertiesToElement(l, d, !0), this.elementSortedClassName = this.elementProperties.hasOwnProperty("className") ? this.elementProperties.className : e, this.applyToAnyTagName = !1;
        var u = typeof i;
        if ("string" == u) "*" == i ? this.applyToAnyTagName = !0 : this.tagNames = n(i.toLowerCase()).split(/\s*,\s*/);
        else if ("object" == u && "number" == typeof i.length)
            for (this.tagNames = [], o = 0, r = i.length; r > o; ++o) "*" == i[o] ? this.applyToAnyTagName = !0 : this.tagNames.push(i[o].toLowerCase());
        else this.tagNames = [this.elementTagName]
    }

    function O(e, t, n) {
        return new P(e, t, n)
    }
    e.requireModules(["WrappedSelection", "WrappedRange"]);
    var W, M = e.dom,
        I = M.DomPosition,
        L = "span",
        B = function() {
            function e(e, t, n) {
                return t && n ? " " : ""
            }
            return function(t, n) {
                t.className && (t.className = t.className.replace(new RegExp("(^|\\s)" + n + "(\\s|$)"), e))
            }
        }();
    "undefined" != typeof window.getComputedStyle ? W = function(e, t) {
        return M.getWindow(e).getComputedStyle(e, null)[t]
    } : "undefined" != typeof document.documentElement.currentStyle ? W = function(e, t) {
        return e.currentStyle[t]
    } : t.fail("No means of obtaining computed style properties found");
    var j;
    ! function() {
        var e = document.createElement("div");
        j = "boolean" == typeof e.isContentEditable ? function(e) {
            return e && 1 == e.nodeType && e.isContentEditable
        } : function(e) {
            return e && 1 == e.nodeType && "false" != e.contentEditable ? "true" == e.contentEditable || j(e.parentNode) : !1
        }
    }();
    var z = /^inline(-block|-table)?$/i,
        D = /[^\r\n\t\f \u200B]/,
        $ = A(!1),
        H = A(!0);
    w.prototype = {
        doMerge: function(e) {
            for (var t, n, i, s, o, r = [], a = 0, l = 0, d = this.textNodes.length; d > l; ++l) {
                if (t = this.textNodes[l], n = t.parentNode, l > 0 && (n.removeChild(t), n.hasChildNodes() || n.parentNode.removeChild(n), e))
                    for (s = 0; o = e[s++];) o.node == t && (o.node = this.firstTextNode, o.offset += a);
                r[l] = t.data, a += t.data.length
            }
            return this.firstTextNode.data = i = r.join(""), i
        },
        getLength: function() {
            for (var e = this.textNodes.length, t = 0; e--;) t += this.textNodes[e].length;
            return t
        },
        toString: function() {
            for (var e = [], t = 0, n = this.textNodes.length; n > t; ++t) e[t] = "'" + this.textNodes[t].data + "'";
            return "[Merge(" + e.join(",") + ")]"
        }
    };
    var V = ["elementTagName", "ignoreWhiteSpace", "applyToEditableOnly", "useExistingElements", "removeEmptyElements"],
        _ = {};
    P.prototype = {
        elementTagName: L,
        elementProperties: {},
        ignoreWhiteSpace: !0,
        applyToEditableOnly: !1,
        useExistingElements: !0,
        removeEmptyElements: !0,
        copyPropertiesToElement: function(e, t, n) {
            var i, r, a, l, d, u, f = {};
            for (var p in e)
                if (e.hasOwnProperty(p))
                    if (l = e[p], d = t[p], "className" == p) s(t, l), s(t, this.cssClass), t[p] = o(t[p]), n && (f[p] = t[p]);
                    else if ("style" == p) {
                r = d, n && (f[p] = a = {});
                for (i in e[p]) r[i] = l[i], n && (a[i] = r[i]);
                this.attrExceptions.push(p)
            } else t[p] = l, n && (f[p] = t[p], u = _.hasOwnProperty(p) ? _[p] : p, this.attrExceptions.push(u));
            return n ? f : ""
        },
        appliesToElement: function(e) {
            return contains(this.tagNames, e.tagName.toLowerCase())
        },
        getEmptyElements: function(e) {
            var t = this;
            return e.getNodes([1], function(e) {
                return t.appliesToElement(e) && !e.hasChildNodes()
            })
        },
        hasClass: function(e) {
            return 1 == e.nodeType && M.arrayContains(this.tagNames, e.tagName.toLowerCase()) && i(e, this.cssClass)
        },
        getSelfOrAncestorWithClass: function(e) {
            for (; e;) {
                if (this.hasClass(e)) return e;
                e = e.parentNode
            }
            return null
        },
        isModifiable: function(e) {
            return !this.applyToEditableOnly || v(e)
        },
        isIgnorableWhiteSpaceNode: function(e) {
            return this.ignoreWhiteSpace && e && 3 == e.nodeType && C(e)
        },
        postApply: function(e, t, n, i) {
            for (var s, o, r, a = e[0], l = e[e.length - 1], d = [], u = a, f = l, p = 0, h = l.length, c = 0, g = e.length; g > c; ++c) o = e[c], r = $(o, !i), r ? (s || (s = new w(r), d.push(s)), s.textNodes.push(o), o === a && (u = s.firstTextNode, p = u.length), o === l && (f = s.firstTextNode, h = s.getLength())) : s = null;
            var m = H(l, !i);
            if (m && (s || (s = new w(l), d.push(s)), s.textNodes.push(m)), d.length) {
                for (c = 0, g = d.length; g > c; ++c) d[c].doMerge(n);
                t.setStartAndEnd(u, p, f, h)
            }
        },
        createContainer: function(e) {
            var t = e.createElement(this.elementTagName);
            return this.copyPropertiesToElement(this.elementProperties, t, !1), s(t, this.cssClass), t
        },
        applyToTextNode: function(e, t) {
            var n = e.parentNode;
            if (1 == n.childNodes.length && M.arrayContains(this.tagNames, n.tagName.toLowerCase()) && this.useExistingElements) s(n, this.cssClass);
            else {
                var i = this.createContainer(M.getDocument(e));
                e.parentNode.insertBefore(i, e), i.appendChild(e)
            }
        },
        isRemovable: function(e) {
            return e.tagName.toLowerCase() == this.elementTagName && r(e) == this.elementSortedClassName && N(e, this.elementProperties) && !m(e, this.attrExceptions) && this.isModifiable(e)
        },
        isEmptyContainer: function(e) {
            var t = e.childNodes.length;
            return 1 == e.nodeType && this.isRemovable(e) && (0 == t || 1 == t && this.isEmptyContainer(e.firstChild))
        },
        removeEmptyContainers: function(e) {
            var t = this,
                n = (e.getNodes([1], function(e) {
                    return t.isEmptyContainer(e)
                }), [e]),
                i = E(n);
            S(n, i)
        },
        undoToTextNode: function(e, t, n, i) {
            if (!t.containsNode(n)) {
                var s = t.cloneRange();
                s.selectNode(n), s.isPointInRange(t.endContainer, t.endOffset) && (R(n, t.endContainer, t.endOffset, i), t.setEndAfter(n)), s.isPointInRange(t.startContainer, t.startOffset) && (n = R(n, t.startContainer, t.startOffset, i))
            }
            this.isRemovable(n) ? p(n, i) : B(n, this.cssClass)
        },
        applyToRange: function(e, t) {
            t = t || [];
            var n = E(t || []);
            e.splitBoundariesPreservingPositions(n), this.removeEmptyElements && this.removeEmptyContainers(e);
            var i = c(e);
            if (i.length) {
                for (var s, o = 0; s = i[o++];) !this.isIgnorableWhiteSpaceNode(s) && !this.getSelfOrAncestorWithClass(s) && this.isModifiable(s) && this.applyToTextNode(s, n);
                e.setStart(i[0], 0), s = i[i.length - 1], e.setEnd(s, s.length), this.normalize && this.postApply(i, e, n, !1), S(t, n)
            }
            var r = this.getEmptyElements(e);
            forEach(r, function(e) {
                addClass(e, this.className)
            })
        },
        applyToRanges: function(e) {
            for (var t = e.length; t--;) this.applyToRange(e[t], e);
            return e
        },
        applyToSelection: function(t) {
            var n = e.getSelection(t);
            n.setRanges(this.applyToRanges(n.getAllRanges()))
        },
        undoToRange: function(e, t) {
            t = t || [];
            var n = E(t);
            e.splitBoundariesPreservingPositions(n);
            var i, s, o = c(e),
                r = o[o.length - 1];
            if (o.length) {
                for (var a = 0, l = o.length; l > a; ++a) i = o[a], s = this.getSelfOrAncestorWithClass(i), s && this.isModifiable(i) && this.undoToTextNode(i, e, s, n), e.setStart(o[0], 0), e.setEnd(r, r.length);
                this.normalize && this.postApply(o, e, n, !0), S(t, n)
            }
        },
        undoToRanges: function(e) {
            for (var t = e.length; t--;) this.undoToRange(e[t], e);
            return e.forEach(function(e) {}), e
        },
        undoToSelection: function(t) {
            var n = e.getSelection(t),
                i = e.getSelection(t).getAllRanges();
            this.undoToRanges(i), n.setRanges(i)
        },
        getTextSelectedByRange: function(e, t) {
            var n = t.cloneRange();
            n.selectNodeContents(e);
            var i = n.intersection(t),
                s = i ? i.toString() : "";
            return n.detach(), s
        },
        isAppliedToRange: function(e) {
            if (e.collapsed) return !!this.getSelfOrAncestorWithClass(e.commonAncestorContainer);
            for (var t, n = e.getNodes([3]), i = 0; t = n[i++];)
                if (!this.isIgnorableWhiteSpaceNode(t) && h(e, t) && this.isModifiable(t) && !this.getSelfOrAncestorWithClass(t)) return !1;
            return !0
        },
        isAppliedToRanges: function(e) {
            for (var t = e.length; t--;)
                if (!this.isAppliedToRange(e[t])) return !1;
            return !0
        },
        isAppliedToSelection: function(t) {
            var n = e.getSelection(t);
            return this.isAppliedToRanges(n.getAllRanges())
        },
        toggleRange: function(e) {
            this.isAppliedToRange(e) ? this.undoToRange(e) : this.applyToRange(e)
        },
        toggleRanges: function(e) {
            this.isAppliedToRanges(e) ? this.undoToRanges(e) : this.applyToRanges(e)
        },
        toggleSelection: function(e) {
            this.isAppliedToSelection(e) ? this.undoToSelection(e) : this.applyToSelection(e)
        },
        detach: function() {}
    }, P.util = {
        hasClass: i,
        addClass: s,
        removeClass: B,
        hasSameClasses: a,
        replaceWithOwnChildren: p,
        elementsHaveSameNonClassAttributes: g,
        elementHasNonClassAttributes: m,
        splitNodeAt: R,
        isEditableElement: j,
        isEditingHost: y,
        isEditable: v
    }, e.CssClassApplier = P, e.createCssClassApplier = O
});
