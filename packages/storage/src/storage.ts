import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fse from 'fs-extra';
import * as userHome from 'user-home';

export class Storage {
  static path: string = path.join(userHome, '.iceworks');

  constructor() {
    if (!fse.existsSync(Storage.path)) {
      mkdirp.sync(Storage.path);
    }
  }

  getPath(): string {
    return Storage.path;
  }
}
