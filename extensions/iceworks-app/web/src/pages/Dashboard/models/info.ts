import callService from '@/callService';

const CLIENT_TOKEN = process && process.env && process.env.CLIENT_TOKEN;

export default {
  state: {
    basic: { name: '', description: '', type: '', framework: '', path: '', feedbackLink: '' },
    git: { repository: '', branch: '', isGit: false },
    def: { idpUrl: '', defUrl: '', isDef: false },
    inited: false,
  },
  reducers: {
  },
  effects: () => ({
    async refresh() {
      const basic = await callService('project', 'getProjectBaseInfo');
      const git = await callService('project', 'getProjectGitInfo');
      const def = await callService('project', 'getProjectDefInfo', CLIENT_TOKEN);
      this.setState({
        basic,
        git,
        def,
        inited: true,
      });
    },
  }),
};
