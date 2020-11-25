import React from 'react';
import { Switch } from '@alifd/next';

const SwitchComponent = ({ checked, onChange }) => (
  <Switch checked={checked} onChange={onChange} />
);

export default SwitchComponent;
