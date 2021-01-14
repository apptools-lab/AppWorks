import callService from '@/callService';

export default {
  state: {
    data: [],
    inited: false,
  },
  reducers: {
  },
  effects: () => ({
    async refresh() {
      this.setState({
        data: await callService('project', 'getCoreDependencies'),
        inited: true,
      });
    },
  }),
};
