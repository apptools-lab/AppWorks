import React, { useState, useEffect } from 'react';
import { Card, Form, Field, Step, Button, Notification } from '@alifd/next';
import { IMaterialScaffold } from '@/iceworks/material-utils';
import callService from '@/callService';
import ScaffoldMarket from './components/ScaffoldMarket';
import CreateProjectForm from './components/CreateProjectForm';
import CreateDEFProjectForm from './components/CreateDEFProjectForm';
import InitProjectSuccess from './components/InitProjectSuccess';
import Header from './components/Header';
import styles from './index.module.scss';

const CLIENT_TOKEN = process.env.CLIENT_TOKEN;

interface IProjectField {
  projectName: string;
  projectPath: string;
  scaffold: IMaterialScaffold;
}
const CreateProject: React.FC = () => {
  const projectField = Field.useField();
  const DEFProjectField = Field.useField();

  const [scaffoldTypeSelected, setScaffoldTypeSelected] = useState('');
  const [currentStep, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [projectDir, setProjectDir] = useState('');
  const [isAliInternal, setIsAliInternal] = useState(false)
  const [currentProjectField, setCurrentProjectField] = useState({});

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
      Notification.error({ title: 'Error', content: '请选择一个模板！' });
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
    setLoading(true);
    const { errors } = await projectField.validatePromise();
    if (errors) {
      setLoading(false);
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
        const projectDir = await callService('project', 'createProject', values);
        setProjectDir(projectDir);
      } else {
        setCurrentProjectField(values);
      }
      setLoading(false);
      goNext();
    } catch (e) {
      Notification.error({ title: 'Error', content: e.message });
      setLoading(false);
    }
  };

  async function onDEFProjectDetailSubmit() {
    setLoading(true);
    const { errors } = await DEFProjectField.validatePromise();
    if (errors) {
      setLoading(false);
      return;
    }
    const values: any = DEFProjectField.getValues();
    const { empId, account, gitlabToken } = values;
    try {
      const projectDir = await callService('project', 'CreateDEFProjectAndCloneRepository', { ...values, ...currentProjectField, clientToken: CLIENT_TOKEN });
      await callService('common', 'saveDataToSettingJson', 'user', { empId, account, gitlabToken })
      setProjectDir(projectDir);
      setLoading(false);
      goNext();
    } catch (e) {
      Notification.error({ title: 'Error', content: e.message });
      setLoading(false);
    }
  }

  async function goNext() {
    setStep(currentStep + 1);
  };

  function goPrev() {
    if (currentStep - 1 == 0) {
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
        <Button onClick={goPrev} style={{ marginRight: '5px' }}>上一步</Button>
        <Form.Submit
          type="primary"
          onClick={onProjectDetailSubmit}
          validate
          loading={loading}
        >下一步</Form.Submit>
      </>;
      break;
    case 2:
      actions = <>
        <Button onClick={goPrev} style={{ marginRight: '5px' }}>上一步</Button>
        <Form.Submit
          type="primary"
          onClick={onDEFProjectDetailSubmit}
          validate
          loading={loading}
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
        if (isAliInternal) {
          const data = await callService('common', 'getDataFromSettingJson', 'user') || {};
          DEFProjectField.setValues(data)
        }
      } catch (error) {
      }
    }

    checkAliInternal();
  }, [])
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