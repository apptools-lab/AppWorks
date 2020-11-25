export const targets = [
  {
    type: 'web',
    title: 'Web',
    icon: 'https://gw.alicdn.com/tfs/TB1Qx3Feq61gK0jSZFlXXXDKFXa-200-200.svg',
    description: 'Web App 是指运行于浏览器上的应用，具有开发成本低、开发及更新速度快，维护比较简单的优势。',
  },
  {
    type: 'miniapp',
    title: 'Alibaba MiniApp',
    icon: 'https://gw.alicdn.com/tfs/TB1Y9.zeuL2gK0jSZPhXXahvXXa-200-200.svg',
    description:
      '将 Rax 作为 DSL 极速开发阿里巴巴集团旗下系列小程序，使前端开发者更容易地使用他们熟悉的方式进行小程序开发。',
  },
  {
    type: 'wechat-miniprogram',
    title: 'WeChat MiniProgram',
    icon: 'https://gw.alicdn.com/tfs/TB1HwgzepY7gK0jSZKzXXaikpXa-200-200.svg',
    description: '将 Rax 作为 DSL 极速开发微信小程序，使前端开发者更容易地使用他们熟悉的方式进行小程序开发。',
  },
];

export const webAppTypes = [
  {
    type: 'spa',
    title: 'SPA',
    description: '单页应用(Single Page Application)，相比多页应用它具有更好的页面切换体验和更一致的状态管理模式。',
  },
  {
    type: 'mpa',
    title: 'MPA',
    description: '将 App 工程变成多页面工程，每个页面会构建出独立的资源文件。',
  },
];

export const miniAppTypes = [
  {
    type: 'runtime',
    title: '运行时',
    description:
      '基于运行时的 Rax，可享受完整的 Rax 语法及其生态。适用于需要小程序快速开发上线同时对性能不敏感或小程序复杂度较低的场景',
  },
  {
    type: 'compile',
    title: '编译时',
    description: '基于静态编译方式将 Rax DSL 转换为小程序 DSL，存在部分语法限制。适用于对小程序性能要求较高的场景',
  },
];
