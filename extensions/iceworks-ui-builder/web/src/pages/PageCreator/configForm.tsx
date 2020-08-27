/* eslint-disable no-param-reassign */
import React, { useState, useRef, useEffect } from 'react';
import { SchemaForm, Submit, Reset } from '@formily/next';
import { FormattedMessage, useIntl } from 'react-intl';
import { Input, Checkbox, Select, NumberPicker } from '@formily/next-components'; // 或者@formily/next-components'
import { Button, Notification, Loading } from '@alifd/next';
import * as _ from 'lodash';
import styles from './index.module.scss';
import callService from '../../callService';

const components = {
  Input,
  Checkbox,
  Select,
  NumberPicker,
};

export default ({ templateSchema, pageName, resetData, setCurrentStep, currentStep }) => {
  const intl = useIntl();
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const formilySchema = useRef({});

  useEffect(
    function setFormilySchema() {
      try {
        const properties = templateSchema.properties;
        _.forIn(properties, (prop) => {
          const propType = prop.type || 'string';
          switch (propType) {
            case 'string':
              prop['x-component'] = 'input';
              break;
            case 'boolean':
              prop['x-component'] = 'CheckBox';
              break;
            case 'number':
              prop['x-component'] = 'NumberPicker';
              break;
            default:
              break;
          }
          if (prop.enum) {
            prop['x-component'] = 'Select';
          }
        });
        console.log('properties', properties);
      } catch (err) {
        console.log(err);
      }

      formilySchema.current = templateSchema;
      setLoading(false);
    },
    [templateSchema]
  );

  function getDefaultFromType(type) {
    console.log('type', type);
    switch (type) {
      case 'string':
        return '';
      case 'boolean':
        return false;
      case 'number':
        return 0;
      default:
        return '';
    }
  }

  function getDefaultData(schema) {
    const defaultSetting = {};
    _.forIn(schema.properties, (prop, key) => {
      defaultSetting[key] = prop.default !== undefined ? prop.default : getDefaultFromType(prop.type);
    });
    return defaultSetting;
  }

  function getTemplateData(schema, userConfig) {
    const templateData = getDefaultData(schema);
    _.forIn(templateData, (val, key) => {
      templateData[key] = userConfig[key] !== undefined ? userConfig[key] : val;
    });
    return templateData;
  }

  async function createPage(userSetting) {
    try {
      setIsCreating(true);
      const templateData = getTemplateData(templateSchema, userSetting);
      console.log('templateData', templateData);
      await callService('template', 'createPage', [
        {
          name: pageName,
          templateData,
        },
      ]);
      Notification.success({
        content: intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.createPageSuccess' }),
      });
    } catch (err) {
      console.log('createPageErr', err);
    } finally {
      setIsCreating(false);
      resetData();
    }
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
          <h3>
            {formilySchema.current.description ||
              intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.defaultDescription' })}
          </h3>
          <SchemaForm
            components={components}
            schema={formilySchema.current}
            onSubmit={(userSetting) => {
              createPage(userSetting);
              console.log(userSetting);
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
              <Submit type="primary" loading={isCreating} className={styles.btn}>
                <FormattedMessage id="web.iceworksUIBuilder.pageCreator.createPage" />
              </Submit>
            </div>
          </SchemaForm>
        </>
      )}
    </>
  );
};
