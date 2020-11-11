import { workspace, WorkspaceFolder } from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as moment from 'moment';
import { UNTITLED, NO_PROJ_NAME, JSON_SPACES } from '../constants';
import { getAppDataDirPath, getAppDataDayDirPath, getStorageDirs } from '../utils/storage';
import { getResource } from '../utils/git';
import { getReportHr, getReportRow, getRangeReport } from '../utils/report';
import forIn = require('lodash.forin');

export interface ProjectResource {
  repository: string;
  branch: string;
  tag?: string;
}

export function getProjectFolder(fsPath: string): WorkspaceFolder {
  let liveShareFolder = null;
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    for (let i = 0; i < workspace.workspaceFolders.length; i++) {
      const workspaceFolder = workspace.workspaceFolders[i];
      const folderUri = workspaceFolder.uri;
      if (folderUri) {
        const isVslsScheme = folderUri.scheme === 'vsls';
        if (isVslsScheme) {
          liveShareFolder = workspaceFolder;
        } else if (fsPath.includes(folderUri.fsPath)) {
          return workspaceFolder;
        }
      }
    }
  }

  // wasn't found but if liveShareFolder was found, return that
  if (liveShareFolder) {
    return liveShareFolder;
  }
  return null;
}

export class Project {
  // public id: string = '';
  public name = '';

  public directory = '';

  public resource: ProjectResource = { repository: '', branch: '' };

  constructor(values?: any) {
    // const { resource, directory } = values;
    // this.id = resource!.repository || directory;
    if (values) {
      Object.assign(this, values);
    }
  }

  static async createInstance(fsPath: string) {
    const workspaceFolder: WorkspaceFolder = getProjectFolder(fsPath);
    const directory = workspaceFolder ? workspaceFolder.uri.fsPath : UNTITLED;
    const workspaceFolderName = workspaceFolder ? workspaceFolder.name : NO_PROJ_NAME;
    const resource = await getResource(directory);
    const project = new Project({ name: workspaceFolderName, directory, resource });
    return project;
  }
}

interface ProjectInfo {
  // id?: string;
  name: string;
  directory: string;
  resource?: ProjectResource;
}

interface ProjectData {
  sessionSeconds: number;
  editorSeconds?: number;
  keystrokes: number;
  linesAdded: number;
  linesRemoved: number;
}

export interface ProjectSummary extends ProjectInfo, ProjectData {
}

export interface ProjectsSummary {
  [path: string]: ProjectSummary;
}

export function getProjectsFile(day?: string) {
  return path.join(getAppDataDayDirPath(day), 'projects.json');
}

export async function getProjectsSummary(day?: string): Promise<ProjectsSummary> {
  const file = getProjectsFile(day);
  let projectsSummary = {};
  try {
    projectsSummary = await fse.readJson(file);
  } catch (e) {
    // ignore errors
  }
  return projectsSummary;
}

export async function saveProjectsSummary(values: ProjectsSummary) {
  const file = getProjectsFile();
  await fse.writeJson(file, values, { spaces: JSON_SPACES });
}

export async function clearProjectsSummary() {
  await saveProjectsSummary({});
}

export async function updateProjectSummary(project: Project, increment: ProjectData) {
  const projectsSummary = await getProjectsSummary();
  const { directory } = project;
  const { sessionSeconds, editorSeconds, keystrokes, linesAdded, linesRemoved } = increment;
  let projectSummary = projectsSummary[directory];
  if (!projectSummary) {
    projectSummary = {
      ...project,
      ...increment,
      editorSeconds: editorSeconds || sessionSeconds,
    };
  } else {
    Object.assign(
      projectSummary,
      project,
    );
    projectSummary.linesAdded += linesAdded;
    projectSummary.linesRemoved += linesRemoved;
    projectSummary.keystrokes += keystrokes;
    projectSummary.sessionSeconds += sessionSeconds;
    projectSummary.editorSeconds = Math.max(
      projectSummary.editorSeconds,
      projectSummary.sessionSeconds,
    );
  }
  projectsSummary[directory] = projectSummary;
  await saveProjectsSummary(projectsSummary);
}

export function getProjectReportFile() {
  return path.join(getAppDataDirPath(), 'ProjectSummaryReport.txt');
}

export async function generateProjectReport() {
  const formattedDate = moment().format('ddd, MMM Do h:mma');
  let reportContent = `Project Summary (Last updated on ${formattedDate})\n`;
  reportContent += '\n';
  const reportFile = getProjectReportFile();
  const projectsSummary: ProjectsSummary = {};
  const storageDirs = await getStorageDirs();
  await Promise.all(storageDirs.map(async (storageDir) => {
    const dayProjectsSummary = await getProjectsSummary(storageDir);
    forIn(dayProjectsSummary, (dayProjectSummary: ProjectSummary) => {
      const { sessionSeconds = 0, keystrokes = 0, linesAdded = 0, linesRemoved = 0, name: projectName } = dayProjectSummary;
      if (!projectsSummary[projectName]) {
        projectsSummary[projectName] = {
          ...dayProjectSummary,
          sessionSeconds,
          keystrokes,
          linesAdded,
          linesRemoved,
        };
      } else {
        if (sessionSeconds) {
          projectsSummary[projectName].sessionSeconds += sessionSeconds;
        }
        if (keystrokes) {
          projectsSummary[projectName].keystrokes += keystrokes;
        }
        if (linesAdded) {
          projectsSummary[projectName].linesAdded += linesAdded;
        }
        if (linesRemoved) {
          projectsSummary[projectName].linesRemoved += linesRemoved;
        }
      }
    });
  }));
  forIn(projectsSummary, (projectSummary) => {
    const { name: projectName } = projectSummary;
    reportContent += getReportRow(projectName, 'Total');
    reportContent += getRangeReport(projectSummary);
    reportContent += getReportHr();
    reportContent += '\n';
  });
  await fse.writeFile(reportFile, reportContent, 'utf8');
  return reportFile;
}
