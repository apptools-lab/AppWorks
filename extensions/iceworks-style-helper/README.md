简体中文 | [English](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-style-helper/README.en.md)

# Iceworks 样式开发辅助插件

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-style-helper.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

方便您在 [JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 中更快速地编写内联样式，并对 CSS 、SASS 等样式文件提供强大的辅助开发功能。对 React 和 [Rax](https://rax.js.org/) 应用友好。

## 用法

### JSX 文件

#### style 属性

在 JSX 文件中编辑组件的 `style` 属性时给予自动补全提醒。

##### 行内样式

根据 w3c 标准给予样式字段和值的自动补全提醒：

![使用示例](https://user-images.githubusercontent.com/56879942/87412958-3895e700-c5fc-11ea-88e2-3e3e78a07f9e.gif)

##### 变量赋值

使用 CSS Module 时，根据样式声明进行样式字段的自动补全：

![使用示例](https://user-images.githubusercontent.com/56879942/87412953-36cc2380-c5fc-11ea-9315-f153b1415dc8.gif)

#### className 属性

在 JSX 文件中编辑组件的 `className` 属性时给予自动补全提醒，值预览及定义跳转。

##### 自动补全提醒

在编辑组件的 `className` 时，根据文件 `import` 的样式文件内的类选择器进行自动补全提醒。

![使用示例](https://user-images.githubusercontent.com/56879942/87412926-2caa2500-c5fc-11ea-9acc-78974ddb1932.gif)

##### 值预览及定义跳转

![使用示例](https://user-images.githubusercontent.com/56879942/87412950-35026000-c5fc-11ea-83ee-33de13681911.gif)

1. 鼠标停留在 `className` 值上，出现悬浮部件显示该值对应的样式声明

2. 点击对应的 `className` 值，跳转到该值的定义处

### 样式文件

在 CSS、LESS、SASS 文件中输入类选择器时，根据引用值进行自动补全提醒：

![使用示例](https://user-images.githubusercontent.com/56879942/87416514-63366e80-c601-11ea-8f3e-05fe51a8f26b.gif)

1. 在 JSX 内声明组件 `className` 属性的值为 ` home , text0 , text1 , text2 `
2. 在 JSX 内引用样式文件：`import './index.scss'`
3. 新建该 `index.css` 文件
4. 在 `index.css` 内输入 `.` ，出现上述属性值的自动补全提醒

### SASS 文件

#### 变量自动补全提醒

在 SASS 文件内输入变量时，根据引用文件进行代码自动补全：

![使用示例](https://user-images.githubusercontent.com/56879942/87523081-026a6d00-c6b9-11ea-8e8a-5d62688c020d.gif)  

#### 变量预览值

鼠标停留在变量上，出现悬浮部件显示该变量对应的值：

![使用示例](https://user-images.githubusercontent.com/56879942/87412974-3e8bc800-c5fc-11ea-9a6c-ea62eecbfbff.gif)

#### 属性值使用变量替换的建议

输入属性值时，如发现可使用变量进行替换，则出现变量替换提醒列表：

![使用示例](https://user-images.githubusercontent.com/56879942/87531943-04d2c400-c6c5-11ea-9f74-be6721353e46.gif)

#### 变量的定义跳转

通过 cmd + 点击（ Windows: ctrl + 点击 ）进行变量的定义代码跳转：

![使用示例](https://user-images.githubusercontent.com/56879942/87419478-2456e780-c606-11ea-9842-47a01b7e85c8.gif)

## 更多

访问 [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。
