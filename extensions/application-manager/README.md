English | [简体中文](https://github.com/apptools-lab/appworks/blob/master/extensions/application-manager/README.zh-CN.md)

# Application Manager

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-app.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Preview and manage your application from a framework perspective, Add **NPM scripts** and **Application dependencies** view to **Explorer Panel**, add **Application Manager Panel** to provide **project dashboard** and **engineering capabilities** (debugging and Publishing), friendly for React and [Rax](https://rax.js.org/).

## Application Manager Panel

### Initialize State

After you install the Application Manager, an icon will be added to your activity bar. Click it to enter Application Manager Panel.

The initialization State appears if your current workspace is empty or **isn't React/Rax application**. The initialization panel automatically invokes the create application process, which you can also invoke by clicking the Create Application button on the panel.

![Create a new project](https://img.alicdn.com/imgextra/i1/O1CN01UN3fyV26ionbnonbx_!!6000000007696-2-tps-2048-1536.png)

#### Setting

You can set some configurations when using AppWorks by clicking "Settings" on the sidebar. These configurations only apply to AppWorks related operations.

![Setting](https://img.alicdn.com/imgextra/i1/O1CN0173xn6G1hxbBhqjlGC_!!6000000004344-2-tps-2048-1536.png)

1. Click Settings to enter the Settings page
2. Configure package management tools (default: npm)
3. Configure default image source (default: Taobao image)
4. Set up custom repositories (default: null)

### Quick State

When your workspace is a React or Rax application, the Quick State appears.

![Quick State](https://img.alicdn.com/imgextra/i3/O1CN0157AP9s1kviPGErEkq_!!6000000004746-2-tps-2048-1536.png)

#### Dashboard

The dashboard shows some status of the current application. If your application is in a project cycle, it will also show some information related to the R & D link.

![Dashboard](https://img.alicdn.com/imgextra/i3/O1CN01jScRq91fQVKvDypRI_!!6000000004001-2-tps-2048-1536.png)

**Activate:**

- Open through `Dashboard` in the sidebar quick entries
- Open through `AppWorks: Dashboard` option on the Command Palette

## Explorer Panel

### Actions View

![actions](https://img.alicdn.com/imgextra/i1/O1CN01yMo99V27EQ6rcgXFI_!!6000000007765-2-tps-2880-1754.png)

1. View executable script information in the left pane.
2. Click the `Play` button to execute the script at terminal immediately.
3. Click the `Stop` button to end the corresponding script executed at terminal.

#### Debug

![debug-demo](https://img.alicdn.com/tfs/TB1vCixhP39YK4jSZPcXXXrUFXa-1200-695.gif)

#### Debug in mobile device

![Debug In Mobile Device](https://img.alicdn.com/imgextra/i2/O1CN01xHrOWW1yl5pIYtMJ1_!!6000000006618-1-tps-1024-768.gif)

1. Click the `phone icon` to open the phone debug mode
2. Select different devices for debugging
3. In responsive device, you can edit the device sizes, or drop the device to adjust sizes.

#### Add customize mobile devices

![Add Customize Devices](https://img.alicdn.com/imgextra/i4/O1CN019qlxQR21Mldeemi9g_!!6000000006971-1-tps-1024-768.gif)

1. Select `Edit` from the device options to edit
2. Add a customize device or delete devices
3. Select the custom device for debugging

For more information, please see [Reference Document](https://github.com/apptools-lab/appworks/blob/master/extensions/application-manager/docs/debug.en.md)

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

If you install [AppWorks](https://marketplace.visualstudio.com/items?ItemName=iceworks-team.iceworks), you can activate other extensions in VS Code command palette.

![demo](https://img.alicdn.com/imgextra/i3/O1CN01LeqsBd1xzv2xmpUhE_!!6000000006515-2-tps-2048-1536.png)

1. Find AppWorks in the bottom right of VS Code.
    > NOTE: if you do not find the AppWorks icon, Activate Extension the AppWorks plugin by following the action in 'Activate Extension'.
2. Click the AppWorks plugin icon to enter the AppWorks command palette.

## More

This Extension power by [AppWorks Team](https://marketplace.visualstudio.com/publishers/iceworks-team), it's part of the AppWorks, see [AppWorks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.
