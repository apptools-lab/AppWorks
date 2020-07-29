import React from 'react';
import { FieldProps } from '@rjsf/core';

const styles = {
  root: [
    {
      fontSize: 24,
      marginBottom: 20,
      paddingBottom: 0
    },
  ],
};

const TitleField = ({ title }: FieldProps) => (
  <>
    <h3 style={{color: 'white'}}><b>{title}</b></h3>
  </>
);

export default TitleField;