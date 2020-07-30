import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import {  Card, } from '@alifd/next';
import * as _ from 'lodash';
import ICESchema from '../../../../schemas/ice.build.json';
import fdCheckBox from '../../theme/checkBox';
import fdEditInFile from '../../theme/EditInFile';
import fdTextInput from '../../theme/fdTextInput';
import titleFiled from '../../theme/TitleFiled';
import descriptionField from '../../theme/DescriptionField';
import FiledTemplate from '../../theme/FieldTemplate';
import ObjectFieldTemplate from '../../theme/ObjectFieldTemplate';
import selectWidget from '../../theme/fdSelectWidge';
import {postSettingToExtension, getSettingFromExtension} from '../../utils'
import Test from './test.json';

// ICESchema

export const IceSchema = ICESchema;

// ui Schema
// covert array and object to editInJson to Edit in json field
const createUISchema= ()=>{
  const uiSchema = {};
  _.forIn(ICESchema.properties,(value,key)=>{
    if(value.type==='object'|| value.type==='array'){
      uiSchema[key]={'ui:field': 'EditInFile'};
    }
  });
  return uiSchema;
}

const fields = {
  TitleFiled: titleFiled,
  DescriptionField: descriptionField,
  ArrayField: fdEditInFile,
  EditInFile: fdEditInFile,
}

const widgets = {
  CheckboxWidget: fdCheckBox,
  TextWidget: fdTextInput,
  SelectWidget: selectWidget
};

// current Form data 
let currentSetting = {};

export async function getCurrentSetting(){
  await setFormData();
  return currentSetting;
}
// const vscode = acquireVsCodeApi();
// console.log('vscodeApi');
// console.log(vscode);



const setFormData= async (e)=>{
  // console.log(JSON.stringify(e));
  try{
    currentSetting = e;

    // 发布数据变化给 Change Provider
    const event = document.createEvent('HTMLEvents');
    event.initEvent('updateJSON',false,true);
    event.data= {currentConfig:e};
    window.dispatchEvent(event);

    // 发布数据变化给 VSCode 插件本体

    console.log(postSettingToExtension(e));
  }catch(e){
    // ignore
  }
  return currentSetting;
};

// function mergeDefaultData(){
//   const mergedData = {};
//   _.forIn(ICESchema,(value,key)=>{
//     mergedData[key] = test[key]||ICESchema[key]['default'];  
//   })
//   return mergedData;
// }

// console.log(mergeDefaultData())
console.log(Test);
const Home = () => {
  const [buildJson,setBuildJson] = useState(getSettingFromExtension(Test));
  
  // 监听上传的 JSON
  // useEffect(()=>{
  //   window.addEventListener('message',event => {
  //     const message = event.data;
  //     setBuildJson(getSettingFromExtension(message.buildJson));
  //     console.log('getMessage');
  //   })
  // },[]);

  return (
    <Card free style={{background:'#1e1e1e'}}>
      <Form schema={ICESchema} 
        ObjectFieldTemplate={ObjectFieldTemplate} 
        FieldTemplate={FiledTemplate} 
        TitleField= {titleFiled} 
        fields={fields} 
        widgets={widgets} 
        uiSchema={createUISchema()} 
        formData={buildJson} 
        onChange={e => setFormData(e.formData)}>
        <></>
      </Form>
    </Card>
  )
};

export default Home;
