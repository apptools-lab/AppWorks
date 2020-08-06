import schema from './ice.build.json';
import jsonContent from '../mockBuild.json';

const mockInitData = {
  schema,
  currentFormCannotEditProps: ['alias', 'devServer'],
  jsonContent,
  currentJsonFileName: 'build.json',
};

export default mockInitData;
