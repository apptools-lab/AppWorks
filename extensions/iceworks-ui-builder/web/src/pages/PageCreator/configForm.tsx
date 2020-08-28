/* eslint-disable no-param-reassign */
import React, { useState, useRef, useEffect } from 'react';
import { SchemaForm, Submit, Reset } from '@formily/next';
import { FormattedMessage, useIntl } from 'react-intl';
import * as nextComponents from '@formily/next-components';
// import { Input, Checkbox, Select, NumberPicker, setup } from '@formily/next-components'; // 或者@formily/next-components'
import { Button, Notification, Loading } from '@alifd/next';
import forIn from 'lodash.forin';
import RouterDetailForm from '@/components/RouterDetailForm';
import styles from './index.module.scss';
import callService from '../../callService';

nextComponents.setup();

export default ({
  templateName,
  templateSchema,
  originResetData,
  setCurrentStep,
  currentStep,
  isCreating,
  setIsCreating,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const formilySchema = useRef({ title: undefined, description: undefined });
  const [visible, setVisible] = useState(false);
  const [routerConfig, setRouterConfig] = useState([]);
  const [isConfigurableRouter, setIsConfigurableRouter] = useState(true);
  const [templateData, setTemplateData] = useState({});
  const [components, setComponents] = useState({});

  console.log('templateName', templateName);
  useEffect(() => {
    const tmpComponents = {};
    forIn(nextComponents, (value, key) => {
      if (key !== 'setup') {
        tmpComponents[key] = value;
      }
    });
    setComponents(tmpComponents);
    setLoading(false);
  }, []);

  function getDefaultFromType(type) {
    console.log('type', type);
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
      const isRouteConfigPathExists = await callService('page', 'checkRouteConfigPathExists');
      setIsConfigurableRouter(isRouteConfigPathExists);
      if (isRouteConfigPathExists) {
        // configurable router
        const config = await callService('page', 'getAll');
        setRouterConfig(config);
      }
      setTemplateData(getTemplateData(setting));
      setVisible(true);
    } catch (err) {
      console.log(err);
    }
  }

  async function createPage(values) {
    try {
      setIsCreating(true);
      console.log('templateData', templateData);
      await callService('page', 'createPage', [
        {
          templateName,
          name: values.pageName,
          templateData,
        },
      ]);

      if (isConfigurableRouter) {
        await callService('page', 'createRouter', values);
      }
      Notification.success({
        content: intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.createPageSuccess' }),
      });
    } catch (e) {
      Notification.error({ content: e.message });
    } finally {
      setIsCreating(false);
      setVisible(false);
      resetData();
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
            {formilySchema.current.title ||
              intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.defaultTitle' })}
          </h3>
          <p>
            {formilySchema.current.description ||
              intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.defaultDescription' })}
          </p>
          <SchemaForm
            components={components}
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
