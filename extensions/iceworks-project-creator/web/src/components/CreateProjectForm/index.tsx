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
  onChange: (value: Record<string, unknown>) => void;
  onOpenFolderDialog: () => void;
  errorMsg?: string;
  loading: boolean;
}

const CreateProjectForm: React.FC<IProjectFormProps> = ({
  value,
  onOpenFolderDialog,
  children,
  onChange,
  errorMsg,
  loading,
}) => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <Form value={value} onChange={onChange} className={styles.form} responsive fullWidth labelAlign="top">
        <Form.Item
          colSpan={12}
          label={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProjectForm.projectName' })}
          required
          requiredMessage={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProjectForm.inputProjectName' })}
          pattern={/^[a-z]([-_a-z0-9]*)$/i}
          patternMessage={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProjectForm.projectNamePattern' })}
        >
          <Input
            size="small"
            placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProjectForm.inputProjectName' })}
            name="projectName"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          colSpan={12}
          label={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProjectForm.storage' })}
          required
          requiredMessage="请选择应用存储的本地路径"
        >
          <Input
            size="small"
            placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProjectForm.chooseLocalPath' })}
            name="projectPath"
            aria-label="projectPath"
            readOnly
            innerAfter={
              <img onClick={onOpenFolderDialog} className={styles.folderIcon} src={folderIcon} alt="folder" />
            }
            disabled={loading}
          />
        </Form.Item>
        <Form.Item>
          <div className={styles.action}>{children}</div>
        </Form.Item>
      </Form>
      <div className={styles.optionWrap}>
        {value.source && value.source.type === 'rax' && (
          <RaxScaffoldTypeForm onChange={onChange} value={value} disabled={loading} />
        )}
        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
      </div>
    </div>
  );
};

export default CreateProjectForm;
