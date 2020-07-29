import React from 'react';
import { FieldProps } from '@rjsf/core';

const TitleField = ({ title }: FieldProps) => (
  <>
    <h3 style={{color: 'white'}}><b>{title}</b></h3>
  </>
);

export default TitleField;