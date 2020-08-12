import { Uri } from 'vscode';

export interface IMaterialDocInfo {
  label: string;
  detail: string;
  description: string;
  url: string;
  command: string;
  commandUrl?: Uri;
}
