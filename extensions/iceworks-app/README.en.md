English | [简体中文](./README.md)

[![Version](https://vsmarketplacebadge.apphb.com/version/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)

# Iceworks Application Viewer

It helps you preview your Universal Application, including the information of npm scripts, pages, components and node dependencies. It also supports quick installation or upgrade dependencies, adding new pages and components, and much more. 

## Usage

### npm Scripts

#### Support viewing the executable npm scripts of your app

#### Support execute or break off the npm scripts

![demo](https://user-images.githubusercontent.com/56879942/87393980-9f59d700-c5e1-11ea-9e07-0244926f54cc.gif)

1. View executable script information in the left pane.
2. Click the `Play` button to execute the script at terminal immediately.
3. Click the `Stop` button to end the corresponding script executed at terminal.

###  Pages and Components

#### Support jumping to corresponding pages and components

![使用示例](https://user-images.githubusercontent.com/56879942/87393958-9963f600-c5e1-11ea-9c96-94fc10492577.gif)

1. Click items in PAGES and COMPONENTS on the left panel.
2. Jump into files of selected projects.

#### Support waking up create pages and generate components( [Create Pages](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-page-builder)｜[Generate Components](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-component-builder) )

![demo](https://user-images.githubusercontent.com/56879942/87393958-9963f600-c5e1-11ea-9c96-94fc10492577.gif)

1. Click '+' in PAGES header to jump into GENERATE PAGES  page.
2. Click '+' in COMPONENTS header to jump into CREATE COMPONENT page.

### Node Dependencies

####  Support viewing the application dependency information
#### Support installing new dependencies and reinstalling all dependencies

![demo](https://user-images.githubusercontent.com/56879942/87393973-9cf77d00-c5e1-11ea-8baa-96c8c41229cf.gif)

1. View all  installed dependencies in the project in NODE DEPENDENCIES in the bottom of ICE panel.
2. Click ` ⬆` button next to dependency item,  you can update  the dependency to the latest version .
3. Click `Reinstall Dependencies` button on  NODE DEPENDENCIES header to reinstall all the dependencisce of the project.

#### Support installing and reinstalling dependencies

![demo](https://user-images.githubusercontent.com/56879942/87393970-9bc65000-c5e1-11ea-9724-3bd47c4b21ed.gif)

1. Click the `+` button on the NODE DEPENDENCIES header.
2. Select Install product Dependency or Debug Devdependency on the command panel that appears, 
3. Type the NPM package name and version information to be installed, such as'`typescript@latest `.
4. The NPM package will be installed automatically .

   NOTE: If the package was installed, it will be reinstalled.

## More

See the [Iceworks Pack](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.

## License

[MIT](https://github.com/ice-lab/iceworks/blob/master/LICENSE)
