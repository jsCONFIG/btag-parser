(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.btagParser = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DEFAULT_TAG = ['b', 'i', 'u'];
var regLib = {
    tag: {
        br: /<br\s*\/?>/
    },
    specialSym: /([<>&])/g
};

var specialMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
};

var utils = {
    filterIllegalSym: function (str) {
        return str.replace(regLib.specialSym, function (unit, sym) {
            return specialMap[sym] || unit;
        });
    },

    smartyMerge: function (rootObj, newObj) {
        var tempObj = {};
        newObj = newObj || {};

        for (var i in rootObj ) {
            tempObj[i] = rootObj[i];

            if (i in newObj) {
                tempObj[i] = newObj[i];
            }

        }
        return tempObj;
    },

    isArray: function (item) {
        return item instanceof Array;
    },

    tagRegCreator: function (tagList, stringify) {
        var regStr = '<([' + tagList.join('|') + '])>(.*?)<\\/\\1>';
        if (stringify) {
            return regStr;
        }
        return new RegExp(regStr, 'g');
    }
};

var parseBr = function (str, keepPure, brReg) {
    if (!str || !brReg) {
        return [{type: 'text', value: str}];
    }
    var group = str.split(brReg);
    var parsedGroup = [];
    var strUnit;
    var gL = group.length;
    var gLLess = gL - 1;
    for (var i = 0; i < gLLess; i++) {
        strUnit = group[i];
        if (strUnit === '') {
            parsedGroup.push({
                type: 'br'
            });
            continue;
        }
        if (keepPure) {
            strUnit = utils.filterIllegalSym(strUnit);
        }
        parsedGroup
            .splice(parsedGroup.length, 0, {type: 'text', value: strUnit}, {type: 'br'});
    }

    // 结尾处特殊处理
    if (gLLess >= 0) {
        strUnit = group[gLLess];
        if (strUnit !== '') {
            if (keepPure) {
                strUnit = utils.filterIllegalSym(strUnit);
            }
            parsedGroup.push({
                type: 'text',
                value: strUnit
            });
        }
    }

    return parsedGroup;
};

var parserWrapper = function (opt) {
    var options = utils.smartyMerge({
        tagList: DEFAULT_TAG,
        // 换行符号，支持<br>标签和其它换行字符
        brSym: 'br'
    }, opt);

    var brReg;
    if (options.brSym) {
        if (options.brSym === 'br') {
            brReg = regLib.tag.br;
        }
        else {
            brReg = options.brSym;
        }
    }

    var tagList = options.tagList;
    if (!tagList || !utils.isArray(tagList) || !tagList.length) {
        return function (strUnit, keepPure) {
            return parseBr(strUnit, keepPure, brReg);
        };
    }
    var regStr = utils.tagRegCreator(tagList, true);

    var tagParser = function (strUnit, keepPure) {
        if (!strUnit) {
            return parseBr(strUnit, keepPure, brReg);
        }
        var group = [];
        var execResult;
        var tagReg = new RegExp(regStr, 'g');
        var startPos = strUnit.search(tagReg);
        var lastPos = 0;

        while (execResult = tagReg.exec(strUnit)) {
            var fullStr = execResult[0];
            var tagType = execResult[1];
            var mixinStr = execResult[2];
            var leftOffset = tagReg.lastIndex - lastPos - fullStr.length;
            if (leftOffset > 0) {
                let extraStr = strUnit.substr(lastPos, leftOffset);
                group = group.concat(parseBr(extraStr, keepPure, brReg));
            }
            var nextParsedVal = tagParser(mixinStr, keepPure);
            lastPos = tagReg.lastIndex;
            group.push({
                type: tagType,
                value: nextParsedVal
            });
        }
        if (lastPos < strUnit.length) {
            group = group.concat(parseBr(strUnit.slice(lastPos), keepPure, brReg));
        }

        return group.length ? group : parseBr(strUnit, keepPure, brReg);
    };

    return tagParser;
};

