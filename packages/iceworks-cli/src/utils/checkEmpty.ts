import * as fs from 'fs';
import * as inquirer from 'inquirer';
import log from './log';

export default function checkEmpty(dir): Promise<boolean> {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, files) => {
      // filter some special files
      files = files.filter((filename) => {
        return ['node_modules', '.git', '.DS_Store', '.iceworks-tmp'].indexOf(filename) === -1;
      });
      log.verbose('checkEmpty', files.join(', '));
      if (files && files.length) {
        return inquirer
          .prompt({
            type: 'confirm',
            name: 'go',
            message:
              'The existing file in the current directory. Are you sure to continue ？',
            default: false,
          })
          .then((answer) => {
            return resolve(answer.go);
          })
          .catch(() => {
            return resolve(false);
          });
      }
      return resolve(true);
    });
  });
};
