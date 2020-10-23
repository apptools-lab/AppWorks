import { IDEKit } from '@ali/kit-runner';
import { activate as uiBuilderActivate, deactivate as uiBuilderDeactivate } from '@ali/ide-extensions-iceworks-ui-builder';
import { activate as projectActivate, deactivate as projectDeactivate } from '@ali/ide-extensions-iceworks-project-creator';

// TODO: 可选打包成单文件
export default class KitNode extends IDEKit.IKitNodeBase {
  activate(context) {
    uiBuilderDeactivate(context);
    projectActivate(context);
  }
  deactivate(context) {
  }
}