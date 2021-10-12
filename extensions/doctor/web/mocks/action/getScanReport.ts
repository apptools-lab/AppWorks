/* eslint-disable */
export default {
  filesInfo: {
    count: 1,
    lines: 77,
  },
  ESLint: {
    score: 90,
    reports: [
      {
        filePath: '/Users/yangfan/Workspace/ali/yangfeng-test2/src/mobile/index.js',
        messages: [
          {
            ruleId: 'react-hooks/exhaustive-deps',
            severity: 1,
            message:
              "React Hook useEffect has a missing dependency: 'props'. Either include it or remove the dependency array.",
            line: 26,
            column: 6,
            nodeType: 'ArrayExpression',
            endLine: 26,
            endColumn: 8,
            suggestions: [
              {
                desc: 'Update the dependencies array to be: [props]',
                fix: {
                  range: [523, 525],
                  text: '[props]',
                },
              },
            ],
          },
          {
            ruleId: 'react/jsx-no-target-blank',
            severity: 2,
            message:
              'Using target="_blank" without rel="noreferrer" is a security risk: see https://html.spec.whatwg.org/multipage/links.html#link-type-noopener',
            line: 33,
            column: 49,
            nodeType: 'JSXAttribute',
            endLine: 33,
            endColumn: 64,
          },
          {
            ruleId: 'react/jsx-no-target-blank',
            severity: 2,
            message:
              'Using target="_blank" without rel="noreferrer" is a security risk: see https://html.spec.whatwg.org/multipage/links.html#link-type-noopener',
            line: 65,
            column: 18,
            nodeType: 'JSXAttribute',
            endLine: 65,
            endColumn: 33,
          },
          {
            ruleId: 'react/jsx-no-duplicate-props',
            severity: 2,
            message: 'No duplicate props allowed',
            line: 65,
            column: 34,
            nodeType: 'JSXAttribute',
            endLine: 65,
            endColumn: 62,
          },
        ],
        errorCount: 3,
        warningCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        output:
          "import { createElement, useEffect } from 'rax';\nimport View from 'rax-view';\nimport Text from 'rax-text';\nimport Picture from 'rax-picture';\n\nexport default function Mod(props) {\n  console.log(props);\n  const defaultTheme = {\n    themeColor: '#fff'\n  };\n  const defaultAttr = {\n    hidden: false\n  };\n  \n  const {\n    // 渲染依赖的核心数据\n    items = [],\n    // 模块主题皮肤设置\n    $theme: { themeColor } = defaultTheme,\n    // 模块配置\n    $attr: { hidden } = defaultAttr,\n  } = props.data;\n\n  useEffect(() => {\n    console.log(props);\n  }, []);\n\n  return (\n    <View className=\"mod\" style={{\n      backgroundColor: themeColor,\n      padding: '20px'\n    }}>\n      <a href=\"https://pegasus.alibaba-inc.com\" target=\"_blank\">\n        <Picture\n          source={{\n            uri: 'https://img.alicdn.com/tfs/TB1x2PDxXOWBuNjy0FiXXXFxVXa-760-760.png',\n          }}\n          style={{\n            width: 76,\n            height: 76,\n          }}\n        />\n      </a>\n      <Text style={{\n        color: '#333',\n        fontSize: '20px',\n        padding: '10px 0'\n      }}>欢迎使用天马模块开发工具！洋风测试</Text>\n      {\n        hidden !== 'true' ? <Text style={{\n          fontSize: '12px'\n        }}>这是一行可以通过模块 schema $attr 配置隐藏的文字</Text> : null\n      }\n      <ol style={{\n        padding: '10px 0'\n      }}>\n        {\n          items.map(element => {\n            return (<li style={{\n              marginLeft: '20px',\n              listStyle: 'decimal outside none',\n              fontSize: '18px',\n              color: '#2077ff'\n            }}>\n              <a target=\"_blank\" target=\"noopener noreferrer\" href={element.url} style={{\n                color: '#2077ff',\n                textDecoration: 'underline'\n              }}>\n                <Text>{element.key}</Text>\n              </a>\n            </li>);\n          })\n        }\n      </ol>\n    </View>\n  );\n}",
      },
    ],
  },
  maintainability: {
    score: 63.44,
    reports: [
      {
        aggregate: {
          cyclomatic: 5,
          cyclomaticDensity: 13.158,
          halstead: {
            bugs: 0.257,
            difficulty: 9.867,
            effort: 7596.756,
            length: 132,
            time: 422.042,
            vocabulary: 57,
            volume: 769.941,
            operands: {
              distinct: 45,
              total: 74,
              identifiers: [
                'Mod',
                'props',
                'console',
                'log',
                'defaultTheme',
                'themeColor',
                '"#fff"',
                'defaultAttr',
                'hidden',
                'false',
                'items',
                '$theme',
                '$attr',
                'data',
                'useEffect',
                '"mod"',
                'backgroundColor',
                'padding',
                '"20px"',
                '"https://pegasus.alibaba-inc.com"',
                '"_blank"',
                'uri',
                '"https://img.alicdn.com/tfs/TB1x2PDxXOWBuNjy0FiXXXFxVXa-760-760.png"',
                'width',
                '76',
                'height',
                'color',
                '"#333"',
                'fontSize',
                '"10px 0"',
                '"true"',
                '"12px"',
                'null',
                'map',
                'element',
                'marginLeft',
                'listStyle',
                '"decimal outside none"',
                '"18px"',
                '"#2077ff"',
                '"noopener noreferrer"',
                'url',
                'textDecoration',
                '"underline"',
                'key',
              ],
            },
            operators: {
              distinct: 12,
              total: 58,
              identifiers: ['function', '()', '.', 'let', '=', '{}', ':', '[]', 'function=>', 'return', ':?', '!=='],
            },
          },
          paramCount: 2,
          sloc: {
            logical: 38,
            physical: 77,
          },
        },
        settings: {
          commonjs: true,
          esmImportExport: {
            halstead: false,
            lloc: false,
          },
          forin: false,
          logicalor: true,
          switchcase: true,
          templateExpression: {
            halstead: true,
            lloc: true,
          },
          trycatch: false,
          newmi: true,
        },
        classes: [],
        dependencies: [
          {
            line: 1,
            path: 'rax',
            type: 'esm',
          },
          {
            line: 2,
            path: 'rax-view',
            type: 'esm',
          },
          {
            line: 3,
            path: 'rax-text',
            type: 'esm',
          },
          {
            line: 4,
            path: 'rax-picture',
            type: 'esm',
          },
        ],
        errors: [],
        filePath: '/Users/yangfan/Workspace/ali/yangfeng-test2/src/mobile/index.js',
        lineEnd: 77,
        lineStart: 1,
        maintainability: 63.443,
        methods: [
          {
            cyclomatic: 2,
            cyclomaticDensity: 6.897,
            halstead: {
              bugs: 0.174,
              difficulty: 8.25,
              effort: 4304.24,
              length: 95,
              time: 239.124,
              vocabulary: 45,
              volume: 521.726,
              operands: {
                distinct: 34,
                total: 51,
                identifiers: [
                  'console',
                  'log',
                  'props',
                  'defaultTheme',
                  'themeColor',
                  '"#fff"',
                  'defaultAttr',
                  'hidden',
                  'false',
                  'items',
                  '$theme',
                  '$attr',
                  'data',
                  'useEffect',
                  '"mod"',
                  'backgroundColor',
                  'padding',
                  '"20px"',
                  '"https://pegasus.alibaba-inc.com"',
                  '"_blank"',
                  'uri',
                  '"https://img.alicdn.com/tfs/TB1x2PDxXOWBuNjy0FiXXXFxVXa-760-760.png"',
                  'width',
                  '76',
                  'height',
                  'color',
                  '"#333"',
                  'fontSize',
                  '"10px 0"',
                  '"true"',
                  '"12px"',
                  'null',
                  'map',
                  'element',
                ],
              },
              operators: {
                distinct: 11,
                total: 44,
                identifiers: ['()', '.', 'let', '=', '{}', ':', '[]', 'function=>', 'return', ':?', '!=='],
              },
            },
            paramCount: 1,
            sloc: {
              logical: 29,
              physical: 72,
            },
            errors: [],
            lineEnd: 77,
            lineStart: 6,
            name: 'Mod',
            paramNames: ['props'],
            maxNestedMethodDepth: 0,
            nestedMethods: [],
          },
          {
            cyclomatic: 1,
            cyclomaticDensity: 100,
            halstead: {
              bugs: 0.004,
              difficulty: 1,
              effort: 11.61,
              length: 5,
              time: 0.645,
              vocabulary: 5,
              volume: 11.61,
              operands: {
                distinct: 3,
                total: 3,
                identifiers: ['console', 'log', 'props'],
              },
              operators: {
                distinct: 2,
                total: 2,
                identifiers: ['()', '.'],
              },
            },
            paramCount: 0,
            sloc: {
              logical: 1,
              physical: 3,
            },
            errors: [],
            lineEnd: 26,
            lineStart: 24,
            name: '<anon method-1>',
            paramNames: [],
            maxNestedMethodDepth: 0,
            nestedMethods: [],
          },
          {
            cyclomatic: 1,
            cyclomaticDensity: 14.286,
            halstead: {
              bugs: 0.041,
              difficulty: 2.4,
              effort: 295.656,
              length: 29,
              time: 16.425,
              vocabulary: 19,
              volume: 123.19,
              operands: {
                distinct: 15,
                total: 18,
                identifiers: [
                  'marginLeft',
                  '"20px"',
                  'listStyle',
                  '"decimal outside none"',
                  'fontSize',
                  '"18px"',
                  'color',
                  '"#2077ff"',
                  '"_blank"',
                  '"noopener noreferrer"',
                  'element',
                  'url',
                  'textDecoration',
                  '"underline"',
                  'key',
                ],
              },
              operators: {
                distinct: 4,
                total: 11,
                identifiers: ['return', '{}', ':', '.'],
              },
            },
            paramCount: 1,
            sloc: {
              logical: 7,
              physical: 15,
            },
            errors: [],
            lineEnd: 72,
            lineStart: 58,
            name: '<anon method-2>',
            paramNames: ['element'],
            maxNestedMethodDepth: 0,
            nestedMethods: [],
          },
        ],
        aggregateAverage: {
          cyclomatic: 1.25,
          cyclomaticDensity: 3.289,
          halstead: {
            bugs: 0.064,
            difficulty: 2.467,
            effort: 1899.189,
            length: 33,
            time: 105.51,
            vocabulary: 14.25,
            volume: 192.485,
            operands: {
              distinct: 11.25,
              total: 18.5,
            },
            operators: {
              distinct: 3,
              total: 14.5,
            },
          },
          paramCount: 0.5,
          sloc: {
            logical: 9.5,
            physical: 19.25,
          },
        },
        methodAverage: {
          cyclomatic: 1.333,
          cyclomaticDensity: 40.394,
          halstead: {
            bugs: 0.073,
            difficulty: 3.883,
            effort: 1537.168,
            length: 43,
            time: 85.398,
            vocabulary: 23,
            volume: 218.842,
            operands: {
              distinct: 17.333,
              total: 24,
            },
            operators: {
              distinct: 5.667,
              total: 19,
            },
          },
          paramCount: 0.667,
          sloc: {
            logical: 12.333,
            physical: 30,
          },
        },
      },
    ],
  },
  repeatability: {
    score: 89.98,
    clones: [
      {
        format: 'javascript',
        foundDate: 1599632510649,
        duplicationA: {
          sourceId: '/Users/yangfan/Workspace/ali/questions-and-answers/src/pages/Mine/components/MyInvite/index.jsx',
          start: {
            line: 70,
            column: 19,
            position: 535,
          },
          end: {
            line: 92,
            column: 30,
            position: 705,
          },
          range: [1635, 2114],
          fragment:
            '={onEndReached}\n      isLoading={loading}\n      isEmpty={list && list.length === 0}\n      errorMsg={data.errMsg}\n      hasMore={data.hasMore === \'true\'}\n    >\n      {\n        list && list.map((item, index) => {\n          return <Card data={item} key={`item_${index}`} />;\n        })\n      }\n    </List>\n  );\n};\n\nfunction Card(props) {\n  const { data = {} } = props;\n\n  return (\n    <QuestionCard\n      question_id={data.topicId}\n      tab="MyInvite"\n      itemPicUrl={data.picUrl',
        },
        duplicationB: {
          sourceId: '/Users/yangfan/Workspace/ali/questions-and-answers/src/pages/Mine/components/MyQuestion/index.jsx',
          start: {
            line: 69,
            column: 19,
            position: 526,
          },
          end: {
            line: 93,
            column: 34,
            position: 722,
          },
          range: [1584, 2127],
          fragment:
            '={onEndReached}\n      isLoading={loading}\n      isEmpty={list && list.length === 0}\n      errorMsg={data.errMsg}\n      hasMore={data.hasMore === \'true\'}\n    >\n      {\n        list && list.map((item, index) => {\n          return <Card data={item} key={`item_${index}`} />;\n        })\n      }\n    </List>\n  );\n};\n\nfunction Card(props) {\n  const { data = {} } = props;\n\n  const answner = data.answers ? data.answers[0] : null;\n\n  return (\n    <QuestionCard\n      question_id={data.topicId}\n      tab="MyQuestion"\n      itemPicUrl={data.itemPicUrl',
        },
      },
    ],
  },
  codemod: {
    score: 98,
    reports: [
      {
        title: '遵循阿里巴巴前端规范，并接入 @iceworks/spec 的最佳实践',
        title_en: 'Follow Alibaba FED lint rules, and use @iceworks/spec best practices',
        message: '遵循阿里巴巴前端规范，并更新 rax, ice 和 react 项目中的 eslint / stylelint / prettier 配置。',
        message_en: 'Follow Alibaba FED lint rules, and update eslint / stylelint / prettier in rax, ice and react project.',
        severity: 0,
        npm_deprecate: '@ice/spec',
        transform: 'lint-config-to-spec',
        docs: 'https://github.com/apptools-lab/codemod/tree/master/transforms/docs/lint-config-to-spec.md',
        mode: 'check',
        output: 'Processing 211 files... \n' +
          'Spawning 7 workers...\n' +
          'Running in dry mode, no files will be written! \n' +
          'Sending 31 files to free worker...\n' +
          'Sending 31 files to free worker...\n' +
          'Sending 31 files to free worker...\n' +
          'Sending 31 files to free worker...\n' +
          'Sending 31 files to free worker...\n' +
          'Sending 31 files to free worker...\n' +
          'Sending 25 files to free worker...\n' +
          'All done. \n' +
          'Results: \n' +
          '0 errors\n' +
          '0 unmodified\n' +
          '194 skipped\n' +
          '17 ok\n' +
          'Time elapsed: 3.707seconds \n'
      },
      {
        title: 'Rax 组件工程升级',
        title_en: 'Rax component project upgrade',
        message: '从 plugin-rax-component 升级到 plugin-component',
        message_en: 'upgrade from plugin-rax-component to plugin-component',
        severity: 1,
        npm_deprecate: 'build-plugin-rax-component',
        transform: 'plugin-rax-component-to-component',
        docs: 'https://github.com/apptools-lab/codemod/tree/master/transforms/docs/plugin-rax-component-to-component.md',
        mode: 'check',
        output: 'Processing 20 files... \nSpawning 7 workers...\nRunning in dry mode, no ' +
          'files will be written! \nSending 3 files to free worker...\nSending 3 ' +
          'files to free worker...\nSending 3 files to free worker...\nSending 3 ' +
          'files to free worker...\nSending 3 files to free worker...\nSending 3 ' +
          'files to free worker...\nSending 2 files to free worker...\nAll done. \n' +
          'Results: \n0 errors\n18 unmodified\n1 skipped\n1 ok\nTime elapsed: ' +
          '1.014seconds '
      }
    ]
  },
  score: 88.95,
};
