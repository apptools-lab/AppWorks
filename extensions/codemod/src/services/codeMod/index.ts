import * as path from 'path';
import * as util from 'util';
import * as child_process from 'child_process';
import * as os from 'os';
import * as vscode from 'vscode';
import * as flatten from 'lodash.flatten';
import { getProjectLanguageType, getProjectFramework, getProjectType } from '@appworks/project-utils';
import * as globSync from 'glob';
import icejs from './icejs';
import react from './react';
import nextJs from './js';
import logger from '../../logger';
import WebViewTransport from '../../logger/webview';

const availableCpus = Math.max(os.cpus().length - 1, 1);
const CHUNK_SIZE = 50;
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

const nodeModulesPath = path.join(__dirname, '..', 'jscodeshift', 'node_modules');
const transformFileExtension = '.js';

/**
 * TODO: Dynamic loading
 */
const codeMods = [icejs, react, nextJs]
  .map((codeMod) => {
    const { packageName, transforms } = codeMod;
    return {
      ...codeMod,
      transforms: transforms.map((transform) => {
        const filePath = path.join(nodeModulesPath, packageName, 'transforms', `${transform.filename}${transformFileExtension}`);
        return {
          ...transform,
          filePath,
        };
      }),
    };
  });

export async function getCodeMods(): Promise<CodeMod[]> {
  const projectPath = vscode.workspace.rootPath;
  if (projectPath) {
    const type = await getProjectType(projectPath);
    const framework = await getProjectFramework(projectPath);
    // @ts-ignore
    return codeMods.filter(({ applyTypes, applyFrameworks }) => {
      if (applyTypes) {
        return applyTypes.indexOf(type) > -1;
      }
      if (applyFrameworks) {
        return applyFrameworks.indexOf(framework) > -1;
      }
      return true;
    });
  }

  return [];
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

async function getCodeModOptions(name: string) {
  const codeMod = findCodeMod(name);
  // @ts-ignore
  return codeMod?.options;
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

export async function getTransformsReport(transforms: TransForm[], codeModName: CodeModNames, ...args): Promise<TransformReport[]> {
  const projectPath = vscode.workspace.rootPath;
  const transformsLength = transforms.length;

  logger.info(`[getTransformsReport] start: projectPath(${projectPath}), transformsLength(${transformsLength})`);

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
        '**/.faas_debug_tmp/**',
      ],
      nodir: true,
      dot: true,
      realpath: true,
    });

    const results: TransformReport[] = [];
    for (let index = 0; index < transformsLength; index++) {
      const transform = transforms[index];
      const { filePath } = transform;
      const files = await runTransform(filePath, codeModName, needUpdateFiles, { dry: true }, args[1]);
      results.push({ ...transform, files });
    }
    return results;
  }
  return [];
}

export async function runTransformUpdate(transformFsPath: string, codeModName: CodeModNames, needUpdateFiles: string[], ...args): Promise<FileReport[]> {
  const updatedFiles = await runTransform(transformFsPath, codeModName, needUpdateFiles, { runInBand: true }, args[1]);
  return updatedFiles;
}

async function runTransform(transformFsPath: string, codeModName: CodeModNames, needUpdateFiles: string[], options: any, webviewPanel: vscode.WebviewPanel): Promise<FileReport[]> {
  const projectPath = vscode.workspace.rootPath;
  const numFiles = needUpdateFiles.length;
  const { webview } = webviewPanel;

  // post logs to webview
  const transportName = 'webview';
  logger.set(transportName, new WebViewTransport({
    level: 'DEBUG',
    webview,
  }));

  const transformName = path.basename(transformFsPath, transformFileExtension);
  logger.debug(`Start run [${transformName}].`);

  if (!projectPath || numFiles === 0) {
    logger.debug('No files selected, nothing to do.');
    return [];
  }

  const startTime = process.hrtime();
  const parser = await getCodeModParser(codeModName, projectPath);
  const preSetOptions = await getCodeModOptions(codeModName);
  const setOptions = { ...preSetOptions, parser, ...options };

  const cpus = setOptions.cpus ? Math.min(availableCpus, setOptions.cpus) : availableCpus;
  const processes = setOptions.runInBand ? 1 : Math.min(numFiles, cpus);

  logger.debug(`Processing ${needUpdateFiles.length} files...`);
  if (!options.runInBand) {
    logger.debug(`Spawning ${processes} workers...`);
  }

  const args = [transformFsPath, 'babel'];
  const workers: any[] = [];
  for (let i = 0; i < processes; i++) {
    workers.push(child_process.fork(path.join(nodeModulesPath, 'jscodeshift', 'src', 'Worker.js'), args));
  }

  const chunkSize = processes > 1 ?
    Math.min(Math.ceil(numFiles / processes), CHUNK_SIZE) :
    numFiles;
  let index = 0;
  function next() {
    if (!options.runInBand && index < numFiles) {
      logger.debug(`Sending ${Math.min(chunkSize, numFiles - index)} files to free worker...`);
    }
    const files = needUpdateFiles.slice(index, index += chunkSize);
    return files;
  }

  const results = await Promise.all(workers.map(work => {
    return new Promise<FileReport[]>(resolve => {
      const files: FileReport[] = [];
      work.send({ files: next(), options: setOptions });
      work.on('message', (message) => {
        const { action, status, msg } = message;
        const splitStr = ' ';
        const [filepath, ...msgs] = msg ? msg.split(splitStr) : ['', []];
        const text = `[${status}] ${msg}`;
        switch (action) {
          case 'status':
            files.push({
              path: filepath,
              message: msgs.join(splitStr),
              status,
            });
            logger.debug(text);
            break;
          case 'free':
            work.send({ files: next(), options: setOptions });
            break;
          default:
            logger.debug('Default message');
        }
      });
      work.on('disconnect', () => {
        resolve(files);
      });
    });
  }));

  const endTime = process.hrtime(startTime);
  const timeElapsed = (endTime[0] + endTime[1] / 1e9).toFixed(3);

  logger.debug(`All done for [${transformName}].`);
  logger.debug(`Time elapsed: ${timeElapsed} seconds.`);
  logger.disable(transportName);

  return flatten(results);
}
