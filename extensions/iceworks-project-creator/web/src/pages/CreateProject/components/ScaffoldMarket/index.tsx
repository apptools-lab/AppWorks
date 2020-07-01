/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Collapse, Notification, Loading, Button, Icon, Divider } from '@alifd/next';
import MobileScaffoldCard from '@/components/MobileScaffoldCard';
import ScaffoldCard from '@/components/ScaffoldCard';
import NotFound from '@/components/NotFound';
import callService from '@/callService';
import { IMaterialSource, IMaterialScaffold } from '@iceworks/material-utils';
import { mainScaffoldsList, tsScaffoldsList } from '@/constant';
import styles from './index.module.scss';

const projectTypes = ['react', 'rax', 'vue'];

const ScaffoldMarket = ({ onScaffoldSelect, children, onOpenConfigPanel, materialSources }) => {
  const [selectedSource, setSelectedSource] = useState<any>({});
  const [SelectedMaterial, setSelectedMaterial] = useState(null);
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
      setSelectedMaterial(null);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function onScaffoldMaterialClick(scaffold) {
    setSelectedMaterial(scaffold.name);
    onScaffoldSelect(scaffold);
  }

  async function getScaffolds(source: string) {
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
      setSelectedSource(materialSources[0]);
      const source = materialSources[0].source;

      const data = await getScaffolds(source);
      const { mainScaffolds, otherScaffolds } = data as any;
      setMainScaffolds(mainScaffolds);
      setOtherScaffolds(otherScaffolds);
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
              const projectType = item.type.toLocaleLowerCase();
              return <ScaffoldCard
                key={item.name}
                title={
                  <div className={styles.cardTitle}>
                    {<img src={require(`@/assets/${projectTypes.includes(projectType) ? projectType + '.svg' : 'logo.png'}`)} alt="projectType" width={25} height={25} />}
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
                const scaffoldType = tsScaffoldsList.includes(item.source.npm) ? 'ts' :
                  tsScaffoldsList.includes(item.source.npm) ? 'js' :
                    '';
                const isRax = selectedSource.type === 'rax';
                const CardComponent = isRax ? MobileScaffoldCard : ScaffoldCard;
                return (
                  <CardComponent
                    key={item.name}
                    title={
                      <div className={styles.cardTitle}>
                        {scaffoldType && <img src={require(`@/assets/${scaffoldType}.svg`)} alt="languageType" width={20} height={20} />}
                        <div>{item.title.replace(' - TS', '')}</div>
                      </div>
                    }
                    content={item.description}
                    media={item.screenshot}
                    selected={SelectedMaterial === item.name}
                    onClick={() => onScaffoldMaterialClick(item)}
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
                    const scaffoldType = tsScaffoldsList.includes(item.source.npm) ? 'ts' :
                      tsScaffoldsList.includes(item.source.npm) ? 'js' :
                        '';
                    const isRax = selectedSource.type.toLocaleLowerCase() === 'rax';
                    const CardComponent = isRax ? MobileScaffoldCard : ScaffoldCard;
                    return (
                      <CardComponent
                        key={item.name}
                        title={
                          <div className={styles.cardTitle}>
                            {scaffoldType && <img src={require(`@/assets/${scaffoldType}.svg`)} alt="languageType" width={20} height={20} />}
                            <div>{item.title.replace(' - JS', '')}</div>
                          </div>
                        }
                        content={item.description}
                        media={item.screenshot}
                        selected={SelectedMaterial === item.name}
                        onClick={() => onScaffoldMaterialClick(item)}
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
