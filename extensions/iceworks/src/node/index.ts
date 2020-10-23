import { activate as uiBuilderActivate } from '@ali/ide-extensions-iceworks-ui-builder';
import { activate as projectActivate } from '@ali/ide-extensions-iceworks-project-creator';

// TODO: 支持独立安装的插件形式
export default class KitNode {
  activate(context) {
    uiBuilderActivate(context);
    projectActivate(context);
  }

  deactivate() {
  }
}
