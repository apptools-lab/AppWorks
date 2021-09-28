import { getProjectType } from '@appworks/project-service';

const commonOptions = [{ value: '', label: '全部' }];

const PCOptions = [
  { value: 'fusion', label: 'fusion' },
  { value: 'antd', label: 'antd' },
].concat(commonOptions);

const mobileOptions = [
  { value: 'fusion-mobile', label: 'fusion-mobile' },
].concat(commonOptions);

const componentTypeOptionsMap = {
  react: PCOptions,
  rax: mobileOptions,
  default: commonOptions,
};

export async function getComponentTypeOptionsByProjectType() {
  const projectType = await getProjectType();
  return componentTypeOptionsMap[projectType] || componentTypeOptionsMap['default'];
}
