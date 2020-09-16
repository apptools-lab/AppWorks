/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo, useRef } from 'react';
import Form from '@rjsf/core';
import { Card, Loading } from '@alifd/next';
import * as _ from 'lodash';
import { useIntl } from 'react-intl';
import { fields, widgets, templates } from '@/theme/theme';
import { LocaleProvider } from '@/i18n';
import callService from '../../callService';
import { createIncremetalUpdate, getSchemaDefaultValue, getUISchema } from '../../utils';

const CARD_STYLE = { background: '#1e1e1e' };
const LOADING_STYLE = { width: '100%', height: '80vh' };

// TODO 程序锁，标识是是否正在更新 Json
// 当编辑器发生 Json 变更时，触发 Form 的 rerender，但不触发表单的 onChange，避免死循环
let isUpdatingJson = false;

const JsonSchemaForm = ({ jsonContent, schema, uiSchema, setData }) => {
  console.log('render JsonSchemaForm', jsonContent);
  const setJson = async (e) => {
    console.log('onChange...');
    if (!isUpdatingJson) {
      console.log('do setData...');
      setData(e);
    }
  };

  return (
    <Form
      schema={schema}
      ObjectFieldTemplate={templates.ObjectFieldTemplate}
      FieldTemplate={templates.FiledTemplate}
      fields={fields}
      widgets={widgets}
      uiSchema={uiSchema}
      formData={jsonContent}
      onChange={(e) => setJson(e.formData)}
    >
      <></>
    </Form>
  );
};

const MemoJsonSchemaForm = memo(JsonSchemaForm, _.isEqual);
export const configHelperProvider = React.createContext({
  defaultSchema: {},
  jsonContent: {},
  editingJsonFile: '',
});

const JsonForm = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [currentSchema, setCurrentSchema] = useState({});
  const [jsonContent, orginSetJsonContent] = useState({});
  const editingJsonFile = useRef('build.json');
  const uischema = useRef({});
  const formCannotEditProps = useRef([]);
  const schemaDefaultValue = useRef({});

  function setJsonContent(value) {
    isUpdatingJson = true;
    orginSetJsonContent(value);
  }

  useEffect(() => {
    isUpdatingJson = false;
  }, [jsonContent]);

  useEffect(() => {
    window.addEventListener(
      'message',
      (e) => {
        const { command, jsonContent: messageJsonContent } = e.data;
        if (command === 'iceworks-config-helper:updateJson') {
          console.log('got updateJson message, jsonContent:', messageJsonContent);
          setJsonContent(messageJsonContent);
        }
      },
      false,
    );
  }, []);

  async function setSyncAndUpdateJsonFile(newData) {
    const { incrementalChange, newSyncJson } = createIncremetalUpdate(
      newData,
      jsonContent,
      schemaDefaultValue.current,
      formCannotEditProps.current,
    );

    console.log('newSyncJson', newSyncJson);
    console.log('incrementalChange', incrementalChange);

    if (Object.keys(incrementalChange).length !== 0) {
      setJsonContent(newSyncJson);
      await callService('config', 'updateJsonFile', incrementalChange);
    }
  }

  useEffect(() => {
    const init = async () => {
      const {
        formCannotEditProps: setFormCannotEditProps,
        schema,
        jsonContent: initJsonContent,
        editingJsonFile: setEditingJsonFile,
      } = await callService('config', 'getInitData');
      formCannotEditProps.current = setFormCannotEditProps;
      schemaDefaultValue.current = getSchemaDefaultValue(schema, initJsonContent);
      editingJsonFile.current = setEditingJsonFile;
      uischema.current = getUISchema(setFormCannotEditProps);
      setCurrentSchema(schema);
      setJsonContent(initJsonContent);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <>
      {loading ? (
        <Loading
          tip={intl.formatMessage({ id: 'web.iceworksConfigHelper.index.settingFileNotReady' })}
          style={LOADING_STYLE}
        />
      ) : (
        <Card free style={CARD_STYLE}>
          <configHelperProvider.Provider
            value={{
              jsonContent,
              defaultSchema: schemaDefaultValue.current,
              editingJsonFile: editingJsonFile.current,
            }}
          >
            <MemoJsonSchemaForm
              jsonContent={jsonContent}
              uiSchema={uischema.current}
              setData={setSyncAndUpdateJsonFile}
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
      <JsonForm />
    </LocaleProvider>
  );
};

export default IntlJsonForm;
