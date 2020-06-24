import React from 'react';
import { Dialog, Form, Input, Select, Button } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import { materialTypes } from '@/constants';
import styles from './MaterialSourceForm.module.scss';

interface IMaterialSourceForm {
  title: string;
  value: IMaterialSource | object;
  visible: boolean;
  onSubmit: (value: any) => void;
  onCancel: () => void;
  onSourceValidator: (rule: object, value: string, callback: (errors: string) => void) => any;
}

const MaterialSourceForm: React.FC<IMaterialSourceForm> = ({ title, value, onSubmit, visible, onCancel, onSourceValidator }) => {
  const onFormSubmit = (values, errors) => {
    if (errors) {
      return;
    }
    onSubmit(values);
  };

  return (
    <Dialog
      footer={false}
      visible={visible}
      title={title}
      className={styles.dialog}
      onCancel={onCancel}
      onClose={onCancel}
    >
      <Form value={value} fullWidth className={styles.form}>
        <Form.Item label="物料名称：" required requiredMessage="请输入物料名称" validator={onSourceValidator}>
          <Input name="name" placeholder="请输入物料名称" />
        </Form.Item>
        <Form.Item label="物料地址：" required requiredMessage="请输入物料地址" format="url">
          <Input name="source" placeholder="请输入物料地址" />
        </Form.Item>
        <Form.Item label="物料类型：" required requiredMessage="请选择物料类型">
          <Select name="type">
            {materialTypes.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))}
          </Select>
        </Form.Item>
        <Form.Item label="物料描述：">
          <Input.TextArea name="description" placeholder="请输入物料描述" />
        </Form.Item>
        <Form.Item className={styles.formBtns}>
          <Form.Submit
            type="primary"
            onClick={onFormSubmit}
            validate
          >
            确定
          </Form.Submit>
          <Button onClick={onCancel} className={styles.btn}>取消</Button>
        </Form.Item>
      </Form>
    </Dialog>
  )
}

export default MaterialSourceForm;
