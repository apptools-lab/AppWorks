import * as React from 'react';
import { Tab } from '@alifd/next';
import {
  IMaterialSource,
  IMaterialTypeDatum,
  IMaterialScaffold,
  IMaterialBlock,
  IMaterialComponent,
  IMaterialBase,
  IMaterialPage,
} from '@appworks/material-utils';
import { MaterialType } from './type';
import styles from './view.module.scss';

const { Item } = Tab;

const LOADING_TAB_KEY = 'loading';
const EMPTY_TAB_KEY = 'empty';

export const MaterialView: React.FC<{
  sources: IMaterialSource[];
  currentSource: string;
  data: IMaterialTypeDatum[];
  onChangeSource(source: string): void;
  projectComponentType: string;
  componentTypeOptions: Array<{label: string; value: string}>;
  isLoadingSources?: boolean;
  isLoadingData?: boolean;
  extra?: any;
  colSpan?: number;
  disableLazyLoad?: boolean;
  selectedBlocks?: IMaterialBlock[];
  selectedComponents?: IMaterialComponent[];
  selectedPages?: IMaterialPage[];
  selectedBases?: IMaterialBase[];
  onBaseClick?: (dataSource: IMaterialBase) => void;
  onComponentClick?: (dataSource: IMaterialComponent) => void;
  onBlockClick?: (dataSource: IMaterialBlock) => void;
  onPageClick?: (dataSorce: IMaterialPage[]) => void;
  onScaffoldClick?: (dataSource: IMaterialScaffold) => void;
}> = ({ sources, currentSource, onChangeSource, extra, isLoadingSources, ...others }) => {
  const sourceActiveKey = sources.length ? currentSource : EMPTY_TAB_KEY;
  const tabItems =
    sources.length > 0 ? (
      sources.map((sourceData, index) => {
        const { name, source } = sourceData;
        return (
          <Item tab={<div>{name}</div>} key={source}>
            {currentSource === source ? <MaterialType sourceIndex={index} {...others} /> : null}
          </Item>
        );
      })
    ) : (
      <Item title="没有数据" key={EMPTY_TAB_KEY}>
        没有找到物料源数据，请配置后再试。
      </Item>
    );
  return (
    <Tab
      className={styles.wrap}
      activeKey={isLoadingSources ? LOADING_TAB_KEY : sourceActiveKey}
      onChange={onChangeSource}
      size="medium"
      extra={extra}
    >
      {isLoadingSources ? <Item title="加载中……" key={LOADING_TAB_KEY} /> : tabItems}
    </Tab>
  );
};
