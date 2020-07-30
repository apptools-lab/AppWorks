import React from 'react';
import { vscode } from '@/pages/JSONForm';
import { DefaultSchema } from '@/utils';

const EditInFile= ({name})=>{
  const sendDefaultValue = ()=>{
    vscode.postMessage({buildJson:{name,value:DefaultSchema[name]}});
  }
  // console.log(idSchema);
  return(
    <a onClick={sendDefaultValue}>Edit in build.json</a>
  )
}
export default EditInFile;