import { Doctor } from '@iceworks/doctor';
import { projectPath, getProjectType, getProjectLanguageType } from '@iceworks/project-service';
import getRecorder from './getRecorder';
import setDiagnostics from './setDiagnostics';

const doctor = new Doctor({ ignore: ['.vscode', '.ice', 'mocks', '.eslintrc.js', 'webpack.config.js'] });

export default async (options) => {
  let report;
  let targetPath = projectPath;
  try {
    if (options && options.targetPath) {
      targetPath = options.targetPath;
    }

    const projectType = await getProjectType();
    const projectLanguageType = await getProjectLanguageType();

    const scanOption = Object.assign({}, options || {}, {
      // @iceworks/spec suppot rax rax-ts react react-ts
      framework: projectType === 'rax' ? 'rax' : 'react',
      languageType: projectLanguageType,
    });

    report = await doctor.scan(targetPath, scanOption);

    // Set VS Code problems
    setDiagnostics(report.securityPractices, true);
    // Record data
    getRecorder().record({
      module: 'main',
      action: 'doctor',
      data: {
        projectPath,
        score: report.score,
        ESLint: report.ESLint.score,
        maintainability: report.maintainability.score,
        repeatability: report.repeatability.score,
      },
    });
  } catch (e) {
    console.log(e);
    report = {
      error: e,
    };
  }

  return report;
};
