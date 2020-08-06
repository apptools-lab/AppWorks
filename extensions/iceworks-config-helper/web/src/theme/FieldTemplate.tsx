import React, { useState } from 'react';
import { FieldTemplateProps } from '@rjsf/core';
import { List } from '@alifd/next';
import ChangeProvider from './ChangeProvider';

const INPUT_STYLE = { marginBottom: 15, color: 'white' };
const FieldTemplate = ({
  id,
  children,
  rawErrors = [],
  rawHelp,
  label,
  rawDescription,
  schema,
}: FieldTemplateProps) => {
  return (
    <ChangeProvider fieldKey={label}>
      <div style={INPUT_STYLE}>
        <h3>{label}</h3>

        {schema.type === 'boolean' ? null : <p className="fddescription">{rawDescription}</p>}
        {children}
        {rawErrors.length > 0 && (
          <List>
            {rawErrors.map((e) => (
              <List.Item>{e}</List.Item>
            ))}
          </List>
        )}
        {rawHelp && <p id={id}>{rawHelp}</p>}
      </div>
    </ChangeProvider>
  );
};

export default FieldTemplate;
