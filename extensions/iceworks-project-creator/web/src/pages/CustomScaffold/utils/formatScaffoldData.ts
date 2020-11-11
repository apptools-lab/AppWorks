import { CUSTOM_THEME_SELECT_VALUE } from '../constants';

export default (value) => {
  const { layout, layoutType, theme, advancedConfig, customTheme } = value;
  const data = {
    layout: {
      type: layoutType,
    },
    build: {
      theme,
    },
    advance: {},
    menu: {
      asideMenu: [],
      headerMenu: [],
    },
  };
  if (theme === CUSTOM_THEME_SELECT_VALUE) {
    data.build.theme = customTheme;
  }

  advancedConfig.forEach(item => {
    data.advance[item] = true;
  });

  layout.forEach(item => {
    data.layout[item] = true;
  });

  return data;
};
