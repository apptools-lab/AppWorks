import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Notification, Icon, Loading } from '@alifd/next';
import callService from '@/callService';
import { IProjectField, IDEFProjectField, IGitLabExistProject } from '@/types';
import { IMaterialSource } from '@iceworks/material-utils';
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
  const [createDEFProjectDisabled, setCreateDEFProjectDisabled] = useState(false);
  const [projectFormErrorMsg, setProjectFormErrorMsg] = useState('');
  const [DEFFormErrorMsg, setDEFFormErrorMsg] = useState('');
  const [groupDataSource, setGroupDataSource] = useState([]);
  const [materialSources, setMaterialSources] = useState<Array<IMaterialSource>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const existProjectsRef = useRef([]);
  const steps = [
    <ScaffoldMarket onScaffoldSelect={onScaffoldSelect} curProjectField={curProjectField} onOpenConfigPanel={onOpenConfigPanel} materialSources={materialSources}>
      <Button type="primary" onClick={onScaffoldSubmit}>下一步</Button>
    </ScaffoldMarket>,
    <CreateProjectForm value={curProjectField} onOpenFolderDialog={onOpenFolderDialog} onChange={onProjectFormChange} errorMsg={projectFormErrorMsg}>
      <Button onClick={goPrev} className={styles.btn} disabled={prevBtnDisabled}>上一步</Button>
      {isAliInternal && <Form.Submit
        className={styles.btn}
        onClick={(values, error) => onProjectDetailSubmit(values, error, true)}
        validate
        disabled={createDEFProjectDisabled}
      >创建 DEF 应用</Form.Submit>}
      <Form.Submit
        type="primary"
        onClick={(values, error) => onProjectDetailSubmit(values, error, false)}
        validate
        loading={createProjectLoading}
      >完成</Form.Submit>
    </CreateProjectForm>
  ];

  if (isAliInternal) {
    steps.splice(2, 0,
      <CreateDEFProjectForm
        value={curDEFProjectField}
        onChange={onDEFProjectFormChange}
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
  }

  function goNext() {
    setStep(currentStep + 1);
  };

  function goPrev() {
    setStep(currentStep - 1);
  };

  function onScaffoldSelect(source, scaffold) {
    setCurProjectField({ ...curProjectField, scaffold, source });
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

  async function onProjectDetailSubmit(values: any, errors: any, isCreateDEFProject: boolean) {
    setProjectFormErrorMsg('');
    if (errors) {
      return;
    }
    setCreateProjectLoading(true);
    setPrevBtnDisabled(true);
    setCreateDEFProjectDisabled(true);
    const { projectPath, projectName } = values;
    try {
      const isPathExists = await callService('common', 'checkPathExists', projectPath, projectName);
      if (isPathExists) {
        throw new Error('该本地路径已存在，请重新选择！');
      }
      if (!isCreateDEFProject) {
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
      setCreateDEFProjectDisabled(false);
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

  async function getMaterialSources() {
    const materialSources: any = await callService('material', 'getSources') as IMaterialSource[];
    setMaterialSources(materialSources);
    return materialSources;
  }
  async function refreshMaterialSources() {
    const sources = await getMaterialSources();
    setMaterialSources(sources);
  }

  useEffect(() => {
    async function checkAliInternal() {
      try {
        const isAliInternal = await callService('common', 'checkIsAliInternal') as boolean;
        setIsAliInternal(isAliInternal);
        return isAliInternal;
      } catch (e) {
        Notification.error({ content: e.message });
        return false;
      }
    }
    async function setDefaultFields(isAliInternal) {
      const workspace = await callService('common', 'getDataFromSettingJson', 'workspace') || '';
      setCurProjectField({ ...curProjectField, projectPath: workspace });

      if (isAliInternal) {
        const userData = await callService('common', 'getDataFromSettingJson', 'user') || {};
        const { empId, account, gitlabToken } = userData;

        setCurDEFProjectField({ ...curDEFProjectField, empId, account, gitlabToken });
        const dataSource = await callService('common', 'getGitLabGroups', gitlabToken);
        setGroupDataSource(dataSource);
        existProjectsRef.current = await callService('common', 'getExistProjects', gitlabToken);
      }
    }
    async function initMaterialSources() {
      const materialSources = await getMaterialSources();
      setMaterialSources(materialSources);
    }
    async function initData() {
      try {
        setLoading(true);
        const isAliInternal = await checkAliInternal();
        await initMaterialSources();
        await setDefaultFields(isAliInternal);
      } catch (e) {
        Notification.error({ content: e.message });
      } finally {
        setLoading(false);
      }
    }
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <Card free>
        <Card.Content className={styles.cardContent}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>创建应用</div>
              <div className={styles.subTitle}>海量可复用物料，搭配研发框架极速构建多端应用。</div>
            </div>
            <div className={styles.headerBtns}>
              <Button size="medium" text onClick={onOpenConfigPanel} className={styles.btn}><Icon type="set" />设置</Button>
              {currentStep === 0 && <Button size="medium" text onClick={refreshMaterialSources}><Icon type="refresh" />刷新</Button>}
            </div>
          </div>
          {loading ? <Loading className={styles.loading} visible={loading} /> : (
            <div className={styles.content}>{steps[currentStep]}</div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default CreateProject;