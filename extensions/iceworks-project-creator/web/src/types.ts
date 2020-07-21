import { IMaterialScaffold, IMaterialSource } from '@iceworks/material-utils';

export interface IProjectField {
  projectName: string;
  projectPath: string;
  scaffold: IMaterialScaffold;
  source: IMaterialSource;
  scaffoldType: string;
  ejsOptions?: IEjsOptions;
}

interface IEjsOptions {
  targets?: string[];
  miniappType?: 'runtime' | 'compile';
  mpa?: boolean;
}

export interface IDEFProjectField {
  empId: string;
  account: string;
  group: string;
  project: string;
  gitlabToken: string;
}

export interface IGitLabExistProject {
  name: string;
  id: string;
}

export interface IGitLabGroup {
  'avatar_url': string;
  'description': string;
  'id': number;
  'name': string;
  'path': string;
  'web_url': string;
}

export interface IScaffoldMarket {
  mainScaffolds: IMaterialScaffold[];
  otherScaffolds: IMaterialScaffold[];
}