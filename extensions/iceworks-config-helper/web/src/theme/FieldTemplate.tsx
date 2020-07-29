import React from 'react';
import { FieldTemplateProps } from '@rjsf/core';
import { List } from '@alifd/next';
import ChangeProvider from './ChangeProvider';

const FieldTemplate = ({
  id,
  children,
  rawErrors = [],
  rawHelp,
  label,
}: FieldTemplateProps) => {
  return (
    <ChangeProvider key={label}>
      <div style={{marginBottom: 15,color: 'white'}}>
        {/* <h3>{label}</h3> */}
        {children}
        {/* {displayLabel && <Label>
            {label}
            {required && <span style={{color: "rgb(164, 38, 44)", fontSize: "12px", fontWeight: "normal"}}>*</span>}
        </Label>} */}

        {rawErrors.length > 0 && <List>
          {rawErrors.map(e=><List.Item>{e}</List.Item>)}
        </List>}
        {rawHelp && <p id={id}>{rawHelp}</p>}
      </div>
    </ChangeProvider>
  );
};
  
export default FieldTemplate;
  