import React, { useState } from 'react';
import { FieldTemplateProps } from '@rjsf/core';
import { List } from '@alifd/next';
import ChangeProvider from './ChangeProvider';

const FieldTemplate = ({
  id,
  children,
  rawErrors = [],
  rawHelp,
  label,
  rawDescription
}: FieldTemplateProps) => {


  return (
    <ChangeProvider fdkey={label}>
      <div style={{marginBottom: 15,color: 'white'}}>
        <h3>{label}</h3>
        <p className = 'fddescription'>{rawDescription}</p>
        {children}
        {rawErrors.length > 0 && <List>
          {rawErrors.map(e=><List.Item>{e}</List.Item>)}
        </List>}
        {rawHelp && <p id={id}>{rawHelp}</p>}
      </div>
    </ChangeProvider>
  );
};
  
export default FieldTemplate;
  