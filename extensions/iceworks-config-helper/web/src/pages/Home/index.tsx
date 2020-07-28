import React from 'react';
import Form from '@rjsf/core';
import { Checkbox, Card, Input, Select } from '@alifd/next'
import ICESchema from '../../../../schemas/ice.build.json'
import test from './test.json'
import fdCheckBox from '../../theme/checkBox';
import fdEditInFile from '../../theme/EditInFile';
import fdTextInput from '../../theme/fdTextInput';



import './style.css'

const uiSchema = {
  'alias':{
    'ui:field':'EditInFile'
  },
  'externals': {
    'ui:field':'EditInFile'
  },
  'proxy': {
    'ui:field':'EditInFile'
  },
  'cssLoaderOptions': {
    'ui:field':'EditInFile'
  },
  'lessLoaderOptions': {
    'ui:field':'EditInFile'
  },
  'sassLoaderOptions': {
    'ui:field':'EditInFile'
  },
  'terserOptions': {
    'ui:field':'EditInFile'
  },
  'babelPlugins': {
    'ui:field':'EditInFile'
  },
  'babelPresets': {
    'ui:field':'EditInFile'
  },
  'targets': {
    'ui:field':'EditInFile'
  },
  'plugins': {
    'ui:field':'EditInFile'
  },
  'outputAssetsPath': {
    'ui:field':'EditInFile'
  }
};

const fields = {
  ArrayField: fdEditInFile,
  EditInFile: fdEditInFile
}

const widgets = {
  CheckboxWidget: fdCheckBox,
  TextWidget: fdTextInput
};

const setFormData=(e)=>{
  console.log(e)
};
const Home = () => {

  return (
    <Card free>
      <Form schema={ICESchema} fields={fields} widgets={widgets} uiSchema={uiSchema} formData={test} onChange={e => setFormData(e.formData)}/>
    </Card>
  )
};

export default Home;
