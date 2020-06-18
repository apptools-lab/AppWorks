import { IMaterialScaffold } from '@/iceworks/material-utils';

export interface IProjectField {
  projectName: string;
  projectPath: string;
  scaffold: IMaterialScaffold;
  scaffoldType: string;
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
