import React, { useState, useEffect } from 'react';
import { Notification, Loading, Button, Icon, Divider } from '@alifd/next';
import MaterialSourceCard from '@/components/MaterialSourceCard';
import MobileScaffoldCard from '@/components/MobileScaffoldCard';
import PCScaffoldCard from '@/components/PCScaffoldCard';
import AddScaffoldCard from '@/components/AddScaffoldCard';
import NotFound from '@/components/NotFound';
import PegasusCard from '@/components/PegasusCard';
import PegasusScaffoldContent from '@/components/PegasusScaffoldContent';
import callService from '@/callService';
import { IMaterialSource, IMaterialScaffold } from '@appworks/material-utils';
import { scaffoldsBlackList } from '../../constants';
import styles from './index.module.scss';
import { useIntl } from 'react-intl';

const projectTypes = ['react', 'rax', 'vue'];

function checkIsWireless(source) {
  return (source.client && source.client === 'wireless') || source.type === 'rax' || source.type === 'miniProgram';
}

const ScaffoldMarket = ({
  isAliInternal,
  onScaffoldSelect,
  curProjectField,
  children,
  onOpenConfigPanel,
  materialSources,
  onScaffoldSubmit,
}) => {
  const intl = useIntl();
  const [selectedSource, setSelectedSource] = useState<any>({});
  const [scaffolds, setScaffolds] = useState<IMaterialScaffold[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pegasusCardSelected, setPegasusCardSelected] = useState<boolean>(false);

  async function onMaterialSourceClick(scaffold: IMaterialSource) {
    setPegasusCardSelected(false);
    try {
      setLoading(true);
      setSelectedSource(scaffold);
      const data = await getScaffolds(scaffold.source);
      setScaffolds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handlePegasusCardClick() {
    setSelectedSource({});
    setPegasusCardSelected(true);
  }

  function onScaffoldClick(scaffold) {
    onScaffoldSelect(selectedSource, scaffold);
  }

  async function getScaffolds(source: string): Promise<IMaterialScaffold[]> {
    try {
      const allScaffolds = (await callService('scaffold', 'getAll', source)) as IMaterialScaffold[];
      if (isAliInternal) {
        return allScaffolds.filter((scaffold: IMaterialScaffold) => !scaffoldsBlackList.includes(scaffold.source.npm));
      }
      return allScaffolds;
    } catch (e) {
      Notification.error({ content: e.message });
      return [];
    }
  }

  async function initData() {
    setLoading(true);
    try {
      if (!materialSources.length) {
        return;
      }
      const curSelectedSource = curProjectField.source ? curProjectField.source : materialSources[0];
      setSelectedSource(curSelectedSource);
      const { source } = curSelectedSource;

      const allScaffolds = await getScaffolds(source);
      setScaffolds(allScaffolds);
      if (allScaffolds.length > 0) {
        const selectedScaffold = curProjectField.scaffold ? curProjectField.scaffold : allScaffolds[0];
        onScaffoldSelect(curSelectedSource, selectedScaffold);
      }
    } catch (error) {
      Notification.error({ content: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function onAddScaffoldCardClick() {
    try {
      await callService('common', 'executeCommand', 'project-creator.custom-scaffold.start');
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  const SourceCard = ({ materialSource }: { materialSource: IMaterialSource }) => {
    let iconName = 'app';
    const projectType = materialSource.type.toLocaleLowerCase();
    if (materialSource.client) {
      iconName = materialSource.client.toLocaleLowerCase();
    } else if (projectTypes.includes(projectType)) {
      iconName = projectType;
    }
    return (
      <MaterialSourceCard
        key={materialSource.name}
        title={
          <div className={styles.cardTitle}>
            {<img src={require(`@/assets/${iconName}.svg`)} alt="projectType" width={26} height={26} />}
            <div>{materialSource.name}</div>
          </div>
        }
        selected={selectedSource.name && selectedSource.name === materialSource.name}
        onClick={() => onMaterialSourceClick(materialSource)}
      />
    );
  };

  const ScaffoldCard = ({ scaffold }: { scaffold: IMaterialScaffold }) => {
    const scaffoldType = scaffold.languageType || '';
    const isWireless = checkIsWireless(selectedSource);
    const CardComponent = isWireless ? MobileScaffoldCard : PCScaffoldCard;
    return (
      <CardComponent
        key={scaffold.name}
        title={
          <div className={styles.cardTitle}>
            {scaffoldType && (
              <img
                src={require(`@/assets/${scaffoldType}.svg`)}
                alt="languageType"
                width={20}
                height={20}
              />
            )}
            <div>
              {scaffoldType ? scaffold.title.replace(' - TS', '').replace(' - JS', '') : scaffold.title}
            </div>
          </div>
        }
        content={scaffold.description}
        media={scaffold.screenshot}
        selected={curProjectField.scaffold && curProjectField.scaffold.name === scaffold.name}
        onClick={() => onScaffoldClick(scaffold)}
        onDoubleClick={onScaffoldSubmit}
      />
    );
  };

  const ScaffoldCardsList = ({ scaffoldsList }: {scaffoldsList: IMaterialScaffold[]}) => {
    return (
      pegasusCardSelected ? (
        <PegasusScaffoldContent />
      ) : (
        <>
          <div className={styles.mainScaffolds}>
            {scaffoldsList.length ? (
              <>
                {scaffoldsList.map((scaffold: IMaterialScaffold) => <ScaffoldCard scaffold={scaffold} />)}
                {selectedSource.name === 'PC Web' && <AddScaffoldCard onClick={onAddScaffoldCardClick} />}
              </>
            ) : (
              <NotFound
                description={intl.formatMessage({ id: 'web.iceworksProjectCreator.ScaffoldMarket.noTemplate' })}
              />
            )}
          </div>
        </>
      )
    );
  };

  useEffect(() => {
    initData();
  }, [materialSources]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.scaffoldsSource}>
          <div className={styles.sourcesList}>
            {
              materialSources &&
                materialSources.map((materialSource: IMaterialSource) => <SourceCard materialSource={materialSource} />)
            }
          </div>
          {isAliInternal ? <PegasusCard onClick={handlePegasusCardClick} selected={pegasusCardSelected} /> : null}
          <div className={styles.addSource}>
            <Button className={styles.btn} onClick={onOpenConfigPanel}>
              <Icon type="add" />
            </Button>
          </div>
        </div>
        <Divider direction="ver" style={{ height: '100%' }} />
        <div className={styles.scaffolds}>
          {selectedSource.description && <div className={styles.materialSourceDescription}>{selectedSource.description}</div>}
          {loading ? (
            <Loading visible={loading} className={styles.loading} />
          ) : (
            <ScaffoldCardsList scaffoldsList={scaffolds} />
          )}
        </div>
      </div>
      {pegasusCardSelected ? null : <div className={styles.action}>{children}</div>}
    </div>
  );
};

export default ScaffoldMarket;
