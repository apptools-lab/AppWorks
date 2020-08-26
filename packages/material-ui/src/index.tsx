import * as React from 'react';
import { Icon, Loading } from '@alifd/next';
import {
  IMaterialData,
  IMaterialSource,
  IMaterialBlock,
  IMaterialComponent,
  IMaterialBase,
  convertMaterialData,
} from '@iceworks/material-utils';
import { MaterialView } from './components/view';

const Index: React.FC<{
  getSources: () => Promise<IMaterialSource[]>;
  getData: (source: string) => Promise<IMaterialData>;
  disableLazyLoad?: boolean;
  selectedBlocks?: IMaterialBlock[];
  selectedComponents?: IMaterialComponent[];
  selectedBases?: IMaterialBase[];
  dataWhiteList?: string[];
  dataBlackList?: string[];
  onBlockClick?: (block: IMaterialBlock) => void;
  onComponentClick?: (component: IMaterialComponent) => void;
  onBaseClick?: (base: IMaterialBase) => void;
  onSettingsClick?: () => void;
}> = ({ getSources, getData, dataBlackList = [], dataWhiteList = [], onSettingsClick, ...others }) => {
  const [sources, setSources] = React.useState([]);
  const [currentSource, setCurrentSource] = React.useState('');
  const [data, setData] = React.useState([]);
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [isLoadingSources, setIsLoadingSources] = React.useState(false);

  async function refreshSources() {
    setIsLoadingSources(true);
    const sources = (await getSources()) || [];
    setIsLoadingSources(false);
    resetSources(sources);
  }

  function resetSources(sources: IMaterialSource[]) {
    const defaultMaterial = sources[0];
    const source = defaultMaterial ? defaultMaterial.source : '';

    setSources(sources);
    resetCurrentSource(source);
  }

  function handleChangeSource(source: string) {
    resetCurrentSource(source);
  }

  async function resetCurrentSource(currentSource: string) {
    setCurrentSource(currentSource);
    await refreshMaterialData(currentSource);
  }

  async function refreshMaterialData(source: string) {
    setIsLoadingData(true);
    /**
     *  DEVELOPMENT
     */
    console.log(source);
    // const materialData: IMaterialData = await getData(source);
    // eslint-disable-next-line
    const materialData: IMaterialData = require('./mockData.json');
    console.log('materialData', JSON.stringify(materialData));
    // DEVELOPMENT
    const data = convertMaterialData(materialData).filter(({ id }) => {
      return !dataBlackList.includes(id) && (dataWhiteList.length > 0 ? dataWhiteList.includes(id) : true);
    });
    setIsLoadingData(false);
    setData(data);
  }

  React.useEffect(() => {
    refreshSources();
  }, []);

  return (
    <Loading visible={isLoadingSources} className="iceworks-material">
      <MaterialView
        sources={sources}
        currentSource={currentSource}
        data={data}
        isLoadingData={isLoadingData}
        isLoadingSources={isLoadingSources}
        colSpan={24}
        onChangeSource={handleChangeSource}
        extra={
          <div className="extra-wrap">
            {onSettingsClick && <Icon type="set" size="small" title="设置物料源" onClick={onSettingsClick} />}
            <Icon
              type="refresh"
              size="small"
              title="获取最新物料源信息"
              onClick={refreshSources}
              style={{ marginLeft: 6 }}
            />
          </div>
        }
        {...others}
      />
    </Loading>
  );
};

export default Index;
