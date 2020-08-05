import schema from '../../../schemas/ice.build.zh-cn.json';
import jsonContent from '../mockBuild.json';

const mockInitData = {
  schema,
  webviewCannotEditProps: ['alias', 'devServer'],
  jsonContent,
  jsonFileName: 'build.json',
};

export default mockInitData;
