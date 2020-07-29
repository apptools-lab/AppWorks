import React from 'react';
import { ObjectFieldTemplateProps } from '@rjsf/core';
import ChangeProvider from './ChangeProvider';
import EditInFile from './EditInFile';

const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  uiSchema,
  idSchema,
}: ObjectFieldTemplateProps) => {
  return (
    <div style = {{marginLeft:'6px'}}>
      {(uiSchema['ui:title'] || title) && (
        <h3>{title}</h3>
      )}
      {description && (
        <p className='fddescription'>
          {description}
        </p>
      )}

      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          {properties.map((element: any) => element.content)}
        </div>
      </div>
    </div>

  );
};

export default ObjectFieldTemplate;