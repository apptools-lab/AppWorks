/**
 * 用于渲染编排模块的插件
 */
import React from 'react';
import Inner from '@ali/iceluna-components-inner';
import components from './components';
import './index.scss';

const appHelper = window.parent && window.parent.__ctx && window.parent.__ctx.appHelper;
export default function(){
  return <Inner appHelper={appHelper} components={components} />;
}