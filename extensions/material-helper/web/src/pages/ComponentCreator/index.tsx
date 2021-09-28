import React, { useState, useEffect } from 'react';
import { Notification, Button, Input } from '@alifd/next';
import Material from '@appworks/material-ui';
import { LocaleProvider } from '@/i18n';
import { useIntl, FormattedMessage } from 'react-intl';
import callService from '../../callService';
import styles from './index.module.scss';

const Home = () => {
  const intl = useIntl();
  const [selectedBlock, setSelectedBlock] = useState({});
  const [componentName, setComponentName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [projectComponentType, setProjectComponentType] = useState('');

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
        content: intl.formatMessage({ id: 'web.iceworksMaterialHelper.getMaterialError' }),
      });
    }
    return sources;
  }

  async function refreshSources() {
    await callService('material', 'cleanCache');
    return await getSources();
  }

  async function getData(source: string) {
    let data = {};
    try {
      data = await callService('material', 'getData', source);
    } catch (e) {
      Notification.error({
        content: intl.formatMessage({ id: 'web.iceworksMaterialHelper.getDataError' }),
      });
    }
    console.log('getData', data);
    return data;
  }

  function validateData({ block, componentName: name }) {
    if (!name) {
      return intl.formatMessage({ id: 'web.iceworksMaterialHelper.componentCreator.noComponentName' });
    }
    if (!block) {
      return intl.formatMessage({ id: 'web.iceworksMaterialHelper.componentCreator.didNotSeletBlock' });
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

  async function handleCreate() {
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

    setIsCreating(true);
    let blockIndexPath = '';
    try {
      const distPaths = await callService('block', 'bulkGenerate', [
        {
          ...selectedBlock,
          name: componentName,
        },
      ]);
      blockIndexPath = distPaths[0];
    } catch (error) {
      Notification.error({ content: error.message });
      setIsCreating(false);
      throw error;
    }

    setIsCreating(false);
    resetData();

    const openFileAction = intl.formatMessage({ id: 'web.iceworksMaterialHelper.componentCreator.openFile' });
    const selectedAction = await callService(
      'common',
      'showInformationMessage',
      intl.formatMessage(
        { id: 'web.iceworksMaterialHelper.componentCreator.successCreateToPath' },
        { path: blockIndexPath },
      ),
      openFileAction,
    );
    if (selectedAction === openFileAction) {
      await callService('common', 'showTextDocument', blockIndexPath);
    }
  }

  useEffect(() => {
    callService('material', 'getProjectComponentType').then((res: string) => {
      setProjectComponentType(res);
    });
  }, []);
  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage id="web.iceworksMaterialHelper.componentCreator.inputComponentName" />
          </div>
          <div className={styles.field}>
            <Input
              placeholder={intl.formatMessage({
                id: 'web.iceworksMaterialHelper.inputComponentNamePlaceHolder',
              })}
              className={styles.pageNameInput}
              value={componentName}
              onChange={(value) => setComponentName(value)}
              disabled={isCreating}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage id="web.iceworksMaterialHelper.componentCreator.selectBlock" />
          </div>
          <div className={styles.select}>
            <Material
              disableLazyLoad
              getSources={getSources}
              refreshSources={refreshSources}
              onSettingsClick={onSettingsClick}
              getData={getData}
              onBlockClick={onSelect}
              getComponentTypeOptions={getComponentTypeOptions}
              selectedBlocks={selectedBlock ? [selectedBlock] : []}
              dataWhiteList={['blocks']}
              projectComponentType={projectComponentType}
            />
          </div>
        </div>
      </div>
      <div className={styles.opts}>
        <Button type="primary" loading={isCreating} onClick={handleCreate}>
          <FormattedMessage id="web.iceworksMaterialHelper.componentCreator.generateComponent" />
        </Button>
      </div>
    </div>
  );
};

const IntlHome = () => {
  return (
    <LocaleProvider>
      <Home />
    </LocaleProvider>
  );
};

export default IntlHome;
