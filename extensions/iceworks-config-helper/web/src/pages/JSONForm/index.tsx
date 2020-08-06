/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo, useRef, useContext } from 'react';
import Form from '@rjsf/core';
import { Card, Loading } from '@alifd/next';
import * as _ from 'lodash';
import { useIntl } from 'react-intl';
import { fields, widgets, templates } from '@/theme/theme';
import { LocaleProvider } from '@/i18n';
import { MessageContext, MessageProvider } from '@/MessageProvider';
import callService from '../../callService';
import { createIncremetalUpdate, getSyncContentAfterUpdate, getSchemaDefaultValue, getUISchema } from '../../utils';

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

const MemoJSONSchemaForm = memo(JSONSchemaForm, _.isEqual);
export const configHelperProvider = React.createContext({
  defaultSchema: {},
  syncJson: {},
  jsonFileName: '',
});

const JSONForm = () => {
  const intl = useIntl();
  const [formKey, setKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentSchema, setCurrentSchema] = useState({});
  const [syncJson, setSyncJson] = useState({});
  const [formData, setFormData] = useState(null);
  const jsonFileName = useRef('build.json');
  const uischema = useRef({});
  const formCannotEditProps = useRef([]);
  const schemaDefaultValue = useRef({});
  const { receivedMessage } = useContext(MessageContext);

  useEffect(() => {
    // @ts-ignore
    const { command, userSetting } = receivedMessage;
    if (command === 'iceworks-config-helper: incrementalUpdate') {
      // 进行增量更新
      setSyncJson(getSyncContentAfterUpdate(userSetting, syncJson));
      setKey(Date.now());
    }
  }, [receivedMessage]);

  useEffect(() => {
    const updateJsonToExtension = async () => {
      const { incrementalChange, newSyncJson } = createIncremetalUpdate(
        formData,
        syncJson,
        schemaDefaultValue.current,
        formCannotEditProps.current
      );
      if (Object.keys(incrementalChange).length !== 0) {
        setSyncJson(newSyncJson);
        await callService('configService', 'updateJsonFile', incrementalChange);
      }
    };
    updateJsonToExtension();
  }, [formData]);

  useEffect(() => {
    const initWebView = async () => {
      const { currentFormCannotEditProps, schema, jsonContent, currentJsonFileName } = await callService(
        'configService',
        'initJsonForWeb'
      );
      formCannotEditProps.current = currentFormCannotEditProps;
      schemaDefaultValue.current = getSchemaDefaultValue(schema);
      jsonFileName.current = currentJsonFileName;
      uischema.current = getUISchema(currentFormCannotEditProps);
      setCurrentSchema(schema);
      setSyncJson(getSyncContentAfterUpdate(jsonContent, syncJson));
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
          <configHelperProvider.Provider
            value={{ defaultSchema: schemaDefaultValue.current, syncJson, jsonFileName: jsonFileName.current }}
          >
            <MemoJSONSchemaForm
              jsonContent={syncJson}
              uiSchema={uischema.current}
              key={formKey}
              setNewWebviewData={setFormData}
              schema={currentSchema}
            />
          </configHelperProvider.Provider>
        </Card>
      )}
    </>
  );
};

const IntlJsonForm = () => {
  return (
    <LocaleProvider>
      <MessageProvider>
        <JSONForm />
      </MessageProvider>
    </LocaleProvider>
  );
};

export default IntlJsonForm;