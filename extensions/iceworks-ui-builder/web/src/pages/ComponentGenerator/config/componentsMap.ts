// 组件描述协议
// http://iceworks.oss-cn-hangzhou.aliyuncs.com/iceluna/componentsMap.json
export default {
  'TreeSelectNode': {
    'name': 'TreeSelectNode',
    'title': '树型选择器节点',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'children',
        'label': '树节点',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Input',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        },
        'formItemProps': '',
        'description': '树节点'
      },
      {
        'name': 'label',
        'label': '节点标签',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '节点文本内容'
      },
      {
        'category': '基础属性',
        'label': '节点值',
        'name': 'value',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'name': 'selectable',
        'label': '支持选中',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单独设置是否支持选中，覆盖 Tree 的 selectable'
      },
      {
        'name': 'checkable',
        'label': '支持复选',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单独设置是否出现复选框，覆盖 Tree 的 checkable'
      },
      {
        'name': 'editable',
        'label': '支持编辑',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单独设置是否支持编辑，覆盖 Tree 的 editable'
      },
      {
        'name': 'draggable',
        'label': '支持拖拽',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单独设置是否支持拖拽，覆盖 Tree 的 draggable'
      },
      {
        'name': 'disabled',
        'label': '禁止响应',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否禁止节点响应'
      },
      {
        'name': 'checkboxDisabled',
        'label': '禁止勾选',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否禁止勾选节点复选框'
      },
      {
        'name': 'isLeaf',
        'label': '叶子节点',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否是叶子节点，设置loadData时生效'
      }
    ],
    'version': '1.16.6',
    'code': null,
    'basicId': 430,
    'versionId': 853,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'TreeSelect,TreeSelectNode',
    'childrenRule': null,
    'exportName': 'TreeSelect',
    'subName': 'Node',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': null
  },
  'SplitButtonDivider': {
    'name': 'SplitButtonDivider',
    'title': '分隔按钮分隔',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [],
    'version': '1.16.6',
    'code': null,
    'basicId': 429,
    'versionId': 852,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': 'SplitButton,SplitButtonGroup',
    'childrenRule': null,
    'exportName': 'SplitButton',
    'subName': 'Divider',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': 'http://fusion-demo.alibaba-inc.com/demos/next/split-button',
    'docDetail': null
  },
  'SplitButtonGroup': {
    'name': 'SplitButtonGroup',
    'title': '分隔按钮组',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'label',
        'label': '标签内容',
        'description': '标签内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '1.16.6',
    'code': null,
    'basicId': 428,
    'versionId': 851,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'SplitButton,SplitButtonGroup',
    'childrenRule': null,
    'exportName': 'SplitButton',
    'subName': 'Group',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': 'http://fusion-demo.alibaba-inc.com/demos/next/split-button',
    'docDetail': null
  },
  'SplitButtonItem': {
    'name': 'SplitButtonItem',
    'title': '分隔按钮项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'label': '菜单内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单key',
        'name': 'key',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'name': 'disabled',
        'description': '是否禁用',
        'label': '禁用',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'helper',
        'label': '帮助内容',
        'description': '帮助文本',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '1.16.6',
    'code': null,
    'basicId': 427,
    'versionId': 850,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'SplitButton,SplitButtonGroup',
    'childrenRule': null,
    'exportName': 'SplitButton',
    'subName': 'Item',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': 'http://fusion-demo.alibaba-inc.com/demos/next/split-button',
    'docDetail': null
  },
  'MenuButtonDivider': {
    'name': 'MenuButtonDivider',
    'title': '菜单按钮分隔',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [],
    'version': '1.16.6',
    'code': null,
    'basicId': 426,
    'versionId': 849,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': 'MenuButton,MenuButtonGroup',
    'childrenRule': null,
    'exportName': 'MenuButton',
    'subName': 'Divider',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': 'http://fusion-demo.alibaba-inc.com/demos/next/menu-button',
    'docDetail': null
  },
  'MenuButtonGroup': {
    'name': 'MenuButtonGroup',
    'title': '菜单按钮组',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'label',
        'label': '标签内容',
        'description': '标签内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '1.16.6',
    'code': null,
    'basicId': 425,
    'versionId': 848,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'MenuButton,MenuButtonGroup',
    'childrenRule': null,
    'exportName': 'MenuButton',
    'subName': 'Group',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': 'http://fusion-demo.alibaba-inc.com/demos/next/menu-button',
    'docDetail': null
  },
  'MenuButtonItem': {
    'name': 'MenuButtonItem',
    'title': '菜单按钮项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'label': '菜单内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单key',
        'name': 'key',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'name': 'disabled',
        'description': '是否禁用',
        'label': '禁用',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'helper',
        'label': '帮助内容',
        'description': '帮助文本',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '1.16.6',
    'code': null,
    'basicId': 423,
    'versionId': 847,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': 'MenuButton,MenuButtonGroup',
    'childrenRule': null,
    'exportName': 'MenuButton',
    'subName': 'Item',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': 'http://fusion-demo.alibaba-inc.com/demos/next/menu-button',
    'docDetail': null
  },
  'Component': {
    'name': 'Component',
    'title': '组件容器',
    'screenshot': null,
    'icon': 'zujianku',
    'tags': '',
    'package': null,
    'destructuring': 0,
    'main': null,
    'description': '用于搭建做低代码业务组件的容器，提供组件数据环境',
    'props': [
      {
        'category': '基础属性',
        'label': 'fileName',
        'name': '组件名称',
        'type': 'Input',
        'description': '定义低代码组件名称',
        'formItemProps': {
          'required': true,
          'rules': [
            {
              'required': true,
              'message': '必填'
            }
          ]
        }
      }
    ],
    'version': '1.0.0',
    'code': null,
    'basicId': 417,
    'versionId': 841,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': null,
    'subName': null,
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': null
  },
  'Page': {
    'name': 'Page',
    'title': '页面容器',
    'screenshot': null,
    'icon': 'shitu',
    'tags': '页面,容器',
    'package': null,
    'destructuring': 0,
    'main': null,
    'description': '页面容器，用于包裹整个页面，提供页面范围的数据容器',
    'props': [],
    'version': '1.0.0',
    'code': null,
    'basicId': 416,
    'versionId': 756,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': null,
    'subName': null,
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': null
  },
  'Block': {
    'name': 'Block',
    'title': '区块容器',
    'screenshot': null,
    'icon': 'jihe',
    'tags': '区块,容器',
    'package': null,
    'destructuring': 0,
    'main': null,
    'description': '区块容器组件，用于发送数据请求，绑定数据源，做数据容器',
    'props': [
      {
        'category': '基础属性',
        'label': '文件名称',
        'name': '__fileName',
        'type': 'Input',
        'formItemProps': {
          'required': true,
          'rules': [
            {
              'required': true,
              'message': '必填'
            }
          ]
        }
      }
    ],
    'version': '1.0.0',
    'code': '',
    'basicId': 415,
    'versionId': 839,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': null,
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': '<h1>Block 组件文档</h1>'
  },
  'Image': {
    'name': 'Image',
    'title': '图片',
    'screenshot': null,
    'icon': 'picture',
    'tags': null,
    'package': '@ali/iceluna-components-image',
    'destructuring': 0,
    'main': null,
    'description': 'image',
    'props': [
      {
        'category': '基础属性',
        'label': '图片地址',
        'name': 'src',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '图片标题',
        'name': 'title',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '^0.0.2',
    'code': null,
    'basicId': 412,
    'versionId': 832,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Image',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': null
  },
  'Html': {
    'name': 'Html',
    'title': '代码',
    'screenshot': null,
    'icon': 'kaifa',
    'tags': null,
    'package': '@ali/iceluna-components-html',
    'destructuring': 0,
    'main': null,
    'description': 'Html',
    'props': [
      {
        'category': '基础属性',
        'name': 'html',
        'label': '代码内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'MonacoEditor',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'html'
          }
        }
      }
    ],
    'version': '^0.0.2',
    'code': null,
    'basicId': 411,
    'versionId': 831,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Html',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': null
  },
  'A': {
    'name': 'A',
    'title': '超链接',
    'screenshot': null,
    'icon': 'lianjie',
    'tags': null,
    'package': '@alife/iceluna-components-a',
    'destructuring': 0,
    'main': null,
    'description': 'A',
    'props': [
      {
        'category': '基础属性',
        'label': '链接内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '链接地址',
        'name': 'href',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '跳转方式',
        'name': 'target',
        'type': 'Mixin',
        'props': {
          'types': [
            'Select',
            'Expression'
          ],
          'defaultType': 'Select',
          'selectProps': {
            'hasClear': true,
            'dataSource': [
              {
                'label': '本窗口跳转 - self',
                'value': '_self'
              },
              {
                'label': '新开窗口跳转 - blank',
                'value': '_blank'
              },
              {
                'label': '父窗口跳转 - parent',
                'value': '_parent'
              },
              {
                'label': '顶层窗口跳转 - top',
                'value': '_top'
              }
            ]
          }
        }
      }
    ],
    'version': '^0.0.6',
    'code': null,
    'basicId': 410,
    'versionId': 830,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'A',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': '<h1>A 超链接</h1>\n<p>A标签定义超链接，用于从一张页面链接到另一张页面。</p>\n<h2>属性</h2>\n<ul>\n<li>children：链接内容，支持字符串、ReactNode、变量三种形式；</li>\n<li>href：链接地址，支持字符串、变量两种形式；</li>\n<li>target：跳转方式，有当前页面打开、新窗口打开、父级页面打开、顶层页面打开等方式，支持下拉选择和变量两种形式；</li>\n</ul>'
  },
  'Text': {
    'name': 'Text',
    'title': '文本',
    'screenshot': null,
    'icon': 'wenben',
    'tags': null,
    'package': '@ali/iceluna-components-text',
    'destructuring': 0,
    'main': null,
    'description': 'Text',
    'props': [
      {
        'category': '基础属性',
        'label': '文本内容',
        'name': 'text',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '^0.0.2',
    'code': null,
    'basicId': 409,
    'versionId': 829,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Text',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': '<h1>Text 文本</h1>\n<p>Text为行内元素，不会独占一行，用来定义文本元素。</p>\n<h2>属性</h2>\n<ul>\n<li>text：文本内容，支持字符串和变量两种形式；</li>\n</ul>'
  },
  'Div': {
    'name': 'Div',
    'title': '层标签',
    'screenshot': null,
    'icon': 'biankuang',
    'tags': null,
    'package': '@ali/iceluna-components-div',
    'destructuring': false,
    'main': null,
    'description': 'Div',
    'props': [],
    'version': '^0.0.5',
    'code': null,
    'basicId': 408,
    'versionId': 828,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Div',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': null,
    'docDetail': '<h1>Div 层标签</h1>\n<p>Div为块级元素，独占一行，用来定义文档中的分区或节。</p>\n<h2>属性</h2>\n<ul>\n<li>children：支持字符串、ReactNode、变量三种形式；</li>\n</ul>'
  },
  'UploadSelecter': {
    'name': 'UploadSelecter',
    'title': '自定义上传',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': '[{"name":"accept","label":"文件类型","type":"Mixin","props":{"types":["Input","Expression"],"defaultType":"Input"},"formItemProps":"","description":"接受上传的文件类型 (image/png, image/jpg, .doc, .ppt) 详见 [input accept attribute](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#attr-accept)"},{"name":"disabled","label":"禁用上传","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否禁用上传功能"},{"name":"multiple","label":"支持多选","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否支持多选文件，`ie10+` 支持。开启后按住 ctrl 可选择多个文件"},{"name":"dragable","label":"支持拖拽","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否支持拖拽上传，`ie10+` 支持。"},{"name":"onSelect","label":"文件选择回调","type":"Function","props":{"defaultValue":function onSelect() { \n    //文件选择回调\n  }},"formItemProps":"","description":"文件选择回调"},{"name":"onDragOver","label":"拖拽经过回调","type":"Function","props":{"defaultValue":function onDragOver() {\n    //拖拽经过回调\n  }},"formItemProps":"","description":"拖拽经过回调"},{"name":"onDragLeave","label":"拖拽离开回调","type":"Function","props":{"defaultValue":function onDragLeave() { \n    //拖拽离开回调\n  }},"formItemProps":"","description":"拖拽离开回调"},{"name":"onDrop","label":"拖拽完成回调","type":"Function","props":{"defaultValue":function onDrop() { \n    //拖拽完成回调\n  }},"formItemProps":"","description":"拖拽完成回调"}]',
    'version': '1.16.6',
    'code': '',
    'basicId': 291,
    'versionId': 658,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Upload',
    'subName': 'Selecter',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/uploadselecter?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'TagSelectable': {
    'name': 'TagSelectable',
    'title': '可选中标签',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': '[{"category":"基础属性","name":"children","label":"标签内容","description":"标签内容","type":"Mixin","props":{"types":["Input","Expression","ReactNode"],"defaultType":"Input"}},{"name":"checked","label":"固定选中","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"标签是否被选中，受控用法\\ntag checked or not, a controlled way"},{"name":"defaultChecked","label":"默认选中","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"标签是否默认被选中，非受控用法\\ntag checked or not by default, a uncontrolled way"},{"name":"disabled","label":"禁用","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"标签是否被禁用"},{"name":"onChange","label":"选中状态变化时触发的事件","type":"Function","props":{"defaultValue":function onChange(checked,e) { \n    //选中状态变化时触发的事件\n    //@param {Boolean} checked 是否选中\n    //@param {Event} e Dom 事件对象\n  }},"formItemProps":"","description":"选中状态变化时触发的事件"}]',
    'version': '1.16.6',
    'code': '',
    'basicId': 289,
    'versionId': 660,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Tag',
    'subName': 'Selectable',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/tagselectable?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'TreeNode': {
    'name': 'TreeNode',
    'title': '树形控件节点',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'children',
        'label': '树节点',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Input',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        },
        'formItemProps': '',
        'description': '树节点'
      },
      {
        'name': 'label',
        'label': '节点标签',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '节点文本内容'
      },
      {
        'category': '基础属性',
        'label': '节点值',
        'name': 'value',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'name': 'selectable',
        'label': '支持选中',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单独设置是否支持选中，覆盖 Tree 的 selectable'
      },
      {
        'name': 'checkable',
        'label': '支持复选',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单独设置是否出现复选框，覆盖 Tree 的 checkable'
      },
      {
        'name': 'editable',
        'label': '支持编辑',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单独设置是否支持编辑，覆盖 Tree 的 editable'
      },
      {
        'name': 'draggable',
        'label': '支持拖拽',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单独设置是否支持拖拽，覆盖 Tree 的 draggable'
      },
      {
        'name': 'disabled',
        'label': '禁止响应',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否禁止节点响应'
      },
      {
        'name': 'checkboxDisabled',
        'label': '禁止勾选',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否禁止勾选节点复选框'
      },
      {
        'name': 'isLeaf',
        'label': '叶子节点',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否是叶子节点，设置loadData时生效'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 287,
    'versionId': 661,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Tree',
    'subName': 'Node',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/treenode?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'TimelineItem': {
    'name': 'TimelineItem',
    'title': '时间轴项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'title',
        'label': '标题',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '标题'
      },
      {
        'name': 'content',
        'label': '右侧内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '右侧内容'
      },
      {
        'name': 'timeLeft',
        'label': '左侧时间',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '左侧时间'
      },
      {
        'name': 'icon',
        'label': '图标',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '图标'
      },
      {
        'name': 'dot',
        'label': '节点',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '自定义时间轴节点'
      },
      {
        'name': 'time',
        'label': '格式时间',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '格式化后的时间'
      },
      {
        'name': 'state',
        'label': '节点状态',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '已完成',
                'value': 'done'
              },
              {
                'label': '进行中',
                'value': 'process'
              },
              {
                'label': '失败',
                'value': 'error'
              },
              {
                'label': '成功',
                'value': 'success'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '节点状态'
      },
      {
        'name': 'animation',
        'label': '动画',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': {
          'initValue': true
        },
        'description': '动画'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 286,
    'versionId': 663,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Timeline',
    'subName': 'Item',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/timelineitem?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'TableGroupHeader': {
    'name': 'TableGroupHeader',
    'title': '表格头',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'cell',
        'label': '行渲染',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '行渲染的逻辑'
      },
      {
        'category': '基础属性',
        'name': 'hasChildrenSelection',
        'description': '是否在Children上面渲染selection',
        'type': 'Mixin',
        'label': '渲染selection',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'hasSelection',
        'description': '是否在GroupHeader上面渲染selection',
        'label': '是否在GroupHeader上面渲染selection',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'useFirstLevelDataWhenNoChildren',
        'type': 'Mixin',
        'description': '当 dataSouce 里没有 children 时，是否使用内容作为数据',
        'label': '当 dataSouce 里没有 children 时，是否使用内容作为数据',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 283,
    'versionId': 666,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Table',
    'subName': 'GroupHeader',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/tablegroupheader?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'TableGroupFooter': {
    'name': 'TableGroupFooter',
    'title': '表格尾',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'cell',
        'label': '行渲染',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '行渲染的逻辑'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 284,
    'versionId': 665,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Table',
    'subName': 'GroupFooter',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/tablegroupfooter?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'TableColumnGroup': {
    'name': 'TableColumnGroup',
    'title': '表格列组',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'title',
        'label': '表头内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '表头显示的内容'
      },
      {
        'category': '基础属性',
        'label': '列配置',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        }
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 281,
    'versionId': 667,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Table',
    'childrenRule': null,
    'exportName': 'Table',
    'subName': 'ColumnGroup',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/tablecolumngroup?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'TabItem': {
    'name': 'TabItem',
    'title': '选项卡项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'title',
        'label': '标题',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '选项卡标题'
      },
      {
        'category': '基础属性',
        'label': '内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Input',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        }
      },
      {
        'name': 'closeable',
        'label': '可关闭',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '单个选项卡是否可关闭'
      },
      {
        'name': 'disabled',
        'label': '禁用',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '选项卡是否被禁用'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 280,
    'versionId': 668,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Tab',
    'childrenRule': null,
    'exportName': 'Tab',
    'subName': 'Item',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/tabitem?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'TableColumn': {
    'name': 'TableColumn',
    'title': '表格列',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'title',
        'description': '表头显示的内容',
        'label': '标题',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'name': 'dataIndex',
        'description': '指定列对应的字段，支持a.b形式的快速取值',
        'label': '字段名',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'name': 'cell',
        'label': '列配置',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Input',
            'Expression'
          ],
          'defaultType': 'ReactNode',
          'reactNodeProps': {
            'type': 'function',
            'params': [
              'value',
              'index',
              'record'
            ]
          }
        },
        'formItemProps': '',
        'description': '行渲染的逻辑'
      },
      {
        'category': '基础属性',
        'name': 'width',
        'type': 'Mixin',
        'description': '列宽，注意在锁列的情况下一定需要配置宽度',
        'label': '列宽',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        }
      },
      {
        'category': '基础属性',
        'name': 'align',
        'description': '单元格的对齐方式',
        'label': '对齐方式',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '左',
                'value': 'left'
              },
              {
                'label': '中',
                'value': 'center'
              },
              {
                'label': '右',
                'value': 'right'
              }
            ]
          }
        }
      },
      {
        'category': '基础属性',
        'name': 'alignHeader',
        'description': '单元格标题的对齐方式, 不配置默认读取align值',
        'label': '标题对齐',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '左',
                'value': 'left'
              },
              {
                'label': '中',
                'value': 'center'
              },
              {
                'label': '右',
                'value': 'right'
              }
            ]
          }
        }
      },
      {
        'category': '基础属性',
        'name': 'filterMode',
        'type': 'Mixin',
        'description': '过滤的模式是单选还是多选',
        'label': '过滤模式',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '单选',
                'value': 'single'
              },
              {
                'label': '多选',
                'value': 'multiple'
              }
            ]
          }
        }
      },
      {
        'category': '基础属性',
        'name': 'filters',
        'description': '生成标题过滤的菜单, 格式为[{label:\'xxx\', value:\'xxx\'}]',
        'type': 'Mixin',
        'label': '过滤',
        'props': {
          'types': [
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'MonacoEditor',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'object',
            'placeholder': '[\n\t\n]'
          }
        }
      },
      {
        'category': '基础属性',
        'name': 'filterMenuProps',
        'type': 'Mixin',
        'description': 'filter 模式下传递给 Menu 菜单的属性， 默认继承 Menu 组件的API',
        'label': '菜单属性',
        'props': {
          'types': [
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'MonacoEditor',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'object'
          }
        }
      },
      {
        'category': '基础属性',
        'name': 'sortable',
        'description': '是否支持排序',
        'label': '支持排序',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'lock',
        'description': '是否支持锁列,可选值为left,right, true\t',
        'type': 'Mixin',
        'label': '锁列',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'resizable',
        'description': '是否支持列宽调整, 当该值设为true，table的布局方式会修改为fixed.\t',
        'label': '列宽调整',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 282,
    'versionId': 670,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': 'Table,TableColumnGroup',
    'childrenRule': null,
    'exportName': 'Table',
    'subName': 'Column',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/tablecolumn?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'SubNav': {
    'name': 'SubNav',
    'title': '子导航',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'children',
        'description': '导航项和子导航',
        'label': '导航配置',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        }
      },
      {
        'name': 'label',
        'label': '标签内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '标签内容'
      },
      {
        'name': 'icon',
        'label': '图标',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '自定义图标，可以使用 Icon 的 type，也可以使用组件 `<Icon type="your type" />`'
      },
      {
        'name': 'selectable',
        'label': '是否可选',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否可选'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 275,
    'versionId': 674,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Nav,NavGroup',
    'childrenRule': null,
    'exportName': 'Nav',
    'subName': 'SubNav',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/subnav?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'SelectOption': {
    'name': 'SelectOption',
    'title': '选择项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'value',
        'label': '选项值',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '选项值'
      },
      {
        'name': 'disabled',
        'label': '禁用',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否禁用'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 274,
    'versionId': 673,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Select,SelectOptionGroup',
    'childrenRule': null,
    'exportName': 'Select',
    'subName': 'Option',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/selectoption?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'SelectOptionGroup': {
    'name': 'SelectOptionGroup',
    'title': '选择分组',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'label',
        'label': '分组文案',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '设置分组的文案'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 273,
    'versionId': 675,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Select,SelectOptionGroup',
    'childrenRule': null,
    'exportName': 'Select',
    'subName': 'OptionGroup',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/selectoptiongroup?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'NavItem': {
    'name': 'NavItem',
    'title': '导航项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'icon',
        'label': '导航图标',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '自定义图标，可以使用 Icon 的 type，也可以使用组件 `<Icon type="your type" />`',
        'category': '基础属性'
      },
      {
        'category': '基础属性',
        'label': '导航内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'description': '导航展示的内容'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 271,
    'versionId': 678,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Nav,NavGroup,SubNav',
    'childrenRule': null,
    'exportName': 'Nav',
    'subName': 'Item',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/navitem?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'NavPopupItem': {
    'name': 'NavPopupItem',
    'title': '导航弹出项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'label',
        'label': '标签内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Input',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        },
        'formItemProps': '',
        'description': '标签内容'
      },
      {
        'name': 'icon',
        'label': '图标',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '自定义图标，可以使用 Icon 的 type，也可以使用组件 `<Icon type="your type" />`'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 272,
    'versionId': 676,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Nav,NavGroup,SubNav',
    'childrenRule': null,
    'exportName': 'Nav',
    'subName': 'PopupItem',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/navpopupitem?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'MenuGroup': {
    'name': 'MenuGroup',
    'title': '菜单组',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'label',
        'label': '标签内容',
        'description': '标签内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 269,
    'versionId': 679,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Menu,SubMenu,MenuGroup',
    'childrenRule': null,
    'exportName': 'Menu',
    'subName': 'Group',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/menugroup?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'NavGroup': {
    'name': 'NavGroup',
    'title': '导航组',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'children',
        'label': '导航配置',
        'type': 'Mixin',
        'description': '导航项和子导航\t',
        'props': {
          'types': [
            'ReactNode',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        }
      },
      {
        'name': 'label',
        'label': '标签内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        },
        'formItemProps': '',
        'description': '标签内容'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 270,
    'versionId': 680,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Nav',
    'childrenRule': null,
    'exportName': 'Nav',
    'subName': 'Group',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/navgroup?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'MenuDivider': {
    'name': 'MenuDivider',
    'title': '菜单分隔',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [],
    'version': '1.16.6',
    'code': '',
    'basicId': 268,
    'versionId': 681,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': 'Menu,SubMenu,MenuGroup',
    'childrenRule': null,
    'exportName': 'Menu',
    'subName': 'Divider',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/menudivider?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'MenuPopupItem': {
    'name': 'MenuPopupItem',
    'title': '弹出菜单',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'label',
        'description': '标签内容',
        'label': '标签内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单key',
        'name': 'key',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 264,
    'versionId': 684,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Menu,SubMenu,MenuGroup',
    'childrenRule': null,
    'exportName': 'Menu',
    'subName': 'PopupItem',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/menupopupitem?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'InputGroup': {
    'name': 'InputGroup',
    'title': '输入框组',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'addonBefore',
        'label': '框前内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '输入框前附加内容'
      },
      {
        'name': 'addonAfter',
        'label': '框后内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '输入框后附加内容'
      },
      {
        'name': 'addonBeforeClassName',
        'label': '框前类',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input',
          'inputProps': {
            'placeholder': '输入框前附加内容样式类名'
          }
        },
        'formItemProps': '',
        'description': '输入框前附加内容css'
      },
      {
        'name': 'addonAfterClassName',
        'label': '框后类',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input',
          'inputProps': {
            'placeholder': '输入框后附加内容样式类名'
          }
        },
        'formItemProps': '',
        'description': '输入框后额外css'
      },
      {
        'name': 'rtl',
        'label': 'rtl模式',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': 'rtl'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 263,
    'versionId': 685,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Input',
    'subName': 'Group',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/inputgroup?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'SubMenu': {
    'name': 'SubMenu',
    'title': '子菜单',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'label',
        'description': '标签内容',
        'label': '标签内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单key',
        'name': 'key',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'name': 'selectable',
        'description': '是否可选，该属性仅在设置 Menu 组件 selectMode 属性后生效',
        'label': '可选',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'mode',
        'description': '子菜单打开方式，如果设置会覆盖 Menu 上的同名属性',
        'label': '打开方式',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '内联',
                'value': 'inline'
              },
              {
                'label': '弹出',
                'value': 'popup'
              }
            ]
          }
        }
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 265,
    'versionId': 686,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Menu,SubMenu,MenuGroup',
    'childrenRule': null,
    'exportName': 'Menu',
    'subName': 'SubMenu',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/submenu?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'MenuItem': {
    'name': 'MenuItem',
    'title': '菜单项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'label': '菜单内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '菜单key',
        'name': 'key',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'name': 'disabled',
        'description': '是否禁用',
        'label': '禁用',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'helper',
        'label': '帮助内容',
        'description': '帮助文本',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 262,
    'versionId': 688,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': 'Menu,SubMenu,MenuGroup',
    'childrenRule': null,
    'exportName': 'Menu',
    'subName': 'Item',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/menuitem?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Col': {
    'name': 'Col',
    'title': '列',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'children',
        'label': '列内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '列内容'
      },
      {
        'name': 'component',
        'label': '渲染节点',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '指定以何种元素渲染该节点，默认为 \'div\''
      },
      {
        'name': 'align',
        'label': '对齐方式',
        'type': 'Mixin',
        'props': {
          'types': [
            'Select',
            'Input'
          ],
          'defaultType': 'Select',
          'selectProps': {
            'hasClear': true,
            'dataSource': [
              {
                'label': '顶部对齐',
                'value': 'top'
              },
              {
                'label': '居中对齐',
                'value': 'center'
              },
              {
                'label': '底部对齐',
                'value': 'bottom'
              },
              {
                'label': '基线对齐',
                'value': 'baseline'
              },
              {
                'label': '占满容器',
                'value': 'stretch'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '多列垂直方向对齐方式，可覆盖Row的align属性'
      },
      {
        'name': 'span',
        'label': '列宽度',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        'description': '列宽度'
      },
      {
        'name': 'fixedSpan',
        'label': '固定列宽',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        'description': '固定列宽度，宽度值为20 * 栅格数<br><br>**可选值**:<br>1, 2, 3, ..., 28, 29, 30'
      },
      {
        'name': 'offset',
        'label': '列偏移',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        'description': '（不支持IE9浏览器）列偏移<br><br>**可选值**:<br>1, 2, 3, ..., 22, 23, 24'
      },
      {
        'name': 'fixedOffset',
        'label': '固定偏移',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        'description': '（不支持IE9浏览器）固定列偏移，宽度值为20 * 栅格数<br><br>**可选值**:<br>1, 2, 3, ..., 28, 29, 30'
      },
      {
        'name': 'hidden',
        'label': '隐藏',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Select',
            'Expression'
          ],
          'defaultType': 'Switch',
          'selectProps': {
            'multiple': true,
            'dataSource': [
              'xxs',
              'xs',
              's',
              'm',
              'l',
              'xl'
            ]
          }
        },
        'formItemProps': '',
        'description': '列在不同断点下的显示与隐藏'
      },
      {
        'name': 'xxs',
        'label': 'xxs',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'NumberPicker',
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'Input',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'object'
          }
        },
        'formItemProps': '',
        'description': '>=320px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象'
      },
      {
        'name': 'xs',
        'label': 'xs',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'NumberPicker',
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'Input',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'object'
          }
        },
        'formItemProps': '',
        'description': '>=480px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象'
      },
      {
        'name': 's',
        'label': 's',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'NumberPicker',
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'Input',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'object'
          }
        },
        'formItemProps': '',
        'description': '>=720px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象'
      },
      {
        'name': 'm',
        'label': 'm',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'NumberPicker',
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'Input',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'object'
          }
        },
        'formItemProps': '',
        'description': '>=990px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象'
      },
      {
        'name': 'l',
        'label': 'l',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'NumberPicker',
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'Input',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'object'
          }
        },
        'formItemProps': '',
        'description': '>=1200px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象'
      },
      {
        'name': 'xl',
        'label': 'xl',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'NumberPicker',
            'MonacoEditor',
            'Expression'
          ],
          'defaultType': 'Input',
          'monacoEditorProps': {
            'type': 'button',
            'language': 'object'
          }
        },
        'formItemProps': '',
        'description': '>=1500px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 260,
    'versionId': 689,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Grid',
    'subName': 'Col',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/col?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'FormError': {
    'name': 'FormError',
    'title': '表单错误',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'name',
        'label': '表单名',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '表单名'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 259,
    'versionId': 690,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Form',
    'subName': 'Error',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/formerror?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Row': {
    'name': 'Row',
    'title': '行',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'children',
        'label': '行内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Input',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        },
        'formItemProps': '',
        'description': '行内容'
      },
      {
        'name': 'component',
        'label': '渲染节点',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '指定以何种元素渲染该节点，默认为 \'div\''
      },
      {
        'name': 'gutter',
        'label': '列间隔',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        'description': '列宽度<br><br>**可选值**:<br>1, 2, 3, ..., 22, 23, 24'
      },
      {
        'category': '基础属性',
        'name': 'wrap',
        'label': '自动换行',
        'description': '列在行中宽度溢出后是否换行\t',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'category': '基础属性',
        'name': 'fixed',
        'label': '定宽',
        'type': 'Mixin',
        'description': '行在某一断点下宽度是否保持不变（默认行宽度随视口变化而变化）',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        }
      },
      {
        'name': 'hidden',
        'label': '隐藏',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Select',
            'Expression'
          ],
          'defaultType': 'Switch',
          'selectProps': {
            'multiple': true,
            'dataSource': [
              'xxs',
              'xs',
              's',
              'm',
              'l',
              'xl'
            ]
          }
        },
        'formItemProps': '',
        'description': '行在不同断点下的显示与隐藏'
      },
      {
        'name': 'fixedWidth',
        'label': '固定宽度',
        'type': 'Mixin',
        'props': {
          'types': [
            'Select',
            'Expression'
          ],
          'defaultType': 'Select',
          'selectProps': {
            'hasClear': true,
            'dataSource': [
              {
                'label': 'xxs-320px',
                'value': 'xxs'
              },
              {
                'label': 'xs-480px',
                'value': 'xs'
              },
              {
                'label': 's-720px',
                'value': 's'
              },
              {
                'label': 'm-990px',
                'value': 'm'
              },
              {
                'label': 'l-1200px',
                'value': 'l'
              },
              {
                'label': 'xl-1500px',
                'value': 'xl'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '固定行的宽度为某一断点的宽度，不受视口影响而变动'
      },
      {
        'name': 'align',
        'label': '对齐方式',
        'type': 'Mixin',
        'props': {
          'types': [
            'Select',
            'Input'
          ],
          'defaultType': 'Select',
          'selectProps': {
            'hasClear': true,
            'dataSource': [
              {
                'label': '顶部对齐',
                'value': 'top'
              },
              {
                'label': '居中对齐',
                'value': 'center'
              },
              {
                'label': '底部对齐',
                'value': 'bottom'
              },
              {
                'label': '基线对齐',
                'value': 'baseline'
              },
              {
                'label': '占满容器',
                'value': 'stretch'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '多列垂直方向对齐方式'
      },
      {
        'category': '基础属性',
        'name': 'justify',
        'description': '行内具有多余空间时的布局方式',
        'label': '布局方式',
        'type': 'Mixin',
        'props': {
          'types': [
            'Select',
            'Input'
          ],
          'defaultType': 'Select',
          'selectProps': {
            'hasClear': true,
            'dataSource': [
              {
                'label': '左对齐',
                'value': 'start'
              },
              {
                'label': '居中对齐',
                'value': 'center'
              },
              {
                'label': '右对齐',
                'value': 'end'
              },
              {
                'label': '两端对齐',
                'value': 'space-between'
              },
              {
                'label': '横向平铺',
                'value': 'space-around'
              }
            ]
          }
        }
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 258,
    'versionId': 693,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Grid',
    'subName': 'Row',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/row?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'FormSubmit': {
    'name': 'FormSubmit',
    'title': '表单提交',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'validate',
        'label': '校验',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Input'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '是否校验/需要校验的 name 数组'
      },
      {
        'name': 'onClick',
        'label': '点击提交后触发',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '点击提交后触发'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 256,
    'versionId': 691,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Form',
    'subName': 'Submit',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/formsubmit?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Tooltip': {
    'name': 'Tooltip',
    'title': '文字提示',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'trigger',
        'label': '触发元素',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '触发元素'
      },
      {
        'name': 'children',
        'label': '气泡内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': 'tooltip的内容'
      },
      {
        'name': 'align',
        'label': '弹出位置',
        'type': 'Mixin',
        'props': {
          'types': [
            'Select',
            'Input',
            'Expression'
          ],
          'defaultType': 'Select',
          'selectProps': {
            'hasClear': true,
            'dataSource': [
              {
                'label': '上',
                'value': 't'
              },
              {
                'label': '右',
                'value': 'r'
              },
              {
                'label': '下',
                'value': 'b'
              },
              {
                'label': '左',
                'value': 'l'
              },
              {
                'label': '上左',
                'value': 'tl'
              },
              {
                'label': '上右',
                'value': 'tr'
              },
              {
                'label': '下左',
                'value': 'bl'
              },
              {
                'label': '下右',
                'value': 'br'
              },
              {
                'label': '左上',
                'value': 'lt'
              },
              {
                'label': '左下',
                'value': 'lb'
              },
              {
                'label': '右上',
                'value': 'rt'
              },
              {
                'label': '右下 及其 两两组合',
                'value': 'rb'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '弹出层位置'
      },
      {
        'name': 'triggerType',
        'label': '触发行为',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '点击',
                'value': 'click'
              },
              {
                'label': '悬停',
                'value': 'hover'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '触发行为\n鼠标悬浮, 鼠标点击(\'hover\',\'click\')或者它们组成的数组，如 [\'hover\', \'click\'], 强烈不建议使用\'focus\'，若弹窗内容有复杂交互请使用click'
      },
      {
        'name': 'prefix',
        'label': '样式前缀',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '样式类名的品牌前缀'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 253,
    'versionId': 696,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Balloon',
    'subName': 'Tooltip',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/tooltip?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'CollapsePanel': {
    'name': 'CollapsePanel',
    'title': '单个折叠面板',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'title',
        'label': '标题',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '标题'
      },
      {
        'category': '基础属性',
        'label': '面板内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'category': '基础属性',
        'label': '面板key',
        'name': 'key',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'name': 'disabled',
        'label': '禁用',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否禁止用户操作'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 249,
    'versionId': 700,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Collapse',
    'subName': 'Panel',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/collapsepanel?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'ButtonGroup': {
    'name': 'ButtonGroup',
    'title': '按钮组',
    'screenshot': 'https://gw.alicdn.com/tfs/TB13JGeeAT2gK0jSZFkXXcIQFXa-254-53.png',
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': '标准fusion组件按钮',
    'props': [
      {
        'name': 'size',
        'label': '按钮尺寸',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '小',
                'value': 'small'
              },
              {
                'label': '中',
                'value': 'medium'
              },
              {
                'label': '大',
                'value': 'large'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '统一设置 Button 组件的按钮大小'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 352,
    'versionId': 701,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Button',
    'subName': 'Group',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/buttongroup?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'BreadcrumbItem': {
    'name': 'BreadcrumbItem',
    'title': '面包屑项',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'label': '节点内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'name': 'link',
        'label': '节点链接',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '面包屑节点链接，如果设置这个属性，则该节点为`<a />` ，否则是`<span />`'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 247,
    'versionId': 702,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Breadcrumb',
    'subName': 'Item',
    'isShow': 0,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/breadcrumbitem?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Tree': {
    'name': 'Tree',
    'title': '树形控件',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': '[{"category":"基础属性","name":"children","label":"树节点","type":"Mixin","description":"树节点","props":{"types":["Expression","ReactNode"],"defaultType":"ReactNode"}},{"name":"dataSource","label":"数据源","type":"Mixin","props":{"types":["MonacoEditor","Expression"],"defaultType":"MonacoEditor","monacoEditorProps":{"type":"button","language":"object","placeholder":"[\\n\\t\\n]"}},"formItemProps":"","description":"数据源，该属性优先级高于 children"},{"name":"selectedKeys","label":"固定选中","type":"Mixin","props":{"types":["MonacoEditor","Expression"],"defaultType":"MonacoEditor","monacoEditorProps":{"type":"button","language":"object","placeholder":"[\\n\\t\\n]"}},"formItemProps":"","description":"（用于受控）当前选中节点 key 的数组"},{"name":"defaultSelectedKeys","label":"默认选中","type":"Mixin","props":{"types":["MonacoEditor","Expression"],"defaultType":"MonacoEditor","monacoEditorProps":{"type":"button","language":"object","placeholder":"[\\n\\t\\n]"}},"formItemProps":"","description":"（用于非受控）默认选中节点 key 的数组"},{"name":"focusedKey","label":"焦点项","type":"Mixin","props":{"types":["Input","Expression"],"defaultType":"Input"},"formItemProps":"","description":"当前获得焦点的子菜单或菜单项 key 值"},{"name":"checkedStrategy","label":"回填方式","type":"Mixin","props":{"types":["RadioGroup","Expression"],"defaultType":"RadioGroup","radioGroupProps":{"shape":"button","dataSource":[{"label":"所有","value":"all"},{"label":"父节点","value":"parent"},{"label":"子节点","value":"child"}]}},"formItemProps":"","description":"定义选中时回填的方式"},{"name":"showLine","label":"显示线","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否显示树的线"},{"name":"selectable","label":"支持选中","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":{"initValue":true},"description":"是否支持选中节点"},{"name":"multiple","label":"支持多选","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否支持多选"},{"name":"checkable","label":"支持复选","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否支持勾选节点的复选框"},{"name":"checkStrictly","label":"父子无关","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"勾选节点复选框是否完全受控（父子节点选中状态不再关联）"},{"name":"defaultExpandAll","label":"展开所有","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否默认展开所有节点"},{"name":"autoExpandParent","label":"自动展开","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":{"initValue":true},"description":"是否自动展开父节点"},{"name":"editable","label":"支持编辑","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否支持编辑节点内容"},{"name":"draggable","label":"支持拖拽","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"是否支持拖拽节点"},{"name":"isLabelBlock","label":"全部填充","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"设置节点是否占满剩余空间，一般用于统一在各节点右侧添加元素(借助 flex 实现，暂时只支持 ie10+)"},{"name":"isNodeBlock","label":"占满一行","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":"","description":"设置节点是否占满一行"},{"name":"animation","label":"开启动画","type":"Mixin","props":{"types":["Switch","Expression"],"defaultType":"Switch"},"formItemProps":{"initValue":true},"description":"是否开启展开收起动画"},{"name":"checkedKeys","label":"固定复选","type":"Mixin","props":{"types":["MonacoEditor","Expression"],"defaultType":"MonacoEditor","monacoEditorProps":{"type":"button","language":"object","placeholder":"[\\n\\t\\n]"}},"formItemProps":"","description":"（用于受控）当前勾选复选框节点 key 的数组或 `{checked: Array, indeterminate: Array}` 的对象"},{"name":"defaultCheckedKeys","label":"默认复选","type":"Mixin","props":{"types":["MonacoEditor","Expression"],"defaultType":"MonacoEditor","monacoEditorProps":{"type":"button","language":"object","placeholder":"[\\n\\t\\n]"}},"formItemProps":"","description":"（用于非受控）默认勾选复选框节点 key 的数组"},{"name":"expandedKeys","label":"固定展开","type":"Mixin","props":{"types":["MonacoEditor","Expression"],"defaultType":"MonacoEditor","monacoEditorProps":{"type":"button","language":"object","placeholder":"[\\n\\t\\n]"}},"formItemProps":"","description":"（用于受控）当前展开的节点 key 的数组"},{"name":"defaultExpandedKeys","label":"默认展开","type":"Mixin","props":{"types":["MonacoEditor","Expression"],"defaultType":"MonacoEditor","monacoEditorProps":{"type":"button","language":"object","placeholder":"[\\n\\t\\n]"}},"formItemProps":"","description":"（用于非受控）默认展开的节点 key 的数组"},{"name":"onSelect","label":"选中或取消选中节点时触发的回调函数","type":"Function","props":{"defaultValue":function onSelect(selectedKeys, extra, selectedNodes, node, selected) {\n      //选中或取消选中节点时触发的回调函数\n      //@param {Array} selectedKeys 选中节点key的数组\n      //@param {Object} extra 额外参数\n      //@param {Array} extra.selectedNodes 选中节点的数组\n      //@param {Object} extra.node 当前操作的节点\n      //@param {Boolean} extra.selected 当前操作是否是选中\n\n\n    }},"formItemProps":"","description":"选中或取消选中节点时触发的回调函数"},{"name":"onCheck","label":"勾选或取消勾选复选框时触发的回调函数","type":"Function","props":{"defaultValue":function onCheck(checkedKeys, extra, checkedNodes, checkedNodesPositions, indeterminateKeys, node, checked) {\n      //勾选或取消勾选复选框时触发的回调函数\n      //@param {Array} checkedKeys 勾选复选框节点key的数组\n      //@param {Object} extra 额外参数\n      //@param {Array} extra.checkedNodes 勾选复选框节点的数组\n      //@param {Array} extra.checkedNodesPositions 包含有勾选复选框节点和其位置的对象的数组\n      //@param {Array} extra.indeterminateKeys 半选复选框节点 key 的数组\n      //@param {Object} extra.node 当前操作的节点\n      //@param {Boolean} extra.checked 当前操作是否是勾选\n\n\n    }},"formItemProps":"","description":"勾选或取消勾选复选框时触发的回调函数"},{"name":"onExpand","label":"展开或收起节点时触发的回调函数","type":"Function","props":{"defaultValue":function onExpand(expandedKeys, extra, node, expanded) {\n      //展开或收起节点时触发的回调函数\n      //@param {Array} expandedKeys 展开的节点key的数组\n      //@param {Object} extra 额外参数\n      //@param {Object} extra.node 当前操作的节点\n      //@param {Boolean} extra.expanded 当前操作是否是展开\n\n\n    }},"formItemProps":"","description":"展开或收起节点时触发的回调函数"},{"name":"onEditFinish","label":"编辑节点内容完成时触发的回调函数","type":"Function","props":{"defaultValue":function onEditFinish(key, label, node) {\n      //编辑节点内容完成时触发的回调函数\n      //@param {String} key 编辑节点的 key\n      //@param {String} label 编辑节点完成时节点的文本\n      //@param {Object} node 当前编辑的节点\n\n\n    }},"formItemProps":"","description":"编辑节点内容完成时触发的回调函数"},{"name":"onDragStart","label":"开始拖拽节点时触发的回调函数","type":"Function","props":{"defaultValue":function onDragStart(info, event, node) {\n      //开始拖拽节点时触发的回调函数\n      //@param {Object} info 拖拽信息\n      //@param {Object} info.event 事件对象\n      //@param {Object} info.node 拖拽的节点\n\n\n    }},"formItemProps":"","description":"开始拖拽节点时触发的回调函数"},{"name":"onDragEnter","label":"拖拽节点进入目标节点时触发的回调函数","type":"Function","props":{"defaultValue":function onDragEnter(info, event, node, expandedKeys) {\n      //拖拽节点进入目标节点时触发的回调函数\n      //@param {Object} info 拖拽信息\n      //@param {Object} info.event 事件对象\n      //@param {Object} info.node 目标节点\n      //@param {Array} info.expandedKeys 当前展开的节点key的数组\n\n\n    }},"formItemProps":"","description":"拖拽节点进入目标节点时触发的回调函数"},{"name":"onDragOver","label":"拖拽节点在目标节点上移动的时候触发的回调函数","type":"Function","props":{"defaultValue":function onDragOver(info, event, node) {\n      //拖拽节点在目标节点上移动的时候触发的回调函数\n      //@param {Object} info 拖拽信息\n      //@param {Object} info.event 事件对象\n      //@param {Object} info.node 目标节点\n\n\n    }},"formItemProps":"","description":"拖拽节点在目标节点上移动的时候触发的回调函数"},{"name":"onDragLeave","label":"拖拽节点离开目标节点时触发的回调函数","type":"Function","props":{"defaultValue":function onDragLeave(info, event, node) {\n      //拖拽节点离开目标节点时触发的回调函数\n      //@param {Object} info 拖拽信息\n      //@param {Object} info.event 事件对象\n      //@param {Object} info.node 目标节点\n\n\n    }},"formItemProps":"","description":"拖拽节点离开目标节点时触发的回调函数"},{"name":"onDragEnd","label":"拖拽节点拖拽结束时触发的回调函数","type":"Function","props":{"defaultValue":function onDragEnd(info, event, node) {\n      //拖拽节点拖拽结束时触发的回调函数\n      //@param {Object} info 拖拽信息\n      //@param {Object} info.event 事件对象\n      //@param {Object} info.node 目标节点\n\n\n    }},"formItemProps":"","description":"拖拽节点拖拽结束时触发的回调函数"},{"name":"onDrop","label":"拖拽节点放入目标节点内或前后触发的回调函数","type":"Function","props":{"defaultValue":function onDrop(info, event, node, dragNode, dragNodesKeys, dropPosition) {\n      //拖拽节点放入目标节点内或前后触发的回调函数\n      //@param {Object} info 拖拽信息\n      //@param {Object} info.event 事件对象\n      //@param {Object} info.node 目标节点\n      //@param {Object} info.dragNode 拖拽的节点\n      //@param {Array} info.dragNodesKeys 拖拽的节点和其子节点 key 的数组\n      //@param {Number} info.dropPosition 放置位置，-1代表当前节点前，0代表当前节点里，1代表当前节点后\n\n\n    }},"formItemProps":"","description":"拖拽节点放入目标节点内或前后触发的回调函数"},{"name":"canDrop","label":"节点是否可被作为拖拽的目标节点","type":"Function","props":{"defaultValue":function canDrop(info, node, dragNode, dragNodesKeys, dropPosition) {\n      //节点是否可被作为拖拽的目标节点\n      //@param {Object} info 拖拽信息\n      //@param {Object} info.node 目标节点\n      //@param {Object} info.dragNode 拖拽的节点\n      //@param {Array} info.dragNodesKeys 拖拽的节点和其子节点 key 的数组\n      //@param {Number} info.dropPosition 放置位置，-1代表当前节点前，0代表当前节点里，1代表当前节点后\n      //@return {Boolean} 是否可以被当作目标节点\n\n\n    }},"formItemProps":"","description":"节点是否可被作为拖拽的目标节点"},{"name":"loadData","label":"异步加载数据的函数","type":"Function","props":{"defaultValue":function loadData(node) {\n      //异步加载数据的函数\n      //@param {Object} node 被点击展开的节点\n\n\n    }},"formItemProps":"","description":"异步加载数据的函数"},{"name":"filterTreeNode","label":"按需筛选高亮节点","type":"Function","props":{"defaultValue":function filterTreeNode(node) {\n      //按需筛选高亮节点\n      //@param {Object} node 待筛选的节点\n      //@return {Boolean} 是否被筛选中\n\n\n    }},"formItemProps":"","description":"按需筛选高亮节点"},{"name":"onRightClick","label":"右键点击节点时触发的回调函数","type":"Function","props":{"defaultValue":function onRightClick(info, event, node) {\n      //右键点击节点时触发的回调函数\n      //@param {Object} info 信息对象\n      //@param {Object} info.event 事件对象\n      //@param {Object} info.node 点击的节点\n\n\n    }},"formItemProps":"","description":"右键点击节点时触发的回调函数"}]',
    'version': '1.16.6',
    'code': '',
    'basicId': 243,
    'versionId': 706,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Tree',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/tree?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Timeline': {
    'name': 'Timeline',
    'title': '时间轴',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'fold',
        'label': '折叠选项',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '自定义折叠选项 示例`[{foldArea: [startIndex, endIndex], foldShow: boolean}]`'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 241,
    'versionId': 708,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Timeline',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/timeline?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Paragraph': {
    'name': 'Paragraph',
    'title': '段落',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'size',
        'label': '尺寸',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '中',
                'value': 'medium'
              },
              {
                'label': '小',
                'value': 'small'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '组件大小。'
      },
      {
        'name': 'type',
        'label': '展示方式',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '展示所有',
                'value': 'long'
              },
              {
                'label': '三行以内',
                'value': 'short'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '什么方式展示段落'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 226,
    'versionId': 723,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Paragraph',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/paragraph?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Loading': {
    'name': 'Loading',
    'title': '加载',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'tip',
        'label': '提示内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '自定义内容'
      },
      {
        'name': 'tipAlign',
        'label': '提示位置',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': '动画右方',
                'value': 'right'
              },
              {
                'label': '动画下方',
                'value': 'bottom'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '自定义内容位置'
      },
      {
        'name': 'visible',
        'label': '是否可见',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch',
          'switchProps': {
            'defaultChecked': true
          }
        },
        'formItemProps': '',
        'description': 'loading 状态, 默认 true'
      },
      {
        'name': 'fullScreen',
        'label': '全屏展示',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '全屏展示'
      },
      {
        'name': 'inline',
        'label': '内联显示',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': 'should loader be displayed inline'
      },
      {
        'name': 'indicator',
        'label': '动画',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '自定义动画'
      },
      {
        'name': 'color',
        'label': '动画颜色',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '动画颜色'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 218,
    'versionId': 730,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Loading',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/loading?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Icon': {
    'name': 'Icon',
    'title': '图标',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'size',
        'label': '图标尺寸',
        'type': 'Mixin',
        'props': {
          'types': [
            'Select',
            'Expression'
          ],
          'defaultType': 'Select',
          'selectProps': {
            'hasClear': true,
            'dataSource': [
              {
                'label': 'xxs',
                'value': 'xxs'
              },
              {
                'label': 'xs',
                'value': 'xs'
              },
              {
                'label': 'small',
                'value': 'small'
              },
              {
                'label': 'medium',
                'value': 'medium'
              },
              {
                'label': 'large',
                'value': 'large'
              },
              {
                'label': 'xl',
                'value': 'xl'
              },
              {
                'label': 'xxl',
                'value': 'xxl'
              },
              {
                'label': 'xxxl',
                'value': 'xxxl'
              },
              {
                'label': 'inherit',
                'value': 'inherit'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '指定图标大小'
      },
      {
        'name': 'type',
        'label': '图标类型',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '指定显示哪种图标'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 216,
    'versionId': 733,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Icon',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/icon?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Grid': {
    'name': 'Grid',
    'title': '栅格',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [],
    'version': '1.16.6',
    'code': '',
    'basicId': 215,
    'versionId': 734,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Grid',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/grid?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'ConfigProvider': {
    'name': 'ConfigProvider',
    'title': '全局配置',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'name': 'children',
        'type': 'Mixin',
        'label': '内容',
        'description': '内容',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'name': 'device',
        'label': '设备类型',
        'type': 'Mixin',
        'props': {
          'types': [
            'RadioGroup',
            'Expression'
          ],
          'defaultType': 'RadioGroup',
          'radioGroupProps': {
            'shape': 'button',
            'dataSource': [
              {
                'label': 'tablet',
                'value': 'tablet'
              },
              {
                'label': 'desktop',
                'value': 'desktop'
              },
              {
                'label': 'phone',
                'value': 'phone'
              }
            ]
          }
        },
        'formItemProps': '',
        'description': '设备类型，针对不同的设备类型组件做出对应的响应式变化'
      },
      {
        'name': 'errorBoundary',
        'label': '错误捕捉',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否开启错误捕捉 errorBoundary\n如需自定义参数，请传入对象 对象接受参数列表如下：\n\nfallbackUI `Function(error?: {}, errorInfo?: {}) => Element` 捕获错误后的展示\nafterCatch `Function(error?: {}, errorInfo?: {})` 捕获错误后的行为, 比如埋点上传'
      },
      {
        'name': 'pure',
        'label': '纯渲染',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否开启 Pure Render 模式，会提高性能，但是也会带来副作用'
      },
      {
        'name': 'warning',
        'label': '显示警告',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否在开发模式下显示组件属性被废弃的 warning 提示'
      },
      {
        'name': 'rtl',
        'label': 'rtl模式',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否开启 rtl 模式'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 210,
    'versionId': 739,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'ConfigProvider',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/configprovider?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Card': {
    'name': 'Card',
    'title': '卡片',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'title',
        'label': '标题',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '卡片的标题'
      },
      {
        'name': 'subTitle',
        'label': '副标题',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '卡片的副标题'
      },
      {
        'category': '基础属性',
        'name': 'children',
        'label': '卡片内容',
        'description': '卡片内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'name': 'extra',
        'label': '附加内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '标题区域的用户自定义内容'
      },
      {
        'name': 'contentHeight',
        'label': '固定高度',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        'description': '内容区域的固定高度'
      },
      {
        'name': 'showTitleBullet',
        'label': '项目符号',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否显示标题的项目符号'
      },
      {
        'name': 'showHeadDivider',
        'label': '分隔线',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '是否展示头部的分隔线'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 207,
    'versionId': 742,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Card',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/card?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Badge': {
    'name': 'Badge',
    'title': '徽标',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'name': 'count',
        'label': '展示数字',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        // eslint-disable-next-line no-template-curly-in-string
        'description': '展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时默认隐藏'
      },
      {
        'name': 'overflowCount',
        'label': '封顶数字',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        'description': '展示的封顶的数字'
      },
      {
        'category': '基础属性',
        'label': '徽标载体',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        }
      },
      {
        'name': 'content',
        'label': '徽标内容',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'Expression',
            'ReactNode'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '自定义节点内容'
      },
      {
        'name': 'showZero',
        'label': '显示零',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '当count为0时，是否显示count'
      },
      {
        'name': 'dot',
        'label': '显示红点',
        'type': 'Mixin',
        'props': {
          'types': [
            'Switch',
            'Expression'
          ],
          'defaultType': 'Switch'
        },
        'formItemProps': '',
        'description': '不展示数字，只展示一个小红点'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 198,
    'versionId': 751,
    'isContainer': 0,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Badge',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/badge?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  },
  'Breadcrumb': {
    'name': 'Breadcrumb',
    'title': '面包屑',
    'screenshot': null,
    'icon': null,
    'tags': null,
    'package': '@alife/next',
    'destructuring': 1,
    'main': null,
    'description': null,
    'props': [
      {
        'category': '基础属性',
        'label': '内容',
        'name': 'children',
        'type': 'Mixin',
        'props': {
          'types': [
            'ReactNode',
            'Expression'
          ],
          'defaultType': 'ReactNode'
        },
        'description': '面包屑内容'
      },
      {
        'name': 'maxNode',
        'label': '最多个数',
        'type': 'Mixin',
        'props': {
          'types': [
            'NumberPicker',
            'Expression'
          ],
          'defaultType': 'NumberPicker'
        },
        'formItemProps': '',
        'description': '面包屑最多显示个数，超出部分会被隐藏'
      },
      {
        'name': 'separator',
        'label': '分隔符',
        'type': 'Mixin',
        'props': {
          'types': [
            'Input',
            'ReactNode',
            'Expression'
          ],
          'defaultType': 'Input'
        },
        'formItemProps': '',
        'description': '分隔符，可以是文本或 Icon'
      }
    ],
    'version': '1.16.6',
    'code': '',
    'basicId': 202,
    'versionId': 746,
    'isContainer': 1,
    'isLayout': 0,
    'parentRule': null,
    'childrenRule': null,
    'exportName': 'Breadcrumb',
    'subName': null,
    'isShow': 1,
    'siteId': 1,
    'devMode': 1,
    'isOpen': 0,
    'docLink': '//mc-fusion.alibaba-inc.com/demos/comp_groups/@alife/next@1.17.12/breadcrumb?theme=@alife/theme-2@0.1.4&bgColor=%23ffffff',
    'docDetail': null
  }
}
