import { activate as uiBuilderActivate, deactivate as uiBuilderDeactivate } from '@ali/ide-extensions-iceworks-ui-builder';
import { activate as projectActivate, deactivate as projectDeactivate } from '@ali/ide-extensions-iceworks-project-creator';

// TODO: 支持独立安装的插件形式
export default class KitNode {
  activate(context) {
    uiBuilderDeactivate(context);
    projectActivate(context);
  }
  deactivate(context) {
  }
}
