import React, { useState } from 'react';
import { Checkbox } from '@alifd/next';
import { WidgetProps } from '@rjsf/core';
import ChangeProvider from './ChangeProvider';

const Fdcheckbox: React.FC<WidgetProps> = (props) => {
  const { label, value, schema, onChange } = props;
  const [checkedValue, setCheckedValue] = useState(value);

  const check = (checked) => {
    onChange(checked);
    setCheckedValue(checked);
  };

  return <Checkbox onChange={(checked) => check(checked)}>{schema.description}</Checkbox>;
};
export default Fdcheckbox;
