import React, { useState } from 'react';
import { Form, Select } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import CustomMaterialSource from './CustomMaterialSource';
import styles from './index.module.scss';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 8, offset: 6 }
};

export default () => {
  const [materialSources, setMaterialSources] = useState<IMaterialSource[]>([]);
  const onMaterialSourceAdd = (values: IMaterialSource) => {
    console.log(values);
    setMaterialSources([...materialSources, values])
  }

  return (
    <div className={styles.container}>
      <CustomMaterialSource sources={materialSources} onMaterialSourceAdd={onMaterialSourceAdd} />
      <Form {...formItemLayout} labelTextAlign="left" size="large">
        <FormItem label="Iceworks npm 包管理工具">
          <Select placeholder="请选择 npm 包管理工具" style={{ width: '100%' }}>
            <option value="china">China</option>
            <option value="use">United States</option>
            <option value="japan">Japan</option>
            <option value="korean">South Korea</option>
            <option value="Thailand">Thailand</option>
          </Select>
        </FormItem>
        <FormItem label="Iceworks npm 镜像源">
          <Select placeholder="请选择 npm 镜像源" style={{ width: '100%' }}>
            <option value="china">China</option>
            <option value="use">United States</option>
            <option value="japan">Japan</option>
            <option value="korean">South Korea</option>
            <option value="Thailand">Thailand</option>
          </Select>
        </FormItem>
      </Form>
    </div>
  )
}
