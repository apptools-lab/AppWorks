/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable dot-notation */
import React, { useState, useEffect, memo } from 'react';
import Form from '@rjsf/core';
import { Card, Loading } from '@alifd/next';
import { useIntl } from 'react-intl';
import { fields, widgets, templates } from '@/theme/theme';
import { LocaleProvider } from '@/i18n';
import callService from '../../callService';
import {
  createIncremetalUpdateForExtension,
  setIncreamentalUpdateFromExtension,
  isEqual,
  initDefaultValue,
  createUISchema,
  getMockData,
} from '../../utils';

const JSONSchemaForm = ({ jsonContent, schema, uiSchema, setNewWebviewData }) => {
  const [formdata, setFormData] = useState(jsonContent);
  const setJson = async (e) => {
    setNewWebviewData(e);
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
export const changeProviderContent = React.createContext({
  defaultSchema: {},
  formCannotEditProps: [],
  syncJsonContentObjInWebView: {},
});

const JSONForm = () => {
  const intl = useIntl();
  const [formKey, setKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentSchema, setCurrentSchema] = useState({});
  const [syncJsonContentObjInWebView, setSyncJsonContentObjInWebView] = useState({});
  const [formCannotEditProps, setFormCannotEditProps] = useState([]);
  const [uischema, setUISchema] = useState({});
  const [defaultSchema, setDefaultSchema] = useState({});
  const [newWebViewData, setNewWebviewData] = useState(null);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const { command, JsonContent } = event.data;

      if (command === 'incrementalUpdateJsonForWebview') {
        // 进行增量更新
        setSyncJsonContentObjInWebView(setIncreamentalUpdateFromExtension(JsonContent, syncJsonContentObjInWebView));
        setKey(Date.now());
      }
    });
  }, []);

  useEffect(() => {
    const updateJsonToExtension = async () => {
      const { updateMessage, newSyncJsonContentObj } = createIncremetalUpdateForExtension(
        newWebViewData,
        formCannotEditProps,
        defaultSchema,
        syncJsonContentObjInWebView
      );
      if (Object.keys(updateMessage).length !== 0) {
        setSyncJsonContentObjInWebView(newSyncJsonContentObj);
        await callService('configService', 'updateJsonFile', updateMessage);
      }
    };
    updateJsonToExtension();
  }, [newWebViewData]);

  useEffect(() => {
    const initWebView = async () => {
      const { webviewCannotEditProps, schema, JsonContent } =
        (await callService('configService', 'initJsonForWeb')) || getMockData();
      setFormCannotEditProps(webviewCannotEditProps);
      setDefaultSchema(initDefaultValue(schema));
      setCurrentSchema(schema);
      setUISchema(createUISchema(webviewCannotEditProps));
      setSyncJsonContentObjInWebView(setIncreamentalUpdateFromExtension(JsonContent, syncJsonContentObjInWebView));
      setKey(Date.now());
      setLoading(false);
    };
    initWebView();
  }, []);
  return (
    <>
      {loading ? (
        <Loading
          tip={intl.formatMessage({ id: 'web.iceworksConfigHelper.index.settingFileNotReady' })}
          style={{ width: '100%', height: '80vh', whiteSpace: 'pre-wrap' }}
        />
      ) : (
        <Card free style={{ background: '#1e1e1e' }}>
          <changeProviderContent.Provider value={{ defaultSchema, formCannotEditProps, syncJsonContentObjInWebView }}>
            <MemoJSONSchemaForm
              jsonContent={syncJsonContentObjInWebView}
              uiSchema={uischema}
              key={formKey}
              setNewWebviewData={setNewWebviewData}
              schema={currentSchema}
            />
          </changeProviderContent.Provider>
        </Card>
      )}
    </>
  );
};

const IntlJsonForm = () => {
  return (
    <LocaleProvider>
      <JSONForm />
    </LocaleProvider>
  );
};

export default IntlJsonForm;
