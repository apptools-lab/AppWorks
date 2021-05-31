import * as ejs from 'ejs';
import { CONFIG_NAME, BASE_URL, CONFIG_START_LABEL, CONFIG_STOP_LABEL, IDebugConfig } from './index';

const launchConfigTemplate = `
[
  {
    "type": "chrome",
    "request": "launch",
    "name": "<%= configName %>",
    "url": "<%= startUrl %>",
    "urlFilter": "<%= baseUrl %>/**/*",
    "webRoot": "\${workspaceFolder}",
    "userDataDir": "\${workspaceFolder}/.vscode/chrome-debug-user-data",
    "preLaunchTask": "<%= startLabel %>",
    "postDebugTask": "<%= stopLabel %>"
  }
]
`;

const tasksConfigTemplate = `
[
  {
    "label": "<%= startLabel %>",
    "command": "npm",
    "args": [
      "run", 
      "start"<%_ if (disableOpen) { -%>, 
      "--", 
      "--disable-open"
      <%_ } -%>
    ],
    "isBackground": true,
    <%_ if (isPegasusProject) { -%>
    "options": {
      "env": {
        "PEGASUS_DEVKIT": "AppWorks"
      }
    },
    <%_ } -%>
    "problemMatcher": {
      "pattern": {
        "regexp": "ERROR in .*"
      },
      "background": {
        "beginsPattern": ".*(@alib/build-scripts|ice\\\\.js|rax\\\\.js).*",
        "endsPattern": ".*<%= baseUrl %>.*"
      }
    }
  },
  {
    "label": "<%= stopLabel %>",
    "type": "process",
    "command":[
      "\${command:workbench.action.tasks.terminate}",
      "\${command:workbench.action.acceptSelectedQuickOpenItem}"
    ]
  }
]
`;

// https://code.visualstudio.com/docs/editor/debugging#_launch-configurations
export function getLaunchConfig(launchUrl?: string): IDebugConfig {
  const DEBUG_LAUNCH_VERSION = '0.2.0';
  return {
    version: DEBUG_LAUNCH_VERSION,
    configurations: JSON.parse(
      ejs.render(launchConfigTemplate, {
        configName: CONFIG_NAME,
        startUrl: launchUrl || BASE_URL,
        baseUrl: BASE_URL,
        startLabel: CONFIG_START_LABEL,
        stopLabel: CONFIG_STOP_LABEL,
      }),
    ),
  };
}

// https://code.visualstudio.com/docs/editor/tasks#vscode
export function getTasksConfig(isPegasusProject = false, disableOpen = false): IDebugConfig {
  const DEBUG_TASKS_VERSION = '2.0.0';
  return {
    version: DEBUG_TASKS_VERSION,
    tasks: JSON.parse(
      ejs.render(tasksConfigTemplate, {
        baseUrl: BASE_URL,
        disableOpen,
        isPegasusProject,
        startLabel: CONFIG_START_LABEL,
        stopLabel: CONFIG_STOP_LABEL,
      }),
    ),
  };
}
