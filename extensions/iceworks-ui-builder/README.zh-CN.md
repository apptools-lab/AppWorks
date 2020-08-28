简体中文 | [English](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-ui-builder/README.md)

# Iceworks 可视化搭建插件

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-ui-builder.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-ui-builder.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-ui-builder.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

使用可视化搭建的方式创建用户界面。

## 可视化搭建组件

通过可视化搭建的方式生成组件代码。

### 激活

![使用示例](https://img.alicdn.com/tfs/TB1hMmdRxz1gK0jSZSgXXavwpXa-2880-1800.gif)

通过 `⇧⌘P` ( MacOS ) 或 `Ctrl+Shift+p` ( Windows ) 快捷键唤起命令面板，输入 `Iceworks: 生成组件` ，激活插件。

### 使用

![使用示例](https://img.alicdn.com/tfs/TB1VGQHeypE_u4jSZKbXXbCUVXa-1440-900.gif)

1. 拖拽左侧的组件到中间的画布面板中；
2. 按下 `⌘+S` ( MacOS ) 或 `Ctrl+S` ( Windows ) ，在输入框中填写组件名，按下回车键即可生成组件到项目中。

## 拼接区块组装页面

通过可视化操作，以区块拼装的方式快速生成页面。

### 激活

![使用示例](https://user-images.githubusercontent.com/56879942/87402315-f49be580-c5ed-11ea-87a8-4143a461124f.gif)

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板
2. 在命令面板中输入 `Iceworks: 生成页面` ，点击选中的项目或按下键盘回车键，激活页面生成插件

### 使用

![使用示例](https://user-images.githubusercontent.com/56879942/87531900-f5ec1180-c6c4-11ea-8753-ad269d5768d5.gif)

1. 输入页面名称（将用作文件夹名）
2. 从右侧的区块列表中选择页面需要使用的区块，点击添加到左侧页面预览区
3. 在左侧页面预览区可通过拖拽排序区块的顺序，或点击右上角的删除图标移除区块
4. 点击“生成页面”按钮，生成页面代码，页面代码将生成到 `src/pages/` 目录下

## 通过模板配置生成页面

使用页面模板，可视化配置的方式生成页面。

### 激活

![使用示例](https://user-images.githubusercontent.com/56879942/91519104-442b3c00-e924-11ea-93a3-e52bbc83f05d.gif)

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板
2. 在命令面板中输入 `Iceworks: 创建页面` ，点击选中的项目或按下键盘回车键，激活页面生成插件

### 使用

![使用示例](https://user-images.githubusercontent.com/56879942/91519125-52795800-e924-11ea-904f-9cc0caf6af5e.gif)

1. 选择一个页面模板
2. 点击 `下一步` ，进入配置页面
3. 进行页面模板的配置，通过使用这些配置生成个性化页面
4. 点击 `创建页面` 按钮，添加页面信息表单
5. 填入页面的名称，路由信息
6. 点击 `确认` 按钮，生成页面代码，页面代码将生成到 `src/pages/` 目录下。

## 下载远程物料到本地

通过选择物料快速创建前端组件。

### 激活

![使用示例](https://user-images.githubusercontent.com/56879942/87535699-77926e00-c6ca-11ea-9e21-65fad2e95e0f.gif)

1. 通过 `⇧⌘P` ( MacOS ) 或 `Ctrl+Shift+p` ( Windows ) 快捷键唤起命令面板;
2. 输入 `Iceworks: 创建组件` ，点击选中的项目或按下键盘回车键，激活插件

### 使用

Iceworks 为 React 和 [Rax](https://rax.js.org/) 应用提供了海量的高质量物料，可一键添加到您的应用中。

![使用示例](https://user-images.githubusercontent.com/56879942/87535673-6f3a3300-c6ca-11ea-852e-f3a2bb3eb7bc.gif)

1. 填写组件名（同时也是组件所在文件夹的名称)；
2. 组件名输入框下方选择一个使用的区块；
3. 点击 `创建组件` 按钮，生成组件代码。

## 更多

访问 [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。
