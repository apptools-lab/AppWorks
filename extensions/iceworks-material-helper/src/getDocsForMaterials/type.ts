export interface IQuickPickInfo {
  label: string;
  detail: string;
  description: string;
  homepage: string;
}
export enum SourceType{
  QUICK_PICK_INFO = 'quickPickInfo',
  COMMAND = 'commands'
}