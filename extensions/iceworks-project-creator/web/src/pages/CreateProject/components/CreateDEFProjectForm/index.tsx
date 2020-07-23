import React from 'react';
import { Form, Input, Select } from '@alifd/next';
import { IDEFProjectField, IGitLabGroup } from '@/types';
import { useIntl, FormattedMessage } from 'react-intl';
import { ALI_GITACCOUNT_URL, ALI_GITACCOUNT_SHORTURL } from '@iceworks/constant'
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
  const intl = useIntl();
  return (
    <div className={styles.container}>
      <Form value={value} onChange={onChange} className={styles.form} responsive fullWidth labelAlign="top">
        <Form.Item
          colSpan={12}
          label={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.empId'})}
          required
          requiredMessage={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputEmpId'})}
        >
          <Input placeholder={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputEmpId'})} name="empId" />
        </Form.Item>
        <Form.Item
          colSpan={12}
          label={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.account'})}
          required
          requiredMessage={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputAccount'})}
        >
          <Input placeholder={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputAccount'})} name="account" />
        </Form.Item>
        <Form.Item
          colSpan={12}
          label="GitLab Token"
          help={<span className={styles.help}>
            <FormattedMessage id='web.iceworksProjectCreator.CreateDEFProjectForm.open'/>
            <a href={ALI_GITACCOUNT_URL} rel="noopener noreferrer" target="_blank">{ALI_GITACCOUNT_SHORTURL}</a> 
            <FormattedMessage id='web.iceworksProjectCreator.CreateDEFProjectForm.copy'/> <b>Private Token</b></span>}
          required
          requiredMessage={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputGitLabToken'})}
          onBlur={onAccountBlur}
        >
          <Input placeholder={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputGitLabToken'})} name="gitlabToken" />
        </Form.Item>
        <Form.Item
          colSpan={6}
          label="GitLab Group"
          required
          requiredMessage={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputGitLabGroup'})}
        >
          <Select
            placeholder={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputGitLabGroup'})}
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
          label={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.reposity'})}
          required
          requiredMessage={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputReposity'})}
          autoValidate
          validator={onValidateProjectName}
        >
          <Input placeholder={intl.formatMessage({id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputReposity'})} name="project" />
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
