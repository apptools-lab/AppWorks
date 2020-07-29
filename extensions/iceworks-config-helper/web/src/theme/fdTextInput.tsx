import React, {useState} from 'react';
import { Input } from '@alifd/next'
import './styles.css';
import { WidgetProps } from '@rjsf/core';
import ChangeProvider from './ChangeProvider';

const FdTextWeight: React.FC<WidgetProps> = (props)=>{
  const {
    label,
    schema,
    onChange, 
    value,
  } = props;
  const [inputStyle,setInputStyle] = useState({
    'background': '#3c3c3c',
    'borderColor': 'transparent',
    'borderWidth': '1px'
  });
  const [inputValue,setInputValue] = useState(value);
  const onfocus=()=>{
    setInputStyle({
      'background': '#3c3c3c',
      'borderColor': '#167dd8',
      'borderWidth': '1px'
    })
  }
  const onblur=()=>{
    setInputStyle({
      'background': '#3c3c3c',
      'borderColor': 'transparent',
      'borderWidth': '1px'
    })
  }
  const inputChange = (inputStringValue)=>{
    onChange(inputStringValue);
    setInputValue(inputStringValue);
  }
  return (
    <ChangeProvider fdkey={label} value = {inputValue}>
      <>
        <h3 style={{ color: 'white' }}>{label}</h3>
        <p className='fddescription'>{schema.description}</p>
        <Input value={inputValue} onChange={inputChange} style={inputStyle} onFocus={onfocus} onBlur={onblur}/>
      </>
    </ChangeProvider>
  )
}
export default FdTextWeight;