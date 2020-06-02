import { checkAliInternal } from 'ice-npm-utils';

export async function checkIsAliInternal(): Promise<boolean> {
  const isAliInternal = await checkAliInternal();
  return isAliInternal;
}