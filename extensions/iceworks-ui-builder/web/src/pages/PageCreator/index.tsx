import React, { useState } from 'react';
import { Notification, Button, Input } from '@alifd/next';
import Material from '@iceworks/material-ui';
import { LocaleProvider } from '@/i18n';
import { useIntl, FormattedMessage } from 'react-intl';
import callService from '../../callService';
import styles from './index.module.scss';
import ConfigForm from './configForm';
import '@alifd/theme-iceworks-dark/dist/next.css';

const Home = () => {
  const intl = useIntl();
  const [selectedPage, setSelectedPage] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [schema, setSchema] = useState({});
  const pages = [
    <>
      <div className={styles.list}>
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
        <Button type="primary" loading={downloading} onClick={getConfigPage}>
          <FormattedMessage id="web.iceworksUIBuilder.pageCreator.next" />
        </Button>
      </div>
    </>,
    <ConfigForm
      templateSchema={schema}
      originResetData={resetData}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      isCreating={isCreating}
      setIsCreating={setIsCreating}
      selectedPage={selectedPage}
    />,
  ];

  function resetData() {
    setSelectedPage(undefined);
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

  function onSelect(page) {
    console.log(page);
    setSelectedPage(page);
  }

  async function getConfigPage() {
    setDownloading(true);
    try {
      const data = {
        page: selectedPage,
      };

      if (data.page.length < 1) {
        throw new Error(intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.didNotSeletPage' }));
      }
      const templateConfig = await callService('page', 'getTemplateSchema', selectedPage);
      setSchema(templateConfig.schema);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      Notification.error({ content: error.message });
    }
    setDownloading(false);
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
