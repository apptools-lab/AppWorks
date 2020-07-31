import React, { useState, useEffect, memo } from 'react';
import Form from '@rjsf/core';
import {  Card, Loading, } from '@alifd/next';
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
import {postSettingToExtension, getSettingFromExtension, isEqual} from '../../utils'

// vscode API
// eslint-disable-next-line no-undef
export const vscode = acquireVsCodeApi();
console.log('vscodeApi',vscode);

// ui Schema
// covert array and object to editInJson to Edit in json field
const createUISchema= ()=>{
  const uiSchema = {};
  _.forIn(ICESchema.properties,(value,key)=>{
    console.log('key',key,'value:',value)
    if(value.type===undefined||value.type==='object'|| value.type==='array'){
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

const JSONSchemaForm = ({buildJson,loading})=>{
  const [formdata,setFormData] = useState(buildJson);

  const setJson= async (e)=>{
    // console.log(JSON.stringify(e));
    try{
      // 发布数据变化给 Change Provider
      const event = document.createEvent('HTMLEvents');
      event.initEvent('updateJSON',false,true);
      event.data= {currentConfig:e};
      window.dispatchEvent(event);
  
      // 发布数据变化给 VSCode 插件本体
      if(!loading){
        vscode.postMessage({buildJson:postSettingToExtension(e)});
      }

      // 更新插件的数据
      setFormData(e)

      // 测试
      console.log('formdata',JSON.stringify(formdata));
    }catch(e){
      // ignore
    }
  };


  console.log('buildJson',JSON.stringify(buildJson));
  return (
    <Form schema={ICESchema} 
      ObjectFieldTemplate={ObjectFieldTemplate} 
      FieldTemplate={FiledTemplate} 
      TitleField= {titleFiled} 
      fields={fields} 
      widgets={widgets} 
      uiSchema={createUISchema()} 
      formData={formdata} 
      onChange={e => setJson(e.formData)}
    >
      <></>
    </Form>
  )
}

const MemoJSONSchemaForm = memo(JSONSchemaForm,isEqual)

const JSONForm = () => {
  let key = 0;
  const [buildJson,setBuildJson] = useState({});
  const [loading,setLoading] = useState(false);
  // 监听上传的 JSON
  useEffect(()=>{
    window.addEventListener('message',event => {
      setLoading(false);
      const message = event.data;
      console.log('message.buildJson')
      console.log(message.buildJson)
      setBuildJson(getSettingFromExtension(message.buildJson));
      console.log('getMessage');
      key++;
    })
  },[]);
  
  return (
    <>
      {loading?
        <Loading/>:
        <Card free style={{background:'#1e1e1e'}}>
          <MemoJSONSchemaForm buildJson={buildJson} key={key} loading={loading} />
        </Card>
      }

    </>
  )
};

export default JSONForm;
