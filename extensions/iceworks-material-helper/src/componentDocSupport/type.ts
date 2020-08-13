import { Uri } from 'vscode';

export interface IComponentDocInfo {
  label: string;
  detail: string;
  description: string;
  url: string;
  command: string;
  commandUrl?: Uri;
}
