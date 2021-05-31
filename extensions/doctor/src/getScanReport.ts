import { Doctor } from '@appworks/doctor';
import { projectPath, getProjectType, getProjectLanguageType } from '@appworks/project-service';
import recorder from './recorder';
import setDiagnostics from './setDiagnostics';
import storage from './storage';

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
      framework: projectType === 'unknown' ? 'react' : projectType,
      languageType: projectLanguageType,
    });

    report = await doctor.scan(targetPath, scanOption);

    // store the latest result locally
    storage.saveReport(report);

    // Set VS Code problems
    setDiagnostics(report.securityPractices, true);
    // Record data
    recorder.record({
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
