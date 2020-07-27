import React from 'react';
import Form from '@rjsf/fluent-ui'
import ICESchema from './schema.ICE.json'

const uiSchema= {
  'ui:options':  {
    expandable: false
  }
}
const Home = () => {
  return <Form schema={ICESchema} uiSchema={uiSchema} fontSize='30px'/>
};

export default Home;
