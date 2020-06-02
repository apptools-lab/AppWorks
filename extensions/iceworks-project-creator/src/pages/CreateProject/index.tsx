import React, { useState } from 'react';
import { Card, Form, Field, Step, Button, Notification } from '@alifd/next';
import callService from '@/callService';
import ScaffoldMarket from './components/ScaffoldMarket';
import CreateProjectForm from './components/CreateProjectForm';
import InitProjectSuccess from './components/InitProjectSuccess';
import Header from './components/Header';
import styles from './index.module.scss';

const CreateProject: React.FC = () => {
  const projectField = Field.useField();
  const [currentStep, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [projectDir, setProjectDir] = useState('');

  const steps = [
    {
      title: 'Select a Scaffold',
      content: <ScaffoldMarket onScaffoldSelect={onScaffoldSelect} />
    },
    {
      title: 'Input Project Information',
      content: <CreateProjectForm field={projectField} onOpenFolderDialog={onOpenFolderDialog} />
    },
    {
      title: 'Init Project Successfully',
      content: <InitProjectSuccess projectDir={projectDir} />
    }
  ];

  function onScaffoldSelect(scaffold) {
    projectField.setValue('scaffold', scaffold);
  };

  async function onScaffoldSubmit() {
    if (!projectField.getValue('scaffold')) {
      Notification.error({ title: 'Error', content: 'Please select a scaffold.' });
      return;
    }
    goNext();
  }

  async function onOpenFolderDialog() {
    try {
      const data = await callService('project', 'getProjectPath');
      projectField.setValue('projectPath', data);
    } catch (e) {
    };
  }

  const onSubmit = async () => {
    setLoading(true);
    const { errors } = await projectField.validatePromise();
    if (errors) {
      setLoading(false);
      return;
    }
    const values: any = projectField.getValues();
    try {
      const projectDir: any = await callService('project', 'createProject', values);
      setProjectDir(projectDir);
      setLoading(false);
      goNext();
    } catch (e) {
      Notification.error({ title: 'Error', content: 'Fail to init project.' });
      setLoading(false);
    }
  };

  async function goNext() {
    setStep(currentStep + 1);
  };

  function goPrev() {
    setStep(currentStep - 1);
  };

  let actions;
  switch (currentStep) {
    case 0:
      actions = <Button type="primary" onClick={onScaffoldSubmit}>Next Step</Button>;
      break;
    case 1:
      actions = <>
        <Button onClick={goPrev} style={{ marginRight: '5px' }}>Previous Step</Button>
        <Form.Submit
          type="primary"
          onClick={onSubmit}
          validate
          loading={loading}
        >Next Step</Form.Submit>
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