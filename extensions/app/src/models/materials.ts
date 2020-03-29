import { callService } from '@/services';

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
    setCurrentCollection(prevState: IState, data: ICollection): IState {
      return {
        ...prevState,
        currentCollection: data,
      };
    },
  },
  effects: {
    async fetchCollectionData(prevState: IState, url: string, actions): Promise<void> {
      console.log('fetchCollectionData');
      const currentCollection = prevState.collections.find((item) => {
        return item.url === url;
      });

      if (!currentCollection) {
        throw new Error('Invalid url');
      }

      if (!currentCollection.data) {
        const { data } = (await callService('axios', 'get', currentCollection.url)) as {
          data: IMaterialData;
        };
        currentCollection.data = data;
      }

      actions.setCurrentCollection(currentCollection);
    },

    // async enableCollection(prevState: IState, opts: { enable: boolean; url: string }, actions): Promise<void> {
    //   actions.modifyCollection(opts);
    // },
  },
};

export default materials;
