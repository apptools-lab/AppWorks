import * as React from 'react';
import { Search, ResponsiveGrid, Radio, Loading, Select } from '@alifd/next';
import LazyLoad from 'react-lazyload';
import {
  IMaterialTypeDatum,
  IMaterialScaffold,
  IMaterialBlock,
  IMaterialComponent,
  IMaterialBase,
  CUSTOM_CATEGORY,
  IMaterialPage,
  IMaterialCategoryDatum
} from '@appworks/material-utils';
import { MaterialScaffold } from './scaffold';
import { MaterialBlock } from './block';
import { MaterialComponent } from './component';
import { MaterialBase } from './base';
import { MaterialPage } from './page';
import styles from './type.module.scss';

const { Cell } = ResponsiveGrid;

interface ContentProps extends IMaterialTypeDatum {
  categoryData: IMaterialCategoryDatum[],
  scrollId?: string;
  typeId: string;
  colSpan: number;
  selectedBlocks?: IMaterialBlock[];
  selectedComponents?: IMaterialComponent[];
  selectedBases?: IMaterialBase[];
  selectedPages?: IMaterialPage[];
  projectComponentType: string;
  componentTypeOptions: Array<{value: string, label: string}>;
  onComponentClick?: (dataSource: IMaterialComponent) => void;
  onBaseClick?: (dataSource: IMaterialBase) => void;
  onBlockClick?: (dataSource: IMaterialBlock) => void;
  onPageClick?: (dataSource: IMaterialPage) => void;
  onScaffoldClick?: (dataSource: IMaterialScaffold) => void;
}

const Content: React.FC<ContentProps> = ({
  categoryData,
  scrollId,
  typeId,
  colSpan,
  selectedBlocks,
  selectedPages,
  selectedComponents,
  selectedBases,
  componentTypeOptions,
  projectComponentType,
  onComponentClick,
  onBaseClick,
  onPageClick,
  onBlockClick,
  onScaffoldClick,
}) => {
  const [data, setData] = React.useState(categoryData);
  React.useEffect(() => {
    setData(filterCategoryData(projectComponentType));
  }, [categoryData]);

  async function handeSearchSubmit(keyword: string) {
    const newData = categoryData.map((item) => {
      const { list } = item;
      return {
        ...item,
        list: list.filter(({ name, title }) => {
          if (name.indexOf(keyword) > -1 || title.indexOf(keyword) > -1) {
            return true;
          }

          return false;
        }),
      };
    });

    setData(newData);
  }

  /**
   * filter category data by the component type
   * @param currentComponentType
   * @returns
   */
  function filterCategoryData(currentComponentType?: string) {
    if (!currentComponentType) {
      return categoryData
    }
    return categoryData.map((item) => {
      const { list } = item;
      return {
        ...item,
        list: list.filter((materialItem) => {
          return materialItem.componentType === currentComponentType;
        })
      }
    })
  }
  async function handleSelectSubmit(value: string) {
    const newData = filterCategoryData(value);

    setData(newData);
  }


  return (
    <div className={styles.main}>
      <div className={styles.operation}>
        <Search shape="simple" placeholder="输入关键字查找物料" onSearch={handeSearchSubmit} />
        <Select
          defaultValue={projectComponentType}
          dataSource={componentTypeOptions}
          onChange={handleSelectSubmit}
          placeholder="请选择物料类型"
        />
      </div>
      {
        categoryData.length ? <div className={styles.content} id={scrollId}>
          <div className={styles.scroll}>
            {data.map(({ name, list }, cIndex) => {
              return (
                <div key={`${name}_${cIndex}`} className={styles.category}>
                  {name !== CUSTOM_CATEGORY ? <div className={styles.name}>{name}</div> : null}
                  <ResponsiveGrid columns={24} className={styles.list} data-type={typeId}>
                    {list.map((item, index) => {
                      const { source } = item;
                      let $ele;
                      if (typeId === 'scaffolds') {
                        // @ts-ignore
                        $ele = <MaterialScaffold dataSource={item} onDownload={onScaffoldClick} />;
                      } else if (typeId === 'blocks') {
                        const $block = (
                          <MaterialBlock
                            // @ts-ignore
                            dataSource={item}
                            selected={
                              selectedBlocks
                                ? !!selectedBlocks.find((selectedBlock) => selectedBlock.name === item.name)
                                : false
                            }
                            onClick={onBlockClick}
                          />
                        );
                        if (cIndex === 0 && index > 3 && scrollId) {
                          $ele = (
                            <LazyLoad scrollContainer={`#${scrollId}`} height={240}>
                              {$block}
                            </LazyLoad>
                          );
                        } else {
                          $ele = $block;
                        }
                      } else if (typeId === 'pages') {
                        const $page = (
                          <MaterialPage
                            // @ts-ignore
                            dataSource={item}
                            selected={
                              selectedPages
                                ? !!selectedPages.find((sellectedPage) => sellectedPage.name === item.name)
                                : false
                            }
                            onClick={onPageClick}
                          />
                        );
                        if (cIndex === 0 && index > 3 && scrollId) {
                          $ele = (
                            <LazyLoad scrollContainer={`#${scrollId}`} height={240}>
                              {$page}
                            </LazyLoad>
                          );
                        } else {
                          $ele = $page;
                        }
                      } else if (typeId === 'components') {
                        $ele = (
                          <MaterialComponent
                            // @ts-ignore
                            dataSource={item}
                            selected={
                              selectedComponents
                                ? !!selectedComponents.find((selectedComponent) => selectedComponent.name === item.name)
                                : false
                            }
                            onClick={onComponentClick}
                          />
                        );
                      } else if (typeId === 'bases') {
                        $ele = (
                          <MaterialBase
                            // @ts-ignore
                            dataSource={item}
                            selected={
                              selectedBases
                                ? !!selectedBases.find((selectedBase) => selectedBase.name === item.name)
                                : false
                            }
                            onClick={onBaseClick}
                          />
                        );
                      }
                      return (
                        <Cell colSpan={colSpan} className={styles.item} key={`${source.npm}_${index}`}>
                          {$ele}
                        </Cell>
                      );
                    })}
                  </ResponsiveGrid>
                </div>
              );
            })}
          </div>
          {!data.length ? <div className={styles.empty}>Empty</div> : null}
        </div> : <div className={styles.empty}>没有数据</div>
      }
    </div>
  );
};

