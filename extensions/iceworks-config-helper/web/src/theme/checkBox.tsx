import React from 'react';
import { Checkbox } from '@alifd/next'

const fdcheckbox= (props)=>{
  const {
    id,
    value,
    // required,
    disabled,
    readonly,
    label,
    schema,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    options,
  } = props;
  return (
    <>
      <h3 style={{color:'white'}}>{label}</h3>
      <Checkbox onChange={checked=>onChange(checked)}>{schema.description}</Checkbox>
    </>
  )
}
export default fdcheckbox;
