export default {
  name: 'icejs',
  packageName: 'icejs-codemod',
  description: 'A collection of codemod scripts for update icejs APIs.',
  applyFrameworks: ['icejs'],
  parserMap: [
    {
      languageType: 'js',
      value: 'babel',
    },
    {
      languageType: 'ts',
      value: 'tsx',
    },
  ],
  transforms: [
    {
      name: 'createApp to runApp',
      filename: 'createApp-to-runApp',
      description: 'Replace createApp to runApp in app.[t|j]s',
    },
  ],
};
