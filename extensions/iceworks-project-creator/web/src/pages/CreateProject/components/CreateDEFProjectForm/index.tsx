import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from '@alifd/next';
import { IDEFProjectField, IGitLabGroup, IGitLabExistProject } from '@/types';
import callService from '@/callService';
import { useIntl, FormattedMessage } from 'react-intl';
import { ALI_GITACCOUNT_URL, ALI_GITACCOUNT_SHORTURL } from '@iceworks/constant'
import styles from './index.module.scss';

interface ICreateDEFProjectFormProps {
  value: IDEFProjectField;
  children: React.ReactNode;
  errorMsg?: string;
  onChange: (value: IDEFProjectField) => void;
};

const CreateDEFProjectForm: React.FC<ICreateDEFProjectFormProps> = ({
  value,
  children,
  errorMsg,
  onChange,
}) => {
  const [empInfoShowed, setEmpInfoShowed] = useState(false);
  const [existProjects, setExistProjects] = useState([]);
  const [gitLabGroups, setGitLabGroups] = useState<IGitLabGroup[]>([]);

  useEffect(() => {
    async function initData() {
      let gitlabToken = value.gitlabToken;
      if (!(value.empId && value.account)) {
        gitlabToken = await getUserInfo();
      }
      await getExistProjects(gitlabToken);
      await getGitLabGroups(gitlabToken)
    }

    initData();
  }, []);

  async function getUserInfo() {
    try {
      const userInfo = await callService('common', 'getUserInfo');
      const { empId, account, gitlabToken } = userInfo;
      onChange({ ...value, empId, account, gitlabToken });
      return gitlabToken;
    } catch (e) {
      setEmpInfoShowed(true);
      return '';
    }
  }

  async function getExistProjects(gitlabToken) {
    try {
      const projects = await callService('common', 'getExistProjects', gitlabToken);
      setExistProjects(projects);
    } catch (e) {
      setExistProjects([]);
    }
  }

  async function getGitLabGroups(gitlabToken) {
    try {
      const dataSource = await callService('common', 'getGitLabGroups', gitlabToken);
      setGitLabGroups(dataSource);
    } catch (e) {
      setGitLabGroups([]);
    }
  }

  async function onBlur() {
    await getGitLabGroups(value.gitlabToken);
    await getExistProjects(value.gitlabToken);
  }

  function onValidateProjectName(rule: any, value: string, callback: (error?: string) => void) {
    if (existProjects.filter((item: IGitLabExistProject) => item.name === value).length) {
      return callback(intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProject.nameExist' }))
    }
    return callback()
  };
  const intl = useIntl();
  return (
    <div className={styles.container}>
      <Form value={value} onChange={onChange} className={styles.form} responsive fullWidth labelAlign="top">
        {empInfoShowed && (
          <>
            <Form.Item
              colSpan={12}
              label={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.empId' })}
              required
              requiredMessage={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputEmpId' })}
            >
              <Input placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputEmpId' })} name="empId" />
            </Form.Item>
            <Form.Item
              colSpan={12}
              label={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.account' })}
              required
              requiredMessage={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputAccount' })}
            >
              <Input placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputAccount' })} name="account" />
            </Form.Item>
          </>
        )}
        <Form.Item
          colSpan={12}
          label="GitLab Token"
          help={<span className={styles.help}>
            <FormattedMessage id='web.iceworksProjectCreator.CreateDEFProjectForm.open'/>
            <a href={ALI_GITACCOUNT_URL} rel="noopener noreferrer" target="_blank">{ALI_GITACCOUNT_SHORTURL}</a> 
            <FormattedMessage id='web.iceworksProjectCreator.CreateDEFProjectForm.copy'/> <b>Private Token</b></span>}
          required
          requiredMessage={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputGitLabToken' })}
          onBlur={onBlur}
        >
          <Input placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputGitLabToken' })} name="gitlabToken" />
        </Form.Item>
        <Form.Item
          colSpan={6}
          label="GitLab Group"
          required
          requiredMessage={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputGitLabGroup' })}
        >
          <Select
            placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputGitLabGroup' })}
            name="group"
            fillProps="name"
            key="name"
            showSearch
          >
            {gitLabGroups.map(item => (
              <Select.Option value={item.name}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          colSpan={6}
          label={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.reposity' })}
          required
          requiredMessage={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputReposity' })}
          autoValidate
          validator={onValidateProjectName}
        >
          <Input placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateDEFProjectForm.inputReposity' })} name="project" />
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
