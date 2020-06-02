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
    </Form>
  );
};

export default CreateDEFProjectForm;
