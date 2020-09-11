import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import { Doctor } from '@iceworks/doctor';
import { projectPath } from '@iceworks/project-service';
import * as common from '@iceworks/common-service';
import getProjectInfo from './getProjectInfo';

const scanReport = async (fix) => {
  let report;
  try {
    const doctor = new Doctor({});
    report = await doctor.scan(projectPath, { fix });
  } catch (e) {
    report = {
      error: e,
    };
  }

  return report;
};

export const services = {
  data: {
    projectInfo: getProjectInfo,
    scanReport,
  },
  common,
};
