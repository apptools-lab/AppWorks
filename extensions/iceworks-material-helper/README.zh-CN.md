简体中文 | [English](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-material-helper/README.md)

# 前端组件开发辅助插件

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-material-helper.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

在 [JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 中更快更好地添加组件、编写组件属性、查找组件文档，对 React 和 [Rax](https://rax.js.org/) 应用友好。

## 页面和组件信息

![示例](https://img.alicdn.com/imgextra/i3/O1CN01UnlYme22ks5npf5u2_!!6000000007159-2-tps-2880-1754.png)

### 快速跳转至对应页面和组件的源码

1. 点击左侧面板中页面列表和组件列表中的选项。
2. 跳转到所选项目所在的源码文件

### 支持激活添加页面和组件功能

1. 点击页面列表标题栏的 `+` 进入生成页面界面；
2. 点击组件列表标题栏的 `+` 进入创建组件界面。

## 使用物料面板

> [什么是物料？](https://ice.work/docs/materials/about)

### 激活

![使用示例](https://user-images.githubusercontent.com/56879942/87538941-a19a5f00-c6cf-11ea-92f2-b8ed100792fc.gif)

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板
2. 输入 `Iceworks: 添加组件` 激活物料添加面板

### 在页面中使用物料

![使用示例](https://user-images.githubusercontent.com/56879942/87619860-ba4a5980-c74f-11ea-84c1-9ef69ef17b18.gif)

1. 在资源面板中点击 src/pages/*/index.tsx 打开页面源码
2. 激活物料添加面板
3. 选择需要插入物料的代码位置
4. 搜索区块，点击需要使用的区块，物料代码将自动添加到相应的位置中
5. 搜索组件，点击需要使用的组件，物料代码将自动添加到相应的位置中

### 在组件中使用物料

![使用示例](https://user-images.githubusercontent.com/56879942/87619875-c2a29480-c74f-11ea-945e-788a32e65881.gif)

1. 在资源面板中点击 src/components/*/index.tsx 打开页面源码
2. 激活物料添加面板
3. 选择需要插入物料的代码位置
4. 搜索组件，点击需要使用的组件，物料代码将自动添加到相应的位置中

## 拼接区块组装页面

通过可视化操作，以区块拼装的方式快速生成页面。

### 激活

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板；
2. 在命令面板中输入 `Iceworks: 使用区块组装页面` ，点击选中的项目或按下键盘回车键，激活页面生成插件。

### 使用

1. 从右侧的区块列表中选择页面需要使用的区块，点击添加到左侧页面预览区；
2. 在左侧页面预览区可通过拖拽排序区块的顺序，或点击右上角的删除图标移除区块；
3. 点击“生成页面”按钮，输入页面名称和路由路径，点击"确认"按钮，生成页面代码，页面代码将生成到 `src/pages/` 目录下。

![拼接区块组装页面](https://img.alicdn.com/tfs/TB1ErOEjnM11u4jSZPxXXahcXXa-1440-900.gif)

## 通过配置模板生成页面

通过使用模板可视化配置的方式生成页面。

### 激活

![使用示例](https://user-images.githubusercontent.com/56879942/91519104-442b3c00-e924-11ea-93a3-e52bbc83f05d.gif)

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板
2. 在命令面板中输入 `Iceworks: 使用模板生成页面` ，点击选中的项目或按下键盘回车键，激活页面生成插件

### 使用

![使用示例](https://user-images.githubusercontent.com/56879942/91536902-08a26900-e948-11ea-9c80-41fe4387b48f.gif)

1. 选择一个页面模板
2. 点击 `下一步` ，进入配置页面
3. 进行页面模板的配置，通过使用这些配置生成个性化页面
4. 点击 `创建页面` 按钮，添加页面信息表单
5. 填入页面的名称，路由信息
6. 点击 `确认` 按钮，生成页面代码，页面代码将生成到 `src/pages/` 目录下。

## 下载远程物料到本地

为 React 和 [Rax](https://rax.js.org/) 应用提供了海量的高质量物料，通过选择物料快速创建前端组件。

### 激活

1. 通过 `⇧⌘P` ( MacOS ) 或 `Ctrl+Shift+p` ( Windows ) 快捷键唤起命令面板；
2. 输入 `Iceworks: 下载物料到本地` ，点击选中的项目或按下键盘回车键，激活插件。

### 使用

1. 填写组件名（同时也是组件所在文件夹的名称)；
2. 组件名输入框下方选择一个使用的区块；
3. 点击 `创建组件` 按钮，生成组件代码。

![下载远程物料到本地](https://img.alicdn.com/tfs/TB1_UQvfiDsXe8jSZR0XXXK6FXa-1440-900.gif)

## 组件文档搜索

### 激活

通过命名面板激活：

![使用说明](https://user-images.githubusercontent.com/56879942/90105060-d73a7280-dd77-11ea-8cb6-dbda547adcf2.gif)

或者在 JSX 中通过鼠标右键激活：

![使用说明](https://user-images.githubusercontent.com/56879942/90105045-d3a6eb80-dd77-11ea-9d4e-e0f4433e36c1.gif)

### 使用

![使用说明](https://user-images.githubusercontent.com/56879942/90112425-8d0abe80-dd82-11ea-955c-38fdaea2e7eb.gif)

1. 搜索您需要查找文档的组件名
2. 点击组件名后，选择打开组件文档的方式
3. 浏览文档

或者：

![使用说明](https://user-images.githubusercontent.com/56879942/90112444-93009f80-dd82-11ea-8413-9578f7244a21.gif)

1. 将鼠标悬停在需要查找文档的组件标签上
2. 点击文档链接
3. 浏览文档

#### 文档浏览方式设置

![使用说明](https://user-images.githubusercontent.com/56879942/90105048-d4d81880-dd77-11ea-8fcf-76da90af3a23.gif)

您可以选择是否在 VS Code 浏览文档网页，这一功能依赖 [Browser Preview](https://marketplace.visualstudio.com/items?itemName=auchenberg.vscode-browser-preview) 插件进行实现。 如果您希望在 VS Code 内部浏览文档，请先安装此插件。

## 组件属性自动补全

在 JSX 文件中编辑组件的属性时将给予自动补全提醒：

![使用说明](https://user-images.githubusercontent.com/56879942/87399599-2dd25680-c5ea-11ea-9402-5e36ba7b8f98.gif)

1. 在 JSX 文件中使用组件（如 View ）
2. 在组件标签内输入属性的部分内容，将会激活自动补全提醒。

## 自动填充 React/Rax 代码片段到文件

在创建文件夹或文件时，识别创建组件的意图，自动创建 index.j[t]sx 文件并填充代码片段。

![示例](https://img.alicdn.com/imgextra/i2/O1CN01wge0kr25ZMzp40FSY_!!6000000007540-1-tps-1446-906.gif)

## 调试物料

Iceworks 为物料开发者提供了本地调试的功能。

### 激活

![激活](https://user-images.githubusercontent.com/56879942/95042213-c10fb980-070b-11eb-8e4c-0193e026b8ee.gif)

1. 通过 `⇧⌘P` ( MacOS ) 或 `Ctrl+Shift+p` ( Windows ) 快捷键唤起命令面板；
2. 输入 `Iceworks: 调试本地物料项目` 开启调试。

### 调试本地物料项目

![调试本地物料项目](https://user-images.githubusercontent.com/56879942/95042215-c2d97d00-070b-11eb-8698-a4ae04136dbf.gif)

1. 选择 `添加一个本地物料项目到调试列表`；
2. 选择需要调试的物料项目文件夹，点击 `开始调试`；
3. 使用物料功能，例如：`通过配置模板生成页面`，选择本地物料源进行调试。

### 清除调试的物料源

![清除调试的物料源](https://user-images.githubusercontent.com/56879942/95042192-b7865180-070b-11eb-83de-50ad3af29b4a.gif)

1. 选择 `清除调试的物料源`；
2. 所有调试物料源均被删除。

## 更多

本插件由 [Iceworks Team](https://marketplace.visualstudio.com/publishers/iceworks-team) 开发，是 Iceworks 套件的一部分，访问 [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。
