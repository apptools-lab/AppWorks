/* eslint-disable */
/**
 * 用于渲染编辑器
 */
import React from 'react';
import ideConfig from './config/skeleton';
import components from './config/components';
import utils from './config/utils';
import messages from './config/locale';
import pkg from '../../../package.json';
import './index.module.scss';
import './config/theme.scss';

const Skeleton = components.LunaSkeleton;

window.__pkg = pkg;

export default function (props) {
  return <Skeleton {...props} ideConfig={ideConfig} components={components} utils={utils} messages={messages} />;
}
