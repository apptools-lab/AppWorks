import { ILayoutConfig } from '../types';

const shellAttribute = ['type', 'fixedHeader'];
const shellActionsList = ['headerAvatar', 'notice', 'solutionLink'];
const shellComponent = ['branding', 'footer', 'action', 'nav', 'navHoz'];
const defaultLayoutConfig = {
  branding: {
    name: 'Logo',
    props: {
      image: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
      text: 'Logo',
    },
    type: 'builtIn',
  },
  headerAvatar: {
    name: 'HeaderAvatar',
    type: 'builtIn',
  },
  footer: {
    name: 'Footer',
    type: 'builtIn',
  },
};

export default (layoutConfigs: ILayoutConfig) => {
  const layouts = [];
  const basicLayoutConfig = {
    type: 'builtIn',
    name: 'BasicLayout',
    menuConfig: true,
    layoutConfig: {
      shell: {
        nav: {
          name: 'PageNav',
          type: 'builtIn',
        },
        navHoz: [],
        action: [],
      },
    },
  };

  Object.keys(layoutConfigs).forEach(configName => {
    if (shellAttribute.includes(configName)) {
      // add Shell component props
      basicLayoutConfig.layoutConfig[configName] = layoutConfigs[configName];
    } else if (shellComponent.includes(configName) || shellActionsList.includes(configName)) {
      // add Shell Children component props
      if (shellActionsList.includes(configName) && layoutConfigs[configName]) {
        basicLayoutConfig.layoutConfig.shell.action.push(defaultLayoutConfig[configName]);
      } else if (shellComponent.includes(configName) && layoutConfigs[configName]) {
        basicLayoutConfig.layoutConfig.shell[configName] = defaultLayoutConfig[configName];
      }
    }
  });

  layouts.push(basicLayoutConfig);

  return layouts;
};
