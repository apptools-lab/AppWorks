import React from 'react';
import { Balloon, Button } from '@alifd/next';

const EditInFile= (props)=>{
  const {label,schema} = props;
  const EditButton = <Button>Edit in build.json</Button>

  return(
    <div style={{ color: 'white' }}>
      <h3 >{label}</h3>
      <p >{schema.description}</p>
      <Balloon trigger={EditButton} closable={false}>
      This type is temporarily unsupported，please edit in build.json
      </Balloon>
    </div>
  )
}
export default EditInFile;