import React, { useState } from 'react';
import { Grid, Notification, Button } from '@alifd/next';
import { arrayMove } from 'react-sortable-hoc';
import Material from '@iceworks/material-ui';
import { LocaleProvider } from '@/i18n';
import { useIntl, FormattedMessage } from 'react-intl';
import { IMaterialData } from '@iceworks/material-utils';
import RouterDetailForm from '@/components/RouterDetailForm';
import PageSelected from './components/PageSelected';
import callService from '../../callService';
import styles from './index.module.scss';

const { Row, Col } = Grid;

const Home = () => {
  const intl = useIntl();
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [routerConfig, setRouterConfig] = useState([]);
  const [isConfigurableRouter, setIsConfigurableRouter] = useState(true);

  async function getSources() {
    let sources = [];
    try {
      sources = await callService('material', 'getSourcesByProjectType');
    } catch (e) {
      Notification.error({
        content: intl.formatMessage({ id: 'web.iceworksUIBuilder.getMaterialError' }),
      });
    }

    console.log('getSources', sources);
    return sources;
  }

  async function getData(source: string) {
    let data = {} as IMaterialData;
    try {
      data = await callService('material', 'getData', source);
    } catch (e) {
      Notification.error({ content: intl.formatMessage({ id: 'web.iceworksUIBuilder.getDataError' }) });
    }
    console.log('getData', data);
    return data;
  }

  function validateData({ blocks }) {
    if (!blocks.length) {
      return intl.formatMessage({ id: 'web.iceworksUIBuilder.pageGenerater.enterPageName' });
    }
    return '';
  }

  async function onSettingsClick() {
    try {
      await callService('common', 'openMaterialsSettings');
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  function onAdd(block) {
    setSelectedBlocks([...selectedBlocks, block]);
  }

  function onDelete(targetIndex) {
    setSelectedBlocks(selectedBlocks.filter((_, index) => index !== targetIndex));
  }

  function onNameChange(name, targetIndex) {
    selectedBlocks[targetIndex].name = name;
    setSelectedBlocks([...selectedBlocks]);
  }

  function onSortStart() {
    setIsSorting(true);
  }

  function onSortEnd({ oldIndex, newIndex }) {
    setIsSorting(false);
    setSelectedBlocks([...arrayMove(selectedBlocks, oldIndex, newIndex)]);
  }

  function onClose() {
    setVisible(false);
  }

  function resetData() {
    setSelectedBlocks([]);
    setRouterConfig([]);
  }

  async function handleCreate() {
    const errorMessage = validateData({ blocks: selectedBlocks });
    if (errorMessage) {
      Notification.error({ content: errorMessage });
      return;
    }

    try {
      const isRouteConfigPathExists = await callService('router', 'checkConfigPathExists');
      setIsConfigurableRouter(isRouteConfigPathExists);
      if (isRouteConfigPathExists) {
        // configurable router
        const config = await callService('router', 'getAll');
        setRouterConfig(config);
      }

      setVisible(true);
    } catch (e) {
      // ignore
    }
  }

  async function handleSubmit(values) {
    setIsCreating(true);
    let pageIndexPath = '';
    try {
      pageIndexPath = await callService('page', 'generate', {
        blocks: selectedBlocks,
        pageName: values.pageName,
      });
      try {
        if (isConfigurableRouter) {
          await callService('router', 'create', values);
          const layout = routerConfig.find((item) => item.path === values.parent);
          const layoutName = layout.component;
          await callService('menu', 'createMenu', {
            ...values,
            path: isConfigurableRouter ? values.path : `/${values.pageName}`,
            layoutName,
          });
        }
      } catch (e) {
        Notification.error({ content: e.message });
      }
    } catch (error) {
      Notification.error({ content: error.message });
      setIsCreating(false);
      throw error;
    }

    setIsCreating(false);
    setVisible(false);
    resetData();

    const openFileAction = intl.formatMessage({ id: 'web.iceworksUIBuilder.pageGenerater.openFile' });
    const selectedAction = await callService(
      'common',
      'showInformationMessage',
      intl.formatMessage(
        { id: 'web.iceworksUIBuilder.pageGenerater.successCreatePageToPath' },
        { path: pageIndexPath },
      ),
      openFileAction,
    );
    if (selectedAction === openFileAction) {
      await callService('common', 'showTextDocument', pageIndexPath);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>
        <FormattedMessage id="web.iceworksUIBuilder.pageGenerater.chooseBlock" />
      </div>
      <div className={styles.field}>
        <Row gutter={24} className={styles.row}>
          <Col span={16} className={styles.col}>
            <PageSelected
              useDragHandle
              lockAxis="y"
              helperClass={styles.blockIsDraging}
              blocks={selectedBlocks}
              onDelete={onDelete}
              onNameChange={onNameChange}
              onSortStart={onSortStart}
              onSortEnd={onSortEnd}
              isSorting={isSorting}
            />
          </Col>
          <Col span={8} className={styles.col}>
            <div className={styles.material}>
              <Material
                disableLazyLoad
                getSources={getSources}
                onSettingsClick={onSettingsClick}
                getData={getData}
                onBlockClick={onAdd}
                dataWhiteList={['blocks']}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.opts}>
        <Button type="primary" size="medium" onClick={handleCreate}>
          <FormattedMessage id="web.iceworksUIBuilder.pageGenerater.createPage" />
        </Button>
      </div>
      <RouterDetailForm
        visible={visible}
        isCreating={isCreating}
        routerConfig={routerConfig}
        isConfigurableRouter={isConfigurableRouter}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
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
