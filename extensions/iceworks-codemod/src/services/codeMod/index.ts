import * as path from 'path';
import * as util from 'util';
import * as vscode from 'vscode';
import { getProjectLanguageType } from '@iceworks/project-utils';
import * as getWork from 'jscodeshift/src/Worker';
import * as globSync from 'glob';
import icejs from './icejs';
import react from './react';
import js from './js';
import logger from '../../logger';

const glob = util.promisify(globSync);

type CodeModNames = string;

interface TransForm {
  name: string;
  filename: string;
  filePath: string;
}

interface CodeMod {
  name: CodeModNames;
  transforms: TransForm[];
}

const nodeModulesPath = path.join(__dirname, '..', '..', '..', 'node_modules');

/**
 * TODO: Dynamic loading
 */
const codeMods = [icejs, react, js]
  .map((codeMod) => {
    const { packageName, transforms } = codeMod;
    return {
      ...codeMod,
      transforms: transforms.map((transform) => {
        const filePath = path.join(nodeModulesPath, packageName, 'transforms', `${transform.filename}.js`);
        return {
          ...transform,
          filePath,
        };
      }),
    };
  });

export async function getCodeMods(): Promise<CodeMod[]> {
  return codeMods;
}

function findCodeMod(value: string) {
  return codeMods.find(({ name }) => name === value);
}

async function getCodeModExtensions(name: string, projectPath: string) {
  const codeMod = findCodeMod(name);
  if (!codeMod) {
    return '';
  }

  // @ts-ignore
  const { extensionsMap } = codeMod;
  if (!extensionsMap) {
    return '';
  }

  const type = await getProjectLanguageType(projectPath);
  const extensions = extensionsMap.find(({ languageType }) => languageType === type);
  if (!extensions) {
    return '';
  }

  const { value } = extensions;
  return `/*.{${value.join(',')}}`;
}

async function getCodeModParser(name: string, projectPath: string) {
  const codeMod = findCodeMod(name);
  const parser = 'babel';
  if (!codeMod) {
    return parser;
  }

  // @ts-ignore
  const { parserMap } = codeMod;
  if (!parserMap) {
    return parser;
  }

  const type = await getProjectLanguageType(projectPath);
  const matchParser = parserMap.find(({ languageType }) => languageType === type);
  if (!matchParser) {
    return parser;
  }

  const { value } = matchParser;
  return value;
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

export async function getTransformsReport(transforms: TransForm[], codeModName: CodeModNames): Promise<TransformReport[]> {
  const projectPath = vscode.workspace.rootPath;
  if (projectPath) {
    const extensions = await getCodeModExtensions(codeModName, projectPath);
    const pattern = `**${extensions}`;
    const needUpdateFiles = await glob(pattern, {
      cwd: projectPath,
      // TODO customizable
      ignore: [
        '**/node_modules/**',
        '**/build/**',
        '**/.ice/**',
        '**/.rax/**',
      ],
      nodir: true,
      dot: true,
      realpath: true,
    });
    const results = await Promise.all(transforms.map(async (transform) => {
      const { filePath } = transform;
      const files = await runTransform(filePath, codeModName, needUpdateFiles, { dry: true });
      return { ...transform, files };
    }));
    return results;
  }
  return [];
}

export async function runTransformUpdate(transformFsPath: string, codeModName: CodeModNames, needUpdateFiles: string[]): Promise<FileReport[]> {
  const updatedFiles = await runTransform(transformFsPath, codeModName, needUpdateFiles);
  return updatedFiles;
}

/**
 * TODO: Multi process, file batch
 */
async function runTransform(transformFsPath: string, codeModName: CodeModNames, needUpdateFiles: string[], options?: any): Promise<FileReport[]> {
  const projectPath = vscode.workspace.rootPath;
  if (!projectPath) {
    return [];
  }

  const parser = await getCodeModParser(codeModName, projectPath);
  return new Promise<FileReport[]>(resolve => {
    const work = getWork([transformFsPath, 'babel']);
    const files: FileReport[] = [];
    const setOptions = { parser, ...options };

    work.send({ files: needUpdateFiles, options: setOptions });
    work.on('message', (message) => {
      const { action, status, msg } = message;
      const splitStr = ' ';
      const [filepath, ...msgs] = msg ? msg.split(splitStr) : ['', []];
      switch (action) {
        case 'status':
          files.push({
            path: filepath,
            message: msgs.join(splitStr),
            status,
          });
          break;
        case 'free':
          logger.info('result files:', files);
          resolve(files);
          break;
        default:
          logger.info('default');
      }
    });
  });
}
