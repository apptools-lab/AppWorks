import React from 'react';
import { vscode } from '@/pages/JSONForm/index';
import { DefaultSchema, getFormDidNotEditValue } from '@/utils';

const EditInFile = ({ name }) => {
  // 设定默认值并发送给插件和合并器 utils.tsx
  const sendDefaultValue = () => {
    // console.log(DefaultSchema);
    vscode.postMessage({ buildJson: { name, value: DefaultSchema[name] } });
    getFormDidNotEditValue()[name] = DefaultSchema[name];
  };
  // console.log(idSchema);
  return <a onClick={sendDefaultValue}>Edit in build.json</a>;
};
export default EditInFile;
