import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import { Doctor } from '@iceworks/doctor';
import { projectPath } from '@iceworks/project-service';
import * as common from '@iceworks/common-service';
import getProjectInfo from './getProjectInfo';

const scanReport = async (options) => {
  let report;
  try {
    const doctor = new Doctor({});
    report = await doctor.scan(projectPath, options);
  } catch (e) {
    report = {
      error: e,
    };
  }

  return report;
};

const openFile = (options) => {
  console.log(options);
};

export const services = {
  action: {
    open: openFile,
  },
  data: {
    projectInfo: getProjectInfo,
    scanReport,
  },
  common,
};
