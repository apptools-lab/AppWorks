export default {
  hooks: {
    activate: 'activate',
    deactivate: 'deactivate',
  },
  entry: [
    {
      id: 'iceworks.def.publish',
      type: 'button',
      title: 'DEF发布',
      iconPath: 'https://img.alicdn.com/tfs/TB1I6LfoPMZ7e4jSZFOXXX7epXa-200-200.png',
      iconMaskMode: false,
      action: 'defPublish',
      states: {
        publishing: {
          title: '发布中',
          background: 'var(--button-hoverBackground)',
          // TODO: 抹平
          showTitle: true,
          btnTitleStyle: 'horizontal',
          btnStyle: 'button',
        }
      },
    }
  ]
};
