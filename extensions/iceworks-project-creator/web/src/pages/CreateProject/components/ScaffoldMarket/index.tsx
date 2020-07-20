/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Collapse, Notification, Loading, Button, Icon, Divider } from '@alifd/next';
import MobileScaffoldCard from '@/components/MobileScaffoldCard';
import ScaffoldCard from '@/components/ScaffoldCard';
import NotFound from '@/components/NotFound';
import callService from '@/callService';
import { IMaterialSource, IMaterialScaffold } from '@iceworks/material-utils';
import { mainScaffoldsList, tsScaffoldsList, jsScaffoldsList } from '@/constant';
import { IScaffoldMarket } from '@/types';
import styles from './index.module.scss';

const projectTypes = ['react', 'rax', 'vue'];

const ScaffoldMarket = ({ onScaffoldSelect, curProjectField, children, onOpenConfigPanel, materialSources }) => {
  const [selectedSource, setSelectedSource] = useState<any>({});
  const [mainScaffolds, setMainScaffolds] = useState<IMaterialScaffold[]>([]);
  const [otherScaffolds, setOtherScaffolds] = useState<IMaterialScaffold[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function onMaterialSourceClick(scaffold: IMaterialSource) {
    try {
      setLoading(true);
      setSelectedSource(scaffold);
      const data = await getScaffolds(scaffold.source);
      const { mainScaffolds, otherScaffolds } = data as any;
      setMainScaffolds(mainScaffolds);
      setOtherScaffolds(otherScaffolds);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function onScaffoldClick(scaffold) {
    onScaffoldSelect(selectedSource, scaffold);
  }

  async function getScaffolds(source: string): Promise<IScaffoldMarket> {
    try {
      const scaffolds = await callService('project', 'getScaffolds', source) as IMaterialScaffold[];
      let main = scaffolds.filter(scaffold => mainScaffoldsList.includes(scaffold.source.npm));
      let other = scaffolds.filter(scaffold => !mainScaffoldsList.includes(scaffold.source.npm));
      if (!main.length && other.length) {
        main = other;
        other = [];
      }
      return { mainScaffolds: main, otherScaffolds: other }
    } catch (e) {
      Notification.error({ content: e.message });
      return { mainScaffolds: [], otherScaffolds: [] }
    }
  }

  async function initData() {
    setLoading(true);
    try {
      if (!materialSources.length) {
        return;
      }
      const selectedSource = curProjectField.source ? curProjectField.source : materialSources[0]
      setSelectedSource(selectedSource);
      const source = selectedSource.source;

      const data = await getScaffolds(source);
      const { mainScaffolds, otherScaffolds } = data as IScaffoldMarket;
      setMainScaffolds(mainScaffolds);
      setOtherScaffolds(otherScaffolds);
      if (mainScaffolds.length > 0) {
        const selectedScaffold = curProjectField.scaffold ? curProjectField.scaffold : mainScaffolds[0];
        onScaffoldSelect(selectedSource, selectedScaffold);
      }
    } catch (error) {
      Notification.error({ content: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initData();
  }, [materialSources]);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.scaffoldsSource}>
          <div className={styles.sourcesList}>
            {materialSources && materialSources.map(item => {
              let iconName = 'app';
              const projectType = item.type.toLocaleLowerCase();
              if (item.client) {
                iconName = item.client.toLocaleLowerCase();
              } else if (projectTypes.includes(projectType)) {
                iconName = projectType;
              }
              return <ScaffoldCard
                key={item.name}
                title={
                  <div className={styles.cardTitle}>
                    {<img src={require(`@/assets/${iconName}.svg`)} alt="projectType" width={26} height={26} />}
                    <div >{item.name}</div>
                  </div>
                }
                content={item.description}
                selected={selectedSource.name && selectedSource.name === item.name}
                style={{ width: 160, height: 110 }}
                onClick={() => onMaterialSourceClick(item)}
              />
            })}
          </div>
          <div className={styles.addSource}>
            <Button className={styles.btn} onClick={onOpenConfigPanel}><Icon type="add" /></Button>
          </div>
        </div>
        <Divider direction="ver" style={{ height: '100%' }} />
        <div className={styles.scaffolds}>
          {loading ? <Loading visible={loading} className={styles.loading} /> : <>
            <div className={styles.mainScaffolds}>
              {!!mainScaffolds.length ? mainScaffolds.map(item => {
                // tsScaffoldsList and jsScaffoldsList only contain the official scaffolds
                // so the TypeScript and JavaScript logo only display in official scaffolds
                const scaffoldType = tsScaffoldsList.includes(item.source.npm) ? 'ts' :
                  jsScaffoldsList.includes(item.source.npm) ? 'js' :
                    '';
                const isRax = selectedSource.type === 'rax';
                const CardComponent = isRax ? MobileScaffoldCard : ScaffoldCard;
                return (
                  <CardComponent
                    key={item.name}
                    title={
                      <div className={styles.cardTitle}>
                        {scaffoldType && <img src={require(`@/assets/${scaffoldType}.svg`)} alt="languageType" width={20} height={20} />}
                        <div>{scaffoldType ? item.title.replace(' - TS', '').replace(' - JS', '') : item.title}</div>
                      </div>
                    }
                    content={item.description}
                    media={item.screenshot}
                    selected={curProjectField.scaffold.name === item.name}
                    onClick={() => onScaffoldClick(item)}
                  />
                )
              }) :
                <NotFound description="暂无模板" />
              }
            </div>
            {!!otherScaffolds.length && <Collapse className={styles.collapse}>
              <Collapse.Panel title="查看更多">
                <div className={styles.collapseScaffolds}>
                  {otherScaffolds.map(item => {
                    // tsScaffoldsList and jsScaffoldsList only contain the official scaffolds
                    // so the TypeScript and JavaScript logo only display in official scaffolds
                    const scaffoldType = tsScaffoldsList.includes(item.source.npm) ? 'ts' :
                      jsScaffoldsList.includes(item.source.npm) ? 'js' :
                        '';
                    const isRax = selectedSource.type.toLocaleLowerCase() === 'rax';
                    const CardComponent = isRax ? MobileScaffoldCard : ScaffoldCard;
                    return (
                      <CardComponent
                        key={item.name}
                        title={
                          <div className={styles.cardTitle}>
                            {scaffoldType && <img src={require(`@/assets/${scaffoldType}.svg`)} alt="languageType" width={20} height={20} />}
                            <div>{scaffoldType ? item.title.replace(' - JS', '').replace(' - TS', '') : item.title}</div>
                          </div>
                        }
                        content={item.description}
                        media={item.screenshot}
                        selected={curProjectField.scaffold.name === item.name}
                        onClick={() => onScaffoldClick(item)}
                      />
                    )
                  })}
                </div>
              </Collapse.Panel>
            </Collapse>}
          </>}
        </div>
      </div>
      <div className={styles.action}>
        {children}
      </div>
    </div>
  );
};

export default ScaffoldMarket;
