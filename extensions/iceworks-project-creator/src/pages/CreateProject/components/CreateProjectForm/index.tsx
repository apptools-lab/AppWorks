import * as React from 'react';
import { Form, Input } from '@alifd/next';
import styles from './index.module.scss';
import { IProjectField } from '@/types';

interface IProjectFormProps {
  value: IProjectField;
  children: React.ReactNode;
  onChange: (value: { projectName: string, projectPath: string }) => void;
  onOpenFolderDialog: () => void;
}

const CreateProjectForm: React.FC<IProjectFormProps> = ({ value, onOpenFolderDialog, children, onChange }) => {
  return (
    <Form value={value} onChange={onChange} className={styles.form} responsive fullWidth labelAlign="top">
      <Form.Item
        colSpan={12}
        label="项目名称"
        required
        requiredMessage="请输入项目名称"
        pattern={/^[a-z]([-_a-z0-9]*)$/i}
        patternMessage="请输入字母和数字的组合，以字母开头"
      >
        <Input placeholder="请输入项目名称" name="projectName" />
      </Form.Item>
      <Form.Item colSpan={12} label="项目路径" required requiredMessage="请选择项目路径">
        <Input
          placeholder="请选择项目路径"
          name="projectPath"
          aria-label="projectPath"
          readOnly
          innerAfter={<img onClick={onOpenFolderDialog} className={styles.folderIcon} src={require('@/assets/folder.svg')} />}
        />
      </Form.Item>
      <div className={styles.action}>
        {children}
      </div>
    </Form>
  );
};

export default CreateProjectForm;
