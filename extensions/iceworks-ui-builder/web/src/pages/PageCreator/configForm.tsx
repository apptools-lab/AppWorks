/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { SchemaForm, Submit, Reset } from '@formily/next';
import { FormattedMessage, useIntl } from 'react-intl';
import * as nextComponents from '@formily/next-components';
import { Button, Notification, Loading } from '@alifd/next';
import forIn from 'lodash.forin';
import * as upperCamelCase from 'uppercamelcase';
import RouterDetailForm from '@/components/RouterDetailForm';
import styles from './index.module.scss';
import callService from '../../callService';

nextComponents.setup();

const tmpComponents = {};
forIn(nextComponents, (value, key) => {
  if (key !== 'setup') {
    tmpComponents[key] = value;
  }
});

export default ({
  templateSchema,
  originResetData,
  setCurrentStep,
  currentStep,
  isCreating,
  setIsCreating,
  selectedPage,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [routerConfig, setRouterConfig] = useState([]);
  const [isConfigurableRouter, setIsConfigurableRouter] = useState(true);
  const [templateData, setTemplateData] = useState({});

  useEffect(() => {
    setLoading(false);
  }, []);

  function getDefaultFromType(type) {
    // TODO: 丰富所有类型的默认值。
    switch (type) {
      case 'string':
        return '';
      case 'boolean':
        return false;
      case 'number':
        return 0;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return '';
    }
  }

  function getDefaultData() {
    const defaultSetting = {};
    forIn(templateSchema.properties, (prop, key) => {
      defaultSetting[key] = prop.default !== undefined ? prop.default : getDefaultFromType(prop.type);
    });
    return defaultSetting;
  }

  function getTemplateData(userConfig) {
    const templateData = getDefaultData();
    forIn(templateData, (val, key) => {
      templateData[key] = userConfig[key] !== undefined ? userConfig[key] : val;
    });
    return templateData;
  }

  async function getRouterForm(setting) {
    try {
      const isRouteConfigPathExists = await callService('router', 'checkConfigPathExists');
      setIsConfigurableRouter(isRouteConfigPathExists);
      if (isRouteConfigPathExists) {
        // configurable router
        const config = await callService('router', 'getAll');
        setRouterConfig(config);
      }
      setTemplateData(getTemplateData(setting));
      setVisible(true);
    } catch (err) {
      Notification.error({
        className: err.message,
      });
    }
  }

  async function createPage(values) {
    setIsCreating(true);
    let pageIndexPath = '';
    try {
      pageIndexPath = await callService('page', 'createPage', {
        ...selectedPage,
        pageName: values.pageName,
        templateData,
      });

      if (isConfigurableRouter) {
        try {
          await callService('router', 'create', { ...values, pageName: upperCamelCase(values.pageName) });
        } catch (error) {
          Notification.error({ content: error.message });
        }
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
        {
          id: pageIndexPath
            ? 'web.iceworksUIBuilder.pageGenerater.successCreatePageToPath'
            : 'web.iceworksUIBuilder.pageGenerater.successCreatePage',
        },
        { path: pageIndexPath }
      ),
      pageIndexPath ? openFileAction : []
    );
    if (selectedAction === openFileAction) {
      await callService('common', 'showTextDocument', pageIndexPath);
    }
  }

  function resetData() {
    originResetData();
    setRouterConfig([]);
  }
  function onClose() {
    setVisible(false);
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
          <>
            <h3>
              {templateSchema.title || intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.defaultTitle' })}
            </h3>
            <p>
              {templateSchema.description ||
                intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.defaultDescription' })}
            </p>
            <SchemaForm
              components={tmpComponents}
              schema={templateSchema}
              onSubmit={(setting) => {
                getRouterForm(setting);
              }}
            >
              <div className={styles.opts}>
                <Reset type="primary" className={styles.btn}>
                  <FormattedMessage id="web.iceworksUIBuilder.pageCreator.reset" />
                </Reset>
                <Button
                  type="primary"
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                  className={styles.btn}
                >
                  <FormattedMessage id="web.iceworksUIBuilder.pageCreator.previous" />
                </Button>
                <Submit type="primary" className={styles.btn}>
                  <FormattedMessage id="web.iceworksUIBuilder.pageCreator.createPage" />
                </Submit>
              </div>
              <RouterDetailForm
                visible={visible}
                isCreating={isCreating}
                routerConfig={routerConfig}
                isConfigurableRouter={isConfigurableRouter}
                onSubmit={createPage}
                onClose={onClose}
              />
            </SchemaForm>
          </>
        )}
    </>
  );
};
