import * as common from '@iceworks/common-service';
import * as material from '@iceworks/material-engine/lib/material';
import * as project from '@iceworks/project-service';
import debug from './debugConfig/debugServices';
import { DoctorStorage } from '@iceworks/storage';

const doctorStorage = new DoctorStorage();

export default {
  common,
  material,
  project,
  doctor: {
    async getReport() {
      const report = await doctorStorage.getReport();
      return report;
    },
  },
  debug,
};
