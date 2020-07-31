import React from 'react';
import { FieldProps } from '@rjsf/core';

const styles = {
  root: [
    {
      fontSize: 24,
      marginBottom: 20,
      paddingBottom: 0,
    },
  ],
};

const DescriptionField = ({ title }: FieldProps) => (
  <>
    <p style={{ color: 'white' }}>{title}</p>
  </>
);

export default DescriptionField;
