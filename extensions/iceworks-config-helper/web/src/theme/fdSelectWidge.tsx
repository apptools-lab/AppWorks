import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Select } from '@alifd/next';

const SelectWidget = ({
  id,
  options,
  disabled,
  readonly,
  value,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  
  const fdonChange = (e)=>{
    onChange(e);
  }
  const fdonBlur = (e) => onBlur(id, e.target.value);
  
  const fdonFocus = (e) => onFocus(id, e.target.value);
   
  return (
    <>
      <Select
        defaultValue={value}
        dataSource={options.enumOptions}
        disabled={disabled || readonly}
        onChange={fdonChange}
        onBlur={fdonBlur}
        onFocus={fdonFocus}
      />
    </>
  );
};
  
export default SelectWidget;