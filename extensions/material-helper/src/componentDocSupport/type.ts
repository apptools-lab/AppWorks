export interface IComponentDocInfo {
  label: string;
  detail: string;
  description: string;
  url: string;
  source?: ISource;
  command?: string;
}

interface ISource {
  type: string;
  npm: string;
  version: string;
  registry: string;
}
