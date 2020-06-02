import React from 'react';
import { Form, Input, Field } from '@alifd/next';
import styles from './index.module.scss';

interface ICreateDEFProjectFormProps {
  field: Field;
}

const CreateDEFProjectForm: React.FC<ICreateDEFProjectFormProps> = ({ field }) => {
  return (
    <Form field={field} className={styles.form} responsive fullWidth labelAlign="top">
      <Form.Item
        colSpan={12}
        label="empId(工号)"
        required
        requiredMessage="Please input the empId"
      >
        <Input placeholder="Please input the id" name="empId" />
      </Form.Item>
      <Form.Item
        colSpan={12}
        label="account(域账号)"
        required
        requiredMessage="Please input the account"
      >
        <Input placeholder="Please input the account" name="account" />
      </Form.Item>
      <Form.Item
        colSpan={12}
        label="group"
        required
        requiredMessage="Please input the group"
      >
        <Input placeholder="Please input the group" name="group" />
      </Form.Item>
      <Form.Item
        colSpan={12}
        label="projectName"
        required requiredMessage="Please input the project name"
      >
        <Input placeholder="Please input the project name" name="project" />
      </Form.Item>
      <Form.Item
        colSpan={12}
        label="gitlabToken"
        required requiredMessage="Please input the gitlab token"
      >
        <Input placeholder="Please input the gitlab token" name="gitlabToken" />
      </Form.Item>
    </Form>
  );
};

export default CreateDEFProjectForm;
