/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Collapse, Notification, Loading, Button, Icon } from '@alifd/next';
import SelectCard from '@/components/SelectCard';
import NotFound from '@/components/NotFound';
import callService from '@/callService';
import { IMaterialSource, IMaterialScaffold } from '@iceworks/material-utils';
import styles from './index.module.scss';

const tsScaffolds = [
  '@alifd/fusion-design-pro',
  '@alifd/scaffold-lite',
]
const jsScaffolds = [
  '@alifd/fusion-design-pro-js',
  '@alifd/scaffold-lite-js'
]

const ScaffoldMarket = ({ onScaffoldSelect, children, onOpenConfigPanel }) => {
  const [materialSourceSelected, setMaterialSourceSelected] = useState<any>({});
  const [materialSelected, setMaterialSelected] = useState(null);
  const [materialSources, setMaterialSources] = useState<Array<IMaterialSource>>([]);
  const [mainScaffolds, setMainScaffolds] = useState<IMaterialScaffold[]>([]);
  const [otherScaffolds, setOtherScaffolds] = useState<IMaterialScaffold[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function onMaterialSourceClick(scaffold: IMaterialSource) {
    try {
      setLoading(true);
      setMaterialSourceSelected(scaffold);
      const data = await getScaffolds(scaffold.source);
      const { mainScaffolds, otherScaffolds } = data as any;
      setMainScaffolds(mainScaffolds);
      setOtherScaffolds(otherScaffolds);
      setMaterialSelected(null);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function onScaffoldMaterialClick(scaffold) {
    setMaterialSelected(scaffold.name);
    onScaffoldSelect(scaffold);
  }

  async function getScaffoldSources() {
    const materialSources: any = await callService('material', 'getSources') as IMaterialSource[];
    setMaterialSources(materialSources);
    setMaterialSourceSelected(materialSources[0]);
    return materialSources;
  }

  async function getScaffolds(source: string) {
    try {
      const scaffolds = await callService('project', 'getScaffolds', source) as IMaterialScaffold[];
      const main = scaffolds.filter(scaffold => !jsScaffolds.includes(scaffold.source.npm));
      const other = scaffolds.filter(scaffold => jsScaffolds.includes(scaffold.source.npm));
      return { mainScaffolds: main, otherScaffolds: other }
    } catch (e) {
      Notification.error({ content: e.message });
      return { mainScaffolds: [], otherScaffolds: [] }
    }
  }

  async function initData() {
    setLoading(true);
    try {
      const materialSources = await getScaffoldSources();
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

  async function onRefreshMaterialSource() {
    await initData();
  }

  useEffect(() => {
    initData();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.scaffoldsSource}>
          <div className={styles.refreshBtn}>
            <Button text onClick={onRefreshMaterialSource}><Icon type="refresh" />刷新</Button>
          </div>
          <div className={styles.sourcesList}>
            {materialSources && materialSources.map(item => (
              <SelectCard
                key={item.name}
                title={item.name}
                content={<span className={styles.userSelect}>{item.description}</span>}
                selected={materialSourceSelected['name'] && materialSourceSelected.name === item.name}
                style={{ width: 160 }}
                onClick={() => onMaterialSourceClick(item)}
              />
            ))}
          </div>
          <div className={styles.addSource}>
            <Button className={styles.btn} onClick={onOpenConfigPanel}><Icon type="add" /></Button>
          </div>
        </div>

        <div className={styles.scaffolds}>
          {loading ? <Loading visible={loading} className={styles.loading} /> : <>
            <div className={styles.mainScaffolds}>
              {!!mainScaffolds.length ? mainScaffolds.map(item => {
                const scaffoldType = tsScaffolds.includes(item.source.npm) ? 'ts' :
                  jsScaffolds.includes(item.source.npm) ? 'js' :
                    ''
                return (
                  <SelectCard
                    key={item.name}
                    title={
                      <div>
                        {scaffoldType && <img className={styles.cardProjectType} src={require(`@/assets/${scaffoldType}.svg`)} alt="projectType" width={20} height={20} />}
                        <span className={styles.cardTitle}>{item.title.replace(' - TS', '')}</span>
                      </div>
                    }
                    content={<span className={styles.userSelect}>{item.description}</span>}
                    media={<img height={120} src={item.screenshot} alt="screenshot" style={{ padding: '10px 10px 0' }} />}
                    selected={materialSelected === item.name}
                    style={{ width: 190, height: 250 }}
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
                    const scaffoldType = tsScaffolds.includes(item.source.npm) ? 'ts' :
                      jsScaffolds.includes(item.source.npm) ? 'js' :
                        ''
                    return (
                      <SelectCard
                        key={item.name}
                        title={
                          <div>
                            {scaffoldType && <img className={styles.cardProjectType} src={require(`@/assets/${scaffoldType}.svg`)} alt="projectType" width={20} height={20} />}
                            <span className={styles.cardTitle}>{item.title.replace(' - JS', '')}</span>
                          </div>
                        }
                        content={<span className={styles.userSelect}>{item.description}</span>}
                        media={<img height={120} src={item.screenshot} alt="screenshot" style={{ padding: '10px 10px 0' }} />}
                        selected={materialSelected === item.name}
                        style={{ width: 190, height: 250 }}
                        onClick={() => onScaffoldMaterialClick(item)}
                      />
                    )
                  })}
                </div>
              </Collapse.Panel>
            </Collapse>
            }
          </>
          }
        </div>
      </div>
      <div className={styles.action}>
        {children}
      </div>
    </div>
  );
};

export default ScaffoldMarket;
