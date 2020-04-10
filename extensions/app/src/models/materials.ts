import { IRootDispatch, IRootState } from 'ice';
import { fetchData as fetchMaterialData } from '@/services/material';

// TODO: @iceworks/config
interface IMaterialCollection {
  url: string;
  official?: boolean;
  title: string;
  description: string;
  enable?: boolean;
}

interface IMaterialData {
  type?: string;
  blocks?: IMaterialItem[];
  scaffolds?: IMaterialItem[];
  components?: IMaterialItem[];
}

interface ICollection extends IMaterialCollection {
  data?: IMaterialData;
}

interface IState {
  collections: ICollection[];
  currentCollection: ICollection | undefined;
}

const state: IState = {
  collections: [],
  currentCollection: undefined,
};

const materials = {
  state,
  reducers: {
  //   addCollection(prevState: IState, data: ICollection): IState {
  //     const collections = addMaterialCollection(data);
  //     return {
  //       ...prevState,
  //       collections,
  //     };
  //   },
  //   removeCollection(prevState: IState, data: ICollection): IState {
  //     const collections = removeMaterialCollection(data);
  //     return {
  //       ...prevState,
  //       collections,
  //     };
  //   },
  //   modifyCollection(prevState: IState, opts: { url: string; enable: boolean }): IState {
  //     const collections = modifyMaterialCollection(opts);
  //     return {
  //       ...prevState,
  //       collections,
  //     };
  //   },
    setCurrentCollection(prevState: IState, collection: ICollection) {
      prevState.currentCollection = collection;
    },
    setCurrentCollectionData(prevState: IState, data: IMaterialData) {
      if (prevState.currentCollection) {
        prevState.currentCollection.data = data;
      }
    },
  },
  effects: (dispach: IRootDispatch) => ({
    async fetchCollectionData(url: string, rootState: IRootState): Promise<void> {
      const currentCollection = rootState.materials.collections.find((item) => {
        return item.url === url;
      });

      if (!currentCollection) {
        throw new Error(`Invalid url: ${url}`);
      }

      dispach.materials.setCurrentCollection(currentCollection);

      if (!currentCollection.data) {
        const data = (await fetchMaterialData(url)) as IMaterialData;
        dispach.materials.setCurrentCollectionData(data);
      }
    },

    // async enableCollection(prevState: IState, opts: { enable: boolean; url: string }, actions): Promise<void> {
    //   actions.modifyCollection(opts);
    // },
  }),
};

export default materials;
