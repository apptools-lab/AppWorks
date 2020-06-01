import * as React from 'react';
import { Form, Input } from '@alifd/next';
import styles from './index.module.scss';

interface IProjectFormProps {
  field: any;
  onOpenFolderDialog: () => void;
}

const CreateProjectForm: React.FC<IProjectFormProps> = ({ field, onOpenFolderDialog }) => {
  return (
    <Form field={field} className={styles.form} responsive fullWidth labelAlign="top">
      <Form.Item
        colSpan={12}
        label="projectName"
        required
        requiredMessage="Please input the project name"
        pattern={/^[a-z]([-_a-z0-9]*)$/i}
        patternMessage="Please enter a combination of letters and numbers, beginning with a letter"
      >
        <Input placeholder="Please input the project name" name="projectName" />
      </Form.Item>
      <Form.Item colSpan={12} label="projectPath" required requiredMessage="Please select the project path">
        <Input
          placeholder="Please select the project path"
          name="projectPath"
          aria-label="projectPath"
          readOnly
          innerAfter={<img onClick={onOpenFolderDialog} className={styles.folderIcon} src={require('@/assets/folder.svg')} />}
        />
      </Form.Item>
    </Form>
  );
};

export default CreateProjectForm;
