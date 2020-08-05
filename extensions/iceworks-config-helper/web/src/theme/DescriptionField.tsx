import React from 'react';
import { FieldProps } from '@rjsf/core';

const DescriptionField = ({ title }: FieldProps) => (
  <>
    <p style={{ color: 'white' }}>{title}</p>
  </>
);

export default DescriptionField;
