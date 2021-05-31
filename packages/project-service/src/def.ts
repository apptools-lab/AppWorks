import axios from 'axios';
import { ALI_EMAIL } from '@appworks/constant';
import {
  generatorCreatetaskUrl,
  generatorTaskResultUrl,
  applyRepositoryUrl,
  basicUrl,
  GeneratorTaskStatus,
} from './constant';
import i18n from './i18n';
import { IDEFProjectField } from './types';

export async function generatorCreatetask(field: IDEFProjectField) {
  const { empId, account, group, project, gitlabToken, scaffold, clientToken, ejsOptions } = field;
  const projectType = field.source.type;
  const { description, source } = scaffold;
  const { npm } = source;
  let generatorId = 6;
  if (projectType === 'rax') {
    generatorId = 5;
  }
  const response = await axios.post(generatorCreatetaskUrl, {
    group,
    project,
    description,
    trunk: 'master',
    generator_id: generatorId,
    schema_data: {
      npmName: npm,
      ...ejsOptions,
    },
    gitlab_info: {
      id: empId,
      token: gitlabToken,
      name: account,
      email: `${account}@${ALI_EMAIL}`,
    },
    emp_id: empId,
    client_token: clientToken,
  });
  console.log('generatorCreatetaskResponse', response);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response;
}

export function getGeneratorTaskStatus(taskId: number, clientToken: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${generatorTaskResultUrl}/${taskId}`, {
          params: {
            need_generator: true,
            client_token: clientToken,
          },
        });
        console.log('generatorTaskResultResponse', response);
        const {
          data: { status },
          error,
        } = response.data;
        if (error) {
          reject(new Error(error));
        }
        if (status !== GeneratorTaskStatus.running && status !== GeneratorTaskStatus.Created) {
          clearInterval(interval);
          if (status === GeneratorTaskStatus.Failed) {
            reject(new Error(i18n.format('package.projectService.index.DEFOutTime', { taskId })));
          }
          if (status === GeneratorTaskStatus.Timeout) {
            reject(new Error(i18n.format('package.projectService.index.DEFOutTime', { taskId })));
          }
          if (status === GeneratorTaskStatus.Success) {
            resolve();
          }
        }
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

export async function applyRepository(field: IDEFProjectField) {
  const { empId, group, project, scaffold, clientToken, source } = field;
  const { description } = scaffold;
  const reason = '';
  const user = [];
  let pubtype = 1; // default publish type: assets
  if (source.type === 'rax') {
    pubtype = 6;
  }
  const response = await axios.post(applyRepositoryUrl, {
    emp_id: empId,
    group,
    project,
    description,
    reason,
    pubtype,
    user,
    client_token: clientToken,
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response;
}

export async function getBasicInfo(repo: string, clientToken: string) {
  const response = await axios.get(basicUrl, {
    params: {
      repo,
      client_token: clientToken,
    },
  });
  if (response.data.error || !response.data.data || !response.data.data.app) {
    return { isDef: false };
  }
  return { isDef: true, ...response.data.data.app };
}
