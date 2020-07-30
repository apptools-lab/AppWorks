/**
 * 用于渲染编排模块
 */
import React from 'react';
import Designer from '@ali/iceluna-designer';
import components from './config/components';
import utils from './config/utils';
import pkg from '../../../package.json';
import './index.module.scss';

window.__pkg = pkg;

const appHelper = window.parent && window.parent.__ctx && window.parent.__ctx.appHelper;

export default function () {
  return <Designer
    components={components}
    utils={utils}
    appHelper={appHelper}
    shortCuts={appHelper && appHelper.ideConfig && appHelper.ideConfig.shortCuts || []}
  />;
}