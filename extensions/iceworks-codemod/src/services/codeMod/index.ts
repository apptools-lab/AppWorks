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
}

interface TransformReport extends TransForm {
  files: FileReport[]
}

type TransformsReport = TransformReport[];

interface CodeModReport {
  name: CodeModNames;
  transforms: TransformsReport;
}

export async function getTransformsReport(transforms: TransForm[]): Promise<TransformReport[]> {
  const projectPath = vscode.workspace.rootPath;
  if (projectPath) {
    const needUpdateFiles = await glob('**', {
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
    const results = await Promise.all(transforms.map(async (transform) => {
      const { filePath } = transform;
      const files = await runTransform(filePath, needUpdateFiles, { dry: true });
      return { ...transform, files };
    }));
    return results;
  }
  return [];
}

export async function runTransformUpdate(transformFsPath: string, needUpdateFiles: string[]): Promise<FileReport[]> {
  const updatedFiles = await runTransform(transformFsPath, needUpdateFiles);
  return updatedFiles;
}

async function runTransform(transformFsPath: string, needUpdateFiles: string[], options?: any): Promise<FileReport[]> {
  return new Promise<FileReport[]>(resolve => {
    const work = getWork([transformFsPath, 'babel']);
    const files: FileReport[] = [];
    work.send({ files: needUpdateFiles, options });
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
          resolve(files);
          break;
        default:
          console.log('default');
      }
    });
  });
}
