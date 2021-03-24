import * as path from 'path';
import * as fs from 'fs-extra';
import getWork from 'jscodeshift/src/Worker';

enum CodeModNames {
  JS = 'js-codemod',
  REACT = 'react-codemod',
  ICE_JS = 'icejs-codemod',
  RAX = 'rax-codemod',
}

interface TransForm {
  name: string;
  filePath: string;
}

interface CodeMod {
  name: CodeModNames;
  transforms: TransForm[];
}

export async function getCodeMods(): Promise<CodeMod[]> {
  const codeMods = await Promise.all(
    [CodeModNames.JS, CodeModNames.REACT, CodeModNames.ICE_JS, CodeModNames.RAX]
      .map(async (name) => {
        const transformFilePaths = await fs.readdir(path.join(__dirname, '..', 'node_modules', name, 'transforms'));
        return {
          name,
          transforms: transformFilePaths.map((transformFilePath) => {
            const fileName = path.basename(transformFilePath);
            return {
              name: fileName,
              filePath: transformFilePath,
            };
          }),
        };
      }),
  );
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

export async function getReports(codeMods: CodeMod[]): Promise<CodeModReport[]> {
  const projectFiles = [];
  const reports = await Promise.all(codeMods.map(async ({ name, transforms }) => {
    const results = await Promise.all(transforms.map((transform) => {
      return new Promise<TransformReport>(resolve => {
        const { name: tName, filePath: tFilePath } = transform;
        const work = getWork([tFilePath, 'babel']);
        const files: FileReport[] = [];
        const options = { dry: true };
        work.send({ files: projectFiles, options });
        work.on('message', ({ action, status, msg }) => {
          const [file] = msg.split(' ')[0];
          switch (action) {
            case 'status':
              files.push({
                path: file,
                status,
              });
              break;
            default:
          }
        });
        work.on('free', () => {
          resolve({ name: tName, files });
        });
      });
    }));
    return { name, transforms: results };
  }));
  return reports;
}

export async function runTransform() {
  // TODO
}
