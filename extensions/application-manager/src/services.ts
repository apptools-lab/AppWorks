import * as common from '@appworks/common-service';
import * as material from '@appworks/material-engine/lib/material';
import * as project from '@appworks/project-service';
import debug from './debugConfig/debugServices';
import { DoctorStorage } from '@appworks/storage';

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
