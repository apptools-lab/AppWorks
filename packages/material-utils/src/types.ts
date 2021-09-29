/**
 *  ----------------------- 物料源数据结构 -----------------------
 */

export interface IMaterialSource {
  name: string;
  type: string;
  source: string;
  client?: string;
  official?: boolean;
  checked?: boolean;
  description?: string;
  isEditing?: boolean;
}

/**
 *  ----------------------- 物料数据结构 -----------------------
 */

export interface INpmDependencies {
  [pacakge: string]: string;
}

export interface IMaterialNpmSource {
  type: string;
  npm: string;
  version: string;
  registry: string;
}

export interface IMaterialBase {
  name: string;
  title: string;
  categories: string[];
  importStatement: string;
  homepage: string;
  repository: string;
  source: IMaterialNpmSource;
  componentType?: string;
}

export interface IMaterialScaffold {
  builder?: string;
  categories: string[];
  dependencies: INpmDependencies;
  description: string;
  homepage: string;
  name: string;
  publishTime: string;
  repository: string;
  screenshot: string;
  screenshots: string[];
  source: IMaterialNpmSource;
  title: string;
  updateTime: string;
  isNewlyCreated?: boolean;
  languageType?: 'js' | 'ts';
  componentType?: string;
}

export interface IMaterialComponent {
  categories: string[];
  homepage: string;
  name: string;
  repository: string;
  source: IMaterialNpmSource;
  title: string;
  screenshots?: string[];
  screenshot?: string;
  publishTime?: string;
  updateTime?: string;
  description?: string;
  dependencies?: INpmDependencies;
  importStatement?: string;
  componentType?: string;
}

export interface IMaterialBlock {
  name: string;
  title: string;
  description: string;
  homepage: string;
  categories: string[];
  repository: string;
  source: IMaterialNpmSource;
  dependencies: INpmDependencies;
  screenshot: string;
  screenshots: string[];
  publishTime: string;
  updateTime: string[];
  uid: string[];
  isNewly: boolean;
  componentType?: string;
}

export interface IMaterialPage {
  name: string;
  title: string;
  description: string;
  homepage: string;
  categories: string[];
  repository: string;
  source: IMaterialNpmSource;
  dependencies: INpmDependencies;
  screenshot: string;
  screenshots: string[];
  publishTime: string;
  updateTime: string[];
  uid: string[];
  isNewly: boolean;
  pageName: any;
  componentType?: string;
  templateData?: any;
}

export interface IMaterialData {
  type: string;
  name: string;
  blocks: IMaterialBlock[];
  pages: IMaterialPage[];
  components: IMaterialComponent[];
  scaffolds: IMaterialScaffold[];
  bases?: IMaterialBase[];
}

/**
 *  ----------------------- 物料渲染数据结构 -----------------------
 */

export type IMaterialItem = IMaterialBlock | IMaterialComponent | IMaterialScaffold | IMaterialBase;

export interface IMaterialCategoryDatum {
  name: string;
  list: IMaterialItem[];
}

export interface IMaterialTypeDatum {
  name: string;
  id: string;
  categoryData: IMaterialCategoryDatum[];
}

/**
 *  ----------------------- 物料服务接口 -----------------------
 */

export const MaterialServerPath = 'MaterialServerPath';

export const IMaterialServer = Symbol('IMaterialServer');

export interface IMaterialServer {
  getSources: (type?: string) => Promise<IMaterialSource[]>;
  getData: (source: string) => Promise<IMaterialData>;
  addSource: (param: IMaterialAddSourceParam) => Promise<IMaterialSource[]>;
  updateSource: (newSource: IMaterialAddSourceParam, originSource: IMaterialSource) => Promise<IMaterialSource[]>;
  removeSource: (source: string) => Promise<IMaterialSource[]>;
}

export interface ILocalBack {
  name: string;
  desc: string;
}

export interface IMaterialModule extends IMaterialServer {
  goldlog: (originParam: any) => any;
  maxComposePanel: () => any;
  checkIsTemplate: (fsPath: string) => boolean;
  getLocalBlocks: () => ILocalBack[];
  editLocalBlock: (oldBlock: ILocalBack, newBlock: ILocalBack) => void;
  composeLocalBlock: (blockName: string) => void;
  deleteLocalBlock: (blockName: string) => void;
  createLocalBlock: () => void;
  addBlockCode: (block: IMaterialBlock) => Promise<void>;
  addCode: (dataSource: IMaterialComponent) => Promise<void>;
}

export const IMaterialModule = Symbol('IMaterialModule');

export const IMaterialService = Symbol('IMaterialService');

export interface IMaterialAddSourceParam {
  name: string;
  source: string;
  description?: string;
  checked?: boolean;
}

export interface IMaterialService {
  isLoadingData: boolean;
  customSource: string;
  sources: IMaterialSource[];
  data: IMaterialTypeDatum[];
  currentSource: string;
  getSources: () => Promise<void>;
  setCurrentSource: (source: string) => Promise<void>;
  addSource: (param: IMaterialAddSourceParam) => Promise<void>;
  removeSource: (source: string) => Promise<void>;
  getMaterialData: (source: string) => Promise<void>;
  setSourceIsEditing: (source: string, isEditing: boolean) => Promise<void>;
  updateSource: (newSource: IMaterialAddSourceParam, originSource: IMaterialSource) => Promise<void>;
}
