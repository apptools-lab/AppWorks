import * as path from 'path';
import * as fse from 'fs-extra';
import { Storage } from './storage';

export class DoctorStorage extends Storage {
  static domain = 'Doctor';

  static reportFilename = 'report.json';

  protected path: string = path.join(Storage.path, DoctorStorage.domain);

  private reportFilePath = path.join(this.path, DoctorStorage.reportFilename);

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
