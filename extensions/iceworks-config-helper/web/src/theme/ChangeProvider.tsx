/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@alifd/next';
import * as _ from 'lodash';
import { configHelperProvider } from '../pages/JsonForm/index';

const DEFUALT_ITEM_COLOR = '#1e1e1e';
const CHANGED_ITEM_COLOR = '#0d7c9f';
const DEFAULT_ITEM_MARGIN = '0 2px';
const CHANGED_ITEM_MARGIN = '10px 2px 0px 2px';
const WIDTH = '2px';

const ChangeProvider = ({ fieldKey, children }) => {
  const [siderStyle, setSiderStyle] = useState({
    backgroundColor: DEFUALT_ITEM_COLOR,
    width: WIDTH,
    margin: DEFAULT_ITEM_MARGIN,
  });
  const { jsonContent, defaultSchema } = useContext(configHelperProvider);
  useEffect(() => {
    const currentValue = jsonContent[fieldKey];
    const defaultValue = defaultSchema[fieldKey];
    setSiderStyle(
      // 侧边栏的颜色表示了这个属性是否被改动，这个改动是以默认值为基准的
      // 参考 https://code.visualstudio.com/docs/getstarted/settings
      _.isEqual(currentValue, defaultValue) ||
        _.isEqual(currentValue, {}) ||
        ((currentValue === '' || currentValue === false) && defaultValue === undefined) ||
        currentValue === undefined
        ? { backgroundColor: DEFUALT_ITEM_COLOR, width: WIDTH, margin: DEFAULT_ITEM_MARGIN }
        : { backgroundColor: CHANGED_ITEM_COLOR, width: WIDTH, margin: CHANGED_ITEM_MARGIN },
    );
  }, [jsonContent]);

  return (
    <Box direction="row">
      <div style={siderStyle} />
      <div>{React.Children.only(children)}</div>
    </Box>
  );
};
export default ChangeProvider;
