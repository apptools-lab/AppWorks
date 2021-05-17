import { IMaterialScaffold, IMaterialSource } from '@appworks/material-utils';
import { IEjsOptions } from '@iceworks/generate-project';

export interface IProjectField {
  projectName: string;
  projectPath: string;
  scaffold: IMaterialScaffold;
  source: IMaterialSource;
  ejsOptions?: IEjsOptions;
  pubAppType?: string;
}

export interface IDEFProjectField extends IProjectField {
  empId: string;
  account: string;
  group: string;
  project: string;
  gitlabToken: string;
  scaffold: IMaterialScaffold;
  clientToken: string;
  projectPath: string;
  projectName: string;
  source: IMaterialSource;
  ejsOptions?: IEjsOptions;
  pubAppType?: string;
}
