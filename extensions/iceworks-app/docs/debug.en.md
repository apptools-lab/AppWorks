# Iceworks Debug

[简体中文]((./debug.md)) | English

Use VS Code and Chrome to debug the source code.

![debug-demo](https://img.alicdn.com/tfs/TB1vCixhP39YK4jSZPcXXXrUFXa-1200-695.gif)

Click the debug button in the upper right corner of the file to start debugging. Will insert .vscode/launch.json and .vscode/tasks.json in your project directory, and start VS Code Debug.

PS: You can add the .vscode directory to the .gitignore config.

## launch.json

It is automatically injected by Iceworks and is a standard VS Code debugging configuration. For more configuration, please refer to [VS Code debug document](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations).

 The default config is as follows:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome", // Use 'Debugger for Chrome' preview.
      "request": "launch", // Debugging will start a new Chrome instance, replace 'attach' can select the current Chrome instance, but Chrome needs to be restarted
      "name": "Iceworks Debug", 
      "url": "http://localhost:3333", // Project debugging service address
      "urlFilter": "http://localhost:3333/**/*", // Monitor all URLs of the project debugging service
      "webRoot": "${workspaceFolder}",
      "userDataDir": "${workspaceFolder}/.vscode/chrome-debug-user-data", // Used to save Chrome user data (such as installed browser extensions)
      "preLaunchTask": "Iceworks Start Background Tasks",
      "postDebugTask": "Iceworks Stop Background Tasks"
    }
  ]
}
```

## tasks.json

It is automatically injected by Iceworks and is a standard VS Code debugging configuration. For more configuration, please refer to [VS Code tasks document]( https://code.visualstudio.com/docs/editor/tasks#vscode).

 The default config is as follows:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Iceworks Start Background Tasks",
      "type": "npm",
      "script": "start",
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "ERROR in .*"  // build-scirpt log
        },
        "background": {
          "beginsPattern": ".*(@alib/build-scripts|ice\\.js|rax\\.js).*", // build-scirpt log
          "endsPattern": ".*http://localhost:3333.*"  // build-scirpt log
        }
      }
    },
    {
      "label": "Iceworks Stop Background Tasks",
      "type": "process",
      "command": [
        "${command:workbench.action.tasks.terminate}",  // VS Code built-in command
        "${command:workbench.action.acceptSelectedQuickOpenItem}" // VS Code built-in command
      ]
    }
  ]
}

```

## Change dev url
If the project dev url is not `http://localhost:3333`, you can modify the url address configured by `url` and `urlFilter` in launch.json, and `endsPattern` in tasks.json with the new dev url.

## Chrome 

A new instance of Chrome is opened for debugging. The first time you start Chrome without data (no user mode, no extensions), the data operated during the debugging process will be saved (history, installed extensions ...).

Rax project，Recommended to install [Guan Extension](https://chrome.google.com/webstore/detail/guan-extension/jfalnandddhgfnmejfgjgfbfnnkhljog)。

If you want to use your own Chrome, you can switch the request configuration in launch.json to `attach`. You must close the current Chrome.
