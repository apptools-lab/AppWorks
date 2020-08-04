import React from 'react';
import { vscode } from '@/pages/JSONForm/index';
import { DefaultSchema } from '@/utils';

const EditInFile = ({ name }) => {
  // 设定默认值并发送给插件和合并器 utils.tsx
  const sendDefaultValue = () => {
    const message = {};
    message[name] = DefaultSchema[name];
    vscode.postMessage({ JsonIncrementalUpdate: message, command: 'iceworks-config-helper:editInBuild.json' });
  };
  // console.log(idSchema);
  return <a onClick={sendDefaultValue}>Edit in build.json</a>;
};
export default EditInFile;
