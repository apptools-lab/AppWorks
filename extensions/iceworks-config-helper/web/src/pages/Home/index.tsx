import React from 'react';
import Form from '@rjsf/core';
import { Checkbox, Card, Input, Select } from '@alifd/next'
import * as _ from 'lodash';
import ICESchema from '../../../../schemas/ice.build.json';
import test from './test.json';
import fdCheckBox from '../../theme/checkBox';
import fdEditInFile from '../../theme/EditInFile';
import fdTextInput from '../../theme/fdTextInput';
import titleFiled from '../../theme/TitleFiled';
import descriptionField from '../../theme/DescriptionField';
import FiledTemplate from '../../theme/FieldTemplate';

const uiSchema = {
  'alias':{
    'ui:field':'EditInFile'
  },
  'externals': {
    'ui:field':'EditInFile'
  },
  'devServer': {
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
  'eslint': {
    'Option1':{
      'ui:field':'EditInFile'
    }
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
  TitleFiled: titleFiled,
  DescriptionField: descriptionField,
  ArrayField: fdEditInFile,
  EditInFile: fdEditInFile,

}

const widgets = {
  CheckboxWidget: fdCheckBox,
  TextWidget: fdTextInput,
};

const setFormData=(e)=>{
  console.log(e)
};

// function mergeDefaultData(){
//   const mergedData = {};
//   _.forIn(ICESchema,(value,key)=>{
//     mergedData[key] = test[key]||ICESchema[key]['default'];  
//   })
//   return mergedData;
// }

// console.log(mergeDefaultData())
const Home = () => {

  return (
    <Card free style={{background:'#1e1e1e'}}>
      <Form schema={ICESchema} FieldTemplate={FiledTemplate} fields={fields} widgets={widgets} uiSchema={uiSchema} formData={test} onChange={e => setFormData(e.formData)}/>
    </Card>
  )
};

export default Home;
