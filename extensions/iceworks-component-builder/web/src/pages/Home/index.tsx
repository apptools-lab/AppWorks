import React, { useState, useEffect } from 'react';
import { Notification, Button, Input } from '@alifd/next';
import Material from '@iceworks/material-ui';
import { LocaleProvider } from '@/i18n';
import { useIntl, FormattedMessage } from 'react-intl';
import callService from '../../callService';
import styles from './index.module.scss';

const Home = () => {
  const intl = useIntl();
  const [selectedBlock, setSelectedBlock] = useState();
  const [componentName, setComponentName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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
      Notification.error({ content: intl.formatMessage({id:'web.ComponentBuiilder.Home.getMaterialError'})});
    }
  
    console.log('getSources', sources);
    return sources;
  }
  
  async function getData(source: string) {
    let data = {};
    try {
      data = await callService('material', 'getData', source);
    } catch (e) {
      Notification.error({ content: intl.formatMessage({id:'web.ComponentBuiilder.Home.getDataError'})});
    }
    console.log('getData', data);
    return data;
  }
  
  function validateData({ block, componentName }) {
    if (!componentName) {
      return intl.formatMessage({id:'web.ComponentBuiilder.Home.noComponentName'});
    }
    if (!block) {
      return intl.formatMessage({id:'web.ComponentBuiilder.Home.didNotSeletBlock'});
    }
    return '';
  }

  function onSelect(block) {
    setSelectedBlock(block);
  }

  function resetData() {
    setSelectedBlock(undefined);
    setComponentName('');
  }

  async function handleCreate(data) {
    setIsCreating(true);
    try {
      const data = {
        block: selectedBlock,
        componentName,
      };

      const errorMessage = validateData(data);
      if (errorMessage) {
        Notification.error({ content: errorMessage });
        setIsCreating(false);
        return;
      }

      await callService('block', 'bulkGenerate', [{
        ...selectedBlock,
        name: componentName
      }]);
    } catch (error) {
      Notification.error({ content: error.message });
      setIsCreating(false);
      throw error;
    }

    setIsCreating(false);
    Notification.success({ content: intl.formatMessage({id:'web.ComponentBuiilder.Home.generateSuccess'})});
    resetData();
  }
  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage id='web.ComponentBuiilder.Home.inputComponentName'/>
          </div>
          <div className={styles.field}>
            <Input
              placeholder={intl.formatMessage({id:'web.ComponentBuiilder.Home.getMaterialError'})}
              className={styles.pageNameInput}
              value={componentName}
              onChange={(value) => setComponentName(value)}
              disabled={isCreating}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage id='web.ComponentBuiilder.Home.selectBlock'/>
          </div>
          <div className={styles.select}>
            <Material
              disableLazyLoad
              getSources={getSources}
              onSettingsClick={onSettingsClick}
              getData={getData}
              onBlockClick={onSelect}
              selectedBlocks={selectedBlock ? [selectedBlock] : []}
              dataWhiteList={['blocks']}
            />
          </div>
        </div>
      </div>
      <div className={styles.opts}>
        <Button type="primary" loading={isCreating} onClick={handleCreate}>
          <FormattedMessage id='web.ComponentBuiilder.Home.generate'/>
        </Button>
      </div>
    </div>
  );
};

const IntlHome = ()=>{
  return (
    <LocaleProvider>
      <Home/>
    </LocaleProvider>
  )
}

export default IntlHome;
