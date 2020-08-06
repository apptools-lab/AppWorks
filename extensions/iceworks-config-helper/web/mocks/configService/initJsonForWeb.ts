import schema from '../../../schemas/ice.build.zh-cn.json';
import jsonContent from '../mockBuild.json';

const mockInitData = {
  schema,
  currentFormCannotEditProps: ['alias', 'devServer'],
  jsonContent,
  currentJsonFileName: 'build.json',
};

export default mockInitData;
