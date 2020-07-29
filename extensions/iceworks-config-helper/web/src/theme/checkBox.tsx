import React, { useState } from 'react';
import { Checkbox } from '@alifd/next'
import { WidgetProps } from '@rjsf/core';
import ChangeProvider from './ChangeProvider';


const Fdcheckbox: React.FC<WidgetProps>= (props)=>{
  const {
    label,
    value,
    schema,
    onChange,
  } = props;
  const [checkedValue,setCheckedValue]= useState(value);

  const check = (checked)=>{
    onChange(checked);
    setCheckedValue(checked);
  }

  return (
    <ChangeProvider fdkey={label} value = {checkedValue}>
      <>
        <h3>{label}</h3>
        <Checkbox onChange={checked=>check(checked)}>{schema.description}</Checkbox>
      </>
    </ChangeProvider>
  )
}
export default Fdcheckbox;