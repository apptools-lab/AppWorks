import schema from './ice.build.json';
import jsonContent from '../mockBuild.json';

const mockInitData = {
  schema,
  formCannotEditProps: ['alias', 'devServer'],
  jsonContent,
  editingJSONFile: 'build.json',
};

export default mockInitData;
