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
  colSpan?: number;
  disableLazyLoad?: boolean;
  onBaseClick?: (dataSource: IMaterialBase) => void,
  onComponentClick?: (dataSource: IMaterialComponent) => void,
  onBlockClick?: (dataSource: IMaterialBlock) => void,
  onScaffoldClick?: (dataSource: IMaterialScaffold) => void,
}> = ({
  sources, currentSource, data, isLoadingData,
  onChangeSource,
  colSpan,
  disableLazyLoad,
  onScaffoldClick,
  onBlockClick,
  onComponentClick,
  onBaseClick,
}) => {
  return (
    <Tab
      className={styles.wrap}
      activeKey={currentSource}
      onChange={onChangeSource}
      size="small"
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
                  colSpan={colSpan}
                  data={data}
                  disableLazyLoad={disableLazyLoad}
                  isLoadingData={isLoadingData}
                  onComponentClick={onComponentClick}
                  onBaseClick={onBaseClick}
                  onBlockClick={onBlockClick}
                  onScaffoldClick={onScaffoldClick}
                /> : null)
              }
            </Item>
          );
        })
      }
    </Tab>
  );
};
