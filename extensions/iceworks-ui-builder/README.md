English | [简体中文](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-ui-builder/README.zh-CN.md)

# UI Designer

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-ui-builder.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-ui-builder.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-ui-builder.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Build UI by low-code way.

## Generate Component

Generate components in a visual way.

### Activate

Activate vscode command palette by `⇧⌘P` (MacOS) or `Ctrl+Shift+p` (Windows), and input `Iceworks: Generate Component` to activate the extension.

### Usage

1. Drag the components in the left to the middle panel.
2. Press `⌘+S` (MacOS) or `Ctrl+S` (Windows), input the name of the component and then press Enter to generate component.

![generate-component](https://img.alicdn.com/tfs/TB179prilFR4u4jSZFPXXanzFXa-1440-900.gif)

## Generate Page

Through GUI, you can quickly assemble pages with materials.

### Activate

1. Open vscode command palette  by `Ctrl+Shift+P` or `⇧⌘P` .
2. In the command palette, type `Iceworks: Generate page` and click on the selected item or press enter on the keyboard to evoke page-builder extension.

### Usage

1. Select the block to be used for the page from the block list on the right, click to add it to the page preview area on the left.
2. Rearrange blocks by dragging and dropping the order of the blocks in the left page preview area, or delete blocks by clicking icons in the upper right corner.
3. Click `Generate page` button to generate page code. Input the page name and the router path and then click `ok` button. The page code will be generated into 'src /pages/'

![generate-page](https://img.alicdn.com/tfs/TB1ErOEjnM11u4jSZPxXXahcXXa-1440-900.gif)

## Create Page

Create the page by visual configuration

### Activate

![demo](https://user-images.githubusercontent.com/56879942/91519113-4a211d00-e924-11ea-8fbe-36170dedc765.gif)

1. Open vscode command palette  by `Ctrl+Shift+P` or `⇧⌘P` .
2. In the command palette, type `Iceworks: Create page` and click on the selected item or press enter on the keyboard to evoke page-builder extension.

### Usage

![demo](https://user-images.githubusercontent.com/56879942/91536884-03451e80-e948-11ea-98e6-6bf89b62e932.gif)

1. Select a page template.
2. Click `NEXT` to enter the configuration page.
3. Configure page templates to generate a customized page.
4. Click the `CREATE PAGE` button to add the page information.
5. Enter the name of the page and route information.
6. Click `OK` button to generate page code, which will be generated under 'SRC/Pages/' directory.

## Create Component

Provides a huge amount of high quality materials for React and [Rax](https://rax.js.org/) apps. You can select materials to create components.

### Activate

1. Through (Ctrl+Shift+P or ⇧⌘P) evoke vscode command palette
2. In the vscode command palette, enter 'Iceworks: Create component', click the selected item or press enter to arouse the plugin;

### Usage

1. Fill in the component name (also the folder name of the componenent)
2. Select a material below.
3. Click `Create component` button to generate component code.

![create-component](https://img.alicdn.com/tfs/TB1_UQvfiDsXe8jSZR0XXXK6FXa-1440-900.gif)

## Debug materials

Iceworks provides local debugging capabilities for materials.

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