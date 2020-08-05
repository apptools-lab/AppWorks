import React from 'react';
import callService from '../callService';
import { changeProviderContent } from '../pages/JSONForm/index';

const EditInFile = ({ name }) => {
  // 设定默认值并发送给插件和合并器 utils.tsx
  const { defaultSchema } = React.useContext(changeProviderContent);
  const sendDefaultValue = () => {
    const message = {};
    message[name] = defaultSchema[name];
    callService('configService', 'editInJson', message);
  };
  return <a onClick={sendDefaultValue}>Edit in build.json</a>;
};
export default EditInFile;
