import { Doctor } from '@iceworks/doctor';

const doctor = new Doctor({ ignore: ['.vscode', '.ice', 'mocks', '.eslintrc.js', 'webpack.config.js'] });

export default async (targetPath, options?) => {
  let report;
  try {
    report = await doctor.scan(targetPath, options);
  } catch (e) {
    report = {
      error: e,
    };
  }

  return report;
};
