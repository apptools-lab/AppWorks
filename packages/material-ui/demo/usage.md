---
title: Simple Usage
order: 1
---

````jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Material from '@iceworks/material-ui';

async function wait(time) {
  await new Promise((resolve) => setTimeout(resolve, time));
}

const bloks = [
  {
    "name": "AdvancedDetailHead",
    "title": "AdvancedDetailHead",
    "category": "Information",
    "screenshot": "https://unpkg.com/@alifd/fusion-advanced-detail/screenshot.png",
    "description": "intro block",
    "homepage": "https://unpkg.com/@alifd/fusion-advanced-detail@0.1.9/build/index.html",
    "categories": [
      "Information"
    ],
    "repository": "https://github.com/alibaba-fusion/materials/tree/master/blocks/AdvancedDetail",
    "source": {
      "type": "npm",
      "npm": "@alifd/fusion-advanced-detail",
      "version": "0.1.9",
      "registry": "https://registry.npmjs.org"
    }
  },
];

class App extends Component {
  render() {
    return (
      <div style={{width: '750px'}}>
        <Material
          onSettingsClick={() => null}
          getSources={async function() {
            await wait(2000);
            return [
              {
                "name": "飞冰物料",
                "type": "react",
                "source": "http://ice.alicdn.com/assets/materials/react-materials.json",
                "description": "基于 Fusion 基础组件和 ICE 脚手架的官方物料"
              },
              {
                "name": "飞猪物料",
                "type": "react",
                "source": "https://fusion.alibaba-inc.com/api/v1/sites/21/materials",
                "description": "飞猪团队提供的高质量 React 物料"
              }
            ];
          }}
          getData={async function() {
            await wait(2000);
            return {
              "type": "react",
              "name": "materials",
              "description": "基于 Fusion 基础组件和 ICE 脚手架的官方物料",
              "blocks": bloks,
              "components": [
                {
                  "name": "Anchor",
                  "title": "锚点",
                  "category": "DataDisplay",
                  "description": "anchor",
                  "homepage": "https://unpkg.com/@alifd/biz-anchor@1.1.7/build/index.html",
                  "categories": [
                    "DataDisplay"
                  ],
                  "source": {
                    "type": "npm",
                    "npm": "@alifd/biz-anchor",
                    "version": "1.1.7",
                    "registry": "http://registry.npmjs.org"
                  }
                },
              ],
              "scaffolds": [
                {
                  "name": "Fusion Design Pro - TS",
                  "title": "Fusion Design Pro - TS",
                  "category": "Basic",
                  "screenshot": "https://img.alicdn.com/tfs/TB16ftixUY1gK0jSZFMXXaWcVXa-2880-1800.png",
                  "description": "使用 TypeScript，包含大量 UI 区块，比如图表、表单等。",
                  "homepage": "https://unpkg.com/@alifd/fusion-design-pro@0.1.29/build/index.html",
                  "categories": [
                  "Basic"
                  ],
                  "repository": "https://github.com/alibaba-fusion/materials/tree/master/scaffolds/fusion-design-pro",
                  "source": {
                    "type": "npm",
                    "npm": "@alifd/fusion-design-pro",
                    "version": "0.1.29",
                    "registry": "https://registry.npmjs.org"
                  },
                  "screenshots": [
                    "https://img.alicdn.com/tfs/TB16ftixUY1gK0jSZFMXXaWcVXa-2880-1800.png"
                  ]
                }
              ]
            };
          }}
          selectedBlocks={bloks}
          onBlockClick={function() { alert('block click!!!'); }}
        />
      </div>
    );
  }
}

ReactDOM.render((
  <App />
), mountNode);
````
