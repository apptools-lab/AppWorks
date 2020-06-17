import React, { useState, useEffect } from 'react';
import { Collapse } from '@alifd/next';
import SelectCard from '@/components/SelectCard';
import callService from '@/callService';
import { IMaterialSource, IMaterialScaffold } from '@/iceworks/material-utils';
import JSSvg from '@/assets/js.svg';
import TSSvg from '@/assets/ts.svg';
import styles from './index.module.scss';

const whitelist = [
  '@alifd/fusion-design-pro',
  '@alifd/scaffold-lite',
  '@alifd/scaffold-simple',
  '@rax-materials/scaffolds-basic-app',
  '@icedesign/stark-layout-scaffold',
  '@icedesign/stark-child-scaffold'
]

const ScaffoldMarket = ({ onScaffoldSelect, children }) => {
  const [materialSourceSelected, setMaterialSourceSelected] = useState<IMaterialSource>({});
  const [materialSelected, setMaterialSelected] = useState(null);
  const [materialSources, setMaterialSources] = useState<Array<IMaterialSource>>([]);
  const [mainScaffolds, setMainScaffolds] = useState<IMaterialScaffold[]>([]);
  const [otherScaffolds, setOtherScaffolds] = useState<IMaterialScaffold[]>([]);

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
      const main = scaffolds.filter(scaffold => whitelist.includes(scaffold.source.npm));
      const other = scaffolds.filter(scaffold => !whitelist.includes(scaffold.source.npm));
      return { mainScaffolds: main, otherScaffolds: other }
    } catch (e) {
      return [];
    }
  }

  useEffect(() => {
    async function initData() {
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
        // ignore
      }
    }
    initData();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.scaffoldRegistry}>
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
        <div className={styles.mainScaffolds}>
          {mainScaffolds && mainScaffolds.map(item => {
            return (
              <SelectCard
                key={item.name}
                title={
                  <div>
                    <img className={styles.cardProjectType} src={TSSvg} alt="projectType" width={20} height={20} />
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
          <Collapse className={styles.collapse}>
            <Collapse.Panel title="查看更多">
              <div className={styles.otherScaffolds}>
                {otherScaffolds && otherScaffolds.map(item => (
                  <SelectCard
                    key={item.name}
                    title={
                      <div>
                        <img className={styles.cardProjectType} src={JSSvg} alt="projectType" width={20} height={20} />
                        <span className={styles.cardTitle}>{item.title.replace(' - JS', '')}</span>
                      </div>
                    }
                    content={
                      <div>
                        <span className={styles.userSelect}>{item.description}</span>
                      </div>
                    }
                    media={<img height={120} src={item.screenshot} alt="screenshot" style={{ padding: '10px 10px 0' }} />}
                    selected={materialSelected === item.name}
                    style={{ width: 190, height: 250 }}
                    onClick={() => onScaffoldMaterialClick(item)}
                  />
                ))}
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
      </div>
      <div className={styles.action}>
        {children}
      </div>
    </div>
  );
};

export default ScaffoldMarket;
