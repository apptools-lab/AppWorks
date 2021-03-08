export interface IAppType {
  type: string;
  title: string;
  pubType: string;
  icon: string;
  description: string;
}

export const webAppTypes: IAppType[] = [
  {
    type: 'web-mpa',
    title: 'MPA',
    pubType: 'web',
    icon: 'https://gw.alicdn.com/tfs/TB1Qx3Feq61gK0jSZFlXXXDKFXa-200-200.svg',
    description: '将 App 工程变成多页面工程，每个页面会构建出独立的资源文件。',
  },
  {
    type: 'web-spa',
    title: 'SPA',
    pubType: 'web',
    icon: 'https://gw.alicdn.com/tfs/TB1Qx3Feq61gK0jSZFlXXXDKFXa-200-200.svg',
    description: '单页应用(Single Page Application)，相比多页应用它具有更好的页面切换体验和更一致的状态管理模式。',
  },
];

export const crossEndAppTypes: IAppType[] = [
  {
    type: 'miniapp',
    title: '小程序',
    pubType: 'weex',
    icon: 'https://gw.alicdn.com/tfs/TB1Y9.zeuL2gK0jSZPhXXahvXXa-200-200.svg',
    description: '将 Rax 作为 DSL 极速开发阿里巴巴集团旗下系列小程序和微信小程序，使前端开发者更容易地使用他们熟悉的方式进行小程序开发。',
  },
  {
    type: 'kraken-mpa',
    title: 'Kraken',
    pubType: 'weex',
    icon: 'https://gw.alicdn.com/tfs/TB1T.AEeET1gK0jSZFhXXaAtVXa-200-200.svg',
    description: 'Kraken 是一个面向 IoT 场景的渲染引擎，依托可靠高效的 Flutter 底层构建面向 W3C 标准的接口。对接 Rax 作为上层 DSL，使前端开发者更容易地使用他们熟悉的方式进行跨容器应用的开发。',
  },
  {
    type: 'weex-mpa',
    title: 'Weex',
    pubType: 'weex',
    icon: 'https://gw.alicdn.com/tfs/TB1bN.FerY1gK0jSZTEXXXDQVXa-213-200.svg',
    description: 'Weex 致力于使开发者能基于通用跨平台的 Web 开发语言和开发经验，来构建 Android、iOS 和 Web 应用。',
  },
];
