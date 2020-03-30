import callService from './callService';

const defaultConfig = {
  npmClient: 'npm',
  registry: 'https://registry.npmjs.org',
  materialCollections: [
    {
      url: 'https://ice.alicdn.com/assets/materials/react-materials.json',
      title: '官方物料源',
      description: '基于 icejs & Fusion 组件',
      official: true,
    },
    {
      url: 'https://ice.alicdn.com/assets/materials/vue-materials.json',
      title: 'Vue 物料源',
      description: '基于 Vue CLI & ElementUI 组件',
      official: true,
    },
  ],
};

export const get = async (key?: string) => {
  if ((window as any).isVscode) {
    return await callService('config', 'get', key);
  } else {
    return defaultConfig;
  }
}
