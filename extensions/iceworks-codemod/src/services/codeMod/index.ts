import * as path from 'path';
import * as fs from 'fs-extra';
import * as util from 'util';
import * as vscode from 'vscode';
import * as getWork from 'jscodeshift/src/Worker';
import * as globSync from 'glob';

const glob = util.promisify(globSync);

enum CodeModNames {
  JS = 'js-codemod',
  REACT = 'react-codemod',
  ICE_JS = 'icejs-codemod',
  // RAX = 'rax-codemod',
}

interface TransForm {
  name: string;
  filename: string;
  filePath: string;
}

interface CodeMod {
  name: CodeModNames;
  transforms: TransForm[];
}

export async function getCodeMods(): Promise<CodeMod[]> {
  const codeMods = await Promise.all([CodeModNames.JS, CodeModNames.REACT, CodeModNames.ICE_JS]
    .map(async (name) => {
      const dirPath = path.join(__dirname, '..', '..', '..', 'node_modules', name, 'transforms');
      const transformFiles = await fs.readdir(dirPath);
      return {
        name,
        transforms: transformFiles.filter((transformFile) => {
          const stat = fs.statSync(path.join(dirPath, transformFile));
          const isJS = stat.isFile() && path.extname(transformFile) === '.js';
          return isJS;
        }).map((transformFile) => {
          const fileName = path.basename(transformFile);
          return {
            name: fileName,
            filename: transformFile,
            filePath: path.join(dirPath, transformFile),
          };
        }),
      };
    }));
  return codeMods;
}

enum FileStatus {
  ERROR = 'error',
  NO_CHANGE = 'nochange',
  SKIP = 'skip',
  OK = 'ok',
}

interface FileReport {
  path: string;
  status: FileStatus;
  message: string;
  updated?: boolean;
}

interface TransformReport {
  name: string;
  files: FileReport[]
}

type TransformsReport = TransformReport[];

interface CodeModReport {
  name: CodeModNames;
  transforms: TransformsReport;
}

export async function getTransformsReport(transforms: TransForm[]) {
  const projectPath = vscode.workspace.rootPath;
  if (projectPath) {
    const filesNeedBeTransform = await glob('**', {
      cwd: projectPath,
      ignore: [
        'node_modules/**',
        '.ice/**',
        '.rax/**',
      ],
      nodir: true,
      dot: true,
      realpath: true,
    });
    console.log('[getTransformsReport] filesNeedBeTransform:', filesNeedBeTransform);
    const results = await Promise.all(transforms.map((transform) => {
      return new Promise<TransformReport>(resolve => {
        const { name: tName, filePath } = transform;
        const work = getWork([filePath, 'babel']);
        const files: FileReport[] = [];
        const options = { dry: true };
        work.send({ files: filesNeedBeTransform, options });
        work.on('message', (message) => {
          const { action, status, msg } = message;
          const ms = msg ? msg.split(' ') : [];
          console.log('[getTransformsReport] onMessage:', message);
          switch (action) {
            case 'status':
              files.push({
                path: ms[0],
                message: ms[1],
                status,
              });
              break;
            case 'free':
              resolve({ name: tName, files });
              break;
            default:
              console.log('default');
          }
        });
      });
    }));
    return results;
  }
  return [];
}
