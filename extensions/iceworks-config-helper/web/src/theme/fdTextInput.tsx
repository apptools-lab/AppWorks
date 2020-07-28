import React from 'react';
import { Input } from '@alifd/next'

const fdTextWeight = (props)=>{
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
      <Input onChange={value=>onChange(value)}/>
    </>
  )
}
export default fdTextWeight;