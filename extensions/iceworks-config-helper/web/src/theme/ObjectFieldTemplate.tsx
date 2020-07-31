import React from 'react';
import { ObjectFieldTemplateProps } from '@rjsf/core';

const ObjectFieldTemplate = ({ description, title, properties, uiSchema }: ObjectFieldTemplateProps) => {
  return <div style={{ marginLeft: '6px' }}>{properties.map((element) => element.content)}</div>;
};

export default ObjectFieldTemplate;
