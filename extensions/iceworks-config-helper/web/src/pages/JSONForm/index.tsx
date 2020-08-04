/* eslint-disable dot-notation */
import React, { useState, useEffect, memo } from 'react';
import Form from '@rjsf/core';
import { Card, Loading } from '@alifd/next';
import * as _ from 'lodash';
import { useIntl, FormattedMessage } from 'react-intl';
import { fields, widgets, templates } from '@/theme/theme';
import { LocaleProvider } from '@/i18n';
import {
  getMessageForExtension,
  setIncreamentalUpdateFromExtension,
  isEqual,
  getVScode,
  getSyncJsonContentObj,
  formdidNotEditAttrs,
  initDefaultValue,
} from '../../utils';

// eslint-disable-next-line no-undef
export const vscode = getVScode();

// covert array and object to editInJson to Edit in json field
const uiSchema = {};
const createUISchema = (schema) => {
  _.forIn(schema.properties, (value, key) => {
    if (value['type'] === undefined || value['type'] === 'object' || value['type'] === 'array') {
      uiSchema[key] = { 'ui:field': 'EditInFile' };
    }
  });
};

const updateChangeProviderValue = (e) => {
  // send message for change provider
  const event = document.createEvent('HTMLEvents');
  event.initEvent('iceworks-config-helper: updateJSON', false, true);
  event['data'] = { currentConfig: e };
  window.dispatchEvent(event);
};

const JSONSchemaForm = ({ buildJson, loading, schema }) => {
  const [formdata, setFormData] = useState(buildJson);
  const setJson = async (e) => {
    // 发送变化给 ChangeProvider
    updateChangeProviderValue(e);

    // 发布数据变化给 VSCode 插件本体
    const message = getMessageForExtension(e);
    if (!loading && message) {
      vscode.postMessage({ JsonIncrementalUpdate: message, command: null });
    }

    // 更新插件的数据
    setFormData(e);
  };

  return (
    <Form
      schema={schema}
      ObjectFieldTemplate={templates.ObjectFieldTemplate}
      FieldTemplate={templates.FiledTemplate}
      fields={fields}
      widgets={widgets}
      uiSchema={uiSchema}
      formData={formdata}
      onChange={(e) => setJson(e.formData)}
    >
      <></>
    </Form>
  );
};

const MemoJSONSchemaForm = memo(JSONSchemaForm, isEqual);

const JSONForm = () => {
  const [formKey, setKey] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentSchema, setCurrentSchema] = useState({});
  const [locale, setLocale] = useState('zh-cn');
  // const intl = useIntl();
  // 监听上传的 JSON
  useEffect(() => {
    window.addEventListener('message', (event) => {
      const message = event.data;
      const { JsonContent, command, locale, schema } = message;

      // 初始化
      if (command === 'initWebview') {
        initDefaultValue(schema);
        createUISchema(schema);
        setCurrentSchema(schema);
        setLoading(false);
        vscode.postMessage({ webviewCannotEditProps: formdidNotEditAttrs });
        setLocale(locale);
      }
      // 进行增量更新
      setIncreamentalUpdateFromExtension(JsonContent);
      const syncJsonData = getSyncJsonContentObj();
      console.log('syncBuildJson', syncJsonData);

      // 更新变量
      setFormData(syncJsonData);
      setKey(Date.now());
      updateChangeProviderValue(syncJsonData);
      console.log('formKey', formKey);
    });
  }, []);

  return (
    <>
      {loading ? (
        <Loading
          tip="Setting file is not valiable now...   Please fix it and retry."
          style={{ width: '100%', height: '80vh', whiteSpace: 'pre-wrap' }}
        />
      ) : (
        <Card free style={{ background: '#1e1e1e' }}>
          <MemoJSONSchemaForm buildJson={formData} key={formKey} loading={loading} schema={currentSchema} />
        </Card>
      )}
    </>
  );
};

vscode.postMessage({
  command: 'iceworks-config-helper:webviewLoadingDone',
});
export default JSONForm;
