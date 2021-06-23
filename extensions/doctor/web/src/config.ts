export interface IReportKeys {
  name: string;
  nameEn: string;
  key: string;
}

export const reportKeys: IReportKeys[] = [
  {
    name: 'Codemod',
    nameEn: 'Codemod',
    key: 'codemod',
  },
  {
    name: 'Ali ESLint',
    nameEn: 'Ali ESLint',
    key: 'ESLint',
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

export function getReportKey(key: string): IReportKeys {
  return reportKeys.find((reportKey) => reportKey.key === key) || reportKeys[0];
}

export default {};
