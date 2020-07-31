import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { Box } from '@alifd/next';
import { DefaultSchema, formdidNotEditAttrs, isEqual } from '../utils';

const ChangeProvider = ({ fieldKey, children }) => {
  const [value, setValue] = useState(DefaultSchema[fieldKey]);

  // console.log('key: ${fieldKey}, value: ${value}`);
  // 侧边栏样式控制
  const [siderStyle, setSiderStyle] = useState({ backgroundColor: '#1e1e1e', width: '2px', margin: '0 2px' });

  useEffect(() => {
    window.addEventListener('updateJSON', (e) => {
      if (e.data.currentConfig) setValue(e.data.currentConfig[fieldKey] || DefaultSchema[fieldKey]);
    });
    // console.log(fieldKey,value);
    setSiderStyle(
      isEqual(value, DefaultSchema[fieldKey]) ||
        (value === '' && DefaultSchema[fieldKey] === undefined) ||
        formdidNotEditAttrs.includes(fieldKey)
        ? { backgroundColor: '#1e1e1e', width: '2px', margin: '0 2px' }
        : { backgroundColor: '#0d7c9f', width: '2px', margin: '10px 2px 0px 2px' }
    );
  }, [fieldKey, value]);

  return (
    <Box direction="row">
      <div style={siderStyle} onClick={() => console.log(value)} />
      <div>{React.Children.only(children)}</div>
    </Box>
  );
};
export default ChangeProvider;
