import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Step, Button, Notification, Icon } from '@alifd/next';
import callService from '@/callService';
import { IProjectField, IDEFProjectField, IGitLabExistProject } from '@/types';
import ScaffoldMarket from './components/ScaffoldMarket';
import CreateProjectForm from './components/CreateProjectForm';
import CreateDEFProjectForm from './components/CreateDEFProjectForm';
import styles from './index.module.scss';

const CLIENT_TOKEN = process.env.CLIENT_TOKEN;

const CreateProject: React.FC = () => {
  const [currentStep, setStep] = useState<number>(0);
  const [createProjectLoading, setCreateProjectLoading] = useState(false);
  const [createDEFProjectLoading, setCreateDEFProjectLoading] = useState(false);
  const [isAliInternal, setIsAliInternal] = useState(false)
  const [curProjectField, setCurProjectField] = useState<IProjectField>({} as any);
  const [curDEFProjectField, setCurDEFProjectField] = useState<IDEFProjectField>({} as any);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [createProjectBtnDisabled, setCreateProjectBtnDisabled] = useState(false);
  const [createDEFProjectDisabled, setCreateDEFProjectDisabled] = useState(false);
  const [projectFormErrorMsg, setProjectFormErrorMsg] = useState('');
  const [DEFFormErrorMsg, setDEFFormErrorMsg] = useState('');
  const [groupDataSource, setGroupDataSource] = useState([]);
  const existProjectsRef = useRef([]);
  const steps = [
    {
      title: '选择模板',
      content: (
        <ScaffoldMarket onScaffoldSelect={onScaffoldSelect} onOpenConfigPanel={onOpenConfigPanel}>
          <Button type="primary" onClick={onScaffoldSubmit}>下一步</Button>
        </ScaffoldMarket>
      )
    },
    {
      title: '填写信息',
      content: (
        <CreateProjectForm value={curProjectField} onOpenFolderDialog={onOpenFolderDialog} onChange={onProjectFormChange} errorMsg={projectFormErrorMsg}>
          <Button onClick={goPrev} className={styles.btn} disabled={prevBtnDisabled}>上一步</Button>
          <Form.Submit
            type="primary"
            onClick={onProjectDetailSubmit}
            validate
            loading={createProjectLoading}
            disabled={createProjectBtnDisabled}
          >{isAliInternal ? '下一步' : '完成'}</Form.Submit>
        </CreateProjectForm>
      )
    }
  ];

  if (isAliInternal) {
    steps.splice(2, 0, {
      title: '创建 DEF 应用',
      content: (
        <CreateDEFProjectForm
          value={curDEFProjectField}
          onChange={onDEFProjectFormChange}
          skipCreateDEFProject={skipCreateDEFProject}
          createProjectLoading={createProjectLoading}
          createProjectBtnDisabled={createProjectBtnDisabled}
          errorMsg={DEFFormErrorMsg}
          onAccountBlur={onAccountBlur}
          onValidateProjectName={onValidateProjectName}
          dataSource={groupDataSource}
        >
          <Button onClick={goPrev} className={styles.btn} disabled={prevBtnDisabled}>上一步</Button>
          <Form.Submit
            type="primary"
            onClick={onDEFProjectDetailSubmit}
            validate
            loading={createDEFProjectLoading}
            disabled={createDEFProjectDisabled}
            className={styles.btn}
          >完成</Form.Submit>
        </CreateDEFProjectForm>
      )
    })
  }

  function goNext() {
    setStep(currentStep + 1);
  };

  function goPrev() {
    if (currentStep === 1) {
      setCurProjectField({ ...curProjectField, scaffold: null });
    }
    setStep(currentStep - 1);
  };

  function onScaffoldSelect(scaffold) {
    setCurProjectField({ ...curProjectField, scaffold })
  };

  async function onScaffoldSubmit() {
    if (!curProjectField.scaffold) {
      Notification.error({ content: '请选择一个模板！' });
      return;
    }
    goNext();
  }

  async function onOpenFolderDialog() {
    try {
      const projectPath = await callService('project', 'getProjectPath');
      setCurProjectField({ ...curProjectField, projectPath })
    } catch (e) {
      // ignore
    };
  }

  function onProjectFormChange(value) {
    setCurProjectField({ ...curProjectField, ...value })
  }

  async function onProjectDetailSubmit(values: any, errors: any) {
    setProjectFormErrorMsg('');
    if (errors) {
      setCreateProjectLoading(false);
      return;
    }
    setCreateProjectLoading(true);
    setPrevBtnDisabled(true);
    const { projectPath, projectName } = values;
    try {
      const isPathExists = await callService('common', 'checkPathExists', projectPath, projectName);
      if (isPathExists) {
        throw new Error('该路径已存在，请重新选择！');
      }
      if (!isAliInternal) {
        await createProject(values)
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
  };

  async function onAccountBlur() {
    try {
      const { gitlabToken } = curDEFProjectField;
      const dataSource = await callService('common', 'getGitLabGroups', gitlabToken);
      setGroupDataSource(dataSource);
    } catch (e) {
      setGroupDataSource([]);
    }
  }

  function onValidateProjectName(rule: any, value: string, callback: (error?: string) => void) {
    if (existProjectsRef.current.filter((item: IGitLabExistProject) => item.name === value).length) {
      return callback('已存在相同的仓库名，请重新输入')
    }
    return callback()
  };

  function onDEFProjectFormChange(value) {
    setCurDEFProjectField({ ...curDEFProjectField, ...value })
  }

  async function skipCreateDEFProject() {
    setDEFFormErrorMsg('');
    setCreateProjectLoading(true);
    setPrevBtnDisabled(true);
    setCreateDEFProjectDisabled(true);
    try {
      await createProject(curProjectField);
    } catch (e) {
      Notification.error({ content: e.message });
      setDEFFormErrorMsg(e.message);
    } finally {
      setCreateProjectLoading(false);
      setPrevBtnDisabled(false);
      setCreateDEFProjectDisabled(false);
    }
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
      setCreateDEFProjectLoading(false);
      return;
    }
    setCreateDEFProjectLoading(true);
    setPrevBtnDisabled(true);
    setCreateProjectBtnDisabled(true);
    const { projectPath } = curProjectField as IProjectField;
    const { empId, account, gitlabToken } = values;
    let projectDir = '';
    try {
      projectDir = await callService('project', 'CreateDEFProjectAndCloneRepository', { ...values, ...curProjectField, clientToken: CLIENT_TOKEN });
      await callService('common', 'saveDataToSettingJson', 'user', { empId, account, gitlabToken });
      await callService('common', 'saveDataToSettingJson', 'workspace', projectPath);
      await callService('project', 'openLocalProjectFolder', projectDir);
    } catch (e) {
      Notification.error({ content: e.message });
      setDEFFormErrorMsg(e.message);
    } finally {
      setPrevBtnDisabled(false);
      setCreateProjectBtnDisabled(false);
      setCreateDEFProjectLoading(false);
    }
  }

  async function onOpenConfigPanel() {
    try {
      await callService('common', 'openConfigPanel');
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  useEffect(() => {
    async function checkAliInternal() {
      try {
        const isAliInternal = await callService('common', 'checkIsAliInternal') as boolean;
        setIsAliInternal(isAliInternal);
        return isAliInternal;
      } catch (e) {
        Notification.error({ content: e.message })
      }
      return false
    }
    async function setDefaultFields(isAliInternal) {
      try {
        const userData = await callService('common', 'getDataFromSettingJson', 'user') || {};
        const workspace = await callService('common', 'getDataFromSettingJson', 'workspace') || '';
        const { empId, account, gitlabToken } = userData;
        setCurProjectField({ ...curProjectField, projectPath: workspace })
        if (isAliInternal) {
          setCurDEFProjectField({ ...curDEFProjectField, empId, account, gitlabToken });
          const dataSource = await callService('common', 'getGitLabGroups', gitlabToken);
          setGroupDataSource(dataSource);
          existProjectsRef.current = await callService('common', 'getExistProjects', gitlabToken);
        }
      } catch (e) {
        // ignore
      }
    }
    const isAliInternal = checkAliInternal();
    setDefaultFields(isAliInternal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Card free>
      <Card.Content className={styles.cardContent}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>创建应用</span>
          <Button text onClick={onOpenConfigPanel}><Icon type="set" />设置</Button>
        </div>
        <Step current={currentStep} shape="circle" className={styles.step} readOnly>
          {steps.map((step) => (
            <Step.Item key={step.title} title={step.title} />
          ))}
        </Step>
        <div className={styles.content}>{steps[currentStep].content}</div>
      </Card.Content>
    </Card>
  );
};

export default CreateProject;