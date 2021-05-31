# Contributing Guide

Hi! I’m really excited that you are interested in contributing to AppWorks. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

## Develop Guidelines

### Directory

```md
.
├── extensions // VS Code extensions
│   ├── app
├── packages // Common packages, used by multiple extensions
│   ├── constant
│   └── config
└── scripts // Script command execution files
```

### Setup Environment

Clone repo and initialize the setup environment：

```bash
$ git clone git@github.com:appworks-lab/pack.git
$ cd appworks && npm run setup # This will take about 20 minutes

# add dep to some package
$ yarn workspace appworks add <npmName>

# add dep to project
$ yarn add <npmName> -D -W
```

### Develop Packages

```bash
$ npm run packages:watch # Building packages in real time, helpful for develop extension

$ npm run publish:package # or npm run publish-beta:package
```

### Develop Extensions

You can add the VS Code Extension of AppWorks to the directory `extension`.

#### Create a new Extension

Install [Yeoman](http://yeoman.io/) and [VS Code Extension Generator](https://www.npmjs.com/package/generator-code)：

```shell
npm install -g yo generator-code
```

In the `extensions/` Directory, execute `yo code` to initialize the extension

```shell
yo code
```

#### Development and Debugging  

Use the VS Code to develop the extension project. 

Open a new window and set `/extensions/xxx` as workspace, enable extension debugging through `F5`:

```bash
# Take application-manager for example

$ code ./extensions/application-manager
```

> Please see [VS Code Extension](https://code.visualstudio.com/api) for more details.

### Publish Extension

```bash
# Install CLI package
$ npm install -g vsce

$ cd ./extensions/application-manager
$ vsce package 
# iceworks-app.vsix generated

# Test extension
$ code --install-extension ./extensions/application-manager/iceworks-app-x.x.x.vsix

$ vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN 
# <publisherID>.iceworks-app published to VS Code Marketplace
```

#### Auto Publish

- When your PR has been merged into `beta` branch, changed packages and VS Code Extensions will be auto published their beta versions.

  You can download the beta version of extensions from the following link, only the extensions to be published will be in the package:

  https://iceworks.oss-cn-hangzhou.aliyuncs.com/vscode-extensions/beta/AppWorks.zip
- When your PR has been merged into `master` branch, changed packages and VS Code Extensions will be auto published.

#### Personal Access Token

Get a Personal Access Token:

1. From organization's home page(`https://dev.azure.com/iceworksteam`) open the User settings dropdown menu next to your profile image and select **Personal access tokens**: 
    ![](https://img.alicdn.com/imgextra/i4/O1CN01g6uKB51MBPZcyaVc7_!!6000000001396-2-tps-746-429.png_790x10000.jpg)
2. On the Personal Access Tokens page, select New Token to create a new Personal Access Token and set the following details:
    ![](https://img.alicdn.com/imgextra/i4/O1CN01yKsJ7u27siyDzSHYv_!!6000000007853-2-tps-1216-820.png_790x10000.jpg)

    1. Give it a Name
    2. Set Organization to All accessible organizations
    3. Optionally extend its expiration date
    4. Set Scopes to Custom defined and choose the Marketplace > Manage scope
    5. Select Create and you'll be presented with your newly created Personal Access Token. Copy it.

Set Personal Access Token for Github Actions: 

1. Visit [Actions secrets](https://github.com/appworks-lab/pack/settings/secrets/actions)
2. Update `VSCE_TOKEN`:
    ![](https://img.alicdn.com/imgextra/i2/O1CN01NpeNCf2558rTm9812_!!6000000007474-2-tps-2880-1754.png_790x10000.jpg)

## Pull Request Guidelines

- Only code that's ready for release should be committed to the master branch. All development should be done in dedicated branches.
- Checkout a new topic branch from master branch, and merge back against master branch.
- Make sure `npm test` passes.
- If adding new feature:
  - Add accompanying test case.
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.
- If fixing a bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.
- Make sure includes following changes:
  - Update extension or package `version` of package.json
  - Update `CHANGLOG.md` for extensions

## Issue Reporting Guidelines

- The issue list of this repo is **exclusively** for bug reports and feature requests. Non-conforming issues will be closed immediately.
  - For simple beginner questions, you can get quick answers from
  - For more complicated questions, you can use Google or StackOverflow. Make sure to provide enough information when asking your questions - this makes it easier for others to help you!
- Try to search for your issue, it may have already been answered or even fixed in the development branch.
- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Issues with no clear repro steps will not be triaged. If an issue labeled "need repro" receives no further input from the issue author for more than 5 days, it will be closed.
- For bugs that involves build setups, you can create a reproduction repository with steps in the README.
- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

## Git Commit Specific

- Your commits message must follow our [git commit specific](./GIT_COMMIT_SPECIFIC.md).
- We will check your commit message, if it does not conform to the specification, the commit will be automatically refused, make sure you have read the specification above.
- You could use `git cz` with a CLI interface to replace `git commit` command, it will help you to build a proper commit-message, see [commitizen](https://github.com/commitizen/cz-cli).
- It's OK to have multiple small commits as you work on your branch - we will let GitHub automatically squash it before merging.
