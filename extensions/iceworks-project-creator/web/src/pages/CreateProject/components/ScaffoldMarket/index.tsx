/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Collapse, Notification, Loading } from '@alifd/next';
import SelectCard from '@/components/SelectCard';
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

const ScaffoldMarket = ({ onScaffoldSelect, children }) => {
  const [materialSourceSelected, setMaterialSourceSelected] = useState<IMaterialSource>({});
  const [materialSelected, setMaterialSelected] = useState(null);
  const [materialSources, setMaterialSources] = useState<Array<IMaterialSource>>([]);
  const [mainScaffolds, setMainScaffolds] = useState<IMaterialScaffold[]>([]);
  const [otherScaffolds, setOtherScaffolds] = useState<IMaterialScaffold[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  async function onMaterialSourceClick(scaffold: IMaterialSource) {
    try {
      setMaterialSourceSelected(scaffold);
      const data = await getScaffolds(scaffold.source);
      const { mainScaffolds, otherScaffolds } = data as any;
      setMainScaffolds(mainScaffolds);
      setOtherScaffolds(otherScaffolds);
      setMaterialSelected(null);
    } catch (err) {
      // ignore
    }
  }

  function onScaffoldMaterialClick(scaffold) {
    setMaterialSelected(scaffold.name);
    onScaffoldSelect(scaffold);
  }

  async function getScaffoldResources() {
    const materialSources: any = await callService('material', 'getSources') as IMaterialSource[];
    return materialSources;
  }

  async function getScaffolds(source: string) {
    try {
      const scaffolds = await callService('project', 'getScaffolds', source) as IMaterialScaffold[];
      const main = scaffolds.filter(scaffold => !jsScaffolds.includes(scaffold.source.npm));
      const other = scaffolds.filter(scaffold => jsScaffolds.includes(scaffold.source.npm));
      return { mainScaffolds: main, otherScaffolds: other }
    } catch (e) {
      return [];
    }
  }

  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const materialSources = await getScaffoldResources();
        setMaterialSources(materialSources);
        setMaterialSourceSelected(materialSources[0]);
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
    initData();
  }, []);
  return (
    <div className={styles.container}>
      <Loading visible={loading}>
        <div className={styles.content}>
          <div className={styles.scaffoldsSource}>
            {materialSources && materialSources.map(item => (
              <SelectCard
                key={item.name}
                title={item.name}
                content={<span className={styles.userSelect}>{item.description}</span>}
                selected={materialSourceSelected.name === item.name}
                style={{ width: 160 }}
                onClick={() => onMaterialSourceClick(item)}
              />
            ))}
          </div>
          <div className={styles.scaffolds}>
            <div className={styles.mainScaffolds}>
              {mainScaffolds && mainScaffolds.map(item => {
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
              })}
              {!!otherScaffolds.length && <Collapse className={styles.collapse}>
                <Collapse.Panel title="查看更多">
                  <div className={styles.otherScaffolds}>
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
              </Collapse>}
            </div>
          </div>
        </div>
        <div className={styles.action}>
          {children}
        </div>
      </Loading>
    </div>
  );
};

export default ScaffoldMarket;
