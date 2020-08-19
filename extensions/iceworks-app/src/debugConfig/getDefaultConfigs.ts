import * as ejs from 'ejs';
import { CONFIG_NAME, START_URL, CONFIG_START_LABEL, CONFIG_STOP_LABEL, IDebugConfig } from './index';

const launchConfigTemplate = `
[
  {
    "type": "chrome",
    "request": "launch",
    "name": "<%= configName %>",
    "url": "<%= startUrl %>",
    "urlFilter": "<%= startUrl %>/**/*",
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
    "args": ["run", "start", "--", "--disable-open"],
    "isBackground": true,
    "problemMatcher": {
      "pattern": {
        "regexp": "ERROR in .*"
      },
      "background": {
        "beginsPattern": ".*(@alib/build-scripts|ice\\\\.js|rax\\\\.js).*",
        "endsPattern": ".*<%= startUrl %>.*"
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
export function getLaunchConfig(): IDebugConfig {
  const DEBUG_LAUNCH_VERSION = '0.2.0';
  return {
    version: DEBUG_LAUNCH_VERSION,
    configurations: JSON.parse(
      ejs.render(launchConfigTemplate, {
        configName: CONFIG_NAME,
        startUrl: START_URL,
        startLabel: CONFIG_START_LABEL,
        stopLabel: CONFIG_STOP_LABEL,
      })
    ),
  };
}

// https://code.visualstudio.com/docs/editor/tasks#vscode
export function getTasksConfig(): IDebugConfig {
  const DEBUG_TASKS_VERSION = '2.0.0';
  return {
    version: DEBUG_TASKS_VERSION,
    tasks: JSON.parse(
      ejs.render(tasksConfigTemplate, {
        startUrl: START_URL,
        startLabel: CONFIG_START_LABEL,
        stopLabel: CONFIG_STOP_LABEL,
      })
    ),
  };
}
