import React, { useState } from 'react';
import { Card, Form, Field, Step, Button } from '@alifd/next';
import ScaffoldMarket from './components/ScaffoldMarket';
import CreateProjectForm from './components/CreateProjectForm';
import InitProject from './components/InitProject';
import styles from './index.module.scss';
import Header from './components/Header';
import callService from '@/service/index';

const CreateProject: React.FC = () => {
  const projectField = Field.useField();
  const [currentStep, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
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
      title: '项目创建完成',
      content: <InitProject />
    }
  ];

  async function onOpenFolderDialog() {
    try {
      const data = await callService('getProjectPath');
      projectField.setValue('projectPath', data);
    } catch (e) {

    };
  }

  function onScaffoldSelect(scaffold) {
    projectField.setValue('scaffold', scaffold);
  };

  const onSubmit = async () => {
    setLoading(true);
    const { errors } = await projectField.validatePromise();
    if (errors) {
      setLoading(false);
      return;
    }

    const values: any = projectField.getValues();
    try {
      await callService('createProject', values);
      setLoading(false);
      goNext();
    } catch (e) {
      await callService('showErrorMessage', '创建项目失败。');
      setLoading(false);
    }
  };

  async function onScaffoldSubmit() {
    if (!projectField.getValue('scaffold')) {
      await callService('showErrorMessage', '请选择一个模块。');
      return;
    }
    goNext();
  }

  async function goNext() {
    setStep(currentStep + 1);
  };

  function goPrev() {
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
          onClick={onSubmit}
          validate
          loading={loading}
        >下一步</Form.Submit>
      </>;
      break;
    default:
      break;
  }
  return (
    <div className={styles.container}>
      <Header />
      <Card free>
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