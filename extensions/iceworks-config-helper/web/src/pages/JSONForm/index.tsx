import React, { useState, useEffect, memo } from 'react';
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
import {postSettingToExtension} from '../../utils'

// vscode API
// eslint-disable-next-line no-undef
export const vscode = acquireVsCodeApi();

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
const setJson= async (e)=>{
  // console.log(JSON.stringify(e));
  try{
    // 发布数据变化给 Change Provider
    const event = document.createEvent('HTMLEvents');
    event.initEvent('updateJSON',false,true);
    event.data= {currentConfig:e};
    window.dispatchEvent(event);

    // 发布数据变化给 VSCode 插件本体
    vscode.postMessage({buildJson:postSettingToExtension(e)});
    
    // // 更新插件的数据
    // setFormData(e)
    // console.log('formdata',JSON.stringify(formdata));
  }catch(e){
    // ignore
  }
};

class BuildJSONForm extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      formdata : props.formdata
    }
  }
  
  shouldComponentUpdate(nextProps, nextState){
    return JSON.stringify(this.state.formdata)!==JSON.stringify(nextProps.formdata);
  }

  render(){
    return (
      <Form schema={ICESchema} 
        ObjectFieldTemplate={ObjectFieldTemplate} 
        FieldTemplate={FiledTemplate} 
        TitleField= {titleFiled} 
        fields={fields} 
        widgets={widgets} 
        uiSchema={createUISchema()} 
        formData={this.state.formdata} 
        onChange={e => setJson(e.formData)}
      >
        <></>
      </Form>
    )
  }

}

class JSONForm extends React.Component{
  constructor(props) {
    super(props)
  
    this.state = {
      buildJson:{}
    }
  }

  // // 监听上传的 JSON
  // componentDidMount(){
  //   window.addEventListener('message',event => {
  //     const message = event.data;
  //     console.log('message.buildJson')
  //     console.log(message.buildJson)
  //     this.setState(getSettingFromExtension(message.buildJson))
  //     console.log('getMessage');
  //   });
  // }
  

  render(){
    return (
      <Card free style={{background:'#1e1e1e'}}>
        <BuildJSONForm formdata = {this.state.buildJson}/>
      </Card>
    )
  }

};

export default JSONForm;
