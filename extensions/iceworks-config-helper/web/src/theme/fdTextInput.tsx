import React, { useState, useEffect } from 'react';
import { Input } from '@alifd/next';
import './styles.css';
import { WidgetProps } from '@rjsf/core';

const FdTextWeight: React.FC<WidgetProps> = (props) => {
  const { onChange, value } = props;
  const [errFlag, setErrFlag] = useState(false);
  const [inputStyle, setInputStyle] = useState({
    background: '#3c3c3c',
    borderColor: 'transparent',
    borderWidth: '1px',
  });
  const [inputValue, setInputValue] = useState(value);
  const onfocus = () => {
    setInputStyle({
      background: '#3c3c3c',
      borderColor: '#167dd8',
      borderWidth: '1px',
    });
  };
  const onblur = () => {
    setInputStyle({
      background: '#3c3c3c',
      borderColor: 'transparent',
      borderWidth: '1px',
    });
  };
  const inputChange = (inputStringValue) => {
    if (inputStringValue.match(/^[0-9]*$/)) {
      setErrFlag(true);
    }
    onChange(inputStringValue);
    setInputValue(inputStringValue);
  };

  useEffect(() => {
    inputChange(value);
  }, [value]);

  return (
    <Input
      value={inputValue}
      state={errFlag ? undefined : 'error'}
      onChange={inputChange}
      style={inputStyle}
      onFocus={onfocus}
      onBlur={onblur}
    />
  );
};
export default FdTextWeight;
