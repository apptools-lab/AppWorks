import React, { useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { Select } from '@alifd/next';

const SelectWidget = ({
  schema,
  id,
  options,
  label,
  required,
  disabled,
  readonly,
  value,
  multiple,
  autofocus,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  
  const fdonChange = (e)=>{
    onChange(e);
  }
  const fdonBlur = (e: any) => onBlur(id, e.target.value);
  
  const fdonFocus = (e: any) => onFocus(id, e.target.value);
   
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