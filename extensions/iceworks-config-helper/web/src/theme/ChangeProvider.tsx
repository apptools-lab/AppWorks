/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@alifd/next';
import { isEqual } from '../utils';
import { changeProviderContent } from '../pages/JSONForm/index';

const ChangeProvider = ({ fieldKey, children }) => {
  // const {defaultSchema, formCannotEditProps} = useContext(changeProviderContent);
  const [siderStyle, setSiderStyle] = useState({ backgroundColor: '#1e1e1e', width: '2px', margin: '0 2px' });
  const { syncJsonContentObjInWebView, defaultSchema } = useContext(changeProviderContent);
  useEffect(() => {
    const currentValue = syncJsonContentObjInWebView[fieldKey];
    const defaultValue = defaultSchema[fieldKey];
    setSiderStyle(
      isEqual(currentValue, defaultValue) ||
        isEqual(currentValue, {}) ||
        ((currentValue === '' || currentValue === false) && defaultValue === undefined) ||
        currentValue === undefined
        ? { backgroundColor: '#1e1e1e', width: '2px', margin: '0 2px' }
        : { backgroundColor: '#0d7c9f', width: '2px', margin: '10px 2px 0px 2px' }
    );
  }, [syncJsonContentObjInWebView]);

  return (
    <Box direction="row">
      <div style={siderStyle} />
      <div>{React.Children.only(children)}</div>
    </Box>
  );
};
export default ChangeProvider;
