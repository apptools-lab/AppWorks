export interface IScoreLevelInfo {
  name: string;
  color: string;
  range: {
    start: number;
    end: number;
  };
}

export const scoreLevelInfos: IScoreLevelInfo[] = [
  {
    name: 'bad',
    color: '#ff3000',
    range: {
      start: 0,
      end: 59,
    },
  },
  {
    name: 'good',
    color: '#ff9300',
    range: {
      start: 60,
      end: 79,
    },
  },
  {
    name: 'excellent',
    color: '#46bc15',
    range: {
      start: 80,
      end: 100,
    },
  },
];

export interface IReportKeys {
  name: string;
  nameEn: string;
  key: string;
}

export const reportKeys: IReportKeys[] = [
  {
    name: '最佳实践',
    nameEn: 'Best Practices',
    key: 'bestPractices',
  },
  {
    name: '安全实践',
    nameEn: 'Security Practices',
    key: 'securityPractices',
  },
  {
    name: '阿里规约',
    nameEn: 'Ali ESLint',
    key: 'aliEslint',
  },
  {
    name: '代码可维护度',
    nameEn: 'Maintainability',
    key: 'maintainability',
  },
  {
    name: '代码重复度',
    nameEn: 'Repeatability',
    key: 'repeatability',
  },
];

export default {
  scoreLevelInfos,
};

export function getScoreLevelInfo(scroe: number): IScoreLevelInfo {
  return (
    scoreLevelInfos.find((config) => scroe >= config.range.start && scroe <= config.range.end) || scoreLevelInfos[0]
  );
}
export function getReportKey(key: string): IReportKeys {
  return reportKeys.find((reportKey) => reportKey.key === key) || reportKeys[0];
}
