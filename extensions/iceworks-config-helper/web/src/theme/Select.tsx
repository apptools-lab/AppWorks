import React from 'react';
import { Select } from '@alifd/next';

const fdDropDown = (props) => {
  const { label, options, multiple } = props;

  const { enumOptions, enumDisabled } = options;
  return (
    <>
      <h3 style={{ color: 'white' }}>{label}</h3>
      <h3 style={multiple}>{label}</h3>
      <Select>
        {enumOptions.map(({ value: optionValue, label: optionLabel }) => (
          <Select.Option value={optionValue}>{optionLabel}</Select.Option>
        ))}
      </Select>
    </>
  );
};
