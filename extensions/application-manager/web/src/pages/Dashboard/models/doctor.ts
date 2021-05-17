import callService from '@/callService';

export default {
  state: {
    report: {},
    inited: false,
  },
  reducers: {
  },
  effects: () => ({
    async getReport() {
      this.setState({ inited: true });
      this.setState({
        report: await callService('doctor', 'getReport'),
      });
    },
  }),
};
