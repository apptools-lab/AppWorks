import React, { useState } from 'react';
import { Grid, Notification, Button } from '@alifd/next';
import { arrayMove } from 'react-sortable-hoc';
import Material from '@iceworks/material-ui';
import { LocaleProvider } from '@/i18n';
import { useIntl, FormattedMessage } from 'react-intl';
import { IMaterialData } from '@iceworks/material-utils';
import RouterDetailForm from '@/components/RouterDetailForm';
import { IRouter } from '@/types';
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
  const [routerConfig, setRouterConfig] = useState<IRouter[]>([]);
  const [isConfigurableRouter, setIsConfigurableRouter] = useState(true);

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
    let data = {} as IMaterialData;
    try {
      data = await callService('material', 'getData', source);
    } catch (e) {
      Notification.error({ content: intl.formatMessage({ id: 'web.iceworksMaterialHelper.getDataError' }) });
    }
    console.log('getData', data);
    return data;
  }

  function validateData({ blocks }) {
    if (!blocks.length) {
      return intl.formatMessage({ id: 'web.iceworksMaterialHelper.pageGenerater.selectBlocks' });
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

  function generateBlockName(defineName: string): Promise<string> {
    function generateName(setName, count = 0) {
      const newName = !count ? setName : `${setName}${count}`;
      const isConflict = selectedBlocks.some(({ name }) => name === newName);
      if (isConflict) {
        return generateName(setName, count + 1);
      }
      return newName;
    }
    return generateName(defineName);
  }

  function onAdd(block) {
    block.name = generateBlockName(block.name);
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
      const projectType = await callService('project', 'getProjectType');
      const isRouteConfigPathExists = await callService('router', 'checkConfigPathExists');
      setIsConfigurableRouter(isRouteConfigPathExists);

      if (projectType === 'react' && isRouteConfigPathExists) {
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
    const { menuType, parent } = values;
    let pageIndexPath = '';
    try {
      const result = await callService('page', 'generate', {
        blocks: selectedBlocks,
        pageName: values.pageName,
      });

      pageIndexPath = result.pageIndexPath;
      const { pageName } = result;

      const projectType = await callService('project', 'getProjectType');

      try {
        if (isConfigurableRouter) {
          await callService('router', 'create', { ...values, pageName });

          // add route path to menuConfig
          if (projectType === 'react') {
            const layout = routerConfig.find((item) => item.path === parent);
            if (layout) {
              const layoutName = layout.component;
              if (menuType) {
                await callService('menu', 'create', {
                  ...values,
                  pageName,
                  layoutName,
                  menuType,
                });
              }
            }
          }
        }
      } catch (error) {
        Notification.error({ content: error.message });
      }
    } catch (error) {
      Notification.error({ content: error.message });
      setIsCreating(false);
      throw error;
    }

    setIsCreating(false);
    setVisible(false);
    resetData();
    const openFileAction = intl.formatMessage({ id: 'web.iceworksMaterialHelper.pageGenerater.openFile' });
    const selectedAction = await callService(
      'common',
      'showInformationMessage',
      intl.formatMessage(
        { id: 'web.iceworksMaterialHelper.pageGenerater.successCreatePageToPath' },
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
        <FormattedMessage id="web.iceworksMaterialHelper.pageGenerater.chooseBlock" />
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
                refreshSources={refreshSources}
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
          <FormattedMessage id="web.iceworksMaterialHelper.pageGenerater.createPage" />
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
