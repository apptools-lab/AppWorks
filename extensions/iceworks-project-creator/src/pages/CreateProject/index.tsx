import React, { useState, useEffect } from 'react';
import { Card, Form, Field, Step, Button } from '@alifd/next';
import ScaffoldMarket from './components/ScaffoldMarket';
import CreateProjectForm from './components/CreateProjectForm';
import InitProject from './components/InitProject';
import styles from './index.module.scss';

const CreateProject: React.FC = () => {
  const projectField = Field.useField();
  const [currentStep, setStep] = useState<number>(0);
  const steps = [
    {
      title: '选择模板',
      content: <ScaffoldMarket />
    },
    {
      title: '填写信息',
      content: <CreateProjectForm field={projectField} onOpenFolderDialog={onOpenFolderDialog} />
    },
    {
      title: '初始化项目',
      content: <InitProject goInitial={goInitial} />
    }
  ];

  async function onOpenFolderDialog() {
    const vscode = acquireVsCodeApi();
    vscode.postMessage({
      command: 'openFolderDialog'
    });
  }

  const onSubmit = async () => {
    const { errors } = await projectField.validatePromise();
    if (errors) {
      return;
    }
    const values = projectField.getValues();
    console.log('values:', values);

    goNext();
  };

  async function goNext() {
    setStep(currentStep + 1);
  };

  function goPrev() {
    setStep(currentStep - 1);
  };

  function goInitial() {
    setStep(0);
  };

  let actions;
  switch (currentStep) {
    case 0:
      actions = <Button type="primary" onClick={goNext}>下一步</Button>;
      break;
    case 1:
      actions = <>
        <Button onClick={goPrev} style={{ marginRight: '5px' }}>上一步</Button>
        <Form.Submit
          type="primary"
          onClick={onSubmit}
          validate
        >下一步</Form.Submit>
      </>;
      break;
    default:
      break;
  }
  useEffect(() => {
    function listener(event) {
      const message = event.data;
      if (message.command === 'onGetProjectPath') {
        projectField.setValue('projectPath', message.projectPath);
      }
    }
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, []);
  return (
    <Card free>
      <Card.Content className={styles.StepForm}>
        <Step current={currentStep} shape="circle">
          {steps.map((step) => (
            <Step.Item key={step.title} title={step.title} />
          ))}
        </Step>
        <div className={styles.content}>{steps[currentStep].content}</div>
        <div className={styles.actions}>{actions}</div>
      </Card.Content>
    </Card>
  );
};

export default CreateProject;