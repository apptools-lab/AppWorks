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
        label="工号"
        required
        requiredMessage="请输入工号"
      >
        <Input placeholder="Please input the id" name="empId" />
      </Form.Item>
      <Form.Item
        colSpan={12}
        label="域账号"
        required
        requiredMessage="请输入域账号"
      >
        <Input placeholder="请输入域账号" name="account" />
      </Form.Item>
      <Form.Item
        colSpan={6}
        label="GitLab Group"
        required
        requiredMessage="请输入 GitLab Group"
      >
        <Input placeholder="请输入 GitLab Group" name="group" />
      </Form.Item>
      <Form.Item
        colSpan={6}
        label="仓库名"
        required
        requiredMessage="请输入仓库名"
      >
        <Input placeholder="请输入仓库名" name="project" />
      </Form.Item>
      <Form.Item
        colSpan={12}
        label="GitLab Token"
        help={<span className={styles.help}>打开 <a href="http://gitlab.alibaba-inc.com/profile/account" target="_blank">gitlab.alibaba-inc.com/profile/account</a> 复制页面的 <b>Private Token</b></span>}
        required
        requiredMessage="请输入GitLab Token"
      >
        <Input placeholder="请输入GitLab Token" name="gitlabToken" />
      </Form.Item>
    </Form>
  );
}

export default CreateDEFProjectForm;
