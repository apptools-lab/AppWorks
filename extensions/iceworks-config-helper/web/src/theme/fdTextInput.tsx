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
    value
  } = props;
  const [inputStyle,setInputStyle] = useState({
    'background': '#3c3c3c',
    'borderColor': 'gray',
    'borderWidth': '1px'
  });
  const [inputValue,setInputValue] = useState(value);
  const onfocus=(e)=>{
    setInputStyle({
      'background': '#3c3c3c',
      'borderColor': 'royalblue',
      'borderWidth': '1px'
    })
  }
  const onblur=(e)=>{
    setInputStyle({
      'background': '#3c3c3c',
      'borderColor': 'gray',
      'borderWidth': '1px'
    })
  }
  const inputChange = (value)=>{
    onChange(value);
    setInputValue(value);
  }
  return (
    <ChangeProvider fdkey={label} value = {inputValue}>
      <>
        <h3 style={{ color: 'white' }}>{label}</h3>
        <p className='fddescription'>{schema.description}</p>
        <Input value={inputValue} onChange={value=>inputChange(value)} style={inputStyle} onFocus={onfocus} onBlur={onblur}/>
      </>
    </ChangeProvider>
  )
}
export default FdTextWeight;