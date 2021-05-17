import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Notification } from '@alifd/next';
import { useIntl, FormattedMessage } from 'react-intl';
import callService from '@/callService';
import { IProjectField } from '@/types';
import { LocaleProvider } from '@/i18n';
import CreateProjectForm from '@/components/CreateProjectForm';
import ScaffoldForm from './components/ScaffoldForm';
import styles from './index.module.scss';

const defaultScaffoldValue = {
  layout: {
    headerAvatar: true,
    branding: true,
    footer: true,
    type: 'brand',
    fixedHeader: false,
  },
  build: {
    theme: '@alifd/theme-design-pro',
  },
  advance: {
    typescript: true,
  },
  menu: {
    asideMenu: [
      {
        pageName: 'Dashboard',
        path: '/',
        blocks: [
          {
            name: 'Guide',
            type: 'builtIn',
            source: './src/components/Guide',
          },
        ],
      },
    ],
    headerMenu: [],
  },
};

const defaultValue = {
  scaffold: { ...defaultScaffoldValue },
};

const CustomScaffold = () => {
  const intl = useIntl();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [value, setValue] = useState<IProjectField>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);

  function goNext() {
    setCurrentStep(currentStep + 1);
  }

  function goPrev() {
    setCurrentStep(currentStep - 1);
  }

  function onScaffoldSubmit() {
    goNext();
  }

  async function onOpenFolderDialog() {
    try {
      const projectPath = await callService('project', 'getFolderPath');
      setValue({ ...value, projectPath });
    } catch (error) {
      console.log(error);
    }
  }

  async function onProjectDetailSubmit(values, errors) {
    setErrorMsg('');
    if (errors) {
      return;
    }
    setLoading(true);
    setPrevBtnDisabled(true);
    const { projectPath, projectName, scaffold } = values;
    values.scaffold = scaffold;
    try {
      const isPathExists = await callService('common', 'checkPathExists', projectPath, projectName);
      if (isPathExists) {
        throw new Error(intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProject.pathExist' }));
      }
      await createScaffold(values);
    } catch (e) {
      Notification.error({ content: e.message });
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
      setPrevBtnDisabled(false);
    }
  }

  async function createScaffold(data: IProjectField) {
    const { projectPath } = data;

    const projectDir = await callService('scaffold', 'generate', data);
    await callService('common', 'saveDataToSettingJson', 'workspace', projectPath);
    await callService('project', 'openLocalProjectFolder', projectDir);
  }

  function onFormChange(formValue) {
    setValue({ ...value, ...formValue });
  }

  function onScaffoldFormChange(formValue) {
    setValue({ ...value, scaffold: { ...value.scaffold, ...formValue } });
  }
  const steps = [
    <ScaffoldForm onChange={onScaffoldFormChange} scaffoldValue={value.scaffold}>
      <Button type="primary" onClick={onScaffoldSubmit}>
        <FormattedMessage id="web.iceworksProjectCreator.CreateProject.nextStep" />
      </Button>
    </ScaffoldForm>,
    <div className={styles.createProjectForm}>
      <CreateProjectForm
        value={value}
        onOpenFolderDialog={onOpenFolderDialog}
        onChange={onFormChange}
        errorMsg={errorMsg}
        loading={loading}
      >
        <Button onClick={goPrev} className={styles.btn} disabled={prevBtnDisabled}>
          <FormattedMessage id="web.iceworksProjectCreator.CreateProject.previous" />
        </Button>
        <Form.Submit
          type="primary"
          onClick={(values, error) => onProjectDetailSubmit(values, error)}
          validate
          loading={loading}
        >
          <FormattedMessage id="web.iceworksProjectCreator.CreateProject.complete" />
        </Form.Submit>
      </CreateProjectForm>
    </div>,
  ];

  useEffect(() => {
    async function setDefaultValues() {
      const workspace = (await callService('common', 'getDataFromSettingJson', 'workspace')) || '';
      setValue({ ...value, projectPath: workspace });
    }
    setDefaultValues();
    // eslint-disable-next-line
  }, []);
  return (
    <div className={styles.container}>
      <Card free>
        <Card.Content className={styles.cardContent}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>
                <FormattedMessage id="web.iceworksProjectCreator.customScaffold.title" />
              </div>
              <div className={styles.subTitle}>
                <FormattedMessage id="web.iceworksProjectCreator.customScaffold.subTitle" />
              </div>
            </div>
          </div>
          <div className={styles.content}>{steps[currentStep]}</div>
        </Card.Content>
      </Card>
    </div>
  );
};

const IntlCustomScaffold = () => {
  return (
    <LocaleProvider>
      <CustomScaffold />
    </LocaleProvider>
  );
};

export default IntlCustomScaffold;
