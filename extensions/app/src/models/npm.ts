// import { get as getConfig, set as setConfig } from '@iceworks/config';

// interface IState {
//   client: string;
//   registry: string;
// }

// const materials = {
//   state: {
//     // TODO 类型
//     client: getConfig('npmClient'),
//     registry: getConfig('registry'),
//   },
//   reducers: {
//     setClient(prevState: IState, client: string): IState {
//       setConfig('npmClient', client);
//       return {
//         ...prevState,
//         client,
//       };
//     },
//     setRegistry(prevState: IState, registry: string): IState {
//       setConfig('registry', registry);
//       return {
//         ...prevState,
//         registry,
//       };
//     },
//   },
//   effects: {
//     // async enableCollection(prevState: IState, opts: { enable: boolean; url: string }, actions): Promise<void> {
//     //   actions.modifyCollection(opts);
//     // },
//   },
// };

// export default materials;
