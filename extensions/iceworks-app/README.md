English | [简体中文](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-app/README.zh-CN.md)

# Application Manager

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-app.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Preview and manage your application from a framework perspective, Add **NPM scripts** and **Application dependencies** view to **Explorer Panel**, add **Application Manager Panel** to provide **project dashboard** and **engineering capabilities** (debugging and Publishing), friendly for React and [Rax](https://rax.js.org/).

## Application Manager Panel

### Initialize State

After you install the Application Manager, an icon will be added to your activity bar. Click it to enter Application Manager Panel.

The initialization State appears if your current workspace is empty or **isn't React/Rax application**.

![demo](https://user-images.githubusercontent.com/56879942/87553484-8e928980-c6e5-11ea-8183-a6ba7f4eae95.gif)

#### Create a new project

When you open an empty folder, the initialization panel automatically invokes the create application process, which you can also invoke by clicking the Create Application button on the panel.

![Create a new project](https://img.alicdn.com/imgextra/i1/O1CN01Qv38Zf1a3XNSYSdlA_!!6000000003274-2-tps-2880-1754.png)

#### Setting

You can set some configurations when using Iceworks by clicking "Settings" on the sidebar. These configurations only apply to Iceworks related operations.

![Setting](https://img.alicdn.com/imgextra/i2/O1CN01gyLDzP1hlETaS5I7P_!!6000000004317-2-tps-2880-1754.png)

1. Click Settings to enter the Settings page
2. Configure package management tools (default: npm)
3. Configure default image source (default: Taobao image)
4. Set up custom repositories (default: null)

### Quick State

When your workspace is a React or Rax application, the Quick State appears.

![Quick State](https://img.alicdn.com/imgextra/i2/O1CN01b9N1sA1ncQYXimmpM_!!6000000005110-2-tps-2880-1754.png)

#### Dashboard

The dashboard shows some status of the current application. If your application is in a project cycle, it will also show some information related to the R & D link.

![Dashboard](https://img.alicdn.com/imgextra/i3/O1CN01aQHvhU259ioaT0eRV_!!6000000007484-2-tps-2880-1754.png)

**Activate:**

- Open through `Dashboard` in the sidebar quick entries
- Open through `Iceworks: Dashboard` option on the Command Palette

#### Welcome

Welcome interface provides video tutorial of using Iceworks.

![Welcome](https://img.alicdn.com/imgextra/i2/O1CN01AzViLt28UHRRBxDua_!!6000000007935-2-tps-2880-1754.png)

## Explorer Panel

### Actions View

![actions](https://img.alicdn.com/imgextra/i1/O1CN01yMo99V27EQ6rcgXFI_!!6000000007765-2-tps-2880-1754.png)

1. View executable script information in the left pane.
2. Click the `Play` button to execute the script at terminal immediately.
3. Click the `Stop` button to end the corresponding script executed at terminal.

#### Debug

![debug-demo](https://img.alicdn.com/tfs/TB1vCixhP39YK4jSZPcXXXrUFXa-1200-695.gif)

#### Debug in mobile device

![Debug In Mobile Device](https://img.alicdn.com/imgextra/i4/O1CN012dDmJ81zv00cmWoXn_!!6000000006775-1-tps-1024-768.gif)

1. Click the `phone icon` to open the phone debug mode
2. Select different devices for debugging
3. In responsive device, you can edit the device sizes, or drop the device to adjust sizes.

#### Add customize mobile devices

![Add Customize Devices](https://img.alicdn.com/imgextra/i1/O1CN01OmgfkY1DxCM3s4ONw_!!6000000000282-1-tps-1024-768.gif)

1. Select `Edit` from the device options to edit
2. Add a customize device or delete devices
3. Select the custom device for debugging

For more information, please see [Reference Document](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-app/docs/debug.en.md)

### Node Dependencies

![Node Dependencies](https://img.alicdn.com/imgextra/i1/O1CN01eFzdSS1gqtl3r6MfH_!!6000000004194-2-tps-2880-1754.png)

#### View the application dependency information and install new dependencies

1. View all  installed dependencies in the project in NODE DEPENDENCIES in the bottom of ICE panel.
2. Click `⬆` button next to dependency item,  you can update  the dependency to the latest version.
3. Click `Reinstall Dependencies` button on  NODE DEPENDENCIES header to reinstall all the dependencies of the project.

#### Install and reinstall dependencies

1. Click the `+` button on the NODE DEPENDENCIES header.
2. Select Install product Dependency or Debug DevDependency on the command panel that appears.
3. Type the npm package name and version information to be installed, such as' `typescript@latest`.
4. The npm package will be installed automatically.
   NOTE: If the package was installed, it will be reinstalled.

## Command Panel

If you install [Iceworks](https://marketplace.visualstudio.com/items?ItemName=iceworks-team.iceworks), you can activate other extensions in VS Code command palette.

![demo](https://user-images.githubusercontent.com/56879942/87544740-8d5b5f80-c6d9-11ea-85ff-bc31501911e1.gif)

1. Find Iceworks in the bottom right of VS Code.
    > NOTE: if you do not find the Iceworks icon, Activate Extension the Iceworks plugin by following the action in 'Activate Extension'.
2. Click the Iceworks plugin icon to enter the Iceworks command palette.

## More

This Extension power by [Iceworks Team](https://marketplace.visualstudio.com/publishers/iceworks-team), it's part of the Iceworks, see [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.
