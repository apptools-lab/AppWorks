简体中文 | [English](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-ui-builder/README.md)

# 可视化搭建插件

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-ui-builder.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-ui-builder.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-ui-builder.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

使用可视化搭建的方式创建用户界面。

## 可视化搭建组件

通过可视化搭建的方式生成组件代码。

### 激活

通过 `⇧⌘P` ( MacOS ) 或 `Ctrl+Shift+p` ( Windows ) 快捷键唤起命令面板，输入 `Iceworks: 生成组件` ，激活插件。

### 使用

1. 拖拽左侧的组件到中间的画布面板中；
2. 按下 `⌘+S` ( MacOS ) 或 `Ctrl+S` ( Windows ) ，在输入框中填写组件名，按下回车键即可生成组件到项目中。

![可视化搭建组件](https://img.alicdn.com/tfs/TB179prilFR4u4jSZFPXXanzFXa-1440-900.gif)

## 拼接区块组装页面

通过可视化操作，以区块拼装的方式快速生成页面。

### 激活

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板；
2. 在命令面板中输入 `Iceworks: 生成页面` ，点击选中的项目或按下键盘回车键，激活页面生成插件。

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
2. 在命令面板中输入 `Iceworks: 创建页面` ，点击选中的项目或按下键盘回车键，激活页面生成插件

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
2. 输入 `Iceworks: 创建组件` ，点击选中的项目或按下键盘回车键，激活插件。

### 使用

1. 填写组件名（同时也是组件所在文件夹的名称)；
2. 组件名输入框下方选择一个使用的区块；
3. 点击 `创建组件` 按钮，生成组件代码。

![下载远程物料到本地](https://img.alicdn.com/tfs/TB1_UQvfiDsXe8jSZR0XXXK6FXa-1440-900.gif)

## 调试物料

Iceworks 为物料开发者提供了本地调试的功能。

### 激活

![激活](https://user-images.githubusercontent.com/56879942/95042213-c10fb980-070b-11eb-8e4c-0193e026b8ee.gif)

1. 通过 `⇧⌘P` ( MacOS ) 或 `Ctrl+Shift+p` ( Windows ) 快捷键唤起命令面板；
2. 输入 `Iceworks: 调试本地物料项目` 开启调试。

### 使用

#### 调试本地物料项目

![调试本地物料项目](https://user-images.githubusercontent.com/56879942/95042215-c2d97d00-070b-11eb-8698-a4ae04136dbf.gif)

1. 选择 `添加一个本地物料项目到调试列表`；
2. 选择需要调试的物料项目文件夹，点击 `开始调试`；
3. 使用物料功能，例如：`通过配置模板生成页面`，选择本地物料源进行调试。

#### 清除调试的物料源

![清除调试的物料源](https://user-images.githubusercontent.com/56879942/95042192-b7865180-070b-11eb-83de-50ad3af29b4a.gif)

1. 选择 `清除调试的物料源`；
2. 所有调试物料源均被删除。

## 更多

本插件由 [Iceworks Team](https://marketplace.visualstudio.com/publishers/iceworks-team) 开发，是 Iceworks 套件的一部分，访问 [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。