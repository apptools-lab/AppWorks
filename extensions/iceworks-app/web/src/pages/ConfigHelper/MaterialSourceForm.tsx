import React from 'react';
import { Dialog, Form, Input, Select, Field } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import styles from './MaterialSourceForm.module.scss';

interface IMaterialSourceForm {
  values?: IMaterialSource;
  visible: boolean;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}
const materialTypes = ['react', 'vue', 'rax'];

const MaterialSourceForm: React.FC<IMaterialSourceForm> = ({ values = {}, onSubmit, visible, onCancel }) => {
  const field = Field.useField({ values });

  const submit = async () => {
    const { errors } = await field.validatePromise();
    if (errors && errors.length > 0) {
      return;
    }

    onSubmit(field.getValues());
  };

  return (
    <Dialog
      visible={visible}
      title="新增物料"
      className={styles.dialog}
      onOk={submit}
      onCancel={onCancel}
      onClose={onCancel}
    >
      <Form field={field} fullWidth className={styles.form}>
        <Form.Item label="物料名称：" required requiredMessage="请输入物料名称">
          <Input name="name" placeholder="请输入物料名称" />
        </Form.Item>
        <Form.Item label="物料地址：" required requiredMessage="请输入物料地址">
          <Input name="source" placeholder="请输入物料地址" />
        </Form.Item>
        <Form.Item label="物料类型：" required requiredMessage="请选择物料类型">
          <Select name="type">
            {materialTypes.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))}
          </Select>
        </Form.Item>
        <Form.Item label="物料描述：">
          <Input.TextArea name="description" placeholder="请输入物料描述" rows={3} />
        </Form.Item>
      </Form>
    </Dialog>
  )
}

export default MaterialSourceForm;
