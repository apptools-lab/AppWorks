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
  projectPath: '',
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
  const [settingJsonData, setSettingJsonData] = useState<ISettingJsonData>(defaultSettingJsonData)
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
          <Button onClick={goPrev} className={styles.btn}>上一步</Button>
          <Form.Submit
            type="primary"
            onClick={onProjectDetailSubmit}
            validate
            loading={createProjectLoading}
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
          <Button onClick={goPrev} className={styles.btn}>上一步</Button>
          <Button onClick={skipCreateDEFProject} className={styles.btn} loading={createProjectLoading}>跳过创建DEF项目</Button>
          <Form.Submit
            type="primary"
            onClick={onDEFProjectDetailSubmit}
            validate
            loading={createDEFProjectLoading}
          >下一步</Form.Submit>
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
    setCreateProjectLoading(true);
    if (errors) {
      setCreateProjectLoading(false);
      return;
    }
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
      setCreateProjectLoading(false);
      goNext();
    } catch (e) {
      Notification.error({ content: e.message });
      setCreateProjectLoading(false);
    }
  };

  async function skipCreateDEFProject() {
    setCreateProjectLoading(true);
    try {
      await createProject(curProjectField)
      setCreateProjectLoading(false);
      goNext();
    } catch (e) {
      Notification.error({ content: e.message });
      setCreateProjectLoading(false);
    }
  }

  async function createProject(data: IProjectField) {
    const projectDir = await callService('project', 'createProject', data);
    setProjectDir(projectDir);
    const { projectPath } = data;
    await callService('common', 'saveDataToSettingJson', 'user', { ...settingJsonData, projectPath })
  }

  async function onDEFProjectDetailSubmit(values: any, errors: any) {
    setCreateDEFProjectLoading(true);
    if (errors) {
      setCreateDEFProjectLoading(false);
      return;
    }
    const { projectPath } = curProjectField as IProjectField;
    const { empId, account, gitlabToken } = values;
    try {
      const projectDir = await callService('project', 'CreateDEFProjectAndCloneRepository', { ...values, ...curProjectField, clientToken: CLIENT_TOKEN });
      await callService('common', 'saveDataToSettingJson', 'user', { empId, account, gitlabToken, projectPath })
      setProjectDir(projectDir);
      setCreateDEFProjectLoading(false);
      goNext();
    } catch (e) {
      Notification.error({ content: e.message });
      setCreateDEFProjectLoading(false);
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
      const data = await callService('common', 'getDataFromSettingJson', 'user') || {};
      const { empId, account, projectPath, gitlabToken } = data;
      setCurProjectField({ ...curProjectField, projectPath })
      setSettingJsonData(data)
      if (isAliInternal) {
        setCurDEFProjectField({ ...curDEFProjectField, empId, account, gitlabToken })
      }
    }
    const isAliInternal = checkAliInternal();
    setDefaultFields(isAliInternal);
  }, [curDEFProjectField, curProjectField]);
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