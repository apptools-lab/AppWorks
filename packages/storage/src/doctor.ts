import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fse from 'fs-extra';
import { Storage } from './storage';

const EXTENSION_TAG = 'Doctor';

export class DoctorStorage extends Storage {
  static domain = 'Doctor';

  static reportFilename = 'report.json';

  static path = path.join(Storage.path, EXTENSION_TAG);

  private reportFilePath = path.join(DoctorStorage.domain, DoctorStorage.reportFilename);

  constructor() {
    super();
    if (!fse.existsSync(DoctorStorage.path)) {
      mkdirp.sync(DoctorStorage.path);
    }
  }

  public async saveReport(value) {
    const filePath = this.reportFilePath;
    await fse.writeJson(filePath, value);
  }

  public async getReport() {
    const filePath = this.reportFilePath;
    const fileIsExists = await fse.pathExists(filePath);
    if (fileIsExists) {
      const report = await fse.readJson(filePath);
      return report;
    }
  }
}
