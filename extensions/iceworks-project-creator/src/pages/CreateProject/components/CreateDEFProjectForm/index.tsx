import React from 'react';
import { Form, Input, Field, Balloon, Icon } from '@alifd/next';
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
        label="gitlabGroup"
        required
        requiredMessage="Please input the gitlab group"
      >
        <Input placeholder="Please input the gitlab group" name="group" />
      </Form.Item>
      <Form.Item
        colSpan={12}
        label="repositoryName(仓库名)"
        required
        requiredMessage="Please input the repository name"
      >
        <Input placeholder="Please input the repository name" name="project" />
      </Form.Item>
      <Form.Item
        colSpan={12}
        label={<span>gitlabToken <Balloon type="primary" trigger={<Icon type="help" />} closable={false}><a href="http://gitlab.alibaba-inc.com/profile/account" target="_blank">How to get your gitlab token?</a> (cmd or ctrl + 鼠标左键)</Balloon></span>}
        required
        requiredMessage="Please input the gitlab token"
      >
        <Input placeholder="Please input the gitlab token" name="gitlabToken" />
      </Form.Item>
    </Form>
  );
};

export default CreateDEFProjectForm;
