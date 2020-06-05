import { IMaterialScaffold } from '@/iceworks/material-utils';

export interface IProjectField {
  projectName: string;
  projectPath: string;
  scaffold: IMaterialScaffold;
}

export interface IDEFProjectField {
  empId: string;
  account: string;
  group: string;
  project: string;
  gitlabToken: string;
}

export interface ISettingJsonData {
  empId: string;
  projectPath: string;
  account: string;
  gitlabToken: string;
}