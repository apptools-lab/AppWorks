import React from 'react';
import { Balloon, Button } from '@alifd/next';
import ChangeProvider from './ChangeProvider';

const EditInFile= (props)=>{
  const {label, schema, idSchema, formData} = props;
  const EditButton = <Button>Edit in build.json</Button>
  console.log(idSchema);
  return(
    <ChangeProvider fdkey="editInFile" value=''>
      <div style={{ color: 'white' }}>
        {idSchema?<h3>{idSchema.$id.substring(5)}</h3>:<></>}
        {schema?<p className='fddescription'>{schema.description}</p>:<></>}
        <Balloon trigger={EditButton} closable={false}>
        This type is temporarily unsupported，please edit in build.json
        </Balloon>
      </div>
    </ChangeProvider>
  )
}
export default EditInFile;