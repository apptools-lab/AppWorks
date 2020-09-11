import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as common from '@iceworks/common-service';

const projectInfo = async () => {
  // TODO
  return {};
};

const scanReport = async () => {
  // TODO
  return {
    errorMsg: 'Hello',
  };
};

export const services = {
  data: {
    projectInfo,
    scanReport,
  },
  common,
};
