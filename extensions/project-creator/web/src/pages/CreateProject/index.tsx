import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Notification, Icon, Loading } from '@alifd/next';
import callService from '@/callService';
import { IProjectField, IDEFProjectField } from '@/types';
import { LocaleProvider } from '@/i18n';
import { useIntl, FormattedMessage } from 'react-intl';
import { IMaterialSource } from '@appworks/material-utils';
import ScaffoldMarket from './components/ScaffoldMarket';
import CreateProjectForm from '@/components/CreateProjectForm';
import CreateDEFProjectForm from './components/CreateDEFProjectForm';
import styles from './index.module.scss';

const { CLIENT_TOKEN } = process.env;

const CreateProject: React.FC = () => {
  const intl = useIntl();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [createProjectLoading, setCreateProjectLoading] = useState(false);
  const [createDEFProjectLoading, setCreateDEFProjectLoading] = useState(false);
  const [isAliInternal, setIsAliInternal] = useState(false);
  const [curProjectField, setCurProjectField] = useState<IProjectField>({} as any);
  const [curDEFProjectField, setCurDEFProjectField] = useState<IDEFProjectField>({} as any);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [projectFormErrorMsg, setProjectFormErrorMsg] = useState('');
  const [DEFFormErrorMsg, setDEFFormErrorMsg] = useState('');
  const [materialSources, setMaterialSources] = useState<IMaterialSource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const steps = [
    <ScaffoldMarket
      isAliInternal={isAliInternal}
      onScaffoldSelect={onScaffoldSelect}
      curProjectField={curProjectField}
      onOpenConfigPanel={onOpenConfigPanel}
      materialSources={materialSources}
      onScaffoldSubmit={onScaffoldSubmit}
    >
      <Button type="primary" onClick={onScaffoldSubmit}>
        <FormattedMessage id="web.iceworksProjectCreator.CreateProject.nextStep" />
      </Button>
    </ScaffoldMarket>,
    <CreateProjectForm
      value={curProjectField}
      onOpenFolderDialog={onOpenFolderDialog}
      onChange={onProjectFormChange}
      errorMsg={projectFormErrorMsg}
      loading={createProjectLoading}
    >
      <Button onClick={goPrev} className={styles.btn} disabled={prevBtnDisabled}>
        <FormattedMessage id="web.iceworksProjectCreator.CreateProject.previous" />
      </Button>
      {isAliInternal && (
        <Form.Submit
          className={styles.btn}
          onClick={(values, error) => onProjectDetailSubmit(values, error, true)}
          validate
          disabled={createProjectLoading}
        >
          <FormattedMessage id="web.iceworksProjectCreator.CreateProject.createDEF" />
        </Form.Submit>
      )}
      <Form.Submit
        type="primary"
        onClick={(values, error) => onProjectDetailSubmit(values, error, false)}
        validate
        loading={createProjectLoading}
      >
        <FormattedMessage id="web.iceworksProjectCreator.CreateProject.complete" />
      </Form.Submit>
    </CreateProjectForm>,
  ];

  if (isAliInternal) {
    steps.splice(2, 0,
      <CreateDEFProjectForm
        value={curDEFProjectField}
        onChange={onDEFProjectFormChange}
        errorMsg={DEFFormErrorMsg}
        loading={createDEFProjectLoading}
      >
        <Button onClick={goPrev} className={styles.btn} disabled={prevBtnDisabled}>
          <FormattedMessage id="web.iceworksProjectCreator.CreateProject.previous" />
        </Button>
        <Form.Submit
          type="primary"
          onClick={onDEFProjectDetailSubmit}
          validate
          loading={createDEFProjectLoading}
          disabled={createDEFProjectLoading}
          className={styles.btn}
        >
          <FormattedMessage id="web.iceworksProjectCreator.CreateProject.complete" />
        </Form.Submit>
      </CreateDEFProjectForm>);
  }

  function goNext() {
    setCurrentStep(currentStep + 1);
  }

  function goPrev() {
    setCurrentStep(currentStep - 1);
  }

  function onScaffoldSelect(source, scaffold) {
    setCurProjectField({ ...curProjectField, scaffold, source });
  }

  async function onScaffoldSubmit() {
    if (!curProjectField.scaffold) {
      Notification.error({
        content: intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProject.chooseTemplate' }),
      });
      return;
    }
    goNext();
  }

  async function onOpenFolderDialog() {
    try {
      const projectPath = await callService('project', 'getFolderPath');
      if (projectPath) {
        setCurProjectField({ ...curProjectField, projectPath });
      }
    } catch (e) {
      // ignore
    }
  }

  function onProjectFormChange(value) {
    setCurProjectField({ ...curProjectField, ...value });
  }

  async function onProjectDetailSubmit(values: any, errors: any, isCreateDEFProject: boolean) {
    setProjectFormErrorMsg('');
    if (errors) {
      return;
    }
    setCreateProjectLoading(true);
    setPrevBtnDisabled(true);
    const { projectPath, projectName } = values;
    try {
      const isPathExists = await callService('common', 'checkPathExists', projectPath, projectName);
      if (isPathExists) {
        throw new Error(intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProject.pathExist' }));
      }
      if (!isCreateDEFProject) {
        await createProject(values);
      } else {
        setCurProjectField(values);
        setCurDEFProjectField({ ...curDEFProjectField, project: values.projectName });
        goNext();
      }
    } catch (e) {
      Notification.error({ content: e.message });
      setProjectFormErrorMsg(e.message);
    } finally {
      setCreateProjectLoading(false);
      setPrevBtnDisabled(false);
    }
  }

  function onDEFProjectFormChange(value) {
    setCurDEFProjectField({ ...curDEFProjectField, ...value });
  }

  async function createProject(data: IProjectField) {
    const projectDir = await callService('project', 'createProject', data);
    const { projectPath } = data;
    await callService('common', 'saveDataToSettingJson', 'workspace', projectPath);
    await callService('project', 'openLocalProjectFolder', projectDir);
  }

  async function onDEFProjectDetailSubmit(values: any, errors: any) {
    setDEFFormErrorMsg('');
    if (errors) {
      return;
    }
    setCreateDEFProjectLoading(true);
    setPrevBtnDisabled(true);
    const { projectPath } = curProjectField as IProjectField;
    const { empId, account, gitlabToken } = values;
    let projectDir = '';
    try {
      projectDir = await callService('project', 'createDEFProjectAndCloneRepository', {
        ...values,
        ...curProjectField,
        clientToken: CLIENT_TOKEN,
      });
      await callService('user', 'saveUserInfo', { empId, account, gitlabToken });
      await callService('common', 'saveDataToSettingJson', 'workspace', projectPath);
      await callService('project', 'openLocalProjectFolder', projectDir);
    } catch (e) {
      Notification.error({ content: e.message });
      setDEFFormErrorMsg(e.message);
    } finally {
      setPrevBtnDisabled(false);
      setCreateDEFProjectLoading(false);
    }
  }

  async function onOpenConfigPanel() {
    try {
      await callService('common', 'openMaterialsSettings');
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  async function onSettingsClick() {
    try {
      await callService('common', 'executeCommand', 'applicationManager.configHelper.start');
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  async function getMaterialSources() {
    const sources: any = (await callService('material', 'getSources')) as IMaterialSource[];
    setMaterialSources(sources);
    return sources;
  }
  async function refreshMaterialSources() {
    await callService('material', 'cleanCache');
    const sources = await getMaterialSources();
    setMaterialSources(sources);
  }

  useEffect(() => {
    async function checkAliInternal() {
      try {
        const result = (await callService('common', 'checkIsAliInternal')) as boolean;
        setIsAliInternal(result);
      } catch (e) {
        Notification.error({ content: e.message });
      }
    }
    async function setDefaultFields() {
      const workspace = (await callService('common', 'getDataFromSettingJson', 'workspace')) || '';
      setCurProjectField({ ...curProjectField, projectPath: workspace });
    }
    async function initMaterialSources() {
      const sources = await getMaterialSources();
      setMaterialSources(sources);
    }
    async function initData() {
      try {
        setLoading(true);
        await checkAliInternal();
        await initMaterialSources();
        await setDefaultFields();
      } catch (e) {
        Notification.error({ content: e.message });
      } finally {
        setLoading(false);
      }
    }
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <Card free>
        <Card.Content className={styles.cardContent}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>
                <FormattedMessage id="web.iceworksProjectCreator.CreateProject.createProject" />
              </div>
              <div className={styles.subTitle}>
                <FormattedMessage id="web.iceworksProjectCreator.CreateProject.subTitle" />
              </div>
            </div>
            <div className={styles.headerBtns}>
              <Button size="medium" text onClick={onSettingsClick} className={styles.btn}>
                <Icon type="set" />
                <FormattedMessage id="web.iceworksProjectCreator.CreateProject.setting" />
              </Button>
              {currentStep === 0 && (
                <Button size="medium" text onClick={refreshMaterialSources}>
                  <Icon type="refresh" />
                  <FormattedMessage id="web.iceworksProjectCreator.CreateProject.refresh" />
                </Button>
              )}
            </div>
          </div>
          {loading ? (
            <Loading className={styles.loading} visible={loading} />
          ) : (<div className={styles.content}>{steps[currentStep]}</div>)}
        </Card.Content>
      </Card>
    </div>
  );
};

const IntlCreateProject = () => {
  return (
    <LocaleProvider>
      <CreateProject />
    </LocaleProvider>
  );
};

export default IntlCreateProject;
