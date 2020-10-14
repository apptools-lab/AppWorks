English | [简体中文](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks/README.zh-CN.md)

# Iceworks

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-star/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks&ssr=false#review-details)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ice-lab/iceworks/pulls)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Iceworks is a Visual Intelligent Development Assistant, provide visualization and intelligent technology to build Universal Application faster and better, support Web / H5 / MiniProgram Application.

## Features

### Visual Development

Iceworks Visual Development provides functions: Visual Construction and Visual Configuration.

Visual Construction provides the drag and drop capability of WYSIWYG, which helps to quickly complete the development of front-end pages.This capability is independent of the specific platform  and framework, after building, you can update UI by code. It greatly reduces the threshold of front-end development and improves the efficiency of front-end development. At the same time, it also takes into account the maintainability and flexibility of the program.

![Visual Construction](https://img.alicdn.com/tfs/TB13RgHVGL7gK0jSZFBXXXZZpXa-2880-1754.png_790x10000.jpg)

> See [UI Builder Extension](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder) for more details.

Visual Configuration aims to reduce the threshold of front-end development and improve the development experience. It provides the ability to generate code through process guidance and form operation. The ability supports user-defined templates or materials and provides developers with the ability to generate personalized code.

![Visual Configuration](https://img.alicdn.com/tfs/TB1vrcOSEz1gK0jSZLeXXb9kVXa-2048-1536.png_790x10000.jpg)

> See [Config Helper Extension](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-config-helper) for more details.

### Intelli Code

Iceworks Intelli Code currently provides functions: Code Completion and Code Information.

In the process of code writing, Iceworks Intelli Code can automatically predict the developer's programming intention and continuously recommend "the next code to be written" to the developer. The developer can directly confirm the code to be input by "one click completion", thus greatly improving the efficiency of code writing. For example, when inputting style fields and values, the Code Completion effect provided by Iceworks is as follows.

![Code Completion](https://user-images.githubusercontent.com/56879942/87412958-3895e700-c5fc-11ea-88e2-3e3e78a07f9e.gif)

Iceworks Code Completion is based on semantic and code analysis, completely local execution, ensure code security; millisecond response, smooth coding!

### Abundant Materials

Iceworks set [Fusion Design](https://fusion.design/) and [Rax UI](https://rax.js.org/docs/components/introduce) components as built-in materials, abundant materials can be used out of the box: applications can be created through materials, components and pages can be generated through materials, and codes can be added with one click. Iceworks also supports the access of custom materials, and provides the whole process support for the material development link. Developers can easily customize the business specific material collection:

![Abundant Material](https://img.alicdn.com/tfs/TB1UjO9SET1gK0jSZFrXXcNCXXa-1000-750.png_790x10000.jpg)

## Quick start

Click "Iceworks Icon" on the **Activity Bar** to open the **Iceworks Side Bar**:

![demo](https://img.alicdn.com/tfs/TB1Z8T0gzMZ7e4jSZFOXXX7epXa-1024-768.png_790x10000.jpg)

After the application is created, NPM script execution/page creation/component creation and other operations are performed in **Iceworks Side Bar**:

![demo](https://img.alicdn.com/tfs/TB1qZ7jSBr0gK0jSZFnXXbRRXXa-1024-768.png_790x10000.jpg)

## Extensions

Iceworks Pack extension installs these extensions:

Extension | Description | State
--------- | ------- | ---------
[Application Viewer](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app) | Preview the application organization from the perspective of UI organization, and provide Iceworks quick operation entrance | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-app.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[Application Creator](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-project-creator) | Use interface guidance to create a new Universal Application by template | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-project-creator.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-project-creator.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-project-creator)
[UI Builder](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder) | Build UI by visual way | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-ui-builder.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-ui-builder.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[React Style Helper](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper) | Auto completion reminder for writing inline style in [JSX](https://reactjs.org/docs/introducing-jsx.html) | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-style-helper.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[React Component Helper](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper) | Use Component and Write Props easier in [JSX](https://reactjs.org/docs/introducing-jsx.html) | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-material-helper.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[Config Helper](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-config-helper) | For configuration files(like *.json), provides visualization form setting or code editing reminder, verification and other features. | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-config-helper.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-config-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-config-helper)
[Doctor](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-doctor) | Security and Quality audit tool, quick to detect various kinds of security flaws in your application and infrastructure code | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-doctor.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-doctor.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.doctor)

## Help

- Join [Dingtalk](https://www.dingtalk.com/) Group

  ![qrcode](https://img.alicdn.com/tfs/TB1oDJzTeL2gK0jSZFmXXc7iXXa-379-378.png_220x10000.jpg)
- Open an [issue](https://github.com/ice-lab/iceworks/issues/new)

  We will respond quickly to the submitted issues.
- Appointment training

  For company or team that intend to use Iceworks on a large scale, we can provide free training. Please consult us for details by Email: wuji.xwt@alibabab-inc.com
