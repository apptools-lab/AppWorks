import React, { useState } from 'react';
import { Notification, Button, Input } from '@alifd/next';
import Material from '@iceworks/material-ui';
import { LocaleProvider } from '@/i18n';
import { useIntl, FormattedMessage } from 'react-intl';
import callService from '../../callService';
import styles from './index.module.scss';
import ConfigForm from './configForm';

const Home = () => {
  const intl = useIntl();
  const [selectedPage, setSelectedPage] = useState();
  const [pageName, setPageName] = useState('T');
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [schema, setSchema] = useState({});
  const pages = [
    <>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage id="web.iceworksUIBuilder.pageCreator.inputPageName" />
          </div>
          <div className={styles.field}>
            <Input
              placeholder={intl.formatMessage({
                id: 'web.iceworksUIBuilder.inputComponentNamePlaceHolder',
              })}
              className={styles.pageNameInput}
              value={pageName}
              onChange={(value) => setPageName(value)}
              disabled={isCreating}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage id="web.iceworksUIBuilder.pageCreator.selectPage" />
          </div>
          <div className={styles.select}>
            <Material
              disableLazyLoad
              getSources={getSources}
              onSettingsClick={onSettingsClick}
              getData={getData}
              onPageClick={onSelect}
              selectedPages={selectedPage ? [selectedPage] : []}
              dataWhiteList={['pages']}
            />
          </div>
        </div>
      </div>
      <div className={styles.opts}>
        <Button type="primary" loading={isCreating} onClick={getConfigPage}>
          <FormattedMessage id="web.iceworksUIBuilder.pageCreator.next" />
        </Button>
      </div>
    </>,
    <ConfigForm
      templateSchema={schema}
      pageName={pageName}
      resetData={resetData}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />,
  ];

  function resetData() {
    setSelectedPage(undefined);
    setPageName('');
  }

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
      Notification.error({
        content: intl.formatMessage({ id: 'web.iceworksUIBuilder.getMaterialError' }),
      });
    }

    console.log('getSources', sources);
    return sources;
  }

  async function getData(source: string) {
    let data = {};
    try {
      data = await callService('material', 'getData', source);
    } catch (e) {
      Notification.error({
        content: intl.formatMessage({ id: 'web.iceworksUIBuilder.getDataError' }),
      });
    }
    console.log('getData', data);
    return data;
  }

  function validateData({ page, templateName }) {
    if (!templateName) {
      return intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.noPageName' });
    }
    if (!page) {
      return intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.didNotSeletPage' });
    }
    return '';
  }

  function onSelect(page) {
    setSelectedPage(page);
  }

  async function getConfigPage() {
    setIsCreating(true);
    try {
      const data = {
        page: selectedPage,
        templateName: pageName,
      };

      const errorMessage = validateData(data);
      if (errorMessage) {
        Notification.error({ content: errorMessage });
        setIsCreating(false);
        return;
      }

      const templateConfig = await callService('template', 'getTemplateSchema', [
        {
          // @ts-ignore
          ...selectedPage,
          name: pageName,
        },
      ]);
      setSchema(templateConfig.schema);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      Notification.error({ content: error.message });
      setIsCreating(false);
      throw error;
    }
  }

  return <div className={styles.wrap}>{pages[currentStep]}</div>;
};

const IntlHome = () => {
  return (
    <LocaleProvider>
      <Home />
    </LocaleProvider>
  );
};

export default IntlHome;
