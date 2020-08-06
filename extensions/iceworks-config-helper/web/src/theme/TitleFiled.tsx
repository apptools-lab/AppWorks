import React from 'react';
import { FieldProps } from '@rjsf/core';

const TitleField = ({ title }: FieldProps) => (
  <h3>
    <b>{title}</b>
  </h3>
);

export default TitleField;
