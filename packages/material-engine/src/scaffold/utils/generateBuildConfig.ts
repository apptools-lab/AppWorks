import latestVersion from 'latest-version';
import { IBuildConfig } from '../types';

export default async (buildConfig: IBuildConfig) => {
  const { theme } = buildConfig;
  const config = {} as any;
  if (theme) {
    const themeVersion = await latestVersion(theme);
    config.theme = { package: theme, version: `^${themeVersion}` };
  }
  return config;
};
