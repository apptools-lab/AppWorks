import * as React from 'react';
import { Icon } from '@alifd/next';
import { IMaterialData, IMaterialSource, IMaterialBlock, IMaterialComponent, IMaterialBase, convertMaterialData } from '@iceworks/material-utils';
import { MaterialView } from './components/view';

const Index : React.FC<{
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

  async function refreshSources() {
    const sources = await getSources() || [];
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
  };

  async function resetCurrentSource(currentSource: string) {
    setCurrentSource(currentSource);
    await refreshMaterialData(currentSource);
  }

  async function refreshMaterialData(source: string) {
    setIsLoadingData(true);
    const materialData: IMaterialData = await getData(source);
    const data = convertMaterialData(materialData).filter(({ id }) => !dataBlackList.includes(id) && (dataWhiteList.length > 0 ? dataWhiteList.includes(id) : true) );
    setIsLoadingData(false);
    setData(data);
  }

  React.useEffect(() => {
    refreshSources();
  }, []);

  return (
    <div className="iceworks-material">
      <MaterialView
        sources={sources}
        currentSource={currentSource}
        data={data}
        isLoadingData={isLoadingData}
        colSpan={24}
        onChangeSource={handleChangeSource}
        extra={
          <div className="extra-wrap">
            {onSettingsClick &&
              <Icon type="set" size="small" title="Setings Material Sources" onClick={onSettingsClick} />
            }
            <Icon type="refresh" size="small" title="refresh Material Sources" onClick={refreshSources} style={{marginLeft: 6}} />
          </div>
        }
        {...others}
      />
    </div>
  );
};

export default Index;
