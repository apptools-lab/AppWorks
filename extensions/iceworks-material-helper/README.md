English | [简体中文](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-material-helper/README.zh-CN.md)

# Component Helper

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-material-helper.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Use Component and Write Props easier, friendly for React/Vue/[Rax](https://rax.js.org/).

## Pages and Components

![demo](https://img.alicdn.com/imgextra/i3/O1CN01UnlYme22ks5npf5u2_!!6000000007159-2-tps-2880-1754.png)

### Jump into corresponding pages and components

1. Click items in PAGES and COMPONENTS on the left panel.
2. Jump into files of selected projects.

### Activate Generate Page and Create Component

1. Click `+` in PAGES header to jump into GENERATE PAGE page.
2. Click `+` in COMPONENTS header to jump into CREATE COMPONENT page.

## Using Material Panel

### Activate

![demo](https://user-images.githubusercontent.com/56879942/88197902-b2ba1180-cc75-11ea-8e33-0ce4e7faa368.gif)

1. Open VS Code command palette through `Ctrl+Shift+P` or `⇧⌘P`.
2. Enter `Iceworks: Import Component` to activate Material Panel.

### Use in Pages

![demo](https://user-images.githubusercontent.com/56879942/88197928-b8aff280-cc75-11ea-816d-1c609bc90878.gif)

1. Click src/pages/*/index.tsx in the resource panel to open a page.
2. Activate the Material Panel.
3. Move cursor to a position for materials.
4. Search the block materials, click the material to be used, and the material code will be automatically added to the corresponding position.
5. Search for component materials. Click the material to be used, and the material code will be automatically added to the corresponding position.

### Use in Components

![demo](https://user-images.githubusercontent.com/56879942/87619875-c2a29480-c74f-11ea-945e-788a32e65881.gif)

1. Click src/components/*/index.tsx in the resource panel to open a page.
2. Activate the material-import extension.
3. Move cursor to a position for materials.
4. Search for component materials. Click the material to be used, and the material code will be automatically added to the corresponding position.

## Generate Page by Blocks

Through GUI, you can quickly assemble pages with materials.

### Activate

1. Open vscode command palette  by `Ctrl+Shift+P` or `⇧⌘P` .
2. In the command palette, type `Iceworks: Generate Page by Blocks` and click on the selected item or press enter on the keyboard to evoke page-builder extension.

### Usage

1. Select the block to be used for the page from the block list on the right, click to add it to the page preview area on the left.
2. Rearrange blocks by dragging and dropping the order of the blocks in the left page preview area, or delete blocks by clicking icons in the upper right corner.
3. Click `Generate page` button to generate page code. Input the page name and the router path and then click `ok` button. The page code will be generated into 'src /pages/'

![generate-page](https://img.alicdn.com/tfs/TB1ErOEjnM11u4jSZPxXXahcXXa-1440-900.gif)

## Generate Page by Configuration

### Activate

![demo](https://user-images.githubusercontent.com/56879942/91519113-4a211d00-e924-11ea-8fbe-36170dedc765.gif)

1. Open vscode command palette  by `Ctrl+Shift+P` or `⇧⌘P` .
2. In the command palette, type `Iceworks: Generate Page by Configuration` and click on the selected item or press enter on the keyboard to evoke page-builder extension.

### Usage

![demo](https://user-images.githubusercontent.com/56879942/91536884-03451e80-e948-11ea-98e6-6bf89b62e932.gif)

1. Select a page template.
2. Click `NEXT` to enter the configuration page.
3. Configure page templates to generate a customized page.
4. Click the `CREATE PAGE` button to add the page information.
5. Enter the name of the page and route information.
6. Click `OK` button to generate page code, which will be generated under 'SRC/Pages/' directory.

## Download Component Materials

Provides a huge amount of high quality materials for React、Vue and [Rax](https://rax.js.org/) apps. You can select materials to create components.

### Activate

1. Through (Ctrl+Shift+P or ⇧⌘P) evoke vscode command palette
2. In the vscode command palette, enter `Iceworks: Download Component Materials`, click the selected item or press enter to arouse the plugin;

### Usage

1. Fill in the component name (also the folder name of the componenent)
2. Select a material below.
3. Click `Create component` button to generate component code.

![create-component](https://img.alicdn.com/tfs/TB1_UQvfiDsXe8jSZR0XXXK6FXa-1440-900.gif)

## Component Document Support

### Active

![demo](https://user-images.githubusercontent.com/56879942/90105043-d275be80-dd77-11ea-9723-0ce16206c134.gif)

1. Open vscode command palette  through `Ctrl+Shift+P` or `⇧⌘P`.
2. Enter `Iceworks: Find Component` to activate.

Or Active In Editor

![demo](https://user-images.githubusercontent.com/56879942/90105027-cc7fdd80-dd77-11ea-89f8-48b2a8d566eb.gif)

1. Right Clikc In a Jsx File Editor.
2. Choose `Iceworks: Find Components In Current File`.

### Usage

![demo](https://user-images.githubusercontent.com/56879942/90105051-d570af00-dd77-11ea-86b6-b460fa6cf430.gif)

1. Search the component label for the document you need to find
2. Click the item that appears after activation
3. Confirm to open component document link

Or

![demo](https://user-images.githubusercontent.com/56879942/90107055-dbb45a80-dd7a-11ea-98eb-6fa6ecf3acc8.gif)

1. Move the mouse over the component label.
2. Click the document link.
3. Confirm to open component document link

#### Document Opening Mode

![demo](https://user-images.githubusercontent.com/56879942/90105064-d86b9f80-dd77-11ea-999e-d93974b9e6c5.gif)

You can choose whether to open the document link in VS Code, which depends on the extension [Browser Preview](https://marketplace.visualstudio.com/items?itemName=auchenberg.vscode-browser-preview). If you want to open the document page in VS Code, install Browser Preview first.

## Props Autocomplete

When editing the props of a component in a JSX file, an automatic completion reminder will be given:

![demo](https://user-images.githubusercontent.com/56879942/87399599-2dd25680-c5ea-11ea-9402-5e36ba7b8f98.gif)

1. Use materials in JSX files (such as View).
2. Enter part of props in the material tag, it will arouse automatic completion.

## Auto fill React/Rax Code to File

After created a folder or file, automatically create the index.j[t]sx file and complete the code snippet.

![demo](https://img.alicdn.com/imgextra/i2/O1CN01wge0kr25ZMzp40FSY_!!6000000007540-1-tps-1446-906.gif)

## Debug Materials Project

Iceworks provides local debugging capabilities for materials project.

### Activate

![activate](https://user-images.githubusercontent.com/56879942/95042198-bb19d880-070b-11eb-95fd-bfc778c55a5f.gif)

1. Open vscode command palette  by `Ctrl+Shift+P` or `⇧⌘P` .
2. In the command palette, type `Iceworks: Debug Materials in Program` and click on the selected item or press enter on the keyboard to evoke page-builder extension.

### Usage

#### Debug local material projects

![debug-local-mateirlas](https://user-images.githubusercontent.com/56879942/95042207-bead5f80-070b-11eb-8828-28d3adc2b137.gif)

1. Select `Add a debug material source`;
2. Select the material project folder to be debugged, and click `Debug Materials`;
3. Use material functions, such as `Generate Page by Configuration`, select local material source for debugging.

#### Clear debug material sources

![clear-debug-material-sources](https://user-images.githubusercontent.com/56879942/95042184-afc6ad00-070b-11eb-98be-21c65f292c40.gif)

1. Select `Clear Debug Material Sources`；
2. All debug material sources will be removed。

## More

This Extension power by [Iceworks Team](https://marketplace.visualstudio.com/publishers/iceworks-team), it's part of the Iceworks, see [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.
