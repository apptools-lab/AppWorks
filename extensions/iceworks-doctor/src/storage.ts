import * as os from 'os';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fse from 'fs-extra';

const homedir = os.homedir();
const iceworksStroagePath = path.join(homedir, '.iceworks');
const EXTENSION_TAG = 'Doctor';

const storagePath = path.join(iceworksStroagePath, EXTENSION_TAG);
if (!fse.existsSync(storagePath)) {
  mkdirp.sync(storagePath);
}

function getReportFile() {
  return path.join(storagePath, 'report.json');
}

export async function saveReport(value) {
  const file = getReportFile();
  await fse.writeJson(file, value);
}

export async function getReport() {
  const file = getReportFile();
  const fileIsExists = await fse.pathExists(file);
  return fileIsExists ? await fse.readJson(file) : {};
}
