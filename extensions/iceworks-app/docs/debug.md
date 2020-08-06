# Iceworks Debug

简体中文 | [English](./debug.en.md)

使用 VS Code 和 Chrome 对源码进行调试。

![debug-demo](https://img.alicdn.com/tfs/TB1vCixhP39YK4jSZPcXXXrUFXa-1200-695.gif)

点击文件右上角的 debug 按钮启动调试。 会在您的工程目录中插入 .vscode/launch.json 和 .vscode/tasks.json ，并启动 VS Code Debug。

PS: 可将 .vscode 目录添加至 .gitignore 配置中。

## launch.json

由 Iceworks 自动注入，为标准的 VS Code 调试配置。更多配置可参考 [VS Code debug 文档](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)。默认配置如下：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome", // 通过 'Debugger for Chrome' 扩展启动 Chrome 预览。
      "request": "launch", // 调试会启动新的 Chrome 实例，替换 attach 可选取当前 Chrome 实例，但需要重启 Chrome。
      "name": "Iceworks Debug", 
      "url": "http://localhost:3333", // 当前工程调试服务地址
      "urlFilter": "http://localhost:3333/**/*", // 监听当前工程调试服务所有的 url
      "webRoot": "${workspaceFolder}",
      "userDataDir": "${workspaceFolder}/.vscode/chrome-debug-user-data", // 用于存放 Chrome 的用户数据（安装的浏览器插件等）
      "preLaunchTask": "Iceworks Start Background Tasks",
      "postDebugTask": "Iceworks Stop Background Tasks"
    }
  ]
}
```

## tasks.json

由 Iceworks 自动注入，为标准的 VS Code 调试配置。更多配置可参考 [VS Code tasks 文档]( https://code.visualstudio.com/docs/editor/tasks#vscode)。默认配置如下：

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
          "regexp": "ERROR in .*"  // build-scirpt 日志
        },
        "background": {
          "beginsPattern": ".*(@alib/build-scripts|ice\\.js|rax\\.js).*", // build-scirpt 日志
          "endsPattern": ".*http://localhost:3333.*"  // build-scirpt 日志
        }
      }
    },
    {
      "label": "Iceworks Stop Background Tasks",
      "type": "process",
      "command": [
        "${command:workbench.action.tasks.terminate}",  // VS Code 内置命令
        "${command:workbench.action.acceptSelectedQuickOpenItem}" // VS Code 内置命令
      ]
    }
  ]
}

```

## Chrome 实例

默认开启新的 Chrome 实例进行调试。首次启动为无数据 Chrome (无用户态，无插件），在调试过程操作的数据将得以保存（历史，安装插件等）。

Rax 项目，推荐安装 [Guan Extension](https://chrome.google.com/webstore/detail/guan-extension/jfalnandddhgfnmejfgjgfbfnnkhljog)。

### 其他

如果想使用常用登录态的 Chrome 进行提示，可切换 launch.json 中的 request 配置为 `attach`，且必须关闭当前 Chrome。

