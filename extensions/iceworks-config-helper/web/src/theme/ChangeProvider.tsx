import React, { useState,useEffect } from 'react';
import * as _ from 'lodash'
import { Box } from '@alifd/next';
import ICESchema from '../../../schemas/ice.build.json'



export const DefaultSchema = {};

const createDefaultSchema = (schema)=>{
  _.forIn(schema,(value,key)=>{
    if(typeof value.type === 'object'){
      createDefaultSchema(value);
    }else{
      DefaultSchema[key] = value.default;
    }
  })
}
createDefaultSchema(ICESchema.properties);

console.log(DefaultSchema);

const ChangeProvider=({fdkey, children, value})=>{
  
  const [siderStyle,setSiderStyle] = useState({backgroundColor: '#1e1e1e',width: '2px',margin:'0 2px'});
  useEffect(() => {
    setSiderStyle( fdkey ==='editInFile'||value === DefaultSchema[fdkey]||value===''&&DefaultSchema[fdkey]===undefined?
      {backgroundColor: '#1e1e1e',width: '2px',margin:'0 2px'}:
      {backgroundColor: '#0d7c9f',width: '2px',margin:'10px 2px 0px 2px'}
    );
  }, [value])

  return(
    <Box direction='row'>
      <div style={siderStyle} onClick={()=>console.log(value)}/>
      <div>
        {React.Children.only(children)}
      </div>
    </Box>

  )
}
export default ChangeProvider 