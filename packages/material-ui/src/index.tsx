import * as React from 'react';
import { Icon, Loading } from '@alifd/next';
import {
  IMaterialData,
  IMaterialSource,
  IMaterialBlock,
  IMaterialComponent,
  IMaterialBase,
  convertMaterialData,
} from '@appworks/material-utils';
import { MaterialView } from './components/view';

const Index: React.FC<{
  getSources: () => Promise<IMaterialSource[]>;
  getData: (source: string) => Promise<IMaterialData>;
  getComponentTypeOptions: () => Promise<Array<{value: string, label: string}>>;
  refreshSources?: () => Promise<IMaterialSource[]>;
  disableLazyLoad?: boolean;
  selectedBlocks?: IMaterialBlock[];
  selectedComponents?: IMaterialComponent[];
  selectedBases?: IMaterialBase[];
  dataWhiteList?: string[];
  dataBlackList?: string[];
  projectComponentType?: string;
  onBlockClick?: (block: IMaterialBlock) => void;
  onComponentClick?: (component: IMaterialComponent) => void;
  onBaseClick?: (base: IMaterialBase) => void;
  onSettingsClick?: () => void;
}> = ({
  refreshSources,
  getSources,
  getData,
  getComponentTypeOptions,
  dataBlackList = [],
  dataWhiteList = [],
  onSettingsClick,
  projectComponentType = '',
  ...others
 }) => {
  const [sources, setSources] = React.useState([]);
  const [currentSource, setCurrentSource] = React.useState('');
  const [data, setData] = React.useState([]);
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [isLoadingSources, setIsLoadingSources] = React.useState(false);
  const [componentTypeOptions, setComponentTypeOptions] = React.useState<Array<{value: string, label: string}>>([]);

  async function onRefreshSources() {
    setIsLoadingSources(true);
    const sources = (await refreshSources()) || [];
    setIsLoadingSources(false);
    resetSources(sources);
  }

  async function onGetSources() {
    setIsLoadingSources(true);
    const sources = (await getSources()) || [];
    const componentTypeOptions = await getComponentTypeOptions();
    setIsLoadingSources(false);
    resetSources(sources);
    setComponentTypeOptions(componentTypeOptions);
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
    const materialData: IMaterialData = await getData(source);
    const data = convertMaterialData(materialData).filter(({ id }) => {
      return !dataBlackList.includes(id) && (dataWhiteList.length > 0 ? dataWhiteList.includes(id) : true);
    });
    setIsLoadingData(false);
    setData(data);
  }

  React.useEffect(() => {
    onGetSources();
  }, []);

  return (
    <Loading visible={isLoadingSources} className="appworks-material">
      <MaterialView
        sources={sources}
        currentSource={currentSource}
        data={data}
        isLoadingData={isLoadingData}
        isLoadingSources={isLoadingSources}
        colSpan={24}
        onChangeSource={handleChangeSource}
        componentTypeOptions={componentTypeOptions}
        projectComponentType={projectComponentType}
        extra={
          <div className="extra-wrap">
            {onSettingsClick && <Icon type="set" size="small" title="设置物料源" onClick={onSettingsClick} />}
            { refreshSources && <Icon
              type="refresh"
              size="small"
              title="获取最新物料源信息"
              onClick={onRefreshSources}
              style={{ marginLeft: 6 }}
            />}
          </div>
        }
        {...others}
      />
    </Loading>
  );
};

export default Index;
