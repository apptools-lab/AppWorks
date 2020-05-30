import * as React from 'react';
import { Search, ResponsiveGrid, Radio, Loading } from '@alifd/next';
import LazyLoad from 'react-lazyload';
import { IMaterialTypeDatum, IMaterialScaffold, IMaterialBlock, IMaterialComponent, IMaterialBase, CUSTOM_CATEGORY } from '@iceworks/material-utils';
import { MaterialScaffold } from './scaffold';
import { MaterialBlock } from './block';
import { MaterialComponent } from './component';
import { MaterialBase } from './base';
import * as styles from './type.module.scss';

const { Cell } = ResponsiveGrid;

interface ContentProps extends IMaterialTypeDatum {
  scrollId?: string;
  typeId: string;
  colSpan: number;
  onComponentClick?: (dataSource: IMaterialComponent) => void;
  onBaseClick?: (dataSource: IMaterialBase) => void;
  onBlockClick?: (dataSource: IMaterialBlock) => void;
  onScaffoldClick?: (dataSource: IMaterialScaffold) => void;
}

const Content: React.FC<ContentProps> = ({
  categoryData,
  scrollId,
  typeId,
  colSpan,
  onComponentClick,
  onBaseClick,
  onBlockClick,
  onScaffoldClick,
}) => {
  const [data, setData] = React.useState(categoryData);
  React.useEffect(() => {
    setData(categoryData);
  }, [categoryData]);

  async function handeSearchSubmit(keyword) {
    const newData = categoryData.map((item) => {
      const { list } = item;
      return {
        ...item,
        list: list.filter(({ name, title }) => {
          if (
            name.indexOf(keyword) > -1 ||
            title.indexOf(keyword) > -1
          ) {
            return true;
          }

          return false;
        }),
      };
    });

    setData(newData);
  }

  return (
    <div className={styles.main}>
      <div className={styles.search}>
        <Search
          shape="simple"
          placeholder="Enter keywords to find materials"
          onSearch={handeSearchSubmit}
        />
      </div>
      <div className={styles.content} id={scrollId}>
        {
          data.map(({ name, list }, cIndex) => {
            return (
              <div key={`${name}_${cIndex}`} className={styles.category}>
                { name !== CUSTOM_CATEGORY ? <div className={styles.name}>
                  {name}
                </div> : null }
                <ResponsiveGrid columns={24} className={styles.list} data-type={typeId}>
                  {
                    list.map((item, index) => {
                      const { source } = item;
                      let $ele;
                      if (typeId === 'scaffolds') {
                        // @ts-ignore
                        $ele = (<MaterialScaffold dataSource={item} onDownload={onScaffoldClick} />);
                      } else if (typeId === 'blocks') {
                        // @ts-ignore
                        const $block = <MaterialBlock dataSource={item} onClick={onBlockClick} />;
                        if (cIndex === 0 && index > 3 && scrollId) {
                          $ele = (<LazyLoad scrollContainer={`#${scrollId}`} height={240}>
                            {$block}
                          </LazyLoad>);
                        } else {
                          $ele = $block;
                        }
                      } else if (typeId === 'components') {
                        // @ts-ignore
                        $ele = (<MaterialComponent dataSource={item} onClick={onComponentClick} />);
                      } else if (typeId === 'bases') {
                        $ele = (<MaterialBase dataSource={item} onClick={onBaseClick} />);
                      }
                      return (
                        <Cell colSpan={colSpan} className={styles.item} key={`${source.npm}_${index}`}>
                          {$ele}
                        </Cell>
                      );
                    })
                  }
                </ResponsiveGrid>
              </div>
            );
          })
        }
        {
          !categoryData.length ? <div className={styles.empty}>
            Empty
          </div> : null
        }
      </div>
    </div>
  );
};

export const MaterialType: React.FC<{
  data: IMaterialTypeDatum[];
  isLoadingData: boolean;
  sourceIndex?: number;
  disableLazyLoad?: boolean;
  colSpan?: number;
  onComponentClick?: (dataSource: IMaterialComponent) => void;
  onBaseClick?: (dataSource: IMaterialBase) => void;
  onBlockClick?: (dataSource: IMaterialBlock) => void;
  onScaffoldClick?: (dataSource: IMaterialScaffold) => void;
}> = ({ sourceIndex, data, disableLazyLoad, isLoadingData, onScaffoldClick, onBlockClick, onComponentClick, onBaseClick, colSpan = 8 }) => {
  const scrollId = disableLazyLoad ? '' : `iceworks_material_content_${sourceIndex}`;
  const currentId = data[0] ? data[0].id : '';
  const [typeId, setTypeId] = React.useState(currentId);

  React.useEffect(() => {
    setTypeId(currentId);
  }, [currentId]);

  async function handleTypeChange(value) {
    setTypeId(value);
  }

  return (
    <Loading visible={isLoadingData} className={styles.spin}>
      { data.length > 1 && <div className={styles.head}>
        <Radio.Group shape="button" value={typeId} onChange={handleTypeChange}>
          {
            data.map(({ name, id }) => {
              return (
                <Radio value={id} key={id}>
                  { name }
                </Radio>
              );
            })
          }
        </Radio.Group>
      </div>}
      {
        data.map((item) => {
          const { name, id } = item;
          return typeId === id ? <Content
            {...item}
            key={`${name}_${id}`}
            onScaffoldClick={onScaffoldClick}
            onBlockClick={onBlockClick}
            onComponentClick={onComponentClick}
            onBaseClick={onBaseClick}
            colSpan={colSpan}
            scrollId={scrollId}
            typeId={typeId}
          /> : null;
        })
      }
    </Loading>
  );
};
