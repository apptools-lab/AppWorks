简体中文 | [English](./README.en.md)

[![Version](https://vsmarketplacebadge.apphb.com/version/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)

# Iceworks 应用大纲树

从框架视角预览和管理您应用的组织，包括 npm 脚本、页面、组件和依赖信息。

## 功能

### 唤醒

当您安装了 Iceworks-APP 插件之后，您的工具栏上会增加 ICEWORKS 图标，单击它以进入应用大纲树组件。

![使用示例](https://user-images.githubusercontent.com/56879942/87531784-cb01bd80-c6c4-11ea-816b-fff4336016fd.gif)

### 命令板

如果您安装了 [Iceworks 套件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) ，您可以通过命令板唤起套件中的其他插件。

![使用示例](https://user-images.githubusercontent.com/56879942/87531795-d05f0800-c6c4-11ea-84d3-8e5fcfc32348.gif)

### 创建项目

当您打开一个空文件夹时，您可以通过 ICEWORK 面板创建项目：

![使用示例](https://user-images.githubusercontent.com/56879942/87407459-c4a41080-c5f4-11ea-882e-d198afc35413.png)

#### 设置 npm 

![使用示例](https://user-images.githubusercontent.com/56879942/87531798-d1903500-c6c4-11ea-9c6d-e19d6241c91a.gif)

1. 点击设置，进入设置页面
2. 配置包管理工具（默认为 npm ）
3. 配置默认镜像源（默认为淘宝网镜像）
4. 选择自定义物料库 (无默认外部物料库)

### npm 脚本信息

#### 查看和执行应用的 npm 脚本

![使用示例](https://user-images.githubusercontent.com/56879942/87393980-9f59d700-c5e1-11ea-9e07-0244926f54cc.gif)

1. 在左侧的面板处查看可执行的脚本信息；
2. 点击 `播放按钮` ，立即在终端执行脚本；
3. 点击 `终止按钮` ，结束在终端执行的对应脚本。

###  页面和组件信息

#### 快速跳转至对应页面和组件的源码

![使用示例](https://user-images.githubusercontent.com/56879942/87393958-9963f600-c5e1-11ea-9c96-94fc10492577.gif)

1. 点击左侧面板中页面列表和组件列表中的选项。
2. 跳转到所选项目所在的源码文件

#### 支持唤醒添加页面和组件功能 （使用方法参照 [生成页面](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-page-builder)｜[创建组件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-component-builder) ）

![使用示例](https://user-images.githubusercontent.com/56879942/87393953-949f4200-c5e1-11ea-896a-fd2d592050e0.gif)

1. 点击页面列表标题栏的 `+` 进入生成页面界面；
2. 点击组件列表标题栏的 `+` 进入创建组件界面。

### 应用依赖信息

#### 查看依赖信息、升级依赖包或重装应用依赖

![使用示例](https://user-images.githubusercontent.com/56879942/87393973-9cf77d00-c5e1-11ea-8baa-96c8c41229cf.gif)

1. 在左下角依赖库中查看应用安装的所有依赖；
2. 点击依赖项目旁边的 `⬆️` 按钮，即可更新到最新依赖；
3. 点击依赖列表标题框上的 `重装依赖` 按钮，即可重装应用的所有依赖包。

#### 一键安装或重装指定依赖

![使用示例](https://user-images.githubusercontent.com/56879942/87393970-9bc65000-c5e1-11ea-9724-3bd47c4b21ed.gif)

1.  点击依赖列表标题框上面的 `+` 按钮；
2. 在出现的命令面板上选择安装为 Dependencies (生产环境的依赖)或 devDependencies (开发环境的依赖)；
3. 输入需要安装的npm包及版本信息，例如 `typescript@latest` ；
4. npm包将会自动安装，如果这个包已经添加到了依赖中，那么将会重新安装。

## 更多

访问 [Iceworks 套件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)获取更多功能。

## License

[MIT](https://github.com/ice-lab/iceworks/blob/master/LICENSE)
