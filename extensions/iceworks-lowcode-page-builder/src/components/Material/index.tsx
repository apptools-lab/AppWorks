import * as React from 'react';
import { Material } from './view';
import { convertMaterialData } from './utils/material';
import { IMaterialData, IMaterialSource, IMaterialBlock, IMaterialComponent, IMaterialBase } from './types/material';
import * as styles from './index.module.scss';

const View : React.FC<{
  getSources: () => Promise<IMaterialSource[]>;
  getData: (source: string) => Promise<IMaterialData>;
  onBlockClick: (block: IMaterialBlock) => void;
  onComponentClick: (component: IMaterialComponent) => void;
  onBaseClick: (base: IMaterialBase) => void;
}> = ({ getSources, getData, ...others }) => {
  const [sources, setSources] = React.useState([]);
  const [currentSource, setCurrentSource] = React.useState('');
  const [data, setData] = React.useState([]);
  const [isLoadingData, setIsLoadingData] = React.useState(false);

  async function refreshSources() {
    const sources = await getSources();
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

    // do not show scaffold in material panel
    const data = convertMaterialData(materialData).filter(({ id }) => id !== 'scaffolds');
    setIsLoadingData(false);
    setData(data);
  }

  React.useEffect(() => {
    refreshSources();
  }, []);

  return (
    <div className={styles.componentMaterialWrap}>
      <Material
        sources={sources}
        currentSource={currentSource}
        data={data}
        isLoadingData={isLoadingData}
        colSpan={24}
        onChangeSource={handleChangeSource}
        {...others}
      />
    </div>
  );
};

export default View;