export const MaterialType: React.FC<{
  data: IMaterialTypeDatum[];
  isLoadingData?: boolean;
  sourceIndex?: number;
  disableLazyLoad?: boolean;
  colSpan?: number;
  selectedBlocks?: IMaterialBlock[];
  selectedComponents?: IMaterialComponent[];
  selectedBases?: IMaterialBase[];
  componentTypeOptions: Array<{value: string, label: string}>;
  projectComponentType: string;
  onComponentClick?: (dataSource: IMaterialComponent) => void;
  onBaseClick?: (dataSource: IMaterialBase) => void;
  onBlockClick?: (dataSource: IMaterialBlock) => void;
  onScaffoldClick?: (dataSource: IMaterialScaffold) => void;
}> = ({ sourceIndex, data, disableLazyLoad, isLoadingData, colSpan = 8, ...others }) => {
  const scrollId = disableLazyLoad ? '' : `iceworks_material_content_${sourceIndex}`;
  const currentId = data[0] ? data[0].id : '';
  const [typeId, setTypeId] = React.useState(currentId);

  React.useEffect(() => {
    setTypeId(currentId);
  }, [currentId]);

  async function handleTypeChange(value) {
    setTypeId(value);
  }

  const content =
    data.length > 0 ? (
      data.map((item) => {
        const { name, id } = item;
        return typeId === id ? (
          <Content {...item} key={`${name}_${id}`} scrollId={scrollId} typeId={typeId} colSpan={colSpan} {...others} />
        ) : null;
      })
    ) : (
      <div className={styles.empty}>没有数据</div>
    );

  return (
    <Loading visible={isLoadingData} className={styles.spin}>
      {data.length > 1 && (
        <div className={styles.head}>
          <Radio.Group shape="button" value={typeId} onChange={handleTypeChange}>
            {data.map(({ name, id }) => {
              return (
                <Radio value={id} key={id}>
                  {name}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
      )}
      {isLoadingData ? <div className={styles.empty}>加载中……</div> : content}
    </Loading>
  );
};
