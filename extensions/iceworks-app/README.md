简体中文 | [English](./README.en.md)

[![Version](https://vsmarketplacebadge.apphb.com/version/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)

# Iceworks 应用大纲树

它可以帮助你预览你的前端应用，包括 npm 脚本，页面，组件和依赖信息。它还支持快速安装或升级依赖，添加新页面和组件等等。

## 功能

### npm 脚本信息

#### 查看应用可执行的 npm 脚本

#### 立即执行和中断 npm 脚本

![使用示例](https://user-images.githubusercontent.com/56879942/87393980-9f59d700-c5e1-11ea-9e07-0244926f54cc.gif)

1. 在左侧的面板处查看可执行的脚本信息。
2. 点击 `播放按钮` ，立即在终端执行脚本。
3. 点击 `终止按钮`， 结束在终端执行的对应脚本。

###  页面和组件信息

#### 支持快速跳转至对应的页面和组件

![使用示例](https://user-images.githubusercontent.com/56879942/87393958-9963f600-c5e1-11ea-9c96-94fc10492577.gif)

1. 点击左侧面板中页面列表和组件列表中的选项。
2. 跳转到所选项目所在的源码文件

#### 支持唤醒添加页面和组件功能 （使用方法参照 [生成页面](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-page-builder)｜[创建组件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-component-builder) ）

![使用示例](https://user-images.githubusercontent.com/56879942/87393953-949f4200-c5e1-11ea-896a-fd2d592050e0.gif)

1. 点击页面列表标题栏的 `+` 进入生成页面界面
2. 点击组件列表标题栏的 `+` 进入创建组件界面

### 应用依赖信息

#### 支持查看应用的依赖信息

#### 支持单独升级和整体重装依赖

![使用示例](https://user-images.githubusercontent.com/56879942/87393973-9cf77d00-c5e1-11ea-8baa-96c8c41229cf.gif)

1. 在左下角依赖库中查看项目安装的所有依赖。
2. 点击依赖项目旁边的 `⬆️` 按钮，即可更新到最新依赖。
3. 点击依赖列表标题框上的 `重装依赖` 按钮，即可重装项目整体依赖。

#### 支持一键安装或重装指定依赖

![使用示例](https://user-images.githubusercontent.com/56879942/87393970-9bc65000-c5e1-11ea-9724-3bd47c4b21ed.gif)

1.  点击依赖列表标题框上面的 `+` 按钮。
2. 在出现的命令面板上选择安装为 产品依赖（Dependency) 或 调试依赖(Devdependency)。
3. 输入需要安装的npm包及版本信息，例如`typescript@latest`。
4. npm包将会自动安装， 如果这个包已经添加到了依赖中，那么将会重新安装。

## 更多

访问 [Iceworks Pack](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 了解更多 Iceworks 相关功能。

## License

[MIT](https://github.com/ice-lab/iceworks/blob/master/LICENSE)
