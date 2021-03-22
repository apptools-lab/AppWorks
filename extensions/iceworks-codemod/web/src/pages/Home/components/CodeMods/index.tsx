import React, { useState } from 'react';
import { Tab, Icon } from '@alifd/next';
import * as cloneDeep from 'lodash.clonedeep';
import CodeMod from '../CodeMod';

const defaultTransforms = [
  {
    name: 'Create Element to JSX',
    filePath: 'create-element-to-jsx.js',
    checked: false,
  },
  {
    name: 'findDOMNode',
    filePath: 'findDOMNode.js',
  },
  {
    name: 'Pure Component',
    filePath: 'pure-component.js',
  },
];

const CodeMods = () => {
  const [codeMods, setCodeMods] = useState([
    { name: 'icejs', transforms: defaultTransforms },
    { name: 'React', transforms: defaultTransforms },
    { name: 'JS', transforms: defaultTransforms },
  ]);

  function onChangeAll(checked, cname) {
    const newCodeMods = cloneDeep(codeMods);
    const cIndex = codeMods.findIndex(({ name }) => name === cname);
    newCodeMods[cIndex].transforms = codeMods[cIndex].transforms.map((transform) => {
      return {
        ...transform,
        checked,
      };
    });
    setCodeMods(newCodeMods);
  }
  function onChangeOne(checked, cname, value) {
    const newCodeMods = cloneDeep(codeMods);
    const cIndex = codeMods.findIndex(({ name }) => name === cname);
    const tIndex = codeMods[cIndex].transforms.findIndex(({ filePath }) => filePath === value);
    newCodeMods[cIndex].transforms = cloneDeep(newCodeMods[cIndex].transforms);
    newCodeMods[cIndex].transforms[tIndex].checked = checked;
    setCodeMods(newCodeMods);
  }

  return (
    <div>
      <Tab shape="pure">
        {
          codeMods.map((codeMod) => {
            const { name: cname, transforms = [] } = codeMod;
            const hasChecked = transforms.findIndex(({ checked }) => checked === true) > -1;
            return (
              <Tab.Item
                title={
                  <div>
                    {hasChecked && <Icon type="success-filling" />}
                    {cname}
                  </div>
                }
                key={cname}
              >
                <CodeMod codeMod={codeMod} onChangeAll={onChangeAll} onChangeOne={onChangeOne} />
              </Tab.Item>
            );
          })
        }
      </Tab>
    </div>
  );
};

export default CodeMods;
