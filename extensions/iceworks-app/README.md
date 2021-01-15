English | [简体中文](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-app/README.zh-CN.md)

# Application Explorer

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-app.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Preview and manage your application from a framework perspective, including npm scripts, pages, components and dependencies, friendly for React and [Rax](https://rax.js.org/).

## Usage

### Initialize panel

After you install the Application Explorer, an icon will be added to your activity bar. Click it to enter Application Explorer panel.

The initialization panel appears if your current workspace is empty or **isn't React/Rax application**.

![demo](https://user-images.githubusercontent.com/56879942/87553484-8e928980-c6e5-11ea-8183-a6ba7f4eae95.gif)

#### Create a new project

When you open an empty folder, the initialization panel automatically invokes the create application process, which you can also invoke by clicking the Create Application button on the panel.

![demo](https://user-images.githubusercontent.com/56879942/87407459-c4a41080-c5f4-11ea-882e-d198afc35413.png)

#### Setting

![demo](https://user-images.githubusercontent.com/56879942/87531798-d1903500-c6c4-11ea-9c6d-e19d6241c91a.gif)

1. Click Settings to enter the Settings page
2. Configure package management tools (default: npm)
3. Configure default image source (default: Taobao image)
4. Set up custom repositories (default: null)

### Application Explorer Panel

When your workspace is a React or Rax application, the Application Explorer Panel appears.

#### View and execute npm Scripts

![demo](https://user-images.githubusercontent.com/56879942/87393980-9f59d700-c5e1-11ea-9e07-0244926f54cc.gif)

1. View executable script information in the left pane.
2. Click the `Play` button to execute the script at terminal immediately.
3. Click the `Stop` button to end the corresponding script executed at terminal.

#### Pages and Components

#### Jump into corresponding pages and components

![demo](https://user-images.githubusercontent.com/56879942/87393958-9963f600-c5e1-11ea-9c96-94fc10492577.gif)

1. Click items in PAGES and COMPONENTS on the left panel.
2. Jump into files of selected projects.

#### Activate Generate Page and Create Component(See [UI Designer](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder))

![demo](https://user-images.githubusercontent.com/56879942/87393958-9963f600-c5e1-11ea-9c96-94fc10492577.gif)

1. Click `+` in PAGES header to jump into GENERATE PAGE page.
2. Click `+` in COMPONENTS header to jump into CREATE COMPONENT page.

#### Node Dependencies

##### View the application dependency information and install new dependencies

![demo](https://user-images.githubusercontent.com/56879942/87393973-9cf77d00-c5e1-11ea-8baa-96c8c41229cf.gif)

1. View all  installed dependencies in the project in NODE DEPENDENCIES in the bottom of ICE panel.
2. Click `⬆` button next to dependency item,  you can update  the dependency to the latest version.
3. Click `Reinstall Dependencies` button on  NODE DEPENDENCIES header to reinstall all the dependencies of the project.

##### Install and reinstall dependencies

![demo](https://user-images.githubusercontent.com/56879942/87393970-9bc65000-c5e1-11ea-9724-3bd47c4b21ed.gif)

1. Click the `+` button on the NODE DEPENDENCIES header.
2. Select Install product Dependency or Debug DevDependency on the command panel that appears.
3. Type the npm package name and version information to be installed, such as' `typescript@latest`.
4. The npm package will be installed automatically.
   NOTE: If the package was installed, it will be reinstalled.

### Command Palette

If you install [Iceworks](https://marketplace.visualstudio.com/items?ItemName=iceworks-team.iceworks), you can activate other extensions in VS Code command palette.

![demo](https://user-images.githubusercontent.com/56879942/87544740-8d5b5f80-c6d9-11ea-85ff-bc31501911e1.gif)

1. Find Iceworks in the bottom right of VS Code.
    > NOTE: if you do not find the Iceworks icon, Activate Extension the Iceworks plugin by following the action in 'Activate Extension'.
2. Click the Iceworks plugin icon to enter the Iceworks command palette.

### Dashboard

![demo](https://img.alicdn.com/imgextra/i4/O1CN01zCZrfi293Xvs3fPPH_!!6000000008012-2-tps-2048-1538.png)

**Activate:**

- Open through `Dashboard` in the sidebar quick entries
- Open through `Iceworks: Dashboard` option on the Command Palette

### Debug

![debug-demo](https://img.alicdn.com/tfs/TB1vCixhP39YK4jSZPcXXXrUFXa-1200-695.gif)

For more information, please see [Reference Document](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-app/docs/debug.en.md)

## More

This Extension power by [Iceworks Team](https://marketplace.visualstudio.com/publishers/iceworks-team), it's part of the Iceworks, see [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.
