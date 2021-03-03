import React from 'react';
import { Switch } from '@alifd/next';

const SwitchComponent = ({ checked, onChange, size }) => (
  <Switch checked={checked} onChange={onChange} size={size || 'medium'} />
);

export default SwitchComponent;
