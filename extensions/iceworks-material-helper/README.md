简体中文 | [English](./README.en.md)

[![Version](https://vsmarketplacebadge.apphb.com/version/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)

# React 组件开发辅助插件

在 [JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 中更快更好地添加组件、编写组件属性、查找组件文档，对 React 和 [Rax](https://rax.js.org/) 应用友好。

## 功能

### 使用物料

> [什么是物料？](https://ice.work/docs/materials/about)

#### 激活物料面板

![使用示例](https://user-images.githubusercontent.com/56879942/87538941-a19a5f00-c6cf-11ea-92f2-b8ed100792fc.gif)

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板
2. 输入 `Iceworks: 使用物料` 激活物料添加面板

#### 在页面中使用物料

![使用示例](https://user-images.githubusercontent.com/56879942/87619860-ba4a5980-c74f-11ea-84c1-9ef69ef17b18.gif)

1. 在资源面板中点击 src/pages/*/index.tsx 打开页面源码
2. 激活物料添加面板
3. 选择需要插入物料的代码位置
4. 搜索区块，点击需要使用的区块，物料代码将自动添加到相应的位置中
5. 搜索组件，点击需要使用的组件，物料代码将自动添加到相应的位置中

#### 在组件中使用物料

![使用示例](https://user-images.githubusercontent.com/56879942/87619875-c2a29480-c74f-11ea-945e-788a32e65881.gif)

1. 在资源面板中点击 src/components/*/index.tsx 打开页面源码
2. 激活物料添加面板
3. 选择需要插入物料的代码位置
4. 搜索组件，点击需要使用的组件，物料代码将自动添加到相应的位置中


### 组件文档搜索

#### 激活

通过命名面板激活：

![使用说明](https://user-images.githubusercontent.com/56879942/90105060-d73a7280-dd77-11ea-8cb6-dbda547adcf2.gif)

或者在 JSX 中通过鼠标右键激活：

![使用说明](https://user-images.githubusercontent.com/56879942/90105045-d3a6eb80-dd77-11ea-9d4e-e0f4433e36c1.gif)

#### 使用

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

### 组件属性自动补全

在 JSX 文件中编辑组件的属性时将给予自动补全提醒：

![使用说明](https://user-images.githubusercontent.com/56879942/87399599-2dd25680-c5ea-11ea-9402-5e36ba7b8f98.gif)

1. 在 JSX 文件中使用组件（如 View ）
2. 在组件标签内输入属性的部分内容，将会激活自动补全提醒。

## 更多

访问 [Iceworks 套件](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)获取更多功能。

## License

[MIT](https://github.com/ice-lab/iceworks/blob/master/LICENSE)
