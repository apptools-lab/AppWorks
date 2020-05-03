import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as request from 'request';
import * as progress from 'request-progress';
import * as zlib from 'zlib';
import * as tar from 'tar';

interface IOptions {
  tarballURL: string;
  destDir: string;
  progressFunc?: (state) => void;
  formatFilename?: (filename) => string;
}

/**
 * Download tarbar content to the specified directory
 *
 * @param {string} tarballURL tarball url
 * @param {string} destDir target directory
 */
export default function extractTarball({
  tarballURL,
  destDir,
  progressFunc = (state) => {},
  formatFilename,
}: IOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const allFiles = [];
    const allWriteStream = [];
    const directoryCollector = [];

    progress(
      request({
        url: tarballURL,
        timeout: 10000,
      })
    )
      .on('progress', (state) => {
        progressFunc(state);
      })
      .on('error', (error) => {
        error = error || {};
        error.name = 'download-tarball-error';
        error.data = {
          url: tarballURL,
        };
        reject(error);
      })
      // @ts-ignore
      .pipe(zlib.Unzip())
      .on('error', (error) => {
        reject(error);
      })
      .pipe(tar.Parse())
      .on('entry', (entry) => {
        const realPath = entry.path.replace(/^package\//, '');

        let filename = path.basename(realPath);
        filename = formatFilename ? formatFilename(filename) : filename;

        const destPath = path.join(destDir, path.dirname(realPath), filename);

        const needCreateDir = path.dirname(destPath);
        if (!directoryCollector.includes(needCreateDir)) {
          directoryCollector.push(needCreateDir);
          mkdirp.sync(path.dirname(destPath));
        }

        allFiles.push(destPath);
        const writeStream = new Promise((streamResolve) => {
          entry
            .pipe(fs.createWriteStream(destPath))
            .on('finish', () => streamResolve());
        });
        allWriteStream.push(writeStream);
      })
      .on('end', () => {
        progressFunc({
          percent: 1,
        });
        Promise.all(allWriteStream)
          .then(() => resolve(allFiles))
          .catch((error) => {
            reject(error);
          });
      });
  });
};
