import React, { useState, useEffect } from 'react';
import { Card, Form, Step, Button, Notification } from '@alifd/next';
import callService from '@/callService';
import { IProjectField, IDEFProjectField, ISettingJsonData } from '@/types';
import ScaffoldMarket from './components/ScaffoldMarket';
import CreateProjectForm from './components/CreateProjectForm';
import CreateDEFProjectForm from './components/CreateDEFProjectForm';
import InitProjectSuccess from './components/InitProjectSuccess';
import Header from './components/Header';
import styles from './index.module.scss';

const CLIENT_TOKEN = process.env.CLIENT_TOKEN;
const defaultSettingJsonData = {
  empId: '',
  account: '',
  gitlabToken: ''
}
const CreateProject: React.FC = () => {
  const [scaffoldTypeSelected, setScaffoldTypeSelected] = useState('');
  const [currentStep, setStep] = useState<number>(0);
  const [createProjectLoading, setCreateProjectLoading] = useState(false);
  const [createDEFProjectLoading, setCreateDEFProjectLoading] = useState(false);
  const [projectDir, setProjectDir] = useState('');
  const [isAliInternal, setIsAliInternal] = useState(false)
  const [curProjectField, setCurProjectField] = useState<IProjectField>({} as any);
  const [curDEFProjectField, setCurDEFProjectField] = useState<IDEFProjectField>({} as any);
  const [settingJsonData, setSettingJsonData] = useState<ISettingJsonData>(defaultSettingJsonData);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [createProjectBtnDisabled, setCreateProjectBtnDisabled] = useState(false);
  const [createDEFProjectDisabled, setCreateDEFProjectDisabled] = useState(false);
  const steps = [
    {
      title: '选择模板',
      content: (
        <ScaffoldMarket onScaffoldSelect={onScaffoldSelect}>
          <Button type="primary" onClick={onScaffoldSubmit}>下一步</Button>
        </ScaffoldMarket>
      )
    },
    {
      title: '填写信息',
      content: (
        <CreateProjectForm value={curProjectField} onOpenFolderDialog={onOpenFolderDialog} onChange={onProjectFormChange}>
          <Button onClick={goPrev} className={styles.btn} disabled={prevBtnDisabled}>上一步</Button>
          <Form.Submit
            type="primary"
            onClick={onProjectDetailSubmit}
            validate
            loading={createProjectLoading}
            disabled={createProjectBtnDisabled}
          >下一步</Form.Submit>
        </CreateProjectForm>
      )
    },
    {
      title: '初始化项目成功',
      content: <InitProjectSuccess projectDir={projectDir} />
    }
  ];

  if (isAliInternal) {
    steps.splice(2, 0, {
      title: '创建DEF项目',
      content: (
        <CreateDEFProjectForm value={curDEFProjectField} onChange={onDEFProjectFormChange}>
          <Button onClick={goPrev} className={styles.btn} disabled={prevBtnDisabled}>上一步</Button>
          <Form.Submit
            type="primary"
            onClick={onDEFProjectDetailSubmit}
            validate
            loading={createDEFProjectLoading}
            disabled={createDEFProjectDisabled}
            className={styles.btn}
          >下一步</Form.Submit>
          <Button onClick={skipCreateDEFProject} loading={createProjectLoading} disabled={createProjectBtnDisabled}>跳过创建DEF项目</Button>
        </CreateDEFProjectForm>
      )
    })
  }

  function onProjectFormChange(value) {
    setCurProjectField({ ...curProjectField, ...value })
  }
  function onDEFProjectFormChange(value) {
    setCurDEFProjectField({ ...curDEFProjectField, ...value })
  }

  function onScaffoldSelect(scaffoldType, scaffold) {
    setCurProjectField({ ...curProjectField, scaffold, scaffoldType })
  };

  async function onScaffoldSubmit() {
    if (!curProjectField.scaffold) {
      Notification.error({ content: '请选择一个模板！' });
      return;
    }
    setScaffoldTypeSelected(curProjectField.scaffoldType)
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

  async function onProjectDetailSubmit(values: any, errors: any) {
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
        throw new Error('该路径已存在，请重新选择！')
      }
      if (!isAliInternal) {
        await createProject(values)
      } else {
        setCurProjectField(values);
        setCurDEFProjectField({ ...curDEFProjectField, project: values.projectName })
      }
      goNext();
    } catch (e) {
      Notification.error({ content: e.message });
    } finally {
      setCreateProjectLoading(false);
      setPrevBtnDisabled(false);
    }
  };

  async function skipCreateDEFProject() {
    setCreateProjectLoading(true);
    setPrevBtnDisabled(true);
    setCreateDEFProjectDisabled(true);
    try {
      await createProject(curProjectField)
      goNext();
    } catch (e) {
      Notification.error({ content: e.message });
    } finally {
      setCreateProjectLoading(false);
      setPrevBtnDisabled(false);
      setCreateDEFProjectDisabled(false);
    }
  }

  async function createProject(data: IProjectField) {
    const projectDir = await callService('project', 'createProject', data);
    setProjectDir(projectDir);
    const { projectPath } = data;
    await callService('common', 'saveDataToSettingJson', 'workspace', projectPath);
  }

  async function onDEFProjectDetailSubmit(values: any, errors: any) {
    if (errors) {
      setCreateDEFProjectLoading(false);
      return;
    }
    setCreateDEFProjectLoading(true);
    setPrevBtnDisabled(true);
    setCreateProjectBtnDisabled(true);
    const { projectPath } = curProjectField as IProjectField;
    const { empId, account, gitlabToken } = values;
    try {
      const projectDir = await callService('project', 'CreateDEFProjectAndCloneRepository', { ...values, ...curProjectField, clientToken: CLIENT_TOKEN });
      await callService('common', 'saveDataToSettingJson', 'user', { empId, account, gitlabToken });
      await callService('common', 'saveDataToSettingJson', 'workspace', projectPath);
      setProjectDir(projectDir);
      setCreateDEFProjectLoading(false);
      goNext();
    } catch (e) {
      Notification.error({ content: e.message });
      setCreateDEFProjectLoading(false);
    } finally {
      setPrevBtnDisabled(false);
      setCreateProjectBtnDisabled(false);
    }
  }

  async function goNext() {
    setStep(currentStep + 1);
  };

  function goPrev() {
    if (currentStep === 1) {
      setScaffoldTypeSelected('')
    }
    setStep(currentStep - 1);
  };

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
      const userData = await callService('common', 'getDataFromSettingJson', 'user') || {};
      const workspace = await callService('common', 'getDataFromSettingJson', 'workspace') || '';
      const { empId, account, gitlabToken } = userData;
      setCurProjectField({ ...curProjectField, projectPath: workspace })
      setSettingJsonData(userData)
      if (isAliInternal) {
        setCurDEFProjectField({ ...curDEFProjectField, empId, account, gitlabToken })
      }
    }
    const isAliInternal = checkAliInternal();
    setDefaultFields(isAliInternal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <Header scaffoldTypeSelected={scaffoldTypeSelected} />
      <Card free className={styles.card}>
        <Card.Content className={styles.step}>
          <Step current={currentStep} shape="circle">
            {steps.map((step) => (
              <Step.Item key={step.title} title={step.title} />
            ))}
          </Step>
          <div className={styles.content}>{steps[currentStep].content}</div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default CreateProject;