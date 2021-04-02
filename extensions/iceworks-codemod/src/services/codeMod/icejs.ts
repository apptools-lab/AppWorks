export default {
  name: 'icejs',
  packageName: 'icejs-codemod',
  description: 'A collection of codemod scripts for update icejs APIs.',
  transforms: [
    {
      name: 'createApp to runApp',
      filename: 'createApp-to-runApp',
      description: 'Replace createApp to runApp in app.[t|j]s',
    },
  ],
};
