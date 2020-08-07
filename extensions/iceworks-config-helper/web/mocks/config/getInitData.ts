import schema from './ice.build.json';
import jsonContent from '../mockBuild.json';

const mockInitData = {
  schema,
  formCannotEditProps: ['alias', 'hash', 'compileDependencies'],
  jsonContent,
  editingJsonFile: 'build.json',
};

export default mockInitData;
