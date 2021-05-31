import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fse from 'fs-extra';
import * as userHome from 'user-home';

export const storagePath = path.join(userHome, '.appworks');

export class Storage {
  static path: string = storagePath;

  protected path: string = Storage.path;

  constructor() {
    if (!fse.existsSync(this.path)) {
      mkdirp.sync(this.path);
    }
  }

  getPath(): string {
    return this.path;
  }
}