module.exports = parserWrapper;
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnRhZy1wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBERUZBVUxUX1RBRyA9IFsnYicsICdpJywgJ3UnXTtcbnZhciByZWdMaWIgPSB7XG4gICAgdGFnOiB7XG4gICAgICAgIGJyOiAvPGJyXFxzKlxcLz8+L1xuICAgIH0sXG4gICAgc3BlY2lhbFN5bTogLyhbPD4mXSkvZ1xufTtcblxudmFyIHNwZWNpYWxNYXAgPSB7XG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJyYnOiAnJmFtcDsnXG59O1xuXG52YXIgdXRpbHMgPSB7XG4gICAgZmlsdGVySWxsZWdhbFN5bTogZnVuY3Rpb24gKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UocmVnTGliLnNwZWNpYWxTeW0sIGZ1bmN0aW9uICh1bml0LCBzeW0pIHtcbiAgICAgICAgICAgIHJldHVybiBzcGVjaWFsTWFwW3N5bV0gfHwgdW5pdDtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNtYXJ0eU1lcmdlOiBmdW5jdGlvbiAocm9vdE9iaiwgbmV3T2JqKSB7XG4gICAgICAgIHZhciB0ZW1wT2JqID0ge307XG4gICAgICAgIG5ld09iaiA9IG5ld09iaiB8fCB7fTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHJvb3RPYmogKSB7XG4gICAgICAgICAgICB0ZW1wT2JqW2ldID0gcm9vdE9ialtpXTtcblxuICAgICAgICAgICAgaWYgKGkgaW4gbmV3T2JqKSB7XG4gICAgICAgICAgICAgICAgdGVtcE9ialtpXSA9IG5ld09ialtpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZW1wT2JqO1xuICAgIH0sXG5cbiAgICBpc0FycmF5OiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbSBpbnN0YW5jZW9mIEFycmF5O1xuICAgIH0sXG5cbiAgICB0YWdSZWdDcmVhdG9yOiBmdW5jdGlvbiAodGFnTGlzdCwgc3RyaW5naWZ5KSB7XG4gICAgICAgIHZhciByZWdTdHIgPSAnPChbJyArIHRhZ0xpc3Quam9pbignfCcpICsgJ10pPiguKj8pPFxcXFwvXFxcXDE+JztcbiAgICAgICAgaWYgKHN0cmluZ2lmeSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlZ1N0cjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdTdHIsICdnJyk7XG4gICAgfVxufTtcblxudmFyIHBhcnNlQnIgPSBmdW5jdGlvbiAoc3RyLCBrZWVwUHVyZSwgYnJSZWcpIHtcbiAgICBpZiAoIXN0ciB8fCAhYnJSZWcpIHtcbiAgICAgICAgcmV0dXJuIFt7dHlwZTogJ3RleHQnLCB2YWx1ZTogc3RyfV07XG4gICAgfVxuICAgIHZhciBncm91cCA9IHN0ci5zcGxpdChiclJlZyk7XG4gICAgdmFyIHBhcnNlZEdyb3VwID0gW107XG4gICAgdmFyIHN0clVuaXQ7XG4gICAgdmFyIGdMID0gZ3JvdXAubGVuZ3RoO1xuICAgIHZhciBnTExlc3MgPSBnTCAtIDE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnTExlc3M7IGkrKykge1xuICAgICAgICBzdHJVbml0ID0gZ3JvdXBbaV07XG4gICAgICAgIGlmIChzdHJVbml0ID09PSAnJykge1xuICAgICAgICAgICAgcGFyc2VkR3JvdXAucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2JyJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2VlcFB1cmUpIHtcbiAgICAgICAgICAgIHN0clVuaXQgPSB1dGlscy5maWx0ZXJJbGxlZ2FsU3ltKHN0clVuaXQpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnNlZEdyb3VwXG4gICAgICAgICAgICAuc3BsaWNlKHBhcnNlZEdyb3VwLmxlbmd0aCwgMCwge3R5cGU6ICd0ZXh0JywgdmFsdWU6IHN0clVuaXR9LCB7dHlwZTogJ2JyJ30pO1xuICAgIH1cblxuICAgIC8vIOe7k+WwvuWkhOeJueauiuWkhOeQhlxuICAgIGlmIChnTExlc3MgPj0gMCkge1xuICAgICAgICBzdHJVbml0ID0gZ3JvdXBbZ0xMZXNzXTtcbiAgICAgICAgaWYgKHN0clVuaXQgIT09ICcnKSB7XG4gICAgICAgICAgICBpZiAoa2VlcFB1cmUpIHtcbiAgICAgICAgICAgICAgICBzdHJVbml0ID0gdXRpbHMuZmlsdGVySWxsZWdhbFN5bShzdHJVbml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnNlZEdyb3VwLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogc3RyVW5pdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkR3JvdXA7XG59O1xuXG52YXIgcGFyc2VyV3JhcHBlciA9IGZ1bmN0aW9uIChvcHQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHV0aWxzLnNtYXJ0eU1lcmdlKHtcbiAgICAgICAgdGFnTGlzdDogREVGQVVMVF9UQUcsXG4gICAgICAgIC8vIOaNouihjOespuWPt++8jOaUr+aMgTxicj7moIfnrb7lkozlhbblroPmjaLooYzlrZfnrKZcbiAgICAgICAgYnJTeW06ICdicidcbiAgICB9LCBvcHQpO1xuXG4gICAgdmFyIGJyUmVnO1xuICAgIGlmIChvcHRpb25zLmJyU3ltKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmJyU3ltID09PSAnYnInKSB7XG4gICAgICAgICAgICBiclJlZyA9IHJlZ0xpYi50YWcuYnI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBiclJlZyA9IG9wdGlvbnMuYnJTeW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdGFnTGlzdCA9IG9wdGlvbnMudGFnTGlzdDtcbiAgICBpZiAoIXRhZ0xpc3QgfHwgIXV0aWxzLmlzQXJyYXkodGFnTGlzdCkgfHwgIXRhZ0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RyVW5pdCwga2VlcFB1cmUpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUJyKHN0clVuaXQsIGtlZXBQdXJlLCBiclJlZyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciByZWdTdHIgPSB1dGlscy50YWdSZWdDcmVhdG9yKHRhZ0xpc3QsIHRydWUpO1xuXG4gICAgdmFyIHRhZ1BhcnNlciA9IGZ1bmN0aW9uIChzdHJVbml0LCBrZWVwUHVyZSkge1xuICAgICAgICBpZiAoIXN0clVuaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUJyKHN0clVuaXQsIGtlZXBQdXJlLCBiclJlZyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdyb3VwID0gW107XG4gICAgICAgIHZhciBleGVjUmVzdWx0O1xuICAgICAgICB2YXIgdGFnUmVnID0gbmV3IFJlZ0V4cChyZWdTdHIsICdnJyk7XG4gICAgICAgIHZhciBzdGFydFBvcyA9IHN0clVuaXQuc2VhcmNoKHRhZ1JlZyk7XG4gICAgICAgIHZhciBsYXN0UG9zID0gMDtcblxuICAgICAgICB3aGlsZSAoZXhlY1Jlc3VsdCA9IHRhZ1JlZy5leGVjKHN0clVuaXQpKSB7XG4gICAgICAgICAgICB2YXIgZnVsbFN0ciA9IGV4ZWNSZXN1bHRbMF07XG4gICAgICAgICAgICB2YXIgdGFnVHlwZSA9IGV4ZWNSZXN1bHRbMV07XG4gICAgICAgICAgICB2YXIgbWl4aW5TdHIgPSBleGVjUmVzdWx0WzJdO1xuICAgICAgICAgICAgdmFyIGxlZnRPZmZzZXQgPSB0YWdSZWcubGFzdEluZGV4IC0gbGFzdFBvcyAtIGZ1bGxTdHIubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlZnRPZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV4dHJhU3RyID0gc3RyVW5pdC5zdWJzdHIobGFzdFBvcywgbGVmdE9mZnNldCk7XG4gICAgICAgICAgICAgICAgZ3JvdXAgPSBncm91cC5jb25jYXQocGFyc2VCcihleHRyYVN0ciwga2VlcFB1cmUsIGJyUmVnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmV4dFBhcnNlZFZhbCA9IHRhZ1BhcnNlcihtaXhpblN0ciwga2VlcFB1cmUpO1xuICAgICAgICAgICAgbGFzdFBvcyA9IHRhZ1JlZy5sYXN0SW5kZXg7XG4gICAgICAgICAgICBncm91cC5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0YWdUeXBlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXh0UGFyc2VkVmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGFzdFBvcyA8IHN0clVuaXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBncm91cCA9IGdyb3VwLmNvbmNhdChwYXJzZUJyKHN0clVuaXQuc2xpY2UobGFzdFBvcyksIGtlZXBQdXJlLCBiclJlZykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdyb3VwLmxlbmd0aCA/IGdyb3VwIDogcGFyc2VCcihzdHJVbml0LCBrZWVwUHVyZSwgYnJSZWcpO1xuICAgIH07XG5cbiAgICByZXR1cm4gdGFnUGFyc2VyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZXJXcmFwcGVyOyJdfQ==
