import { getProjectType, getProjectLanguageType } from '@appworks/project-service';

export default async function isRaxTsProject(): Promise<boolean> {
  const type = await getProjectType();
  const languageType = await getProjectLanguageType();
  return type === 'rax' && languageType === 'ts';
}

