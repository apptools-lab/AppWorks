简体中文 | [English](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-app/README.md)

# 应用管理器

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-app.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
`[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

从框架视角预览和管理您应用的组织，向资源管理器面板添加 npm 脚本、依赖信息视图，新增应用管理器面板提供项目仪表盘、工程能力（调试、发布）。对 React 和 [Rax](https://rax.js.org/) 应用友好。

## 应用管理器面板

### 初始化状态

当您安装了插件之后，VS Code 的活动栏上会增加一个图标，单击此图标进入应用管理器面板。

如您当前的**工作区为空**或**非 React/Rax 应用**，则会进入面板的初始化状态。

![使用示例](https://user-images.githubusercontent.com/56879942/87553484-8e928980-c6e5-11ea-8183-a6ba7f4eae95.gif)

#### 创建项目

当您打开一个空文件夹时，初始化侧边栏将自动唤起创建应用流程，您也可以通过点击侧边栏上的「创建应用」按钮来唤起该流程。

![使用示例](https://user-images.githubusercontent.com/56879942/87407459-c4a41080-c5f4-11ea-882e-d198afc35413.png)

#### 设置

您可以通过点击侧边栏上的「设置」来设置在使用 Iceworks 时的一些配置。这些配置只会应用到 Iceworks 的相关操作。

![使用示例](https://img.alicdn.com/imgextra/i3/O1CN01nBuCWc1FXD6jPTK0o_!!6000000000496-2-tps-2880-1754.png)

1. 点击设置，进入设置页面
2. 配置包管理工具（默认为 npm ）
3. 配置默认镜像源（默认为淘宝网镜像）
4. 选择自定义物料库 (无默认外部物料库)

### 快速入口状态

如您当前的**工作区是 React/Rax 应用**，则会进入面板的快速入口状态。在快速入口视图上，我们提供了一些常用的全局功能按钮。

![快速入口](https://img.alicdn.com/imgextra/i3/O1CN01epkW5y1JGV7aJ1ghW_!!6000000001001-2-tps-2880-1754.png)

#### 项目仪表盘

项目仪表盘上展示了当前应用的一些状态，如果您的应用在一个项目周期内，还会展示一些跟研发链路相关的信息。

![使用示例](https://img.alicdn.com/imgextra/i3/O1CN01YaPauP1JSPQ0cIzIx_!!6000000001027-2-tps-2880-1754.png)

**激活：**

- 通过侧边栏快速入口中的「项目仪表盘」打开
- 通过命名面板上的 `Iceworks: 项目仪表盘` 打开

#### 欢迎使用

欢迎使用界面提供了使用 Iceworks 的视频教程。

![使用示例](https://img.alicdn.com/imgextra/i4/O1CN016qEXSF1l0ILd2gdL2_!!6000000004756-2-tps-2880-1754.png)

**激活：**

- 通过侧边栏快速入口中的「欢迎使用」打开
- 通过命名面板上的 `Iceworks: 欢迎使用` 打开

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

![使用示例](https://img.alicdn.com/imgextra/i4/O1CN012dDmJ81zv00cmWoXn_!!6000000006775-1-tps-1024-768.gif)

1. 单击手机图标打开手机调试模式
2. 选择不同的设备进行调试
3. 在响应式设备中，可以编辑设备尺寸，或使用拖拽调整设备

#### 添加调试设别

![使用示例](https://img.alicdn.com/imgextra/i1/O1CN01OmgfkY1DxCM3s4ONw_!!6000000000282-1-tps-1024-768.gif)

1. 在设备选项中选择`Edit`编辑设备选项
2. 添加或删除设备信息
3. 选择自定义的设备进行调试

更多请看[参考文档](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-app/docs/debug.md)

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

您可以通过点击窗口右下角状态栏上的「Iceworks」按钮激活 命令面板。

![使用示例](https://user-images.githubusercontent.com/56879942/87544740-8d5b5f80-c6d9-11ea-85ff-bc31501911e1.gif)

1. 找到 VS Code 右下角的 Iceworks 。
    > 注意 : 如果没有 Iceworks 图标，请按照 `激活` 章节的内容来激活此按钮。
2. 点击 Iceworks 按钮，打开命令面板。

## 更多

本插件由 [Iceworks Team](https://marketplace.visualstudio.com/publishers/iceworks-team) 开发，是 Iceworks 套件的一部分，访问 [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。
