简体中文 | [English](https://github.com/apptools-lab/appworks/blob/master/extensions/application-manager/README.md)

# 应用管理器

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-app.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
`[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

从框架视角预览和管理您应用的组织，向资源管理器面板添加 npm 脚本、依赖管理视图，新增应用管理器面板提供项目仪表盘、工程能力（调试、发布）。对 React 和 [Rax](https://rax.js.org/) 应用友好。

## 应用管理器面板

### 初始化状态

当您安装了插件之后，VS Code 的活动栏上会增加一个图标，单击此图标进入应用管理器面板。

如您当前的**工作区为空**或**非 React/Rax 应用**，则会进入面板的初始化状态。初始化侧边栏还将自动唤起创建应用流程，您也可以通过点击侧边栏上的「创建应用」按钮来唤起该流程。

![使用示例](https://img.alicdn.com/imgextra/i1/O1CN01UN3fyV26ionbnonbx_!!6000000007696-2-tps-2048-1536.png)

#### 设置

您可以通过点击侧边栏上的「设置」来设置在使用 AppWorks 时的一些配置。这些配置只会应用到 AppWorks 的相关操作。

![使用示例](https://img.alicdn.com/imgextra/i1/O1CN0173xn6G1hxbBhqjlGC_!!6000000004344-2-tps-2048-1536.png)

1. 点击设置，进入设置页面
2. 配置包管理工具（默认为 npm ）
3. 配置默认镜像源（默认为淘宝网镜像）
4. 选择自定义物料库 (无默认外部物料库)

### 快速入口状态

如您当前的**工作区是 React/Rax 应用**，则会进入面板的快速入口状态。在快速入口视图上，我们提供了一些常用的全局功能按钮。

![快速入口](https://img.alicdn.com/imgextra/i3/O1CN0157AP9s1kviPGErEkq_!!6000000004746-2-tps-2048-1536.png)

#### 项目仪表盘

项目仪表盘上展示了当前应用的一些状态，如果您的应用在一个项目周期内，还会展示一些跟研发链路相关的信息。

![使用示例](https://img.alicdn.com/imgextra/i3/O1CN01jScRq91fQVKvDypRI_!!6000000004001-2-tps-2048-1536.png)

**激活：**

- 通过侧边栏快速入口中的「项目仪表盘」打开
- 通过命名面板上的 `AppWorks: 项目仪表盘` 打开

## 资源管理器面板

当您的工作区是一个 React 或 Rax 应用，插件将向您的资源管理器面板添加「快捷操作视图」和「依赖信息视图」。

### 快捷操作视图

![使用示例](https://img.alicdn.com/imgextra/i1/O1CN016x5akG1PgxhNAFXqY_!!6000000001871-2-tps-2880-1754.png)

1. 在左侧的面板处查看可执行的脚本信息；
2. 点击 `播放按钮` ，立即在终端执行脚本；
3. 点击 `终止按钮` ，结束在终端执行的对应脚本。

#### 工程能力

![使用示例](https://img.alicdn.com/tfs/TB1vCixhP39YK4jSZPcXXXrUFXa-1200-695.gif)

#### 使用移动端预览

![使用示例](https://img.alicdn.com/imgextra/i2/O1CN01xHrOWW1yl5pIYtMJ1_!!6000000006618-1-tps-1024-768.gif)

1. 单击手机图标打开手机调试模式
2. 选择不同的设备进行调试
3. 在响应式设备中，可以编辑设备尺寸，或使用拖拽调整设备

#### 添加调试设备

![使用示例](https://img.alicdn.com/imgextra/i4/O1CN019qlxQR21Mldeemi9g_!!6000000006971-1-tps-1024-768.gif)

1. 在设备选项中选择`Edit`编辑设备选项
2. 添加或删除设备信息
3. 选择自定义的设备进行调试

更多请看[参考文档](https://github.com/apptools-lab/appworks/blob/master/extensions/application-manager/docs/debug.md)

### 依赖信息视图

![使用示例](https://img.alicdn.com/imgextra/i2/O1CN01WZtDq8256yRFn77w5_!!6000000007478-2-tps-2880-1754.png)

#### 查看依赖信息、升级依赖包或重装应用依赖

1. 在左下角依赖库中查看应用安装的所有依赖；
2. 点击依赖项目旁边的 `⬆️` 按钮，即可更新到最新依赖；
3. 点击依赖列表标题框上的 `重装依赖` 按钮，即可重装应用的所有依赖包。

#### 一键安装或重装指定依赖

1. 点击依赖列表标题框上面的 `+` 按钮；
2. 在出现的命令面板上选择安装为 Dependencies (生产环境的依赖)或 devDependencies (开发环境的依赖)；
3. 输入需要安装的 npm 包及版本信息，例如 `typescript@latest` ；
4. npm 包将会自动安装，如果这个包已经添加到了依赖中，那么将会重新安装。

## 命令面板

您可以通过点击窗口右下角状态栏上的「AppWorks」按钮激活命令面板。

![使用示例](https://img.alicdn.com/imgextra/i3/O1CN01LeqsBd1xzv2xmpUhE_!!6000000006515-2-tps-2048-1536.png)

1. 找到 VS Code 右下角的 AppWorks 。
    > 注意 : 如果没有 AppWorks 图标，请按照 `激活` 章节的内容来激活此按钮。
2. 点击 AppWorks 按钮，打开命令面板。

## 更多

本插件由 [AppWorks Team](https://marketplace.visualstudio.com/publishers/iceworks-team) 开发，是 AppWorks 套件的一部分，访问 [AppWorks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。
