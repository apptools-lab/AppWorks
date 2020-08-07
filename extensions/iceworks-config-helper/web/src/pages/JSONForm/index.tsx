/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo, useRef } from 'react';
import Form from '@rjsf/core';
import { Card, Loading } from '@alifd/next';
import * as _ from 'lodash';
import { useIntl } from 'react-intl';
import { fields, widgets, templates } from '@/theme/theme';
import { LocaleProvider } from '@/i18n';
import callService from '../../callService';
import { createIncremetalUpdate, getSyncJson, getSchemaDefaultValue, getUISchema } from '../../utils';

const CARD_STYLE = { background: '#1e1e1e' };
const LOADING_STYLE = { width: '100%', height: '80vh' };

const JSONSchemaForm = ({ jsonContent, schema, uiSchema, setData }) => {
  const setJson = async (e) => {
    setData(e);
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

const MemoJSONSchemaForm = memo(JSONSchemaForm, _.isEqual);
export const configHelperProvider = React.createContext({
  defaultSchema: {},
  syncJson: {},
  editingJSONFile: '',
});

const JSONForm = () => {
  const intl = useIntl();
  const [formKey, setKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentSchema, setCurrentSchema] = useState({});
  const [syncJson, setSyncJson] = useState({});
  const editingJSONFile = useRef('build.json');
  const uischema = useRef({});
  const formCannotEditProps = useRef([]);
  const schemaDefaultValue = useRef({});

  useEffect(() => {
    window.addEventListener(
      'message',
      (e) => {
        const { command, incrementalChange } = e.data;
        if (command === 'iceworks-config-helper: incrementalUpdate') {
          setSyncJson(getSyncJson(incrementalChange, syncJson));
          setKey(Date.now());
        }
      },
      false
    );
  }, []);

  async function setSyncAndUpdateJsonFile(newData) {
    const { incrementalChange, newSyncJson } = createIncremetalUpdate(
      newData,
      syncJson,
      schemaDefaultValue.current,
      formCannotEditProps.current
    );

    console.log('newSyncJson', newSyncJson);
    console.log('incrementalChange', incrementalChange);

    if (Object.keys(incrementalChange).length !== 0) {
      setSyncJson(newSyncJson);
      await callService('config', 'updateJsonFile', incrementalChange);
    }
  }

  useEffect(() => {
    const init = async () => {
      const { formCannotEditProps: setFormCannotEditProps, schema, jsonContent, editingJSONFile: setEditingJSONFile } = await callService('config', 'getInitData');
      formCannotEditProps.current = setFormCannotEditProps;
      schemaDefaultValue.current = getSchemaDefaultValue(schema);
      editingJSONFile.current = setEditingJSONFile;
      uischema.current = getUISchema(setFormCannotEditProps);
      setCurrentSchema(schema);
      setSyncJson(getSyncJson(jsonContent, syncJson));
      setKey(Date.now());
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
              syncJson,
              defaultSchema: schemaDefaultValue.current,
              editingJSONFile: editingJSONFile.current
            }}
          >
            <MemoJSONSchemaForm
              jsonContent={syncJson}
              uiSchema={uischema.current}
              key={formKey}
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
      <JSONForm />
    </LocaleProvider>
  );
};

export default IntlJsonForm;
