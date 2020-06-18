import { IMaterialScaffold } from '@iceworks/material-utils';

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

export interface IGitLabGroup {
  'avatar_url': string;
  'description': string;
  'id': number;
  'name': string;
  'path': string;
  'web_url': string;
}