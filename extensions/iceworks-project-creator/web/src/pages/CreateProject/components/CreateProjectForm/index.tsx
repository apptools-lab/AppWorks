import * as React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from '@alifd/next';
import { IProjectField } from '@/types';
import folderIcon from '@/assets/folder.svg';
import RaxScaffoldTypeForm from '../RaxScaffoldTypeForm';
import styles from './index.module.scss';


interface IProjectFormProps {
  value: IProjectField;
  children: React.ReactNode;
  onChange: (value: object) => void;
  onOpenFolderDialog: () => void;
  errorMsg?: string;
}

const CreateProjectForm: React.FC<IProjectFormProps> = ({ value, onOpenFolderDialog, children, onChange, errorMsg }) => {
  const intl = useIntl();
  const { source: { type } } = value;

  return (
    <div className={styles.container}>
      <Form value={value} onChange={onChange} className={styles.form} responsive fullWidth labelAlign="top">
        <Form.Item
          colSpan={12}
          label={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateProjectForm.projectName'})}
          required
          requiredMessage={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateProjectForm.inputProjectName'})}
          pattern={/^[a-z]([-_a-z0-9]*)$/i}
          patternMessage={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateProjectForm.projectNamePattern'})}
        >
          <Input placeholder={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateProjectForm.inputProjectName'})} name="projectName" />
        </Form.Item>
        <Form.Item colSpan={12} label={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateProjectForm.storage'})} required requiredMessage="请选择应用存储的本地路径">
          <Input
            placeholder={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateProjectForm.chooseLocalPath'})} 
            name="projectPath"
            aria-label="projectPath"
            readOnly
            innerAfter={<img onClick={onOpenFolderDialog} className={styles.folderIcon} src={folderIcon} alt="folder" />}
          />
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
      {type === 'rax' && <div className={styles.scaffoldTypeForm}>
        <RaxScaffoldTypeForm onChange={onChange} value={value} />
      </div>}
    </div>
  );
};

export default CreateProjectForm;
