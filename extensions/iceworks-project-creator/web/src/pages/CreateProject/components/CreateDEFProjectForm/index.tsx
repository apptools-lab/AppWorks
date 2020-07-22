import React, { useEffect } from 'react';
import { Form, Input, Select } from '@alifd/next';
import { IDEFProjectField, IGitLabGroup } from '@/types';
import callService from '@/callService';
import styles from './index.module.scss';

interface ICreateDEFProjectFormProps {
  value: IDEFProjectField;
  children: React.ReactNode;
  errorMsg?: string;
  dataSource: IGitLabGroup[];
  onChange: (value: IDEFProjectField) => void;
  onAccountBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onValidateProjectName: (rule: object, value: string, callback: (errors?: string) => void) => any;
};

const CreateDEFProjectForm: React.FC<ICreateDEFProjectFormProps> = ({
  value,
  children,
  errorMsg,
  dataSource,
  onAccountBlur,
  onChange,
  onValidateProjectName,
}) => {
  useEffect(() => {
    async function initUserInfo() {
      const { empId, account } = value;
      if (!empId || !account) { // if empId and account are not found, request DEF API to get them
        const userInfo = await callService('common', 'getUserInfo');
        const { empid: empId, account } = userInfo;
        onChange({ ...value, empId, account })
      }
    }
    initUserInfo();
  }, [])
  return (
    <div className={styles.container}>
      <Form value={value} onChange={onChange} className={styles.form} responsive fullWidth labelAlign="top">
        <Form.Item
          colSpan={12}
          label="GitLab Token"
          help={<span className={styles.help}>打开 <a href="http://gitlab.alibaba-inc.com/profile/account" rel="noopener noreferrer" target="_blank">gitlab.alibaba-inc.com/profile/account</a> 复制页面的 <b>Private Token</b></span>}
          required
          requiredMessage="请输入GitLab Token"
          onBlur={onAccountBlur}
        >
          <Input placeholder="请输入GitLab Token" name="gitlabToken" />
        </Form.Item>
        <Form.Item
          colSpan={6}
          label="GitLab Group"
          required
          requiredMessage="请选择 GitLab Group"
        >
          <Select
            placeholder="请选择 GitLab Group"
            name="group"
            fillProps="name"
            key="name"
            showSearch
          >
            {dataSource.map(item => (
              <Select.Option value={item.name}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          colSpan={6}
          label="仓库名"
          required
          requiredMessage="请输入仓库名"
          autoValidate
          validator={onValidateProjectName}
        >
          <Input placeholder="请输入仓库名" name="project" />
        </Form.Item>
        <Form.Item>
          {errorMsg && <div className={styles.errorMsg}>
            {errorMsg}
          </div>
          }
          <div className={styles.action}>
            {children}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateDEFProjectForm;
