/* eslint-disable dot-notation */
import React, { useState, useEffect, memo } from 'react';
import Form from '@rjsf/core';
import { Card, Loading } from '@alifd/next';
import * as _ from 'lodash';
import { fields, widgets, templates } from '@/theme/theme';
import ICESchema from '../../../../schemas/ice.build.json';

import { postSettingToExtension, getSettingFromExtension, isEqual } from '../../utils';

// vscode API
// eslint-disable-next-line no-undef
export const vscode = acquireVsCodeApi();
vscode.postMessage('iceworks-config-helper:webviewLoadingDone');
// 保存插件本体发送的数据
let lastBuildJsonfromExtension;

// ui Schema
// covert array and object to editInJson to Edit in json field
const createUISchema = () => {
  const uiSchema = {};
  _.forIn(ICESchema.properties, (value, key) => {
    if (value['type'] === undefined || value['type'] === 'object' || value['type'] === 'array') {
      uiSchema[key] = { 'ui:field': 'EditInFile' };
    }
  });
  return uiSchema;
};

const updateChangeProviderValue = (e) => {
  console.log('updateDataforChangeProvider', JSON.stringify(e));
  // 发布数据变化给 Change Provider
  const event = document.createEvent('HTMLEvents');
  event.initEvent('updateJSON', false, true);
  event['data'] = { currentConfig: e };
  window.dispatchEvent(event);
};

const JSONSchemaForm = ({ buildJson, loading }) => {
  const [formdata, setFormData] = useState(buildJson);

  const setJson = async (e) => {
    if (e.alias === undefined) {
      return;
    }

    // 发送变化给 ChangeProvider
    updateChangeProviderValue(e);

    // 发布数据变化给 VSCode 插件本体
    if (lastBuildJsonfromExtension && !loading && !isEqual(lastBuildJsonfromExtension, e)) {
      vscode.postMessage({ buildJson: postSettingToExtension(e) });
    }

    // 更新插件的数据
    setFormData(e);
  };

  return (
    <Form
      schema={ICESchema}
      ObjectFieldTemplate={templates.ObjectFieldTemplate}
      FieldTemplate={templates.FiledTemplate}
      fields={fields}
      widgets={widgets}
      uiSchema={createUISchema()}
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
  const [buildJson, setBuildJson] = useState({});
  const [loading, setLoading] = useState(false);
  // 监听上传的 JSON
  useEffect(() => {
    window.addEventListener('message', (event) => {
      const message = event.data;
      lastBuildJsonfromExtension = getSettingFromExtension(message.buildJson);

      // 更新数据
      if (!isEqual(lastBuildJsonfromExtension, buildJson)) {
        setBuildJson(lastBuildJsonfromExtension);
        setKey(Date.now());
        updateChangeProviderValue(lastBuildJsonfromExtension);
      }

      console.log('FormKey', formKey);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading ? (
        <Loading
          tip="build.json is not valiable now... \n  Please check Build.json and retry  "
          style={{ width: '100%', height: '80vh', whiteSpace: 'pre-wrap' }}
        />
      ) : (
        <Card free style={{ background: '#1e1e1e' }}>
          <MemoJSONSchemaForm buildJson={buildJson} key={formKey} loading={loading} />
        </Card>
      )}
    </>
  );
};

export default JSONForm;
