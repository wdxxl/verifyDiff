rangy.createModule("CustomUtil", function(api, module) {
    api.requireModules(["DomUtil", "WrappedRange"]);
    var dom = api.dom;

    var __cached_full_text = "",
        __content_chache = [];

    function cacheContents() {
        var nd = dom.getBody(document),
            offset = 0;
        __cached_full_text = "", __content_chache = [];

        function getTextNodes(node) {
            if (node.nodeType == 3) {
                __cached_full_text += node.nodeValue;
                var start = offset,
                    end = offset += node.nodeValue.length;
                __content_chache[__content_chache.length] = {
                    "element": node,
                    "startOffset": start,
                    "endOffset": (end),
                    "toString": function() {
                        return this["startOffset"] + "~" + this["endOffset"] + "{" + this["element"].nodeValue + "}";
                    }
                };

            } else {
                for (var i = 0, len = node.childNodes.length; i < len; ++i)
                    getTextNodes(node.childNodes[i]);
            }
        }

        getTextNodes(nd);
    }

    api.addInitListener(function(api) {
        cacheContents();
    });

    function getRangeText(range) {
        var txt = "";
        range.getNodes([3], function(el) {
            var cur = el.nodeValue;
            var startOffset = 0;
            var endOffset = cur.length;

            if (el == range.startContainer)
                startOffset = range.startOffset;

            if (el == range.endContainer)
                endOffset = range.endOffset;

            txt += cur.substring(startOffset, endOffset);
        });
        return txt;
    }

    function getRangesByText(text) {
        var idx = pos = 0,
            ranges = [];
        while (-1 != (idx = __cached_full_text.indexOf(text, pos))) {
            var range = getRangeByText(text, idx);
            if (range != null)
                ranges[ranges.length] = range;
            pos = idx + text.length;
        }
        return ranges;
    }

    function getRangesByClassName(className) {
        var ranges = [];
        for (var i = 0; i < __content_chache.length; i++) {
            var item = __content_chache[i];
            var element = item.element;
            if (element.parentNode.nodeType == 1 && $(element.parentNode).attr("class") == className) {
                var range = api.createRange();
                range.setStart(element, 0);
                range.setEnd(element, element.nodeValue.length);
                ranges[ranges.length] = range;
            }
        }
        return ranges;
    }

    function getRangeByText(text, startOffset) {
        var endOffset = startOffset + text.length;
        var range = null;
        for (var i = 0; i < __content_chache.length; i++) {
            var item = __content_chache[i];
            var start = item.startOffset;
            var end = item.endOffset;
            if (startOffset >= start && startOffset <= end) {
                range = api.createRange();
                range.setStart(item.element, startOffset - start);
            }

            if (endOffset >= start && endOffset <= end) {
                range.setEnd(item.element, endOffset - start);
                break;
            }
        }
        return range;
    }

    function getRangeByTextPosition(text, pos) {
        var start = offset = hit = 0;
        do {
            start = __cached_full_text.indexOf(text, offset);
            offset = start + text.length;
            hit++;
        } while (start != -1 && offset < __cached_full_text.length && hit <= pos);

        return start == -1 ? null : getRangeByText(text, start);
    }

    function getRangePosition(range, text) {
        if (range == null) {
            var selection = rangy.getSelection();
            range = selection.getRangeAt(0);
        }

        if (range.toString() == "")
            return -1;

        if (text == null)
            text = getRangeText(range);

        var rgs = getRangesByText(text);

        if (rgs.length > 1) {
            for (var i = 0; i < rgs.length; i++) {
                if (compareRange(range, rgs[i])) {
                    return i;
                }
            }
        } else if (rgs.length === 1) {
            range = rgs[0];
            return 0;
        }

        return -1;
    }

    function check(node) {
        return node !== undefined && node.nodeType === 1;
    }

    function isEmptyChild(node) {
        return node.tagName == "COLGROUP" || (node.tagName == "TD" && node.childNodes.length == 0);
    }

    function compareRange(range1, range2) {
        var child2;
        if (range1.startContainer.childNodes.length > 0) {
            while (range1.startContainer.nodeType == 1 &&
                range1.startContainer !== range2.startContainer) {

                var childNodes2 = range1.startContainer.childNodes;
                if (check(childNodes2[0])) {
                    for (var i = 0, l = childNodes2.length; i < l; i++) {
                        if (!isEmptyChild(childNodes2[i])) {
                            child2 = childNodes2[i];
                            break;
                        }
                    }
                } else {
                    child2 = range1.startContainer.childNodes[0];
                }
                range1.setStart(child2, child2.childNodes.length);

            }
        }
        return range1 == null || range2 == null ? false : (range1.startContainer == range2.startContainer &&
            range1.startOffset === range2.startOffset) || (range1.endContainer == range2.endContainer && range1.endOffset === range2.endOffset);
    }

    function getTextStartOffset(text, pos) {
        var start = offset = hit = 0;
        do {
            start = __cached_full_text.indexOf(text, offset);
            offset = start + text.length;
            hit++;
        } while (start != -1 && offset < __cached_full_text.length && hit <= pos);

        return start;
    }
    api.util.extend(api, {
        compareRange: compareRange,
        getRangeText: getRangeText,
        getRangesByText: getRangesByText,
        getRangeByTextPosition: getRangeByTextPosition,
        getRangePosition: getRangePosition,
        getRangesByClassName: getRangesByClassName,
        getTextStartOffset: getTextStartOffset,
        refreshCache: cacheContents
    });

});
