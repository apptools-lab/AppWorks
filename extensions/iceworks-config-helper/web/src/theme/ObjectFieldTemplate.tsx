import React from 'react';
import { ObjectFieldTemplateProps } from '@rjsf/core';

const OBJECT_FILED_STYLE = { marginLeft: '6px' };

const ObjectFieldTemplate = ({ properties }: ObjectFieldTemplateProps) => {
  return <div style={OBJECT_FILED_STYLE}>{properties.map((element) => element.content)}</div>;
};

export default ObjectFieldTemplate;
