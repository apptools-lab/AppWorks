English | [简体中文](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-style-helper/README.zh-CN.md)

# React Style Helper

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-style-helper.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Write styles easier in [JSX](https://reactjs.org/docs/introducing-jsx.html), provide  a powerful auxiliary development functions in style files like CSS, SASS. Friendly for React and [Rax](https://rax.js.org/).

## Usage

### JSX

When editing the 'style' attribute of a component in a JSX file, an automatic completion reminder will be given:

#### Inline style

Automatic completion  for style keys and values according to W3C standards:

![demo](https://user-images.githubusercontent.com/56879942/87412958-3895e700-c5fc-11ea-88e2-3e3e78a07f9e.gif)

##### Variable assignment

When using CSS Module, automatic completion of style fields is carried out according to style declaration:

![demo](https://user-images.githubusercontent.com/56879942/87412953-36cc2380-c5fc-11ea-9315-f153b1415dc8.gif)

### className

Automatic completion, value previews, and defined jumps are given when editing the component's 'className' properties in the JSX file.

#### Automatic completion

According to the class selector in the style file 'import' , automatic completion will be provided when editing ‘className'.

![demo](https://user-images.githubusercontent.com/56879942/87412926-2caa2500-c5fc-11ea-9acc-78974ddb1932.gif)

#### Value preview and define jump

![demo](https://user-images.githubusercontent.com/56879942/87412950-35026000-c5fc-11ea-83ee-33de13681911.gif)

1. Hover over the 'className' value, and the hover board displays the style declaration corresponding to the value.
2. Click the corresponding 'className' value to jump to the definition of the value.

### Classname

When editing the 'class' name of a CSS, LESS or SASS file, an automatic completion reminder will be given:

![demo](https://user-images.githubusercontent.com/56879942/87416514-63366e80-c601-11ea-8f3e-05fe51a8f26b.gif)

1. Declare the value of the component 'className' property in JSX file like ` home, Text0, Text1, text2 `.
2. Reference SASS files in JSX: 'import './index.scss''.
3. step into the 'index.css' file.
4. Enter ' . ' in '  index.css ' to get the auto-completion reminder of the above property values.

### SASS

#### Automatic completion When editing the variable

When a variable is entered in an SASS file, code completion is provided based on the reference file

![demo](https://user-images.githubusercontent.com/56879942/87523081-026a6d00-c6b9-11ea-8e8a-5d62688c020d.gif)  

#### Show the variable value when hover it

![demo](https://user-images.githubusercontent.com/56879942/87412974-3e8bc800-c5fc-11ea-9a6c-ea62eecbfbff.gif)

#### Automatic completion When editing the colors and attributes

When the attribute value is entered, if it is found that variables can be replaced as standard value, variable replacement suggestions will appear:

![demo](https://user-images.githubusercontent.com/56879942/87531943-04d2c400-c6c5-11ea-9f74-be6721353e46.gif)

#### variable identifier and link

Use `cmd + click`  (Windows: `ctrl + click`) jump to the variable identifier under the cursor.

![demo](https://user-images.githubusercontent.com/56879942/87419478-2456e780-c606-11ea-9842-47a01b7e85c8.gif)ß

## More

This Extension power by [Iceworks Team](https://marketplace.visualstudio.com/publishers/iceworks-team), it's part of the Iceworks, see [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) to know more features.
