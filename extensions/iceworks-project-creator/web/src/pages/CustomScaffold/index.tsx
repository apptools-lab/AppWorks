import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Notification } from '@alifd/next';
import { useIntl, FormattedMessage } from 'react-intl';
import callService from '@/callService';
import { IProjectField } from '@/types';
import { LocaleProvider } from '@/i18n';
import CreateProjectForm from '@/components/CreateProjectForm';
import ScaffoldForm from './components/ScaffoldForm';
import { SCAFFOLD_TYPE, themesList, configsList, layoutConfigsList } from './constants';
import styles from './index.module.scss';

const defaultValue = {
  scaffold: {
    name: SCAFFOLD_TYPE,
    theme: themesList[0].value,
    config: [configsList[0].value],
    asideMenu: [],
    headerMenu: [],
    layouts: layoutConfigsList.map(item => item.value),
  },
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
    } catch (e) {
      console.log(e);
    }
  }

  async function onProjectDetailSubmit(values, errors) {
    console.log('project detail submit data ==>', values);
    setErrorMsg('');
    if (errors) {
      return;
    }
    setLoading(true);
    setPrevBtnDisabled(true);
    const { projectPath, projectName } = values;
    try {
      const isPathExists = await callService('common', 'checkPathExists', projectPath, projectName);
      if (isPathExists) {
        throw new Error(intl.formatMessage({ id: 'web.iceworksProjectCreator.CreateProject.pathExist' }));
      }
      await createProject(values);
    } catch (e) {
      Notification.error({ content: e.message });
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
      setPrevBtnDisabled(false);
    }
  }

  async function createProject(data: IProjectField) {
    const projectDir = await callService('project', 'createProject', data);
    const { projectPath } = data;
    await callService('common', 'saveDataToSettingJson', 'workspace', projectPath);
    await callService('project', 'openLocalProjectFolder', projectDir);
  }

  function onFormChange(formValue) {
    console.log('form change ===> 1', { ...value, ...formValue });
    setValue({ ...value, ...formValue });
  }

  const steps = [
    <ScaffoldForm onChange={onFormChange} value={value}>
      <Button type="primary" onClick={onScaffoldSubmit}>
        <FormattedMessage id="web.iceworksProjectCreator.CreateProject.nextStep" />
      </Button>
    </ScaffoldForm>,
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
    </CreateProjectForm>,
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
                {/* TODO: 国际化 */}
                自定义模板
                {/* <FormattedMessage id="web.iceworksProjectCreator.CreateProject.createProject" /> */}
              </div>
              <div className={styles.subTitle}>
                {/* TODO: 国际化 */}
                快速搭建自定义模板
                {/* <FormattedMessage id="web.iceworksProjectCreator.CreateProject.subTitle" /> */}
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
