// Update `plugin-rax-component` to `plugin-component`
// https://rax.js.org/docs/guide/com-migration
const fs = require('fs');
const path = require('path');

let demoOrder = 1;
// glob to reg: demo/*.{js,jsx,ts,tsx} 
const DEMO_FILE_REG = /demo\/.*\.(js|jsx|ts|tsx)$/;

const changeFileExt = (file, ext) => {
  return path.join(path.dirname(file), path.basename(file, path.extname(file)) + ext);
}

module.exports = (fileInfo, api) => {
  const j = api.jscodeshift;
  const basename = path.basename(fileInfo.path);
  if (basename === 'build.json') {
    // {
    //   +  "type": "rax",
    //   +  "targets": ["web"],
    //   +  "inlineStyle": true,
    //     "plugins": [
    //   -    ["build-plugin-rax-component", {
    //   -      "type": "rax",
    //   -      "targets": ["web"],
    //   -      "forceInline": true
    //   -    }]
    //   +    "build-plugin-component"
    //     ]
    //   }
    let config = JSON.parse(fileInfo.source);
    const pluginList = config.plugins || [];

    for (let i = 0; i < pluginList.length; i++) {
      if (pluginList[0][0] === 'build-plugin-rax-component') {
        config = Object.assign({}, config, pluginList[0][1] || {});
        if (config.forceInline !== undefined) {
          config.inlineStyle = config.forceInline;
          delete config.forceInline;
        }
        config.plugins.splice(i, 1, 'build-plugin-component');
      }
    }
    return JSON.stringify(config, null, '  ');

  } else if (basename === 'package.json') {
    // {
    //   -  "build-plugin-rax-component": "^0.2.14",
    //   +  "build-plugin-component": "^1.0.0"
    //  }
    const config = JSON.parse(fileInfo.source);
    const { devDependencies = {} } = config;
    if (devDependencies['build-plugin-rax-component']) {
      devDependencies['build-plugin-component'] = '^1.0.0';
      delete devDependencies['build-plugin-rax-component'];
    }
    return JSON.stringify(config, null, '  ');
  } else if (DEMO_FILE_REG.test(fileInfo.path)) {
    // demo/xxx.jsx -> demo/xxx.md
    // + ---
    // + title: Baisc
    // + order: 1
    // + ---
    // + ```jsx
    // + import { createElement } from 'rax';
    // - import { createElement, render } from 'rax';
    // - import DriverUniversal from 'driver-universal';
    // - import MyComponent from '../src/index';
    // + import MyComponent from 'rax-example';
    // -  render(<MyComponent />, document.body, { driver: DriverUniversal });
    // + function App(){
    // +   return <MyComponent />;
    // + }
    // + export default App;
    // + ``` 
    const transform = j(fileInfo.source);
    // render -> export function
    transform.find(j.ExpressionStatement).forEach(path => {
      const expression = path.node.expression;
      if (expression.callee.name === 'render' && expression.arguments[0].type === 'JSXElement') {
        const demoFnName = 'App';
        const demoJSXElement = expression.arguments[0];
        j(path).replaceWith(
          j.functionDeclaration(j.identifier(demoFnName), [], j.blockStatement([j.returnStatement(demoJSXElement)]))
        ).insertAfter(
          j.exportDeclaration(true, { type: 'Identifier', name: demoFnName })
        )
      }
    });
    // process import 
    transform.find(j.ImportDeclaration).forEach(path => {
      const { node } = path;
      // remove driver import like driver-universal
      if (node.source.value.indexOf('driver-') > -1) {
        j(path).remove();
      }
    });
    // write xx.md file
    fs.writeFileSync(changeFileExt(fileInfo.path, '.md'),
      '---\n' +
      'title: Baisc\n' +
      `order: ${demoOrder++}\n` +
      '---\n' +
      '\n' +
      `${fileInfo.path} usage\n` +
      '```jsx\n' +
      transform.toSource() +
      '```'
      , 'utf8'
    );
    return fileInfo.source;
  } else {
    return fileInfo.source;
  }
};
