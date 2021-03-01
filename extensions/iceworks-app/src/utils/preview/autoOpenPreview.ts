/**
 * listen dev.json file change auto open prefive frame. like only run `npm run start`
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import * as chokidar from 'chokidar';
import { projectPath } from '@iceworks/project-service';
import openPreviewWebview from './openPreviewWebview';

// node_modules/.tmp/@builder/dev.json
const DEV_INFO_BASE_DIR = path.join(projectPath, 'node_modules');
const DEV_INFO_FILE_DIR = path.join(DEV_INFO_BASE_DIR, '.tmp/@builder');
const DEV_INFO_FILE = path.join(DEV_INFO_FILE_DIR, 'dev.json');

export default function autoOpenPreview(context: vscode.ExtensionContext, recorder) {
  // chokidar can’t watch file if file's parent dir not exists
  const watcher = chokidar.watch('file, dir', { disableGlobbing: true });

  if (!fs.existsSync(DEV_INFO_BASE_DIR)) {
    // wait for base dir created
    watcher.add(projectPath);
  } else {
    watcher.add(DEV_INFO_FILE);
  }

  // user may not install node modules and not setup temp dir
  watcher.on('addDir', (newPath) => {
    if (newPath === DEV_INFO_BASE_DIR) {
      watcher.unwatch(projectPath);
      if (!fs.existsSync(DEV_INFO_FILE_DIR)) {
        fs.mkdirsSync(DEV_INFO_FILE_DIR);
        watcher.add(DEV_INFO_FILE);
      }
    }
  });

  // watch dev.json file create and change
  watcher
    .on('add', () => {
      openPreviewWebview(context, recorder);
    })
    .on('change', () => {
      openPreviewWebview(context, recorder);
    });
}
