import React from 'react';
import { Notification } from '@alifd/next';
import callService from '@/callService';
import Material from '@iceworks/material-ui';
import { IMaterialData, IMaterialBlock, IMaterialComponent, IMaterialBase } from '@iceworks/material-utils';
import {useIntl} from 'react-intl';
import styles from './index.module.scss';
import { LocaleProvider } from '../../i18n';

const MaterialsPane: React.FC<any> = () => {
  const intl = useIntl();
  async function onSettingsClick() {
    try {
      await callService('common', 'executeCommand', 'iceworksApp.configHelper.start');
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  async function getSources() {
    let sources = [];
    try {
      sources = await callService('material', 'getSourcesByProjectType');
    } catch (e) {
      Notification.error({ content: intl.formatMessage({id: 'web.iceworksMaterialHelper.extension.getMaterialError'}) });
    }
    console.log('getSources', sources);
    return sources;
  }

  async function getData(source: string): Promise<IMaterialData> {
    let data = {};
    try {
      data = await callService('material', 'getData', source);
    } catch (e) {
      Notification.error({ content: intl.formatMessage({id: 'web.iceworksMaterialHelper.extension.getDataError'}) });
    }
    console.log('getData', data);
    return data as IMaterialData;
  }

  const onComponentClick = async (component: IMaterialComponent) => {
    try {
      await callService('component', 'addBizCode', component);
    } catch (e) {
      Notification.error({ content: e.message })
    }
  }

  const onBlockClick = async (block: IMaterialBlock) => {
    try {
      await callService('block', 'addBlockCode', block);
    } catch (e) {
      Notification.error({ content: e.message })
    }
  }

  const onBaseClick = async (base: IMaterialBase) => {
    try {
      await callService('component', 'addBaseCode', base);
    } catch (e) {
      Notification.error({ content: e.message })
    }
  }
  return (
    <div className={styles.container}>
      <Material
        disableLazyLoad
        onSettingsClick={onSettingsClick}
        getSources={getSources}
        getData={getData}
        onBlockClick={onBlockClick}
        onBaseClick={onBaseClick}
        onComponentClick={onComponentClick}
        dataWhiteList={['bases', 'blocks', 'components']}
      />
    </div>
  )
}

export const IntlMaterialPane = ()=>{
  return (
    <LocaleProvider>
      <MaterialsPane/>
    </LocaleProvider>
  )
}

export default IntlMaterialPane;
