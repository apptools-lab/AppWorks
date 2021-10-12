English | [简体中文](https://github.com/apptools-lab/appworks/blob/master/extensions/material-helper/README.zh-CN.md)

# Component Helper

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-material-helper.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Use Component and Write Props easier, friendly for React/Vue/[Rax](https://rax.js.org/).

## JS Project Automatic Completion

* React: Automatic completion for your custom component props in JS Project.

![img01](https://img.alicdn.com/imgextra/i4/O1CN01VVzQRF1NkVYGN3rrg_!!6000000001608-1-tps-900-513.gif)

* Rax: Automatic completion for your custom component and [rax-components](https://github.com/raxjs/rax-components/) props in JS Project.

![img02](https://img.alicdn.com/imgextra/i2/O1CN01D6Zb3r1b7wpFzjWyk_!!6000000003419-1-tps-900-513.gif)

## Pages and Components

![demo](https://img.alicdn.com/imgextra/i3/O1CN01UnlYme22ks5npf5u2_!!6000000007159-2-tps-2880-1754.png)

Jump into corresponding pages and components:

1. Click items in PAGES and COMPONENTS on the left panel.
2. Jump into files of selected projects.

Activate Generate Page and Create Component:

1. Click `+` in PAGES header to jump into GENERATE PAGE page.
2. Click `+` in COMPONENTS header to jump into CREATE COMPONENT page.

## Using Material Panel

![demo](https://img.alicdn.com/imgextra/i2/O1CN01IMWBdS1qFvyDEQ4eV_!!6000000005467-1-tps-1446-877.gif)

1. Click src/pages/*/index.tsx in the resource panel to open a page.
2. Open VS Code command palette through `Ctrl+Shift+P` or `⇧⌘P`, enter `AppWorks: Import Component` to activate Material Panel.
3. Move cursor to a position for materials.
4. Search the block materials, click the material to be used, and the material code will be automatically added to the corresponding position.
5. Search for component materials. Click the material to be used, and the material code will be automatically added to the corresponding position.

## Generate Page by Blocks

Through GUI, you can quickly assemble pages with materials.

![demo](https://img.alicdn.com/imgextra/i2/O1CN01ankDUO1EsRsSPIv4h_!!6000000000407-1-tps-1446-877.gif)

1. Open vscode command palette  by `Ctrl+Shift+P` or `⇧⌘P` .
2. In the command palette, type `AppWorks: Generate Page by Blocks` and click on the selected item or press enter on the keyboard to evoke page-builder extension.
3. Select the block to be used for the page from the block list on the right, click to add it to the page preview area on the left.
4. Rearrange blocks by dragging and dropping the order of the blocks in the left page preview area, or delete blocks by clicking icons in the upper right corner.
5. Click `Generate page` button to generate page code. Input the page name and the router path and then click `ok` button. The page code will be generated into 'src /pages/'

![generate-page](https://img.alicdn.com/tfs/TB1ErOEjnM11u4jSZPxXXahcXXa-1440-900.gif)

## Download Component Materials

Provides a huge amount of high quality materials for React、Vue and [Rax](https://rax.js.org/) apps. You can select materials to create components.

![demo](https://img.alicdn.com/imgextra/i1/O1CN01FJU1ww1DFgkD8jyjn_!!6000000000187-1-tps-1446-877.gif)

1. Through (Ctrl+Shift+P or ⇧⌘P) evoke vscode command palette
2. In the vscode command palette, enter `AppWorks: Download Component Materials`, click the selected item or press enter to arouse the plugin;
3. Fill in the component name (also the folder name of the componenent)
4. Select a material below.
5. Click `Create component` button to generate component code.

## Component Document Support

![demo](https://img.alicdn.com/imgextra/i4/O1CN012XEq3P1wwQPSlxhh5_!!6000000006372-1-tps-1446-877.gif)

1. Right Click in a Jsx File Editor, choose `AppWorks: Find Components In Current File`.
2. Search the component label for the document you need to find
3. Click the item that appears after activation
4. Confirm to open component document link

> You can choose whether to open the document link in VS Code, which depends on the extension [Browser Preview](https://marketplace.visualstudio.com/items?itemName=auchenberg.vscode-browser-preview). If you want to open the document page in VS Code, install Browser Preview first.

## Props Autocomplete

When editing the props of a component in a JSX file, an automatic completion reminder will be given:

![demo](https://user-images.githubusercontent.com/56879942/87399599-2dd25680-c5ea-11ea-9402-5e36ba7b8f98.gif)

1. Use materials in JSX files (such as View).
2. Enter part of props in the material tag, it will arouse automatic completion.

## Auto fill React/Rax Code to File

After created a folder or file, automatically create the index.j[t]sx file and complete the code snippet.

![demo](https://img.alicdn.com/imgextra/i4/O1CN01Dv69331TccQVHvwR1_!!6000000002403-1-tps-1446-877.gif)

## More

This Extension power by [AppWorks Team](https://marketplace.visualstudio.com/publishers/iceworks-team), it's part of the AppWorks, see [AppWorks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.
