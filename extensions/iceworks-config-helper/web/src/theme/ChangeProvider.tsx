import React, { useState,useEffect } from 'react';
import * as _ from 'lodash'
import { Box } from '@alifd/next';
import {DefaultSchema,formdidNotEditAttrs, isEqual} from '../utils';


const ChangeProvider=({fdkey, children})=>{

  const [value,setValue] = useState(DefaultSchema[fdkey]);

  // console.log(`key: ${fdkey}, value: ${value}`)
  // 侧边栏样式控制
  const [siderStyle,setSiderStyle] = useState({backgroundColor: '#1e1e1e',width: '2px',margin:'0 2px'});
  
  useEffect(() => {
    window.addEventListener('updateJSON',(e)=>{
      if(e.data.currentConfig)
        setValue(e.data.currentConfig[fdkey]);
    })
    // console.log(fdkey,value);
    setSiderStyle( isEqual(value,DefaultSchema[fdkey])||
      value===''&&DefaultSchema[fdkey]===undefined||
      formdidNotEditAttrs.includes(fdkey)?
      {backgroundColor: '#1e1e1e',width: '2px',margin:'0 2px'}:
      {backgroundColor: '#0d7c9f',width: '2px',margin:'10px 2px 0px 2px'}
    );
  }, [fdkey,value])

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