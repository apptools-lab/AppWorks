import React, { useState, useEffect } from 'react';
import { Checkbox } from '@alifd/next';
import { WidgetProps } from '@rjsf/core';

const Fdcheckbox: React.FC<WidgetProps> = (props) => {
  const { value, schema, onChange } = props;
  const [checkedValue, setCheckedValue] = useState(value);

  const check = (checked) => {
    onChange(checked);
    setCheckedValue(checked);
  };

  useEffect(() => {
    check(value);
  }, [value]);

  return (
    <Checkbox checked={checkedValue} onChange={(checked) => check(checked)}>
      {schema.description}
    </Checkbox>
  );
};
export default Fdcheckbox;
