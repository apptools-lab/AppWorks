import { ILayoutConfig } from '../types';

const actionsList = ['headerAvatar', 'notice', 'solutionLink'];

const shellAttribute = ['type', 'fixedHeader'];

const shellComponent = ['branding', 'footer', 'headerAvatar'];

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
      basicLayoutConfig.layoutConfig[configName] = layoutConfigs[configName];
    } else if (shellComponent.includes(configName)) {
      if (actionsList.includes(configName)) {
        basicLayoutConfig.layoutConfig.shell.action.push(defaultLayoutConfig[configName]);
      } else {
        basicLayoutConfig.layoutConfig.shell[configName] = defaultLayoutConfig[configName];
      }
    }
  });

  layouts.push(basicLayoutConfig);

  return layouts;
};
