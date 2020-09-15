import * as fs from 'fs-extra';
import * as path from 'path';
import getRepoInfo from 'git-repo-info';
import { getPackageJSON, getProjectType, projectPath } from '@iceworks/project-service';
import { getLanguage } from '@iceworks/common-service';

// Example；
// {
//   name: 'xxx',
//   description: 'xxx',
//   list: [
//     {
//       // One line items shown
//       items: [
//         {
//           label: 'Version',
//           value: '1.0',
//         },
//         {
//           label: 'Project Type',
//           value: 'React',
//         }
//       ],
//     },
//     {
//       // One line items shown
//       items: [
//         {
//           label: '分支',
//           value: 'daily/0.1.0',
//         },
//         {
//           label: '仓库地址',
//           value: 'http://gitlab.alibaba-inc.com/ice/iceworks-pack',
//           link: 'http://gitlab.alibaba-inc.com/ice/iceworks-pack',
//         },
//       ],
//     },
//   ]
// };

interface IItem {
  label: string;
  value: string;
  link?: string;
}

export default async () => {
  const projectInfo: any = { list: [] };

  try {
    const useEn = getLanguage() !== 'zh-cn';
    projectInfo.name = path.basename(projectPath);

    const packageFile = path.join(projectPath, 'package.json');
    const abcConfigFile = path.join(projectPath, 'abc.json');
    const buildConfigFile = path.join(projectPath, 'build.json');

    if (fs.existsSync(packageFile)) {
      const packageJSON: any = await getPackageJSON(packageFile);
      const abcConfig: any = (fs.existsSync(abcConfigFile) && fs.readJSONSync(abcConfigFile)) || {};
      const buildConfig: any = (fs.existsSync(buildConfigFile) && fs.readJSONSync(buildConfigFile)) || {};

      projectInfo.description = packageJSON.description || '';

      // Base Infos
      const baseItems: IItem[] = [];
      if (packageJSON.version) {
        baseItems.push({
          label: useEn ? 'Version' : '版本',
          value: '1.0',
        });
      }

      const projectType = await getProjectType();
      baseItems.push({
        label: useEn ? 'Project Type' : '类型',
        value: await getProjectType(),
      });

      if (projectType === 'rax' && buildConfig.plugins) {
        const raxPlugin = buildConfig.plugins.find(
          (plugin) => Array.isArray(plugin) && plugin[0] === 'build-plugin-rax-app'
        );
        if (raxPlugin && raxPlugin[1].targets) {
          baseItems.push({
            label: 'Targets',
            value: raxPlugin[1].targets.join(','),
          });
        }
      }

      if (baseItems.length) {
        projectInfo.list.push({ items: baseItems });
      }

      // Git Info
      const gitItems: IItem[] = [];
      const gitInfo = getRepoInfo(projectPath);
      if (gitInfo.branch) {
        gitItems.push({
          label: useEn ? 'Git Branch' : '分支',
          value: gitInfo.branch,
        });
      }
      if (packageJSON.repository && packageJSON.repository.url) {
        const httpUrl = packageJSON.repository.url
          .replace(/^git@/, 'https://')
          .replace(/\.git/, '')
          .replace(/\.com:/, '.com/');
        gitItems.push({
          label: useEn ? 'Git Url' : '仓库地址',
          value: httpUrl,
          link: httpUrl,
        });
      }

      if (gitItems.length) {
        projectInfo.list.push({ items: gitItems });
      }

      // DEF Info
      const defItems: IItem[] = [];
      if (abcConfig && abcConfig.type) {
        defItems.push({
          label: useEn ? 'DEF Build Type' : 'DEF 构建类型',
          value: abcConfig.type,
        });

        if (abcConfig.type === 'pegasus') {
          defItems.push({
            label: useEn ? 'Pegasus Module' : '天马模块',
            value: 'https://banff.alibaba-inc.com/mdc',
            link: 'https://banff.alibaba-inc.com/mdc',
          });
        }
      }

      if (defItems.length) {
        projectInfo.list.push({ items: defItems });
      }
    }
  } catch (e) {
    // ignore
  }

  return projectInfo;
};
