English | [简体中文](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-material-helper/README.zh-CN.md)

# React Component Helper

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-material-helper.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Use Component and Write Props easier in [JSX](https://reactjs.org/docs/introducing-jsx.html), friendly for React and [Rax](https://rax.js.org/).

## Usage

### Using Material

#### Activate Material Panel

![demo](https://user-images.githubusercontent.com/56879942/88197902-b2ba1180-cc75-11ea-8e33-0ce4e7faa368.gif)

1. Open vscode command palette  through `Ctrl+Shift+P` or `⇧⌘P`.
2. Enter `Iceworks: Import Material` to activate Material Panel.

#### Use in Pages

![demo](https://user-images.githubusercontent.com/56879942/88197928-b8aff280-cc75-11ea-816d-1c609bc90878.gif)

1. Click src/pages/*/index.tsx in the resource panel to open a page.
2. Activate the Material Panel.
3. Move cursor to a position for materials.
4. Search the block materials, click the material to be used, and the material code will be automatically added to the corresponding position.
5. Search for component materials. Click the material to be used, and the material code will be automatically added to the corresponding position.

#### Use in Components

![demo](https://user-images.githubusercontent.com/56879942/88197942-bb124c80-cc75-11ea-8caa-68fe2dc4cbc3.gif)

1. Click src/components/*/index.tsx in the resource panel to open a page.
2. Activate the material-import extension.
3. Move cursor to a position for materials.
4. Search for component materials. Click the material to be used, and the material code will be automatically added to the corresponding position.

### Props Autocomplete

<<<<<<< HEAD
在 [JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 中更快更好地添加组件、编写组件属性、查找组件文档，对 React 和 [Rax](https://rax.js.org/) 应用友好。
=======
When editing the props of a component in a JSX file, an automatic completion reminder will be given:
>>>>>>> origin/master

![demo](https://user-images.githubusercontent.com/56879942/88197950-bd74a680-cc75-11ea-8650-dec13706366c.gif)

1. Use materials in JSX files (such as View).
2. Enter part of props in the material tag, it will arouse automatic completion.

### Component Document Support

#### Active

![demo](https://user-images.githubusercontent.com/56879942/90105043-d275be80-dd77-11ea-9723-0ce16206c134.gif)

1. Open vscode command palette  through `Ctrl+Shift+P` or `⇧⌘P`.
2. Enter `Iceworks: Import Material` to activate Material Panel.

Or Active In Editor

![demo](https://user-images.githubusercontent.com/56879942/90105027-cc7fdd80-dd77-11ea-89f8-48b2a8d566eb.gif)

1. Right Clikc In a Jsx File Editor.
2. Choose `Iceworks: Show Compoents Docs In Current File`.

#### Component Document Support Usage

![demo](https://user-images.githubusercontent.com/56879942/90105051-d570af00-dd77-11ea-86b6-b460fa6cf430.gif)

1. Search the component label for the document you need to find
2. Click the item that appears after activation
3. Confirm to open component document link

<<<<<<< HEAD
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
=======
Or
>>>>>>> origin/master

![demo](https://user-images.githubusercontent.com/56879942/90107055-dbb45a80-dd7a-11ea-98eb-6fa6ecf3acc8.gif)

1. Move the mouse over the component label.
2. Click the document link.
3. Confirm to open copmonent document link

#### Document Opening Mode

![demo](https://user-images.githubusercontent.com/56879942/90105064-d86b9f80-dd77-11ea-999e-d93974b9e6c5.gif)

You can choose whether to open the document link in VS Code, which depends on the extension [Browser Preview](https://marketplace.visualstudio.com/items?itemName=auchenberg.vscode-browser-preview). If you want to open the document page in VS Code, install Browser Preview first.

## More

See the [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.
