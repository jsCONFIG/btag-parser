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