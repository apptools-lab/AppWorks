declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

interface IMaterialItem {
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
