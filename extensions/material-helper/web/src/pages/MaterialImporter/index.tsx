import React, { useState, useEffect } from 'react';
import { Notification } from '@alifd/next';
import callService from '@/callService';
import Material from '@appworks/material-ui';
import { IMaterialData, IMaterialBlock, IMaterialComponent, IMaterialBase } from '@appworks/material-utils';
import { useIntl } from 'react-intl';
import styles from './index.module.scss';
import { LocaleProvider } from '../../i18n';

const Home = () => {
  const [projectComponentType, setProjectComponentType] = useState('');
  const intl = useIntl();

  async function onSettingsClick() {
    try {
      await callService('common', 'openMaterialsSettings');
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  async function getComponentTypeOptions() {
    try {
      const componentTypeOptions = await callService('material', 'getComponentTypeOptionsByProjectType');
      return componentTypeOptions;
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  async function getSources() {
    let sources = [];
    try {
      sources = await callService('material', 'getSourcesByProjectType');
    } catch (e) {
      Notification.error({
        content: intl.formatMessage({ id: 'web.iceworksMaterialHelper.extension.getMaterialError' }),
      });
    }
    return sources;
  }

  async function refreshSources() {
    await callService('material', 'cleanCache');
    return await getSources();
  }

  async function getData(source: string): Promise<IMaterialData> {
    let data = {};
    try {
      data = await callService('material', 'getData', source);
    } catch (e) {
      Notification.error({
        content: intl.formatMessage({ id: 'web.iceworksMaterialHelper.extension.getMaterialDataError' }),
      });
    }
    console.log('getData', data);
    return data as IMaterialData;
  }

  const onComponentClick = async (component: IMaterialComponent) => {
    try {
      await callService('component', 'addCode', component);
    } catch (e) {
      Notification.error({ content: e.message });
    }
  };

  const onBlockClick = async (block: IMaterialBlock) => {
    try {
      await callService('block', 'addBlockCode', block);
    } catch (e) {
      Notification.error({ content: e.message });
    }
  };

  const onBaseClick = async (base: IMaterialBase) => {
    try {
      await callService('component', 'addCode', base);
    } catch (e) {
      Notification.error({ content: e.message });
    }
  };

  useEffect(() => {
    callService('material', 'getProjectComponentType').then((res: string) => {
      setProjectComponentType(res);
    });
  }, []);
  return (
    <div className={styles.container}>
      <Material
        disableLazyLoad
        onSettingsClick={onSettingsClick}
        getSources={getSources}
        getComponentTypeOptions={getComponentTypeOptions}
        refreshSources={refreshSources}
        getData={getData}
        projectComponentType={projectComponentType}
        onBlockClick={onBlockClick}
        onBaseClick={onBaseClick}
        onComponentClick={onComponentClick}
        dataWhiteList={['bases', 'blocks', 'components']}
      />
    </div>
  );
};

export const IntlHome = () => {
  return (
    <LocaleProvider>
      <Home />
    </LocaleProvider>
  );
};

export default IntlHome;
