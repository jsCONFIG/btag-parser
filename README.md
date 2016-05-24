# BTag Parser
======

用于解析简单的字符串为对应的标签树，支持自定义标签

### Options - btagParser
__tagList (default: ['b', 'i', 'u']);__

要解析的标签列表

__brSym (default: 'br');__

换行符，设置 `null` 来忽略；

### API
`var parser = btagParser();`

__parser(str[, translateCharacter]);__

`translateCharacter`用于确定是否将特殊字符转义，默认为false 

### Example

```
var str = '<i>To be</i> or <i><b>not</b> to be</i>, That is a <b>question</b>';
var parser = btagParser();
parser(str);
/*
[
    {
        "type": "i",
        "value": [
            {
                "type": "normal",
                "value": "To be"
            }
        ]
    },
    {
        "type": "normal",
        "value": " or "
    },
    {
        "type": "i",
        "value": [
            {
                "type": "b",
                "value": [
                    {
                        "type": "normal",
                        "value": "not"
                    }
                ]
            },
            {
                "type": "normal",
                "value": " to be"
            }
        ]
    },
    {
        "type": "normal",
        "value": ", That is a "
    },
    {
        "type": "b",
        "value": [
            {
                "type": "normal",
                "value": "question"
            }
        ]
    }
]
*/
```