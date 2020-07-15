English | [简体中文](./README.md)

[![Version](https://vsmarketplacebadge.apphb.com/version/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)

# Iceworks Application Viewer

It helps you preview your Universal Application, including the information of npm scripts, pages, components and node dependencies. It also supports quick installation or upgrade dependencies, adding new pages and components, and much more. 

## Usage

### Activate Extension

### Initialize panel 

After you install the Iceworks-APP plugin, an `Iceworks` icon will be added to your toolbar. Click it to enter Iceworks panel.

![demo](https://user-images.githubusercontent.com/56879942/87553484-8e928980-c6e5-11ea-8183-a6ba7f4eae95.gif)

### Create a new project

When you open an empty folder, you can create projects by Iceworks panel:

![demo](https://user-images.githubusercontent.com/56879942/87407459-c4a41080-c5f4-11ea-882e-d198afc35413.png)

#### Setting

![demo](https://user-images.githubusercontent.com/56879942/87531798-d1903500-c6c4-11ea-9c6d-e19d6241c91a.gif)

1. Click Settings to enter the Settings page
2. Configure package management tools (default: NPM)
3. Configure default image source (default: Taobao image)
4. Set up custom repositories (default: null)

### Iceworks panel

#### View and execute npm Scripts

![demo](https://user-images.githubusercontent.com/56879942/87393980-9f59d700-c5e1-11ea-9e07-0244926f54cc.gif)

1. View executable script information in the left pane.
2. Click the `Play` button to execute the script at terminal immediately.
3. Click the `Stop` button to end the corresponding script executed at terminal.

### Pages and Components

#### Jump into corresponding pages and components

![使用示例](https://user-images.githubusercontent.com/56879942/87393958-9963f600-c5e1-11ea-9c96-94fc10492577.gif)

1. Click items in PAGES and COMPONENTS on the left panel.
2. Jump into files of selected projects.

#### Wake up create pages and generate components( [Create Pages](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-page-builder)｜[Generate Components](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-component-builder) )

![demo](https://user-images.githubusercontent.com/56879942/87393958-9963f600-c5e1-11ea-9c96-94fc10492577.gif)

1. Click `+` in PAGES header to jump into GENERATE PAGES  page.
2. Click `+` in COMPONENTS header to jump into CREATE COMPONENT page.

### Node Dependencies

#### View the application dependency information and install new dependencies

![demo](https://user-images.githubusercontent.com/56879942/87393973-9cf77d00-c5e1-11ea-8baa-96c8c41229cf.gif)

1. View all  installed dependencies in the project in NODE DEPENDENCIES in the bottom of ICE panel.
2. Click `⬆` button next to dependency item,  you can update  the dependency to the latest version.
3. Click `Reinstall Dependencies` button on  NODE DEPENDENCIES header to reinstall all the dependencisce of the project.

#### Install and reinstall dependencies

![demo](https://user-images.githubusercontent.com/56879942/87393970-9bc65000-c5e1-11ea-9724-3bd47c4b21ed.gif)

1. Click the `+` button on the NODE DEPENDENCIES header.
2. Select Install product Dependency or Debug Devdependency on the command panel that appears.
3. Type the NPM package name and version information to be installed, such as' `typescript@latest`.
4. The NPM package will be installed automatically.
   NOTE: If the package was installed, it will be reinstalled.

## Iceworks command palette

If you install [Iceworks suite] (https://marketplace.visualstudio.com/items?ItemName=iceWorks-team.iceWorks), you can activate other extensions in VS Code command palette.

![demo](https://user-images.githubusercontent.com/56879942/87544740-8d5b5f80-c6d9-11ea-85ff-bc31501911e1.gif)

1. Find Iceworks in the bottom right of VS Code.
    > NOTE: if you do not find the Iceworks icon, Activate Extension the Iceworks plugin by following the action in 'Activate Extension'.
2. Click the Iceworks plugin icon to enter the Iceworks command palette.

## More

See the [Iceworks Pack](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.

## License

[MIT](https://github.com/ice-lab/iceworks/blob/master/LICENSE)
