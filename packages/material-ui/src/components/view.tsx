import * as React from 'react';
import { Tab } from '@alifd/next';
import { IMaterialSource, IMaterialTypeDatum, IMaterialScaffold, IMaterialBlock, IMaterialComponent, IMaterialBase } from '@iceworks/material-utils';
import { MaterialType } from './type';
import * as styles from './view.module.scss';

const { Item } = Tab;

export const MaterialView: React.FC<{
  sources: IMaterialSource[];
  currentSource: string;
  data: IMaterialTypeDatum[];
  onChangeSource(source: string): void,
  isLoadingData?: boolean;
  extra?: any;
  colSpan?: number;
  disableLazyLoad?: boolean;
  selectedBlocks?: IMaterialBlock[];
  selectedComponents?: IMaterialComponent[];
  selectedBases?: IMaterialBase[];
  onBaseClick?: (dataSource: IMaterialBase) => void,
  onComponentClick?: (dataSource: IMaterialComponent) => void,
  onBlockClick?: (dataSource: IMaterialBlock) => void,
  onScaffoldClick?: (dataSource: IMaterialScaffold) => void,
}> = ({
  sources,
  currentSource,
  onChangeSource,
  extra,
  ...others
}) => {
  return (
    <Tab
      className={styles.wrap}
      activeKey={currentSource}
      onChange={onChangeSource}
      size="small"
      extra={extra}
    >
      {
        sources.map((sourceData, index) => {
          const { name, source } = sourceData;
          return (
            <Item tab={
              <div>
                {name}
              </div>
            } key={source}>
              {
                (currentSource === source ? <MaterialType
                  sourceIndex={index}
                  {...others}
                /> : null)
              }
            </Item>
          );
        })
      }
    </Tab>
  );
};
