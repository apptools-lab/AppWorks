export interface IMaterialSource {
  name: string;
  type: 'react' | 'vue',
  source: string,
  description: string
}

export interface IMaterialItem {
  name: string;
  title: string;
  category: string;
  screenshot: string;
  description: string;
  homepage: string;
  categories: string[];
  repository: string;
  source: {
    type: string;
    npm: string;
    version: string;
    registry: string;
  };
  screenshots: string[];
  publishTime: Date;
  updateTime: Date;

  showDownload?: boolean;
  previewText?: string;
}
