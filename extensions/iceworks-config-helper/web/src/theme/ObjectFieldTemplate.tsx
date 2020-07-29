import React from 'react';
import { ObjectFieldTemplateProps } from '@rjsf/core';


const ObjectFieldTemplate = ({
  description,
  title,
  properties,
  uiSchema,
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
      {properties.map((element) => element.content)}
    </div>

  );
};

export default ObjectFieldTemplate;