declare module 'vscode-web-custom-data/data/browsers.css-data.json' {
  export interface IPropertyValue {
    name: string;
    description?: string;
  }

  export interface IProperty {
    name: string;
    values?: IPropertyValue[];
    syntax?: string;
    references?: Array<{ name: string; url: string }>;
    description: string;
    restrictions?: string[];
  }

  export interface ICssData {
    version: string;
    properties: IProperty[];
  }

  const CSSData: ICssData;
  export default CSSData;
}
