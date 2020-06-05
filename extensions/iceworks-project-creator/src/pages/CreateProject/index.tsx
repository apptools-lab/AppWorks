import React, { useState, useEffect } from 'react';
import { Card, Form, Field, Step, Button, Notification } from '@alifd/next';
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
  const projectField = Field.useField();
  const DEFProjectField = Field.useField();

  const [scaffoldTypeSelected, setScaffoldTypeSelected] = useState('');
  const [currentStep, setStep] = useState<number>(0);
  const [createProjectLoading, setCreateProjectLoading] = useState(false);
  const [createDEFProjectLoading, setCreateDEFProjectLoading] = useState(false);
  const [projectDir, setProjectDir] = useState('');
  const [isAliInternal, setIsAliInternal] = useState(false)
  const [currentProjectField, setCurrentProjectField] = useState<IProjectField>();
  const [settingJsonData, setSettingJsonData] = useState<ISettingJsonData>(defaultSettingJsonData)
  const steps = [
    {
      title: '选择模板',
      content: <ScaffoldMarket onScaffoldSelect={onScaffoldSelect} />
    },
    {
      title: '填写信息',
      content: <CreateProjectForm field={projectField} onOpenFolderDialog={onOpenFolderDialog} />
    },
    {
      title: '初始化项目成功',
      content: <InitProjectSuccess projectDir={projectDir} />
    }
  ];

  if (isAliInternal) {
    steps.splice(2, 0, {
      title: '创建DEF项目',
      content: <CreateDEFProjectForm field={DEFProjectField} />
    })
  }

  function onScaffoldSelect(scaffoldType, scaffold) {
    projectField.setValue('scaffold', scaffold);
    projectField.setValue('scaffoldType', scaffoldType);
  };

  async function onScaffoldSubmit() {
    if (!projectField.getValue('scaffold')) {
      Notification.error({ content: '请选择一个模板！' });
      return;
    }
    setScaffoldTypeSelected(projectField.getValue('scaffoldType'))
    goNext();
  }

  async function onOpenFolderDialog() {
    try {
      const data = await callService('project', 'getProjectPath');
      projectField.setValue('projectPath', data);
    } catch (e) {
    };
  }

  async function onProjectDetailSubmit() {
    setCreateProjectLoading(true);
    const { errors } = await projectField.validatePromise();
    if (errors) {
      setCreateProjectLoading(false);
      return;
    }
    const values: IProjectField = projectField.getValues();
    const { projectPath, projectName } = values;
    try {
      const isPathExists = await callService('common', 'checkPathExists', projectPath, projectName);
      if (isPathExists) {
        throw new Error('该路径已存在，请重新选择！')
      }
      if (!isAliInternal) {
        await createProject(currentProjectField!)
      } else {
        setCurrentProjectField(values);
        DEFProjectField.setValue('project', values.projectName)
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
      await createProject(currentProjectField!)
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

  async function onDEFProjectDetailSubmit() {
    setCreateDEFProjectLoading(true);
    const { errors } = await DEFProjectField.validatePromise();
    if (errors) {
      setCreateDEFProjectLoading(false);
      return;
    }
    const { projectPath } = currentProjectField as IProjectField;
    const values: IDEFProjectField = DEFProjectField.getValues();
    const { empId, account, gitlabToken } = values;
    try {
      const projectDir = await callService('project', 'CreateDEFProjectAndCloneRepository', { ...values, ...currentProjectField, clientToken: CLIENT_TOKEN });
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

  let actions;
  switch (currentStep) {
    case 0:
      actions = <Button type="primary" onClick={onScaffoldSubmit}>下一步</Button>;
      break;
    case 1:
      actions = <>
        <Button onClick={goPrev} className={styles.btn}>上一步</Button>
        <Form.Submit
          type="primary"
          onClick={onProjectDetailSubmit}
          validate
          loading={createProjectLoading}
        >下一步</Form.Submit>
      </>;
      break;
    case 2:
      actions = <>
        <Button onClick={goPrev} className={styles.btn}>上一步</Button>
        <Button onClick={skipCreateDEFProject} className={styles.btn} loading={createProjectLoading}>跳过创建DEF项目</Button>
        <Form.Submit
          type="primary"
          onClick={onDEFProjectDetailSubmit}
          validate
          loading={createDEFProjectLoading}
        >下一步</Form.Submit>
      </>;
      break;
    default:
      break;
  }
  useEffect(() => {
    async function checkAliInternal() {
      try {
        const isAliInternal = await callService('common', 'checkIsAliInternal') as boolean;
        setIsAliInternal(isAliInternal);
      } catch (e) {
        Notification.error({ content: e.message })
      }
    }
    checkAliInternal();
  }, []);

  useEffect(() => {
    async function setDefaultFields() {
      const data = await callService('common', 'getDataFromSettingJson', 'user') || {};
      const { empId, account, projectPath, gitlabToken } = data;
      projectField.setValues({ projectPath })
      setSettingJsonData(data)
      if (isAliInternal) {
        DEFProjectField.setValues({ empId, account, gitlabToken })
      }
    }
    setDefaultFields()
  }, [currentStep])
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
          <div className={styles.actions}>{actions}</div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default CreateProject;